import { render, screen } from '@testing-library/react'
import TableHistoryModal from '@/components/admin/TableHistoryModal'

// Mock the entire context and api
jest.mock('@/contexts/AdminAuthContext', () => ({
  useAdminAuth: () => ({ token: 'test-token' }),
}))

jest.mock('@/api/admin', () => ({
  adminApi: {
    getTableHistory: jest.fn().mockResolvedValue({
      sessions: [
        {
          sessionId: 'sess1',
          orders: [{ id: 'o1', orderNumber: '001', items: [{ menuName: '김치찌개', quantity: 1, unitPrice: 8000 }], totalAmount: 8000, status: 'completed' }],
          totalAmount: 8000,
          completedAt: '2026-02-25T12:00:00Z',
        },
      ],
    }),
  },
}))

describe('TableHistoryModal', () => {
  it('TC-FE2-020: should render history modal', async () => {
    render(<TableHistoryModal tableId="t1" onClose={jest.fn()} />)

    expect(screen.getByTestId('history-modal')).toBeInTheDocument()
    expect((await screen.findAllByText(/8,000/))[0]).toBeInTheDocument()
  })
})
