import { cn } from '@/lib/utils/cn'

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

export default function Table({ className, children, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-border/80 bg-white shadow-soft">
      <table className={cn('w-full border-collapse text-left text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  )
}

export function TableHead({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        'bg-surface/80 border-b border-border/60 text-[10px] uppercase font-bold tracking-wider text-muted',
        className
      )}
      {...props}
    >
      {children}
    </thead>
  )
}

export function TableBody({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className="divide-y divide-border/40" {...props}>{children}</tbody>
}

export function TableRow({ className, children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn('hover:bg-surface/40 transition-colors duration-150', className)} {...props}>
      {children}
    </tr>
  )
}

export function TableCell({ className, children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('px-6 py-4 font-medium text-ink', className)} {...props}>
      {children}
    </td>
  )
}

export function TableHeaderCell({ className, children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={cn('px-6 py-3.5 font-bold', className)} {...props}>
      {children}
    </th>
  )
}
