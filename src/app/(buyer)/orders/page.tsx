'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ordersApi } from '@/lib/api/orders'
import { Order } from '@/types'
import OrderCard from '@/components/card/OrderCard'
import EmptyState from '@/components/ui/EmptyState'
import { useAuth } from '@/lib/hooks/useAuth'
import { Skeleton } from '@/components/ui/Skeleton'
import { Package } from 'lucide-react'

export default function BuyerOrdersPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
      return
    }
    ordersApi.getAll()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [isAuthenticated, router])

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        <Skeleton className="h-8 w-44 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-40 w-full rounded-3xl" />
          <Skeleton className="h-40 w-full rounded-3xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 pb-24 md:pb-10">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Daftar Pesanan</h1>
        {orders.length > 0 && (
          <span className="text-xs font-bold text-muted bg-border/40 px-3 py-1.5 rounded-full">
            {orders.length} transaksi
          </span>
        )}
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="Belum ada transaksi"
          description="Kamu belum memiliki riwayat pesanan."
          actionLabel="Mulai Belanja"
          actionHref="/"
          icon={<Package size={36} className="text-muted/40" />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {orders.map((ord) => (
            <OrderCard key={ord.id} order={ord} onCancel={() => {
              ordersApi.getAll().then(setOrders).catch(() => {})
            }} />
          ))}
        </div>
      )}
    </div>
  )
}
