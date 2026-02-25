'use client'

import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useAdminSSE } from '@/hooks/useAdminSSE'
import { adminApi } from '@/api/admin'
import { TableWithOrders, OrderStatus } from '@/types'
import TableCard from './TableCard'
import OrderDetailModal from './OrderDetailModal'
import TableHistoryModal from './TableHistoryModal'

export default function DashboardPage() {
  const { token, logout } = useAdminAuth()
  const { tables, refresh } = useAdminSSE(token)
  const [selectedTable, setSelectedTable] = useState<TableWithOrders | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  // tables가 업데이트되면 selectedTable도 동기화
  useEffect(() => {
    if (selectedTable) {
      const updated = tables.find(t => t.table.id === selectedTable.table.id)
      if (updated) {
        setSelectedTable(updated)
      } else {
        setSelectedTable(null) // 테이블이 사라졌으면 모달 닫기
      }
    }
  }, [tables])

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    // Mock: localStorage에서 주문 상태 변경
    const ordersJson = localStorage.getItem('orders')
    if (ordersJson) {
      const orders: any[] = JSON.parse(ordersJson)
      const updated = orders.map(o => o.id === orderId ? { ...o, status } : o)
      localStorage.setItem('orders', JSON.stringify(updated))
      refresh() // 즉시 새로고침
    }
  }

  const handleDelete = async (orderId: string) => {
    // Mock: localStorage에서 주문 삭제
    const ordersJson = localStorage.getItem('orders')
    if (ordersJson) {
      const orders: any[] = JSON.parse(ordersJson)
      const filtered = orders.filter(o => o.id !== orderId)
      localStorage.setItem('orders', JSON.stringify(filtered))
      refresh() // 즉시 새로고침
    }
  }

  const handleComplete = async () => {
    // Mock: 테이블의 모든 주문 삭제
    if (selectedTable) {
      const ordersJson = localStorage.getItem('orders')
      if (ordersJson) {
        const orders: any[] = JSON.parse(ordersJson)
        const filtered = orders.filter(o => o.tableId !== selectedTable.table.id)
        localStorage.setItem('orders', JSON.stringify(filtered))
        refresh() // 즉시 새로고침
      }
    }
    setSelectedTable(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🍽️ 주문 관리 대시보드</h1>
            <p className="text-sm text-gray-500 mt-1">실시간 테이블 주문 현황</p>
          </div>
          <button 
            onClick={logout} 
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tables.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-xl text-gray-600">현재 주문이 없습니다</p>
            <p className="text-sm text-gray-500 mt-2">새로운 주문이 들어오면 여기에 표시됩니다</p>
          </div>
        ) : (
          <div data-testid="dashboard-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tables.map((table) => (
              <TableCard
                key={table.table.id}
                table={table}
                onClick={() => setSelectedTable(table)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedTable && (
        <OrderDetailModal
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onComplete={handleComplete}
          onShowHistory={() => setShowHistory(true)}
        />
      )}

      {showHistory && selectedTable && (
        <TableHistoryModal
          tableId={selectedTable.table.id}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  )
}
