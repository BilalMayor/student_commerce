'use client'

import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { useToastStore } from '@/lib/hooks/useToast'
import { cn } from '@/lib/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'

export default function Toast() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'pointer-events-auto flex items-start gap-3.5 rounded-2xl p-4 text-sm font-semibold shadow-card border backdrop-blur-sm',
              toast.type === 'success' && 'bg-emerald-50/95 text-emerald-800 border-emerald-200/60',
              toast.type === 'error' && 'bg-rose-50/95 text-rose-800 border-rose-200/60',
              toast.type === 'info' && 'bg-white/95 text-ink border-border/80'
            )}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald-600" />}
              {toast.type === 'error' && <AlertCircle size={18} className="text-rose-600" />}
              {toast.type === 'info' && <Info size={18} className="text-primary" />}
            </div>
            <span className="flex-1 leading-snug">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-50 hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-ink/5 shrink-0"
            >
              <X size={15} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
