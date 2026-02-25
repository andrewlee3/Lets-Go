import type { Menu, Category } from '@/types/menu.types';

// TODO: 백엔드 API 연동 시 이 파일 제거
// GET /api/customer/menus 엔드포인트로 대체

export const mockCategories: Category[] = [
  { id: 'cat-1', name: '커피', order: 1 },
  { id: 'cat-2', name: '음료', order: 2 },
  { id: 'cat-3', name: '디저트', order: 3 },
  { id: 'cat-4', name: '브런치', order: 4 },
  { id: 'cat-5', name: '베이커리', order: 5 },
];

export const mockMenus: Menu[] = [
  // 커피
  {
    id: 'menu-1',
    name: '아메리카노',
    price: 4500,
    description: '깊고 진한 에스프레소에 물을 더한 클래식 커피',
    imageUrl: '/images/americano.jpg',
    categoryId: 'cat-1',
  },
  {
    id: 'menu-2',
    name: '카페라떼',
    price: 5000,
    description: '부드러운 우유와 에스프레소의 조화',
    imageUrl: '/images/latte.jpg',
    categoryId: 'cat-1',
  },
  {
    id: 'menu-3',
    name: '카푸치노',
    price: 5000,
    description: '풍성한 우유 거품이 올라간 커피',
    imageUrl: '/images/cappuccino.jpg',
    categoryId: 'cat-1',
  },
  {
    id: 'menu-4',
    name: '바닐라라떼',
    price: 5500,
    description: '달콤한 바닐라 시럽이 들어간 라떼',
    imageUrl: '/images/vanilla-latte.jpg',
    categoryId: 'cat-1',
  },

  // 음료
  {
    id: 'menu-5',
    name: '녹차라떼',
    price: 5500,
    description: '진한 녹차와 우유의 조화',
    imageUrl: '/images/green-tea-latte.jpg',
    categoryId: 'cat-2',
  },
  {
    id: 'menu-6',
    name: '초코라떼',
    price: 5500,
    description: '진한 초콜릿과 우유',
    imageUrl: '/images/choco-latte.jpg',
    categoryId: 'cat-2',
  },
  {
    id: 'menu-7',
    name: '딸기스무디',
    price: 6000,
    description: '신선한 딸기로 만든 스무디',
    imageUrl: '/images/strawberry-smoothie.jpg',
    categoryId: 'cat-2',
  },
  {
    id: 'menu-8',
    name: '망고스무디',
    price: 6000,
    description: '달콤한 망고 스무디',
    imageUrl: '/images/mango-smoothie.jpg',
    categoryId: 'cat-2',
  },

  // 디저트
  {
    id: 'menu-9',
    name: '티라미수',
    price: 6500,
    description: '이탈리아 전통 디저트',
    imageUrl: '/images/tiramisu.jpg',
    categoryId: 'cat-3',
  },
  {
    id: 'menu-10',
    name: '치즈케이크',
    price: 6500,
    description: '부드러운 뉴욕 스타일 치즈케이크',
    imageUrl: '/images/cheesecake.jpg',
    categoryId: 'cat-3',
  },
  {
    id: 'menu-11',
    name: '초코케이크',
    price: 6000,
    description: '진한 초콜릿 케이크',
    imageUrl: '/images/choco-cake.jpg',
    categoryId: 'cat-3',
  },
  {
    id: 'menu-12',
    name: '마카롱 세트',
    price: 8000,
    description: '5가지 맛 마카롱 세트',
    imageUrl: '/images/macaron.jpg',
    categoryId: 'cat-3',
  },

  // 브런치
  {
    id: 'menu-13',
    name: '크로와상 샌드위치',
    price: 7500,
    description: '햄, 치즈, 야채가 들어간 크로와상 샌드위치',
    imageUrl: '/images/croissant-sandwich.jpg',
    categoryId: 'cat-4',
  },
  {
    id: 'menu-14',
    name: '베이글 샌드위치',
    price: 7000,
    description: '크림치즈와 연어가 들어간 베이글',
    imageUrl: '/images/bagel-sandwich.jpg',
    categoryId: 'cat-4',
  },
  {
    id: 'menu-15',
    name: '팬케이크',
    price: 8500,
    description: '메이플 시럽과 버터를 곁들인 팬케이크',
    imageUrl: '/images/pancake.jpg',
    categoryId: 'cat-4',
  },
  {
    id: 'menu-16',
    name: '와플',
    price: 8500,
    description: '바삭한 벨기에 와플',
    imageUrl: '/images/waffle.jpg',
    categoryId: 'cat-4',
  },

  // 베이커리
  {
    id: 'menu-17',
    name: '크로와상',
    price: 3500,
    description: '버터 향 가득한 프랑스 크로와상',
    imageUrl: '/images/croissant.jpg',
    categoryId: 'cat-5',
  },
  {
    id: 'menu-18',
    name: '베이글',
    price: 3000,
    description: '쫄깃한 플레인 베이글',
    imageUrl: '/images/bagel.jpg',
    categoryId: 'cat-5',
  },
  {
    id: 'menu-19',
    name: '스콘',
    price: 3500,
    description: '영국식 스콘',
    imageUrl: '/images/scone.jpg',
    categoryId: 'cat-5',
  },
  {
    id: 'menu-20',
    name: '마들렌',
    price: 3000,
    description: '부드러운 프랑스 마들렌',
    imageUrl: '/images/madeleine.jpg',
    categoryId: 'cat-5',
  },
];
