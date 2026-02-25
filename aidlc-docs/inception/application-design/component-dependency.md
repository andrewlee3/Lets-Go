# Component Dependencies

**프로젝트**: 테이블오더 서비스  
**생성일**: 2026-02-25

---

## 의존성 매트릭스

### Backend

| Component | AuthService | MenuService | OrderService | TableService | SSEService |
|-----------|:-----------:|:-----------:|:------------:|:------------:|:----------:|
| AuthController | ✓ | | | | |
| MenuController | | ✓ | | | |
| OrderController | | | ✓ | | |
| TableController | | | | ✓ | |
| SSEController | | | | | ✓ |
| OrderService | | | - | | ✓ |
| TableService | | | ✓ | - | |

### Frontend (Customer)

| Component | CartProvider | AuthProvider | useSSE |
|-----------|:------------:|:------------:|:------:|
| MenuPage | ✓ | ✓ | |
| CartDrawer | ✓ | ✓ | |
| OrderHistoryPage | | ✓ | ✓ |
| TableSetupPage | | ✓ | |

### Frontend (Admin)

| Component | AdminAuthProvider | useAdminSSE |
|-----------|:-----------------:|:-----------:|
| LoginPage | ✓ | |
| DashboardPage | ✓ | ✓ |
| TableCard | | |
| OrderDetailModal | ✓ | |
| TableHistoryModal | ✓ | |

---

## 데이터 흐름

### 고객 주문 플로우

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│ MenuPage │───▶│CartDrawer│───▶│  Order   │
│          │    │          │    │ Created  │
└──────────┘    └──────────┘    └────┬─────┘
                                     │
                                     ▼
┌──────────────────────────────────────────┐
│              Backend API                  │
│  POST /api/customer/orders               │
└────────────────────┬─────────────────────┘
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
┌──────────────┐      ┌──────────────┐
│   Database   │      │  SSE Event   │
│  (Order 저장) │      │ (관리자 알림) │
└──────────────┘      └──────────────┘
```

### 관리자 모니터링 플로우

```
┌──────────────┐         ┌──────────────┐
│  SSE Stream  │────────▶│ DashboardPage│
│ (신규 주문)   │         │  (실시간 반영) │
└──────────────┘         └──────┬───────┘
                                │
                                ▼
                       ┌──────────────┐
                       │  TableCard   │
                       │ (상태 표시)   │
                       └──────┬───────┘
                              │ click
                              ▼
                       ┌──────────────┐
                       │OrderDetail   │
                       │Modal         │
                       └──────────────┘
```

### 상태 변경 플로우

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│OrderDetail   │───▶│ Backend API  │───▶│  SSE Event   │
│Modal (버튼)  │    │PATCH /status │    │              │
└──────────────┘    └──────────────┘    └──────┬───────┘
                                               │
                         ┌─────────────────────┴─────────────────────┐
                         ▼                                           ▼
                ┌──────────────┐                            ┌──────────────┐
                │ Admin SSE    │                            │Customer SSE  │
                │ (대시보드 동기화)│                            │(상태 업데이트) │
                └──────────────┘                            └──────────────┘
```

---

## 통신 패턴

### REST API
- **동기 요청/응답**: 메뉴 조회, 주문 생성, 상태 변경
- **인증**: Authorization Header (Bearer Token)

### SSE (Server-Sent Events)
- **단방향 스트림**: 서버 → 클라이언트
- **이벤트 기반**: new_order, order_status, order_deleted
- **재연결**: 자동 재연결 (EventSource 기본 동작)

### localStorage
- **장바구니**: `cart_{storeId}_{tableId}` (암호화 X, 민감정보 아님)
- **인증 토큰**: `auth_token_{storeId}_{tableId}` (암호화 O)

---

## 모듈 구조

```
apps/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── menu.controller.ts
│   │   │   ├── order.controller.ts
│   │   │   ├── table.controller.ts
│   │   │   └── sse.controller.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── menu.service.ts
│   │   │   ├── order.service.ts
│   │   │   ├── table.service.ts
│   │   │   ├── sse.service.ts
│   │   │   └── seed.service.ts
│   │   ├── repositories/
│   │   ├── middlewares/
│   │   └── app.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── customer/
│   │   │   │   ├── menu/
│   │   │   │   ├── orders/
│   │   │   │   └── setup/
│   │   │   └── admin/
│   │   │       ├── login/
│   │   │       └── dashboard/
│   │   ├── components/
│   │   ├── contexts/
│   │   │   ├── CartContext.tsx
│   │   │   ├── AuthContext.tsx
│   │   │   └── AdminAuthContext.tsx
│   │   ├── hooks/
│   │   │   ├── useSSE.ts
│   │   │   └── useAdminSSE.ts
│   │   └── lib/
│   └── package.json
│
└── packages/
    └── shared/
        ├── src/
        │   ├── types/
        │   ├── constants/
        │   └── utils/
        └── package.json
```
