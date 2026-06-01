'use client'

import Sidebar from '@/components/layout/Sidebar'
import EmptyState from '@/components/ui/EmptyState'
import { MessageSquare } from 'lucide-react'

export default function AdminReviewsPage() {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar type="admin" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 sm:space-y-8 pb-24 lg:pb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink">Moderasi Ulasan</h1>
          <p className="text-muted text-sm mt-1">Pantau dan bersihkan ulasan yang tidak pantas.</p>
        </div>

        <EmptyState
          title="Fitur Moderasi Ulasan"
          description="Fitur ini sedang dalam tahap pengembangan."
          icon={<MessageSquare size={36} className="text-muted/40" />}
        />
      </main>
    </div>
  )
}
