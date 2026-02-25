# Git Branch Strategy

**프로젝트**: 테이블오더 서비스  
**생성일**: 2026-02-25  
**목적**: 4명 병렬 개발 시 브랜치 관리

---

## 브랜치 구조

```
main
├── feature/be-1-auth        (개발자 A)
├── feature/be-2-menu-order  (개발자 B)
├── feature/be-3-table-sse   (개발자 C)
└── feature/fe-ui            (개발자 D)
```

---

## Phase 1: 병렬 개발

### 브랜치 생성

```bash
# 개발자 A
git checkout main && git pull
git checkout -b feature/be-1-auth

# 개발자 B
git checkout main && git pull
git checkout -b feature/be-2-menu-order

# 개발자 C
git checkout main && git pull
git checkout -b feature/be-3-table-sse

# 개발자 D
git checkout main && git pull
git checkout -b feature/fe-ui
```

### 커밋 컨벤션

```
feat: 기능 추가
fix: 버그 수정
refactor: 리팩토링
docs: 문서 수정
test: 테스트 추가
```

예시:
```bash
git commit -m "feat(be-1): JWT 생성/검증 구현"
git commit -m "feat(be-2): Menu API 구현 (TODO: AUTH)"
```

### 푸시

```bash
git push origin feature/be-1-auth
```

---

## Phase 2: 통합

### 순서

1. **BE-1 먼저 머지** (Auth 기반)
2. **BE-2, BE-3 리베이스 후 Auth 적용**
3. **FE 머지**
4. **통합 테스트**

### BE-1 머지 (개발자 A)

```bash
git checkout main
git pull
git merge feature/be-1-auth
git push origin main
```

### BE-2, BE-3 리베이스 및 Auth 적용 (개발자 B, C)

```bash
# 개발자 B
git checkout feature/be-2-menu-order
git fetch origin
git rebase origin/main
# TODO: [AUTH] 주석 → 실제 Auth 미들웨어 적용
git push origin feature/be-2-menu-order --force-with-lease

# PR 생성 후 머지
```

### FE 머지 (개발자 D)

```bash
git checkout feature/fe-ui
git fetch origin
git rebase origin/main
# Mock API → 실제 API 연동
git push origin feature/fe-ui --force-with-lease

# PR 생성 후 머지
```

---

## Phase 3: Shared Types 추출

```bash
git checkout main
git checkout -b refactor/shared-types
# 공통 타입 추출 작업
git push origin refactor/shared-types
# PR 생성 후 머지
```

---

## PR 규칙

| 항목 | 규칙 |
|-----|------|
| 리뷰어 | 최소 1명 |
| CI | 테스트 통과 필수 |
| 충돌 | 머지 전 해결 |
| 스쿼시 | 선택 (커밋 정리 시) |

---

## 충돌 해결

```bash
git fetch origin
git rebase origin/main
# 충돌 해결
git add .
git rebase --continue
git push --force-with-lease
```

---

## 요약

| Phase | 작업 | 브랜치 |
|-------|-----|--------|
| 1 | 병렬 개발 | `feature/be-*`, `feature/fe-ui` |
| 2 | 통합 | `main`으로 순차 머지 |
| 3 | 리팩토링 | `refactor/shared-types` |
