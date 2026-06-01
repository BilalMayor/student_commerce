'use client'

import { useEffect, useState } from 'react'
import { productsApi } from '@/lib/api/products'
import { Product } from '@/types'
import { Skeleton } from '@/components/ui/Skeleton'
import { toast } from '@/lib/hooks/useToast'
import { Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { resolveImageUrl } from '@/lib/utils/image'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productsApi.getAll()
      .then(setProducts)
      .catch(() => toast.error('Gagal memuat produk'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.')) return
    try {
      await productsApi.delete(id)
      setProducts(products.filter(p => p.id !== id))
      toast.success('Produk berhasil dihapus')
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus produk')
    }
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
          <h1 className="text-2xl font-bold text-[#1c1c19]">Semua Produk</h1>
          <p className="text-sm text-[#83746a] mt-1">Kelola seluruh produk yang diunggah oleh penjual.</p>
        </div>
        <div className="bg-[#ebe8e3] text-[#50443c] px-4 py-2 rounded-xl text-sm font-bold">
          Total: {products.length} Produk
        </div>
      </div>

      <div className="bg-white border border-[#d5c3b8] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f6f3ee] text-[#83746a] border-b border-[#d5c3b8]">
              <tr>
                <th className="px-6 py-4 font-semibold">Produk</th>
                <th className="px-6 py-4 font-semibold">Tipe</th>
                <th className="px-6 py-4 font-semibold">Harga</th>
                <th className="px-6 py-4 font-semibold">Stok</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d5c3b8]/50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[#f6f3ee]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-[#ebe8e3] flex items-center justify-center overflow-hidden shrink-0 border border-[#d5c3b8]">
                        {product.imageUrl ? (
                          <img src={resolveImageUrl(product.imageUrl)} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xl">📦</span>
                        )}
                      </div>
                      <div className="min-w-0 max-w-[200px]">
                        <Link href={`/product/${product.id}`} className="font-bold text-[#1c1c19] hover:underline truncate block" title={product.name}>
                          {product.name}
                        </Link>
                        <p className="text-[10px] text-[#83746a] mt-0.5">Toko ID: {product.sellerId.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.productType === 'DIGITAL' ? (
                      <Badge variant="warning" size="sm">Digital</Badge>
                    ) : (
                      <Badge variant="secondary" size="sm">Fisik</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#1c1c19]">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4 text-[#50443c]">
                    {product.productType === 'DIGITAL' || product.stock < 0 || product.stock > 99999
                      ? <span className="text-emerald-600 font-bold">∞ Tak Terbatas</span>
                      : `${product.stock} pcs`}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl transition-colors"
                      title="Hapus Produk (Melanggar Aturan)"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#83746a]">
                    Belum ada produk yang dijual di platform.
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
