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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div data-testid="order-detail-modal" className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">테이블 {table.table.tableNumber}번</h2>
              <p className="text-blue-100 mt-1">총 {table.orders.length}건 · ₩{table.totalAmount.toLocaleString()}</p>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4 overflow-auto max-h-[calc(90vh-200px)]">
          {table.orders.map((order) => (
            <div key={order.id} className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors bg-white shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="font-bold text-lg text-gray-900">{order.orderNumber}</span>
                  <span className="text-sm text-gray-500 ml-3">
                    {new Date(order.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'preparing' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {statusLabels[order.status]}
                </span>
              </div>
              
              <div className="space-y-2 mb-4 bg-gray-50 rounded-lg p-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-gray-700">
                      <span className="font-medium">{item.menuName}</span>
                      <span className="text-gray-500 ml-2">× {item.quantity}</span>
                    </span>
                    <span className="font-semibold text-gray-900">₩{((item.price || 0) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between items-center">
                  <span className="font-bold text-gray-900">소계</span>
                  <span className="font-bold text-blue-600 text-lg">₩{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <button
                  data-testid={`status-pending-${order.id}`}
                  onClick={() => onStatusChange(order.id, 'pending')}
                  className="px-4 py-2 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
                >
                  📋 주문접수
                </button>
                <button
                  data-testid={`status-preparing-${order.id}`}
                  onClick={() => onStatusChange(order.id, 'preparing')}
                  className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  🍳 조리중
                </button>
                <button
                  data-testid={`status-completed-${order.id}`}
                  onClick={() => onStatusChange(order.id, 'completed')}
                  className="px-4 py-2 text-sm font-medium bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                >
                  ✅ 완료
                </button>
                <button
                  data-testid={`delete-order-${order.id}`}
                  onClick={() => setConfirmAction({ type: 'delete', orderId: order.id })}
                  className="px-4 py-2 text-sm font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors ml-auto"
                >
                  🗑️ 삭제
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-between gap-4">
          <button 
            onClick={onShowHistory} 
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
          >
            📜 과거 내역
          </button>
          <button
            data-testid="complete-table"
            onClick={() => setConfirmAction({ type: 'complete' })}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            ✨ 이용 완료
          </button>
        </div>
      </div>

      {confirmAction && (
        <div data-testid="confirm-dialog" className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">{confirmAction.type === 'delete' ? '🗑️' : '✨'}</div>
              <p className="text-xl font-bold text-gray-900">
                {confirmAction.type === 'delete' ? '주문을 삭제하시겠습니까?' : '테이블 이용을 완료하시겠습니까?'}
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmAction(null)} 
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button 
                onClick={handleConfirm} 
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
