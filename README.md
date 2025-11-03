# My Blog

Next.js 기반 개인 블로그 프로젝트입니다.

## 기술 스택

- **Next.js 14** - React 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 스타일링

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
blog/
├── app/              # Next.js App Router
│   ├── layout.tsx    # 루트 레이아웃
│   ├── page.tsx      # 홈 페이지
│   └── globals.css   # 전역 스타일
├── components/       # 재사용 가능한 컴포넌트
├── lib/              # 유틸리티 함수 및 헬퍼
├── content/          # 블로그 포스트 콘텐츠
├── public/           # 정적 파일
└── package.json
```

