'use client'

import { useState } from 'react'
import { SlidersHorizontal, RotateCcw } from 'lucide-react'
import Button from '@/components/ui/Button'

interface FilterValues {
  minPrice?: number
  maxPrice?: number
  minRating?: number
}

export default function FilterSidebar({
  onFilter
}: {
  onFilter?: (v: FilterValues) => void
}) {
  const [values, setValues] = useState<FilterValues>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter?.(values)
  }

  const handleReset = () => {
    setValues({})
    onFilter?.({})
  }

  return (
    <aside className="rounded-[2rem] border border-border/70 bg-white p-5 sm:p-6 shadow-soft space-y-5">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <h2 className="text-base font-bold text-ink flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-muted" />
          Filter
        </h2>
        <button
          onClick={handleReset}
          className="text-[11px] font-semibold text-muted hover:text-primary flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted/70">
            Harga Minimum
          </label>
          <input
            type="number"
            placeholder="Rp 0"
            value={values.minPrice ?? ''}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className="w-full rounded-2xl border-2 border-border/80 bg-white px-3.5 py-2.5 text-sm transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-ink placeholder:text-muted/40 font-medium"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted/70">
            Harga Maksimum
          </label>
          <input
            type="number"
            placeholder="Rp 1.000.000"
            value={values.maxPrice ?? ''}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className="w-full rounded-2xl border-2 border-border/80 bg-white px-3.5 py-2.5 text-sm transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-ink placeholder:text-muted/40 font-medium"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted/70">
            Rating Minimum
          </label>
          <select
            value={values.minRating ?? ''}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                minRating: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className="w-full rounded-2xl border-2 border-border/80 bg-white px-3.5 py-2.5 text-sm transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-ink font-semibold"
          >
            <option value="">Semua Rating</option>
            <option value="4">4 Ke Atas</option>
            <option value="3">3 Ke Atas</option>
            <option value="2">2 Ke Atas</option>
          </select>
        </div>

        <Button type="submit" fullWidth size="sm">
          Terapkan Filter
        </Button>
      </form>
    </aside>
  )
}
