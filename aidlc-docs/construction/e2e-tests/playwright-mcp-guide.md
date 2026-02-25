# Playwright MCP 테스트 실행 가이드

**프로젝트**: 테이블오더 서비스  
**생성일**: 2026-02-25

---

## 1. Playwright MCP 사용법

### 1.1 MCP를 통한 브라우저 제어

Playwright MCP는 다음 도구들을 제공합니다:

| 도구 | 설명 | 사용 예시 |
|------|------|----------|
| `browser_navigate` | URL로 이동 | 페이지 접근 |
| `browser_click` | 요소 클릭 | 버튼, 링크 클릭 |
| `browser_type` | 텍스트 입력 | 폼 입력 |
| `browser_screenshot` | 스크린샷 | 결과 확인 |
| `browser_snapshot` | 페이지 상태 캡처 | 디버깅 |

### 1.2 요소 선택자 전략

```
# 권장 선택자 (우선순위)
1. data-testid="menu-card-1"     # 테스트 전용 속성
2. role="button" name="주문하기"  # 접근성 기반
3. text="불고기 버거"             # 텍스트 기반
4. css=.menu-card                # CSS 선택자
```

---

## 2. 테스트 시나리오별 MCP 명령어

### 2.1 TC-E2E-001: 메뉴 조회 및 주문 플로우

```
Step 1: 고객 페이지 접근
→ browser_navigate: http://localhost:3001/customer

Step 2: 메뉴 확인
→ browser_snapshot: 페이지 상태 확인
→ 검증: 4개 카테고리, 8개 메뉴 표시

Step 3: 장바구니에 추가
→ browser_click: [data-testid="menu-card-menu-1"]
→ browser_click: [data-testid="add-to-cart"]
→ browser_click: [data-testid="quantity-increase"]

Step 4: 주문 생성
→ browser_click: [data-testid="cart-button"]
→ browser_click: [data-testid="order-button"]
→ browser_snapshot: 주문 번호 확인

Step 5: 주문 내역 확인
→ browser_navigate: http://localhost:3001/customer/orders
→ browser_snapshot: 주문 상태 확인
```

### 2.2 TC-E2E-010: 관리자 로그인

```
Step 1: 로그인 페이지 접근
→ browser_navigate: http://localhost:3001/admin/login

Step 2: 로그인 정보 입력
→ browser_type: [name="storeId"] → "store1"
→ browser_type: [name="username"] → "admin"
→ browser_type: [name="password"] → "admin123"

Step 3: 로그인 버튼 클릭
→ browser_click: [type="submit"]

Step 4: 대시보드 확인
→ browser_snapshot: 대시보드 표시 확인
```

### 2.3 TC-E2E-012: 실시간 주문 모니터링 (SSE)

```
Step 1: 관리자 대시보드 접속
→ browser_navigate: http://localhost:3001/admin/dashboard

Step 2: 새 탭에서 고객 주문 생성
→ (별도 브라우저 컨텍스트)
→ browser_navigate: http://localhost:3001/customer
→ browser_click: [data-testid="menu-card-menu-1"]
→ browser_click: [data-testid="order-button"]

Step 3: 관리자 화면에서 새 주문 확인
→ (원래 컨텍스트로 전환)
→ browser_snapshot: 새 주문 표시 확인
→ 검증: 2초 이내 표시
```

---

## 3. 동시성 테스트 MCP 전략

### 3.1 다중 브라우저 컨텍스트

동시성 테스트는 여러 브라우저 컨텍스트를 병렬로 실행해야 합니다.

```
# 10개 테이블 동시 주문 테스트

Context 1 (Table 1):
→ browser_navigate: http://localhost:3001/customer?table=1
→ browser_click: [data-testid="order-button"]

Context 2 (Table 2):
→ browser_navigate: http://localhost:3001/customer?table=2
→ browser_click: [data-testid="order-button"]

... (Context 3~10 동시 실행)

Admin Context:
→ browser_navigate: http://localhost:3001/admin/dashboard
→ browser_snapshot: 10개 주문 모두 표시 확인
```

### 3.2 API 기반 동시성 테스트

UI 없이 API만으로 동시성 테스트:

```typescript
// 10개 동시 요청
const promises = Array.from({ length: 10 }, (_, i) =>
  fetch('http://localhost:3000/api/customer/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${tableTokens[i]}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: [{ menuId: 'menu-1', quantity: 1 }],
      sessionId: `session-${i}`
    })
  })
);

const results = await Promise.all(promises);
// 모든 응답이 201인지 확인
```

---

## 4. 테스트 데이터 ID 규칙

### 4.1 data-testid 명명 규칙

| 컴포넌트 | data-testid 패턴 | 예시 |
|----------|-----------------|------|
| 메뉴 카드 | `menu-card-{menuId}` | `menu-card-menu-1` |
| 카테고리 | `category-{categoryId}` | `category-cat-1` |
| 장바구니 버튼 | `cart-button` | - |
| 주문 버튼 | `order-button` | - |
| 수량 증가 | `quantity-increase` | - |
| 수량 감소 | `quantity-decrease` | - |
| 테이블 카드 | `table-card-{tableId}` | `table-card-table-1` |
| 주문 카드 | `order-card-{orderId}` | `order-card-xxx` |
| 상태 버튼 | `status-{status}` | `status-preparing` |

### 4.2 FE 개발자에게 전달할 요청사항

```markdown
## E2E 테스트를 위한 data-testid 추가 요청

다음 요소들에 data-testid 속성을 추가해주세요:

### Customer 페이지
- [ ] 메뉴 카드: data-testid="menu-card-{menuId}"
- [ ] 장바구니 버튼: data-testid="cart-button"
- [ ] 주문 버튼: data-testid="order-button"
- [ ] 수량 증가/감소: data-testid="quantity-increase/decrease"
- [ ] 카테고리 탭: data-testid="category-{categoryId}"

### Admin 페이지
- [ ] 테이블 카드: data-testid="table-card-{tableId}"
- [ ] 주문 상세 모달: data-testid="order-detail-modal"
- [ ] 상태 변경 버튼: data-testid="status-{status}"
- [ ] 이용 완료 버튼: data-testid="complete-session"
- [ ] 과거 내역 버튼: data-testid="view-history"
```

---

## 5. 테스트 실행 체크리스트

### 5.1 사전 조건
- [ ] Backend 서버 실행 중 (`npm run dev`)
- [ ] Frontend 서버 실행 중 (FE 완료 후)
- [ ] 테스트 데이터 초기화됨
- [ ] Playwright MCP 연결됨

### 5.2 테스트 순서
1. **Smoke Test**: TC-E2E-001, TC-E2E-010
2. **기능 테스트**: TC-E2E-002~021
3. **동시성 테스트**: TC-CONC-001~031
4. **부하 테스트**: TC-LOAD-001~002

### 5.3 결과 기록
- [ ] 스크린샷 저장
- [ ] 실패 케이스 로그
- [ ] 응답 시간 측정
- [ ] 에러율 계산

---

## 6. 트러블슈팅

### 6.1 일반적인 문제

| 문제 | 원인 | 해결 |
|------|------|------|
| 요소를 찾을 수 없음 | 로딩 지연 | `waitForSelector` 추가 |
| SSE 이벤트 누락 | 연결 타이밍 | 연결 후 대기 시간 추가 |
| 동시성 테스트 실패 | 리소스 부족 | worker 수 조정 |
| 토큰 만료 | 16시간 초과 | 테스트 전 재로그인 |

### 6.2 디버깅 명령어

```
# 현재 페이지 상태 확인
→ browser_snapshot

# 특정 요소 존재 확인
→ browser_snapshot 후 요소 검색

# 네트워크 요청 확인
→ 브라우저 개발자 도구 Network 탭
```

---

## 7. CI/CD 통합

### 7.1 GitHub Actions 예시

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Start Backend
        run: |
          cd backend
          npm install
          npm run dev &
          sleep 5
      
      - name: Start Frontend
        run: |
          cd frontend
          npm install
          npm run dev &
          sleep 5
      
      - name: Run E2E Tests
        run: npx playwright test
      
      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```
