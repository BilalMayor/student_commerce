'use client'

import { useEffect, useState } from 'react'
import { Users, Package, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { usersApi } from '@/lib/api/users'
import { productsApi } from '@/lib/api/products'
import { ordersApi } from '@/lib/api/orders'
import { NeoSkeleton } from '@/components/ui/NeoSkeleton'

const CARD_COLORS = ['#FFE135', '#FF6B2B', '#FF3CAC']

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      usersApi.getAll().catch(() => []),
      productsApi.getAll().catch(() => []),
      ordersApi.getAll().catch(() => [])
    ]).then(([u, p, o]) => {
      setStats({ users: u.length, products: p.length, orders: o.length })
      setLoading(false)
    })
  }, [])

  const statCards = [
    { label: 'Total Pengguna', value: stats.users, icon: Users, link: '/admin/users' },
    { label: 'Total Produk', value: stats.products, icon: Package, link: '/admin/products' },
    { label: 'Total Pesanan', value: stats.orders, icon: ShoppingBag, link: '/admin/orders' },
  ]

  const quickLinks = [
    { href: '/admin/users', label: 'Manajemen User' },
    { href: '/admin/products', label: 'Manajemen Produk' },
    { href: '/admin/orders', label: 'Manajemen Pesanan' },
    { href: '/admin/sellers', label: 'Verifikasi Seller' },
    { href: '/admin/categories', label: 'Kategori' },
    { href: '/admin/reviews', label: 'Ulasan' },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <NeoSkeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map((i) => <NeoSkeleton key={i} className="h-36" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="border-b-[3px] border-[#0A0A0A] pb-6">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0A0A0A] uppercase tracking-tight">Ringkasan Admin</h1>
        <p className="text-sm text-[#B0A090] mt-1 font-medium">Pantau seluruh aktivitas di StudentCommerce.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="bg-white border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A]" style={{ borderTopColor: CARD_COLORS[i], borderTopWidth: 4 }}>
              <div className="p-6 flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#B0A090]">{stat.label}</p>
                  <p className="font-mono font-bold text-4xl text-[#0A0A0A] mt-2">{stat.value.toLocaleString()}</p>
                </div>
                <Icon size={28} className="text-[#B0A090]" />
              </div>
              <Link href={stat.link} className="flex items-center justify-between px-6 py-3 border-t-2 border-[#0A0A0A] text-xs font-bold uppercase tracking-wide hover:bg-[#FFE135] transition-colors">
                Lihat Detail <ArrowRight size={14} />
              </Link>
            </div>
          )
        })}
      </div>

      {/* Quick Nav */}
      <div>
        <h2 className="font-display font-bold text-lg uppercase tracking-wide text-[#0A0A0A] mb-4 border-b-2 border-[#0A0A0A] pb-2">Menu Cepat</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickLinks.map((l) => (
            <Link key={l.href} href={l.href} className="flex items-center justify-between px-4 py-3 bg-white border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:shadow-[5px_5px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
              <span className="text-sm font-bold text-[#0A0A0A]">{l.label}</span>
              <ArrowRight size={14} className="text-[#B0A090]" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
