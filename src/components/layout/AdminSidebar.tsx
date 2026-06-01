'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Tags, Package, ShoppingBag, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Pengguna', icon: Users },
  { href: '/admin/categories', label: 'Kategori', icon: Tags },
  { href: '/admin/products', label: 'Semua Produk', icon: Package },
  { href: '/admin/orders', label: 'Semua Pesanan', icon: ShoppingBag },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[#d5c3b8] bg-white transition-transform max-lg:-translate-x-full lg:translate-x-0">
      <div className="flex h-full flex-col px-4 py-6">
        <Link href="/admin/dashboard" className="mb-8 px-2 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#1c1c19] text-white flex items-center justify-center font-black">
            SC
          </div>
          <span className="text-xl font-bold text-[#1c1c19]">Admin Panel</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1c1c19] text-white shadow-md'
                    : 'text-[#83746a] hover:bg-[#f6f3ee] hover:text-[#1c1c19]'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto border-t border-[#d5c3b8] pt-4">
          <div className="mb-4 px-3">
            <p className="text-sm font-bold text-[#1c1c19] line-clamp-1">{user?.name || 'Admin'}</p>
            <p className="text-[10px] font-semibold text-[#83746a] truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#ba1a1a] transition-colors hover:bg-[#ffdad6]/50"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </div>
    </aside>
  )
}
