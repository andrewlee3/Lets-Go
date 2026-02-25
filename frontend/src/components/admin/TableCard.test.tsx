import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TableCard from '@/components/admin/TableCard'
import { TableWithOrders } from '@/types'

describe('TableCard', () => {
  const mockTable: TableWithOrders = {
    table: { id: 't1', storeId: 's1', tableNumber: '5', currentSessionId: 'sess1' },
    orders: [{ id: 'o1', orderNumber: '001', tableId: 't1', sessionId: 'sess1', items: [], totalAmount: 15000, status: 'pending', createdAt: '2026-02-25T10:00:00Z' }],
    totalAmount: 15000,
    oldestOrderTime: '2026-02-25T10:00:00Z',
    isDelayed: false,
  }

  it('TC-FE2-014: should display table info', () => {
    render(<TableCard table={mockTable} onClick={jest.fn()} />)

    expect(screen.getByTestId('table-card-number')).toHaveTextContent('5')
    expect(screen.getByTestId('table-card-amount')).toHaveTextContent('15,000')
  })

  it('TC-FE2-015: should highlight delayed orders', () => {
    const delayedTable = { ...mockTable, isDelayed: true }
    render(<TableCard table={delayedTable} onClick={jest.fn()} />)

    const card = screen.getByTestId('table-card')
    expect(card).toHaveClass('bg-red-100')
  })

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()
    render(<TableCard table={mockTable} onClick={onClick} />)

    await user.click(screen.getByTestId('table-card'))
    expect(onClick).toHaveBeenCalled()
  })
})
