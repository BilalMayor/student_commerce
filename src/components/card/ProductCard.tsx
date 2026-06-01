'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { Star, Store, Heart, BadgeCheck, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { cartApi } from '@/lib/api/cart'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuth } from '@/lib/hooks/useAuth'
import { toast } from '@/lib/hooks/useToast'
import { resolveImageUrl } from '@/lib/utils/image'

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
  const [imgLoaded, setImgLoaded] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
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
    <div className="group relative bg-white border border-[#d5c3b8] rounded-2xl overflow-hidden hover:shadow-[0_10px_30px_-10px_rgba(44,26,14,0.08)] transition-all duration-300 flex flex-col h-full">
      <Link href={`/product/${id}`} className="block flex-1 flex flex-col">
        <div className="relative h-64 overflow-hidden bg-[#f6f3ee]">
          {imageUrl ? (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 bg-[#d5c3b8]/30 animate-pulse" />
              )}
              <Image
                src={resolveImageUrl(imageUrl)}
                alt={name}
                fill
                className={`object-cover group-hover:scale-110 transition-transform duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                sizes="(max-width: 768px) 50vw, 25vw"
                onLoad={() => setImgLoaded(true)}
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-[#f0ede9] text-5xl select-none group-hover:scale-110 transition-transform duration-500">
              🛍️
            </div>
          )}
          
          <span className={`absolute top-3 right-3 font-bold text-[10px] px-2 py-1 rounded shadow-sm z-10 ${isDigital ? 'bg-[#ffd9ae] text-[#795e3b]' : 'bg-white/90 backdrop-blur-md text-[#7f5531]'}`}>
            {isDigital ? 'DIGITAL' : 'PHYSICAL'}
          </span>

          {rating && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-[11px] font-bold text-[#1c1c19] shadow-sm z-10">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              {rating.toFixed(1)}
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-1">
          {sellerName && (
            <div className="flex items-center gap-1 mb-2">
              <BadgeCheck size={12} className="text-[#7f5531]" />
              <span className="text-xs text-[#50443c] truncate">{sellerName}</span>
            </div>
          )}
          <h3 className="text-lg font-semibold mb-1 line-clamp-2 text-[#1c1c19] group-hover:text-[#7f5531] transition-colors">
            {name}
          </h3>
          <p className="text-[#7f5531] font-bold text-xl mb-4 mt-auto">
            {formatCurrency(price)}
          </p>
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="w-full py-2 bg-[#ebe8e3] text-[#1c1c19] font-bold rounded-lg hover:bg-[#7f5531] hover:text-white transition-colors disabled:opacity-50"
          >
            {addingToCart ? '...' : 'Tambah ke Keranjang'}
          </button>
        </div>
      </Link>
      {/* Wishlist Button (Optional overlay) */}
      <button
        onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted) }}
        className="absolute top-3 left-auto right-14 z-10 rounded-full w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-sm hover:scale-110 transition-all active:scale-90"
        aria-label={wishlisted ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
      >
        <Heart
          size={15}
          className={wishlisted ? 'fill-[#ba1a1a] text-[#ba1a1a]' : 'text-[#83746a]'}
        />
      </button>
    </div>
  )
}
