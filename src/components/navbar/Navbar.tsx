'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, User, Menu, X, Search, Home, Package, MessageSquare, Bell, LogOut, LayoutDashboard } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuth } from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'
import { useSocket } from '@/lib/hooks/useSocket'
import { useNotificationStore } from '@/lib/store/notificationStore'

const navLinks = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/search', label: 'Cari', icon: Search },
  { href: '/orders', label: 'Pesanan', icon: Package },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const totalItems = useCartStore((s) => s.totalItems())
  const { user, isAuthenticated, logout } = useAuth()
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const chatUnreadCount = useNotificationStore((s) => s.chatUnreadCount)
  const fetchUnreadCount = useNotificationStore((s) => s.fetchUnreadCount)
  const fetchChatUnreadCount = useNotificationStore((s) => s.fetchChatUnreadCount)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (isAuthenticated) { fetchUnreadCount(); fetchChatUnreadCount() }
  }, [isAuthenticated, pathname, fetchUnreadCount, fetchChatUnreadCount])

  useSocket()

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      {/* Main Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFE135] border-b-[3px] border-[#0A0A0A]">
        <div className="flex items-center justify-between w-full px-4 sm:px-8 h-16 max-w-[1280px] mx-auto gap-4">

          {/* Logo */}
          <Link href="/" className="font-display font-bold text-[#0A0A0A] text-2xl tracking-tight shrink-0 hover:opacity-80 transition-opacity">
            SC<span className="text-[#FF6B2B]">.</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all',
                  isActive(link.href)
                    ? 'bg-[#0A0A0A] text-[#FFE135]'
                    : 'text-[#0A0A0A] hover:bg-[#0A0A0A]/10'
                )}
              >
                {link.label}
                {mounted && link.href === '/chat' && chatUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-[#FF1744] border border-[#0A0A0A] text-[9px] text-white font-bold">
                    {chatUnreadCount > 9 ? '9+' : chatUnreadCount}
                  </span>
                )}
              </Link>
            ))}
            {user?.role === 'SELLER' && (
              <Link href="/seller/dashboard" className="px-3 py-2 text-xs font-bold uppercase tracking-wider bg-[#FF6B2B] text-white border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:shadow-[4px_4px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all ml-2">
                Seller ↗
              </Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link href="/admin/dashboard" className="px-3 py-2 text-xs font-bold uppercase tracking-wider bg-[#0A0A0A] text-[#FFE135] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#B0A090] hover:shadow-[4px_4px_0px_#B0A090] transition-all ml-2">
                Admin ↗
              </Link>
            )}
          </nav>

          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (searchQuery.trim()) router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            }}
            className="hidden lg:flex items-center flex-1 max-w-sm mx-4"
          >
            <div className="flex w-full border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] focus-within:shadow-[5px_5px_0px_#0A0A0A] transition-all">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 bg-white text-sm font-medium text-[#0A0A0A] placeholder:text-[#B0A090] outline-none"
                placeholder="Cari produk..."
              />
              <button type="submit" className="px-4 bg-[#0A0A0A] text-[#FFE135] border-l-2 border-[#0A0A0A] hover:bg-[#FF6B2B] transition-colors">
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            {/* Cart */}
            <Link href="/cart" className="relative p-2.5 border-2 border-transparent hover:border-[#0A0A0A] hover:bg-[#FF6B2B] hover:text-white transition-all" aria-label="Keranjang">
              <ShoppingCart size={20} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center bg-[#FF1744] border-2 border-[#0A0A0A] text-[9px] text-white font-bold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Notifications */}
            {isAuthenticated && (
              <Link href="/profile?tab=notifications" className="relative p-2.5 border-2 border-transparent hover:border-[#0A0A0A] hover:bg-[#FF6B2B] hover:text-white transition-all" aria-label="Notifikasi">
                <Bell size={20} />
                {mounted && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center bg-[#FF1744] border-2 border-[#0A0A0A] text-[9px] text-white font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Profile / Login */}
            {isAuthenticated ? (
              <Link href="/profile" className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#0A0A0A] text-[#FFE135] border-2 border-[#0A0A0A] text-xs font-bold uppercase ml-1 hover:bg-[#FF6B2B] hover:text-white transition-colors">
                <User size={16} /> Profil
              </Link>
            ) : (
              <Link href="/login" className="hidden sm:block px-4 py-2 bg-[#0A0A0A] text-[#FFE135] border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#B0A090] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#B0A090] transition-all text-xs font-bold uppercase ml-1">
                Masuk
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2.5 border-2 border-transparent hover:border-[#0A0A0A] transition-all ml-1" aria-label="Menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0A0A0A]/40 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-16 right-0 bottom-0 z-40 w-72 bg-[#FFFBF0] border-l-[3px] border-[#0A0A0A] md:hidden overflow-y-auto"
            >
              <nav className="flex flex-col p-4 gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider border-2 border-transparent transition-all',
                        isActive(link.href)
                          ? 'bg-[#FFE135] border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]'
                          : 'hover:bg-[#FFF5D6] hover:border-[#0A0A0A]'
                      )}
                    >
                      <Icon size={18} /> {link.label}
                    </Link>
                  )
                })}

                <hr className="my-3 border-[#0A0A0A] border-t-2" />

                {user?.role === 'SELLER' && (
                  <Link href="/seller/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase bg-[#FF6B2B] text-white border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]">
                    <LayoutDashboard size={18} /> Seller Dashboard
                  </Link>
                )}
                {user?.role === 'ADMIN' && (
                  <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase bg-[#0A0A0A] text-[#FFE135] border-2 border-[#0A0A0A]">
                    <LayoutDashboard size={18} /> Admin Panel
                  </Link>
                )}

                {isAuthenticated ? (
                  <button
                    onClick={() => { logout(); setMobileOpen(false) }}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase text-[#FF1744] border-2 border-transparent hover:border-[#FF1744] hover:bg-[#FF1744]/10 transition-all mt-2"
                  >
                    <LogOut size={18} /> Keluar
                  </button>
                ) : (
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase bg-[#0A0A0A] text-[#FFE135] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_#B0A090] mt-2">
                    <User size={18} /> Masuk Akun
                  </Link>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFBF0] border-t-[3px] border-[#0A0A0A] md:hidden">
        <div className="flex items-center justify-around">
          {navLinks.map((link) => {
            const Icon = link.icon
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-4 py-3 flex-1 transition-all relative',
                  active ? 'bg-[#FFE135] border-t-[3px] border-[#0A0A0A] -mt-[3px]' : 'border-t-[3px] border-transparent -mt-[3px] hover:bg-[#FFF5D6]'
                )}
              >
                <div className="relative">
                  <Icon size={20} />
                  {mounted && link.href === '/chat' && chatUnreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-3.5 w-3.5 items-center justify-center bg-[#FF1744] border border-[#0A0A0A] text-[8px] text-white font-bold">{chatUnreadCount}</span>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">{link.label}</span>
              </Link>
            )
          })}
          <Link
            href="/cart"
            className={cn(
              'flex flex-col items-center gap-0.5 px-4 py-3 flex-1 transition-all relative',
              isActive('/cart') ? 'bg-[#FFE135] border-t-[3px] border-[#0A0A0A] -mt-[3px]' : 'border-t-[3px] border-transparent -mt-[3px] hover:bg-[#FFF5D6]'
            )}
          >
            <div className="relative">
              <ShoppingCart size={20} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-3.5 w-3.5 items-center justify-center bg-[#FF1744] border border-[#0A0A0A] text-[8px] text-white font-bold">{totalItems}</span>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Keranjang</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
