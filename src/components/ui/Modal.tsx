'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div
        className={cn(
          'w-full overflow-hidden rounded-3xl bg-white border border-border/80 shadow-card animate-scale-in',
          size === 'sm' && 'max-w-sm',
          size === 'md' && 'max-w-md',
          size === 'lg' && 'max-w-lg'
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <h3 className="font-bold text-xl text-ink">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-border/30 text-muted hover:text-ink transition-colors"
            aria-label="Tutup modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 text-sm text-muted max-h-[60vh] overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-border/60 px-6 py-4 bg-surface/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
