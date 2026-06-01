const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://uklsm4-production.up.railway.app'

export function resolveImageUrl(url?: string | null): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/')) return `${BASE_URL}${url}`
  return url
}
