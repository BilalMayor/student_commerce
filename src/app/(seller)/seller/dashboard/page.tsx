'use client'

import { useEffect, useState, useRef } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { productsApi } from '@/lib/api/products'
import { ordersApi } from '@/lib/api/orders'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import {
  ShoppingBag, ClipboardList, Wallet, TrendingUp,
  ArrowUpRight, Plus, RefreshCw, BarChart2, Calendar
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import Link from 'next/link'

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function SellerDashboardPage() {
  const [productsCount, setProductsCount] = useState(0)
  const [ordersCount, setOrdersCount] = useState(0)
  
  // Revenues
  const [todayRevenue, setTodayRevenue] = useState(0)
  const [weeklyRevenue, setWeeklyRevenue] = useState(0)
  const [monthlyRevenue, setMonthlyRevenue] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)

  // Chart data state
  const [dailySalesData, setDailySalesData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: []
  })
  const [monthlySalesData, setMonthlySalesData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: []
  })

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = async (isSilent = false) => {
    if (!isSilent) setLoading(true)
    else setRefreshing(true)

    try {
      const [products, orders] = await Promise.all([
        productsApi.getAll().catch(() => []),
        ordersApi.getAll().catch(() => [])
      ])

      setProductsCount(products.length)
      setOrdersCount(orders.length)

      // Filter successful orders for revenue calculation
      const successOrders = orders.filter(
        (o) => o.status === 'DELIVERED' || o.status === 'PROCESSING' || o.status === 'SHIPPED'
      )

      // 1. Calculate Revenues
      const now = new Date()
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(now.getDate() - 7)
      const startOfWeek = oneWeekAgo.getTime()

      const oneMonthAgo = new Date()
      oneMonthAgo.setDate(now.getDate() - 30)
      const startOfMonth = oneMonthAgo.getTime()

      let todayRev = 0
      let weekRev = 0
      let monthRev = 0
      let totalRev = 0

      successOrders.forEach((o) => {
        const orderTime = new Date(o.createdAt).getTime()
        totalRev += o.totalPrice

        if (orderTime >= startOfToday) {
          todayRev += o.totalPrice
        }
        if (orderTime >= startOfWeek) {
          weekRev += o.totalPrice
        }
        if (orderTime >= startOfMonth) {
          monthRev += o.totalPrice
        }
      })

      setTodayRevenue(todayRev)
      setWeeklyRevenue(weekRev)
      setMonthlyRevenue(monthRev)
      setTotalRevenue(totalRev)

      // 2. Generate Chart: 7 Days Daily Sales
      const last7DaysLabels: string[] = []
      const last7DaysSales: number[] = []

      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(now.getDate() - i)
        const label = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' })
        last7DaysLabels.push(label)

        const startDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
        const endDay = startDay + 24 * 60 * 60 * 1000

        const daySales = successOrders
          .filter((o) => {
            const time = new Date(o.createdAt).getTime()
            return time >= startDay && time < endDay
          })
          .reduce((sum, o) => sum + o.totalPrice, 0)

        last7DaysSales.push(daySales)
      }

      setDailySalesData({
        labels: last7DaysLabels,
        datasets: [
          {
            fill: true,
            label: 'Penjualan Harian',
            data: last7DaysSales,
            borderColor: '#F28C38', // primary warm orange
            backgroundColor: 'rgba(242, 140, 56, 0.1)',
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#F28C38',
            pointHoverRadius: 7,
          }
        ]
      })

      // 3. Generate Chart: 12 Months Sales
      const last12MonthsLabels: string[] = []
      const last12MonthsSales: number[] = []

      for (let i = 11; i >= 0; i--) {
        const d = new Date()
        d.setMonth(now.getMonth() - i)
        const label = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
        last12MonthsLabels.push(label)

        const month = d.getMonth()
        const year = d.getFullYear()

        const monthSales = successOrders
          .filter((o) => {
            const date = new Date(o.createdAt)
            return date.getMonth() === month && date.getFullYear() === year
          })
          .reduce((sum, o) => sum + o.totalPrice, 0)

        last12MonthsSales.push(monthSales)
      }

      setMonthlySalesData({
        labels: last12MonthsLabels,
        datasets: [
          {
            label: 'Penjualan Bulanan',
            data: last12MonthsSales,
            backgroundColor: '#4A3B32', // dark accent
            borderRadius: 8,
            hoverBackgroundColor: '#F28C38',
          }
        ]
      })

    } catch (e) {
      // ignore or show standard fallback values
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Initial and polling fetch
  useEffect(() => {
    fetchData()

    intervalRef.current = setInterval(() => {
      fetchData(true)
    }, 30000) // refresh every 30 seconds

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const stats = [
    { label: 'Hari Ini', value: formatCurrency(todayRevenue), change: 'Hari Ini', icon: Wallet, color: 'text-primary bg-primary/10' },
    { label: 'Minggu Ini', value: formatCurrency(weeklyRevenue), change: '7 Hari Terakhir', icon: Calendar, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Bulan Ini', value: formatCurrency(monthlyRevenue), change: '30 Hari Terakhir', icon: BarChart2, color: 'text-indigo-500 bg-indigo-500/10' },
    { label: 'Total Pendapatan', value: formatCurrency(totalRevenue), change: 'Sepanjang Waktu', icon: Wallet, color: 'text-emerald-500 bg-emerald-500/10' },
  ]

  const chartOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1E1B18',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 13, weight: 'bold' },
        padding: 12,
        cornerRadius: 12,
        callbacks: {
          label: (context) => ` ${formatCurrency(context.parsed.y || 0)}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#8A7A71',
          font: { size: 11, weight: 'bold' }
        }
      },
      y: {
        grid: {
          color: 'rgba(230, 220, 210, 0.5)',
        },
        ticks: {
          color: '#8A7A71',
          font: { size: 10, weight: 'bold' },
          callback: (value) => {
            const num = Number(value)
            if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
            if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
            return num
          }
        }
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar type="seller" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 sm:space-y-8 pb-24 lg:pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight flex items-center gap-2.5">
              <span>Dashboard Penjual</span>
              {refreshing && (
                <RefreshCw size={18} className="text-primary animate-spin" />
              )}
            </h1>
            <p className="text-muted text-sm mt-1">Pantau grafik performa pendapatan dan pesanan tokomu secara real-time.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchData(true)}
              className="inline-flex items-center justify-center p-2.5 rounded-2xl border border-border bg-white text-muted hover:text-ink hover:bg-surface transition-all"
              title="Perbarui Data"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <Link href="/seller/products/new" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-black text-white hover:bg-primary-dark hover:shadow-soft transition-all">
              <Plus size={16} />
              <span>Tambah Produk</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 rounded-3xl bg-white animate-pulse" />
              ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-80 rounded-[2.25rem] bg-white animate-pulse" />
              <div className="h-80 rounded-[2.25rem] bg-white animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="rounded-3xl bg-white p-5 shadow-soft border border-border/70 flex flex-col justify-between hover:border-primary/30 transition-all group">
                    <div className="flex justify-between items-start">
                      <div className={`rounded-2xl p-2.5 ${stat.color}`}>
                        <Icon size={20} />
                      </div>
                      <span className="text-[9px] font-black tracking-widest text-muted uppercase bg-muted/5 px-2 py-0.5 rounded-md">
                        {stat.change}
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-[10px] text-muted font-bold uppercase tracking-wider">{stat.label}</p>
                      <p className="text-lg sm:text-xl font-black text-ink mt-1 tracking-tight">{stat.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Daily Sales Chart */}
              <div className="rounded-[2.25rem] border border-border/70 bg-white p-5 sm:p-6 shadow-soft space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-ink text-sm sm:text-base tracking-tight">Tren Pendapatan Harian</h3>
                    <p className="text-xs text-muted font-semibold mt-0.5">Penjualan sukses dalam 7 hari terakhir</p>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-xl">7 Hari</span>
                </div>
                <div className="h-64 sm:h-72 w-full">
                  <Line data={dailySalesData} options={chartOptions as any} />
                </div>
              </div>

              {/* Monthly Sales Chart */}
              <div className="rounded-[2.25rem] border border-border/70 bg-white p-5 sm:p-6 shadow-soft space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-ink text-sm sm:text-base tracking-tight">Pendapatan Bulanan</h3>
                    <p className="text-xs text-muted font-semibold mt-0.5">Penjualan sukses dalam 12 bulan terakhir</p>
                  </div>
                  <span className="text-xs font-bold text-muted bg-border/40 px-2.5 py-1 rounded-xl">1 Tahun</span>
                </div>
                <div className="h-64 sm:h-72 w-full">
                  <Bar data={monthlySalesData} options={chartOptions as any} />
                </div>
              </div>
            </div>

            {/* Quick Links / Summary */}
            <div className="grid gap-6 sm:grid-cols-3">
              <Link href="/seller/products" className="rounded-3xl border-2 border-border/70 bg-white p-5 shadow-soft hover:border-primary/45 transition-all flex items-center justify-between group">
                <div>
                  <h4 className="font-black text-sm text-ink group-hover:text-primary transition-colors">Kelola Produk</h4>
                  <p className="text-xs font-medium text-muted mt-1">{productsCount} Produk Aktif</p>
                </div>
                <ArrowUpRight size={20} className="text-muted group-hover:text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link href="/seller/orders" className="rounded-3xl border-2 border-border/70 bg-white p-5 shadow-soft hover:border-primary/45 transition-all flex items-center justify-between group">
                <div>
                  <h4 className="font-black text-sm text-ink group-hover:text-primary transition-colors">Kelola Pesanan</h4>
                  <p className="text-xs font-medium text-muted mt-1">{ordersCount} Pesanan Masuk</p>
                </div>
                <ArrowUpRight size={20} className="text-muted group-hover:text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <div className="rounded-3xl border-2 border-primary/20 bg-surface/40 p-5 shadow-soft flex items-center gap-4">
                <div className="rounded-2xl p-2.5 bg-primary/10 text-primary">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 className="font-black text-sm text-ink">Performa Toko</h4>
                  <p className="text-xs font-semibold text-muted mt-1">Sangat Baik & Terpercaya</p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
