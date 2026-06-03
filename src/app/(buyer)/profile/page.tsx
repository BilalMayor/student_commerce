'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Camera, MapPin, User, LogOut, Plus, Trash2,
  ShoppingCart, ShoppingBag, Star, Bell, Store,
  CheckCircle2, ArrowRight, ShieldCheck, FileText, Check
} from 'lucide-react'
import { usersApi } from '@/lib/api/users'
import { addressesApi } from '@/lib/api/addresses'
import { ordersApi } from '@/lib/api/orders'
import { reviewsApi } from '@/lib/api/reviews'
import { uploadImage } from '@/lib/api/upload'
import { useAuth } from '@/lib/hooks/useAuth'
import { useCart } from '@/lib/hooks/useCart'
import { useNotificationStore } from '@/lib/store/notificationStore'
import { Address, Order, Review } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { toast } from '@/lib/hooks/useToast'
import { formatDate } from '@/lib/utils/formatDate'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { resolveImageUrl } from '@/lib/utils/image'
import Link from 'next/link'

type TabType = 'profile' | 'cart' | 'orders' | 'addresses' | 'reviews' | 'notifications'

function ProfilePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, setAuth, logout } = useAuth()
  const { items: cartItems, removeFromCart, fetchCart, loading: cartLoading } = useCart()

  // Tabs
  const [activeTab, setActiveTab] = useState<TabType>('profile')

  // Profile fields
  const [profileName, setProfileName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  // Data lists
  const [addresses, setAddresses] = useState<Address[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const notifications = useNotificationStore((s) => s.notifications)
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications)
  const markAsRead = useNotificationStore((s) => s.markAsRead)
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead)

  // Address form fields
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [label, setLabel] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [phone, setPhone] = useState('')
  const [addressVal, setAddressVal] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')

  // UI state
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Parse active tab from URL query params if any
  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType
    if (tabParam && ['profile', 'cart', 'orders', 'addresses', 'reviews', 'notifications'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // Load all user profile details
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
      return
    }

    if (user) {
      setProfileName(user.name)
      setProfileEmail(user.email)
      setAvatarUrl(user.avatarUrl || '')
    }

    const loadData = async () => {
      setLoading(true)
      try {
        const [addrData, orderData, reviewData] = await Promise.all([
          addressesApi.getAll().catch(() => []),
          ordersApi.getAll().catch(() => []),
          reviewsApi.getMyReviews().catch(() => []),
        ])

        setAddresses(addrData)
        setOrders(orderData)
        setReviews(reviewData)
        fetchNotifications()
        await fetchCart()
      } catch (err: any) {
        toast.error('Gagal mengambil data lengkap profil')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, isAuthenticated, router])

  // Handle Edit Profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const updated = await usersApi.updateMe({ name: profileName, email: profileEmail, avatarUrl })
      if (user) {
        const stored = localStorage.getItem('auth-storage')
        const token = stored ? JSON.parse(stored).state.token : ''
        setAuth({ ...user, ...updated }, token)
      }
      toast.success('Profil berhasil diperbarui!')
    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui profil')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Avatar Upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadImage(file)
      setAvatarUrl(res.url)
      
      // Auto-save the updated avatar
      const updated = await usersApi.updateMe({ name: profileName, email: profileEmail, avatarUrl: res.url })
      if (user) {
        const stored = localStorage.getItem('auth-storage')
        const token = stored ? JSON.parse(stored).state.token : ''
        setAuth({ ...user, ...updated }, token)
      }
      toast.success('Foto profil berhasil diperbarui!')
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengupload gambar')
    } finally {
      setUploading(false)
    }
  }

  // Address operations
  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const newAddr = await addressesApi.create({
        label, recipientName, phone, address: addressVal, city, province, postalCode,
        isDefault: addresses.length === 0,
      })
      setAddresses((prev) => [...prev, newAddr])
      setShowAddressForm(false)
      toast.success('Alamat berhasil ditambahkan!')
      setLabel(''); setRecipientName(''); setPhone(''); setAddressVal(''); setCity(''); setProvince(''); setPostalCode('')
    } catch (err: any) {
      toast.error(err.message || 'Gagal membuat alamat')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus alamat ini?')) return
    try {
      await addressesApi.delete(id)
      setAddresses((prev) => prev.filter((a) => a.id !== id))
      toast.success('Alamat berhasil dihapus!')
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus alamat')
    }
  }

  // Notification operations
  const [sellerApprovalNotif, setSellerApprovalNotif] = useState<Notification | null>(null)

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id)
      toast.success('Notifikasi ditandai dibaca')
    } catch (err: any) {
      toast.error('Gagal memperbarui status notifikasi')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      toast.success('Semua notifikasi ditandai dibaca')
    } catch (err: any) {
      toast.error('Gagal memperbarui status notifikasi')
    }
  }

  const handleAcceptSeller = async (notif: Notification) => {
    setSellerApprovalNotif(notif)
  }

  const handleConfirmSeller = async () => {
    if (!sellerApprovalNotif) return
    try {
      const updatedUser = await usersApi.getMe()
      const stored = localStorage.getItem('auth-storage')
      const token = stored ? JSON.parse(stored).state.token : ''
      setAuth(updatedUser, token)
      await markAsRead(sellerApprovalNotif.id)
      setSellerApprovalNotif(null)
      toast.success('Selamat! Akun seller Anda sudah aktif!')
      router.push('/seller/dashboard')
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengaktifkan akun seller')
      setSellerApprovalNotif(null)
    }
  }

  // Helper stats
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length
  const unreadNotifs = useNotificationStore((s) => s.unreadCount)

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        <Skeleton className="h-8 w-44 rounded-xl" />
        <div className="grid gap-6 lg:grid-cols-4">
          <Skeleton className="h-64 w-full rounded-[2rem] lg:col-span-1" />
          <div className="lg:col-span-3 space-y-6">
            <Skeleton className="h-44 w-full rounded-[2rem]" />
            <Skeleton className="h-56 w-full rounded-[2rem]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 pb-24 md:pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Akun & Profil</h1>
          <p className="text-sm font-medium text-muted mt-1">Kelola data diri, keranjang, pesanan, alamat, dan notifikasi Anda.</p>
        </div>
        
        {/* Role action buttons */}
        <div className="flex items-center gap-3">
          {user?.role === 'BUYER' ? (
            <Link href="/seller/register" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-black text-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">
              <ShieldCheck size={16} />
              <span>Jadi Penjual (Seller)</span>
            </Link>
          ) : user?.role === 'SELLER' ? (
            <Link href="/seller/dashboard" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-dark to-primary px-5 py-2.5 text-sm font-black text-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">
              <ShieldCheck size={16} />
              <span>Dashboard Penjual</span>
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4 items-start">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-4">
          {/* Avatar card (sticky/permanent sidebar element) */}
          <div className="rounded-[2.25rem] border border-border/70 bg-white p-5 shadow-soft text-center">
            <div className="relative mx-auto h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-full border-4 border-border/60 bg-accent/5 flex items-center justify-center text-4xl group">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <User size={30} className="text-muted/40" />
              )}
              <label className="absolute inset-0 bg-ink/40 backdrop-blur-[1px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 text-white select-none">
                <Camera size={16} className="mb-0.5" />
                <span className="text-[8px] font-black uppercase tracking-wider">{uploading ? '...' : 'Ubah'}</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
            </div>
            <div className="mt-3">
              <p className="font-black text-ink text-sm sm:text-base line-clamp-1">{user?.name}</p>
              <p className="text-[10px] font-semibold text-muted/80 mt-0.5 line-clamp-1">{user?.email}</p>
              <span className="inline-block mt-2 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-primary-dark">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="rounded-[2.25rem] border border-border/70 bg-white p-3 shadow-soft flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 scrollbar-none">
            {[
              { id: 'profile', label: 'Profil Saya', icon: User },
              { id: 'cart', label: 'Keranjang', icon: ShoppingCart, count: cartItems.length },
              { id: 'orders', label: 'Pesanan', icon: ShoppingBag, count: pendingOrders, highlight: true },
              { id: 'addresses', label: 'Alamat', icon: MapPin },
              { id: 'store', label: 'Toko Saya', icon: ShoppingBag, href: user?.role === 'SELLER' ? '/seller/dashboard' : '/seller/register' },
              { id: 'reviews', label: 'Ulasan', icon: Star },
              { id: 'notifications', label: 'Notifikasi', icon: Bell, count: unreadNotifs, highlight: true },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return tab.href ? (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold tracking-tight shrink-0 transition-all text-muted hover:bg-surface/50 hover:text-ink"
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </Link>
              ) : (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold tracking-tight shrink-0 transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-soft-primary'
                      : 'text-muted hover:bg-surface/50 hover:text-ink'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`ml-auto px-2 py-0.5 rounded-full text-[9px] font-black ${
                      isActive
                        ? 'bg-white text-primary'
                        : tab.highlight
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-muted/10 text-muted'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
            
            <hr className="hidden lg:block border-border/60 my-1" />
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold tracking-tight text-rose-600 hover:bg-rose-50 shrink-0 w-full transition-all"
            >
              <LogOut size={16} />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="lg:col-span-3">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="rounded-[2.25rem] border border-border/70 bg-white p-5 sm:p-6 md:p-8 shadow-soft space-y-6">
              <h2 className="text-lg sm:text-xl font-black text-ink tracking-tight flex items-center gap-2">
                <User size={20} className="text-primary" />
                <span>Informasi Diri</span>
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <Input
                  label="Nama Lengkap"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  required
                />
                <Input
                  label="Alamat Email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder="Email"
                  type="email"
                  required
                />
                <div className="flex justify-end pt-2">
                  <Button type="submit" loading={submitting}>
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: CART */}
          {activeTab === 'cart' && (
            <div className="rounded-[2.25rem] border border-border/70 bg-white p-5 sm:p-6 md:p-8 shadow-soft space-y-5">
              <h2 className="text-lg sm:text-xl font-black text-ink tracking-tight flex items-center gap-2">
                <ShoppingCart size={20} className="text-primary" />
                <span>Keranjang Belanja</span>
              </h2>

              {cartItems.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-border/70 p-10 text-center space-y-4">
                  <ShoppingCart className="mx-auto text-muted/30" size={48} />
                  <div className="space-y-1">
                    <p className="font-bold text-ink text-base">Keranjang Anda Kosong</p>
                    <p className="text-xs text-muted font-medium">Beli barang kesukaan Anda sekarang juga.</p>
                  </div>
                  <Link href="/" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2 text-xs font-black text-white hover:bg-primary-dark transition-all">
                    <span>Mulai Belanja</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="divide-y divide-border/60">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex gap-4 py-4 first:pt-0 last:pb-0 items-center justify-between">
                        <div className="flex gap-3 items-center min-w-0">
                          <div className="h-16 w-16 rounded-xl bg-accent/5 border border-border/60 overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl">
                            {item.product?.imageUrl ? (
                              <img src={resolveImageUrl(item.product.imageUrl)} alt={item.product.name} className="h-full w-full object-cover" />
                            ) : (
                              '📦'
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link href={`/product/${item.productId}`} className="font-bold text-ink hover:text-primary transition-colors text-sm sm:text-base line-clamp-1">
                              {item.product?.name || 'Produk'}
                            </Link>
                            <p className="text-xs text-muted mt-0.5">Jumlah: {item.quantity} pcs</p>
                            <p className="text-sm font-black text-primary-dark mt-1">{formatCurrency(item.product?.price || 0)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-2 text-muted/40 hover:text-red-500 hover:bg-rose-50 rounded-xl transition-all shrink-0"
                          title="Hapus dari keranjang"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <hr className="border-border/60" />
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                    <div>
                      <p className="text-xs font-semibold text-muted">Total Belanja</p>
                      <p className="text-lg font-black text-ink">
                        {formatCurrency(cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0))}
                      </p>
                    </div>
                    <Link href="/checkout" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-black text-white hover:bg-primary-dark active:scale-[0.98] transition-all shadow-soft-primary">
                      <span>Checkout Sekarang</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div className="rounded-[2.25rem] border border-border/70 bg-white p-5 sm:p-6 md:p-8 shadow-soft space-y-5">
              <h2 className="text-lg sm:text-xl font-black text-ink tracking-tight flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                <span>Riwayat Pesanan</span>
              </h2>

              {orders.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-border/70 p-10 text-center space-y-3">
                  <ShoppingBag className="mx-auto text-muted/30" size={48} />
                  <p className="font-bold text-ink text-base">Belum Ada Pesanan</p>
                  <p className="text-xs text-muted font-medium">Semua pesanan yang Anda lakukan akan tampil di sini.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const isPending = order.status === 'PENDING'
                    const isPaid = order.status === 'PROCESSING'
                    return (
                      <div key={order.id} className="rounded-2xl border-2 border-border/70 p-4 sm:p-5 hover:border-primary/45 transition-all space-y-4 bg-surface/10">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
                          <div>
                            <p className="text-xs text-muted font-semibold">ID PESANAN: <span className="font-bold text-ink">{order.id.slice(-8).toUpperCase()}</span></p>
                            <p className="text-[10px] text-muted font-medium mt-0.5">{formatDate(order.createdAt)}</p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                            order.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                            order.status === 'PROCESSING' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                            order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                            order.status === 'DELIVERED' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                            'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Order Items Summary */}
                        <div className="space-y-2">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs sm:text-sm font-semibold">
                              <span className="text-muted line-clamp-1">{item.product?.name || 'Produk'} <span className="text-ink">x{item.quantity}</span></span>
                              <span className="text-ink shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 border-t border-border/60">
                          <div>
                            <p className="text-[10px] font-semibold text-muted uppercase">Total Pembayaran</p>
                            <p className="text-base font-black text-primary-dark">{formatCurrency(order.totalPrice)}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link href={`/orders/${order.id}`} className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-border px-4 py-2 text-xs font-bold text-ink hover:bg-surface/50 transition-all text-center">
                              <span>Detail Pesanan</span>
                            </Link>

                            {isPending && (
                              <Link href={`/orders/${order.id}/payment`} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-black text-white hover:bg-primary-dark hover:shadow-soft active:scale-[0.98] transition-all text-center">
                                <span>Bayar Sekarang (QRIS)</span>
                                <ArrowRight size={13} />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="rounded-[2.25rem] border border-border/70 bg-white p-5 sm:p-6 md:p-8 shadow-soft space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-lg sm:text-xl font-black text-ink tracking-tight flex items-center gap-2">
                  <MapPin size={20} className="text-primary" />
                  <span>Daftar Alamat Kirim</span>
                </h2>
                {!showAddressForm && (
                  <Button variant="secondary" onClick={() => setShowAddressForm(true)} size="sm">
                    <Plus size={13} /> Alamat Baru
                  </Button>
                )}
              </div>

              {showAddressForm && (
                <form onSubmit={handleCreateAddress} className="border-2 border-border/70 rounded-[1.75rem] p-4 sm:p-5 bg-surface/30 space-y-4">
                  <h3 className="font-bold text-sm text-ink">Alamat Baru</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Label Alamat (cth: Rumah)" value={label} onChange={(e) => setLabel(e.target.value)} required />
                    <Input label="Nama Penerima" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Telepon" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    <Input label="Kode Pos" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                  </div>
                  <Input label="Alamat Lengkap" value={addressVal} onChange={(e) => setAddressVal(e.target.value)} required />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Kota/Kabupaten" value={city} onChange={(e) => setCity(e.target.value)} required />
                    <Input label="Provinsi" value={province} onChange={(e) => setProvince(e.target.value)} required />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setShowAddressForm(false)} size="sm">Batal</Button>
                    <Button type="submit" loading={submitting} size="sm">Simpan Alamat</Button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {addresses.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/70 p-8 text-center">
                    <p className="text-sm text-muted font-medium">Belum ada alamat terdaftar.</p>
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <div key={addr.id} className="flex justify-between items-start rounded-2xl border-2 border-border/70 bg-white p-4 sm:p-5 hover:border-primary/45 transition-colors">
                      <div className="text-sm text-ink space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold">{addr.recipientName}</p>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted bg-border/40 px-2 py-0.5 rounded-md">Utama</span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-muted/80">{addr.phone}</p>
                        <p className="text-xs sm:text-sm font-medium text-muted leading-relaxed mt-1">
                          {addr.address}, {addr.city}, {addr.province} - {addr.postalCode}
                        </p>
                      </div>
                      <button onClick={() => handleDeleteAddress(addr.id)} className="text-muted/40 hover:text-red-500 p-1.5 rounded-full hover:bg-rose-50 transition-colors shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="rounded-[2.25rem] border border-border/70 bg-white p-5 sm:p-6 md:p-8 shadow-soft space-y-5">
              <h2 className="text-lg sm:text-xl font-black text-ink tracking-tight flex items-center gap-2">
                <Star size={20} className="text-primary" />
                <span>Ulasan Anda</span>
              </h2>

              {reviews.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-border/70 p-10 text-center space-y-3">
                  <Star className="mx-auto text-muted/30" size={48} />
                  <p className="font-bold text-ink text-base">Belum Ada Ulasan</p>
                  <p className="text-xs text-muted font-medium">Semua ulasan produk yang telah Anda kirimkan akan tampil di sini.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-2xl border-2 border-border/70 p-4 sm:p-5 hover:border-primary/45 transition-all space-y-3 bg-surface/10">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
                        <div className="min-w-0">
                          <p className="text-xs text-muted font-medium">{formatDate(review.createdAt)}</p>
                          <Link href={`/product/${review.productId}`} className="font-bold text-sm text-ink hover:text-primary transition-colors line-clamp-1 mt-0.5">
                            {review.product?.name || 'Produk'}
                          </Link>
                        </div>
                        {/* Rating Stars */}
                        <div className="flex gap-0.5 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14} className={i < review.rating ? 'fill-amber-500' : 'text-border'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-muted leading-relaxed">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="rounded-[2.25rem] border border-border/70 bg-white p-5 sm:p-6 md:p-8 shadow-soft space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-lg sm:text-xl font-black text-ink tracking-tight flex items-center gap-2">
                  <Bell size={20} className="text-primary" />
                  <span>Notifikasi</span>
                </h2>
                {notifications.some(n => !n.isRead) && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark hover:underline transition-all"
                  >
                    <Check size={14} />
                    <span>Tandai Semua Dibaca</span>
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-border/70 p-10 text-center space-y-3">
                  <Bell className="mx-auto text-muted/30" size={48} />
                  <p className="font-bold text-ink text-base">Belum Ada Notifikasi</p>
                  <p className="text-xs text-muted font-medium">Anda akan menerima update penting melalui notifikasi.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {notifications.map((notif) => {
                    const isSellerApproval = notif.type === 'SELLER_APPROVED' || notif.title?.includes('Disetujui')
                    
                    return (
                      <div key={notif.id} className="flex gap-4 py-4 first:pt-0 last:pb-0 items-start justify-between">
                        <div className="flex gap-3 items-start min-w-0">
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-sm mt-0.5 ${
                            notif.isRead ? 'bg-muted/10 text-muted' : 'bg-primary/10 text-primary animate-pulse'
                          }`}>
                            {isSellerApproval ? '🎉' : '📢'}
                          </span>
                          <div className="min-w-0">
                            <p className={`text-sm leading-relaxed ${notif.isRead ? 'text-muted font-medium' : 'text-ink font-bold'}`}>
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-muted mt-1 font-semibold">{formatDate(notif.createdAt)}</p>
                          </div>
                        </div>
                        
                        {!notif.isRead && (
                          isSellerApproval ? (
                            <button
                              onClick={() => handleAcceptSeller(notif)}
                              className="shrink-0 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-xl transition-all"
                            >
                              <ShieldCheck size={12} />
                              <span>Aktifkan</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMarkAsRead(notif.id)}
                              className="shrink-0 text-[10px] font-black uppercase tracking-wider text-primary hover:text-primary-dark hover:underline bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-xl transition-all"
                            >
                              Tandai Dibaca
                            </button>
                          )
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={sellerApprovalNotif !== null}
        onClose={() => setSellerApprovalNotif(null)}
        title="Aktifkan Akun Seller"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSellerApprovalNotif(null)}>
              Nanti Saja
            </Button>
            <Button onClick={handleConfirmSeller}>
              OK, Aktifkan Sekarang
            </Button>
          </>
        }
      >
        <div className="text-center space-y-4">
          <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/25 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <Store size={32} />
          </div>
          <div className="space-y-2">
            <p className="text-base font-bold text-ink">Akun Seller Anda Telah Disetujui!</p>
            <p className="text-sm text-muted leading-relaxed">
              Admin telah memverifikasi akun seller Anda. Tekan tombol di bawah untuk mengaktifkan toko Anda dan mulai berjualan.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  )
}
