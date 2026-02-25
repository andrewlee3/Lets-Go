# Frontend Developer Persona

**목적**: 테이블오더 프로젝트의 프론트엔드 코드 생성 시 참조할 개발 철학, 원칙, 컨벤션  
**생성일**: 2026-02-25  
**기반**: Bulletproof React Architecture + 실용주의 개발 철학

---

## 1. 개발 철학 (Development Philosophy)

### 1.1 핵심 가치

| 가치 | 설명 |
|------|------|
| **실용주의 우선** | 과도한 추상화보다 명확하고 단순한 코드 |
| **타입 안전성** | TypeScript strict mode, 런타임 에러 최소화 |
| **명시적 > 암시적** | 코드만 보고 동작을 이해할 수 있어야 함 |
| **Colocation** | 관련 코드는 사용되는 곳과 가까이 배치 |
| **단방향 흐름** | shared → features → app 방향으로만 import |

### 1.2 의사결정 우선순위

```
1순위: 가독성 (Readability)
2순위: 유지보수성 (Maintainability)
3순위: 성능 (Performance)
```

**원칙**: 성능 최적화는 측정 가능한 병목이 발견된 후에만 진행한다.

---

## 2. 프로젝트 구조 (Project Structure)

### 2.1 디렉토리 구조

```
src/
├── app/                  # 라우팅 레이어 (Next.js App Router)
│   ├── layout.tsx
│   ├── page.tsx          # 홈 (고객용 메뉴 화면)
│   ├── cart/
│   │   └── page.tsx
│   ├── orders/
│   │   └── page.tsx
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   └── table-setup/
│       └── page.tsx
├── features/             # 기능별 모듈 ⭐
│   ├── menu/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   ├── cart/
│   ├── order/
│   ├── admin/
│   └── table/
├── components/           # 공유 컴포넌트
├── hooks/                # 공유 훅
├── lib/                  # 외부 라이브러리 래퍼
│   ├── api-client.ts
│   └── query-client.ts
├── contexts/             # 전역 Context
├── types/                # 공유 타입
└── utils/                # 공유 유틸리티
```

### 2.2 단방향 코드 흐름

```
┌─────────────────────────────────────────┐
│  shared (components, hooks, utils)      │
│  어디서든 import 가능                    │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  features                               │
│  shared를 import 가능                   │
│  다른 feature를 import 불가              │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  app                                    │
│  shared, features를 import 가능         │
└─────────────────────────────────────────┘
```

### 2.3 Import 규칙

| From \ To | shared | features | app |
|-----------|--------|----------|-----|
| **shared** | O | X | X |
| **features** | O | 같은 feature만 | X |
| **app** | O | O | O |

**금지**: Cross-feature import (feature 간 직접 import)

---

## 3. 코드 컨벤션 (Code Convention)

### 3.1 네이밍 규칙

| 대상 | 케이스 | 예시 |
|------|--------|------|
| 파일명 | kebab-case | `menu-card.tsx`, `use-cart.ts` |
| 폴더명 | kebab-case | `menu/`, `admin-dashboard/` |
| 컴포넌트 | PascalCase | `MenuCard`, `CartDrawer` |
| Props | PascalCase + Props | `MenuCardProps` |
| 훅 | useCamelCase | `useCart`, `useAuth` |
| 변수/함수 | camelCase | `menuList`, `getMenus` |
| 상수 | UPPER_SNAKE_CASE | `MAX_CART_ITEMS`, `API_BASE_URL` |
| 타입/인터페이스 | PascalCase | `Menu`, `Order` |

### 3.2 Boolean 변수

```tsx
// 권장: is, has, should, can 접두사
const isLoading = true;
const hasPermission = false;
const shouldRefetch = true;
const canEdit = user.role === 'admin';

// 금지
const loading = true;
const permissionExists = false;
```

### 3.3 함수 네이밍

| 유형 | 접두사 | 예시 |
|------|--------|------|
| 데이터 조회 | `get`, `fetch` | `getMenus`, `fetchOrders` |
| 데이터 생성 | `create`, `add` | `createOrder`, `addToCart` |
| 데이터 수정 | `update`, `set` | `updateOrderStatus`, `setQuantity` |
| 데이터 삭제 | `delete`, `remove` | `deleteOrder`, `removeFromCart` |
| 변환 | `format`, `parse`, `to` | `formatPrice`, `parseDate` |
| 검증 | `validate`, `check`, `is` | `validateOrder`, `checkStock` |
| 이벤트 핸들러 | `handle`, `on` | `handleClick`, `onSubmit` |

---

## 4. 컴포넌트 작성 규칙

### 4.1 1파일 1컴포넌트

```tsx
// 권장: 1파일 1컴포넌트
// menu-card.tsx
const MenuCard = ({ menu }: MenuCardProps) => { ... };
export default MenuCard;

// menu-card-image.tsx
const MenuCardImage = ({ src }: MenuCardImageProps) => { ... };
export default MenuCardImage;
```

```tsx
// 금지: 1파일 여러 컴포넌트
// menu-card.tsx
const MenuCardImage = () => { ... };
const MenuCardTitle = () => { ... };
const MenuCard = () => { ... };
```

### 4.2 컴포넌트 파일 구조

```tsx
// 1. Import 문
import { useState } from 'react';
import { useGetMenus } from '../api/menu.api';
import type { MenuCardProps } from './menu-card.types';

// 2. 타입 정의
interface MenuCardProps {
  menuId: string;
  onAddToCart: (menuId: string) => void;
}

// 3. 컴포넌트 함수
const MenuCard = ({ menuId, onAddToCart }: MenuCardProps) => {
  // 3-1. Hooks
  const [quantity, setQuantity] = useState(1);
  const { data: menu } = useGetMenus(menuId);

  // 3-2. 이벤트 핸들러
  const handleAddClick = () => {
    onAddToCart(menuId);
  };

  // 3-3. 조건부 렌더링
  if (!menu) return null;

  // 3-4. 메인 렌더링
  return (
    <div className="menu-card">
      <img src={menu.imageUrl} alt={menu.name} />
      <h3>{menu.name}</h3>
      <p>{formatPrice(menu.price)}</p>
      <button onClick={handleAddClick}>담기</button>
    </div>
  );
};

// 4. Export
export default MenuCard;
```

### 4.3 중첩 렌더링 함수 금지

```tsx
// 금지: 중첩 렌더링 함수
function MenuList() {
  function renderMenuItems() {
    return <MenuItems />;
  }
  return <div>{renderMenuItems()}</div>;
}

// 권장: 별도 컴포넌트로 분리
function MenuItems() {
  return <div>...</div>;
}

function MenuList() {
  return (
    <div>
      <MenuItems />
    </div>
  );
}
```

### 4.4 Composition 패턴 사용

```tsx
// 금지: 과도한 props
<Modal
  title="주문 확인"
  description="주문하시겠습니까?"
  confirmText="확인"
  onConfirm={handleConfirm}
/>

// 권장: Composition 패턴
<Modal>
  <Modal.Title>주문 확인</Modal.Title>
  <Modal.Description>주문하시겠습니까?</Modal.Description>
  <Modal.Actions>
    <Button onClick={handleConfirm}>확인</Button>
  </Modal.Actions>
</Modal>
```

---

## 5. API Layer 패턴

### 5.1 API 클라이언트 설정

```typescript
// lib/api-client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인터셉터 설정
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 5.2 API 함수 + React Query 훅

```typescript
// features/menu/api/menu.api.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Menu } from '../types/menu.types';

// API 함수
export const getMenus = async (): Promise<Menu[]> => {
  const { data } = await apiClient.get('/api/customer/menus');
  return data;
};

// React Query 훅
export const useGetMenus = () => {
  return useQuery({
    queryKey: ['menus'],
    queryFn: getMenus,
  });
};
```

### 5.3 Query Key 컨벤션

```typescript
// features/menu/api/menu.keys.ts
export const menuKeys = {
  all: ['menus'] as const,
  lists: () => [...menuKeys.all, 'list'] as const,
  list: (filters: string) => [...menuKeys.lists(), { filters }] as const,
  details: () => [...menuKeys.all, 'detail'] as const,
  detail: (id: string) => [...menuKeys.details(), id] as const,
};
```

---

## 6. 상태 관리 (State Management)

### 6.1 상태 분류

| 상태 유형 | 관리 방법 | 예시 |
|----------|----------|------|
| Component State | `useState`, `useReducer` | 모달 열림/닫힘, 입력값 |
| Application State | React Context | 인증, 테마, 언어 |
| Server Cache State | React Query | 메뉴 목록, 주문 내역 |
| Form State | React Hook Form | 주문 폼, 로그인 폼 |
| URL State | Next.js Router | 페이지 파라미터, 쿼리 |

### 6.2 Context 사용 예시

```tsx
// contexts/cart-context.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';

interface CartItem {
  menuId: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (menuId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => [...prev, item]);
  };

  const removeItem = (menuId: string) => {
    setItems((prev) => prev.filter((item) => item.menuId !== menuId));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('CartProvider가 필요합니다');
  return context;
};
```

---

## 7. 스타일링 (Styling)

### 7.1 Tailwind CSS 우선

```tsx
// 권장: Tailwind CSS
<button className="min-h-[44px] min-w-[44px] rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
  주문하기
</button>

// 조건부 스타일: clsx 사용
import clsx from 'clsx';

<button
  className={clsx(
    'rounded-lg px-4 py-2',
    isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
  )}
>
  버튼
</button>
```

### 7.2 shadcn/ui 컴포넌트 활용

```tsx
// shadcn/ui 컴포넌트 사용
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

<Card>
  <Card.Header>
    <Card.Title>메뉴</Card.Title>
  </Card.Header>
  <Card.Content>
    <p>메뉴 설명</p>
  </Card.Content>
  <Card.Footer>
    <Button>주문하기</Button>
  </Card.Footer>
</Card>
```

---

## 8. 에러 처리 (Error Handling)

### 8.1 Error Boundary

```tsx
// components/error-boundary.tsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>문제가 발생했습니다:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>다시 시도</button>
    </div>
  );
}

// 사용
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <MenuList />
</ErrorBoundary>
```

### 8.2 API 에러 처리

```tsx
// React Query onError
const { data, error } = useGetMenus({
  onError: (error) => {
    toast.error('메뉴를 불러오는데 실패했습니다.');
  },
});
```

---

## 9. 성능 최적화 (Performance)

### 9.1 코드 스플리팅

```tsx
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./features/admin/components/dashboard'));

<Suspense fallback={<Loading />}>
  <AdminDashboard />
</Suspense>
```

### 9.2 메모이제이션 (필요시에만)

```tsx
// useMemo: 계산 비용이 높은 경우만
const totalPrice = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}, [items]);

// useCallback: 자식 컴포넌트에 전달하는 함수
const handleAddToCart = useCallback((menuId: string) => {
  addItem({ menuId, quantity: 1 });
}, [addItem]);

// React.memo: props가 자주 변하지 않는 컴포넌트
const MenuCard = React.memo(({ menu }: MenuCardProps) => {
  return <div>...</div>;
});
```

**주의**: 과도한 메모이제이션은 오히려 성능 저하

---

## 10. 테스트 작성 (Testing)

### 10.1 테스트 원칙

1. **구현이 아닌 동작 테스트**: 사용자가 보는 결과 확인
2. **Testing Library 철학**: 실제 사용자처럼 테스트
3. **MSW로 API 모킹**: fetch 직접 모킹 X

### 10.2 테스트 예시

```tsx
// menu-card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import MenuCard from './menu-card';

describe('MenuCard', () => {
  const mockMenu = {
    id: '1',
    name: '아메리카노',
    price: 4500,
    imageUrl: '/images/americano.jpg',
  };

  it('메뉴 정보를 표시한다', () => {
    render(<MenuCard menu={mockMenu} onAddToCart={jest.fn()} />);

    expect(screen.getByText('아메리카노')).toBeInTheDocument();
    expect(screen.getByText('4,500원')).toBeInTheDocument();
  });

  it('담기 버튼 클릭 시 onAddToCart가 호출된다', () => {
    const handleAddToCart = jest.fn();
    render(<MenuCard menu={mockMenu} onAddToCart={handleAddToCart} />);

    fireEvent.click(screen.getByText('담기'));

    expect(handleAddToCart).toHaveBeenCalledWith('1');
  });
});
```

---

## 11. Import 순서

```tsx
// 1. React
import { useState, useEffect } from 'react';

// 2. 외부 라이브러리
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

// 3. 내부 공유 모듈 (@/)
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/format-price';

// 4. 같은 feature 내부 모듈 (상대 경로)
import { useGetMenus } from '../api/menu.api';
import type { MenuCardProps } from './menu-card.types';
```

---

## 12. 금지 사항 (Don'ts)

| 금지 항목 | 이유 |
|-----------|------|
| Cross-feature import | feature 간 결합도 증가 |
| app 폴더에 비즈니스 로직 | 관심사 분리 위반 |
| 중첩 렌더링 함수 | 컴포넌트로 분리 |
| Redux에 서버 데이터 저장 | React Query 사용 |
| 과도한 메모이제이션 | 성능 저하 |
| barrel export (index.ts) | tree shaking 이슈 |
| 상대 경로로 다른 feature 접근 | 단방향 흐름 위반 |

---

## 13. 체크리스트

### 새 컴포넌트 생성 시

- [ ] 파일명은 kebab-case인가?
- [ ] 컴포넌트명은 PascalCase인가?
- [ ] Props 타입이 정의되어 있는가?
- [ ] 1파일 1컴포넌트 원칙을 지켰는가?
- [ ] 중첩 렌더링 함수가 없는가?
- [ ] Import 순서가 올바른가?

### 새 API 추가 시

- [ ] API 함수와 React Query 훅이 같은 파일에 있는가?
- [ ] Query Key가 정의되어 있는가?
- [ ] 타입이 명시되어 있는가?
- [ ] 에러 처리가 되어 있는가?

### 새 Feature 추가 시

- [ ] `features/[feature-name]/` 폴더 생성
- [ ] `components/[feature-name]-page.tsx` 생성
- [ ] `app/[route]/page.tsx`에서 import
- [ ] 필요에 따라 `api/`, `hooks/`, `types/` 추가
- [ ] Cross-feature import가 없는가?

---

## 14. Quick Reference

### 네이밍 요약

| 대상 | 케이스 | 예시 |
|------|--------|------|
| 파일명 | kebab-case | `menu-card.tsx` |
| 컴포넌트 | PascalCase | `MenuCard` |
| Props | PascalCase + Props | `MenuCardProps` |
| 훅 | useCamelCase | `useCart` |
| 변수/함수 | camelCase | `menuList`, `getMenus` |
| 상수 | UPPER_SNAKE_CASE | `MAX_CART_ITEMS` |

### 폴더 구조 요약

```
features/[feature]/
├── api/          # API 함수 + React Query 훅
├── components/   # Feature 전용 컴포넌트
├── hooks/        # Feature 전용 훅
├── types/        # Feature 전용 타입
└── utils/        # Feature 전용 유틸리티
```

---

**이 페르소나는 모든 프론트엔드 코드 생성 시 참조해야 합니다.**
