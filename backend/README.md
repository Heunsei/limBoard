# limBoard 백엔드

팀 협업과 프로젝트 관리를 위한 웹 애플리케이션의 백엔드 API 서버입니다.

## 🚀 기술 스택

- **NestJS 11** - Node.js 프레임워크
- **TypeORM** - ORM 및 데이터베이스 관리
- **PostgreSQL** - 관계형 데이터베이스
- **JWT** - 인증 및 권한 관리
- **bcrypt** - 비밀번호 해싱
- **class-validator** - 요청 데이터 검증
- **class-transformer** - 데이터 변환

## 📁 프로젝트 구조

```
backend/
├── src/
│   ├── auth/                    # 인증 모듈
│   │   ├── decorator/          # 커스텀 데코레이터
│   │   │   ├── authorization.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   ├── role.decorator.ts
│   │   │   └── project-role.decorator.ts
│   │   ├── guard/              # 가드들
│   │   │   ├── auth.guard.ts
│   │   │   ├── role.guard.ts
│   │   │   └── project-role.guard.ts
│   │   ├── middleware/         # 미들웨어
│   │   │   └── bearer-token.middleware.ts
│   │   ├── dto/                # DTO
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── user/                   # 사용자 모듈
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   │   ├── find-user.dto.ts
│   │   │   └── user-response.dto.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.module.ts
│   ├── team/                   # 팀 모듈
│   │   ├── dto/
│   │   │   ├── create-team.dto.ts
│   │   │   ├── update-team.dto.ts
│   │   │   └── add-user.dto.ts
│   │   ├── entities/
│   │   │   ├── team.entity.ts
│   │   │   └── teamMember.entity.ts
│   │   ├── team.controller.ts
│   │   ├── team.service.ts
│   │   └── team.module.ts
│   ├── project/                # 프로젝트 모듈
│   │   ├── dto/
│   │   │   ├── create-project.dto.ts
│   │   │   ├── update-project.dto.ts
│   │   │   └── add-member.dto.ts
│   │   ├── entities/
│   │   │   ├── project.entity.ts
│   │   │   └── projectMember.entity.ts
│   │   ├── project.controller.ts
│   │   ├── project.service.ts
│   │   └── project.module.ts
│   ├── task/                   # 작업 모듈
│   │   ├── dto/
│   │   │   ├── create-task.dto.ts
│   │   │   └── update-task.dto.ts
│   │   ├── entities/
│   │   │   └── task.entity.ts
│   │   ├── task.controller.ts
│   │   ├── task.service.ts
│   │   └── task.module.ts
│   ├── common/                 # 공통 모듈
│   │   ├── const/
│   │   │   └── env.const.ts
│   │   └── ...
│   ├── types/                  # 타입 정의
│   ├── main.ts                 # 애플리케이션 진입점
│   └── app.module.ts           # 루트 모듈
├── test/                       # 테스트 파일
├── postgres/                   # PostgreSQL 데이터
└── Dockerfile                  # Docker 설정
```

## 🎯 주요 기능

### 인증 시스템
- Basic Authentication (로그인/회원가입)
- JWT Access Token + HTTP-only Cookie Refresh Token
- 역할 기반 접근 제어 (RBAC)
- 토큰 자동 갱신

### API 모듈
- **사용자 관리**: 회원가입, 프로필 조회/수정
- **팀 관리**: 팀 생성, 멤버 초대, 역할 관리
- **프로젝트 관리**: 프로젝트 생성, 상태 관리, 멤버 할당
- **작업 관리**: 작업 생성, 할당, 상태/우선순위 관리

## 🚀 시작하기

### 환경 설정

1. **의존성 설치**
   ```bash
   npm install
   # 또는
   pnpm install
   ```

2. **환경 변수 설정**
   ```bash
   # .env 파일 생성
   DB_TYPE=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=limboard
   
   ACCESS_TOKEN_SECRET=your-access-token-secret
   REFRESH_TOKEN_SECRET=your-refresh-token-secret
   HASH_ROUNDS=10
   
   ENV=dev
   ```

### 데이터베이스 설정

```bash
# Docker로 PostgreSQL 실행
docker-compose up backend_database

# 또는 로컬 PostgreSQL 설치 후 데이터베이스 생성
createdb limboard
```

### 개발 서버 실행

```bash
# 개발 모드 (watch 모드)
npm run start:dev

# 일반 개발 모드
npm run start

# 프로덕션 모드
npm run start:prod
```

서버는 [http://localhost:3001](http://localhost:3001)에서 실행됩니다.

## 📋 개발 명령어

### 빌드
```bash
# TypeScript 빌드
npm run build
```

### 테스트
```bash
# 단위 테스트
npm run test

# watch 모드로 테스트
npm run test:watch

# 커버리지 포함 테스트
npm run test:cov

# e2e 테스트
npm run test:e2e
```

### 코드 품질
```bash
# ESLint 실행 (자동 수정)
npm run lint

# Prettier 포맷팅
npm run format
```

## 🔌 API 엔드포인트

### 인증 (Auth)
- `POST /auth/login` - 로그인
- `POST /auth/register` - 회원가입  
- `POST /auth/refresh` - 토큰 갱신

### 사용자 (User)
- `GET /user/find` - 사용자 검색
- `GET /user/find/detail` - 사용자 상세 정보
- `PATCH /user/:id` - 사용자 정보 수정
- `DELETE /user/:id` - 사용자 삭제

### 팀 (Team)
- `POST /team` - 팀 생성
- `GET /team` - 내 팀 목록
- `GET /team/:id` - 팀 상세 정보
- `PATCH /team/:id` - 팀 정보 수정
- `POST /team/:id/add-user` - 팀에 사용자 추가
- `DELETE /team/:id/remove-user/:userId` - 팀에서 사용자 제거
- `DELETE /team/:id` - 팀 삭제

### 프로젝트 (Project)
- `POST /project` - 프로젝트 생성
- `GET /project` - 모든 프로젝트 조회
- `GET /project/:id` - 프로젝트 상세 정보
- `PATCH /project/:id/status` - 프로젝트 상태 업데이트
- `POST /project/:id/members` - 프로젝트에 멤버 추가
- `DELETE /project/:id/members/:userId` - 프로젝트에서 멤버 제거
- `DELETE /project/:id` - 프로젝트 삭제

### 작업 (Task)
- `POST /task` - 작업 생성
- `GET /task` - 모든 작업 조회
- `GET /task/:id` - 작업 상세 정보
- `GET /task/project/:projectId` - 프로젝트별 작업 조회
- `GET /task/user/:userId` - 사용자별 작업 조회
- `GET /task/team/:teamId` - 팀별 작업 조회
- `GET /task/my-tasks` - 내 작업 조회 (필터 지원)
- `PATCH /task/:id` - 작업 업데이트
- `DELETE /task/:id` - 작업 삭제

## 🔐 인증 및 권한

### 인증 플로우
1. 사용자가 Basic Authentication으로 로그인
2. 서버에서 Access Token과 Refresh Token 발급
3. Access Token은 응답으로, Refresh Token은 HTTP-only 쿠키로 전송
4. 이후 API 요청시 Bearer Token으로 인증
5. Access Token 만료시 Refresh Token으로 자동 갱신

### 권한 시스템
- **팀 권한**: MEMBER, MANAGER, ADMIN (계층 구조)
- **프로젝트 권한**: MEMBER, ADMIN
- **가드 시스템**: `@Role()`, `@ProjectRole()` 데코레이터 활용

### 데코레이터
- `@Public()`: 인증 없이 접근 가능
- `@Role(TeamRole.admin)`: 특정 팀 역할 필요
- `@ProjectRole(projectRole.admin)`: 특정 프로젝트 역할 필요

## 🗃️ 데이터베이스

### 엔티티 관계
- User ↔ TeamMember ↔ Team (다대다)
- User ↔ ProjectMember ↔ Project (다대다)
- Team → Project (일대다)
- Project → Task (일대다)
- User → Task (다대일, nullable)

### 주요 기능
- UUID 기반 Primary Key
- 자동 생성되는 createdAt, updatedAt
- 연관 엔티티 CASCADE 삭제 지원
- 열거형(Enum) 타입 활용

## 🐳 Docker 지원

```bash
# 개발 환경
docker-compose --profile development up

# 프로덕션 환경  
docker-compose --profile production up
```

## 🧪 테스트

- Jest 기반 단위 테스트
- Supertest 기반 E2E 테스트
- 테스트 커버리지 리포트 지원
- 테스트 환경별 설정 분리

## 🔗 관련 문서

- [NestJS 공식 문서](https://docs.nestjs.com)
- [TypeORM 공식 문서](https://typeorm.io)
- [PostgreSQL 공식 문서](https://postgresql.org/docs)
