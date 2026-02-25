'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAdminAuth()
  const [storeId, setStoreId] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await login(storeId, username, password)
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96" suppressHydrationWarning>
        <h1 className="text-2xl font-bold mb-6 text-center">관리자 로그인</h1>

        {error && (
          <div data-testid="login-error" className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          data-testid="login-store-id"
          type="text"
          placeholder="매장 식별자"
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
          className="w-full p-3 border rounded mb-4"
          required
          suppressHydrationWarning
        />
        <input
          data-testid="login-username"
          type="text"
          placeholder="사용자명"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border rounded mb-4"
          required
          suppressHydrationWarning
        />
        <input
          data-testid="login-password"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded mb-4"
          required
          suppressHydrationWarning
        />
        <button
          data-testid="login-submit"
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  )
}
