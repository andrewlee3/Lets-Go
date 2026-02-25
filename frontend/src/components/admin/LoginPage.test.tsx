import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import LoginPage from '@/components/admin/LoginPage'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import { adminApi } from '@/api/admin'

jest.mock('@/api/admin')
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('LoginPage', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  it('TC-FE2-009: should render login form', () => {
    render(
      <AdminAuthProvider>
        <LoginPage />
      </AdminAuthProvider>
    )

    expect(screen.getByTestId('login-store-id')).toBeInTheDocument()
    expect(screen.getByTestId('login-username')).toBeInTheDocument()
    expect(screen.getByTestId('login-password')).toBeInTheDocument()
    expect(screen.getByTestId('login-submit')).toBeInTheDocument()
  })

  it('TC-FE2-010: should redirect on successful login', async () => {
    const user = userEvent.setup()
    ;(adminApi.login as jest.Mock).mockResolvedValueOnce({ token: 'token', expiresIn: 57600 })

    render(
      <AdminAuthProvider>
        <LoginPage />
      </AdminAuthProvider>
    )

    await user.type(screen.getByTestId('login-store-id'), 'store1')
    await user.type(screen.getByTestId('login-username'), 'admin')
    await user.type(screen.getByTestId('login-password'), 'password')
    await user.click(screen.getByTestId('login-submit'))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/dashboard')
    })
  })

  it('TC-FE2-011: should show error on failed login', async () => {
    const user = userEvent.setup()
    ;(adminApi.login as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'))

    render(
      <AdminAuthProvider>
        <LoginPage />
      </AdminAuthProvider>
    )

    await user.type(screen.getByTestId('login-store-id'), 'store1')
    await user.type(screen.getByTestId('login-username'), 'admin')
    await user.type(screen.getByTestId('login-password'), 'wrong')
    await user.click(screen.getByTestId('login-submit'))

    await waitFor(() => {
      expect(screen.getByTestId('login-error')).toBeInTheDocument()
    })
  })
})
