import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
export const PROJECT_ROOT = join(__dirname, '..', '..')
export const DATA_WIKI = join(PROJECT_ROOT, 'data', 'wiki')
export const RAW_DIR = join(DATA_WIKI, 'raw', 'characters')

export async function ensureDataDirs(): Promise<void> {
  await mkdir(RAW_DIR, { recursive: true })
}

export async function writeJson(path: string, data: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, JSON.stringify(data, null, 2), 'utf-8')
}
