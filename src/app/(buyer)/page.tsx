'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/card/ProductCard'
import { NeoProductCardSkeleton } from '@/components/ui/NeoSkeleton'
import HeroSection from '@/components/section/HeroSection'
import CategorySection from '@/components/section/CategorySection'
import { productsApi } from '@/lib/api/products'
import { Product } from '@/types'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store/authStore'
import { cardContainer, cardItem } from '@/lib/animations'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    productsApi.getAll({ sort: 'latest' }).then(setProducts).catch((e) => setError(e.message)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="pb-20 md:pb-0">
      {!isAuthenticated && <HeroSection />}

      <CategorySection />

      <section className="mx-auto max-w-[1280px] px-4 sm:px-10 py-12">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-8 border-b-[3px] border-[#0A0A0A] pb-4">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0A0A0A] uppercase tracking-tight">
            Produk Terbaru
          </h2>
          {!loading && !error && (
            <span className="px-3 py-1 bg-[#FFE135] border-2 border-[#0A0A0A] text-xs font-bold font-mono">
              {products.length}
            </span>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <NeoProductCardSkeleton key={i} />)}
          </div>
        )}

        {!loading && error && (
          <div className="border-2 border-[#FF1744] bg-[#FF1744]/10 p-8 text-center">
            <p className="font-bold text-[#FF1744] text-lg uppercase">Gagal Memuat</p>
            <p className="text-sm text-[#0A0A0A] mt-2">{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] bg-[#FFF5D6] p-12 text-center">
            <p className="font-display font-extrabold text-4xl mb-2">📭</p>
            <p className="font-bold text-lg uppercase tracking-wide">Belum Ada Produk</p>
            <p className="text-[#B0A090] text-sm mt-1">Cek lagi nanti ya!</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <motion.div
            variants={cardContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          >
            {products.map((p) => (
              <motion.div key={p.id} variants={cardItem}>
                <ProductCard {...p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  )
}
