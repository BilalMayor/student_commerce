import './globals.css'
import Toast from '@/components/ui/Toast'
import { GoogleOAuthProvider } from '@react-oauth/google'

export const metadata = {
  title: 'StudentCommerce - Marketplace Pelajar & Mahasiswa',
  description: 'Marketplace khusus pelajar & mahasiswa Indonesia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-bg text-ink antialiased" suppressHydrationWarning>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          {children}
          <Toast />
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
