'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/card/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import HeroSection from '@/components/section/HeroSection'
import CategorySection from '@/components/section/CategorySection'
import { productsApi } from '@/lib/api/products'
import { Product } from '@/types'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store/authStore'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    productsApi
      .getAll({ sort: 'latest' })
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-0 pb-6 sm:pb-8">
      {!isAuthenticated && <HeroSection />}

      <CategorySection />

      <section className="mx-auto max-w-[1280px] px-6 sm:px-10 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1c1c19]">
            Produk Terbaru
          </h2>
          {!loading && !error && products.length > 0 && (
            <span className="text-sm font-semibold text-[#50443c] bg-[#ebe8e3] px-4 py-1.5 rounded-full">
              {products.length} produk
            </span>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <EmptyState title="Gagal memuat" description={error} />
        )}

        {!loading && !error && products.length === 0 && (
          <EmptyState title="Belum ada produk" description="Cek lagi nanti ya!" />
        )}

        {!loading && products.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
          >
            {products.map((p) => (
              <motion.div key={p.id} variants={item}>
                <ProductCard {...p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  )
}
