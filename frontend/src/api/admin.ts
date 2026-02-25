import { AuthResponse, OrderStatus, TableWithOrders, PastSession } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || 'Request failed')
  }
  return res.json()
}

export const adminApi = {
  async login(storeId: string, username: string, password: string): Promise<AuthResponse> {
    return request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ storeId, username, password }),
    })
  },

  async getOrders(token: string): Promise<{ tables: TableWithOrders[] }> {
    return request('/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  async updateOrderStatus(token: string, orderId: string, status: OrderStatus): Promise<void> {
    await request(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    })
  },

  async deleteOrder(token: string, orderId: string): Promise<void> {
    await request(`/api/admin/orders/${orderId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  async completeTable(token: string, tableId: string): Promise<void> {
    await request(`/api/admin/tables/${tableId}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  async getTableHistory(token: string, tableId: string): Promise<{ sessions: PastSession[] }> {
    return request(`/api/admin/tables/${tableId}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  },
}
