'use client'

import { useEffect, useState, use } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart, MessageSquare, Plus, Minus, ArrowLeft, ShieldCheck } from 'lucide-react'
import { productsApi } from '@/lib/api/products'
import { reviewsApi } from '@/lib/api/reviews'
import { cartApi } from '@/lib/api/cart'
import { Product, Review } from '@/types'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import ReviewCard from '@/components/card/ReviewCard'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { resolveImageUrl } from '@/lib/utils/image'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuth } from '@/lib/hooks/useAuth'
import { toast } from '@/lib/hooks/useToast'
import { Skeleton } from '@/components/ui/Skeleton'
import { motion } from 'framer-motion'

export default function ProductDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise)
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const productId = params.id
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitReviewLoading, setSubmitReviewLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [cartLoading, setCartLoading] = useState(false)

  const fetchCart = () => {
    cartApi.getCart().then(useCartStore.getState().setItems).catch(() => {})
  }

  useEffect(() => {
    productsApi.getById(productId)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))

    reviewsApi.getByProduct(productId)
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false))
  }, [productId])

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    setCartLoading(true)
    try {
      await cartApi.addItem(productId, quantity)
      fetchCart()
      toast.success('Produk ditambahkan ke keranjang!')
    } catch (e: any) {
      toast.error(e.message || 'Gagal menambahkan ke keranjang')
    } finally {
      setCartLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    setSubmitReviewLoading(true)
    try {
      const newReview = await reviewsApi.create({ productId, rating, comment })
      setReviews((prev) => [newReview, ...prev])
      setComment('')
      setRating(5)
      toast.success('Ulasan berhasil dikirim!')
    } catch (e: any) {
      toast.error(e.message || 'Gagal mengirim ulasan')
    } finally {
      setSubmitReviewLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 max-w-md mx-auto w-full">
            <Skeleton className="aspect-square rounded-[2rem] w-full" />
          </div>
          <div className="flex-1 space-y-6">
            <Skeleton className="h-8 w-3/4 rounded-xl" />
            <Skeleton className="h-6 w-1/3 rounded-lg" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 sm:px-6 py-20">
        <EmptyState title="Produk tidak ditemukan" description="Produk mungkin sudah dihapus." actionLabel="Kembali" actionHref="/" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12 pb-24 md:pb-10">
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-muted font-bold text-xs hover:text-primary transition-colors bg-border/20 px-4 py-2.5 rounded-full"
        >
          <ArrowLeft size={13} />
          Kembali
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-8 lg:flex-row items-start"
      >
        {/* Image */}
        <div className="flex-1 max-w-md w-full mx-auto">
          <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-accent/5 border-2 border-border/70 shadow-soft">
            {product.imageUrl ? (
              <Image src={resolveImageUrl(product.imageUrl)} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
            ) : (
              <div className="flex h-full items-center justify-center text-7xl select-none">🛍️</div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-6 w-full">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink leading-tight tracking-tight">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted">
              {product.rating && (
                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2.5 py-1 rounded-full border border-amber-500/10">
                  <Star size={13} className="fill-amber-500 text-amber-500" />
                  <span className="font-bold text-ink">{product.rating.toFixed(1)}</span>
                  <span>({reviews.length})</span>
                </div>
              )}
              {product.sellerName && (
                <div className="flex items-center gap-1.5 bg-accent/15 text-ink/80 px-2.5 py-1 rounded-full border border-accent/20">
                  <span className="font-semibold">{product.sellerName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-surface/50 p-5 sm:p-6 border-2 border-border/60 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted/70">Harga Khusus Pelajar</p>
            <p className="text-2xl sm:text-3xl font-black text-primary">{formatCurrency(product.price)}</p>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-bold text-sm text-ink uppercase tracking-wider">Deskripsi</h3>
            <p className="leading-relaxed text-sm text-muted whitespace-pre-line bg-white rounded-3xl border border-border/50 p-4 sm:p-5">
              {product.description}
            </p>
          </div>

          <div className="border-t border-border/60 pt-5 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-ink">Jumlah</span>
              <div className="flex items-center rounded-2xl border-2 border-border/80 bg-white overflow-hidden shadow-soft">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3.5 sm:px-4 py-2.5 hover:bg-border/20 text-ink font-bold transition-colors">
                  <Minus size={13} className="stroke-[3]" />
                </button>
                <span className="min-w-[36px] text-center font-extrabold text-ink text-sm">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(product.stock < 0 ? 999 : product.stock, q + 1))} className="px-3.5 sm:px-4 py-2.5 hover:bg-border/20 text-ink font-bold transition-colors">
                  <Plus size={13} className="stroke-[3]" />
                </button>
              </div>
              <span className="text-[11px] font-bold text-muted bg-border/20 px-3 py-1 rounded-full">{product.stock < 0 ? 'Stok tidak terbatas' : `Stok: ${product.stock}`}</span>
            </div>

            <div className="flex gap-3 pt-1">
              <Button onClick={handleAddToCart} loading={cartLoading} className="flex-1 flex items-center justify-center gap-2 rounded-2xl shadow-soft" size="lg">
                <ShoppingCart size={18} />
                Tambah ke Keranjang
              </Button>
              {product.sellerId && (
                <Link href={`/chat?userId=${product.sellerId}`} className="flex shrink-0">
                  <Button type="button" variant="secondary" className="flex items-center justify-center gap-2 rounded-2xl border-2 border-border/80 bg-white hover:border-primary hover:bg-surface/50 active:scale-[0.98] transition-all px-5" size="lg">
                    <MessageSquare size={18} className="text-primary" />
                    <span className="text-ink font-bold">Tanya</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reviews */}
      <div className="border-t border-border/60 pt-8 sm:pt-10 space-y-6 sm:space-y-8">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <MessageSquare size={20} className="text-primary" />
          Ulasan & Penilaian
        </h2>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-soft border border-border/70 h-fit space-y-4">
            <h3 className="font-bold text-base">Tulis Ulasan</h3>
            {isAuthenticated ? (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Beri Bintang</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star size={24} className={star <= rating ? 'fill-amber-400' : 'text-border'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Ulasan Anda</label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tulis pengalaman Anda..."
                    className="w-full rounded-2xl border-2 border-border/80 px-4 py-3 outline-none focus:border-primary transition-colors text-sm text-ink placeholder:text-muted/50 resize-none"
                    required
                  />
                </div>
                <Button type="submit" fullWidth loading={submitReviewLoading} size="sm">
                  Kirim Ulasan
                </Button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-sm text-muted">Silakan masuk untuk menulis ulasan.</p>
                <Link href="/login">
                  <Button variant="secondary" size="sm">Masuk Akun</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {reviewsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-border/50" />
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-10 bg-surface/50 rounded-2xl border border-dashed border-border/70 text-muted text-sm">
                Belum ada ulasan. Jadilah yang pertama!
              </div>
            ) : (
              reviews.map((rev) => (
                <ReviewCard key={rev.id} review={rev} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
