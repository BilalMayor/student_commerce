'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, CreditCard, ShieldCheck, QrCode, Plus } from 'lucide-react'
import { addressesApi } from '@/lib/api/addresses'
import { ordersApi } from '@/lib/api/orders'
import { cartApi } from '@/lib/api/cart'
import { Address } from '@/types'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { useCartStore } from '@/lib/store/cartStore'
import { Skeleton } from '@/components/ui/Skeleton'
import { toast } from '@/lib/hooks/useToast'

export default function CheckoutPage() {
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const storeItems = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clear)
  const [cartItems, setCartItems] = useState(storeItems)

  useEffect(() => {
    Promise.all([
      addressesApi.getAll(),
      cartApi.getCart(),
    ]).then(([addrData, cartData]) => {
      setAddresses(addrData)
      const defaultAddr = addrData.find((a) => a.isDefault) || addrData[0]
      if (defaultAddr) setSelectedAddressId(defaultAddr.id)
      if (cartData.length > 0) setCartItems(cartData)
    }).finally(() => setLoading(false))
  }, [])

  const items = cartItems
  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  )
  const hasDigitalOnly = items.every(item => item.product?.productType === 'DIGITAL')
  const shipping = hasDigitalOnly ? 0 : (subtotal > 0 ? 15000 : 0)
  const total = subtotal + shipping

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.error('Silakan pilih alamat terlebih dahulu')
      return
    }
    setSubmitLoading(true)
    try {
      const order = await ordersApi.create({
        addressId: selectedAddressId,
        paymentMethod: 'TRANSFER',
      })
      await cartApi.clearCart()
      clearCart()
      toast.success('Pesanan berhasil dibuat!')
      router.push(`/orders/${order.id}`)
    } catch (e: any) {
      toast.error(e.message || 'Gagal membuat pesanan')
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 py-8 space-y-6">
        <Skeleton className="h-8 w-40 rounded-xl" />
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
          <div className="lg:w-80">
            <Skeleton className="h-60 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16">
        <EmptyState
          title="Tidak ada produk untuk checkout"
          description="Keranjang belanja Anda kosong."
          actionLabel="Belanja Sekarang"
          actionHref="/"
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 sm:px-10 py-8 space-y-8 pb-24 md:pb-10">
      <div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-[#50443c] font-bold text-xs hover:text-[#7f5531] transition-colors bg-[#ebe8e3] px-4 py-2.5 rounded-full"
        >
          <ArrowLeft size={13} />
          Kembali ke Keranjang
        </Link>
      </div>

      <h1 className="text-2xl sm:text-3xl font-semibold text-[#1c1c19]">
        Checkout Pesanan
      </h1>

      <div className="flex flex-col gap-6 lg:flex-row items-start">
        <div className="flex-1 space-y-6 w-full">
          {/* Address */}
          <div className="bg-white border border-[#d5c3b8] rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="text-lg font-semibold text-[#1c1c19] flex items-center gap-2">
              <MapPin size={18} className="text-[#7f5531]" />
              {hasDigitalOnly ? 'Alamat Tagihan' : 'Alamat Pengiriman'}
            </h2>

            {addresses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#d5c3b8] p-6 text-center space-y-3">
                <p className="text-sm text-[#83746a]">
                  Belum ada alamat terdaftar. Silakan tambah alamat terlebih dahulu.
                </p>
                <Link href="/profile">
                  <Button variant="secondary" size="sm">
                    <Plus size={14} />
                    Tambah Alamat Baru
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id
                  return (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-4 rounded-xl border-2 p-5 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-[#7f5531] bg-[#ffdcc2]/10'
                          : 'border-[#d5c3b8] hover:bg-[#f6f3ee]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={isSelected}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1.5 h-4 w-4 accent-[#7f5531] shrink-0"
                      />
                      <div className="text-sm text-[#1c1c19] space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold">{addr.recipientName}</p>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7f5531] bg-[#c8956c]/20 border border-[#c8956c]/30 px-2 py-0.5 rounded-md">
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#50443c] bg-[#ebe8e3] px-2 py-0.5 rounded-md">
                              Utama
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#83746a]">{addr.phone}</p>
                        <p className="text-xs text-[#50443c] leading-relaxed">
                          {addr.address}, {addr.city}, {addr.province} - {addr.postalCode}
                        </p>
                      </div>
                    </label>
                  )
                })}
              </div>
            )}
          </div>

          {/* Digital Product Notice */}
          {hasDigitalOnly && (
            <div className="bg-[#ffdcc2]/20 border border-[#ffd9ae] rounded-2xl p-6 text-center space-y-2">
              <p className="text-sm font-bold text-[#795e3b]">Produk Digital</p>
              <p className="text-xs text-[#795e3b]">Pesanan Anda berisi produk digital. File akan tersedia untuk diunduh setelah pembayaran. Pilih alamat untuk keperluan tagihan.</p>
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-white border border-[#d5c3b8] rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="text-lg font-semibold text-[#1c1c19] flex items-center gap-2">
              <CreditCard size={18} className="text-[#7f5531]" />
              Metode Pembayaran
            </h2>
            <div className="rounded-xl border-2 border-[#7f5531] bg-[#ffdcc2]/10 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#7f5531] flex items-center justify-center">
                  <QrCode size={20} className="text-white" />
                </div>
                <div>
                  <span className="text-sm font-bold text-[#1c1c19] block">QRIS Payment</span>
                  <span className="text-xs text-[#83746a] block">Scan QR Code untuk membayar</span>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-[#7f5531] px-3 py-1 rounded-full">
                Aktif
              </span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:w-80 w-full shrink-0">
          <div className="bg-white border border-[#d5c3b8] rounded-2xl p-6 lg:sticky lg:top-24 space-y-5">
            <h2 className="text-lg font-semibold text-[#1c1c19] border-b border-[#d5c3b8]/50 pb-3">
              Ringkasan Pembayaran
            </h2>

            <div className="space-y-3 text-sm text-[#50443c]">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} item)</span>
                <span className="text-[#1c1c19] font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim</span>
                <span className={`font-medium ${hasDigitalOnly ? 'text-[#2E7D32]' : 'text-[#1c1c19]'}`}>
                  {hasDigitalOnly ? 'Gratis' : formatCurrency(shipping)}
                </span>
              </div>
              <hr className="border-[#d5c3b8]" />
              <div className="flex justify-between font-bold text-[#1c1c19] text-base">
                <span>Total Bayar</span>
                <span className="text-[#7f5531] text-lg">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <Button fullWidth onClick={handleCheckout} loading={submitLoading} size="lg">
              Buat Pesanan & Bayar
            </Button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#83746a] font-bold">
              <ShieldCheck size={14} className="text-[#2E7D32]" />
              <span>Transaksi Aman & Terenkripsi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
