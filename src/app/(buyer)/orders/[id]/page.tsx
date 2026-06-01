'use client'

import { useEffect, useState, use } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ordersApi } from '@/lib/api/orders'
import { paymentsApi } from '@/lib/api/payments'
import { Order, Payment } from '@/types'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import Badge from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { formatDate } from '@/lib/utils/formatDate'
import { ArrowLeft, CreditCard, ShoppingBag, MapPin, AlertCircle, Package, Download, QrCode, Clock, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'
import { toast } from '@/lib/hooks/useToast'

export default function OrderDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise)
  const router = useRouter()
  const orderId = params.id
  const [order, setOrder] = useState<Order | null>(null)
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showQris, setShowQris] = useState(false)
  const [pollingPayment, setPollingPayment] = useState(false)
  const [qrisLoaded, setQrisLoaded] = useState(false)

  const refreshOrder = (silent = false) => {
    if (!silent) setLoading(true)
    ordersApi.getById(orderId)
      .then((data) => {
        setOrder(data)
        return paymentsApi.getByOrderId(orderId).catch(() => null)
      })
      .then((p) => { if (p) setPayment(p) })
      .catch(() => { if (!silent) setOrder(null) })
      .finally(() => { if (!silent) setLoading(false) })
  }

  useEffect(() => { refreshOrder() }, [orderId])

  useEffect(() => {
    const onVisibility = () => { if (document.visibilityState === 'visible') refreshOrder(true) }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [orderId])

  // Auto-poll payment status when QRIS is shown
  useEffect(() => {
    if (!showQris || payment?.status === 'PAID') return
    
    setPollingPayment(true)
    const interval = setInterval(async () => {
      try {
        const updated = await paymentsApi.getByOrderId(orderId)
        if (updated.status === 'PAID') {
          setPayment(updated)
          setShowQris(false)
          setPollingPayment(false)
          toast.success('Pembayaran berhasil diterima! 🎉')
          refreshOrder(true)
          clearInterval(interval)
        }
      } catch { /* silent */ }
    }, 5000)
    
    return () => { clearInterval(interval); setPollingPayment(false) }
  }, [showQris, payment?.status, orderId])

  const handleSimulatePayment = async (status: 'PAID' | 'FAILED') => {
    setSubmitting(true)
    try {
      if (status === 'PAID') {
        const updatedOrder = await ordersApi.payOrder(orderId)
        toast.success('Pembayaran berhasil!')
        setShowQris(false)
        setOrder(updatedOrder)
        setPayment(prev => prev ? { ...prev, status: 'PAID' } : prev)
        paymentsApi.getByOrderId(orderId).then(p => setPayment(p)).catch(() => {})
      } else {
        toast.error('Pembayaran gagal')
        setShowQris(false)
        refreshOrder(true)
      }
    } catch (e: any) {
      const msg = e.message || ''
      if (msg.toLowerCase().includes('sudah dibayar')) {
        toast.info('Pesanan ini sudah dibayar sebelumnya')
        setShowQris(false)
        refreshOrder(true)
      } else {
        toast.error(msg || 'Gagal memproses pembayaran')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return { variant: 'warning' as const, label: 'Menunggu Pembayaran', icon: Clock }
      case 'PROCESSING': return { variant: 'info' as const, label: 'Sudah Dibayar', icon: CheckCircle2 }
      case 'SHIPPED': return { variant: 'primary' as const, label: 'Sedang Dikirim', icon: Package }
      case 'DELIVERED': return { variant: 'success' as const, label: 'Selesai', icon: CheckCircle2 }
      case 'CANCELLED': return { variant: 'danger' as const, label: 'Dibatalkan', icon: XCircle }
      default: return { variant: 'secondary' as const, label: status, icon: Clock }
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 py-8 space-y-6">
        <Skeleton className="h-8 w-44 rounded-xl" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-60 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16">
        <EmptyState title="Pesanan tidak ditemukan" description="Detail pesanan tidak tersedia." actionLabel="Kembali" actionHref="/orders" />
      </div>
    )
  }

  const itemsTotal = order.items?.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0) || 0
  const isDigitalOrder = order.items?.every(i => i.product?.productType === 'DIGITAL') ?? false
  const shippingVal = isDigitalOrder ? 0 : Number((order as any).shippingCost || 15000)
  const subtotal = itemsTotal
  const effectiveTotal = isDigitalOrder ? itemsTotal : (Number(order.totalPrice) > 0 ? Number(order.totalPrice) : itemsTotal)
  const isUnpaid = payment?.status === 'UNPAID' || payment?.status === 'FAILED'
  const statusConfig = getStatusConfig(order.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="mx-auto max-w-[1280px] px-6 sm:px-10 py-8 space-y-8 pb-24 md:pb-10">
      <div>
        <Link href="/orders" className="inline-flex items-center gap-2 text-[#50443c] font-bold text-xs hover:text-[#7f5531] transition-colors bg-[#ebe8e3] px-4 py-2.5 rounded-full">
          <ArrowLeft size={13} /> Kembali ke Pesanan
        </Link>
      </div>

      {/* Status Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#d5c3b8] rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
            order.status === 'DELIVERED' ? 'bg-[#D7E8D9] text-[#2E7D32]' :
            order.status === 'CANCELLED' ? 'bg-[#ffdad6] text-[#ba1a1a]' :
            order.status === 'PROCESSING' ? 'bg-[#D1E3F6] text-[#1E40AF]' :
            'bg-[#FFECB3] text-[#795548]'
          }`}>
            <StatusIcon size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#1c1c19]">{statusConfig.label}</h1>
            <p className="text-xs text-[#83746a] mt-0.5">ID Pesanan: #{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>
        <div className="text-right">
          <Badge variant={statusConfig.variant} size="md" className="uppercase tracking-wider">
            {statusConfig.label}
          </Badge>
          <p className="text-xs text-[#83746a] mt-1">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6 w-full">
          {/* Items */}
          <div className="bg-white border border-[#d5c3b8] rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="text-lg font-semibold text-[#1c1c19] flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#7f5531]" />
              Produk yang Dibeli
            </h2>
            <div className="divide-y divide-[#d5c3b8]/50">
              {order.items?.map((item) => (
                <div key={item.productId} className="flex justify-between py-4 first:pt-0 last:pb-0">
                  <div className="space-y-1 min-w-0">
                    <p className="font-semibold text-[#1c1c19] text-sm">{item.product?.name || 'Produk'}</p>
                    <p className="text-xs text-[#83746a]">{item.quantity} x {formatCurrency(item.price)}</p>
                    
                    {/* Digital Product Badge */}
                    {item.product?.productType === 'DIGITAL' && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#795e3b] bg-[#ffd9ae] px-2 py-0.5 rounded mt-1">
                        Produk Digital
                      </span>
                    )}
                    
                    {/* Download Button for Digital Products */}
                    {item.product?.productType === 'DIGITAL' && payment?.status === 'PAID' && item.product.fileUrl && (
                      <a
                        href={item.product.fileUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] px-4 py-2 text-xs font-bold text-white transition-all active:scale-[0.98]"
                      >
                        <Download size={13} />
                        Unduh File Digital
                      </a>
                    )}
                  </div>
                  <span className="font-bold text-[#1c1c19] shrink-0 ml-4 text-sm">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="bg-white border border-[#d5c3b8] rounded-2xl p-6 md:p-8 space-y-4">
            <h2 className="text-lg font-semibold text-[#1c1c19] flex items-center gap-2">
              <MapPin size={18} className="text-[#7f5531]" />
              Alamat Pengiriman
            </h2>
            {order.address ? (
              <div className="text-sm text-[#1c1c19] space-y-1 bg-[#f6f3ee] rounded-xl p-5 border border-[#d5c3b8]/50">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold">{order.address.recipientName}</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7f5531] bg-[#c8956c]/20 border border-[#c8956c]/30 px-2 py-0.5 rounded-md">{order.address.label}</span>
                </div>
                <p className="text-xs text-[#83746a]">{order.address.phone}</p>
                <p className="text-xs text-[#50443c] leading-relaxed mt-1">
                  {order.address.address}, {order.address.city}, {order.address.province} - {order.address.postalCode}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#d5c3b8] p-5 text-center">
                <p className="text-sm text-[#83746a]">Alamat tidak ditemukan.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 w-full">
          {/* Order Summary */}
          <div className="bg-white border border-[#d5c3b8] rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-semibold text-[#1c1c19]">Ringkasan</h2>
            <div className="space-y-3 text-sm text-[#50443c]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#1c1c19] font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim</span>
                <span className="text-[#1c1c19] font-medium">{formatCurrency(shippingVal)}</span>
              </div>
              <hr className="border-[#d5c3b8]" />
              <div className="flex justify-between font-bold text-[#1c1c19] text-base">
                <span>Total</span>
                <span className="text-[#7f5531] text-lg">{formatCurrency(effectiveTotal)}</span>
              </div>
            </div>

            {order.status === 'PENDING' && (
              <button
                onClick={async () => {
                  if (!confirm('Yakin ingin membatalkan pesanan ini?')) return
                  try {
                    await ordersApi.cancelOrder(orderId)
                    toast.success('Pesanan dibatalkan')
                    refreshOrder(true)
                  } catch (e: any) {
                    toast.error(e.message || 'Gagal membatalkan pesanan')
                  }
                }}
                className="w-full rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-100 hover:border-red-400 transition-all text-center"
              >
                Batalkan Pesanan
              </button>
            )}
          </div>

          {/* Payment Status & QRIS */}
          <div className="bg-white border border-[#d5c3b8] rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-semibold text-[#1c1c19] flex items-center gap-2">
              <CreditCard size={18} className="text-[#7f5531]" />
              Pembayaran
            </h2>
            
            <div className="flex items-center justify-between rounded-xl bg-[#f6f3ee] p-4 border border-[#d5c3b8]/50">
              <span className="text-sm font-medium text-[#1c1c19]">Status:</span>
              <Badge variant={payment?.status === 'PAID' ? 'success' : payment?.status === 'FAILED' ? 'danger' : 'warning'} className="uppercase tracking-wider">
                {payment?.status === 'PAID' ? 'Lunas' : payment?.status === 'FAILED' ? 'Gagal' : payment?.status === 'UNPAID' ? 'Belum Bayar' : payment?.status || 'Belum Bayar'}
              </Badge>
            </div>

            {/* QRIS Payment Section */}
            {isUnpaid && !showQris && (
              <Button fullWidth onClick={() => setShowQris(true)} size="lg">
                <QrCode size={18} />
                Bayar dengan QRIS
              </Button>
            )}

            {isUnpaid && showQris && (
              <div className="space-y-4">
                {/* QRIS QR Code */}
                <div className="bg-white border-2 border-[#d5c3b8] rounded-2xl p-6 text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#7f5531]">
                    <QrCode size={18} />
                    Scan QRIS untuk Membayar
                  </div>
                  
                  {/* QRIS Image */}
                  <div className="mx-auto w-56 h-56 bg-white border border-[#d5c3b8] rounded-xl p-3 flex items-center justify-center relative">
                    {!qrisLoaded && (
                      <div className="absolute inset-3 rounded-lg bg-[#f6f3ee] animate-pulse" />
                    )}
                    <img
                      src="/qris.jpg"
                      alt="QRIS"
                      className={`w-full h-full object-contain rounded-lg transition-opacity duration-300 ${qrisLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => setQrisLoaded(true)}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-[#7f5531]">{formatCurrency(effectiveTotal)}</p>
                    <p className="text-xs text-[#83746a]">StudentCommerce Payment</p>
                  </div>

                  <Link href={`/orders/${orderId}/payment`} className="block text-xs font-bold text-primary hover:underline">
                    Tampilkan halaman pembayaran penuh →
                  </Link>
                  
                  {pollingPayment && (
                    <div className="flex items-center justify-center gap-2 text-xs text-[#7f5531] font-medium bg-[#ffdcc2]/30 rounded-lg py-2">
                      <RefreshCw size={12} className="animate-spin" />
                      Menunggu pembayaran...
                    </div>
                  )}
                </div>

                {/* Simulate Payment Buttons (Development) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#795548] font-bold justify-center bg-[#FFECB3] px-3 py-2 rounded-xl border border-[#795548]/10">
                    <AlertCircle size={12} />
                    <span>Mode development — simulasi pembayaran</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => handleSimulatePayment('PAID')} loading={submitting} size="sm">
                      ✓ Bayar
                    </Button>
                    <Button variant="danger" onClick={() => handleSimulatePayment('FAILED')} loading={submitting} size="sm">
                      ✕ Gagal
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Success State */}
            {payment?.status === 'PAID' && (
              <div className="bg-[#D7E8D9] border border-[#2E7D32]/20 rounded-xl p-4 text-center space-y-1">
                <CheckCircle2 size={24} className="mx-auto text-[#2E7D32]" />
                <p className="text-sm font-bold text-[#2E7D32]">Pembayaran Berhasil</p>
                <p className="text-xs text-[#2E7D32]/70">Pesanan Anda sedang diproses oleh penjual.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
