'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ordersApi } from '@/lib/api/orders'
import { paymentsApi } from '@/lib/api/payments'
import { Order, Payment } from '@/types'
import { Skeleton } from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import { ArrowLeft, CheckCircle2, QrCode, AlertCircle, ShoppingBag, ShieldCheck } from 'lucide-react'
import { toast } from '@/lib/hooks/useToast'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { useAuth } from '@/lib/hooks/useAuth'

export default function QRISPaymentPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const { user } = useAuth()

  const [order, setOrder] = useState<Order | null>(null)
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [paymentDone, setPaymentDone] = useState(false)
  const [qrisLoaded, setQrisLoaded] = useState(false)

  useEffect(() => {
    if (!orderId) return

    const loadPaymentData = async () => {
      try {
        const orderData = await ordersApi.getById(orderId)
        setOrder(orderData)

        const paymentData = await paymentsApi.getByOrderId(orderId).catch(() => null)
        setPayment(paymentData)
      } catch {
        /* silent */
      } finally {
        setLoading(false)
      }
    }

    loadPaymentData()

    const onVisibility = () => { if (document.visibilityState === 'visible') loadPaymentData() }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [orderId])

  const fetchPaymentData = async () => {
    try {
      const [orderData, paymentData] = await Promise.all([
        ordersApi.getById(orderId),
        paymentsApi.getByOrderId(orderId).catch(() => null),
      ])
      setOrder(orderData)
      setPayment(paymentData)
    } catch { /* silent */ }
  }

  const handlePaymentConfirmation = async () => {
    setSubmitting(true)
    try {
      const updatedOrder = await ordersApi.payOrder(orderId)
      toast.success('Pembayaran berhasil dikonfirmasi!')
      setPaymentDone(true)
      setOrder(updatedOrder)
      setPayment(prev => prev ? { ...prev, status: 'PAID' } : prev)
      paymentsApi.getByOrderId(orderId).then(p => setPayment(p)).catch(() => {})
    } catch (err: any) {
      const msg = err.message || ''
      if (msg.toLowerCase().includes('sudah dibayar')) {
        toast.info('Pesanan ini sudah dibayar sebelumnya')
        setPaymentDone(true)
        setOrder(prev => prev ? { ...prev, status: 'PROCESSING' } : prev)
        setPayment(prev => prev ? { ...prev, status: 'PAID' } : prev)
      } else {
        toast.error(msg || 'Gagal memproses konfirmasi pembayaran')
        setSubmitting(false)
        return
      }
    }
    setTimeout(() => {
      router.push(`/orders/${orderId}`)
    }, 1500)
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 flex items-center justify-center min-h-[70vh]">
        <Skeleton className="h-96 w-full rounded-[2.25rem]" />
      </main>
    )
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <AlertCircle size={48} className="text-rose-500 mx-auto" />
        <h1 className="text-xl font-black text-ink">Pesanan Tidak Ditemukan</h1>
        <p className="text-sm text-muted">Maaf, pesanan yang Anda tuju tidak valid atau telah dihapus.</p>
        <Button onClick={() => router.push('/profile?tab=orders')}>Kembali ke Pesanan</Button>
      </main>
    )
  }

  const itemsTotal = order.items?.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0) || 0
  const isDigitalOrder = order.items?.every(i => i.product?.productType === 'DIGITAL') ?? false
  const effectiveTotal = isDigitalOrder ? itemsTotal : (Number(order.totalPrice) > 0 ? Number(order.totalPrice) : itemsTotal)

  const isAlreadyPaid = paymentDone || payment?.status === 'PAID' || order.status === 'PROCESSING' || order.status === 'SHIPPED' || order.status === 'DELIVERED'

  return (
    <main className="mx-auto max-w-xl px-4 py-6 sm:py-10 space-y-6 sm:space-y-8 pb-24 sm:pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => router.push(`/orders/${orderId}`)} 
          className="p-2.5 rounded-full hover:bg-surface border border-border/80 text-muted hover:text-ink transition-all shrink-0"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-black text-ink tracking-tight">Pembayaran QRIS</h1>
          <p className="text-xs text-muted font-medium mt-0.5">Order ID: #{orderId.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      {isAlreadyPaid ? (
        /* Success State */
        <div className="rounded-[2.25rem] border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8 text-center space-y-5 shadow-soft">
          <div className="h-16 w-16 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
            <CheckCircle2 size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-ink">Pembayaran Berhasil!</h2>
            <p className="text-sm text-muted max-w-xs mx-auto leading-relaxed">
              Terima kasih, pembayaran Anda telah kami terima dan diverifikasi. Pesanan akan segera diproses oleh penjual.
            </p>
          </div>
          <hr className="border-emerald-200/50" />
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.push(`/orders/${orderId}`)} fullWidth>
              <ShoppingBag size={15} />
              <span>Lihat Detail Pesanan</span>
            </Button>
          </div>
        </div>
      ) : (
        /* Payment Scanning Form */
        <div className="space-y-6">
          {/* Total Price Card */}
          <div className="rounded-3xl border border-border/70 bg-white p-5 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-muted uppercase tracking-wider">Total yang Harus Dibayar</p>
              <p className="text-xl sm:text-2xl font-black text-primary-dark mt-1">{formatCurrency(effectiveTotal)}</p>
            </div>
            <div className="rounded-2xl bg-primary/10 text-primary p-3">
              <QrCode size={24} />
            </div>
          </div>

          {/* QR Code Container */}
          <div className="rounded-[2.25rem] border border-border/70 bg-white p-6 sm:p-8 shadow-soft text-center space-y-6">
            <div className="space-y-1">
              <h3 className="font-black text-ink text-base">Pindai Kode QRIS</h3>
              <p className="text-xs text-muted font-semibold">Bisa discan dengan seluruh aplikasi e-wallet & m-banking Indonesia</p>
            </div>

            {/* QR Image Frame */}
            <div className="relative mx-auto h-56 w-56 sm:h-64 sm:w-64 border-4 border-border rounded-3xl bg-surface p-3 flex items-center justify-center overflow-hidden hover:scale-[1.02] transition-transform duration-300">
              {!qrisLoaded && (
                <div className="absolute inset-3 rounded-2xl bg-surface/80 animate-pulse" />
              )}
              <img 
                src="/qris.jpg"
                alt="QRIS Code" 
                className={`h-full w-full object-contain rounded-2xl transition-opacity duration-300 ${qrisLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setQrisLoaded(true)}
              />
            </div>

            {/* Shield trust note */}
            <div className="inline-flex items-center gap-2 rounded-xl bg-surface/80 border border-border/60 px-3 py-1.5 text-[10px] font-black text-muted uppercase tracking-wider mx-auto">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Pembayaran Aman & Terverifikasi</span>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="rounded-3xl border border-border/70 bg-white p-5 sm:p-6 shadow-soft space-y-3">
            <h4 className="font-black text-sm text-ink tracking-tight">Cara Pembayaran:</h4>
            <ol className="list-decimal pl-5 text-xs text-muted font-semibold leading-relaxed space-y-1.5">
              <li>Buka aplikasi pembayaran pilihanmu (Gopay, OVO, Dana, LinkAja, ShopeePay, M-Banking, dll).</li>
              <li>Pilih opsi scan QR/Bayar, lalu pindai kode QRIS di atas.</li>
              <li>Periksa nominal pembayaran, pastikan sesuai dengan total harga pesanan.</li>
              <li>Selesaikan transaksi dan tekan tombol konfirmasi "Saya Sudah Bayar" di bawah ini.</li>
            </ol>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handlePaymentConfirmation} 
              loading={submitting} 
              size="lg" 
              fullWidth
            >
              <span>Saya Sudah Bayar</span>
            </Button>
            <button 
              onClick={() => router.push(`/orders/${orderId}`)} 
              className="py-3 rounded-2xl text-xs font-bold text-muted hover:text-ink hover:bg-surface transition-all text-center"
            >
              Bayar Nanti / Batalkan
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
