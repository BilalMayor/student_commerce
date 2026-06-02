'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { Star, Heart } from 'lucide-react'
import { useState } from 'react'
import { cartApi } from '@/lib/api/cart'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuth } from '@/lib/hooks/useAuth'
import { toast } from 'sonner'
import { resolveImageUrl } from '@/lib/utils/image'
import { motion } from 'framer-motion'

interface ProductCardProps {
  id: string
  name: string
  price: number
  imageUrl?: string
  sellerName?: string
  rating?: number
  reviewCount?: number
  isDigital?: boolean
}

export default function ProductCard({ id, name, price, imageUrl, sellerName, rating, reviewCount, isDigital = false }: ProductCardProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [wishlisted, setWishlisted] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isAuthenticated) { router.push('/login'); return }
    setAddingToCart(true)
    try {
      await cartApi.addItem(id, 1)
      const data = await cartApi.getCart()
      useCartStore.getState().setItems(data)
      toast.success('Ditambahkan ke keranjang!')
    } catch (err: any) {
      toast.error(err.message || 'Gagal menambahkan')
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '8px 8px 0px #0A0A0A' }}
      transition={{ duration: 0.1 }}
      className="relative bg-[#FFF5D6] border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] flex flex-col h-full overflow-hidden"
    >
      {/* Wishlist button */}
      <button
        onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted) }}
        className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#FF3CAC] hover:text-white transition-colors"
        aria-label="Wishlist"
      >
        <Heart size={14} className={wishlisted ? 'fill-[#FF3CAC] text-[#FF3CAC]' : ''} />
      </button>

      <Link href={`/product/${id}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-[#FFFBF0] border-b-2 border-[#0A0A0A]">
          {imageUrl ? (
            <Image
              src={resolveImageUrl(imageUrl)}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl select-none">🛍️</div>
          )}
          {/* Digital/Physical badge */}
          <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border-2 border-[#0A0A0A] ${isDigital ? 'bg-[#FF3CAC] text-white' : 'bg-[#FFE135] text-[#0A0A0A]'}`}>
            {isDigital ? 'Digital' : 'Fisik'}
          </span>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1 gap-2">
          {sellerName && (
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#B0A090] truncate">{sellerName}</p>
          )}
          <h3 className="text-sm font-bold text-[#0A0A0A] line-clamp-2 leading-snug">{name}</h3>

          {rating !== undefined && (
            <div className="flex items-center gap-1">
              <Star size={11} className="fill-[#FFE135] text-[#FFE135]" />
              <span className="text-xs font-bold text-[#0A0A0A]">{rating.toFixed(1)}</span>
              {reviewCount !== undefined && (
                <span className="text-xs text-[#B0A090]">({reviewCount})</span>
              )}
            </div>
          )}

          <p className="font-mono font-bold text-xl text-[#FF6B2B] mt-auto">{formatCurrency(price)}</p>
        </div>
      </Link>

      {/* Add to cart */}
      <button
        onClick={handleAddToCart}
        disabled={addingToCart}
        className="w-full py-2.5 bg-[#0A0A0A] text-[#FFE135] text-xs font-bold uppercase tracking-widest border-t-2 border-[#0A0A0A] hover:bg-[#FF6B2B] hover:text-white transition-colors disabled:opacity-50"
      >
        {addingToCart ? '...' : '+ Keranjang'}
      </button>
    </motion.div>
  )
}
