import ProductCard from '../card/ProductCard'
import { ProductCardSkeleton } from '../ui/Skeleton'
import EmptyState from '../ui/EmptyState'
import { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  loading: boolean
  title?: string
}

export default function ProductGrid({ products, loading, title }: ProductGridProps) {
  return (
    <div className="space-y-5 sm:space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-ink">{title}</h2>
          {!loading && products.length > 0 && (
            <span className="text-xs font-semibold text-muted bg-border/30 px-3 py-1 rounded-full">
              {products.length} produk
            </span>
          )}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="Produk tidak ditemukan"
          description="Maaf, saat ini produk belum tersedia."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  )
}
