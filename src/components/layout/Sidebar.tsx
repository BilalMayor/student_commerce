'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ShoppingBag, ClipboardList,
  Users, ShieldAlert, LogOut, ArrowLeft, Package
} from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils/cn'

interface SidebarProps {
  type: 'seller' | 'admin'
}

export default function Sidebar({ type }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const sellerLinks = [
    { href: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/seller/products', label: 'Produk Saya', icon: ShoppingBag },
    { href: '/seller/orders', label: 'Pesanan Masuk', icon: ClipboardList },
  ]

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Kelola Pengguna', icon: Users },
    { href: '/admin/sellers', label: 'Verifikasi Penjual', icon: ShieldAlert },
    { href: '/admin/products', label: 'Moderasi Produk', icon: Package },
    { href: '/admin/reviews', label: 'Moderasi Ulasan', icon: ClipboardList },
  ]

  const links = type === 'seller' ? sellerLinks : adminLinks

  return (
    <>
      {/* Mobile bottom spacer for sidebar pages */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[#d5c3b8] bg-[#fcf9f4] h-screen sticky top-0 p-5 shrink-0 z-20">
        <div className="flex flex-col h-full">
          <div className="space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#50443c] font-bold text-xs hover:text-[#7f5531] transition-colors bg-[#ebe8e3] px-3 py-2 rounded-full w-fit"
            >
              <ArrowLeft size={13} className="stroke-[2.5]" />
              Kembali
            </Link>
            <div className="space-y-1">
              <Link href="/" className="flex items-center gap-1.5 text-lg font-black tracking-tight text-[#1c1c19]">
                <span className="text-[#7f5531]">✦</span>
                <span>Student<span className="text-[#7f5531]">Commerce</span></span>
              </Link>
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#7f5531] bg-[#c8956c]/20 px-2 py-0.5 rounded-md">
                {type === 'seller' ? 'Seller Panel' : 'Admin Panel'}
              </span>
            </div>
          </div>

          <nav className="mt-8 space-y-2 flex-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all',
                    isActive
                      ? 'bg-[#ebe8e3] text-[#1c1c19] font-bold border border-[#d5c3b8]'
                      : 'text-[#50443c] font-semibold hover:bg-[#f6f3ee]'
                  )}
                >
                  <Icon size={18} className={cn('stroke-[2]', isActive ? 'text-[#7f5531]' : 'text-[#83746a]')} />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <button
            onClick={logout}
            className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold text-[#ba1a1a] hover:bg-[#ffdad6]/50 transition-all w-full active:scale-[0.98] mt-auto"
          >
            <LogOut size={18} className="stroke-[2]" />
            Keluar Akun
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav for dashboard pages */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-[#d5c3b8] px-2 py-1.5 safe-area-bottom flex items-center justify-around">
        {links.slice(0, 4).map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all',
                isActive ? 'text-[#7f5531]' : 'text-[#83746a] hover:text-[#50443c]'
              )}
            >
              <Icon size={18} className="stroke-[1.8]" />
              <span className="text-[9px] font-semibold truncate max-w-[60px]">{link.label}</span>
            </Link>
          )
        })}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-[#83746a] hover:text-[#ba1a1a] transition-all"
        >
          <LogOut size={18} className="stroke-[1.8]" />
          <span className="text-[9px] font-semibold">Keluar</span>
        </button>
      </nav>
    </>
  )
}
