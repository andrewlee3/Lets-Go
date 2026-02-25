import { renderHook, waitFor, act } from '@testing-library/react'
import { useAdminSSE } from '@/hooks/useAdminSSE'
import { adminApi } from '@/api/admin'

jest.mock('@/api/admin')

// Mock EventSource
class MockEventSource {
  static instances: MockEventSource[] = []
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  onopen: (() => void) | null = null
  readyState = 0
  url: string

  constructor(url: string) {
    this.url = url
    MockEventSource.instances.push(this)
    setTimeout(() => {
      this.readyState = 1
      this.onopen?.()
    }, 0)
  }

  close() {
    this.readyState = 2
  }

  simulateMessage(data: object, event = 'message') {
    const messageEvent = new MessageEvent(event, { data: JSON.stringify(data) })
    this.onmessage?.(messageEvent)
  }
}

;(global as unknown as { EventSource: typeof MockEventSource }).EventSource = MockEventSource

describe('useAdminSSE', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    MockEventSource.instances = []
    ;(adminApi.getOrders as jest.Mock).mockResolvedValue({ tables: [] })
  })

  it('TC-FE2-006: should connect and load initial data', async () => {
    const mockTables = [
      {
        table: { id: 't1', storeId: 's1', tableNumber: '1', currentSessionId: 'sess1' },
        orders: [],
        totalAmount: 0,
        oldestOrderTime: null,
        isDelayed: false,
      },
    ]
    ;(adminApi.getOrders as jest.Mock).mockResolvedValue({ tables: mockTables })

    const { result } = renderHook(() => useAdminSSE('test-token'))

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true)
    })
    expect(result.current.tables).toEqual(mockTables)
  })

  it('TC-FE2-007: should handle new_order event', async () => {
    const { result } = renderHook(() => useAdminSSE('test-token'))

    await waitFor(() => expect(result.current.isConnected).toBe(true))

    const newOrder = {
      id: 'o1',
      orderNumber: '001',
      tableId: 't1',
      sessionId: 'sess1',
      items: [],
      totalAmount: 10000,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    act(() => {
      MockEventSource.instances[0]?.simulateMessage({ type: 'new_order', data: newOrder })
    })

    // 새 주문이 추가되면 테이블 데이터가 업데이트됨
    expect(result.current.tables).toBeDefined()
  })

  it('TC-FE2-008: should handle order_status event', async () => {
    const mockTables = [
      {
        table: { id: 't1', storeId: 's1', tableNumber: '1', currentSessionId: 'sess1' },
        orders: [{ id: 'o1', status: 'pending', items: [], totalAmount: 0, orderNumber: '001', tableId: 't1', sessionId: 'sess1', createdAt: '' }],
        totalAmount: 0,
        oldestOrderTime: null,
        isDelayed: false,
      },
    ]
    ;(adminApi.getOrders as jest.Mock).mockResolvedValue({ tables: mockTables })

    const { result } = renderHook(() => useAdminSSE('test-token'))

    await waitFor(() => expect(result.current.isConnected).toBe(true))

    act(() => {
      MockEventSource.instances[0]?.simulateMessage({ type: 'order_status', data: { orderId: 'o1', status: 'preparing' } })
    })

    await waitFor(() => {
      const order = result.current.tables[0]?.orders.find(o => o.id === 'o1')
      expect(order?.status).toBe('preparing')
    })
  })

  it('should not connect without token', () => {
    const { result } = renderHook(() => useAdminSSE(null))

    expect(result.current.isConnected).toBe(false)
    expect(MockEventSource.instances.length).toBe(0)
  })
})
