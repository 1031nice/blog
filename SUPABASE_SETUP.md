# Supabase 설정 가이드

이 프로젝트는 Supabase를 데이터베이스로 사용합니다. 아래 단계를 따라 설정하세요.

## 1. Supabase 프로젝트 생성

1. [Supabase 웹사이트](https://supabase.com)에 접속
2. "Start your project" 클릭 후 GitHub 계정으로 로그인
3. "New Project" 클릭
4. 프로젝트 정보 입력:
   - **Name**: 원하는 프로젝트 이름 (예: `my-blog`)
   - **Database Password**: 강력한 비밀번호 설정 (나중에 필요하니 저장해두세요)
   - **Region**: 가장 가까운 리전 선택
5. "Create new project" 클릭 (프로젝트 생성에 몇 분 소요됩니다)

## 2. 데이터베이스 스키마 생성

1. Supabase 대시보드에서 왼쪽 메뉴의 **SQL Editor** 클릭
2. "New query" 클릭
3. 프로젝트 루트의 `supabase-schema.sql` 파일 내용을 복사하여 붙여넣기
4. "Run" 버튼 클릭하여 스키마 생성

## 3. 환경 변수 설정

### 로컬 개발 환경

1. 프로젝트 루트에 `.env.local` 파일 생성 (이미 있다면 열기)

2. Supabase 대시보드에서:
   - 왼쪽 메뉴의 **Settings** → **API** 클릭
   - 다음 정보를 확인:
     - **Project URL** (예: `https://xxxxx.supabase.co`)
     - **anon public** 키 (API Keys 섹션)

3. `.env.local` 파일에 다음 내용 추가:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

예시:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Vercel 배포 환경

1. Vercel 대시보드에서 프로젝트 선택
2. **Settings** → **Environment Variables** 클릭
3. 다음 환경 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon 키
4. 각 환경(Production, Preview, Development)에 대해 추가
5. 변경사항 저장 후 재배포

## 4. 보안 설정 확인

현재 스키마는 모든 사용자가 읽고 쓸 수 있도록 설정되어 있습니다 (개발용).
프로덕션 환경에서는 인증을 추가하는 것이 좋습니다.

### 인증 추가 (선택사항)

1. Supabase 대시보드 → **Authentication** → **Policies**
2. 각 테이블에 대해 인증된 사용자만 접근 가능하도록 정책 수정
3. 또는 Supabase의 **Service Role Key**를 사용하여 서버 사이드에서만 쓰기 작업 수행

## 5. 테스트

1. 개발 서버 실행:
   ```bash
   npm run dev
   ```

2. 브라우저에서 `http://localhost:3000` 접속
3. 새 포스트 작성 테스트
4. About 페이지 수정 테스트

## 문제 해결

### "Missing Supabase environment variables" 오류
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 환경 변수 이름이 정확한지 확인 (`NEXT_PUBLIC_` 접두사 필요)
- 개발 서버를 재시작했는지 확인

### 데이터베이스 연결 오류
- Supabase 프로젝트가 활성화되어 있는지 확인
- 네트워크 연결 확인
- Supabase 대시보드에서 프로젝트 상태 확인

### RLS (Row Level Security) 오류
- Supabase 대시보드 → **Authentication** → **Policies**에서 정책 확인
- 스키마 SQL이 정상적으로 실행되었는지 확인

