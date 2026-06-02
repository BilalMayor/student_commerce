'use client'
import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'yellow' | 'black' | 'orange' | 'pink' | 'white' | 'blue' | 'red' | 'green'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
}

const variants = {
  yellow: 'bg-[#FFE135] text-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:shadow-[6px_6px_0px_#0A0A0A] hover:-translate-y-0.5 hover:-translate-x-0.5 active:shadow-[1px_1px_0px_#0A0A0A] active:translate-x-0.5 active:translate-y-0.5',
  black: 'bg-[#0A0A0A] text-white border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#B0A090] hover:shadow-[6px_6px_0px_#B0A090] hover:-translate-y-0.5 hover:-translate-x-0.5 active:shadow-[1px_1px_0px_#B0A090] active:translate-x-0.5 active:translate-y-0.5',
  orange: 'bg-[#FF6B2B] text-white border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:shadow-[6px_6px_0px_#0A0A0A] hover:-translate-y-0.5 hover:-translate-x-0.5 active:shadow-[1px_1px_0px_#0A0A0A] active:translate-x-0.5 active:translate-y-0.5',
  pink: 'bg-[#FF3CAC] text-white border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:shadow-[6px_6px_0px_#0A0A0A] hover:-translate-y-0.5 hover:-translate-x-0.5 active:shadow-[1px_1px_0px_#0A0A0A] active:translate-x-0.5 active:translate-y-0.5',
  white: 'bg-white text-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:shadow-[6px_6px_0px_#0A0A0A] hover:-translate-y-0.5 hover:-translate-x-0.5 active:shadow-[1px_1px_0px_#0A0A0A] active:translate-x-0.5 active:translate-y-0.5',
  blue: 'bg-[#2B59FF] text-white border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:shadow-[6px_6px_0px_#0A0A0A] hover:-translate-y-0.5 hover:-translate-x-0.5 active:shadow-[1px_1px_0px_#0A0A0A] active:translate-x-0.5 active:translate-y-0.5',
  red: 'bg-[#FF1744] text-white border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:shadow-[6px_6px_0px_#0A0A0A] hover:-translate-y-0.5 hover:-translate-x-0.5 active:shadow-[1px_1px_0px_#0A0A0A] active:translate-x-0.5 active:translate-y-0.5',
  green: 'bg-[#00C853] text-white border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:shadow-[6px_6px_0px_#0A0A0A] hover:-translate-y-0.5 hover:-translate-x-0.5 active:shadow-[1px_1px_0px_#0A0A0A] active:translate-x-0.5 active:translate-y-0.5',
}

const sizes = {
  sm: 'px-4 py-2 text-xs font-bold uppercase tracking-wider gap-1.5',
  md: 'px-6 py-3 text-sm font-bold uppercase tracking-wider gap-2',
  lg: 'px-8 py-4 text-base font-bold uppercase tracking-wider gap-2',
}

const NeoButton = forwardRef<HTMLButtonElement, NeoButtonProps>(
  ({ className, variant = 'yellow', size = 'md', fullWidth, loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex items-center justify-center transition-all duration-100 select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:!shadow-none disabled:!translate-x-0 disabled:!translate-y-0',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      <span className={cn('flex items-center justify-center gap-2', loading && 'opacity-0')}>
        {children}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </span>
      )}
    </button>
  )
)
NeoButton.displayName = 'NeoButton'
export default NeoButton
