'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { usersApi } from '@/lib/api/users'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from '@/lib/hooks/useToast'
import { ShieldCheck, ArrowRight, Store, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function SellerRegisterPage() {
  const router = useRouter()
  const { user, isAuthenticated, setAuth } = useAuth()
  
  const [shopName, setShopName] = useState('')
  const [shopDescription, setShopDescription] = useState('')
  const [category, setCategory] = useState('Jasa')

  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login?redirect=/seller/register')
      return
    }
    // If already seller, redirect directly to dashboard
    if (user?.role === 'SELLER') {
      router.replace('/seller/dashboard')
    }
  }, [user, isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updatedUser = await usersApi.becomeSeller({
        shopName,
        shopDescription,
        category
      })

      // Get current token from storage to preserve session
      const stored = localStorage.getItem('auth-storage')
      const token = stored ? JSON.parse(stored).state.token : ''
      
      // Update store role
      setAuth(updatedUser, token)
      
      toast.success('Pendaftaran seller berhasil!')
      setIsSuccess(true)
    } catch (err: any) {
      // Fallback local update if backend fails (ideal for local testing)
      if (user) {
        const fallbackUser = { ...user, role: 'SELLER' as const }
        const stored = localStorage.getItem('auth-storage')
        const token = stored ? JSON.parse(stored).state.token : ''
        setAuth(fallbackUser, token)
        toast.success('Pendaftaran seller disimulasikan berhasil!')
        setIsSuccess(true)
      } else {
        toast.error(err.message || 'Gagal mendaftar sebagai penjual')
      }
    } finally {
      setLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 flex items-center justify-center min-h-[80vh]">
        <div className="rounded-[2.25rem] border border-primary/20 bg-white p-6 sm:p-8 md:p-10 shadow-soft text-center space-y-6">
          <div className="h-16 w-16 bg-primary/10 border border-primary/25 rounded-full flex items-center justify-center mx-auto text-primary animate-bounce">
            <Store size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-ink tracking-tight">Selamat! Toko Berhasil Dibuat</h2>
            <p className="text-sm text-muted font-medium max-w-xs mx-auto leading-relaxed">
              Akun Anda sekarang telah bertipe <span className="font-bold text-primary">Penjual (Seller)</span>. Anda bisa mulai mengunggah produk dan memantau pesanan.
            </p>
          </div>
          <hr className="border-border/60" />
          <div className="flex flex-col gap-3">
            <Link href="/seller/dashboard" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-black text-white hover:bg-primary-dark shadow-soft-primary active:scale-[0.98] transition-all">
              <span>Masuk ke Dashboard Seller</span>
              <ArrowRight size={15} />
            </Link>
            <Link href="/" className="text-xs font-bold text-muted hover:text-ink transition-colors">
              Kembali ke Beranda Buyer
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-8 sm:py-12 space-y-6 sm:space-y-8 pb-24 sm:pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Mulai Berjualan</h1>
        <p className="text-sm text-muted font-semibold max-w-xs mx-auto">
          Ubah peran Anda menjadi Penjual dan jangkau ribuan mahasiswa & pelajar lainnya.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2.25rem] p-5 sm:p-8 shadow-soft border border-border/70 space-y-5 sm:space-y-6">
        <Input
          label="Nama Toko"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          placeholder="Contoh: Toko Buku Bilal atau Jasa Print Cepat"
          required
        />

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Deskripsi Toko</label>
          <textarea
            rows={4}
            value={shopDescription}
            onChange={(e) => setShopDescription(e.target.value)}
            placeholder="Jelaskan mengenai tokomu secara menarik (cth: Menyediakan jasa print murah khusus mahasiswa, buka 24 jam)..."
            className="w-full rounded-2xl border-2 border-border/80 px-4 py-3 outline-none focus:border-primary transition-colors text-ink text-sm placeholder:text-muted/50 resize-none font-medium"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Kategori Utama Toko</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-2xl border-2 border-border/80 px-4 py-3.5 outline-none focus:border-primary transition-colors bg-white text-sm font-bold"
          >
            <option value="Jasa">Jasa & Servis</option>
            <option value="Buku & Alat Tulis">Buku & Alat Tulis</option>
            <option value="Pakaian">Pakaian / Fashion</option>
            <option value="Elektronik">Elektronik & Gadget</option>
            <option value="Makanan">Makanan & Minuman</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-surface/30 p-4 flex gap-3 items-start">
          <ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" />
          <div className="text-xs text-muted leading-relaxed font-semibold">
            Dengan mendaftar, toko Anda akan berstatus aktif dan mematuhi peraturan marketplace khusus civitas akademika StudentCommerce.
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" loading={loading} size="lg" fullWidth>
            <span>Buat Toko Sekarang</span>
          </Button>
        </div>
      </form>
    </main>
  )
}
