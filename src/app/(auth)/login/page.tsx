'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie'
import NeoButton from '@/components/ui/NeoButton'
import NeoInput from '@/components/ui/NeoInput'
import { useAuthStore } from '@/lib/store/authStore'
import { authApi } from '@/lib/api/auth'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GoogleLoginButton from '@/components/auth/GoogleLoginButton'

interface LoginForm { email: string; password: string }

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasRedirect, setHasRedirect] = useState(false)

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('redirect')) setHasRedirect(true)
  }, [])

  const onSubmit = async (data: LoginForm) => {
    setLoading(true); setError('')
    try {
      const res = await authApi.login(data)
      Cookies.set('token', res.token, { expires: 7 })
      setAuth(res.user, res.token)
      const redirect = res.user.role === 'ADMIN' ? '/admin/dashboard'
        : new URLSearchParams(window.location.search).get('redirect') || '/'
      router.push(redirect)
    } catch (e: any) { setError(e.message || 'Login gagal') }
    finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen flex bg-[#FFFBF0]">
      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-between w-[42%] bg-[#FF3CAC] border-r-[3px] border-[#0A0A0A] p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-[#FF6B2B] border-2 border-[#0A0A0A] rotate-12 translate-x-12 -translate-y-12" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#FFE135] border-2 border-[#0A0A0A] -rotate-6 -translate-x-6 translate-y-6" />
        <Link href="/" className="relative z-10 font-display font-extrabold text-3xl text-white">SC<span className="text-[#FFE135]">.</span></Link>
        <div className="relative z-10">
          <h2 className="font-display font-extrabold text-5xl text-white leading-tight mb-4">Beli. Jual.<br />Sukses.</h2>
          <p className="text-white/80 text-base max-w-xs font-medium">Platform marketplace eksklusif untuk pelajar Indonesia.</p>
        </div>
        <div className="relative z-10 bg-white/20 border-2 border-white/40 p-4">
          <p className="text-white font-bold text-sm">"Beli buku bekas jadi gampang!" ⭐⭐⭐⭐⭐</p>
          <p className="text-white/70 text-xs mt-1">— Mahasiswa UI</p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="w-full max-w-[420px]">
          <Link href="/" className="md:hidden font-display font-extrabold text-2xl text-[#0A0A0A] block mb-6">SC<span className="text-[#FF6B2B]">.</span></Link>
          <h1 className="font-display font-extrabold text-3xl uppercase tracking-tight text-[#0A0A0A] mb-1">Selamat Datang</h1>
          <p className="text-sm text-[#B0A090] font-medium mb-8">Masuk ke akun untuk mulai berdagang.</p>

          {hasRedirect && (
            <div className="mb-5 p-3 border-2 border-[#0A0A0A] border-l-4 border-l-[#FF6B2B] bg-[#FFF5D6] text-sm font-medium">
              Masuk dulu untuk mengakses halaman tersebut.
            </div>
          )}
          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="mb-5 p-3 bg-[#FF1744] border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] text-sm font-bold text-white">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <NeoInput {...register('email', { required: 'Email wajib diisi' })} type="email" label="Email" placeholder="nama@email.com" error={errors.email?.message} />
            <NeoInput {...register('password', { required: 'Password wajib diisi' })} type="password" label="Kata Sandi" placeholder="••••••••" error={errors.password?.message} />
            <NeoButton type="submit" variant="yellow" size="lg" fullWidth loading={loading}>Masuk Sekarang →</NeoButton>
          </form>

          <div className="flex items-center gap-4 my-5">
            <hr className="flex-1 border-t-2 border-[#0A0A0A]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#B0A090]">Atau</span>
            <hr className="flex-1 border-t-2 border-[#0A0A0A]" />
          </div>

          <GoogleLoginButton />

          <div className="mt-6 pt-6 border-t-2 border-[#0A0A0A] text-center text-sm text-[#B0A090] font-medium">
            Belum punya akun?{' '}
            <Link href="/register" className="text-[#0A0A0A] font-extrabold hover:text-[#FF6B2B] transition-colors">Daftar →</Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
