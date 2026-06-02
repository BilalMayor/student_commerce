import { cn } from '@/lib/utils/cn'

export function NeoSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'neo-shimmer border-2 border-[#0A0A0A]',
        className
      )}
    />
  )
}

export function NeoProductCardSkeleton() {
  return (
    <div className="border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] bg-[#FFF5D6] overflow-hidden">
      <NeoSkeleton className="h-56 w-full border-0 border-b-2 border-[#0A0A0A]" />
      <div className="p-4 space-y-3">
        <NeoSkeleton className="h-5 w-3/4" />
        <NeoSkeleton className="h-6 w-1/2" />
        <NeoSkeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
