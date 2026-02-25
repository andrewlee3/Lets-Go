'use client'

import { useState, useEffect, useCallback } from 'react'
import { TableWithOrders, Order, OrderStatus } from '@/types'

export interface UseAdminSSEReturn {
  tables: TableWithOrders[]
  isConnected: boolean
  error: Error | null
}

export function useAdminSSE(token: string | null): UseAdminSSEReturn {
  const [tables, setTables] = useState<TableWithOrders[]>([])
  const [isConnected, setIsConnected] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!token) return

    // Mock: localStorage에서 주문 로드
    const loadOrders = () => {
      const ordersJson = localStorage.getItem('orders')
      if (!ordersJson) {
        setTables([])
        return
      }

      const orders: Order[] = JSON.parse(ordersJson)
      
      // 테이블별로 그룹화
      const tableMap = new Map<string, TableWithOrders>()
      
      orders.forEach(order => {
        const tableId = order.tableId || 'table-1'
        const tableNumber = tableId.replace('table-', '')
        
        if (!tableMap.has(tableId)) {
          tableMap.set(tableId, {
            table: {
              id: tableId,
              tableNumber,
              storeId: 'store1',
              currentSessionId: 'session-1',
            },
            orders: [],
            totalAmount: 0,
          })
        }
        
        const tableData = tableMap.get(tableId)!
        tableData.orders.push(order)
        tableData.totalAmount += order.totalAmount
      })
      
      setTables(Array.from(tableMap.values()))
    }

    loadOrders()

    // 주기적으로 새로고침 (새 주문 감지)
    const interval = setInterval(loadOrders, 2000)

    return () => clearInterval(interval)
  }, [token])

  return { tables, isConnected, error }
}
