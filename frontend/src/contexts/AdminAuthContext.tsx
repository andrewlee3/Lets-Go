'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { AdminInfo } from '@/types'
import { adminApi } from '@/api/admin'

export interface AdminAuthContextValue {
  admin: AdminInfo | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (storeId: string, username: string, password: string) => Promise<void>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminInfo | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token')
    const storedAdmin = localStorage.getItem('admin_info')
    if (storedToken && storedAdmin) {
      setToken(storedToken)
      setAdmin(JSON.parse(storedAdmin))
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (storeId: string, username: string, password: string) => {
    const res = await adminApi.login(storeId, username, password)
    const adminInfo: AdminInfo = { userId: '', username, storeId }
    setToken(res.token)
    setAdmin(adminInfo)
    localStorage.setItem('admin_token', res.token)
    localStorage.setItem('admin_info', JSON.stringify(adminInfo))
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setAdmin(null)
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_info')
  }, [])

  return (
    <AdminAuthContext.Provider
      value={{ admin, token, isAuthenticated: !!token, isLoading, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}
