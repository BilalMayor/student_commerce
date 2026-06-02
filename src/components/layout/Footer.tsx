import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white border-t-[3px] border-[#0A0A0A] pb-20 md:pb-0">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 border-b-2 border-[#B0A090]/30 pb-10">
          <div className="sm:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-1 text-2xl font-display font-extrabold text-[#FFE135]">
              SC<span className="text-[#FF6B2B]">.</span>
            </Link>
            <p className="text-sm text-[#B0A090] leading-relaxed max-w-sm">
              Platform marketplace eksklusif bagi pelajar dan mahasiswa Indonesia — aman, mudah, terpercaya.
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-[#FFE135] text-[#0A0A0A] text-xs font-bold uppercase border-2 border-[#FFE135]">#ForStudents</span>
              <span className="px-3 py-1 bg-[#FF6B2B] text-white text-xs font-bold uppercase border-2 border-[#FF6B2B]">#ByStudents</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#FFE135]">Layanan</h4>
            {['Semua Produk:/search', 'Jasa Cetak:/search?q=cetak', 'Alat Praktikum:/search?q=alat', 'Kos & Kost:/search?q=kost'].map((item) => {
              const [label, href] = item.split(':')
              return (
                <Link key={href} href={href} className="block text-sm text-[#B0A090] hover:text-[#FFE135] transition-colors font-medium">
                  → {label}
                </Link>
              )
            })}
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#FFE135]">Akun</h4>
            {['Masuk Akun:/login', 'Daftar Baru:/register', 'Profil Saya:/profile', 'Riwayat Pesanan:/orders'].map((item) => {
              const [label, href] = item.split(':')
              return (
                <Link key={href} href={href} className="block text-sm text-[#B0A090] hover:text-[#FFE135] transition-colors font-medium">
                  → {label}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#B0A090]">
          <p className="font-mono">© {new Date().getFullYear()} StudentCommerce. Dibuat untuk Pelajar Indonesia.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#FFE135] transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-[#FFE135] transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
