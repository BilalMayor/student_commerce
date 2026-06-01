'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'relative inline-flex items-center justify-center font-semibold transition-all duration-200 select-none active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          size === 'sm' && 'rounded-full px-4 py-2 text-xs gap-1.5',
          size === 'md' && 'rounded-xl px-6 py-3.5 text-sm gap-2',
          size === 'lg' && 'rounded-2xl px-8 py-4 text-base gap-2',
          variant === 'primary' && 'bg-[#7f5531] text-white shadow-[0_10px_30px_-10px_rgba(44,26,14,0.08)] hover:bg-[#643e1c] hover:-translate-y-[1px]',
          variant === 'secondary' && 'border-2 border-[#d5c3b8] bg-white text-[#1c1c19] hover:border-[#7f5531] hover:bg-[#f0ede9] hover:text-[#7f5531]',
          variant === 'ghost' && 'text-[#50443c] hover:bg-[#d5c3b8]/30 hover:text-[#1c1c19]',
          variant === 'danger' && 'bg-[#ba1a1a] text-white shadow-sm hover:bg-[#93000a] hover:-translate-y-[1px]',
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        <span className={cn('flex items-center justify-center gap-2 transition-opacity duration-200', loading && 'opacity-0')}>
          {children}
        </span>
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="h-5 w-5 animate-spin text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
