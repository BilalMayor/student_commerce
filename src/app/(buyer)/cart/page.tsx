'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { cartApi } from '@/lib/api/cart'
import { useCartStore } from '@/lib/store/cartStore'
import { CartItem } from '@/types'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { resolveImageUrl } from '@/lib/utils/image'
import { Skeleton } from '@/components/ui/Skeleton'
import { toast } from '@/lib/hooks/useToast'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartPage() {
  const storeItems = useCartStore((s) => s.items)
  const [items, setItems] = useState<CartItem[]>(storeItems)
  const [loading, setLoading] = useState(storeItems.length === 0)
  const setStoreItems = useCartStore((s) => s.setItems)

  const fetchCart = () => {
    cartApi
      .getCart()
      .then((data) => {
        if (data && data.length > 0) {
          setItems(data)
          setStoreItems(data)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const handleRemove = async (productId: string) => {
    try {
      await cartApi.removeItem(productId)
      toast.success('Produk berhasil dihapus!')
      fetchCart()
    } catch (_) {
      toast.error('Gagal menghapus produk')
    }
  }

  const handleUpdate = async (productId: string, quantity: number) => {
    if (quantity < 1) return
    try {
      await cartApi.updateItem(productId, quantity)
      fetchCart()
    } catch (_) {
      toast.error('Gagal mengubah jumlah')
    }
  }

  const total = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  )

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        <Skeleton className="h-8 w-44 rounded-xl" />
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-[1.75rem]" />
            ))}
          </div>
          <div className="lg:w-80">
            <Skeleton className="h-56 w-full rounded-[1.75rem]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 pb-24 md:pb-10">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
          Keranjang Belanja
        </h1>
        {items.length > 0 && (
          <span className="text-xs font-bold text-muted bg-border/40 px-3 py-1.5 rounded-full">
            {items.length} {items.length > 1 ? 'produk' : 'produk'}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Keranjang masih kosong"
          description="Yuk mulai belanja kebutuhan pelajarmu!"
          actionLabel="Jelajahi Produk"
          actionHref="/search"
          icon={<ShoppingCart size={36} className="text-muted/40" />}
        />
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row items-start">
          <div className="flex-1 space-y-3 sm:space-y-4 w-full">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-3 sm:gap-4 rounded-[1.75rem] border border-border/70 bg-white p-3.5 sm:p-4.5 shadow-soft hover:shadow-md transition-all duration-200"
                >
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-accent/5 border border-border/60">
                    {item.product?.imageUrl ? (
                      <Image
                        src={resolveImageUrl(item.product.imageUrl)}
                        alt={item.product.name || ''}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-3xl select-none">
                        🛍️
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.productId}`}
                        className="font-bold text-sm text-ink leading-snug hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.product?.name}
                      </Link>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="text-muted/50 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-all shrink-0 active:scale-90"
                        aria-label="Hapus produk"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-2 mt-1">
                      <p className="font-black text-primary text-sm sm:text-base">
                        {formatCurrency(
                          (item.product?.price || 0) * item.quantity
                        )}
                      </p>

                      <div className="flex items-center rounded-xl border-2 border-border/80 bg-white overflow-hidden shadow-soft">
                        <button
                          onClick={() =>
                            handleUpdate(item.productId, item.quantity - 1)
                          }
                          className="px-2.5 py-1.5 hover:bg-border/30 text-ink font-bold transition-all disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={11} className="stroke-[3]" />
                        </button>
                        <span className="min-w-[26px] text-center text-xs font-black text-ink">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdate(item.productId, item.quantity + 1)
                          }
                          className="px-2.5 py-1.5 hover:bg-border/30 text-ink font-bold transition-all"
                        >
                          <Plus size={11} className="stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Sticky Summary - Desktop */}
          <div className="lg:w-80 w-full shrink-0">
            <div className="rounded-[2rem] border-2 border-border/70 bg-white p-5 sm:p-6 shadow-soft lg:sticky lg:top-24 space-y-5">
              <h2 className="text-base sm:text-lg font-bold text-ink tracking-tight border-b border-border/50 pb-3">
                Ringkasan Pesanan
              </h2>

              <div className="space-y-3 text-sm font-semibold text-muted">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} produk)</span>
                  <span className="text-ink">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimasi Pengiriman</span>
                  <span className="text-emerald-600 font-bold">Gratis Ongkir</span>
                </div>
              </div>

              <div className="border-t border-border/60 pt-4 flex items-center justify-between font-black text-ink">
                <span>Total Belanja</span>
                <span className="text-primary text-lg">{formatCurrency(total)}</span>
              </div>

              <Link href="/checkout" className="block">
                <Button fullWidth size="lg">
                  Lanjut ke Checkout
                </Button>
              </Link>

              <div className="text-center">
                <Link
                  href="/search"
                  className="inline-flex items-center gap-1 text-xs font-bold text-muted hover:text-primary transition-colors"
                >
                  <ArrowLeft size={12} />
                  Lanjut Belanja
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
