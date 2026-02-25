'use client';

import MenuCard from './menu-card';
import type { Menu } from '@/types/menu.types';

interface MenuGridProps {
  menus: Menu[];
  onAddToCart: (menu: Menu) => void;
}

export default function MenuGrid({ menus, onAddToCart }: MenuGridProps) {
  if (menus.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <div className="text-6xl mb-4 opacity-30">☕</div>
        <p className="text-lg font-medium">메뉴가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {menus.map((menu) => (
        <MenuCard key={menu.id} menu={menu} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
