'use client'

import { useState } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useAdminSSE } from '@/hooks/useAdminSSE'
import { adminApi } from '@/api/admin'
import { TableWithOrders, OrderStatus } from '@/types'
import TableCard from './TableCard'
import OrderDetailModal from './OrderDetailModal'
import TableHistoryModal from './TableHistoryModal'

export default function DashboardPage() {
  const { token, logout } = useAdminAuth()
  const { tables } = useAdminSSE(token)
  const [selectedTable, setSelectedTable] = useState<TableWithOrders | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    if (token) {
      await adminApi.updateOrderStatus(token, orderId, status)
    }
  }

  const handleDelete = async (orderId: string) => {
    if (token) {
      await adminApi.deleteOrder(token, orderId)
      setSelectedTable(null)
    }
  }

  const handleComplete = async () => {
    if (token && selectedTable) {
      await adminApi.completeTable(token, selectedTable.table.id)
      setSelectedTable(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">주문 관리</h1>
        <button onClick={logout} className="text-gray-600 hover:text-gray-800">로그아웃</button>
      </header>

      <main className="p-4">
        <div data-testid="dashboard-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <TableCard
              key={table.table.id}
              table={table}
              onClick={() => setSelectedTable(table)}
            />
          ))}
        </div>
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
