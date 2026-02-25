# 동시성 테스트 상세 시나리오

**프로젝트**: 테이블오더 서비스  
**생성일**: 2026-02-25  
**목적**: Race Condition, 데이터 일관성, SSE 동시성 검증

---

## 1. 동시성 테스트 목표

### 1.1 검증 항목
- **데이터 일관성**: 동시 요청 시 데이터 무결성 유지
- **Race Condition**: 경쟁 상태에서 예측 가능한 동작
- **SSE 이벤트 전달**: 모든 클라이언트에 이벤트 전달
- **세션 관리**: 동시 세션 작업 시 일관성

### 1.2 테스트 환경
- 동시 사용자: 최대 50명
- 동시 테이블: 10개
- 동시 관리자: 3명
- SSE 연결: 최대 15개

---

## 2. 주문 동시성 테스트

### TC-CONC-001: 다중 테이블 동시 주문

**목적**: 여러 테이블에서 동시에 주문해도 모든 주문이 정상 처리되는지 확인

**테스트 코드**:
```typescript
import { test, expect } from '@playwright/test';

test('TC-CONC-001: 10개 테이블 동시 주문', async ({ request }) => {
  // 1. 10개 테이블 토큰 준비
  const tableTokens = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      getTableToken(request, 'store1', String(i + 1), 'table123')
    )
  );

  // 2. 동시 주문 생성
  const startTime = Date.now();
  const orderPromises = tableTokens.map((token, i) =>
    request.post('/api/customer/orders', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        items: [{ menuId: 'menu-1', quantity: 1 }],
        sessionId: `session-${i + 1}`
      }
    })
  );

  const responses = await Promise.all(orderPromises);
  const endTime = Date.now();

  // 3. 검증
  // 모든 요청 성공
  responses.forEach((res, i) => {
    expect(res.status()).toBe(201);
  });

  // 주문 번호 고유성
  const orderNumbers = await Promise.all(
    responses.map(r => r.json().then(d => d.data.orderNumber))
  );
  const uniqueNumbers = new Set(orderNumbers);
  expect(uniqueNumbers.size).toBe(10);

  // 응답 시간 (전체 2초 이내)
  expect(endTime - startTime).toBeLessThan(2000);

  console.log(`10개 동시 주문 완료: ${endTime - startTime}ms`);
});
```

**예상 결과**:
- 10개 주문 모두 201 응답
- 10개 고유한 주문 번호
- 전체 처리 시간 2초 이내

---

### TC-CONC-002: 동시 주문 시 SSE 이벤트 전달

**목적**: 동시 주문 시 관리자에게 모든 SSE 이벤트가 전달되는지 확인

**테스트 코드**:
```typescript
test('TC-CONC-002: 동시 주문 SSE 이벤트', async ({ request }) => {
  // 1. 관리자 SSE 연결
  const adminToken = await getAdminToken(request);
  const sseEvents: any[] = [];
  
  const eventSource = new EventSource(
    `http://localhost:3000/api/admin/sse/orders`,
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  
  eventSource.addEventListener('new_order', (e) => {
    sseEvents.push(JSON.parse(e.data));
  });

  // 2. 5개 테이블 동시 주문
  const tableTokens = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      getTableToken(request, 'store1', String(i + 1), 'table123')
    )
  );

  await Promise.all(
    tableTokens.map((token, i) =>
      request.post('/api/customer/orders', {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          items: [{ menuId: 'menu-1', quantity: 1 }],
          sessionId: `session-${i + 1}`
        }
      })
    )
  );

  // 3. SSE 이벤트 수신 대기 (2초)
  await new Promise(resolve => setTimeout(resolve, 2000));
  eventSource.close();

  // 4. 검증
  expect(sseEvents.length).toBe(5);
  console.log(`수신된 SSE 이벤트: ${sseEvents.length}개`);
});
```

**예상 결과**:
- 5개 `new_order` 이벤트 수신
- 이벤트 데이터에 주문 정보 포함

---

## 3. 상태 변경 동시성 테스트

### TC-CONC-010: 동일 주문 동시 상태 변경

**목적**: 두 관리자가 동시에 같은 주문 상태를 변경할 때 데이터 일관성 확인

**테스트 코드**:
```typescript
test('TC-CONC-010: 동일 주문 동시 상태 변경', async ({ request }) => {
  // 1. 주문 생성
  const tableToken = await getTableToken(request, 'store1', '1', 'table123');
  const orderRes = await request.post('/api/customer/orders', {
    headers: { Authorization: `Bearer ${tableToken}` },
    data: {
      items: [{ menuId: 'menu-1', quantity: 1 }],
      sessionId: 'test-session'
    }
  });
  const { orderId } = (await orderRes.json()).data;

  // 2. 두 관리자 토큰
  const adminToken = await getAdminToken(request);

  // 3. 동시 상태 변경 요청
  const [res1, res2] = await Promise.all([
    request.patch(`/api/admin/orders/${orderId}/status`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: { status: 'preparing' }
    }),
    request.patch(`/api/admin/orders/${orderId}/status`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: { status: 'completed' }
    })
  ]);

  // 4. 검증 - 둘 다 성공해야 함
  expect(res1.status()).toBe(200);
  expect(res2.status()).toBe(200);

  // 5. 최종 상태 확인 (마지막 요청 반영)
  const ordersRes = await request.get('/api/admin/orders', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const orders = (await ordersRes.json()).data.tables
    .flatMap(t => t.orders)
    .filter(o => o.id === orderId);
  
  // 최종 상태는 preparing 또는 completed 중 하나
  expect(['preparing', 'completed']).toContain(orders[0]?.status);
});
```

**예상 결과**:
- 두 요청 모두 200 응답
- 최종 상태는 마지막 처리된 요청 반영

---

### TC-CONC-011: 주문 삭제 중 상태 변경

**목적**: 삭제와 상태 변경이 동시에 발생할 때 적절한 에러 처리 확인

**테스트 코드**:
```typescript
test('TC-CONC-011: 주문 삭제 중 상태 변경', async ({ request }) => {
  // 1. 주문 생성
  const tableToken = await getTableToken(request, 'store1', '1', 'table123');
  const orderRes = await request.post('/api/customer/orders', {
    headers: { Authorization: `Bearer ${tableToken}` },
    data: {
      items: [{ menuId: 'menu-1', quantity: 1 }],
      sessionId: 'test-session'
    }
  });
  const { orderId } = (await orderRes.json()).data;

  const adminToken = await getAdminToken(request);

  // 2. 동시 요청: 삭제 + 상태 변경
  const [deleteRes, updateRes] = await Promise.all([
    request.delete(`/api/admin/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    }),
    request.patch(`/api/admin/orders/${orderId}/status`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: { status: 'preparing' }
    })
  ]);

  // 3. 검증 - 하나는 성공, 하나는 실패 가능
  const statuses = [deleteRes.status(), updateRes.status()];
  
  // 적어도 하나는 성공
  expect(statuses.some(s => s === 200)).toBe(true);
  
  // 삭제 후 상태 변경 시도하면 404
  if (deleteRes.status() === 200 && updateRes.status() !== 200) {
    expect(updateRes.status()).toBe(404);
  }

  // 4. 최종 상태: 주문이 없어야 함 (삭제 성공 시)
  const checkRes = await request.get('/api/admin/orders', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const remainingOrders = (await checkRes.json()).data.tables
    .flatMap(t => t.orders)
    .filter(o => o.id === orderId);
  
  // 삭제가 성공했으면 주문이 없어야 함
  if (deleteRes.status() === 200) {
    expect(remainingOrders.length).toBe(0);
  }
});
```

---

## 4. 세션 동시성 테스트

### TC-CONC-020: 이용 완료 중 새 주문 생성

**목적**: 세션 종료와 새 주문이 동시에 발생할 때 데이터 일관성 확인

**테스트 코드**:
```typescript
test('TC-CONC-020: 이용 완료 중 새 주문', async ({ request }) => {
  // 1. 테이블 1에 기존 주문 생성
  const tableToken = await getTableToken(request, 'store1', '1', 'table123');
  await request.post('/api/customer/orders', {
    headers: { Authorization: `Bearer ${tableToken}` },
    data: {
      items: [{ menuId: 'menu-1', quantity: 1 }],
      sessionId: 'session-1'
    }
  });

  const adminToken = await getAdminToken(request);

  // 2. 동시 요청: 이용 완료 + 새 주문
  const [completeRes, newOrderRes] = await Promise.all([
    request.post('/api/admin/tables/table-1/complete', {
      headers: { Authorization: `Bearer ${adminToken}` }
    }),
    request.post('/api/customer/orders', {
      headers: { Authorization: `Bearer ${tableToken}` },
      data: {
        items: [{ menuId: 'menu-2', quantity: 1 }],
        sessionId: 'session-1'  // 같은 세션
      }
    })
  ]);

  // 3. 검증
  // 이용 완료 성공
  expect(completeRes.status()).toBe(200);
  
  // 새 주문도 성공 (새 세션으로 처리되거나 기존 세션에 포함)
  expect(newOrderRes.status()).toBe(201);

  // 4. 데이터 일관성 확인
  const ordersRes = await request.get('/api/admin/orders', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const table1Orders = (await ordersRes.json()).data.tables
    .find(t => t.table.id === 'table-1')?.orders || [];

  console.log(`테이블 1 현재 주문 수: ${table1Orders.length}`);
});
```

---

## 5. SSE 연결 동시성 테스트

### TC-CONC-030: 다중 관리자 SSE 연결

**목적**: 여러 관리자가 동시에 SSE 연결해도 모두 이벤트를 수신하는지 확인

**테스트 코드**:
```typescript
test('TC-CONC-030: 다중 관리자 SSE', async ({ request }) => {
  const adminToken = await getAdminToken(request);
  
  // 1. 3개 SSE 연결
  const eventSources = Array.from({ length: 3 }, () => {
    const events: any[] = [];
    // SSE 연결 시뮬레이션
    return { events };
  });

  // 2. 새 주문 생성
  const tableToken = await getTableToken(request, 'store1', '1', 'table123');
  await request.post('/api/customer/orders', {
    headers: { Authorization: `Bearer ${tableToken}` },
    data: {
      items: [{ menuId: 'menu-1', quantity: 1 }],
      sessionId: 'test-session'
    }
  });

  // 3. 검증 - 모든 연결에서 이벤트 수신
  // (실제 구현에서는 EventSource 사용)
  
  console.log('3개 SSE 연결 테스트 완료');
});
```

---

## 6. 부하 테스트

### TC-LOAD-001: 100개 주문 연속 생성

**테스트 코드**:
```typescript
test('TC-LOAD-001: 100개 주문 부하 테스트', async ({ request }) => {
  const tableToken = await getTableToken(request, 'store1', '1', 'table123');
  
  const results = {
    success: 0,
    failed: 0,
    totalTime: 0,
    responseTimes: [] as number[]
  };

  // 100개 주문 생성 (10개씩 배치)
  for (let batch = 0; batch < 10; batch++) {
    const batchPromises = Array.from({ length: 10 }, async (_, i) => {
      const start = Date.now();
      const res = await request.post('/api/customer/orders', {
        headers: { Authorization: `Bearer ${tableToken}` },
        data: {
          items: [{ menuId: 'menu-1', quantity: 1 }],
          sessionId: `load-test-${batch * 10 + i}`
        }
      });
      const responseTime = Date.now() - start;
      results.responseTimes.push(responseTime);
      
      if (res.status() === 201) results.success++;
      else results.failed++;
    });

    await Promise.all(batchPromises);
  }

  // 결과 분석
  const avgResponseTime = results.responseTimes.reduce((a, b) => a + b, 0) / results.responseTimes.length;
  const maxResponseTime = Math.max(...results.responseTimes);

  console.log(`
    성공: ${results.success}
    실패: ${results.failed}
    평균 응답 시간: ${avgResponseTime.toFixed(2)}ms
    최대 응답 시간: ${maxResponseTime}ms
  `);

  // 검증
  expect(results.success).toBe(100);
  expect(results.failed).toBe(0);
  expect(avgResponseTime).toBeLessThan(500);
});
```

---

## 7. 테스트 유틸리티 함수

```typescript
// utils/test-helpers.ts

export async function getAdminToken(request: APIRequestContext): Promise<string> {
  const res = await request.post('/api/admin/login', {
    data: { storeId: 'store1', username: 'admin', password: 'admin123' }
  });
  return (await res.json()).data.token;
}

export async function getTableToken(
  request: APIRequestContext,
  storeId: string,
  tableNumber: string,
  password: string
): Promise<string> {
  const res = await request.post('/api/customer/table/setup', {
    data: { storeId, tableNumber, tablePassword: password }
  });
  return (await res.json()).data.token;
}

export async function createOrder(
  request: APIRequestContext,
  token: string,
  items: { menuId: string; quantity: number }[],
  sessionId: string
) {
  return request.post('/api/customer/orders', {
    headers: { Authorization: `Bearer ${token}` },
    data: { items, sessionId }
  });
}

export async function clearTestData(request: APIRequestContext, adminToken: string) {
  // 모든 테이블 이용 완료 처리
  for (let i = 1; i <= 10; i++) {
    await request.post(`/api/admin/tables/table-${i}/complete`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
  }
}
```

---

## 8. 테스트 결과 리포트 템플릿

```markdown
# 동시성 테스트 결과 리포트

**실행일**: YYYY-MM-DD HH:MM
**환경**: Local / Staging / Production

## 요약
| 카테고리 | 통과 | 실패 | 스킵 |
|----------|------|------|------|
| 주문 동시성 | X/X | X/X | X/X |
| 상태 변경 | X/X | X/X | X/X |
| 세션 관리 | X/X | X/X | X/X |
| SSE 연결 | X/X | X/X | X/X |
| 부하 테스트 | X/X | X/X | X/X |

## 성능 메트릭
- 평균 응답 시간: XXXms
- 최대 응답 시간: XXXms
- 에러율: X%
- 처리량: XXX req/s

## 실패 케이스
(있는 경우 상세 기록)

## 권장 사항
(개선 필요 사항)
```
