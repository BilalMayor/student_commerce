'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { useSocket } from '@/lib/hooks/useSocket'
import { Skeleton } from '@/components/ui/Skeleton'
import { toast } from '@/lib/hooks/useToast'

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'SELLER') {
      router.replace('/')
    } else {
      setChecking(false)
    }
  }, [user, isAuthenticated, router])

  useSocket((notification) => {
    const message = notification.message || ''
    if (
      message.toLowerCase().includes('pesanan') ||
      message.toLowerCase().includes('order') ||
      message.toLowerCase().includes('bayar') ||
      message.toLowerCase().includes('pembayaran')
    ) {
      toast.info(`📦 ${message}`)
    }
  })

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="space-y-4 text-center">
          <Skeleton className="h-8 w-48 mx-auto rounded-xl" />
          <p className="text-sm text-muted">Memvalidasi akses...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
