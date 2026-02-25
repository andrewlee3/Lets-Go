'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useCart } from '@/contexts/cart-context';
import CartItemComponent from './cart-item';
import CartSummary from './cart-summary';

interface CartDrawerProps {
  children: React.ReactNode;
}

export default function CartDrawer({ children }: CartDrawerProps) {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, totalAmount, totalItems } = useCart();

  const handleOrder = () => {
    if (items.length === 0) {
      alert('장바구니가 비어있습니다');
      return;
    }
    router.push('/cart');
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="bg-white">
        <DrawerHeader className="px-6 py-5">
          <DrawerTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            🛒 장바구니
          </DrawerTitle>
          <DrawerDescription className="text-base">
            {totalItems}개의 메뉴가 담겨있습니다
          </DrawerDescription>
        </DrawerHeader>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <div className="text-5xl mb-3 opacity-30">🛒</div>
              <p className="text-base font-medium">장바구니가 비어있습니다</p>
            </div>
          ) : (
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
          )}
        </div>

        <CartSummary totalAmount={totalAmount} totalItems={totalItems} />

        <DrawerFooter className="bg-white/50 backdrop-blur-sm px-6 py-5">
          <Button
            onClick={handleOrder}
            disabled={items.length === 0}
            className="btn-touch bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-soft transition-all hover:shadow-soft-lg"
          >
            ✨ 주문하기
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={clearCart}
              disabled={items.length === 0}
              className="flex-1 border-0 bg-[#f5f1eb] text-primary hover:bg-[#e8dfd0]"
            >
              전체 삭제
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1 border-0 bg-[#f5f1eb] text-primary hover:bg-[#e8dfd0]">
                닫기
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
