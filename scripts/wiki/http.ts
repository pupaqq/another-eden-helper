/**
 * game-info.wiki: 多くは EUC-JP。meta と実バイトが食い違うページがあるため
 * UTF-8 / EUC-JP 両方でデコードし、日本語として自然な方を採用する。
 * 502 等はリトライする。
 */
import iconv from 'iconv-lite'

const UA =
  'another-eden-helper/0.1 (wiki snapshot; https://github.com/pupaqq/another-eden-helper)'

const RETRY_STATUSES = new Set([429, 502, 503, 504])
const MAX_ATTEMPTS = 6
const BASE_DELAY_MS = 2000

function backoffMs(attempt: number): number {
  return BASE_DELAY_MS * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 800)
}

/** 日本語 HTML らしさ（� が少なく、仮名・漢字が多いほど高い） */
function scoreJapaneseHtml(text: string): number {
  let score = 0
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i)
    if (c === 0xfffd) {
      score -= 500
      continue
    }
    if (c < 0x20 && c !== 0x0a && c !== 0x0d && c !== 0x09) score -= 5
    if (c >= 0x3040 && c <= 0x30ff) score += 3
    if (c >= 0x4e00 && c <= 0x9fff) score += 2
    if (c >= 0xff61 && c <= 0xff9f) score += 2
    if (c >= 0x3400 && c <= 0x4dbf) score += 1
  }
  return score
}

/**
 * UTF-8 と EUC-JP のどちらで読むかをスコアで決める。
 */
export function decodeHtmlBytesBest(buf: Buffer): string {
  if (buf.length === 0) return ''

  const asUtf8 = buf.toString('utf-8')
  const asEuc = iconv.decode(buf, 'euc-jp')

  const sUtf = scoreJapaneseHtml(asUtf8)
  const sEuc = scoreJapaneseHtml(asEuc)

  if (sUtf > sEuc + 50) return asUtf8
  if (sEuc > sUtf + 50) return asEuc

  return sEuc >= sUtf ? asEuc : asUtf8
}

async function fetchOnce(url: string): Promise<Response> {
  return fetch(url, {
    headers: {
      'User-Agent': UA,
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Encoding': 'identity',
    },
  })
}

export async function fetchHtmlEucJp(url: string): Promise<string> {
  let lastRetryError: Error | null = null

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let res: Response
    try {
      res = await fetchOnce(url)
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      lastRetryError = err
      if (attempt === MAX_ATTEMPTS) throw err
      const w = backoffMs(attempt)
      console.warn(`  ネットワーク再試行 ${attempt}/${MAX_ATTEMPTS} (${w}ms) ${err.message}`)
      await new Promise((r) => setTimeout(r, w))
      continue
    }

    if (RETRY_STATUSES.has(res.status)) {
      lastRetryError = new Error(`GET ${url} -> HTTP ${res.status}`)
      if (attempt === MAX_ATTEMPTS) throw lastRetryError
      const w = backoffMs(attempt)
      console.warn(`  HTTP 再試行 ${attempt}/${MAX_ATTEMPTS} (${res.status}, ${w}ms)`)
      await new Promise((r) => setTimeout(r, w))
      continue
    }

    if (!res.ok) {
      throw new Error(`GET ${url} -> HTTP ${res.status}`)
    }

    const buf = Buffer.from(await res.arrayBuffer())
    return decodeHtmlBytesBest(buf)
  }

  throw lastRetryError ?? new Error(`GET ${url} failed`)
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}
