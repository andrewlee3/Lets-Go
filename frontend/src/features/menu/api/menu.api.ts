import { mockMenus, mockCategories } from '@/mocks/menus';
import type { Menu, Category } from '@/types/menu.types';

// TODO: 백엔드 API 연동
// GET /api/customer/menus

/**
 * 모든 메뉴와 카테고리 조회
 */
export const getMenus = async (): Promise<{ menus: Menu[]; categories: Category[] }> => {
  // TODO: 실제 API 호출로 대체
  // const response = await apiClient.get('/api/customer/menus');
  // return response.data;

  // Mock: 네트워크 지연 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    menus: mockMenus,
    categories: mockCategories,
  };
};

/**
 * 카테고리별 메뉴 필터링
 */
export const getMenusByCategory = (menus: Menu[], categoryId: string): Menu[] => {
  return menus.filter((menu) => menu.categoryId === categoryId);
};
