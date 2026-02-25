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

  return (
    <div
      data-testid="table-card"
      onClick={onClick}
      className={`p-4 rounded-lg shadow cursor-pointer transition-colors ${
        table.isDelayed ? 'bg-red-100 border-red-300' : 'bg-white hover:bg-gray-50'
      } border`}
    >
      <div className="flex justify-between items-center mb-2">
        <span data-testid="table-card-number" className="text-xl font-bold">
          {table.table.tableNumber}
        </span>
        <span className="text-sm text-gray-500">{table.orders.length}건</span>
      </div>
      <div data-testid="table-card-amount" className="text-lg font-semibold text-blue-600">
        {formatAmount(table.totalAmount)}원
      </div>
      <div className="text-sm text-gray-500 mt-1">
        {formatTime(table.oldestOrderTime)}
      </div>
    </div>
  )
}
