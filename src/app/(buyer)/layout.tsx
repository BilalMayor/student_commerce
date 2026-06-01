import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/layout/Footer'

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 sm:pt-18 pb-20 md:pb-0">{children}</main>
      <Footer />
    </>
  )
}
