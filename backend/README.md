# Table Order Backend - BE-1: Auth Module

개발자 A가 담당하는 Auth 모듈 구현입니다.

## 구현 범위

- AuthController, AuthService, AuthRepository
- JWT 생성/검증
- 로그인 시도 제한 (5회/5분)
- bcrypt 비밀번호 해싱

## API Endpoints

### POST /api/admin/login
관리자 로그인

**Request:**
```json
{
  "storeId": "store1",
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 57600
  }
}
```

### POST /api/customer/table/setup
테이블 초기 설정 및 로그인

**Request:**
```json
{
  "storeId": "store1",
  "tableNumber": "1",
  "tablePassword": "table123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 57600,
    "tableInfo": {
      "tableId": "table-1",
      "tableNumber": "1",
      "storeId": "store1",
      "sessionId": "session-uuid"
    }
  }
}
```

### POST /api/customer/table/auto-login
저장된 토큰으로 자동 로그인

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "tableInfo": {
      "tableId": "table-1",
      "tableNumber": "1",
      "storeId": "store1",
      "sessionId": "session-uuid"
    }
  }
}
```

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일 생성:
```bash
cp .env.example .env
```

### 3. 개발 서버 실행
```bash
npm run dev
```

서버가 http://localhost:3000 에서 실행됩니다.

### 4. 빌드
```bash
npm run build
```

### 5. 프로덕션 실행
```bash
npm start
```

## 테스트

### 전체 테스트 실행
```bash
npm test
```

### Watch 모드로 테스트
```bash
npm run test:watch
```

## 테스트 계정

### 관리자 계정
- Store ID: `store1`
- Username: `admin`
- Password: `admin123`

### 테이블 계정
- Store ID: `store1`
- Table Number: `1`
- Password: `table123`

## 프로젝트 구조

```
backend/
├── src/
│   ├── index.ts              # 앱 진입점
│   ├── app.ts                # Express 앱 설정
│   ├── database/
│   │   └── index.ts          # DB 초기화
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── services/
│   │   └── auth.service.ts
│   ├── repositories/
│   │   └── auth.repository.ts
│   ├── middlewares/
│   │   └── error.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── response.ts
├── tests/
│   ├── unit/
│   │   └── auth.service.test.ts
│   └── integration/
│       └── auth.test.ts
├── package.json
├── tsconfig.json
└── jest.config.js
```

## 보안 기능

### 1. 비밀번호 해싱
- bcrypt를 사용한 안전한 비밀번호 저장
- Salt rounds: 10

### 2. JWT 토큰
- 16시간 유효기간
- HS256 알고리즘

### 3. 로그인 시도 제한
- 최대 5회 실패 시 5분간 잠금
- 식별자별 독립적 관리

## TODO 주석

다른 모듈과의 통합을 위한 TODO 주석:
- `// TODO: [SHARED]` - 공통 타입 추출 필요
- `// TODO: [AUTH]` - Auth 미들웨어 적용 필요 (BE-2, BE-3에서 사용)

## 다음 단계 (Phase 2)

1. BE-2, BE-3에 Auth 미들웨어 전달
2. 공통 타입 리팩토링
3. FE와 API 연동 테스트
