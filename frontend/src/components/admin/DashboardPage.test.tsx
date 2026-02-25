import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DashboardPage from '@/components/admin/DashboardPage'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import { adminApi } from '@/api/admin'
import * as useAdminSSEModule from '@/hooks/useAdminSSE'

jest.mock('@/api/admin')
jest.mock('@/hooks/useAdminSSE')

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.setItem('admin_token', 'test-token')
    localStorage.setItem('admin_info', JSON.stringify({ userId: '1', username: 'admin', storeId: 's1' }))
  })

  it('TC-FE2-012: should render table cards grid', async () => {
    ;(useAdminSSEModule.useAdminSSE as jest.Mock).mockReturnValue({
      tables: [
        { table: { id: 't1', storeId: 's1', tableNumber: '1', currentSessionId: 'sess1' }, orders: [], totalAmount: 10000, oldestOrderTime: null, isDelayed: false },
        { table: { id: 't2', storeId: 's1', tableNumber: '2', currentSessionId: 'sess2' }, orders: [], totalAmount: 20000, oldestOrderTime: null, isDelayed: false },
      ],
      isConnected: true,
      error: null,
    })

    render(
      <AdminAuthProvider>
        <DashboardPage />
      </AdminAuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-grid')).toBeInTheDocument()
    })
    expect(screen.getAllByTestId('table-card')).toHaveLength(2)
  })

  it('TC-FE2-013: should show modal on card click', async () => {
    const user = userEvent.setup()
    ;(useAdminSSEModule.useAdminSSE as jest.Mock).mockReturnValue({
      tables: [
        { table: { id: 't1', storeId: 's1', tableNumber: '1', currentSessionId: 'sess1' }, orders: [{ id: 'o1', orderNumber: '001', items: [], totalAmount: 10000, status: 'pending', tableId: 't1', sessionId: 'sess1', createdAt: '' }], totalAmount: 10000, oldestOrderTime: null, isDelayed: false },
      ],
      isConnected: true,
      error: null,
    })

    render(
      <AdminAuthProvider>
        <DashboardPage />
      </AdminAuthProvider>
    )

    await waitFor(() => expect(screen.getByTestId('table-card')).toBeInTheDocument())
    await user.click(screen.getByTestId('table-card'))

    await waitFor(() => {
      expect(screen.getByTestId('order-detail-modal')).toBeInTheDocument()
    })
  })
})
