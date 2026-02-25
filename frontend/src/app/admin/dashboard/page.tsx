'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardPage from '@/components/admin/DashboardPage'
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext'

function DashboardGuard() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAdminAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return <DashboardPage />
}

export default function AdminDashboardPage() {
  return (
    <AdminAuthProvider>
      <DashboardGuard />
    </AdminAuthProvider>
  )
}
