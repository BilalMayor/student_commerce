'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { usersApi } from '@/lib/api/users'
import { User } from '@/types'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { ShieldCheck, Store, Clock } from 'lucide-react'
import { toast } from '@/lib/hooks/useToast'

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSellers = () => {
    setLoading(true)
    usersApi.getAll()
      .then((data) => {
        // Filter: user dengan role SELLER atau sellerStatus PENDING
        const filteredSellers = data.filter((u) => 
          u.role === 'SELLER' || u.sellerStatus === 'PENDING' || u.sellerStatus === 'APPROVED'
        )
        setSellers(filteredSellers)
      })
      .catch(() => setSellers([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchSellers() }, [])

  const handleVerify = async (id: string) => {
    try {
      await usersApi.verifySeller(id)
      toast.success('Seller berhasil diverifikasi!')
      fetchSellers()
    } catch (e: any) {
      toast.error(e.message || 'Gagal memverifikasi seller')
    }
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar type="admin" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 sm:space-y-8 pb-24 lg:pb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink">Verifikasi Penjual</h1>
          <p className="text-muted text-sm mt-1">Kelola pendaftaran seller yang menunggu atau sudah terverifikasi</p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-border/70 bg-white p-6">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ) : sellers.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-border/70 bg-white p-12 text-center">
            <Store size={48} className="mx-auto text-muted/40 mb-3" />
            <p className="text-muted font-medium">Belum ada seller terdaftar</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface/80 border-b border-border/60 text-[10px] uppercase font-bold tracking-wider text-muted">
                  <tr>
                    <th className="px-5 sm:px-6 py-3.5">Seller</th>
                    <th className="px-5 sm:px-6 py-3.5">Toko</th>
                    <th className="px-5 sm:px-6 py-3.5">Kategori</th>
                    <th className="px-5 sm:px-6 py-3.5">Status</th>
                    <th className="px-5 sm:px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {sellers.map((s) => {
                    const isPending = s.sellerStatus === 'PENDING'
                    const isApproved = s.sellerStatus === 'APPROVED' || s.role === 'SELLER'
                    
                    return (
                      <tr key={s.id} className="hover:bg-surface/40 transition-colors">
                        <td className="px-5 sm:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {s.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-ink">{s.name}</div>
                              <div className="text-xs text-muted">{s.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 sm:px-6 py-4">
                          <div className="font-semibold text-ink">{s.shopName || '-'}</div>
                          <div className="text-xs text-muted line-clamp-1">{s.shopDescription || '-'}</div>
                        </td>
                        <td className="px-5 sm:px-6 py-4">
                          <span className="text-sm font-medium text-muted">{s.category || '-'}</span>
                        </td>
                        <td className="px-5 sm:px-6 py-4">
                          {isPending ? (
                            <Badge variant="warning">
                              <Clock size={12} />
                              Pending
                            </Badge>
                          ) : isApproved ? (
                            <Badge variant="success">
                              <ShieldCheck size={12} />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="default">Unknown</Badge>
                          )}
                        </td>
                        <td className="px-5 sm:px-6 py-4 text-right">
                          {isPending && (
                            <Button onClick={() => handleVerify(s.id)} size="sm">
                              <ShieldCheck size={14} />
                              Verifikasi
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
