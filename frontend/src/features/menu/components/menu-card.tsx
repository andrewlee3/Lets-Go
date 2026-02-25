'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Menu } from '@/types/menu.types';
import { formatPrice } from '@/utils/format-price';

interface MenuCardProps {
  menu: Menu;
  onAddToCart: (menu: Menu) => void;
}

export default function MenuCard({ menu, onAddToCart }: MenuCardProps) {
  const handleAddClick = () => {
    onAddToCart(menu);
  };

  return (
    <Card className="overflow-hidden card-hover border-0 bg-white shadow-soft">
      <div className="aspect-square relative bg-gradient-to-br from-[#e8dfd0] to-[#f9f6f0] overflow-hidden">
        {/* TODO: 실제 이미지로 대체 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-30">☕</span>
        </div>
        {/* 가격 뱃지 */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-soft">
          <span className="text-sm font-bold text-primary">{formatPrice(menu.price)}</span>
        </div>
      </div>
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-xl font-bold text-primary">{menu.name}</CardTitle>
        <CardDescription className="text-sm line-clamp-2 text-muted-foreground mt-2 leading-relaxed">
          {menu.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-5 pt-0">
        <Button
          onClick={handleAddClick}
          className="w-full btn-touch bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-soft transition-all hover:shadow-soft-lg"
        >
          🛒 담기
        </Button>
      </CardFooter>
    </Card>
  );
}
