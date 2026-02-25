'use client'

import { useState, useEffect } from 'react'
import { PastSession } from '@/types'
import { adminApi } from '@/api/admin'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'

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
    <Dialog open onOpenChange={onClose}>
      <DialogContent data-testid="history-modal" className="max-w-lg max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>과거 주문 내역</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p className="text-center text-muted-foreground py-4">로딩 중...</p>
        ) : sessions.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">과거 내역이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <Card key={session.sessionId} className="py-3">
                <CardContent className="pt-0">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{session.totalAmount.toLocaleString()}원</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(session.completedAt).toLocaleString('ko-KR')}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    {session.orders.map((order) => (
                      <div key={order.id}>
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{item.menuName} x {item.quantity}</span>
                            <span className="text-muted-foreground">{(item.unitPrice * item.quantity).toLocaleString()}원</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
