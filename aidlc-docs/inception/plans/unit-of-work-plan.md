# Unit of Work Plan

**프로젝트**: 테이블오더 서비스  
**생성일**: 2026-02-25  
**목적**: 시스템을 개발 가능한 작업 단위로 분해

---

## 분해 계획

### Phase 1: 작업 단위 정의
- [ ] Unit 식별 및 책임 정의
- [ ] Unit별 포함 컴포넌트 매핑

### Phase 2: 의존성 분석
- [ ] Unit 간 의존성 매트릭스 작성
- [ ] 개발 순서 결정

### Phase 3: Story 매핑
- [ ] 각 Unit에 User Story 할당
- [ ] 누락된 Story 없는지 검증

### Phase 4: 산출물 생성
- [ ] unit-of-work.md 생성
- [ ] unit-of-work-dependency.md 생성
- [ ] unit-of-work-story-map.md 생성

---

## 분해 질문

현재 Application Design 기준:
- **Backend**: 5개 Controller, 5개 Service
- **Frontend Customer**: 7개 컴포넌트 (3 Context/Hook, 4 Page/UI)
- **Frontend Admin**: 7개 컴포넌트 (2 Context/Hook, 5 Page/UI)
- **Shared**: 타입, 상수, 유틸리티

### Q1. 작업 단위 분해 방식
어떤 기준으로 작업 단위를 나눌까요?

A) 레이어별 (Backend → Frontend Customer → Frontend Admin)
B) 기능별 (인증 → 메뉴 → 주문 → 테이블관리)
C) 사용자별 (공통 → 고객용 전체 → 관리자용 전체)

[Answer]: 추천해줘 (우리팀은 PM1명, 백엔드 1명, QA 1명, FE는 1명인데 부재중-나중에 올수도 있음)

### Q2. 개발 순서
어떤 순서로 개발을 진행할까요?

A) Backend 먼저 완성 → Frontend 개발 (API 완성 후 UI)
B) 기능 단위로 Backend+Frontend 함께 (수직 슬라이스)
C) 핵심 플로우 먼저 (메뉴→장바구니→주문) → 나머지

[Answer]: 위의 질문이랑 비슷한데, 위 답변에 따라 추천해줘

### Q3. 팀 구성 고려
현재 팀 구성은?

A) 1인 개발 (순차 진행)
B) 2-3인 (병렬 가능)
C) 4인 이상 (완전 병렬)

[Answer]: Q1에 팀구성 적어두었어

---

**모든 질문에 답변 후 알려주세요.**
