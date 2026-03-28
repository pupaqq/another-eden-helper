import * as cheerio from 'cheerio'

export type CharacterListEntry = {
  /** 一覧に表示されている名前 */
  name: string
  /** 個別ページのフル URL */
  pageUrl: string
  /** 一覧の小さい正方形アイコン */
  listIconUrl: string | null
}

/**
 * ★4/★5 キャラ一覧など、先頭列がキャラリンクの sort テーブルを想定。
 */
export function parseCharacterListTable(html: string): CharacterListEntry[] {
  const $ = cheerio.load(html)
  const table = $('table.sort.ae-filter').first()
  if (!table.length) {
    throw new Error('table.sort.ae-filter が見つかりません')
  }

  const seen = new Set<string>()
  const out: CharacterListEntry[] = []

  table.find('tbody tr').each((_, tr) => {
    const $tr = $(tr)
    const $td0 = $tr.find('td').first()
    const $a = $td0.find('a[href*="/d/"]').first()
    const href = $a.attr('href')?.trim()
    if (!href?.startsWith('http')) return

    if (seen.has(href)) return
    seen.add(href)

    const img = $td0.find('img').first().attr('src') ?? null
    const name = $a
      .text()
      .replace(/\s+/g, ' ')
      .trim()
    if (!name) return

    out.push({
      name,
      pageUrl: href,
      listIconUrl: img,
    })
  })

  return out
}
