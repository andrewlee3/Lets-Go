'use client';

import { Button } from '@/components/ui/button';
import type { CartItem } from '@/types/cart.types';
import { formatPrice } from '@/utils/format-price';

interface CartItemComponentProps {
  item: CartItem;
  onUpdateQuantity: (menuId: string, quantity: number) => void;
  onRemove: (menuId: string) => void;
}

export default function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemComponentProps) {
  const handleDecrease = () => {
    onUpdateQuantity(item.menuId, item.quantity - 1);
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.menuId, item.quantity + 1);
  };

  const handleRemove = () => {
    onRemove(item.menuId);
  };

  return (
    <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-soft">
      <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gradient-to-br from-[#e8dfd0] to-[#f9f6f0] flex items-center justify-center">
        <span className="text-2xl opacity-40">☕</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-primary truncate">{item.menuName}</h3>
        <p className="text-sm text-muted-foreground mt-1">{formatPrice(item.price)}</p>
      </div>

      <div className="flex items-center gap-2 bg-[#e8dfd0]/30 rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDecrease}
          className="h-10 w-10 p-0 hover:bg-primary/10 text-primary font-bold"
        >
          −
        </Button>
        <span className="w-10 text-center font-semibold text-primary">{item.quantity}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleIncrease}
          className="h-10 w-10 p-0 hover:bg-primary/10 text-primary font-bold"
        >
          +
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemove}
        className="text-destructive hover:text-destructive hover:bg-destructive/10 font-medium"
      >
        삭제
      </Button>
    </div>
  );
}
