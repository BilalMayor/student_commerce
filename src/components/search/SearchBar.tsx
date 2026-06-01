'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SearchBar({
  placeholder = 'Cari produk...',
  defaultValue = ''
}: {
  placeholder?: string
  defaultValue?: string
}) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultValue)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-2 rounded-2xl border-2 border-white/30 bg-white/95 pl-4 pr-2 py-2 transition-all focus-within:border-white focus-within:ring-4 focus-within:ring-white/20 w-full shadow-soft backdrop-blur-sm"
    >
      <Search size={18} className="text-muted/50 flex-shrink-0" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-sm text-ink placeholder:text-muted/40 font-medium"
      />
      <button
        type="submit"
        className="rounded-xl bg-primary px-4 py-2 text-white text-xs font-bold hover:bg-primary-dark transition-colors active:scale-95 shrink-0"
      >
        Cari
      </button>
    </form>
  )
}
