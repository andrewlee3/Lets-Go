# Components

**프로젝트**: 테이블오더 서비스  
**생성일**: 2026-02-25

---

## Backend Components

### 1. AuthController
**책임**: 인증 관련 API 엔드포인트
- 관리자 로그인/로그아웃
- 테이블 초기 설정 및 인증
- JWT 토큰 발급/검증

### 2. MenuController
**책임**: 메뉴 조회 API
- 카테고리별 메뉴 목록 조회
- 메뉴 상세 조회

### 3. OrderController
**책임**: 주문 관련 API
- 주문 생성
- 주문 내역 조회 (고객/관리자)
- 주문 상태 변경
- 주문 삭제

### 4. TableController
**책임**: 테이블 세션 관리 API
- 테이블 이용 완료 처리
- 과거 주문 내역 조회

### 5. SSEController
**책임**: 실시간 이벤트 스트리밍
- 관리자: 신규 주문 알림
- 고객: 주문 상태 변경 알림

### 6. AuthService
**책임**: 인증 비즈니스 로직
- 비밀번호 검증 (bcrypt)
- JWT 생성/검증
- 로그인 시도 제한 (5회/5분)

### 7. MenuService
**책임**: 메뉴 비즈니스 로직
- 메뉴 데이터 조회
- 카테고리 필터링
- 샘플 메뉴 초기화 (데이터 없을 시)

### 8. OrderService
**책임**: 주문 비즈니스 로직
- 주문 생성 및 검증
- 주문 상태 관리
- 세션별 주문 필터링

### 9. TableService
**책임**: 테이블 세션 비즈니스 로직
- 세션 생성/종료
- 과거 이력 관리

### 10. SSEService
**책임**: SSE 연결 관리
- 클라이언트 연결 관리
- 이벤트 브로드캐스트

---

## Frontend Components (Customer)

### 1. MenuPage
**책임**: 메뉴 조회 화면
- 카테고리 사이드바
- 메뉴 카드 그리드

### 2. CartProvider (Context)
**책임**: 장바구니 상태 관리
- 메뉴 추가/삭제/수량 변경
- localStorage 동기화 (cart_{storeId}_{tableId})
- 총 금액 계산

### 3. CartDrawer
**책임**: 장바구니 UI
- 장바구니 아이템 목록
- 주문 버튼

### 4. OrderHistoryPage
**책임**: 주문 내역 화면
- 현재 세션 주문 목록
- 주문 상태 표시

### 5. AuthProvider (Context)
**책임**: 인증 상태 관리
- 자동 로그인
- 토큰 저장 (localStorage, 암호화)

### 6. useSSE (Hook)
**책임**: SSE 연결 및 이벤트 수신
- 주문 상태 변경 수신
- 실시간 UI 업데이트

### 7. TableSetupPage
**책임**: 테이블 초기 설정 화면
- 매장 식별자, 테이블 번호, 비밀번호 입력

---

## Frontend Components (Admin)

### 1. LoginPage
**책임**: 관리자 로그인 화면
- 매장 식별자, 사용자명, 비밀번호 입력

### 2. DashboardPage
**책임**: 주문 모니터링 대시보드
- 테이블별 카드 그리드
- 지연 주문 강조 (30분, 빨간색)

### 3. TableCard
**책임**: 테이블 카드 컴포넌트
- 테이블 번호, 총 주문액, 주문 시간
- 클릭 시 상세 모달

### 4. OrderDetailModal
**책임**: 주문 상세 모달
- 전체 주문 목록
- 상태 변경 버튼
- 주문 삭제 버튼

### 5. TableHistoryModal
**책임**: 과거 주문 내역 모달
- 시간 역순 주문 목록

### 6. AdminAuthProvider (Context)
**책임**: 관리자 인증 상태 관리
- 16시간 세션 관리
- 자동 로그아웃

### 7. useAdminSSE (Hook)
**책임**: 관리자 SSE 연결 및 이벤트 수신
- 신규 주문 수신
- 2초 이내 UI 반영

---

## Shared (packages/shared)

### 1. Types
**책임**: 공유 타입 정의
- Menu, Order, Table, User 타입
- API Request/Response 타입
- 주문 상태 enum

### 2. Constants
**책임**: 공유 상수
- API 경로
- 주문 상태 값
- 에러 코드

### 3. Utils
**책임**: 공유 유틸리티
- 날짜 포맷팅
- 금액 포맷팅
