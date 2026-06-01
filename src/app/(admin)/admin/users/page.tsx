'use client'

import { useEffect, useState } from 'react'
import { usersApi } from '@/lib/api/users'
import { User } from '@/types'
import { Skeleton } from '@/components/ui/Skeleton'
import Badge from '@/components/ui/Badge'
import { toast } from '@/lib/hooks/useToast'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)

  useEffect(() => {
    usersApi.getAll()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [])

  const handleVerify = async (userId: string) => {
    setVerifyingId(userId)
    try {
      await usersApi.verifyUser(userId)
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isVerified: true } : u))
      )
      toast.success('Seller berhasil diverifikasi!')
    } catch (e: any) {
      toast.error(e.message || 'Gagal memverifikasi seller')
    } finally {
      setVerifyingId(null)
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
          <h1 className="text-2xl font-bold text-[#1c1c19]">Kelola Pengguna</h1>
          <p className="text-sm text-[#83746a] mt-1">Lihat dan kelola semua pengguna terdaftar.</p>
        </div>
        <div className="bg-[#ebe8e3] text-[#50443c] px-4 py-2 rounded-xl text-sm font-bold">
          Total: {users.length} Pengguna
        </div>
      </div>

      <div className="bg-white border border-[#d5c3b8] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f6f3ee] text-[#83746a] border-b border-[#d5c3b8]">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d5c3b8]/50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#f6f3ee]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#ebe8e3] flex items-center justify-center overflow-hidden shrink-0">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="font-bold text-[#83746a]">{user.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-[#1c1c19]">{user.name}</p>
                        <p className="text-[10px] text-[#83746a]">ID: {user.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#50443c]">{user.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === 'ADMIN' ? 'danger' : user.role === 'SELLER' ? 'primary' : 'secondary'} size="sm">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {user.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">
                        Terverifikasi
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-lg">
                        Belum Verifikasi
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'SELLER' && !user.isVerified ? (
                      <button
                        onClick={() => handleVerify(user.id)}
                        disabled={verifyingId === user.id}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {verifyingId === user.id ? (
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : null}
                        {verifyingId === user.id ? 'Memproses...' : 'Verifikasi'}
                      </button>
                    ) : (
                      <span className="text-xs text-[#83746a]">—</span>
                    )}
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#83746a]">
                    Belum ada pengguna.
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

