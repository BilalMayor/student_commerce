'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { ordersApi } from '@/lib/api/orders'
import { Order } from '@/types'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { formatDate } from '@/lib/utils/formatDate'
import { Skeleton } from '@/components/ui/Skeleton'
import { ClipboardList } from 'lucide-react'

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => {
    setLoading(true)
    ordersApi.getSellerOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  const handleVerify = async (id: string, action: 'accept' | 'reject') => {
    try {
      await ordersApi.verifyOrder(id, action)
      fetchOrders()
    } catch (e: any) {
      alert(e.message || 'Gagal mengubah status pesanan')
    }
  }

  const handleUpdateStatus = async (id: string, currentStatus: Order['status']) => {
    const nextStatus: Record<Order['status'], string | null> = {
      PROCESSING: 'SHIPPED',
      SHIPPED: 'DELIVERED',
      PENDING: null,
      DELIVERED: null,
      CANCELLED: null,
    }
    const status = nextStatus[currentStatus]
    if (!status) return
    try {
      await ordersApi.updateStatus(id, status)
      fetchOrders()
    } catch (e: any) {
      alert(e.message || 'Gagal memperbarui status')
    }
  }

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

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar type="seller" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 sm:space-y-8 pb-24 lg:pb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink">Pesanan Masuk</h1>
          <p className="text-muted text-sm mt-1">Verifikasi dan kelola pesanan.</p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-border/70 bg-white p-6">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/70 bg-white p-12 text-center space-y-3">
            <ClipboardList size={48} className="mx-auto text-muted/30" />
            <p className="text-muted font-medium">Belum ada pesanan masuk.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface/80 border-b border-border/60 text-[10px] uppercase font-bold tracking-wider text-muted">
                  <tr>
                    <th className="px-5 sm:px-6 py-3.5 font-bold">ID Pesanan</th>
                    <th className="px-5 sm:px-6 py-3.5 font-bold">Tanggal</th>
                    <th className="px-5 sm:px-6 py-3.5 font-bold">Total</th>
                    <th className="px-5 sm:px-6 py-3.5 font-bold">Status</th>
                    <th className="px-5 sm:px-6 py-3.5 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-surface/40 transition-colors">
                      <td className="px-5 sm:px-6 py-4 font-medium">
                        <span className="font-mono text-xs text-muted">#{o.id.slice(-8)}</span>
                      </td>
                      <td className="px-5 sm:px-6 py-4 font-medium text-muted text-xs">{formatDate(o.createdAt)}</td>
                      <td className="px-5 sm:px-6 py-4 font-medium">
                        <span className="font-bold text-primary">{formatCurrency(o.totalPrice)}</span>
                      </td>
                      <td className="px-5 sm:px-6 py-4 font-medium">
                        <Badge variant={getStatusVariant(o.status)}>
                          {o.status === 'DELIVERED' ? 'Selesai' : o.status === 'PENDING' ? 'Menunggu' : o.status === 'PROCESSING' ? 'Dibayar' : o.status === 'SHIPPED' ? 'Dikirim' : o.status === 'CANCELLED' ? 'Dibatalkan' : o.status}
                        </Badge>
                      </td>
                      <td className="px-5 sm:px-6 py-4 font-medium text-right">
                        <div className="flex justify-end gap-2 text-xs">
                          {o.status === 'PENDING' && (
                            <>
                              <Button onClick={() => handleVerify(o.id, 'accept')} size="sm">Terima</Button>
                              <Button onClick={() => handleVerify(o.id, 'reject')} variant="danger" size="sm">Tolak</Button>
                            </>
                          )}
                          {o.status === 'PROCESSING' && (
                            <Button onClick={() => handleUpdateStatus(o.id, o.status)} variant="secondary" size="sm">Kirim</Button>
                          )}
                          {o.status === 'SHIPPED' && (
                            <Button onClick={() => handleUpdateStatus(o.id, o.status)} variant="secondary" size="sm">Selesai</Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
