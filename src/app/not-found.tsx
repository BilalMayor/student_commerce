import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center bg-bg">
      <div className="mb-6 w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center text-5xl">
        🔍
      </div>
      <div className="mb-4 text-8xl font-black text-primary/20">404</div>
      <h1 className="text-3xl font-black text-ink">Halaman Tidak Ditemukan</h1>
      <p className="mt-2 text-muted max-w-sm">
        Halaman yang kamu cari tidak ada atau sudah dipindah.
      </p>
      <div className="mt-8">
        <Link href="/">
          <Button>Kembali ke Beranda</Button>
        </Link>
      </div>
    </main>
  )
}
