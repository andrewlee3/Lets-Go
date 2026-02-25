import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext'
import { adminApi } from '@/api/admin'

jest.mock('@/api/admin')

const TestComponent = () => {
  const { admin, token, isAuthenticated, isLoading, login, logout } = useAdminAuth()
  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'ready'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'yes' : 'no'}</div>
      <div data-testid="admin">{admin?.username || 'none'}</div>
      <div data-testid="token">{token || 'none'}</div>
      <button onClick={() => login('store1', 'admin', 'pass')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AdminAuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('TC-FE2-001: should have initial state', async () => {
    render(
      <AdminAuthProvider>
        <TestComponent />
      </AdminAuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready')
    })
    expect(screen.getByTestId('authenticated')).toHaveTextContent('no')
    expect(screen.getByTestId('admin')).toHaveTextContent('none')
  })

  it('TC-FE2-002: should login successfully', async () => {
    const user = userEvent.setup()
    ;(adminApi.login as jest.Mock).mockResolvedValueOnce({
      token: 'test-token',
      expiresIn: 57600,
    })

    render(
      <AdminAuthProvider>
        <TestComponent />
      </AdminAuthProvider>
    )

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('ready'))
    await user.click(screen.getByText('Login'))

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('yes')
    })
    expect(screen.getByTestId('token')).toHaveTextContent('test-token')
  })

  it('TC-FE2-003: should throw on invalid credentials', async () => {
    const user = userEvent.setup()
    ;(adminApi.login as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'))

    const ErrorTestComponent = () => {
      const { isAuthenticated, isLoading, login } = useAdminAuth()
      const [error, setError] = useState<string | null>(null)
      return (
        <div>
          <div data-testid="loading">{isLoading ? 'loading' : 'ready'}</div>
          <div data-testid="authenticated">{isAuthenticated ? 'yes' : 'no'}</div>
          <div data-testid="error">{error || 'none'}</div>
          <button onClick={() => login('store1', 'admin', 'wrong').catch(e => setError(e.message))}>Login</button>
        </div>
      )
    }

    render(
      <AdminAuthProvider>
        <ErrorTestComponent />
      </AdminAuthProvider>
    )

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('ready'))
    await user.click(screen.getByText('Login'))

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('no')
      expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials')
    })
  })

  it('TC-FE2-004: should logout', async () => {
    const user = userEvent.setup()
    ;(adminApi.login as jest.Mock).mockResolvedValueOnce({
      token: 'test-token',
      expiresIn: 57600,
    })

    render(
      <AdminAuthProvider>
        <TestComponent />
      </AdminAuthProvider>
    )

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('ready'))
    await user.click(screen.getByText('Login'))
    await waitFor(() => expect(screen.getByTestId('authenticated')).toHaveTextContent('yes'))

    await user.click(screen.getByText('Logout'))

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('no')
      expect(screen.getByTestId('token')).toHaveTextContent('none')
    })
  })

  it('TC-FE2-005: should restore session from localStorage', async () => {
    localStorage.setItem('admin_token', 'stored-token')
    localStorage.setItem('admin_info', JSON.stringify({ userId: '1', username: 'admin', storeId: 'store1' }))

    render(
      <AdminAuthProvider>
        <TestComponent />
      </AdminAuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('yes')
      expect(screen.getByTestId('token')).toHaveTextContent('stored-token')
    })
  })
})
