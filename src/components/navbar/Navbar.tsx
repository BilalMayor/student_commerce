'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ShoppingCart, User, Menu, X, ArrowUpRight,
  LayoutDashboard, Home, Search, Package, LogOut, Bell, MessageSquare
} from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuth } from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'
import { useSocket } from '@/lib/hooks/useSocket'
import { notificationsApi } from '@/lib/api/notifications'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      notificationsApi.getUnreadCount()
        .then((res) => setUnreadCount(res.count))
        .catch(() => {})
    } else {
      setUnreadCount(0)
    }
  }, [isAuthenticated, pathname])

  useSocket(() => {
    setUnreadCount((c) => c + 1)
  })

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[#fcf9f4]/80 backdrop-blur-md border-b border-[#d5c3b8]'
            : 'bg-transparent'
        )}
      >
        <div className="flex justify-between items-center w-full px-4 sm:px-10 h-16 max-w-[1280px] mx-auto">
          
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl sm:text-2xl text-[#7f5531]">
              <span className="hidden xs:inline">StudentCommerce</span>
              <span className="xs:hidden">SC</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 text-sm">
              {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'transition-colors',
                      active
                        ? 'text-[#7f5531] font-bold border-b-2 border-[#7f5531] pb-1'
                        : 'text-[#50443c] hover:text-[#7f5531]'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
              {user?.role === 'SELLER' && (
                <Link
                  href="/seller/dashboard"
                  className="flex items-center gap-1 text-[11px] bg-[#ffdcc2] text-[#7f5531] rounded-full px-3.5 py-1.5 hover:bg-[#c8956c] hover:text-white transition-all font-bold"
                >
                  Seller <ArrowUpRight size={11} />
                </Link>
              )}
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-1 text-[11px] bg-[#31302d] text-[#f3f0eb] rounded-full px-3.5 py-1.5 hover:opacity-90 transition-all font-bold"
                >
                  Admin <ArrowUpRight size={11} />
                </Link>
              )}
            </nav>
          </div>
          
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (searchQuery.trim()) router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            }}
            className="hidden lg:flex items-center flex-1 max-w-md mx-8 relative"
          >
            <Search className="absolute left-3 text-[#83746a]" size={18} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-2 bg-[#f6f3ee] border border-[#d5c3b8] rounded-full text-sm focus:ring-2 focus:ring-[#c8956c] focus:border-[#7f5531] outline-none transition-all"
              placeholder="Cari produk..."
            />
            <button
              type="button"
              onClick={() => router.push('/search')}
              className="absolute right-1 px-4 py-1.5 bg-[#7f5531] text-white rounded-full text-xs font-bold hover:opacity-90"
            >
              Filter
            </button>
          </form>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="relative p-2 text-[#50443c] hover:text-[#7f5531] transition-colors"
              aria-label="Keranjang"
            >
              <ShoppingCart size={22} />
              {mounted ? (
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#7f5531] text-[10px] text-white font-bold"
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              ) : totalItems > 0 ? (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#7f5531] text-[10px] text-white font-bold">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              ) : null}
            </Link>

            {isAuthenticated && (
              <Link
                href="/profile?tab=notifications"
                className="relative p-2 text-[#50443c] hover:text-[#7f5531] transition-colors"
                aria-label="Notifikasi"
              >
                <Bell size={22} />
                {mounted ? (
                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#7f5531] text-[10px] text-white font-bold"
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                ) : unreadCount > 0 ? (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#7f5531] text-[10px] text-white font-bold">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                ) : null}
              </Link>
            )}

            {isAuthenticated ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 p-1 pr-3 rounded-full border border-[#d5c3b8] hover:bg-[#f0ede9] transition-colors ml-1"
                aria-label="Profil"
              >
                <User size={28} className="text-[#7f5531]" />
                <span className="hidden sm:block text-sm font-semibold text-[#1c1c19]">Profile</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-xl bg-[#7f5531] px-5 py-2 text-white text-xs font-bold hover:bg-[#643e1c] transition-all shadow-sm ml-2"
              >
                Masuk
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full p-2 text-[#50443c] md:hidden transition-all active:scale-90 ml-1"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative bg-[#fcf9f4] border-b border-[#d5c3b8] px-4 py-6 shadow-[0_10px_30px_-10px_rgba(44,26,14,0.08)] mx-4 mt-2 rounded-3xl">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  const active = isActive(link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all',
                        active
                          ? 'bg-[#c8956c]/20 text-[#7f5531]'
                          : 'text-[#50443c] hover:bg-[#f0ede9] hover:text-[#1c1c19]'
                      )}
                    >
                      <Icon size={18} />
                      {link.label}
                    </Link>
                  )
                })}
                {user?.role === 'SELLER' && (
                  <Link
                    href="/seller/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-2xl bg-[#ffdcc2] px-4 py-3.5 text-sm font-bold text-[#7f5531]"
                  >
                    <span>Seller Dashboard</span>
                    <LayoutDashboard size={18} />
                  </Link>
                )}
                {user?.role === 'ADMIN' && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-2xl bg-[#31302d] px-4 py-3.5 text-sm font-bold text-[#f3f0eb]"
                  >
                    <span>Admin Panel</span>
                    <LayoutDashboard size={18} />
                  </Link>
                )}
              </nav>

              <hr className="my-4 border-[#d5c3b8]" />

              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setIsMobileMenuOpen(false) }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold text-[#ba1a1a] hover:bg-[#ffdad6] transition-all"
                >
                  <LogOut size={18} />
                  Keluar Akun
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7f5531] py-3.5 text-sm font-bold text-white"
                >
                  <User size={18} />
                  Masuk Akun
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fcf9f4]/90 backdrop-blur-md border-t border-[#d5c3b8] md:hidden safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative',
                  active ? 'text-[#7f5531]' : 'text-[#50443c] hover:text-[#1c1c19]'
                )}
              >
                <div className="relative">
                  <Icon size={20} />
                  {link.href === '/orders' && totalItems > 0 && (
                    <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-[#7f5531]" />
                  )}
                </div>
                <span className="text-[10px] font-semibold">{link.label}</span>
                {active && (
                  <motion.span
                    layoutId="bottom-nav-indicator"
                    className="absolute -top-0.5 left-2 right-2 h-0.5 rounded-full bg-[#7f5531]"
                  />
                )}
              </Link>
            )
          })}
          <Link
            href="/cart"
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative',
              isActive('/cart') ? 'text-[#7f5531]' : 'text-[#50443c] hover:text-[#1c1c19]'
            )}
          >
            <div className="relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#7f5531] text-[8px] text-white font-bold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold">Keranjang</span>
          </Link>
          {isAuthenticated && (
            <Link
              href="/profile?tab=notifications"
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative',
                pathname.includes('tab=notifications') ? 'text-[#7f5531]' : 'text-[#50443c] hover:text-[#1c1c19]'
              )}
            >
              <div className="relative">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#7f5531] text-[8px] text-white font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold">Notif</span>
            </Link>
          )}
          {isAuthenticated ? (
            <Link
              href="/profile"
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all',
                isActive('/profile') ? 'text-[#7f5531]' : 'text-[#50443c] hover:text-[#1c1c19]'
              )}
            >
              <User size={20} />
              <span className="text-[10px] font-semibold">Profil</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all text-[#50443c] hover:text-[#1c1c19]"
            >
              <User size={20} />
              <span className="text-[10px] font-semibold">Masuk</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  )
}
