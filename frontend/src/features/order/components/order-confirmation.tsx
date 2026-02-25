'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCart } from '@/contexts/cart-context';
import { formatPrice } from '@/utils/format-price';
import { createOrder, saveOrderToLocalStorage } from '../api/order.api';
import { useOrderStore } from '../store/order-store';
import { useState } from 'react';

interface OrderConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (orderId: string) => void;
}

export default function OrderConfirmation({
  open,
  onOpenChange,
  onSuccess,
}: OrderConfirmationProps) {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const addOrder = useOrderStore((state) => state.addOrder);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (items.length === 0) {
      alert('장바구니가 비어있습니다');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 백엔드 API 연동 시 실제 주문 생성
      const order = await createOrder({
        items: items.map((item) => ({
          menuId: item.menuId,
          menuName: item.menuName,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
      });

      // Store에 추가
      addOrder(order);

      // Mock: localStorage에 저장
      saveOrderToLocalStorage(order);

      // 장바구니 비우기
      clearCart();

      // 성공 화면으로 이동
      onSuccess(order.id);
      onOpenChange(false);
    } catch (error) {
      console.error('주문 실패:', error);
      alert('주문에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            🛒 주문 확인
          </DialogTitle>
          <DialogDescription className="text-base">
            주문 내역을 확인해주세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[50vh] overflow-y-auto py-4">
          {items.map((item) => (
            <div
              key={item.menuId}
              className="flex justify-between items-center bg-[#f9f6f0] rounded-lg p-3"
            >
              <div className="flex-1">
                <p className="font-semibold text-primary">{item.menuName}</p>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
              </div>
              <p className="font-bold text-primary">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-border/20 pt-4">
          <div className="flex justify-between items-baseline mb-4">
            <span className="text-xl font-bold text-primary">총 금액</span>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full btn-touch bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-soft"
          >
            {isSubmitting ? '주문 중...' : '✨ 주문 확정'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="w-full border-primary/20 text-primary hover:bg-primary/5"
          >
            취소
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
