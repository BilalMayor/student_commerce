'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { categoriesApi } from '@/lib/api/categories'
import { Category } from '@/types'
import { Skeleton } from '../ui/Skeleton'
import { ArrowRight } from 'lucide-react'

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    categoriesApi.getAll()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }, [])

  const defaultIcons: Record<string, string> = {
    jasa: '🛠️',
    barang: '📦',
    kos: '🏠',
    buku: '📚',
    event: '🎟️',
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-5 w-36" />
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-28 flex-shrink-0 rounded-full" />
          ))}
        </div>
      </div>
    )
  }

  if (categories.length === 0) return null

  return (
    <section className="py-12 bg-[#f6f3ee] -mx-4 sm:-mx-6 px-4 sm:px-6 mt-12 mb-12">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1c1c19]">Telusuri Kategori</h2>
          <button className="text-[#7f5531] font-bold flex items-center gap-1 hover:underline text-sm sm:text-base">
            Lihat Semua <ArrowRight size={16} />
          </button>
        </div>
        <div className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar pb-4">
          {categories.map((category) => {
            const icon = category.iconUrl || defaultIcons[category.slug] || '🛍️'
            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="flex-shrink-0 group cursor-pointer"
              >
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white border border-[#d5c3b8] flex flex-col items-center justify-center gap-3 group-hover:border-[#7f5531] group-hover:shadow-md transition-all">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#ffdcc2] flex items-center justify-center text-[#7f5531] text-lg sm:text-xl">
                    {icon}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#50443c] group-hover:text-[#7f5531] text-center px-2 line-clamp-1">{category.name}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
