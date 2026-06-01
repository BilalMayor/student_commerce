import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface/50 pb-24 md:pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          <div className="sm:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xl font-black tracking-tight text-ink">
              <span className="text-primary">✦</span>
              <span>Student<span className="text-primary">Commerce</span></span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-sm">
              Platform marketplace inovatif khusus bagi pelajar dan mahasiswa Indonesia untuk
              bertransaksi kebutuhan praktikum, buku bekas, sewa kos, jasa cetak, dan tiket event.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-ink">Layanan</h4>
            <div className="flex flex-col gap-2.5 text-sm text-muted">
              <Link href="/search" className="hover:text-primary transition-colors w-fit">Semua Produk</Link>
              <Link href="/search?q=cetak" className="hover:text-primary transition-colors w-fit">Jasa Cetak</Link>
              <Link href="/search?q=alat" className="hover:text-primary transition-colors w-fit">Alat Praktikum</Link>
              <Link href="/search?q=kost" className="hover:text-primary transition-colors w-fit">Kos & Kost</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-ink">Akun</h4>
            <div className="flex flex-col gap-2.5 text-sm text-muted">
              <Link href="/login" className="hover:text-primary transition-colors w-fit">Masuk Akun</Link>
              <Link href="/register" className="hover:text-primary transition-colors w-fit">Daftar Baru</Link>
              <Link href="/profile" className="hover:text-primary transition-colors w-fit">Profil Saya</Link>
              <Link href="/orders" className="hover:text-primary transition-colors w-fit">Riwayat Pesanan</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>&copy; {new Date().getFullYear()} StudentCommerce. Dibuat untuk Pelajar Indonesia.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
