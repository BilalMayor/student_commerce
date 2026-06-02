'use client'
import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const NeoInput = forwardRef<HTMLInputElement, NeoInputProps>(
  ({ className, label, error, icon, type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="block text-sm font-bold text-[#0A0A0A] uppercase tracking-wide">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0A090]">{icon}</div>
          )}
          <input
            ref={ref}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            className={cn(
              'w-full border-2 border-[#0A0A0A] bg-white px-4 py-3 text-sm font-medium text-[#0A0A0A] placeholder:text-[#B0A090] outline-none transition-all duration-100',
              'focus:shadow-[4px_4px_0px_#0A0A0A] focus:bg-[#FFFBF0]',
              icon && 'pl-10',
              isPassword && 'pr-12',
              error && 'border-[#FF1744] focus:shadow-[4px_4px_0px_#FF1744]',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0A090] hover:text-[#0A0A0A]"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && <p className="text-xs font-bold text-[#FF1744]">{error}</p>}
      </div>
    )
  }
)
NeoInput.displayName = 'NeoInput'
export default NeoInput
