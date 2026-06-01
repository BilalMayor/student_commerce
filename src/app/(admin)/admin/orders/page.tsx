'use client'

import { useEffect, useState } from 'react'
import { ordersApi } from '@/lib/api/orders'
import { Order } from '@/types'
import { Skeleton } from '@/components/ui/Skeleton'
import { toast } from '@/lib/hooks/useToast'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { formatDate } from '@/lib/utils/formatDate'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ordersApi.getAllOrders()
      .then(setOrders)
      .catch(() => toast.error('Gagal memuat pesanan'))
      .finally(() => setLoading(false))
  }, [])

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1c19]">Semua Pesanan</h1>
          <p className="text-sm text-[#83746a] mt-1">Pantau seluruh transaksi dan pesanan yang terjadi di platform.</p>
        </div>
        <div className="bg-[#ebe8e3] text-[#50443c] px-4 py-2 rounded-xl text-sm font-bold">
          Total: {orders.length} Transaksi
        </div>
      </div>

      <div className="bg-white border border-[#d5c3b8] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f6f3ee] text-[#83746a] border-b border-[#d5c3b8]">
              <tr>
                <th className="px-6 py-4 font-semibold">ID Pesanan</th>
                <th className="px-6 py-4 font-semibold">Waktu</th>
                <th className="px-6 py-4 font-semibold">Total Harga</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d5c3b8]/50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#f6f3ee]/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-[#1c1c19]">#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-6 py-4 text-[#83746a]">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4 font-bold text-[#1c1c19]">{formatCurrency(order.totalPrice)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusVariant(order.status)} size="sm" className="uppercase tracking-wider">
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#7f5531] hover:underline"
                    >
                      Detail <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#83746a]">
                    Belum ada transaksi di platform.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
