import SearchBar from '../search/SearchBar'

export default function HeroSection() {
  return (
    <section className="relative w-full py-12 md:py-20 px-6 sm:px-10 max-w-[1280px] mx-auto overflow-hidden">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1c1c19] mb-6 leading-tight tracking-tight">
            Pusat Kebutuhan <br className="hidden sm:block"/><span className="text-[#7f5531]">Kampus Digital</span> Anda.
          </h1>
          <p className="text-base sm:text-lg text-[#50443c] mb-8 sm:mb-10 max-w-md leading-relaxed">
            Platform eksklusif mahasiswa untuk jual-beli buku, alat tulis, hingga aset digital dengan keamanan terjamin.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[#7f5531] text-white rounded-xl font-bold text-sm sm:text-base hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-[#7f5531]/20">
              Mulai Belanja
            </button>
            <button className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white border-2 border-[#d5c3b8] text-[#1c1c19] rounded-xl font-bold text-sm sm:text-base hover:bg-[#f0ede9] transition-colors active:scale-95">
              Jadi Penjual
            </button>
          </div>
        </div>
        <div className="relative h-[300px] sm:h-[400px] rounded-3xl overflow-hidden shadow-2xl bg-[#ffdcc2] flex items-center justify-center text-7xl sm:text-8xl">
          🛍️
        </div>
      </div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#c8956c]/20 rounded-full blur-3xl -z-10" />
    </section>
  )
}
