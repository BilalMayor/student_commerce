import { cn } from '@/lib/utils/cn'

interface NeoCardProps {
  children: React.ReactNode
  className?: string
  bg?: string
  hover?: boolean
}

export default function NeoCard({ children, className, bg = 'bg-[#FFF5D6]', hover = false }: NeoCardProps) {
  return (
    <div
      className={cn(
        'border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] transition-all duration-100',
        bg,
        hover && 'hover:shadow-[6px_6px_0px_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5',
        className
      )}
    >
      {children}
    </div>
  )
}
