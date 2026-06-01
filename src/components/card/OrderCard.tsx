import Link from 'next/link'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { formatDate } from '@/lib/utils/formatDate'
import { Order } from '@/types'
import Badge from '../ui/Badge'
import { Calendar, CreditCard, ChevronRight, Package, XCircle } from 'lucide-react'
import { ordersApi } from '@/lib/api/orders'
import { toast } from '@/lib/hooks/useToast'

interface OrderCardProps {
  order: Order
  onCancel?: () => void
}

export default function OrderCard({ order, onCancel }: OrderCardProps) {
  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return 'warning'
      case 'PROCESSING': return 'info'
      case 'SHIPPED': return 'primary'
      case 'DELIVERED': return 'success'
      case 'CANCELLED': return 'danger'
      default: return 'secondary'
    }
  }

  return (
    <div className="rounded-3xl border border-border/70 bg-white p-5 shadow-soft hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between gap-3 border-b border-border/50 pb-4 mb-4">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-muted/60 uppercase tracking-wider">
            ID: #{order.id.slice(-8).toUpperCase()}
          </p>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted">
            <Calendar size={12} className="text-muted/60" />
            <span>{formatDate(order.createdAt)}</span>
          </div>
        </div>
        <Badge variant={getStatusVariant(order.status)} className="uppercase tracking-wider">
          {order.status === 'DELIVERED' ? 'Selesai' :
           order.status === 'PENDING' ? 'Menunggu' :
           order.status === 'PROCESSING' ? 'Dibayar' :
           order.status === 'SHIPPED' ? 'Dikirim' :
           order.status === 'CANCELLED' ? 'Dibatalkan' : order.status}
        </Badge>
      </div>

      <div className="space-y-3">
        {order.items && order.items.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted font-medium">
            <Package size={13} className="text-muted/60 shrink-0" />
            <span className="truncate">{order.items[0].product?.name || 'Produk'}</span>
            {order.items.length > 1 && (
              <span className="text-muted/60">+{order.items.length - 1} lainnya</span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted">
            <CreditCard size={12} className="text-muted/60" />
            <span>{order.paymentMethod}</span>
          </div>
          <p className="font-black text-primary">{formatCurrency(order.totalPrice)}</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
        {order.status === 'PENDING' ? (
          <button
            onClick={async () => {
              if (!confirm('Yakin ingin membatalkan pesanan ini?')) return
              try {
                await ordersApi.cancelOrder(order.id)
                toast.success('Pesanan dibatalkan')
                if (onCancel) onCancel()
              } catch (e: any) {
                toast.error(e.message || 'Gagal membatalkan')
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl transition-all"
          >
            <XCircle size={14} />
            Batalkan
          </button>
        ) : (
          <div />
        )}
        <Link
          href={`/orders/${order.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition-colors group/btn"
        >
          Detail Pesanan
          <ChevronRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
