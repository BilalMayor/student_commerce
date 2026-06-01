'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import { productsApi } from '@/lib/api/products'
import { categoriesApi } from '@/lib/api/categories'
import { uploadImage, uploadFile } from '@/lib/api/upload'
import { Category } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { ArrowLeft, Upload, FileText, Package, Cloud } from 'lucide-react'
import { toast } from '@/lib/hooks/useToast'

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  
  // Basic Form State
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [stock, setStock] = useState(1)
  const [digitalStock, setDigitalStock] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  
  // Product Type and Additional Fields
  const [productType, setProductType] = useState<'PHYSICAL' | 'DIGITAL'>('PHYSICAL')
  const [weight, setWeight] = useState(100) // Default 100 grams
  const [fileUrl, setFileUrl] = useState('')
  const [fileSize, setFileSize] = useState(0)
  const [fileName, setFileName] = useState('')

  // UI state
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)

  useEffect(() => {
    categoriesApi.getAll()
      .then((data) => { 
        setCategories(data)
        if (data[0]) setCategoryId(data[0].id) 
      })
      .catch(() => toast.error('Gagal memuat kategori'))
      .finally(() => setLoading(false))
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const res = await uploadImage(file)
      setImageUrl(res.url)
      toast.success('Foto produk berhasil diupload!')
    } catch (e: any) {
      toast.error(e.message || 'Gagal mengupload gambar')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingFile(true)
    try {
      const res = await uploadFile(file)
      setFileUrl(res.url)
      setFileSize(res.size || file.size)
      setFileName(file.name)
      toast.success('File digital berhasil diupload!')
    } catch (e: any) {
      toast.error(e.message || 'Gagal mengupload file')
    } finally {
      setUploadingFile(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryId) {
      toast.error('Silakan pilih kategori produk')
      return
    }

    if (productType === 'DIGITAL' && !fileUrl) {
      toast.error('Silakan upload file produk digital terlebih dahulu')
      return
    }

    setSubmitLoading(true)
    try {
      await productsApi.create({
        name,
        description,
        price,
        stock: productType === 'DIGITAL' ? (digitalStock ? Number(digitalStock) : -1) : stock,
        categoryId,
        productType,
        imageUrl: imageUrl || undefined,
        weight: productType === 'PHYSICAL' ? weight : undefined,
        fileUrl: productType === 'DIGITAL' ? fileUrl : undefined,
        fileSize: productType === 'DIGITAL' ? fileSize : undefined
      })
      toast.success('Produk berhasil ditambahkan!')
      router.push('/seller/products')
    } catch (e: any) {
      toast.error(e.message || 'Gagal menambahkan produk')
    } finally {
      setSubmitLoading(false)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-bg">
        <Sidebar type="seller" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <Skeleton className="h-96 w-full max-w-2xl rounded-[2.25rem]" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar type="seller" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 sm:space-y-8 pb-24 lg:pb-8">
        <div>
          <button 
            onClick={() => router.push('/seller/products')} 
            className="inline-flex items-center gap-2 text-muted font-bold text-xs hover:text-primary transition-colors bg-border/20 px-4 py-2.5 rounded-full mb-4"
          >
            <ArrowLeft size={13} /> Kembali
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Tambah Produk Baru</h1>
          <p className="text-muted text-sm mt-1">Publikasikan produk fisik atau digital yang ingin Anda tawarkan.</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-[2.25rem] p-5 sm:p-8 shadow-soft border border-border/70 space-y-5 sm:space-y-6">
          
          {/* Product Type Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-ink">Tipe Produk</label>
            <div className="grid grid-cols-2 p-1.5 bg-surface rounded-2xl border border-border/60">
              <button
                type="button"
                onClick={() => setProductType('PHYSICAL')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  productType === 'PHYSICAL'
                    ? 'bg-primary text-white shadow-soft-primary'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <Package size={16} />
                <span>Fisik</span>
              </button>
              <button
                type="button"
                onClick={() => setProductType('DIGITAL')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  productType === 'DIGITAL'
                    ? 'bg-primary text-white shadow-soft-primary'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <Cloud size={16} />
                <span>Digital / Jasa</span>
              </button>
            </div>
          </div>

          <Input 
            label="Nama Produk / Jasa" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Contoh: Jasa Print 3D atau Kaos Angkatan" 
            required 
          />

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Deskripsi Lengkap</label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsikan dengan detail mengenai spesifikasi produk atau tata cara jasa..."
              className="w-full rounded-2xl border-2 border-border/80 px-4 py-3 outline-none focus:border-primary transition-colors text-ink text-sm placeholder:text-muted/50 resize-none font-medium"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input 
              label="Harga (IDR)" 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(Number(e.target.value))} 
              min={0} 
              required 
            />
            
            {productType === 'PHYSICAL' ? (
              <Input 
                label="Stok Barang" 
                type="number" 
                value={stock} 
                onChange={(e) => setStock(Number(e.target.value))} 
                min={1} 
                required 
              />
            ) : (
              <div className="space-y-1">
                <Input 
                  label="Batas Penjualan (Opsional)" 
                  type="number" 
                  value={digitalStock} 
                  onChange={(e) => setDigitalStock(e.target.value)} 
                  min={1} 
                  placeholder="Kosongkan untuk tidak terbatas"
                />
                <p className="text-[10px] font-semibold text-muted/70 px-1">Isi jika ingin membatasi jumlah penjualan produk digital ini.</p>
              </div>
            )}
          </div>

          {/* Conditional Input based on Type */}
          {productType === 'PHYSICAL' ? (
            <Input 
              label="Berat Barang (Gram)" 
              type="number" 
              value={weight} 
              onChange={(e) => setWeight(Number(e.target.value))} 
              min={1} 
              required 
            />
          ) : (
            <div className="space-y-2 border-2 border-dashed border-border/80 rounded-2xl p-4 sm:p-5 bg-surface/10">
              <label className="block text-sm font-bold text-ink">File Digital</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2">
                <label className="cursor-pointer bg-white border-2 border-border/80 hover:border-primary rounded-xl px-4 py-3 text-xs font-bold text-primary transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0">
                  {uploadingFile ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <Upload size={14} />
                  )}
                  <span>{uploadingFile ? 'Mengupload...' : 'Pilih File (ZIP, PDF, dll)'}</span>
                  <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploadingFile} />
                </label>

                {fileUrl ? (
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText size={18} className="text-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-ink truncate max-w-[200px]" title={fileName || 'File terupload'}>
                        {fileName || 'File Digital'}
                      </p>
                      <p className="text-[10px] text-muted font-semibold mt-0.5">{formatSize(fileSize)}</p>
                    </div>
                    <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">Berhasil</span>
                  </div>
                ) : (
                  <p className="text-xs text-muted font-semibold mt-1 sm:mt-0">Belum ada file terupload.</p>
                )}
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Kategori</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-2xl border-2 border-border/80 px-4 py-3.5 outline-none focus:border-primary transition-colors bg-white text-sm font-bold"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Foto Preview Produk</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-white border-2 border-border/80 hover:border-primary rounded-xl px-4 py-3 text-xs font-bold text-primary transition-colors flex items-center gap-2 shadow-sm">
                  {uploadingImage ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <Upload size={14} />
                  )}
                  <span>Pilih Gambar</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
                {imageUrl && (
                  <div className="flex items-center gap-2">
                    <img src={imageUrl} alt="preview" className="h-10 w-10 object-cover rounded-lg border border-border" />
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Terunggah</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t border-border/60">
            <Button type="button" variant="ghost" onClick={() => router.push('/seller/products')}>Batal</Button>
            <Button type="submit" loading={submitLoading}>Publikasikan Produk</Button>
          </div>
        </form>
      </main>
    </div>
  )
}
