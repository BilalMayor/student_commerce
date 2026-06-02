import './globals.css'
import { Toaster } from 'sonner'
import { GoogleOAuthProvider } from '@react-oauth/google'

export const metadata = {
  title: 'StudentCommerce — Marketplace Pelajar',
  description: 'Marketplace khusus pelajar & mahasiswa Indonesia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-[#FFFBF0] text-[#0A0A0A] antialiased" suppressHydrationWarning>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                fontFamily: 'var(--font-body, DM Sans, sans-serif)',
                fontWeight: 600,
                fontSize: '14px',
                border: '2px solid #0A0A0A',
                borderRadius: '0px',
                boxShadow: '4px 4px 0px #0A0A0A',
              },
              classNames: {
                success: 'bg-[#00C853] text-white',
                error: 'bg-[#FF1744] text-white',
                info: 'bg-[#2B59FF] text-white',
              },
            }}
          />
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
