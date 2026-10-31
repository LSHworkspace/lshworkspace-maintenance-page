import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const htmlPath = path.resolve(__dirname, '../dist/index.html')
const html = fs.readFileSync(htmlPath, 'utf-8')

const invalidPatterns = [
  { label: 'external script source', pattern: /<script\b[^>]*\bsrc=/i },
  { label: 'external stylesheet link', pattern: /<link\b[^>]*\brel=["']stylesheet["']/i },
  { label: 'external CSS import', pattern: /@import\s+(?:url\()?\s*["']?https?:\/\//i },
  { label: 'external CSS URL', pattern: /url\(\s*["']?https?:\/\//i },
  { label: 'external media source', pattern: /<(?:img|source|video|audio|iframe)\b[^>]*(?:src|srcset)=["']https?:\/\//i },
]

const violations = invalidPatterns
  .filter(({ pattern }) => pattern.test(html))
  .map(({ label }) => label)

if (!/<style>[^]*<\/style>/i.test(html)) {
  violations.push('missing inline stylesheet')
}

if (!/<script type="module">[^]*<\/script>/i.test(html)) {
  violations.push('missing inline module script')
}

if (violations.length > 0) {
  throw new Error(`Inline HTML validation failed: ${violations.join(', ')}`)
}

console.log(`Validated self-contained HTML (${Buffer.byteLength(html)} bytes).`)
