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
    
    // 토스트 알림 표시
    const toast = document.createElement('div');
    toast.className = 'fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-soft-lg z-50 font-semibold';
    toast.style.backgroundColor = '#8B7355';
    toast.style.color = '#FFFFFF';
    toast.style.transition = 'all 0.3s ease';
    toast.textContent = '🛒 장바구니에 담았습니다';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, -20px)';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
  };

  return (
    <Card className="overflow-hidden card-hover border-0 bg-white/95 backdrop-blur-sm shadow-soft">
      <div className="aspect-square relative bg-gradient-to-br from-[#e8dfd0] to-[#f9f6f0] overflow-hidden">
        {menu.imageUrl ? (
          <img
            src={menu.imageUrl}
            alt={menu.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-30">☕</span>
          </div>
        )}
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
