'use client'

import { useState, useEffect } from 'react'
import { PastSession } from '@/types'
import { adminApi } from '@/api/admin'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface TableHistoryModalProps {
  tableId: string
  onClose: () => void
}

export default function TableHistoryModal({ tableId, onClose }: TableHistoryModalProps) {
  const { token } = useAdminAuth()
  const [sessions, setSessions] = useState<PastSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (token) {
      adminApi.getTableHistory(token, tableId)
        .then((res) => setSessions(res.sessions))
        .finally(() => setIsLoading(false))
    }
  }, [token, tableId])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div data-testid="history-modal" className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">과거 주문 내역</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-4">
          {isLoading ? (
            <p>로딩 중...</p>
          ) : sessions.length === 0 ? (
            <p className="text-gray-500">과거 내역이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.sessionId} className="border rounded p-3">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{session.totalAmount.toLocaleString()}원</span>
                    <span className="text-sm text-gray-500">
                      {new Date(session.completedAt).toLocaleString('ko-KR')}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    {session.orders.map((order) => (
                      <div key={order.id}>
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{item.menuName} x {item.quantity}</span>
                            <span>{(item.unitPrice * item.quantity).toLocaleString()}원</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
