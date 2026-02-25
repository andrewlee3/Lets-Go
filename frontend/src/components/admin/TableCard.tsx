'use client'

import { TableWithOrders } from '@/types'

interface TableCardProps {
  table: TableWithOrders
  onClick: () => void
}

export default function TableCard({ table, onClick }: TableCardProps) {
  const formatAmount = (amount: number) => amount.toLocaleString()
  const formatTime = (time: string | null) => {
    if (!time) return '-'
    return new Date(time).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  }

  const hasOrders = table.orders.length > 0
  const statusColor = table.isDelayed ? 'border-red-400 bg-red-50' : hasOrders ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'

  return (
    <div
      data-testid="table-card"
      onClick={onClick}
      className={`p-6 rounded-xl shadow-lg cursor-pointer transition-all hover:shadow-xl hover:scale-105 border-2 ${statusColor}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-sm text-gray-500 font-medium mb-1">테이블</div>
          <span data-testid="table-card-number" className="text-3xl font-bold text-gray-900">
            {table.table.tableNumber}번
          </span>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
          table.isDelayed ? 'bg-red-500 text-white' : hasOrders ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
        }`}>
          {table.orders.length}건
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">총 금액</span>
          <span data-testid="table-card-amount" className="text-xl font-bold text-blue-600">
            ₩{formatAmount(table.totalAmount)}
          </span>
        </div>
        {table.oldestOrderTime && (
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600">첫 주문</span>
            <span className="text-sm text-gray-500 font-medium">
              {formatTime(table.oldestOrderTime)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
