'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/cart-context';
import CartItemComponent from '@/features/cart/components/cart-item';
import CartSummary from '@/features/cart/components/cart-summary';
import OrderConfirmation from '@/features/order/components/order-confirmation';
import OrderSuccess from '@/features/order/components/order-success';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, totalAmount, totalItems } = useCart();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

  const handleConfirmOrder = () => {
    if (items.length === 0) {
      alert('장바구니가 비어있습니다');
      return;
    }
    setShowConfirmation(true);
  };

  const handleOrderSuccess = (orderId: string) => {
    setSuccessOrderId(orderId);
  };

  // 주문 성공 화면 표시
  if (successOrderId) {
    return <OrderSuccess orderId={successOrderId} />;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="mx-auto max-w-2xl border-0 shadow-soft">
        <CardHeader className="border-b border-border/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              🛒 장바구니
            </CardTitle>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-primary hover:bg-primary/5"
            >
              ← 뒤로
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <div className="text-5xl mb-3 opacity-30">🛒</div>
              <p className="text-base font-medium">장바구니가 비어있습니다</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map((item) => (
                  <CartItemComponent
                    key={item.menuId}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>

              <div className="mt-6">
                <CartSummary totalAmount={totalAmount} totalItems={totalItems} />
              </div>

              <Button
                onClick={handleConfirmOrder}
                className="mt-6 w-full btn-touch bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-soft"
              >
                ✨ 주문 확정
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <OrderConfirmation
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onSuccess={handleOrderSuccess}
      />
    </div>
  );
}
