'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react'
import NeoButton from '@/components/ui/NeoButton'
import { cartApi } from '@/lib/api/cart'
import { useCartStore } from '@/lib/store/cartStore'
import { CartItem } from '@/types'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { resolveImageUrl } from '@/lib/utils/image'
import { NeoSkeleton } from '@/components/ui/NeoSkeleton'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartPage() {
  const storeItems = useCartStore((s) => s.items)
  const [items, setItems] = useState<CartItem[]>(storeItems)
  const [loading, setLoading] = useState(storeItems.length === 0)
  const setStoreItems = useCartStore((s) => s.setItems)

  const fetchCart = () => {
    cartApi.getCart()
      .then((data) => {
        if (data && data.length > 0) { setItems(data); setStoreItems(data) }
        else { setItems([]); setStoreItems([]) }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCart() }, [])

  const handleRemove = async (productId: string) => {
    if (!productId) { toast.error('ID produk tidak valid'); return }
    setItems(items.filter((i) => i.productId !== productId))
    setStoreItems(items.filter((i) => i.productId !== productId))
    try { await cartApi.removeItem(productId); toast.success('Dihapus!'); fetchCart() }
    catch { fetchCart(); toast.error('Gagal menghapus') }
  }

  const handleUpdate = async (productId: string, quantity: number) => {
    if (quantity < 1) return
    try { await cartApi.updateItem(productId, quantity); fetchCart() }
    catch { toast.error('Gagal mengubah jumlah') }
  }

  const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-10 py-8 space-y-4">
        <NeoSkeleton className="h-8 w-48" />
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-3">
            {[1, 2].map((i) => <NeoSkeleton key={i} className="h-28 w-full" />)}
          </div>
          <NeoSkeleton className="lg:w-80 h-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-10 py-8 pb-24 md:pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 border-b-[3px] border-[#0A0A0A] pb-4">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0A0A0A] uppercase tracking-tight">
          Keranjang
        </h1>
        {items.length > 0 && (
          <span className="px-3 py-1 bg-[#FFE135] border-2 border-[#0A0A0A] text-xs font-mono font-bold">{items.length}</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] bg-[#FFF5D6] p-16 text-center">
          <ShoppingCart size={64} className="mx-auto mb-4 text-[#B0A090]" strokeWidth={1.5} />
          <p className="font-display font-extrabold text-2xl uppercase mb-2">Keranjang Kosong!</p>
          <p className="text-[#B0A090] mb-6 font-medium">Ayo belanja sesuatu, jangan cuma lihat-lihat.</p>
          <Link href="/search">
            <NeoButton variant="yellow" size="lg">Jelajahi Produk →</NeoButton>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row items-start">
          {/* Items list */}
          <div className="flex-1 space-y-3 w-full">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-4 bg-white border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] p-4"
                >
                  {/* Product image */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden border-2 border-[#0A0A0A] bg-[#FFF5D6]">
                    {item.product?.imageUrl ? (
                      <Image src={resolveImageUrl(item.product.imageUrl)} alt={item.product.name || ''} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-3xl">🛍️</div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/product/${item.productId}`} className="font-bold text-sm text-[#0A0A0A] hover:text-[#FF6B2B] transition-colors line-clamp-2">
                        {item.product?.name}
                      </Link>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="p-1.5 border-2 border-transparent hover:border-[#FF1744] hover:bg-[#FF1744]/10 text-[#B0A090] hover:text-[#FF1744] transition-all shrink-0"
                        aria-label="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex items-end justify-between gap-2 mt-2">
                      <p className="font-mono font-bold text-lg text-[#FF6B2B]">
                        {formatCurrency((item.product?.price || 0) * item.quantity)}
                      </p>
                      {/* Qty selector */}
                      <div className="flex items-center border-2 border-[#0A0A0A]">
                        <button
                          onClick={() => handleUpdate(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-3 py-1.5 bg-[#FFFBF0] hover:bg-[#FFE135] border-r-2 border-[#0A0A0A] transition-colors disabled:opacity-30 font-bold"
                        >
                          <Minus size={12} strokeWidth={3} />
                        </button>
                        <span className="px-4 py-1.5 text-xs font-mono font-bold text-[#0A0A0A] bg-white min-w-[2.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdate(item.productId, item.quantity + 1)}
                          className="px-3 py-1.5 bg-[#FFFBF0] hover:bg-[#FFE135] border-l-2 border-[#0A0A0A] transition-colors font-bold"
                        >
                          <Plus size={12} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:w-80 w-full shrink-0">
            <div className="bg-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#B0A090] text-white lg:sticky lg:top-24">
              <div className="p-5 border-b-2 border-[#B0A090]/30">
                <h2 className="font-display font-bold uppercase tracking-widest text-[#FFE135] text-sm">Ringkasan</h2>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between text-sm font-medium text-[#B0A090]">
                  <span>Subtotal ({items.length} produk)</span>
                  <span className="font-mono text-white">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-[#B0A090]">
                  <span>Ongkos Kirim</span>
                  <span className="text-[#00C853] font-bold">GRATIS</span>
                </div>
                <div className="border-t-2 border-[#B0A090]/30 pt-3 flex justify-between font-bold text-[#FFE135]">
                  <span className="uppercase tracking-wide text-sm">Total</span>
                  <span className="font-mono text-lg">{formatCurrency(total)}</span>
                </div>
                <Link href="/checkout" className="block pt-2">
                  <NeoButton variant="yellow" size="lg" fullWidth>Checkout →</NeoButton>
                </Link>
                <Link href="/search" className="flex items-center justify-center gap-1 text-xs text-[#B0A090] hover:text-[#FFE135] transition-colors py-1">
                  <ArrowLeft size={12} /> Lanjut Belanja
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
