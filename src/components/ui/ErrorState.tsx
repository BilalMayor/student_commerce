import { AlertTriangle, RotateCcw } from 'lucide-react'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl bg-rose-50/80 border border-rose-200/60 p-12 text-center">
      <div className="mb-5 w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
        <AlertTriangle size={28} className="text-rose-500" />
      </div>
      <h3 className="text-xl font-bold text-rose-800">Terjadi Kesalahan</h3>
      <p className="mt-2 text-sm text-rose-600 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 text-sm font-bold text-white hover:bg-rose-600 transition-all active:scale-[0.97]"
        >
          <RotateCcw size={16} />
          Coba Lagi
        </button>
      )}
    </div>
  )
}
