import Link from 'next/link'
import Button from './Button'
import { PackageOpen } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  icon?: React.ReactNode
}

export default function EmptyState({ title, description, actionLabel, actionHref, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl bg-white/80 border border-border/60 p-12 text-center shadow-soft">
      <div className="mb-6 w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center text-3xl">
        {icon || <PackageOpen size={36} className="text-muted/40" />}
      </div>
      <h3 className="text-xl font-bold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-muted max-w-xs">{description}</p>
      {actionLabel && actionHref && (
        <div className="mt-6">
          <Link href={actionHref}>
            <Button variant="secondary" size="sm">{actionLabel}</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
