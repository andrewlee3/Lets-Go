# BE-3 Code Summary

**Unit**: BE-3 (Table + SSE)  
**생성일**: 2026-02-25  
**담당자**: 개발자 C

---

## 생성된 파일

### Application Code (`apps/backend/src/`)

| 파일 | 설명 |
|-----|------|
| `types/index.ts` | Table, Session, Order, SSE 타입 정의 |
| `utils/response.ts` | API 응답 유틸리티 |
| `utils/error.ts` | AppError, NotImplementedError 클래스 |
| `repositories/table.repository.ts` | 테이블 DB 접근 |
| `repositories/session.repository.ts` | 세션 DB 접근 |
| `services/table.service.ts` | 테이블/세션 비즈니스 로직 |
| `services/sse.service.ts` | SSE 클라이언트 관리 및 브로드캐스트 |
| `controllers/table.controller.ts` | Table API 엔드포인트 |
| `controllers/sse.controller.ts` | SSE API 엔드포인트 |
| `routes/table.routes.ts` | Table 라우터 |
| `routes/sse.routes.ts` | SSE 라우터 |
| `app.ts` | Express 앱 설정 |
| `index.ts` | 앱 진입점 |

### Test Code (`apps/backend/tests/`)

| 파일 | 테스트 수 |
|-----|----------|
| `repositories/table.repository.test.ts` | 3 |
| `repositories/session.repository.test.ts` | 4 |
| `services/table.service.test.ts` | 8 |
| `services/sse.service.test.ts` | 3 |
| `controllers/table.controller.test.ts` | 3 |
| `controllers/sse.controller.test.ts` | 2 |
| **Total** | **23** |

---

## API Endpoints

| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/admin/tables/:id/complete` | 테이블 이용 완료 |
| GET | `/api/admin/tables/:id/history` | 과거 주문 내역 조회 |
| GET | `/api/customer/sse/orders` | 고객 SSE 연결 |
| GET | `/api/admin/sse/orders` | 관리자 SSE 연결 |

---

## Story Coverage

| Story | 설명 | 상태 |
|-------|------|------|
| US-2.2 | 실시간 주문 모니터링 | ✅ |
| US-2.3 | 주문 상태 변경 SSE | ✅ |
| US-3.1 | 테이블 초기 설정 (BE-1 연동) | ✅ |
| US-3.2 | 테이블 이용 완료 | ✅ |
| US-3.3 | 과거 주문 내역 조회 | ✅ |

---

## TODO 항목

```typescript
// TODO: [AUTH] 인증 미들웨어 적용 필요
```

BE-1 완료 후 적용 필요:
- `TableController.completeTable`
- `TableController.getTableHistory`
- `SSEController.customerSSE`
- `SSEController.adminSSE`

---

## 의존성

- **BE-1**: Auth 미들웨어 (TODO)
- **BE-2**: Order 데이터 (조회용)
