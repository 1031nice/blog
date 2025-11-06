-- Posts 테이블 생성
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  excerpt TEXT,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About 테이블 생성 (단일 행만 저장)
CREATE TABLE IF NOT EXISTS about (
  id TEXT PRIMARY KEY DEFAULT 'about',
  content TEXT NOT NULL DEFAULT '안녕하세요! 이 블로그에 오신 것을 환영합니다.
여기서는 개발, 기술, 그리고 일상의 생각들을 공유합니다.
Next.js와 TypeScript로 만든 개인 블로그입니다.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);

-- RLS (Row Level Security) 설정 - 모든 사용자가 읽고 쓸 수 있도록 설정
-- 프로덕션에서는 인증 추가 권장
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽을 수 있도록 정책 추가
CREATE POLICY "Allow public read access on posts" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on about" ON about
  FOR SELECT USING (true);

-- 모든 사용자가 쓰고 수정, 삭제할 수 있도록 정책 추가 (개발용)
-- 프로덕션에서는 인증된 사용자만 허용하도록 변경 필요
CREATE POLICY "Allow public insert access on posts" ON posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on posts" ON posts
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access on posts" ON posts
  FOR DELETE USING (true);

CREATE POLICY "Allow public insert access on about" ON about
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on about" ON about
  FOR UPDATE USING (true);

