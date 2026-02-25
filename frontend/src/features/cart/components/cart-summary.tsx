'use client';

import { formatPrice } from '@/utils/format-price';

interface CartSummaryProps {
  totalAmount: number;
  totalItems: number;
}

export default function CartSummary({ totalAmount, totalItems }: CartSummaryProps) {
  return (
    <div className="border-t border-border/20 bg-[#e8dfd0]/20 backdrop-blur-sm p-6 mx-4 rounded-t-xl">
      <div className="mb-3 flex justify-between text-base">
        <span className="text-muted-foreground font-medium">총 {totalItems}개</span>
      </div>
      <div className="flex justify-between items-baseline">
        <span className="text-xl font-bold text-primary">총 금액</span>
        <span className="text-2xl font-bold text-primary">{formatPrice(totalAmount)}</span>
      </div>
    </div>
  );
}
