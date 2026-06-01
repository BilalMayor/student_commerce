'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Cookies from 'js-cookie'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuthStore } from '@/lib/store/authStore'
import { authApi } from '@/lib/api/auth'
import { useState, useEffect } from 'react'
import { Info } from 'lucide-react'
import { motion } from 'framer-motion'
import GoogleLoginButton from '@/components/auth/GoogleLoginButton'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasRedirect, setHasRedirect] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('redirect')) {
      setHasRedirect(true)
    }
  }, [])

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError('')
    try {
      const res = await authApi.login(data)
      Cookies.set('token', res.token, { expires: 7 })
      setAuth(res.user, res.token)
      
      // Handle redirect
      let redirect = '/'
      if (res.user.role === 'ADMIN') {
        redirect = '/admin/dashboard'
      } else {
        const params = new URLSearchParams(window.location.search)
        redirect = params.get('redirect') || '/'
      }
      router.push(redirect)
    } catch (e: any) {
      setError(e.message || 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#FAF7F2]">
      <div className="w-full max-w-[440px] flex flex-col gap-8">
        
        {hasRedirect && (
          <div className="bg-[#ffd9ae]/30 border border-[#ffd9ae] p-4 rounded-xl flex items-start gap-3">
            <Info size={18} className="text-[#795e3b] shrink-0 mt-0.5" />
            <p className="text-sm text-[#795e3b]">Anda perlu masuk untuk mengakses halaman tersebut.</p>
          </div>
        )}
        
        <div className="bg-white border border-[#d5c3b8] rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-[#1c1c19] mb-2">Selamat Datang</h1>
            <p className="text-[#50443c]">Masuk ke akun Anda untuk mulai berdagang.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/20 px-4 py-3 text-sm font-medium text-[#93000a] mb-6"
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <Input
              {...register('email', { required: 'Email wajib diisi' })}
              type="email"
              label="Alamat Email"
              error={errors.email?.message}
            />
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-end">
                <a className="text-xs text-[#7f5531] hover:underline cursor-pointer">Lupa sandi?</a>
              </div>
              <Input
                {...register('password', { required: 'Password wajib diisi' })}
                type="password"
                label="Kata Sandi"
                error={errors.password?.message}
              />
            </div>
            
            <Button type="submit" fullWidth loading={loading} size="lg">
              Masuk Sekarang
            </Button>
            
            <div className="flex items-center gap-4">
              <hr className="flex-1 border-[#d5c3b8]" />
              <span className="text-xs text-[#50443c] uppercase tracking-wider">Atau</span>
              <hr className="flex-1 border-[#d5c3b8]" />
            </div>
            
            <div className="w-full">
              <GoogleLoginButton />
            </div>
          </form>
          
          <div className="mt-8 pt-8 border-t border-[#d5c3b8] text-center">
            <p className="text-sm text-[#50443c]">
              Belum punya akun? <Link href="/register" className="text-[#7f5531] font-bold hover:underline">Daftar Sekarang</Link>
            </p>
          </div>
        </div>
        
        <div className="hidden md:block border border-[#d5c3b8]/50 rounded-xl overflow-hidden opacity-70">
          <div className="bg-gradient-to-r from-[#ffdcc2] to-[#ffddb6] p-6 text-center">
            <p className="text-xs italic text-[#50443c]">"Marketplace terpercaya untuk mahasiswa oleh mahasiswa."</p>
          </div>
        </div>
      </div>
    </main>
  )
}
