'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductCard from '@/components/card/ProductCard'
import { NeoProductCardSkeleton } from '@/components/ui/NeoSkeleton'
import FilterSidebar from '@/components/filter/FilterSidebar'
import { productsApi, ProductsFilter } from '@/lib/api/products'
import { Product } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { cardContainer, cardItem } from '@/lib/animations'

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const q = searchParams.get('q') || ''
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ProductsFilter>({ query: q, sort: 'latest' })
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(q)

  useEffect(() => {
    setLoading(true)
    productsApi.getAll({ ...filter, query: q }).then(setProducts).finally(() => setLoading(false))
  }, [q, filter])

  const hasActiveFilter = filter.minPrice || filter.maxPrice || filter.minRating

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-10 py-8 pb-24 md:pb-8">
      {/* Search bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); if (searchInput.trim()) router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`) }}
        className="flex mb-8 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] focus-within:shadow-[6px_6px_0px_#0A0A0A] transition-all"
      >
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Cari produk..."
          className="flex-1 px-5 py-4 bg-white text-sm font-medium text-[#0A0A0A] placeholder:text-[#B0A090] outline-none"
        />
        <button type="submit" className="px-6 bg-[#FFE135] border-l-2 border-[#0A0A0A] font-bold uppercase text-xs tracking-wider hover:bg-[#FF6B2B] hover:text-white transition-colors flex items-center gap-2">
          <Search size={16} /> Cari
        </button>
      </form>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] bg-[#FFF5D6]">
          <div className="p-4 border-b-2 border-[#0A0A0A] bg-[#0A0A0A]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFE135]">Filter</h3>
          </div>
          <div className="p-4">
            <FilterSidebar onFilter={(f) => setFilter((prev) => ({ ...prev, ...f }))} />
          </div>
        </div>

        <div className="flex-1 w-full space-y-5">
          {/* Controls bar */}
          <div className="flex items-center justify-between gap-3 border-b-2 border-[#0A0A0A] pb-4">
            <div className="flex items-center gap-3">
              <p className="text-sm font-bold text-[#0A0A0A]">
                {q ? <>Hasil: <span className="text-[#FF6B2B]">"{q}"</span></> : 'Semua produk'}
              </p>
              {!loading && (
                <span className="px-2 py-0.5 bg-[#FFE135] border-2 border-[#0A0A0A] text-xs font-mono font-bold">{products.length}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="md:hidden flex items-center gap-1.5 px-3 py-2 border-2 border-[#0A0A0A] bg-white text-xs font-bold uppercase hover:bg-[#FFE135] transition-colors"
              >
                <SlidersHorizontal size={14} />
                Filter {hasActiveFilter && <span className="w-2 h-2 bg-[#FF6B2B]" />}
              </button>
              <select
                className="border-2 border-[#0A0A0A] bg-white px-3 py-2 text-xs font-bold uppercase outline-none cursor-pointer hover:bg-[#FFE135] transition-colors"
                value={filter.sort}
                onChange={(e) => setFilter((prev) => ({ ...prev, sort: e.target.value as ProductsFilter['sort'] }))}
              >
                <option value="latest">Terbaru</option>
                <option value="cheapest">Termurah</option>
                <option value="popular">Terpopuler</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {mobileFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-2 border-[#0A0A0A] bg-[#FFF5D6] overflow-hidden"
              >
                <div className="flex items-center justify-between p-3 border-b-2 border-[#0A0A0A] bg-[#0A0A0A]">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FFE135]">Filter</span>
                  <button onClick={() => setMobileFilterOpen(false)} className="text-[#FFE135]"><X size={16} /></button>
                </div>
                <div className="p-4">
                  <FilterSidebar onFilter={(f) => { setFilter((prev) => ({ ...prev, ...f })); setMobileFilterOpen(false) }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <NeoProductCardSkeleton key={i} />)}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] bg-[#FFF5D6] p-12 text-center">
              <p className="font-display font-extrabold text-4xl mb-2">🔍</p>
              <p className="font-bold text-lg uppercase tracking-wide">Produk Tidak Ditemukan</p>
              <p className="text-[#B0A090] text-sm mt-1">Coba kata kunci berbeda atau hapus filter.</p>
            </div>
          )}

          {!loading && products.length > 0 && (
            <motion.div
              variants={cardContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {products.map((p) => (
                <motion.div key={p.id} variants={cardItem}>
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
    <Suspense fallback={
      <div className="mx-auto max-w-[1280px] px-4 py-8">
        <div className="h-14 w-full border-2 border-[#0A0A0A] bg-[#FFF5D6] animate-pulse mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <NeoProductCardSkeleton key={i} />)}
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
