import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OrderDetailModal from '@/components/admin/OrderDetailModal'
import { TableWithOrders } from '@/types'

describe('OrderDetailModal', () => {
  const mockTable: TableWithOrders = {
    table: { id: 't1', storeId: 's1', tableNumber: '5', currentSessionId: 'sess1' },
    orders: [
      { id: 'o1', orderNumber: '001', tableId: 't1', sessionId: 'sess1', items: [{ menuId: 'm1', menuName: '김치찌개', quantity: 2, unitPrice: 8000 }], totalAmount: 16000, status: 'pending', createdAt: '2026-02-25T10:00:00Z' },
    ],
    totalAmount: 16000,
    oldestOrderTime: '2026-02-25T10:00:00Z',
    isDelayed: false,
  }

  const defaultProps = {
    table: mockTable,
    onClose: jest.fn(),
    onStatusChange: jest.fn(),
    onDelete: jest.fn(),
    onComplete: jest.fn(),
    onShowHistory: jest.fn(),
  }

  it('TC-FE2-016: should display orders', () => {
    render(<OrderDetailModal {...defaultProps} />)

    expect(screen.getByTestId('order-detail-modal')).toBeInTheDocument()
    expect(screen.getByText(/김치찌개/)).toBeInTheDocument()
    expect(screen.getByText(/001/)).toBeInTheDocument()
  })

  it('TC-FE2-017: should call onStatusChange', async () => {
    const user = userEvent.setup()
    render(<OrderDetailModal {...defaultProps} />)

    await user.click(screen.getByTestId('status-preparing-o1'))
    expect(defaultProps.onStatusChange).toHaveBeenCalledWith('o1', 'preparing')
  })

  it('TC-FE2-018: should show delete confirmation', async () => {
    const user = userEvent.setup()
    render(<OrderDetailModal {...defaultProps} />)

    await user.click(screen.getByTestId('delete-order-o1'))
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()
  })

  it('TC-FE2-019: should show complete confirmation', async () => {
    const user = userEvent.setup()
    render(<OrderDetailModal {...defaultProps} />)

    await user.click(screen.getByTestId('complete-table'))
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()
  })
})
