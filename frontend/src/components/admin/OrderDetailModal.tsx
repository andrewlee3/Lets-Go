'use client'

import { useState } from 'react'
import { TableWithOrders, OrderStatus } from '@/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'

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
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent data-testid="order-detail-modal" className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>테이블 {table.table.tableNumber}번</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {table.orders.map((order) => (
              <Card key={order.id} className="py-3">
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{order.orderNumber}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'preparing' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{item.menuName} x {item.quantity}</span>
                        <span className="text-muted-foreground">{(item.unitPrice * item.quantity).toLocaleString()}원</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <Button
                      data-testid={`status-pending-${order.id}`}
                      variant="outline"
                      size="xs"
                      onClick={() => onStatusChange(order.id, 'pending')}
                    >
                      주문접수
                    </Button>
                    <Button
                      data-testid={`status-preparing-${order.id}`}
                      variant="outline"
                      size="xs"
                      onClick={() => onStatusChange(order.id, 'preparing')}
                    >
                      조리중
                    </Button>
                    <Button
                      data-testid={`status-completed-${order.id}`}
                      variant="outline"
                      size="xs"
                      onClick={() => onStatusChange(order.id, 'completed')}
                    >
                      완료
                    </Button>
                    <Button
                      data-testid={`delete-order-${order.id}`}
                      variant="destructive"
                      size="xs"
                      onClick={() => setConfirmAction({ type: 'delete', orderId: order.id })}
                      className="ml-auto"
                    >
                      삭제
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onShowHistory}>과거 내역</Button>
            <Button data-testid="complete-table" onClick={() => setConfirmAction({ type: 'complete' })}>
              이용 완료
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {confirmAction && (
        <Dialog open onOpenChange={() => setConfirmAction(null)}>
          <DialogContent data-testid="confirm-dialog" className="max-w-sm">
            <DialogHeader>
              <DialogTitle>확인</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              {confirmAction.type === 'delete' ? '주문을 삭제하시겠습니까?' : '테이블 이용을 완료하시겠습니까?'}
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmAction(null)}>취소</Button>
              <Button variant="destructive" onClick={handleConfirm}>확인</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
