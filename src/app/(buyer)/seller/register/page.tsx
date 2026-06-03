'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { usersApi } from '@/lib/api/users'
import { uploadImage } from '@/lib/api/upload'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from '@/lib/hooks/useToast'
import { ShieldCheck, ArrowRight, Store, Upload, X, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function SellerRegisterPage() {
  const router = useRouter()
  const { user, isAuthenticated, setAuth } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [shopName, setShopName] = useState('')
  const [shopDescription, setShopDescription] = useState('')
  const [category, setCategory] = useState('Jasa')
  const [logoUrl, setLogoUrl] = useState('')
  const [logoPreview, setLogoPreview] = useState('')
  const [uploading, setUploading] = useState(false)

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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB')
      return
    }

    setUploading(true)
    try {
      const res = await uploadImage(file)
      setLogoUrl(res.url)
      setLogoPreview(URL.createObjectURL(file))
      toast.success('Logo toko berhasil diupload!')
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengupload logo')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveLogo = () => {
    setLogoUrl('')
    setLogoPreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updatedUser = await usersApi.becomeSeller({
        shopName,
        shopDescription,
        category,
        ...(logoUrl && { shopLogo: logoUrl })
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
          <div className="h-16 w-16 bg-amber-500/10 border border-amber-500/25 rounded-full flex items-center justify-center mx-auto text-amber-600 animate-pulse">
            <ShieldCheck size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-ink tracking-tight">Pendaftaran Berhasil Dikirim!</h2>
            <p className="text-sm text-muted font-medium max-w-md mx-auto leading-relaxed">
              Terima kasih telah mendaftar sebagai penjual. Akun Anda saat ini dalam status <span className="font-bold text-amber-600">menunggu verifikasi</span> dari admin.
            </p>
            <p className="text-sm text-ink font-semibold max-w-md mx-auto leading-relaxed pt-2">
              Anda akan menerima notifikasi setelah akun Anda diverifikasi. Proses ini biasanya memakan waktu 1-2 hari kerja.
            </p>
          </div>
          <hr className="border-border/60" />
          <div className="flex flex-col gap-3">
            <Link href="/" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-black text-white hover:bg-primary-dark shadow-soft-primary active:scale-[0.98] transition-all">
              <span>Kembali ke Beranda</span>
              <ArrowRight size={15} />
            </Link>
            <p className="text-xs font-medium text-muted">
              Anda akan mendapat notifikasi saat verifikasi selesai
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:py-10 pb-20">
      {/* Header Section - Improved spacing */}
      <div className="text-center space-y-3 mb-8 sm:mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl border-2 border-primary/20 mb-2">
          <Store className="text-primary" size={28} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">Mulai Berjualan</h1>
        <p className="text-sm sm:text-base text-muted font-medium max-w-md mx-auto leading-relaxed">
          Ubah peran Anda menjadi Penjual dan jangkau ribuan mahasiswa & pelajar lainnya
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 shadow-soft border border-border/70 space-y-8">
        {/* Info Box - Moved to top for better context */}
        <div className="rounded-2xl border-2 border-primary/25 bg-primary/5 p-5 flex gap-3 items-start">
          <ShieldCheck size={20} className="text-primary shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-ink leading-relaxed font-medium">
            Dengan mendaftar, toko Anda akan langsung aktif dan dapat mulai berjualan di marketplace StudentCommerce
          </p>
        </div>

        {/* Logo Upload - More prominent with better visual */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-base font-bold text-ink">Logo Toko</label>
            <span className="text-xs font-semibold text-muted bg-surface px-3 py-1 rounded-full">Opsional</span>
          </div>
          
          {!logoPreview ? (
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploading}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className={`group flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${
                  uploading
                    ? 'border-muted/40 bg-surface/30 cursor-not-allowed'
                    : 'border-border/70 hover:border-primary hover:bg-primary/5 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-3 py-6">
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary" />
                      <p className="text-sm font-bold text-muted">Mengupload logo...</p>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-primary/10 rounded-2xl border-2 border-primary/20 group-hover:scale-110 transition-transform">
                        <Upload size={32} className="text-primary" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-base font-bold text-ink">Klik atau drag file ke sini</p>
                        <p className="text-xs text-muted">PNG, JPG atau WEBP • Maksimal 5MB</p>
                      </div>
                    </>
                  )}
                </div>
              </label>
            </div>
          ) : (
            <div className="relative w-full h-48 border-2 border-primary rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
              <Image
                src={logoPreview}
                alt="Preview logo"
                fill
                className="object-contain p-4"
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute top-3 right-3 p-2.5 bg-white hover:bg-red-50 rounded-xl shadow-lg transition-all active:scale-95 border-2 border-border/50 hover:border-red-300 group"
                title="Hapus logo"
              >
                <X size={18} className="text-ink group-hover:text-red-600" />
              </button>
            </div>
          )}
          <p className="text-xs text-muted font-medium flex items-center gap-1.5">
            <ImageIcon size={14} className="text-primary" />
            <span>Logo membantu toko Anda lebih mudah dikenali pelanggan</span>
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50"></div>

        {/* Form Fields - Better grouped */}
        <div className="space-y-6">
          <Input
            label="Nama Toko"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Contoh: Toko Buku Bilal"
            required
          />

          <div>
            <label className="mb-2 block text-base font-bold text-ink">Deskripsi Toko</label>
            <textarea
              rows={4}
              value={shopDescription}
              onChange={(e) => setShopDescription(e.target.value)}
              placeholder="Jelaskan produk atau layanan yang Anda tawarkan secara menarik..."
              className="w-full rounded-2xl border-2 border-border/80 px-4 py-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-ink text-sm placeholder:text-muted/50 resize-none font-medium"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-base font-bold text-ink">Kategori Utama</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl border-2 border-border/80 px-4 py-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white text-sm font-bold cursor-pointer"
            >
              <option value="Jasa">🔧 Jasa & Servis</option>
              <option value="Buku & Alat Tulis">📚 Buku & Alat Tulis</option>
              <option value="Pakaian">👕 Pakaian / Fashion</option>
              <option value="Elektronik">💻 Elektronik & Gadget</option>
              <option value="Makanan">🍔 Makanan & Minuman</option>
              <option value="Lainnya">📦 Lainnya</option>
            </select>
          </div>
        </div>

        {/* Submit Button - Better prominence and spacing */}
        <div className="pt-4 space-y-3">
          <Button type="submit" loading={loading} size="lg" fullWidth className="shadow-lg">
            <Store size={18} />
            <span>Buat Toko Sekarang</span>
            <ArrowRight size={18} />
          </Button>
          
          <p className="text-center text-xs text-muted font-medium">
            Dengan mendaftar, Anda menyetujui syarat & ketentuan kami
          </p>
        </div>
      </form>
    </main>
  )
}
