'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ordersApi } from '@/lib/api/orders'
import { Order } from '@/types'
import Badge from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { formatDate } from '@/lib/utils/formatDate'
import { Skeleton } from '@/components/ui/Skeleton'
import { ArrowLeft, ShoppingBag, User, MapPin, CreditCard } from 'lucide-react'

export default function AdminOrderDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise)
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ordersApi.getById(params.id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [params.id])

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return 'warning' as const
      case 'PROCESSING': return 'info' as const
      case 'SHIPPED': return 'primary' as const
      case 'DELIVERED': return 'success' as const
      case 'CANCELLED': return 'danger' as const
      default: return 'secondary' as const
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-[#83746a]">Pesanan tidak ditemukan.</p>
        <Link href="/admin/orders" className="text-[#7f5531] font-bold hover:underline mt-4 inline-block">
          Kembali ke daftar pesanan
        </Link>
      </div>
    )
  }

  const itemsTotal = order.items?.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/orders" className="inline-flex items-center gap-2 text-[#50443c] font-bold text-xs hover:text-[#7f5531] transition-colors bg-[#ebe8e3] px-4 py-2.5 rounded-full">
          <ArrowLeft size={13} /> Kembali ke Semua Pesanan
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1c19]">
            Pesanan #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-[#83746a] mt-1">{formatDate(order.createdAt)}</p>
        </div>
        <Badge variant={getStatusVariant(order.status)} size="md" className="uppercase tracking-wider">
          {order.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white border border-[#d5c3b8] rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#1c1c19] flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#7f5531]" />
              Produk yang Dibeli
            </h2>
            <div className="divide-y divide-[#d5c3b8]/50">
              {order.items?.map((item) => (
                <div key={item.productId} className="flex justify-between py-4 first:pt-0 last:pb-0">
                  <div>
                    <p className="font-semibold text-[#1c1c19] text-sm">{item.product?.name || 'Produk'}</p>
                    <p className="text-xs text-[#83746a]">{item.quantity} x {formatCurrency(item.price)}</p>
                  </div>
                  <span className="font-bold text-[#1c1c19] text-sm">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          {order.address && (
            <div className="bg-white border border-[#d5c3b8] rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-[#1c1c19] flex items-center gap-2">
                <MapPin size={18} className="text-[#7f5531]" />
                Alamat Pengiriman
              </h2>
              <div className="text-sm space-y-1">
                <p className="font-bold">{order.address.recipientName}</p>
                <p className="text-xs text-[#83746a]">{order.address.phone}</p>
                <p className="text-xs text-[#50443c]">{order.address.address}, {order.address.city}, {order.address.province} - {order.address.postalCode}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-[#d5c3b8] rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#1c1c19] flex items-center gap-2">
              <CreditCard size={18} className="text-[#7f5531]" />
              Ringkasan Pembayaran
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#50443c]">Subtotal</span>
                <span className="font-medium">{formatCurrency(itemsTotal)}</span>
              </div>
              <hr className="border-[#d5c3b8]" />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-[#7f5531]">{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
