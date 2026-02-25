import { adminApi } from '@/api/admin'

// Mock fetch
global.fetch = jest.fn()

describe('adminApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should return token on successful login', async () => {
      const mockResponse = { token: 'test-token', expiresIn: 57600 }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await adminApi.login('store1', 'admin', 'password')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ storeId: 'store1', username: 'admin', password: 'password' }),
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('should throw error on invalid credentials', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Invalid credentials' }),
      })

      await expect(adminApi.login('store1', 'admin', 'wrong')).rejects.toThrow()
    })
  })

  describe('getOrders', () => {
    it('should return tables with orders', async () => {
      const mockResponse = { tables: [] }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await adminApi.getOrders('token')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/orders'),
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: 'Bearer token' }),
        })
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('updateOrderStatus', () => {
    it('should update order status', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      await adminApi.updateOrderStatus('token', 'order1', 'preparing')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/orders/order1/status'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ status: 'preparing' }),
        })
      )
    })
  })

  describe('deleteOrder', () => {
    it('should delete order', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      await adminApi.deleteOrder('token', 'order1')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/orders/order1'),
        expect.objectContaining({ method: 'DELETE' })
      )
    })
  })

  describe('completeTable', () => {
    it('should complete table session', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      await adminApi.completeTable('token', 'table1')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/tables/table1/complete'),
        expect.objectContaining({ method: 'POST' })
      )
    })
  })

  describe('getTableHistory', () => {
    it('should return table history', async () => {
      const mockResponse = { sessions: [] }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await adminApi.getTableHistory('token', 'table1')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/tables/table1/history'),
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: 'Bearer token' }),
        })
      )
      expect(result).toEqual(mockResponse)
    })
  })
})
