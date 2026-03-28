/**
 * Seesaa Wiki (anothereden.game-info.wiki) は EUC-JP で返すため UTF-8 に変換する。
 */
import iconv from 'iconv-lite'

const UA =
  'another-eden-helper/0.1 (wiki snapshot; https://github.com/pupaqq/another-eden-helper)'

export async function fetchHtmlEucJp(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      Accept: 'text/html,application/xhtml+xml',
    },
  })
  if (!res.ok) {
    throw new Error(`GET ${url} -> HTTP ${res.status}`)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  return iconv.decode(buf, 'euc-jp')
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}
