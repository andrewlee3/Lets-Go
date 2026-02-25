'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import CategorySidebar from './category-sidebar';
import MenuGrid from './menu-grid';
import CartDrawer from '@/features/cart/components/cart-drawer';
import { getMenus, getMenusByCategory } from '../api/menu.api';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import type { Menu, Category } from '@/types/menu.types';

export default function MenuPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addItem, totalItems } = useCart();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 인증 확인
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/table-setup');
    }
  }, [isAuthenticated, router]);

  // 메뉴 데이터 로드
  useEffect(() => {
    const loadMenus = async () => {
      try {
        const data = await getMenus();
        setMenus(data.menus);
        setCategories(data.categories);
      } catch (error) {
        console.error('Failed to load menus:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenus();
  }, []);

  // 카테고리별 필터링
  const filteredMenus = selectedCategoryId
    ? getMenusByCategory(menus, selectedCategoryId)
    : menus;

  const handleAddToCart = (menu: Menu) => {
    addItem({
      menuId: menu.id,
      menuName: menu.name,
      quantity: 1,
      price: menu.price,
      imageUrl: menu.imageUrl,
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center cafe-gradient">
        <div className="text-center">
          <div className="mb-4 text-4xl">☕</div>
          <p className="text-lg font-medium text-primary">메뉴를 준비하고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-[#faf8f5] via-[#f5f1eb] to-[#f0ebe3]">
      {/* 헤더 */}
      <header className="bg-white/60 backdrop-blur-md px-6 py-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              ☕ Café Latte
            </h1>
            <p className="text-sm text-muted-foreground mt-1">오늘의 메뉴를 선택해주세요</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/orders')}
              className="border-primary/20 text-primary hover:bg-primary/5"
            >
              📋 주문내역
            </Button>
            {totalItems > 0 && (
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-soft">
                {totalItems}개 담김
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <CategorySidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <MenuGrid menus={filteredMenus} onAddToCart={handleAddToCart} />
        </main>
      </div>

      {/* 장바구니 버튼 (하단 고정) */}
      <div className="bg-white/60 backdrop-blur-md p-4 shadow-soft-lg">
        <CartDrawer>
          <Button className="w-full btn-touch bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-soft transition-all hover:shadow-soft-lg">
            🛒 장바구니 {totalItems > 0 && `(${totalItems}개)`}
          </Button>
        </CartDrawer>
      </div>
    </div>
  );
}
