import { cn } from '@/lib/utils/cn'

interface NeoBadgeProps {
  children: React.ReactNode
  variant?: 'yellow' | 'pink' | 'green' | 'red' | 'blue' | 'orange' | 'black' | 'white'
  rotate?: boolean
  className?: string
}

const variants = {
  yellow: 'bg-[#FFE135] text-[#0A0A0A]',
  pink: 'bg-[#FF3CAC] text-white',
  green: 'bg-[#00C853] text-white',
  red: 'bg-[#FF1744] text-white',
  blue: 'bg-[#2B59FF] text-white',
  orange: 'bg-[#FF6B2B] text-white',
  black: 'bg-[#0A0A0A] text-white',
  white: 'bg-white text-[#0A0A0A]',
}

export default function NeoBadge({ children, variant = 'yellow', rotate = false, className }: NeoBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest border-2 border-[#0A0A0A]',
        variants[variant],
        rotate && '-rotate-1',
        className
      )}
    >
      {children}
    </span>
  )
}
