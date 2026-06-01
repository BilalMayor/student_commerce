'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuthStore } from '@/lib/store/authStore'
import { authApi } from '@/lib/api/auth'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import GoogleLoginButton from '@/components/auth/GoogleLoginButton'

interface RegisterForm {
  name: string
  email: string
  password: string
  role: 'BUYER' | 'SELLER'
}

export default function RegisterPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({ defaultValues: { role: 'BUYER' } })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    setError('')
    try {
      const res = await authApi.register(data)
      Cookies.set('token', res.token, { expires: 7 })
      setAuth(res.user, res.token)
      router.push('/')
    } catch (e: any) {
      setError(e.message || 'Registrasi gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#FAF7F2]">
      <div className="w-full max-w-[440px] flex flex-col gap-8">
        <div className="bg-white border border-[#d5c3b8] rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-[#1c1c19] mb-2">Buat Akun</h1>
            <p className="text-[#50443c]">Bergabunglah bersama komunitas kami.</p>
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
              {...register('name', { required: 'Nama wajib diisi' })}
              label="Nama Lengkap"
              error={errors.name?.message}
            />
            
            <Input
              {...register('email', { required: 'Email wajib diisi' })}
              type="email"
              label="Alamat Email"
              error={errors.email?.message}
            />
            
            <Input
              {...register('password', {
                required: 'Password wajib diisi',
                minLength: { value: 6, message: 'Minimal 6 karakter' },
              })}
              type="password"
              label="Kata Sandi"
              error={errors.password?.message}
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#50443c]">Daftar Sebagai</label>
              <div className="relative">
                <select
                  {...register('role')}
                  className="w-full rounded-xl border border-[#d5c3b8] bg-white px-4 py-3 text-sm outline-none focus:border-[#7f5531] focus:ring-2 focus:ring-[#c8956c] text-[#1c1c19] appearance-none transition-all"
                >
                  <option value="BUYER">Pembeli</option>
                  <option value="SELLER">Penjual</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#83746a] pointer-events-none" />
              </div>
            </div>

            <Button type="submit" fullWidth loading={loading} size="lg">
              Daftar Sekarang
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
              Sudah punya akun? <Link href="/login" className="text-[#7f5531] font-bold hover:underline">Masuk</Link>
            </p>
          </div>
        </div>

        <div className="hidden md:block border border-[#d5c3b8]/50 rounded-xl overflow-hidden opacity-70">
          <div className="bg-gradient-to-r from-[#ffdcc2] to-[#ffddb6] p-6 text-center">
            <p className="text-xs italic text-[#50443c]">"Platform andalan mahasiswa dari penjuru Nusantara."</p>
          </div>
        </div>
      </div>
    </main>
  )
}
