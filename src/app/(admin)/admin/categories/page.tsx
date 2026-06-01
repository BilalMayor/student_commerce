'use client'

import { useEffect, useState } from 'react'
import { categoriesApi } from '@/lib/api/categories'
import { Category } from '@/types'
import { Skeleton } from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from '@/lib/hooks/useToast'
import { Plus, Trash2 } from 'lucide-react'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [iconUrl, setIconUrl] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = () => {
    setLoading(true)
    categoriesApi.getAll()
      .then(setCategories)
      .catch(() => toast.error('Gagal memuat kategori'))
      .finally(() => setLoading(false))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const newCat = await categoriesApi.create({ name, slug, iconUrl })
      setCategories([...categories, newCat])
      toast.success('Kategori berhasil ditambahkan')
      setName(''); setSlug(''); setIconUrl('')
      setShowForm(false)
    } catch (err: any) {
      toast.error(err.message || 'Gagal membuat kategori')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kategori ini?')) return
    try {
      await categoriesApi.delete(id)
      setCategories(categories.filter(c => c.id !== id))
      toast.success('Kategori berhasil dihapus')
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus kategori')
    }
  }

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val)
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1c19]">Kelola Kategori</h1>
          <p className="text-sm text-[#83746a] mt-1">Atur kategori produk yang tersedia di platform.</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus size={16} /> Tambah Kategori
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-[#d5c3b8] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-[#1c1c19] text-lg mb-2">Kategori Baru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nama Kategori" value={name} onChange={(e) => handleNameChange(e.target.value)} required />
            <Input label="Slug (URL)" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </div>
          <Input label="URL Icon (Opsional)" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} placeholder="https://..." />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)} size="sm">Batal</Button>
            <Button type="submit" loading={submitting} size="sm">Simpan</Button>
          </div>
        </form>
      )}

      <div className="bg-white border border-[#d5c3b8] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f6f3ee] text-[#83746a] border-b border-[#d5c3b8]">
              <tr>
                <th className="px-6 py-4 font-semibold w-16">Icon</th>
                <th className="px-6 py-4 font-semibold">Nama Kategori</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d5c3b8]/50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#f6f3ee]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="h-10 w-10 bg-[#ebe8e3] rounded-xl flex items-center justify-center text-xl overflow-hidden">
                      {cat.iconUrl ? (
                         cat.iconUrl.startsWith('http') ? (
                          <img src={cat.iconUrl} alt={cat.name} className="h-full w-full object-cover" />
                        ) : (
                          <span>{cat.iconUrl}</span>
                        )
                      ) : '📦'}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#1c1c19]">{cat.name}</td>
                  <td className="px-6 py-4 text-[#83746a] font-mono text-xs">{cat.slug}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl transition-colors"
                      title="Hapus Kategori"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[#83746a]">
                    Belum ada kategori.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
