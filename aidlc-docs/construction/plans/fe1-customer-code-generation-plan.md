# FE-1 (Customer) Code Generation Plan

**Unit**: FE-1 - Customer Frontend  
**담당**: Frontend Developer  
**생성일**: 2026-02-25  
**상태**: Planning

---

## Unit Context

### Assigned Stories
- US-1.1: 메뉴 조회
- US-1.2: 장바구니 관리
- US-1.3: 주문 생성
- US-1.4: 주문 내역 조회
- US-1.5: 자동 로그인

### Dependencies
- **Backend API**: Mock data로 개발, TODO 주석으로 연동 지점 표시
- **Shared Types**: 프론트엔드 내부에서 정의 (추후 백엔드와 통합)

### Tech Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Context API (인증, 장바구니)
- Zustand (주문 상태)
- React Hook Form (폼)
- Axios (API 클라이언트)

---

## Code Generation Steps

### Phase 1: Project Setup

#### Step 1: Next.js 프로젝트 초기화
- [ ] `npx create-next-app@latest table-order-customer --typescript --tailwind --app`
- [ ] 프로젝트 루트: `/Users/roa/Lets-Go/table-order-customer/`
- [ ] App Router 사용

#### Step 2: 필수 패키지 설치
- [ ] `npm install zustand axios clsx`
- [ ] `npm install react-hook-form @hookform/resolvers zod`
- [ ] `npm install -D @types/node`

#### Step 3: shadcn/ui 설치
- [ ] `npx shadcn-ui@latest init`
- [ ] `npx shadcn-ui@latest add button card dialog input`

#### Step 4: 프로젝트 구조 생성
- [ ] `src/app/` - 라우팅
- [ ] `src/features/` - 기능별 모듈
- [ ] `src/components/` - 공유 컴포넌트
- [ ] `src/lib/` - 라이브러리 래퍼
- [ ] `src/contexts/` - 전역 Context
- [ ] `src/types/` - 공유 타입
- [ ] `src/utils/` - 유틸리티
- [ ] `src/mocks/` - Mock 데이터

#### Step 5: TypeScript 설정
- [ ] `tsconfig.json` 업데이트 (strict mode, path aliases)
- [ ] `@/` alias 설정

#### Step 6: Tailwind 설정
- [ ] `tailwind.config.ts` 커스터마이징
- [ ] 터치 친화적 유틸리티 클래스 추가

---

### Phase 2: Shared Layer

#### Step 7: 공유 타입 정의
- [ ] `src/types/menu.types.ts` - Menu, Category 타입
- [ ] `src/types/order.types.ts` - Order, OrderItem 타입
- [ ] `src/types/cart.types.ts` - CartItem 타입
- [ ] `src/types/auth.types.ts` - TableAuth 타입

#### Step 8: Mock 데이터 생성
- [ ] `src/mocks/menus.ts` - 샘플 메뉴 데이터 (5개 카테고리, 20개 메뉴)
- [ ] `src/mocks/orders.ts` - 샘플 주문 데이터
- [ ] TODO 주석: 백엔드 API 연동 시 제거

#### Step 9: API 클라이언트 설정
- [ ] `src/lib/api-client.ts` - Axios 인스턴스 생성
- [ ] TODO 주석: 백엔드 baseURL 설정 필요
- [ ] TODO 주석: 인터셉터에서 토큰 주입 로직 추가

#### Step 10: 유틸리티 함수
- [ ] `src/utils/format-price.ts` - 가격 포맷팅
- [ ] `src/utils/storage.ts` - localStorage 래퍼

---

### Phase 3: Feature - Auth

#### Step 11: Auth Context
- [ ] `src/contexts/auth-context.tsx` - 인증 상태 관리
- [ ] 자동 로그인 로직
- [ ] localStorage에서 토큰 로드
- [ ] TODO 주석: 백엔드 API 연동 필요

#### Step 12: Table Setup Page
- [ ] `src/app/table-setup/page.tsx` - 테이블 초기 설정 페이지
- [ ] `src/features/auth/components/table-setup-form.tsx` - 설정 폼
- [ ] US-1.5 구현: 매장 식별자, 테이블 번호, 비밀번호 입력
- [ ] TODO 주석: POST /api/customer/table/setup 연동

---

### Phase 4: Feature - Menu

#### Step 13: Menu API (Mock)
- [ ] `src/features/menu/api/menu.api.ts` - Mock API 함수
- [ ] `getMenus()` - Mock 데이터 반환
- [ ] TODO 주석: GET /api/customer/menus 연동

#### Step 14: Menu Components
- [ ] `src/features/menu/components/menu-page.tsx` - 메뉴 페이지
- [ ] `src/features/menu/components/category-sidebar.tsx` - 카테고리 사이드바
- [ ] `src/features/menu/components/menu-card.tsx` - 메뉴 카드
- [ ] `src/features/menu/components/menu-grid.tsx` - 메뉴 그리드
- [ ] US-1.1 구현: 카테고리별 메뉴 조회, 카드 레이아웃

#### Step 15: Menu Page Route
- [ ] `src/app/page.tsx` - 홈 (메뉴 페이지)
- [ ] MenuPage 컴포넌트 import

---

### Phase 5: Feature - Cart

#### Step 16: Cart Context
- [ ] `src/contexts/cart-context.tsx` - 장바구니 상태 관리
- [ ] Context API + useReducer 사용
- [ ] localStorage 동기화 (cart_{storeId}_{tableId})
- [ ] US-1.2 구현: 추가/삭제/수량 조절/총액 계산

#### Step 17: Cart Components
- [ ] `src/features/cart/components/cart-drawer.tsx` - 장바구니 Drawer
- [ ] `src/features/cart/components/cart-item.tsx` - 장바구니 아이템
- [ ] `src/features/cart/components/cart-summary.tsx` - 총액 요약
- [ ] shadcn/ui Drawer 사용

#### Step 18: Cart Page Route
- [ ] `src/app/cart/page.tsx` - 장바구니 페이지
- [ ] CartDrawer 컴포넌트 통합

---

### Phase 6: Feature - Order

#### Step 19: Order Store (Zustand)
- [x] `src/features/order/store/order-store.ts` - 주문 상태 관리
- [x] Zustand로 주문 목록 관리
- [x] TODO 주석: SSE 연동 시 실시간 업데이트

#### Step 20: Order API (Mock)
- [x] `src/features/order/api/order.api.ts` - Mock API 함수
- [x] `createOrder()` - Mock 주문 생성
- [x] `getOrders()` - Mock 주문 목록
- [x] TODO 주석: POST /api/customer/orders 연동
- [x] TODO 주석: GET /api/customer/orders 연동

#### Step 21: Order Components
- [x] `src/features/order/components/order-confirmation.tsx` - 주문 확인 모달
- [x] `src/features/order/components/order-success.tsx` - 주문 성공 화면 (5초 표시)
- [x] US-1.3 구현: 주문 확정, 주문 번호 표시, 자동 리다이렉트

#### Step 22: Order History Components
- [x] `src/features/order/components/order-history-page.tsx` - 주문 내역 페이지
- [x] `src/features/order/components/order-item.tsx` - 주문 아이템
- [x] US-1.4 구현: 현재 세션 주문만 표시, 상태 표시

#### Step 23: Order Routes
- [x] `src/app/orders/page.tsx` - 주문 내역 페이지

---

### Phase 7: Layout & Navigation

#### Step 24: Root Layout
- [ ] `src/app/layout.tsx` - 루트 레이아웃
- [ ] AuthProvider, CartProvider 적용
- [ ] 전역 스타일 적용

#### Step 25: Navigation Components
- [ ] `src/components/bottom-nav.tsx` - 하단 네비게이션
- [ ] 메뉴, 장바구니, 주문내역 탭

---

### Phase 8: Integration & Polish

#### Step 26: 통합 테스트 준비
- [ ] Mock 데이터 검증
- [ ] 모든 페이지 라우팅 확인
- [ ] localStorage 동작 확인

#### Step 27: UI/UX 최적화
- [ ] 터치 영역 최소 44x44px 확인
- [ ] 로딩 상태 추가
- [ ] 에러 처리 추가

#### Step 28: TODO 주석 정리
- [ ] 모든 백엔드 연동 지점에 TODO 주석 확인
- [ ] API 엔드포인트 명시
- [ ] 필요한 타입 정의

#### Step 29: README 작성
- [ ] `README.md` - 프로젝트 설명
- [ ] 설치 및 실행 방법
- [ ] Mock 데이터 사용 안내
- [ ] 백엔드 연동 가이드

---

## Story Traceability

| Story | 구현 위치 |
|-------|----------|
| US-1.1 (메뉴 조회) | Step 13-15 (Menu Feature) |
| US-1.2 (장바구니) | Step 16-18 (Cart Feature) |
| US-1.3 (주문 생성) | Step 19-21 (Order Feature) |
| US-1.4 (주문 내역) | Step 22-23 (Order History) |
| US-1.5 (자동 로그인) | Step 11-12 (Auth Feature) |

---

## Acceptance Criteria Coverage

### US-1.1 (메뉴 조회) - 6개 AC
- [x] Step 15: 메뉴 화면 기본 표시
- [x] Step 14: 카테고리별 분류
- [x] Step 14: 메뉴 상세 정보 (이름, 가격, 설명, 이미지)
- [x] Step 14: 카드 형태 레이아웃
- [x] Step 14: 카테고리 간 빠른 이동
- [x] Step 6: 터치 친화적 버튼 (44x44px)

### US-1.2 (장바구니) - 7개 AC
- [x] Step 16: 메뉴 추가/삭제
- [x] Step 16: 수량 조절
- [x] Step 16: 총 금액 실시간 계산
- [x] Step 16: 장바구니 비우기
- [x] Step 16: 페이지 새로고침 시 유지 (localStorage)

### US-1.3 (주문 생성) - 6개 AC
- [x] Step 21: 주문 내역 최종 확인
- [x] Step 21: 주문 확정 버튼
- [x] Step 21: 주문 번호 표시 (5초)
- [x] Step 21: 장바구니 자동 비우기
- [x] Step 21: 메뉴 화면 자동 리다이렉트
- [x] Step 21: 주문 실패 시 에러 메시지

### US-1.4 (주문 내역) - 4개 AC
- [x] Step 22: 현재 세션 주문만 표시
- [x] Step 22: 주문 정보 표시 (번호, 시각, 메뉴, 수량, 금액, 상태)
- [x] Step 22: 최신순 정렬

### US-1.5 (자동 로그인) - 3개 AC
- [x] Step 11: 자동 로그인
- [x] Step 12: 초기 설정 화면
- [x] Step 11: localStorage 암호화 저장

---

## Estimated Scope

- **총 Steps**: 29개
- **예상 시간**: 2일
- **파일 수**: 약 40개
- **Mock 데이터**: 메뉴, 주문

---

## Critical Notes

1. **Mock 데이터 사용**: 모든 API 호출은 Mock 데이터 반환
2. **TODO 주석**: 백엔드 연동 지점마다 명시
3. **확장성**: API 클라이언트 구조는 실제 연동 시 최소 수정
4. **타입 안전성**: TypeScript strict mode 사용
5. **Frontend Developer Persona 준수**: `aidlc-docs/inception/frontend-developer-persona.md` 규칙 따름

---

**이 계획은 FE-1 (Customer) Code Generation의 단일 진실 공급원(Single Source of Truth)입니다.**
