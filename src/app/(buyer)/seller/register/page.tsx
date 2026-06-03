'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { usersApi } from '@/lib/api/users'
import { uploadImage } from '@/lib/api/upload'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { toast } from '@/lib/hooks/useToast'
import { ShieldCheck, ArrowRight, Store, Upload, X, Image as ImageIcon, Clock } from 'lucide-react'
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
  const [showSuccessModal, setShowSuccessModal] = useState(false)

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

      toast.success('Pendaftaran seller berhasil dikirim!')
      setShowSuccessModal(true)
    } catch (err: any) {
      toast.error(err.message || 'Gagal mendaftar sebagai penjual')
    } finally {
      setLoading(false)
    }
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
            Setelah mendaftar, akun Anda akan masuk dalam antrian verifikasi oleh admin. Anda akan mendapat notifikasi setelah disetujui.
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

      <Modal
        isOpen={showSuccessModal}
        onClose={() => router.push('/profile?tab=notifications')}
        title="Pendaftaran Terkirim"
        size="sm"
        footer={
          <Button onClick={() => router.push('/profile?tab=notifications')}>
            OK, Saya Mengerti
          </Button>
        }
      >
        <div className="text-center space-y-4">
          <div className="h-16 w-16 bg-amber-500/10 border border-amber-500/25 rounded-full flex items-center justify-center mx-auto text-amber-600">
            <Clock size={32} />
          </div>
          <div className="space-y-2">
            <p className="text-base font-bold text-ink">Mohon Tunggu Sebentar</p>
            <p className="text-sm text-muted leading-relaxed">
              Pendaftaran toko Anda telah berhasil dikirim dan sedang menunggu verifikasi dari admin.
            </p>
            <p className="text-sm font-semibold text-amber-600">
              Anda akan mendapatkan notifikasi setelah akun seller Anda diverifikasi.
            </p>
          </div>
        </div>
      </Modal>
    </main>
  )
}
