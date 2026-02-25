# Playwright MCP 테스트 가이드

**프로젝트**: 테이블오더 서비스  
**최종 수정**: 2026-02-25  
**상태**: FE 대기 중 (초안)

---

## 1. Playwright MCP 기본 사용법

### 주요 도구

| 도구 | 설명 |
|------|------|
| `browser_navigate` | URL로 이동 |
| `browser_click` | 요소 클릭 |
| `browser_type` | 텍스트 입력 |
| `browser_screenshot` | 스크린샷 |
| `browser_snapshot` | 페이지 상태 캡처 |

### 요소 선택자 (우선순위)

```
1. data-testid="menu-card-1"     # 테스트 전용
2. role="button" name="주문하기"  # 접근성 기반
3. text="불고기 버거"             # 텍스트 기반
```

---

## 2. 테스트 시나리오 예시

### 고객 주문 플로우

```
1. browser_navigate: http://localhost:3001/customer
2. browser_click: [data-testid="menu-card-menu-1"]
3. browser_click: [data-testid="add-to-cart"]
4. browser_click: [data-testid="order-button"]
5. browser_snapshot: 주문 번호 확인
```

### 관리자 로그인

```
1. browser_navigate: http://localhost:3001/admin/login
2. browser_type: [name="storeId"] → "store1"
3. browser_type: [name="username"] → "admin"
4. browser_type: [name="password"] → "admin123"
5. browser_click: [type="submit"]
6. browser_snapshot: 대시보드 확인
```

---

## 3. data-testid 규칙

### FE 개발자 요청사항

| 컴포넌트 | data-testid |
|----------|-------------|
| 메뉴 카드 | `menu-card-{menuId}` |
| 장바구니 버튼 | `cart-button` |
| 주문 버튼 | `order-button` |
| 테이블 카드 | `table-card-{tableId}` |
| 상태 버튼 | `status-{status}` |

---

## 4. 실행 체크리스트

- [ ] Backend 서버 실행 (`npm run dev`)
- [ ] Frontend 서버 실행 (FE 완료 후)
- [ ] Playwright MCP 연결

---

## ⚠️ 참고사항

- 현재 문서는 **초안 상태**입니다
- FE 추가 후 실제 URL/선택자에 맞게 수정 예정
