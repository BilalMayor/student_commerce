'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/layout/Sidebar'
import { productsApi } from '@/lib/api/products'
import { Product } from '@/types'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { resolveImageUrl } from '@/lib/utils/image'
import { Plus, Edit2, Trash2, Package } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = () => {
    setLoading(true)
    productsApi.getAll()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus produk ini?')) return
    try {
      await productsApi.delete(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (e: any) {
      alert(e.message || 'Gagal menghapus produk')
    }
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar type="seller" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 sm:space-y-8 pb-24 lg:pb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink">Produk Saya</h1>
            <p className="text-muted text-sm mt-1">Daftar produk dan jasa yang kamu jual.</p>
          </div>
          <Link href="/seller/products/new">
            <Button>
              <Plus size={18} />
              Tambah Produk
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-border/70 bg-white p-6">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/70 bg-white p-12 text-center space-y-4">
            <Package size={48} className="mx-auto text-muted/30" />
            <p className="text-muted font-medium">Belum ada produk terdaftar.</p>
            <Link href="/seller/products/new">
              <Button variant="secondary" size="sm">Tambah Produk Pertama</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface/80 border-b border-border/60 text-[10px] uppercase font-bold tracking-wider text-muted">
                  <tr>
                    <th className="px-5 sm:px-6 py-3.5 font-bold">Gambar</th>
                    <th className="px-5 sm:px-6 py-3.5 font-bold">Nama Produk</th>
                    <th className="px-5 sm:px-6 py-3.5 font-bold">Harga</th>
                    <th className="px-5 sm:px-6 py-3.5 font-bold">Stok</th>
                    <th className="px-5 sm:px-6 py-3.5 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-surface/40 transition-colors">
                      <td className="px-5 sm:px-6 py-4 font-medium">
                        <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-accent/20 border border-border/70 flex items-center justify-center text-xl">
                          {p.imageUrl ? (
                            <img src={resolveImageUrl(p.imageUrl)} alt={p.name} className="h-full w-full object-cover" />
                          ) : (
                            '🛍️'
                          )}
                        </div>
                      </td>
                      <td className="px-5 sm:px-6 py-4 font-medium">
                        <div className="font-semibold text-ink">{p.name}</div>
                      </td>
                      <td className="px-5 sm:px-6 py-4 font-medium">
                        <span className="font-bold text-primary">{formatCurrency(p.price)}</span>
                      </td>
                      <td className="px-5 sm:px-6 py-4 font-medium text-muted">
                        {p.productType === 'DIGITAL' || p.stock < 0 || p.stock > 99999
                          ? <span className="text-emerald-600 font-bold">∞ Tak Terbatas</span>
                          : p.stock}
                      </td>
                      <td className="px-5 sm:px-6 py-4 font-medium text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/seller/products/${p.id}`}>
                            <button className="rounded-xl border border-border/70 p-2 hover:bg-surface text-muted hover:text-ink transition-all">
                              <Edit2 size={15} />
                            </button>
                          </Link>
                          <button onClick={() => handleDelete(p.id)} className="rounded-xl border border-border/70 p-2 hover:bg-red-50 text-red-400 hover:text-red-600 transition-all">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
