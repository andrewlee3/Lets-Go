'use client'

import { TableWithOrders } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

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
    <Card
      data-testid="table-card"
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        table.isDelayed && "bg-red-100 border-red-300 dark:bg-red-900/20"
      )}
    >
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-2">
          <span data-testid="table-card-number" className="text-2xl font-bold">
            {table.table.tableNumber}번
          </span>
          <span className="text-sm text-muted-foreground">{table.orders.length}건</span>
        </div>
        <div data-testid="table-card-amount" className="text-lg font-semibold text-primary">
          {formatAmount(table.totalAmount)}원
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {formatTime(table.oldestOrderTime)}
        </div>
      </CardContent>
    </Card>
  )
}
