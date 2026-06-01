import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'shimmer'
}

export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-[#ebe8e3]',
        variant === 'shimmer' && 'animate-shimmer',
        variant === 'default' && 'animate-pulse',
        className
      )}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-[#d5c3b8] overflow-hidden animate-pulse">
      <Skeleton className="h-64 w-full rounded-none bg-[#ebe8e3]" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-1/5" />
        </div>
      </div>
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-[#d5c3b8]/50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  )
}
