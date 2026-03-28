/**
 * game-info.wiki は多くが EUC-JP だが、ページによって UTF-8 のものがある。
 * Content-Type / meta から charset を推定してデコードする。
 */
import iconv from 'iconv-lite'

const UA =
  'another-eden-helper/0.1 (wiki snapshot; https://github.com/pupaqq/another-eden-helper)'

function normalizeCharset(raw: string): string | null {
  const n = raw.trim().toLowerCase().replace(/_/g, '-')
  if (n === 'utf8' || n === 'utf-8') return 'utf-8'
  if (n === 'euc-jp' || n === 'eucjp' || n === 'x-euc-jp') return 'euc-jp'
  if (
    n === 'shift_jis' ||
    n === 'shift-jis' ||
    n === 'sjis' ||
    n === 'windows-31j' ||
    n === 'cp932'
  ) {
    return 'shift_jis'
  }
  return null
}

/** HTTP ヘッダと HTML 先頭から charset を推定。分からなければ euc-jp（本 Wiki のデフォルト） */
function detectCharset(buf: Buffer, contentType: string | null): string {
  const fromHeader = contentType?.match(/charset\s*=\s*["']?([^"'\s;]+)/i)
  if (fromHeader) {
    const c = normalizeCharset(fromHeader[1]!)
    if (c) return c
  }

  const head = buf.subarray(0, Math.min(buf.length, 24576)).toString('latin1')

  const metaUtf = head.match(
    /<meta\s+charset\s*=\s*["']?\s*([^"'\s/>]+)/i,
  )
  if (metaUtf) {
    const c = normalizeCharset(metaUtf[1]!)
    if (c) return c
  }

  const metaCt = head.match(
    /<meta\s[^>]*http-equiv\s*=\s*["']?content-type["']?[^>]*content\s*=\s*["']([^"']+)["']/i,
  )
  if (metaCt) {
    const inner = metaCt[1]!.match(/charset\s*=\s*([^"'\s;]+)/i)
    if (inner) {
      const c = normalizeCharset(inner[1]!)
      if (c) return c
    }
  }

  return 'euc-jp'
}

function decodeBuffer(buf: Buffer, encoding: string): string {
  if (encoding === 'utf-8') {
    return buf.toString('utf-8')
  }
  return iconv.decode(buf, encoding)
}

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
  const ct = res.headers.get('content-type')
  const enc = detectCharset(buf, ct)
  return decodeBuffer(buf, enc)
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}
