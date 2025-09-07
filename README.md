# limBoard

프로젝트 관리를 위한 풀스택 웹 애플리케이션입니다. 팀 협업, 프로젝트 추적, 작업 관리를 지원합니다.

## 🚀 기술 스택

### 프론트엔드
- **Next.js 15** - React 19, App Router, Turbopack
- **TypeScript** - 정적 타입 검사
- **TailwindCSS** - 유틸리티 기반 스타일링
- **Radix UI** - 접근성 우선 컴포넌트 라이브러리
- **Lucide React** - 아이콘 라이브러리

### 백엔드
- **NestJS** - Node.js 프레임워크
- **TypeORM** - ORM 및 데이터베이스 관리
- **PostgreSQL** - 관계형 데이터베이스
- **JWT** - 인증 및 권한 관리
- **bcrypt** - 비밀번호 해싱

### 인프라
- **Docker & Docker Compose** - 컨테이너화
- **pnpm** - 패키지 매니저

## 📁 프로젝트 구조

```
limBoard/
├── frontend/                 # Next.js 프론트엔드
│   ├── app/
│   │   ├── (auth-layout)/   # 인증 관련 페이지
│   │   └── (dashboard-layout)/ # 메인 대시보드
│   └── api/                 # API 호출 레이어
├── backend/                 # NestJS 백엔드
│   └── src/
│       ├── auth/           # 인증 및 권한
│       ├── user/           # 사용자 관리
│       ├── team/           # 팀 관리
│       ├── project/        # 프로젝트 관리
│       ├── task/           # 작업 관리
│       └── common/         # 공통 유틸리티
└── docker-compose.yaml     # 컨테이너 설정
```

## 🏗 주요 기능

- **사용자 관리**: 회원가입, 로그인, 프로필 관리
- **팀 관리**: 팀 생성, 멤버 초대, 역할 관리
- **프로젝트 관리**: 프로젝트 생성, 멤버 할당, 권한 제어
- **작업 관리**: 작업 생성, 할당, 상태 추적
- **권한 시스템**: 역할 기반 접근 제어 (RBAC)

## 🚀 빠른 시작

### 개발 환경 설정

1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd limBoard
   ```

2. **환경 변수 설정**
   ```bash
   # 백엔드 환경 변수
   cp backend/.env.example backend/.env
   
   # 프론트엔드 환경 변수
   cp frontend/.env.example frontend/.env
   ```

3. **Docker로 개발 환경 시작**
   ```bash
   # 개발 환경 (핫 리로드 포함)
   docker-compose --profile development up
   ```

### 로컬 개발

**백엔드 서버**
```bash
cd backend
npm install
npm run start:dev    # 개발 서버 시작 (포트 3001)
```

**프론트엔드 서버**
```bash
cd frontend
npm install
npm run dev         # 개발 서버 시작 (포트 3000)
```

**데이터베이스**
```bash
docker-compose up backend_database    # PostgreSQL (포트 6000)
```

## 📋 개발 명령어

### 프론트엔드
```bash
npm run dev          # 개발 서버 (Turbopack)
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버
npm run lint         # ESLint 실행
```

### 백엔드
```bash
npm run start:dev    # 개발 서버 (watch 모드)
npm run build        # TypeScript 빌드
npm run start        # 프로덕션 서버
npm run lint         # ESLint (자동 수정)
npm run format       # Prettier 포맷팅
npm run test         # 단위 테스트
npm run test:e2e     # E2E 테스트
```

## 🌐 API 엔드포인트

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:3001
- **데이터베이스**: http://localhost:6000

## 🏭 프로덕션 배포

```bash
# 프로덕션 환경 시작
docker-compose --profile production up
```

## 🛠 개발 워크플로

1. 데이터베이스 컨테이너 시작
2. 백엔드 개발 서버 실행 (`npm run start:dev`)
3. 프론트엔드 개발 서버 실행 (`npm run dev`)
4. http://localhost:3000 에서 애플리케이션 접근

## 📊 데이터베이스 스키마

### 엔티티 구조

```
┌─────────────┐    ┌─────────────────┐    ┌─────────────┐
│    User     │    │   TeamMember    │    │    Team     │
├─────────────┤    ├─────────────────┤    ├─────────────┤
│ id (UUID)   │◄──►│ id (UUID)       │◄──►│ id (UUID)   │
│ email       │    │ role (Enum)     │    │ name        │
│ nickname    │    │ - MEMBER        │    │ description │
│ password    │    │ - MANAGER       │    │             │
│ description │    │ - ADMIN         │    │             │
└─────────────┘    └─────────────────┘    └─────────────┘
                                                │
                                                │ 1:N
                                                ▼
┌─────────────┐    ┌─────────────────┐    ┌─────────────┐
│    User     │    │ ProjectMember   │    │   Project   │
├─────────────┤    ├─────────────────┤    ├─────────────┤
│     (동일)   │◄──►│ id (UUID)       │◄──►│ id (UUID)   │
│             │    │ role (Enum)     │    │ name        │
│             │    │ - MEMBER        │    │ status      │
│             │    │ - ADMIN         │    │ - TODO      │
│             │    │ joinedAt        │    │ - IN_PROGRESS│
│             │    │                 │    │ - COMPLETED │
│             │    │                 │    │ deadline    │
└─────────────┘    └─────────────────┘    └─────────────┘
       │                                         │
       │                                         │ 1:N
       │ N:1 (assignee)                          ▼
       │           ┌─────────────────────────────────┐
       └──────────►│            Task                 │
                   ├─────────────────────────────────┤
                   │ id (UUID)                       │
                   │ title                           │
                   │ description                     │
                   │ status (Enum)                   │
                   │ - TODO, IN_PROGRESS, COMPLETED  │
                   │ priority (Enum)                 │
                   │ - Low, Medium, High             │
                   │ deadline                        │
                   └─────────────────────────────────┘
```

### 주요 관계 설명

**1. 사용자-팀 관계 (다대다)**
- `User` ↔ `TeamMember` ↔ `Team`
- 한 사용자는 여러 팀에 속할 수 있음
- 각 팀 소속에서 역할 부여 (MEMBER, MANAGER, ADMIN)
- 계층적 권한 구조 (ADMIN > MANAGER > MEMBER)

**2. 사용자-프로젝트 관계 (다대다)**
- `User` ↔ `ProjectMember` ↔ `Project`
- 한 사용자는 여러 프로젝트에 참여 가능
- 프로젝트별 역할 관리 (MEMBER, ADMIN)
- 참여 일자 추적 (`joinedAt`)

**3. 팀-프로젝트 관계 (일대다)**
- `Team` → `Project` (1:N)
- 하나의 팀은 여러 프로젝트를 소유
- 프로젝트는 반드시 하나의 팀에 소속

**4. 프로젝트-작업 관계 (일대다)**
- `Project` → `Task` (1:N)
- 하나의 프로젝트는 여러 작업을 포함
- 작업 삭제 시 연관된 작업들도 함께 삭제 (cascade)

**5. 사용자-작업 관계 (다대일)**
- `User` → `Task` (N:1, nullable)
- 작업은 사용자에게 할당될 수 있음 (선택적)
- 한 사용자는 여러 작업을 담당 가능

### 권한 체계

**팀 권한 레벨**
```typescript
ADMIN (3)    - 팀 관리, 멤버 초대/제거, 프로젝트 생성
MANAGER (2)  - 프로젝트 관리, 작업 할당
MEMBER (1)   - 작업 수행, 기본 참여
```

**프로젝트 권한**
```typescript
ADMIN   - 프로젝트 설정, 멤버 관리
MEMBER  - 작업 참여, 기본 활동
```

## 🔐 인증 시스템

- JWT 기반 인증
- HTTP-only 쿠키로 Refresh Token 저장
- 역할 기반 권한 제어
- CORS 지원 (credentials 포함)
