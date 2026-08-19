// Lightweight sanitizer to avoid bundling ESM external packages during Next.js build.
// This is not as comprehensive as `sanitize-html` but covers the project's needs
// (strip <script>/<iframe>, remove event attributes, allow Cloudinary img src).

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return ''

  let s = dirty

  // Remove script and iframe blocks
  s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  s = s.replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')

  // Remove javascript: in href/src
  s = s.replace(/(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, '')

  // Remove event handler attributes like onclick, onmouseover
  s = s.replace(/\son[a-zA-Z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')

  // Validate img src: remove img tags whose src is not Cloudinary or http(s)
  s = s.replace(/<img\b[^>]*>/gi, (tag) => {
    const m = tag.match(/src\s*=\s*(["'])(.*?)\1/i)
    if (!m) return ''
    const src = m[2].trim()
    if (src.startsWith('https://res.cloudinary.com/') || /^https?:\/\//i.test(src)) {
      return tag.replace(/on[a-zA-Z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    }
    return ''
  })

  return s
}
