import Cookies from 'js-cookie'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://uklsm4-production.up.railway.app'

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append('file', file)

  let token = Cookies.get('token')
  if (!token && typeof window !== 'undefined') {
    const stored = localStorage.getItem('auth-storage')
    if (stored) {
      try {
        token = JSON.parse(stored).state.token
      } catch (e) {}
    }
  }

  const res = await fetch(`${BASE_URL}/upload/image`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || 'Upload gagal')
  }

  return res.json()
}

export async function uploadFile(file: File): Promise<{ url: string; size: number }> {
  const formData = new FormData()
  formData.append('file', file)

  let token = Cookies.get('token')
  if (!token && typeof window !== 'undefined') {
    const stored = localStorage.getItem('auth-storage')
    if (stored) {
      try {
        token = JSON.parse(stored).state.token
      } catch (e) {}
    }
  }

  const res = await fetch(`${BASE_URL}/upload/file`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || 'Upload file gagal')
  }

  return res.json()
}
