# E2E 테스트 계획서 (Playwright MCP)

**프로젝트**: 테이블오더 서비스  
**생성일**: 2026-02-25  
**도구**: Playwright MCP  
**목적**: User Story 기반 E2E 테스트 + 동시성 테스트

---

## 1. 테스트 환경 구성

### 1.1 필요 조건
```bash
# Backend 서버 실행
cd backend && npm run dev  # http://localhost:3000

# Frontend 서버 실행 (FE 완료 후)
cd frontend && npm run dev  # http://localhost:3001
```

### 1.2 테스트 데이터
| 항목 | 값 |
|------|-----|
| Store ID | `store1` |
| Admin 계정 | `admin` / `admin123` |
| Table 1~10 | 비밀번호: `table123` |
| 샘플 메뉴 | 4 카테고리, 8 메뉴 |

### 1.3 API Base URL
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:3001`

---

## 2. E2E 테스트 시나리오

### 2.1 고객 플로우 (Customer Flow)

#### TC-E2E-001: 메뉴 조회 및 주문 전체 플로우
**Story**: US-1.1, US-1.2, US-1.3, US-1.4

```gherkin
Scenario: 고객이 메뉴를 보고 주문을 완료한다
  Given 테이블 1에서 태블릿이 설정되어 있다
  When 고객이 메뉴 페이지에 접근한다
  Then 4개 카테고리와 8개 메뉴가 표시된다
  
  When 고객이 "불고기 버거" 2개를 장바구니에 추가한다
  And 고객이 "콜라" 1개를 장바구니에 추가한다
  Then 장바구니에 2개 항목, 총 19,000원이 표시된다
  
  When 고객이 주문 버튼을 클릭한다
  Then 주문 번호가 표시된다
  And 장바구니가 비워진다
  And 5초 후 메뉴 화면으로 이동한다
  
  When 고객이 주문 내역 페이지로 이동한다
  Then 방금 주문한 내역이 "주문접수" 상태로 표시된다
```

#### TC-E2E-002: 장바구니 수량 변경
**Story**: US-1.2

```gherkin
Scenario: 고객이 장바구니 수량을 변경한다
  Given 장바구니에 "불고기 버거" 1개가 있다
  
  When 수량을 3으로 증가시킨다
  Then 총 금액이 25,500원으로 변경된다
  
  When 수량을 1로 감소시킨다
  Then 총 금액이 8,500원으로 변경된다
  
  When 삭제 버튼을 클릭한다
  Then 장바구니가 비어있다
```

#### TC-E2E-003: 페이지 새로고침 후 장바구니 유지
**Story**: US-1.2

```gherkin
Scenario: 페이지 새로고침 후에도 장바구니가 유지된다
  Given 장바구니에 "치즈 버거" 2개가 있다
  When 페이지를 새로고침한다
  Then 장바구니에 "치즈 버거" 2개가 여전히 있다
```

---

### 2.2 관리자 플로우 (Admin Flow)

#### TC-E2E-010: 관리자 로그인
**Story**: US-2.1

```gherkin
Scenario: 관리자가 로그인한다
  Given 관리자 로그인 페이지에 있다
  When store1, admin, admin123을 입력하고 로그인한다
  Then 대시보드 페이지로 이동한다
  And 테이블 카드 그리드가 표시된다
```

#### TC-E2E-011: 로그인 실패 (5회 시도 제한)
**Story**: US-2.1

```gherkin
Scenario: 5회 로그인 실패 시 잠금
  Given 관리자 로그인 페이지에 있다
  When 잘못된 비밀번호로 5회 로그인 시도한다
  Then "5분 후 다시 시도하세요" 메시지가 표시된다
  And 추가 로그인 시도가 차단된다
```

#### TC-E2E-012: 실시간 주문 모니터링
**Story**: US-2.2

```gherkin
Scenario: 새 주문이 실시간으로 표시된다
  Given 관리자가 대시보드에 로그인되어 있다
  When 테이블 1에서 새 주문이 생성된다
  Then 2초 이내에 테이블 1 카드에 새 주문이 표시된다
  And 테이블 1 카드의 총 주문액이 업데이트된다
```

#### TC-E2E-013: 주문 상태 변경
**Story**: US-2.3

```gherkin
Scenario: 관리자가 주문 상태를 변경한다
  Given 테이블 1에 "주문접수" 상태의 주문이 있다
  When 관리자가 해당 주문을 "조리중"으로 변경한다
  Then 주문 상태가 "조리중"으로 표시된다
  And 고객 화면에서도 상태가 "조리중"으로 변경된다 (SSE)
```

#### TC-E2E-014: 주문 삭제
**Story**: US-2.5

```gherkin
Scenario: 관리자가 주문을 삭제한다
  Given 테이블 1에 주문이 있다
  When 관리자가 삭제 버튼을 클릭한다
  Then 확인 팝업이 표시된다
  When 확인을 클릭한다
  Then 주문이 목록에서 사라진다
  And 테이블 총 주문액이 재계산된다
```

#### TC-E2E-015: 지연 주문 강조
**Story**: US-2.4

```gherkin
Scenario: 30분 경과 주문이 빨간색으로 강조된다
  Given 테이블 1에 31분 전 주문이 있다
  When 대시보드를 확인한다
  Then 해당 테이블 카드가 빨간색 계열로 표시된다
```

---

### 2.3 테이블 세션 관리 플로우

#### TC-E2E-020: 테이블 이용 완료
**Story**: US-3.2

```gherkin
Scenario: 관리자가 테이블 이용 완료 처리한다
  Given 테이블 1에 주문 내역이 있다
  When 관리자가 "이용 완료" 버튼을 클릭한다
  Then 확인 팝업이 표시된다
  When 확인을 클릭한다
  Then 테이블 1의 주문 목록이 비워진다
  And 테이블 1의 총 주문액이 0원이 된다
  And 고객 화면에서 이전 주문이 보이지 않는다
```

#### TC-E2E-021: 과거 주문 내역 조회
**Story**: US-3.3

```gherkin
Scenario: 관리자가 과거 주문 내역을 조회한다
  Given 테이블 1의 이전 세션이 완료되었다
  When 관리자가 "과거 내역" 버튼을 클릭한다
  Then 과거 주문 목록이 시간 역순으로 표시된다
  And 각 주문에 완료 시각이 표시된다
```

---

## 3. 동시성 테스트 시나리오

### 3.1 다중 테이블 동시 주문

#### TC-CONC-001: 10개 테이블 동시 주문
```gherkin
Scenario: 10개 테이블에서 동시에 주문한다
  Given 10개 테이블이 각각 로그인되어 있다
  When 10개 테이블이 동시에 주문을 생성한다
  Then 모든 주문이 성공적으로 생성된다
  And 관리자 대시보드에 10개 주문이 모두 표시된다
  And 각 주문 번호가 고유하다
```

#### TC-CONC-002: 동시 주문 시 SSE 이벤트 전달
```gherkin
Scenario: 동시 주문 시 모든 SSE 이벤트가 전달된다
  Given 관리자가 대시보드에 접속해 있다
  When 5개 테이블이 1초 간격으로 주문한다
  Then 관리자 화면에 5개 new_order 이벤트가 모두 수신된다
  And 이벤트 순서가 주문 생성 순서와 일치한다
```

### 3.2 동시 상태 변경

#### TC-CONC-010: 동일 주문 동시 상태 변경 시도
```gherkin
Scenario: 두 관리자가 동시에 같은 주문 상태를 변경한다
  Given 주문 A가 "주문접수" 상태이다
  When 관리자 1이 "조리중"으로 변경 요청한다
  And 관리자 2가 동시에 "완료"로 변경 요청한다
  Then 먼저 도착한 요청이 처리된다
  And 두 번째 요청도 성공한다 (최종 상태 반영)
  And 두 관리자 화면 모두 최종 상태로 동기화된다
```

#### TC-CONC-011: 주문 삭제 중 상태 변경 시도
```gherkin
Scenario: 주문 삭제와 상태 변경이 동시에 발생한다
  Given 주문 A가 존재한다
  When 관리자 1이 삭제 요청한다
  And 관리자 2가 동시에 상태 변경 요청한다
  Then 삭제가 먼저 처리되면 상태 변경은 404 에러
  Or 상태 변경이 먼저 처리되면 삭제 성공
  And 최종 상태가 일관성 있게 유지된다
```

### 3.3 세션 동시성

#### TC-CONC-020: 이용 완료 중 새 주문 생성
```gherkin
Scenario: 이용 완료 처리 중 고객이 주문한다
  Given 테이블 1에 주문이 있다
  When 관리자가 이용 완료를 클릭한다
  And 동시에 고객이 새 주문을 생성한다
  Then 이용 완료가 먼저 처리되면 새 주문은 새 세션으로 생성
  Or 주문이 먼저 처리되면 이용 완료 시 해당 주문도 포함
```

### 3.4 SSE 연결 동시성

#### TC-CONC-030: 다중 관리자 SSE 연결
```gherkin
Scenario: 여러 관리자가 동시에 SSE 연결한다
  Given 3명의 관리자가 로그인한다
  When 3명 모두 대시보드에 접속한다
  Then 3개의 SSE 연결이 모두 유지된다
  When 새 주문이 생성된다
  Then 3명 모두에게 new_order 이벤트가 전달된다
```

#### TC-CONC-031: SSE 연결 끊김 후 재연결
```gherkin
Scenario: SSE 연결이 끊긴 후 재연결한다
  Given 관리자가 SSE 연결되어 있다
  When 네트워크가 일시적으로 끊긴다
  Then SSE 연결이 자동으로 재시도된다
  When 연결이 복구된다
  Then 새 이벤트를 정상적으로 수신한다
```

---

## 4. 부하 테스트 시나리오

### 4.1 대량 주문 처리

#### TC-LOAD-001: 100개 주문 연속 생성
```gherkin
Scenario: 100개 주문을 빠르게 생성한다
  Given 시스템이 정상 상태이다
  When 100개 주문을 1초에 10개씩 생성한다
  Then 모든 주문이 성공적으로 생성된다
  And 평균 응답 시간이 500ms 이하이다
  And 에러율이 0%이다
```

#### TC-LOAD-002: 대량 주문 조회
```gherkin
Scenario: 많은 주문이 있을 때 조회 성능
  Given 테이블당 50개 주문이 있다 (총 500개)
  When 관리자가 대시보드를 조회한다
  Then 응답 시간이 2초 이하이다
  And 모든 테이블 정보가 정확히 표시된다
```

---

## 5. Playwright MCP 테스트 구조

### 5.1 디렉토리 구조
```
e2e/
├── playwright.config.ts
├── fixtures/
│   ├── auth.fixture.ts      # 인증 fixture
│   └── api.fixture.ts       # API 호출 fixture
├── tests/
│   ├── customer/
│   │   ├── menu.spec.ts
│   │   ├── cart.spec.ts
│   │   └── order.spec.ts
│   ├── admin/
│   │   ├── login.spec.ts
│   │   ├── dashboard.spec.ts
│   │   └── order-management.spec.ts
│   └── concurrency/
│       ├── multi-table.spec.ts
│       ├── sse-events.spec.ts
│       └── session.spec.ts
├── utils/
│   ├── api-client.ts
│   └── test-data.ts
└── reports/
```

### 5.2 테스트 실행 명령어
```bash
# 전체 E2E 테스트
npx playwright test

# 고객 플로우만
npx playwright test tests/customer/

# 동시성 테스트만
npx playwright test tests/concurrency/

# 특정 테스트
npx playwright test -g "TC-E2E-001"

# 병렬 실행 (동시성 테스트용)
npx playwright test --workers=10
```

---

## 6. 테스트 우선순위

### P0 (필수)
- TC-E2E-001: 메뉴 조회 및 주문 전체 플로우
- TC-E2E-010: 관리자 로그인
- TC-E2E-012: 실시간 주문 모니터링
- TC-CONC-001: 10개 테이블 동시 주문

### P1 (중요)
- TC-E2E-002: 장바구니 수량 변경
- TC-E2E-013: 주문 상태 변경
- TC-E2E-020: 테이블 이용 완료
- TC-CONC-002: 동시 주문 시 SSE 이벤트

### P2 (권장)
- TC-E2E-003: 페이지 새로고침 후 장바구니 유지
- TC-E2E-011: 로그인 실패 제한
- TC-CONC-010~031: 기타 동시성 테스트
- TC-LOAD-001~002: 부하 테스트

---

## 7. 테스트 데이터 시드

### 7.1 API를 통한 테스트 데이터 생성
```typescript
// test-data.ts
export async function seedTestData(apiClient: APIClient) {
  // 1. 관리자 로그인
  const adminToken = await apiClient.adminLogin('store1', 'admin', 'admin123');
  
  // 2. 테이블 설정 (1~10)
  const tableTokens = [];
  for (let i = 1; i <= 10; i++) {
    const token = await apiClient.tableSetup('store1', String(i), 'table123');
    tableTokens.push(token);
  }
  
  // 3. 샘플 주문 생성
  for (const token of tableTokens.slice(0, 3)) {
    await apiClient.createOrder(token, [
      { menuId: 'menu-1', quantity: 2 },
      { menuId: 'menu-6', quantity: 1 }
    ]);
  }
  
  return { adminToken, tableTokens };
}
```

---

## 8. 예상 결과 매트릭스

| 테스트 카테고리 | 테스트 수 | 예상 시간 |
|----------------|----------|----------|
| Customer E2E | 5 | 2분 |
| Admin E2E | 8 | 3분 |
| Session E2E | 3 | 1분 |
| Concurrency | 8 | 5분 |
| Load | 2 | 3분 |
| **Total** | **26** | **~15분** |
