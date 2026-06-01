'use client'

import { useEffect, useState } from 'react'
import { Users, Package, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { usersApi } from '@/lib/api/users'
import { productsApi } from '@/lib/api/products'
import { ordersApi } from '@/lib/api/orders'
import { Skeleton } from '@/components/ui/Skeleton'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      usersApi.getAll().catch(() => []),
      productsApi.getAll().catch(() => []),
      ordersApi.getAll().catch(() => [])
    ]).then(([usersData, productsData, ordersData]) => {
      setStats({
        users: usersData.length,
        products: productsData.length,
        orders: ordersData.length
      })
      setLoading(false)
    })
  }, [])

  const statCards = [
    { label: 'Total Pengguna', value: stats.users, icon: Users, color: 'bg-blue-100 text-blue-700', link: '/admin/users' },
    { label: 'Total Produk', value: stats.products, icon: Package, color: 'bg-amber-100 text-amber-700', link: '/admin/products' },
    { label: 'Total Pesanan', value: stats.orders, icon: ShoppingBag, color: 'bg-emerald-100 text-emerald-700', link: '/admin/orders' },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1c1c19]">Ringkasan Admin</h1>
        <p className="text-sm text-[#83746a] mt-1">Pantau seluruh aktivitas di StudentCommerce.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="bg-white rounded-2xl p-6 border border-[#d5c3b8] flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#83746a]">{stat.label}</p>
                  <p className="text-4xl font-black text-[#1c1c19] mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
              <Link href={stat.link} className="mt-6 flex items-center gap-2 text-sm font-bold text-[#7f5531] hover:underline">
                Lihat Detail <ArrowRight size={14} />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
