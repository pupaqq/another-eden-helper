/**
 * game-info.wiki からキャラ一覧を取得し JSON に保存する。
 *
 *   npx tsx scripts/wiki/fetchCharacterIndex.ts
 *   npx tsx scripts/wiki/fetchCharacterIndex.ts --raw   # 個別ページ HTML も raw に保存
 *   $env:WIKI_FETCH_LIMIT=5; npx tsx scripts/wiki/fetchCharacterIndex.ts --raw
 */
import { createHash } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { fetchHtmlEucJp, sleep } from './http.ts'
import { parseCharacterListTable } from './parseCharacterList.ts'
import { DATA_WIKI, RAW_DIR, ensureDataDirs, writeJson } from './paths.ts'

const LIST_URLS = [
  {
    id: 'star5',
    label: '★5キャラ一覧',
    url: 'https://anothereden.game-info.wiki/d/%a1%f95%a5%ad%a5%e3%a5%e9%b0%ec%cd%f7',
  },
  {
    id: 'star4',
    label: '★4キャラ一覧',
    url: 'https://anothereden.game-info.wiki/d/%a1%f94%a5%ad%a5%e3%a5%e9%b0%ec%cd%f7',
  },
] as const

function slugFromUrl(pageUrl: string): string {
  return createHash('sha256').update(pageUrl).digest('hex').slice(0, 24)
}

function parseArgs() {
  const raw = process.argv.includes('--raw')
  const limitEnv = process.env.WIKI_FETCH_LIMIT
  const limit =
    limitEnv && /^\d+$/.test(limitEnv) ? Math.max(0, parseInt(limitEnv, 10)) : 0
  return { raw, limit }
}

async function main() {
  const { raw, limit } = parseArgs()
  await ensureDataDirs()

  const fetchedAt = new Date().toISOString()
  const lists: {
    id: string
    label: string
    url: string
    entries: ReturnType<typeof parseCharacterListTable>
  }[] = []

  for (const list of LIST_URLS) {
    console.log(`一覧取得: ${list.label}`)
    const html = await fetchHtmlEucJp(list.url)
    const entries = parseCharacterListTable(html)
    console.log(`  -> ${entries.length} 件`)
    lists.push({ ...list, entries })
    await sleep(1500)
  }

  const merged = new Map<string, (typeof lists)[0]['entries'][0] & { listIds: string[] }>()
  for (const list of lists) {
    for (const e of list.entries) {
      const cur = merged.get(e.pageUrl)
      if (cur) {
        cur.listIds.push(list.id)
      } else {
        merged.set(e.pageUrl, { ...e, listIds: [list.id] })
      }
    }
  }

  const allEntries = [...merged.values()].sort((a, b) =>
    a.name.localeCompare(b.name, 'ja'),
  )

  const indexPayload = {
    fetchedAt,
    sources: LIST_URLS.map((l) => ({ id: l.id, label: l.label, url: l.url })),
    totalUnique: allEntries.length,
    characters: allEntries,
  }

  const indexPath = join(DATA_WIKI, 'character-index.json')
  await writeJson(indexPath, indexPayload)
  console.log(`保存: ${indexPath}`)

  if (!raw) {
    console.log('個別ページ未取得（--raw で HTML を data/wiki/raw/characters に保存）')
    return
  }

  let toFetch = allEntries
  if (limit > 0) {
    toFetch = allEntries.slice(0, limit)
    console.log(`WIKI_FETCH_LIMIT=${limit} 件のみ raw 取得`)
  }

  const meta: {
    pageUrl: string
    name: string
    rawFile: string
    fetchedAt: string
  }[] = []

  for (let i = 0; i < toFetch.length; i++) {
    const e = toFetch[i]!
    const slug = slugFromUrl(e.pageUrl)
    const filePath = join(RAW_DIR, `${slug}.html`)
    console.log(`[${i + 1}/${toFetch.length}] ${e.name}`)
    const pageHtml = await fetchHtmlEucJp(e.pageUrl)
    await writeFile(filePath, pageHtml, 'utf-8')
    meta.push({
      pageUrl: e.pageUrl,
      name: e.name,
      rawFile: `data/wiki/raw/characters/${slug}.html`,
      fetchedAt: new Date().toISOString(),
    })
    await sleep(1500)
  }

  await writeJson(join(DATA_WIKI, 'character-raw-manifest.json'), {
    fetchedAt: new Date().toISOString(),
    count: meta.length,
    pages: meta,
  })
  console.log(`raw 保存完了: ${meta.length} 件 (${RAW_DIR})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
