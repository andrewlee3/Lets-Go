'use client'

import { useState, useEffect, useCallback } from 'react'
import { TableWithOrders, Order, OrderStatus } from '@/types'
import { adminApi } from '@/api/admin'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface UseAdminSSEReturn {
  tables: TableWithOrders[]
  isConnected: boolean
  error: Error | null
}

export function useAdminSSE(token: string | null): UseAdminSSEReturn {
  const [tables, setTables] = useState<TableWithOrders[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!token) return

    // 초기 데이터 로드
    adminApi.getOrders(token).then(res => setTables(res.tables)).catch(setError)

    // SSE 연결
    const es = new EventSource(`${API_BASE}/api/admin/sse/orders?token=${token}`)

    es.onopen = () => setIsConnected(true)
    es.onerror = () => setError(new Error('SSE connection error'))

    es.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data)

      if (type === 'new_order') {
        setTables(prev => {
          const order = data as Order
          return prev.map(t =>
            t.table.id === order.tableId
              ? { ...t, orders: [...t.orders, order], totalAmount: t.totalAmount + order.totalAmount }
              : t
          )
        })
      }

      if (type === 'order_status') {
        const { orderId, status } = data as { orderId: string; status: OrderStatus }
        setTables(prev =>
          prev.map(t => ({
            ...t,
            orders: t.orders.map(o => (o.id === orderId ? { ...o, status } : o)),
          }))
        )
      }

      if (type === 'order_deleted') {
        const { orderId } = data as { orderId: string }
        setTables(prev =>
          prev.map(t => {
            const order = t.orders.find(o => o.id === orderId)
            return {
              ...t,
              orders: t.orders.filter(o => o.id !== orderId),
              totalAmount: order ? t.totalAmount - order.totalAmount : t.totalAmount,
            }
          })
        )
      }
    }

    return () => es.close()
  }, [token])

  return { tables, isConnected, error }
}
