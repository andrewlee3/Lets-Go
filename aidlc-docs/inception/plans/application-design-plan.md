# Application Design Plan

**프로젝트**: 테이블오더 서비스  
**생성일**: 2026-02-25  
**목적**: 컴포넌트 식별 및 서비스 레이어 설계

---

## 설계 범위

User Stories 기반 주요 기능 영역:
- **고객용**: 메뉴 조회, 장바구니, 주문 생성, 주문 내역, 자동 로그인
- **관리자용**: 로그인, 실시간 모니터링, 주문 상태 변경, 지연 주문, 주문 삭제, 테이블 관리
- **시스템**: 샘플 메뉴 Seed

---

## 설계 계획

### Phase 1: 컴포넌트 식별
- [x] Backend 컴포넌트 정의
- [x] Frontend 컴포넌트 정의
- [x] 공유 모듈 정의

### Phase 2: 컴포넌트 메서드 설계
- [x] 각 컴포넌트별 메서드 시그니처 정의
- [x] Input/Output 타입 정의

### Phase 3: 서비스 레이어 설계
- [x] 서비스 정의 및 책임 분리
- [x] 서비스 간 상호작용 패턴

### Phase 4: 의존성 및 통신 패턴
- [x] 컴포넌트 의존성 매트릭스
- [x] 데이터 흐름 다이어그램

### Phase 5: 산출물 생성
- [x] components.md 생성
- [x] component-methods.md 생성
- [x] services.md 생성
- [x] component-dependency.md 생성
- [x] api-contract.md 생성 (추가)

---

## 설계 질문

요구사항과 User Stories를 분석한 결과, 다음 사항에 대한 확인이 필요합니다.

### Q1. API 구조
Backend API 구조를 어떻게 설계할까요?

A) RESTful API (리소스 중심, /api/menus, /api/orders 등)
B) 기능 중심 API (/api/customer/*, /api/admin/* 분리)

[Answer]: B

### Q2. 실시간 통신 범위
SSE(Server-Sent Events)를 어디까지 적용할까요?

A) 관리자 대시보드만 (신규 주문 알림)
B) 관리자 + 고객 (주문 상태 변경 알림 포함)

[Answer]: B

### Q3. 인증 토큰 저장
JWT 토큰 저장 위치는?

A) httpOnly Cookie (보안 강화, CSRF 고려 필요)
B) localStorage + Authorization Header (구현 단순)

[Answer]: B

### Q4. 상태 관리 (Frontend)
Frontend 상태 관리 방식은?

A) React Context + useReducer (단순, 추가 라이브러리 없음)
B) Zustand (경량, 간단한 API)
C) Redux Toolkit (강력하지만 보일러플레이트 많음)

[Answer]: A

### Q5. 장바구니 저장 키
localStorage 장바구니 저장 시 키 구조는?

A) 테이블별 분리 (cart_{storeId}_{tableId}) - 테이블마다 독립
B) 단일 키 (cart) - 브라우저당 하나

[Answer]: A

---

**모든 질문에 답변 후 알려주세요.**
