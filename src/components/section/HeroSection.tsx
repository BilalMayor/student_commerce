'use client'

import { useRouter } from 'next/navigation'
import NeoButton from '@/components/ui/NeoButton'

export default function HeroSection() {
  const router = useRouter()

  return (
    <section className="relative w-full min-h-[90vh] bg-[#FFFBF0] flex items-center overflow-hidden border-b-[3px] border-[#0A0A0A]">
      {/* Background color blocks */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FFE135] border-l-[3px] border-[#0A0A0A]" />
      <div className="absolute top-12 right-12 w-48 h-48 bg-[#FF6B2B] border-2 border-[#0A0A0A] rotate-6" />
      <div className="absolute bottom-16 right-32 w-32 h-32 bg-[#FF3CAC] border-2 border-[#0A0A0A] -rotate-3" />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 sm:px-10 w-full grid md:grid-cols-2 gap-12 items-center py-20">
        {/* Left: Copy */}
        <div>
          {/* Sticker badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-[#FF3CAC] text-white border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] -rotate-1 font-bold text-xs uppercase tracking-widest">
            🎓 Khusus Pelajar & Mahasiswa
          </div>

          <h1 className="font-display font-extrabold text-[clamp(2.8rem,6vw,5rem)] leading-[1.05] tracking-tight text-[#0A0A0A] mb-6">
            Pusat Kebutuhan{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Kampus</span>
              <span className="absolute bottom-0 left-0 right-0 h-4 bg-[#FFE135] -z-0 -rotate-1" />
            </span>{' '}
            <span className="text-[#FF6B2B]">Digital</span>{' '}
            Anda.
          </h1>

          <p className="text-base sm:text-lg text-[#0A0A0A] mb-10 max-w-md leading-relaxed font-medium">
            Jual beli buku, alat tulis, aset digital — platform eksklusif pelajar Indonesia dengan keamanan terjamin.
          </p>

          <div className="flex flex-wrap gap-4">
            <NeoButton variant="orange" size="lg" onClick={() => router.push('/search')}>
              Mulai Belanja →
            </NeoButton>
            <NeoButton variant="white" size="lg" onClick={() => router.push('/register?role=SELLER')}>
              Jadi Penjual
            </NeoButton>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 mt-10">
            {[['1K+', 'Produk'], ['500+', 'Penjual'], ['10K+', 'Transaksi']].map(([num, label]) => (
              <div key={label} className="px-4 py-3 bg-white border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
                <div className="font-mono font-bold text-xl text-[#0A0A0A]">{num}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#B0A090]">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Feature card */}
        <div className="hidden md:flex flex-col gap-4 items-end">
          <div className="w-full max-w-sm bg-white border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-6">
            <div className="text-5xl mb-4">🛍️</div>
            <h3 className="font-display font-bold text-xl text-[#0A0A0A] mb-2">Transaksi Aman</h3>
            <p className="text-sm text-[#B0A090] font-medium">Escrow system — uang tahan sampai barang diterima.</p>
          </div>
          <div className="w-3/4 bg-[#FF3CAC] border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] p-4 -rotate-2">
            <p className="font-bold text-white text-sm">"Beli buku bekas jadi gampang banget!" ⭐⭐⭐⭐⭐</p>
          </div>
        </div>
      </div>
    </section>
  )
}
