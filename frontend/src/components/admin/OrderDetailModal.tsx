'use client'

import { useState } from 'react'
import { TableWithOrders, OrderStatus } from '@/types'

interface OrderDetailModalProps {
  table: TableWithOrders
  onClose: () => void
  onStatusChange: (orderId: string, status: OrderStatus) => void
  onDelete: (orderId: string) => void
  onComplete: () => void
  onShowHistory: () => void
}

export default function OrderDetailModal({
  table,
  onClose,
  onStatusChange,
  onDelete,
  onComplete,
  onShowHistory,
}: OrderDetailModalProps) {
  const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'complete'; orderId?: string } | null>(null)

  const statusLabels: Record<OrderStatus, string> = {
    pending: '주문접수',
    preparing: '조리중',
    completed: '완료',
  }

  const handleConfirm = () => {
    if (confirmAction?.type === 'delete' && confirmAction.orderId) {
      onDelete(confirmAction.orderId)
    } else if (confirmAction?.type === 'complete') {
      onComplete()
    }
    setConfirmAction(null)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div data-testid="order-detail-modal" className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">테이블 {table.table.tableNumber}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-4 space-y-4">
          {table.orders.map((order) => (
            <div key={order.id} className="border rounded p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{order.orderNumber}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  order.status === 'pending' ? 'bg-yellow-100' :
                  order.status === 'preparing' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {statusLabels[order.status]}
                </span>
              </div>
              <div className="space-y-1">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.menuName} x {item.quantity}</span>
                    <span>{(item.unitPrice * item.quantity).toLocaleString()}원</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  data-testid={`status-pending-${order.id}`}
                  onClick={() => onStatusChange(order.id, 'pending')}
                  className="px-2 py-1 text-xs bg-yellow-100 rounded"
                >
                  주문접수
                </button>
                <button
                  data-testid={`status-preparing-${order.id}`}
                  onClick={() => onStatusChange(order.id, 'preparing')}
                  className="px-2 py-1 text-xs bg-blue-100 rounded"
                >
                  조리중
                </button>
                <button
                  data-testid={`status-completed-${order.id}`}
                  onClick={() => onStatusChange(order.id, 'completed')}
                  className="px-2 py-1 text-xs bg-green-100 rounded"
                >
                  완료
                </button>
                <button
                  data-testid={`delete-order-${order.id}`}
                  onClick={() => setConfirmAction({ type: 'delete', orderId: order.id })}
                  className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded ml-auto"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex justify-between">
          <button onClick={onShowHistory} className="px-4 py-2 bg-gray-100 rounded">과거 내역</button>
          <button
            data-testid="complete-table"
            onClick={() => setConfirmAction({ type: 'complete' })}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            이용 완료
          </button>
        </div>
      </div>

      {confirmAction && (
        <div data-testid="confirm-dialog" className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
          <div className="bg-white p-6 rounded-lg">
            <p className="mb-4">
              {confirmAction.type === 'delete' ? '주문을 삭제하시겠습니까?' : '테이블 이용을 완료하시겠습니까?'}
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmAction(null)} className="px-4 py-2 bg-gray-100 rounded">취소</button>
              <button onClick={handleConfirm} className="px-4 py-2 bg-red-600 text-white rounded">확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
