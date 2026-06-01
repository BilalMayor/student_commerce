'use client'

import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/lib/hooks/useToast'

export default function GoogleLoginButton() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [loading, setLoading] = useState(false)

  const handleGoogleSuccess = async (credential: string) => {
    setLoading(true)
    try {
      const res = await authApi.googleLogin({ idToken: credential, credential })
      Cookies.set('token', res.token, { expires: 7 })
      setAuth(res.user, res.token)
      toast.success('Login Google berhasil!')

      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect') || '/'
      router.push(redirect)
    } catch (e: any) {
      toast.error(e.message || 'Login Google gagal. Hubungi admin atau coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full justify-center py-2 relative">
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-2xl">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse?.credential) {
              handleGoogleSuccess(credentialResponse.credential)
            }
          }}
          onError={() => toast.error('Login Google dibatalkan atau gagal.')}
          size="large"
          text="continue_with"
          shape="rectangular"
          theme="outline"
          width={400}
          use_fedcm_for_prompt={false}
        />
      </div>
    </div>
  )
}
