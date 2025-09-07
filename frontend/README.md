# limBoard 프론트엔드

팀 협업과 프로젝트 관리를 위한 웹 애플리케이션의 프론트엔드입니다.

## 🚀 기술 스택

- **Next.js 15** - React 19, App Router, Turbopack
- **TypeScript** - 정적 타입 검사
- **TailwindCSS** - 유틸리티 기반 스타일링  
- **Radix UI** - 접근성 우선 컴포넌트 라이브러리
- **Lucide React** - 아이콘 라이브러리

## 📁 프로젝트 구조

```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth-layout)/           # 인증 레이아웃 그룹
│   │   ├── login/              # 로그인 페이지
│   │   └── register/           # 회원가입 페이지
│   ├── (dashboard-layout)/      # 대시보드 레이아웃 그룹
│   │   ├── dashboard/          # 대시보드
│   │   ├── teams/              # 팀 관리
│   │   ├── projects/           # 프로젝트 관리
│   │   ├── tasks/              # 작업 관리
│   │   └── settings/           # 설정
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 홈 페이지
│   └── globals.css             # 글로벌 스타일
├── api/                        # API 호출 함수들
│   ├── common/                 # 공통 유틸리티
│   ├── auth/                   # 인증 API
│   ├── user/                   # 사용자 API
│   ├── team/                   # 팀 API
│   ├── project/                # 프로젝트 API
│   ├── task/                   # 작업 API
│   └── index.ts                # API 통합 export
├── components/                 # UI 컴포넌트
├── type/                       # TypeScript 타입 정의
│   ├── auth.type.ts           # 인증 관련 타입
│   ├── user.type.ts           # 사용자 타입
│   ├── team.type.ts           # 팀 타입
│   ├── project.type.ts        # 프로젝트 타입
│   └── task.type.ts           # 작업 타입
└── tailwind.config.ts         # TailwindCSS 설정
```

## 🎯 주요 기능

- **인증 시스템**: 로그인/회원가입, JWT 토큰 관리
- **팀 관리**: 팀 생성, 멤버 초대, 역할 관리
- **프로젝트 관리**: 프로젝트 생성, 상태 추적, 멤버 할당
- **작업 관리**: 작업 생성, 할당, 우선순위 설정, 상태 업데이트
- **반응형 디자인**: 모바일과 데스크톱 모두 지원

## 🚀 시작하기

### 환경 설정

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **환경 변수 설정**
   ```bash
   # .env.local 파일 생성
   NEXT_PUBLIC_API_URL=localhost:3001
   ```

### 개발 서버 실행

```bash
# 개발 서버 시작 (Turbopack 사용)
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인할 수 있습니다.

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 코드 품질 검사
npm run lint
```

## 🔌 API 연동

백엔드 API와의 통신을 위해 `api/` 폴더에 구조화된 API 호출 함수들이 준비되어 있습니다.

### API 사용 예시

```typescript
import { login, createTeam, getMyTasks } from '@/api';

// 로그인
const loginResult = await login({ email: 'user@example.com', password: 'password' });

// 팀 생성
const teamResult = await createTeam({ name: '개발팀', description: '백엔드 개발팀' });

// 내 작업 조회
const tasksResult = await getMyTasks({ status: 'TODO' });
```

## 🎨 스타일링

### TailwindCSS
- 유틸리티 기반 CSS 프레임워크 사용
- 반응형 디자인을 위한 브레이크포인트 활용
- 다크 모드 지원 (추후 구현 예정)

### Radix UI
- 접근성을 고려한 헤드리스 컴포넌트
- 키보드 내비게이션 지원
- 스크린 리더 호환성

## 📱 라우팅 구조

### 레이아웃 그룹
- **(auth-layout)**: 인증이 필요 없는 페이지들
- **(dashboard-layout)**: 인증이 필요한 메인 애플리케이션 페이지들

### 주요 경로
- `/` - 홈/랜딩 페이지
- `/login` - 로그인
- `/register` - 회원가입
- `/dashboard` - 대시보드
- `/teams` - 팀 관리
- `/projects` - 프로젝트 관리
- `/tasks` - 작업 관리
- `/settings` - 설정

## 🔐 인증 흐름

1. 사용자 로그인 → Access Token 발급
2. Access Token을 sessionStorage에 저장
3. Refresh Token은 HTTP-only 쿠키로 관리
4. API 요청 시 자동으로 Authorization 헤더 추가
5. 토큰 만료 시 자동 갱신

## 🧪 개발 가이드

### 새로운 페이지 추가
1. `app/` 디렉토리에 새 폴더 생성
2. `page.tsx` 파일 추가
3. 필요시 `layout.tsx`로 레이아웃 커스터마이징

### 새로운 API 추가
1. `api/` 디렉토리의 해당 도메인 파일에 함수 추가
2. TypeScript 인터페이스 정의
3. `api/index.ts`에서 export

### 컴포넌트 작성
- 재사용 가능한 컴포넌트는 `components/` 에 배치
- TypeScript 인터페이스를 활용한 타입 안전성 확보
- Radix UI 컴포넌트 기반으로 확장

## 🔗 관련 문서

- [Next.js 공식 문서](https://nextjs.org/docs)
- [TailwindCSS 공식 문서](https://tailwindcss.com/docs)
- [Radix UI 공식 문서](https://www.radix-ui.com/docs)
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs)
