import { cn } from '@/lib/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
  className?: string
}

export default function Badge({ children, variant = 'primary', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-bold tracking-wide border',
        size === 'sm' && 'px-2.5 py-0.5 text-[10px]',
        size === 'md' && 'px-3 py-1 text-xs',
        variant === 'primary' && 'bg-[#c8956c]/20 text-[#7f5531] border-[#c8956c]/30',
        variant === 'secondary' && 'bg-[#ebe8e3] text-[#50443c] border-[#d5c3b8]',
        variant === 'success' && 'bg-[#D7E8D9] text-[#2E7D32] border-[#2E7D32]/20',
        variant === 'warning' && 'bg-[#FFECB3] text-[#795548] border-[#795548]/20',
        variant === 'danger' && 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/20',
        variant === 'info' && 'bg-[#D1E3F6] text-[#1E40AF] border-[#1E40AF]/20',
        className
      )}
    >
      {children}
    </span>
  )
}
