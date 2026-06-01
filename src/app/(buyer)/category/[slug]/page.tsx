'use client'

import { useEffect, useState, use } from 'react'
import { categoriesApi } from '@/lib/api/categories'
import { productsApi } from '@/lib/api/products'
import { Category, Product } from '@/types'
import ProductGrid from '@/components/section/ProductGrid'
import EmptyState from '@/components/ui/EmptyState'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CategoryProductsPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = use(paramsPromise)
  const slug = params.slug
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    categoriesApi.getBySlug(slug)
      .then((cat) => {
        setCategory(cat)
        return productsApi.getAll({ categoryId: cat.id })
      })
      .then(setProducts)
      .catch(() => { setCategory(null); setProducts([]) })
      .finally(() => setLoading(false))
  }, [slug])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 pb-24 md:pb-10">
      <div>
        <Link href="/" className="inline-flex items-center gap-2 text-muted font-bold text-xs hover:text-primary transition-colors bg-border/20 px-4 py-2.5 rounded-full">
          <ArrowLeft size={13} /> Kembali
        </Link>
      </div>

      {!loading && !category ? (
        <EmptyState title="Kategori tidak ditemukan" description="Kategori tidak tersedia." actionLabel="Kembali" actionHref="/" />
      ) : (
        <>
          <div className="border-b border-border/50 pb-5">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
              Kategori: {category?.name || 'Memuat...'}
            </h1>
            <p className="text-muted text-sm mt-1">Menampilkan produk dalam kategori {category?.name}</p>
          </div>

          {loading && category && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-3xl bg-white border border-border/80 shadow-soft overflow-hidden">
                  <div className="aspect-square bg-border/30 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-border/30 rounded-lg animate-pulse w-3/4" />
                    <div className="h-5 bg-border/30 rounded-lg animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && category && (
            <ProductGrid products={products} loading={false} />
          )}
        </>
      )}
    </div>
  )
}
