'use client'

import { useEffect, useState, use } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import { productsApi } from '@/lib/api/products'
import { categoriesApi } from '@/lib/api/categories'
import { uploadImage } from '@/lib/api/upload'
import { Category, Product } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { ArrowLeft, Upload } from 'lucide-react'

export default function EditProductPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise)
  const router = useRouter()
  const productId = params.id
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [stock, setStock] = useState(1)
  const [categoryId, setCategoryId] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    Promise.all([
      categoriesApi.getAll(),
      productsApi.getById(productId)
    ]).then(([cats, prod]) => {
      setCategories(cats)
      setName(prod.name)
      setDescription(prod.description)
      setPrice(prod.price)
      setStock(prod.stock)
      setCategoryId(prod.categoryId)
      setImageUrl(prod.imageUrl || '')
    }).catch(() => alert('Gagal memuat detail produk'))
    .finally(() => setLoading(false))
  }, [productId])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await uploadImage(file)
      setImageUrl(res.url)
    } catch (e: any) {
      alert(e.message || 'Gagal mengupload gambar')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitLoading(true)
    try {
      await productsApi.update(productId, { name, description, price, stock, categoryId })
      router.push('/seller/products')
    } catch (e: any) {
      alert(e.message || 'Gagal memperbarui produk')
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-bg">
        <Sidebar type="seller" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <Skeleton className="h-96 w-full max-w-2xl rounded-3xl" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar type="seller" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 sm:space-y-8 pb-24 lg:pb-8">
        <div>
          <button onClick={() => router.push('/seller/products')} className="inline-flex items-center gap-2 text-muted font-bold text-xs hover:text-primary transition-colors bg-border/20 px-4 py-2.5 rounded-full mb-4">
            <ArrowLeft size={13} /> Kembali
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-ink">Edit Produk</h1>
          <p className="text-muted text-sm mt-1">Ubah rincian produk atau jasa Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-3xl p-5 sm:p-8 shadow-soft border border-border/70 space-y-5 sm:space-y-6">
          <Input label="Nama Produk / Jasa" value={name} onChange={(e) => setName(e.target.value)} required />

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Deskripsi Lengkap</label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl border-2 border-border/80 px-4 py-3 outline-none focus:border-primary transition-colors text-ink text-sm resize-none"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Harga (IDR)" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} min={0} required />
            <Input label="Stok Tersedia" type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} min={1} required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Kategori</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-2xl border-2 border-border/80 px-4 py-3.5 outline-none focus:border-primary transition-colors bg-white text-sm font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Foto Produk</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-surface border-2 border-border/80 hover:border-primary rounded-2xl px-4 py-3 text-xs font-bold text-primary transition-colors flex items-center gap-2">
                  <Upload size={14} />
                  {imageUrl ? 'Ganti Berkas' : 'Pilih Berkas'}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
                {imageUrl && <span className="text-xs text-emerald-600 font-bold">Terunggah ✓</span>}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
            <Button type="button" variant="ghost" onClick={() => router.push('/seller/products')}>Batal</Button>
            <Button type="submit" loading={submitLoading}>Simpan Perubahan</Button>
          </div>
        </form>
      </main>
    </div>
  )
}
