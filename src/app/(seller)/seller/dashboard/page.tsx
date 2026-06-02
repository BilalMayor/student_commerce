'use client'

import { useEffect, useState, useRef } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { productsApi } from '@/lib/api/products'
import { ordersApi } from '@/lib/api/orders'
import { useAuthStore } from '@/lib/store/authStore'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { ShoppingBag, ClipboardList, Wallet, TrendingUp, ArrowUpRight, Plus, RefreshCw, BarChart2, Calendar } from 'lucide-react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler, ChartData, ChartOptions
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import Link from 'next/link'
import { NeoSkeleton } from '@/components/ui/NeoSkeleton'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const STAT_COLORS = ['#FFE135', '#FF6B2B', '#FF3CAC', '#00C853']

export default function SellerDashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [productsCount, setProductsCount] = useState(0)
  const [ordersCount, setOrdersCount] = useState(0)
  const [todayRevenue, setTodayRevenue] = useState(0)
  const [weeklyRevenue, setWeeklyRevenue] = useState(0)
  const [monthlyRevenue, setMonthlyRevenue] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [dailySalesData, setDailySalesData] = useState<ChartData<'line'>>({ labels: [], datasets: [] })
  const [monthlySalesData, setMonthlySalesData] = useState<ChartData<'bar'>>({ labels: [], datasets: [] })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = async (isSilent = false) => {
    if (!isSilent) setLoading(true); else setRefreshing(true)
    try {
      const [products, orders] = await Promise.all([
        productsApi.getAll().catch(() => []),
        ordersApi.getAll().catch(() => [])
      ])
      const myProducts = user ? products.filter((p) => p.sellerId === user.id) : products
      setProductsCount(myProducts.length)
      setOrdersCount(orders.length)
      const successOrders = orders.filter((o) => ['DELIVERED','PROCESSING','SHIPPED'].includes(o.status))
      const now = new Date()
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      const startOfWeek = new Date(now).setDate(now.getDate() - 7)
      const startOfMonth = new Date(now).setDate(now.getDate() - 30)
      let todayRev = 0, weekRev = 0, monthRev = 0, totalRev = 0
      successOrders.forEach((o) => {
        const t = new Date(o.createdAt).getTime()
        totalRev += o.totalPrice
        if (t >= startOfToday) todayRev += o.totalPrice
        if (t >= startOfWeek) weekRev += o.totalPrice
        if (t >= startOfMonth) monthRev += o.totalPrice
      })
      setTodayRevenue(todayRev); setWeeklyRevenue(weekRev); setMonthlyRevenue(monthRev); setTotalRevenue(totalRev)

      const last7Labels: string[] = [], last7Sales: number[] = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(now.getDate() - i)
        last7Labels.push(d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }))
        const startDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
        last7Sales.push(successOrders.filter((o) => { const t = new Date(o.createdAt).getTime(); return t >= startDay && t < startDay + 86400000 }).reduce((s, o) => s + o.totalPrice, 0))
      }
      setDailySalesData({ labels: last7Labels, datasets: [{ fill: true, label: 'Pendapatan', data: last7Sales, borderColor: '#FF6B2B', backgroundColor: 'rgba(255,107,43,0.15)', tension: 0.4, borderWidth: 3, pointBackgroundColor: '#FF6B2B' }] })

      const last12Labels: string[] = [], last12Sales: number[] = []
      for (let i = 11; i >= 0; i--) {
        const d = new Date(); d.setMonth(now.getMonth() - i)
        last12Labels.push(d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }))
        last12Sales.push(successOrders.filter((o) => { const dt = new Date(o.createdAt); return dt.getMonth() === d.getMonth() && dt.getFullYear() === d.getFullYear() }).reduce((s, o) => s + o.totalPrice, 0))
      }
      setMonthlySalesData({ labels: last12Labels, datasets: [{ label: 'Penjualan', data: last12Sales, backgroundColor: '#0A0A0A', hoverBackgroundColor: '#FFE135' }] })
    } catch {} finally { setLoading(false); setRefreshing(false) }
  }

  useEffect(() => {
    fetchData()
    intervalRef.current = setInterval(() => fetchData(true), 30000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const stats = [
    { label: 'Hari Ini', value: formatCurrency(todayRevenue), icon: Wallet },
    { label: 'Minggu Ini', value: formatCurrency(weeklyRevenue), icon: Calendar },
    { label: 'Bulan Ini', value: formatCurrency(monthlyRevenue), icon: BarChart2 },
    { label: 'Total', value: formatCurrency(totalRevenue), icon: TrendingUp },
  ]

  const chartOptions: ChartOptions<any> = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0A0A0A', titleFont: { weight: 'bold' }, bodyFont: { weight: 'bold' }, callbacks: { label: (c: any) => ` ${formatCurrency(c.parsed.y || 0)}` } } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#B0A090', font: { weight: 'bold', size: 11 } } },
      y: { grid: { color: 'rgba(176,160,144,0.2)' }, ticks: { color: '#B0A090', font: { weight: 'bold', size: 10 }, callback: (v: any) => { const n = Number(v); if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`; if (n >= 1000) return `${(n/1000).toFixed(0)}K`; return n } } }
    }
  }

  return (
    <div className="flex min-h-screen bg-[#FFFBF0]">
      <Sidebar type="seller" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 lg:pb-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[3px] border-[#0A0A0A] pb-6">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0A0A0A] uppercase tracking-tight flex items-center gap-2">
              Dashboard Penjual
              {refreshing && <RefreshCw size={18} className="animate-spin text-[#FF6B2B]" />}
            </h1>
            <p className="text-sm text-[#B0A090] mt-1 font-medium">Pantau performa toko secara real-time.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchData(true)} className="p-2.5 border-2 border-[#0A0A0A] bg-white hover:bg-[#FFE135] transition-colors">
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <Link href="/seller/products/new" className="flex items-center gap-2 px-4 py-2.5 bg-[#FFE135] border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:shadow-[5px_5px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-xs font-bold uppercase">
              <Plus size={16} /> Tambah Produk
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => <NeoSkeleton key={i} className="h-28" />)}
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <NeoSkeleton className="h-80" />
              <NeoSkeleton className="h-80" />
            </div>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="bg-white border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] p-5" style={{ borderTopColor: STAT_COLORS[i], borderTopWidth: 4 }}>
                    <div className="flex justify-between items-start mb-3">
                      <Icon size={20} className="text-[#B0A090]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#B0A090]">{stat.label}</span>
                    </div>
                    <p className="font-mono font-bold text-2xl text-[#0A0A0A]">{stat.value}</p>
                  </div>
                )
              })}
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="bg-white border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-bold text-sm uppercase tracking-wide text-[#0A0A0A]">Tren 7 Hari</h3>
                  <span className="px-2 py-0.5 bg-[#FFE135] border-2 border-[#0A0A0A] text-[10px] font-bold uppercase">Harian</span>
                </div>
                <div className="h-64 w-full"><Line data={dailySalesData} options={chartOptions} /></div>
              </div>
              <div className="bg-white border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-bold text-sm uppercase tracking-wide text-[#0A0A0A]">12 Bulan</h3>
                  <span className="px-2 py-0.5 bg-[#FF6B2B] text-white border-2 border-[#0A0A0A] text-[10px] font-bold uppercase">Bulanan</span>
                </div>
                <div className="h-64 w-full"><Bar data={monthlySalesData} options={chartOptions} /></div>
              </div>
            </div>

            {/* Quick links */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { href: '/seller/products', label: 'Kelola Produk', sub: `${productsCount} Produk Aktif`, bg: '#FFE135' },
                { href: '/seller/orders', label: 'Kelola Pesanan', sub: `${ordersCount} Pesanan Masuk`, bg: '#FF6B2B' },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="flex items-center justify-between bg-white border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:shadow-[5px_5px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all p-5">
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide text-[#0A0A0A]">{l.label}</h4>
                    <p className="font-mono text-xs text-[#B0A090] mt-1">{l.sub}</p>
                  </div>
                  <ArrowUpRight size={20} className="text-[#B0A090]" />
                </Link>
              ))}
              <div className="flex items-center gap-4 bg-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#B0A090] p-5">
                <TrendingUp size={24} className="text-[#FFE135]" />
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide text-[#FFE135]">Performa</h4>
                  <p className="text-xs text-[#B0A090] mt-1 font-medium">Sangat Baik ✓</p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
