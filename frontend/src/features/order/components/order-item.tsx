'use client';

import type { Order } from '@/types/order.types';
import { formatPrice } from '@/utils/format-price';

interface OrderItemProps {
  order: Order;
}

const statusLabels: Record<Order['status'], string> = {
  pending: '대기중',
  preparing: '준비중',
  completed: '완료',
};

const statusColors: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

export default function OrderItemComponent({ order }: OrderItemProps) {
  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = orderDate.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-xl p-5 shadow-soft border-0">
      {/* 헤더 */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-muted-foreground">주문번호</p>
          <p className="font-bold text-primary">{order.id}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            statusColors[order.status]
          }`}
        >
          {statusLabels[order.status]}
        </span>
      </div>

      {/* 주문 시간 */}
      <div className="mb-4 text-sm text-muted-foreground">
        📅 {formattedDate} {formattedTime}
      </div>

      {/* 주문 항목 */}
      <div className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-[#f9f6f0] rounded-lg p-3"
          >
            <div className="flex-1">
              <p className="font-medium text-primary">{item.menuName}</p>
              <p className="text-sm text-muted-foreground">
                {formatPrice(item.price)} × {item.quantity}
              </p>
            </div>
            <p className="font-semibold text-primary">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* 총 금액 */}
      <div className="border-t border-border/20 pt-4 flex justify-between items-baseline">
        <span className="text-lg font-bold text-primary">총 금액</span>
        <span className="text-xl font-bold text-primary">
          {formatPrice(order.totalAmount)}
        </span>
      </div>
    </div>
  );
}
