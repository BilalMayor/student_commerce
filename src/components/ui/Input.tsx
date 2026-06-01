'use client'

import { forwardRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-[#50443c] block">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#83746a]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'w-full rounded-xl border border-[#d5c3b8] bg-white px-4 py-3 text-sm transition-all outline-none duration-200 text-[#1c1c19] placeholder:text-[#83746a]/50 focus:border-[#7f5531] focus:ring-2 focus:ring-[#c8956c]',
              icon && 'pl-11',
              isPassword && 'pr-12',
              error && 'border-[#ba1a1a] focus:border-[#93000a] focus:ring-[#ffdad6]',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#83746a] hover:text-[#50443c] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-500 font-medium mt-1">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
