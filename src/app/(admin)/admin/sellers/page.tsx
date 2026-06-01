'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { usersApi } from '@/lib/api/users'
import { User } from '@/types'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { ShieldCheck } from 'lucide-react'

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSellers = () => {
    setLoading(true)
    usersApi.getAll()
      .then((data) => setSellers(data.filter((u) => u.role === 'SELLER')))
      .catch(() => setSellers([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchSellers() }, [])

  const handleVerify = async (id: string) => {
    try {
      await usersApi.verifyUser(id)
      fetchSellers()
    } catch (e: any) {
      alert(e.message || 'Gagal memverifikasi')
    }
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar type="admin" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 sm:space-y-8 pb-24 lg:pb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink">Verifikasi Penjual</h1>
          <p className="text-muted text-sm mt-1">Daftar penjual yang menunggu atau sudah terverifikasi.</p>
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
          <div className="rounded-3xl border border-dashed border-border/70 bg-white p-12 text-center text-muted">
            Belum ada penjual terdaftar.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface/80 border-b border-border/60 text-[10px] uppercase font-bold tracking-wider text-muted">
                  <tr>
                    <th className="px-5 sm:px-6 py-3.5 font-bold">ID</th>
                    <th className="px-5 sm:px-6 py-3.5 font-bold">Nama</th>
                    <th className="px-5 sm:px-6 py-3.5 font-bold">Email</th>
                    <th className="px-5 sm:px-6 py-3.5 font-bold">Status</th>
                    <th className="px-5 sm:px-6 py-3.5 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {sellers.map((s) => (
                    <tr key={s.id} className="hover:bg-surface/40 transition-colors">
                      <td className="px-5 sm:px-6 py-4 font-medium">
                        <span className="font-mono text-xs text-muted">#{s.id.slice(-8)}</span>
                      </td>
                      <td className="px-5 sm:px-6 py-4 font-medium">
                        <div className="font-semibold text-ink">{s.name}</div>
                      </td>
                      <td className="px-5 sm:px-6 py-4 font-medium text-muted">{s.email}</td>
                      <td className="px-5 sm:px-6 py-4 font-medium">
                        <Badge variant={s.isVerified ? 'success' : 'warning'}>
                          {s.isVerified ? 'Terverifikasi' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="px-5 sm:px-6 py-4 font-medium text-right">
                        {!s.isVerified && (
                          <Button onClick={() => handleVerify(s.id)} size="sm">
                            <ShieldCheck size={14} />
                            Verifikasi
                          </Button>
                        )}
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
