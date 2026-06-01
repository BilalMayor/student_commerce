import { Star } from 'lucide-react'
import { formatDate } from '@/lib/utils/formatDate'
import { Review } from '@/types'

interface ReviewCardProps {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const userName = review.user?.name || 'Pelanggan'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <div className="rounded-3xl border border-border/70 bg-white p-5 shadow-soft transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary-dark font-bold text-sm flex items-center justify-center border border-primary/10 shrink-0">
            {userInitial}
          </div>
          <div>
            <p className="font-bold text-sm text-ink">{userName}</p>
            <div className="flex items-center gap-0.5 mt-0.5">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={11}
                  className={idx < review.rating ? 'fill-amber-400 text-amber-400' : 'text-border'}
                />
              ))}
            </div>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-muted bg-border/20 px-2.5 py-1 rounded-full shrink-0">
          {formatDate(review.createdAt)}
        </span>
      </div>
      <p className="text-sm text-ink/80 leading-relaxed pl-13">{review.comment}</p>
    </div>
  )
}
