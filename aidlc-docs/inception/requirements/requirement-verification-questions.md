# Requirements Verification Questions

**프로젝트**: 테이블오더 서비스  
**생성일**: 2026-02-25

기존 PRD 문서(`requirements/table-order-requirements.md`)를 분석한 결과, 다음 기술적 결정이 필요합니다.

---

## Q1. 기술 스택 선택

### Backend Framework
A) Node.js + Express  
B) Node.js + Fastify  
C) Python + FastAPI  
D) Go + Gin  
E) Java + Spring Boot  
X) Other (아래 [Answer]: 태그 뒤에 직접 기술해주세요)

[Answer]: A

### Frontend Framework
A) React + TypeScript  
B) Vue.js + TypeScript  
C) Next.js (React SSR)  
D) Vanilla JavaScript (프레임워크 없음)  
X) Other (아래 [Answer]: 태그 뒤에 직접 기술해주세요)

[Answer]: C

### Database
A) PostgreSQL  
B) MySQL  
C) SQLite (개발/MVP용)  
D) MongoDB  
X) Other (아래 [Answer]: 태그 뒤에 직접 기술해주세요)

[Answer]: C

---

## Q2. 배포 환경

A) AWS (EC2, RDS, S3 등)  
B) 로컬 개발 환경만 (Docker Compose)  
C) Vercel/Netlify (Frontend) + Railway/Render (Backend)  
D) Kubernetes  
X) Other (아래 [Answer]: 태그 뒤에 직접 기술해주세요)

[Answer]: B

---

## Q3. 프로젝트 구조

A) Monorepo (Frontend + Backend 한 저장소)  
B) 분리된 저장소 (Frontend, Backend 각각)  

[Answer]: A

---

## Q4. 인증 방식 상세

PRD에 JWT 16시간 세션이 명시되어 있습니다. 추가 확인:

### Access Token + Refresh Token 사용 여부
A) Access Token만 사용 (16시간 유효)  
B) Access Token (15분) + Refresh Token (16시간) 조합  

[Answer]: A

---

## Q5. 테스트 범위

A) 단위 테스트만  
B) 단위 테스트 + 통합 테스트  
C) 단위 테스트 + 통합 테스트 + E2E 테스트  
D) 테스트 없음 (MVP 우선)  

[Answer]: C

---

## Q6. API 문서화

A) OpenAPI/Swagger 자동 생성  
B) 수동 문서화 (Markdown)  
C) 문서화 없음 (MVP 우선)  

[Answer]: A

---

**모든 질문에 답변 후 알려주세요.**
