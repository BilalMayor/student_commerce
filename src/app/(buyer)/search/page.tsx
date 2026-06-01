'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/card/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import FilterSidebar from '@/components/filter/FilterSidebar'
import SearchBar from '@/components/search/SearchBar'
import { productsApi, ProductsFilter } from '@/lib/api/products'
import { Product } from '@/types'
import { Skeleton } from '@/components/ui/Skeleton'
import { motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'

function SearchContent() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ProductsFilter>({ query: q, sort: 'latest' })
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    productsApi
      .getAll({ ...filter, query: q })
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [q, filter])

  const hasActiveFilter = filter.minPrice || filter.maxPrice || filter.minRating

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 md:py-10 space-y-5 sm:space-y-6 md:space-y-8">
      <div className="max-w-xl">
        <SearchBar defaultValue={q} />
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        {/* Desktop Filter */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <FilterSidebar onFilter={(f) => setFilter((prev) => ({ ...prev, ...f }))} />
        </div>

        <div className="flex-1 w-full space-y-4 sm:space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <p className="text-sm font-semibold text-muted">
                {q ? (
                  <>
                    Hasil untuk &ldquo;<span className="text-ink font-bold">{q}</span>&rdquo;
                  </>
                ) : (
                  'Semua produk'
                )}
              </p>
              {!loading && (
                <span className="text-xs font-semibold text-muted bg-border/40 px-2.5 py-1 rounded-full">
                  {products.length}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="md:hidden flex items-center gap-1.5 rounded-2xl border-2 border-border/80 bg-white px-3.5 py-2 text-xs font-bold text-ink hover:border-primary transition-all"
              >
                <SlidersHorizontal size={14} />
                Filter
                {hasActiveFilter && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>

              <select
                className="rounded-2xl border-2 border-border/80 bg-white px-3.5 py-2 text-xs font-bold text-ink transition-all outline-none focus:border-primary cursor-pointer shadow-soft"
                value={filter.sort}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    sort: e.target.value as ProductsFilter['sort'],
                  }))
                }
              >
                <option value="latest">Terbaru</option>
                <option value="cheapest">Termurah</option>
                <option value="popular">Terpopuler</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="relative">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="absolute top-3 right-3 rounded-full p-1 hover:bg-border/30 text-muted"
                >
                  <X size={16} />
                </button>
                <FilterSidebar onFilter={(f) => { setFilter((prev) => ({ ...prev, ...f })); setMobileFilterOpen(false) }} />
              </div>
            </motion.div>
          )}

          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <EmptyState
              title="Produk tidak ditemukan"
              description="Coba masukkan kata kunci yang berbeda atau hapus filter"
            />
          )}

          {!loading && products.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
            >
              {products.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <ProductCard {...p} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10 space-y-8">
          <Skeleton className="h-12 sm:h-14 w-full sm:w-2/3 rounded-2xl" />
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="h-72 w-full md:w-64 rounded-3xl" />
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
