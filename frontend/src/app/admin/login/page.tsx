import LoginPage from '@/components/admin/LoginPage'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'

export default function AdminLoginPage() {
  return (
    <AdminAuthProvider>
      <LoginPage />
    </AdminAuthProvider>
  )
}
