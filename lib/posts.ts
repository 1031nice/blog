export interface Post {
  id: string
  title: string
  date: string
  excerpt: string
  content: string
  tags?: string[]
}

// 샘플 블로그 포스트 데이터
export const posts: Post[] = [
  {
    id: '1',
    title: 'Next.js 블로그 만들기',
    date: '2024-01-15',
    excerpt: 'Next.js를 사용하여 개인 블로그를 만드는 과정을 정리했습니다.',
    content: `# Next.js 블로그 만들기

Next.js는 React 기반의 강력한 프레임워크입니다. 이 블로그는 Next.js 14의 App Router를 사용하여 만들어졌습니다.

## 주요 기능

- Server-side rendering
- Static site generation
- 자동 코드 분할
- 이미지 최적화

이제 본격적으로 블로그를 발전시켜 나가보겠습니다!`,
    tags: ['Next.js', 'React', 'Web Development']
  },
  {
    id: '2',
    title: 'TypeScript와 함께하는 개발',
    date: '2024-01-10',
    excerpt: 'TypeScript를 사용하면 더 안전하고 생산적인 개발이 가능합니다.',
    content: `# TypeScript와 함께하는 개발

TypeScript는 JavaScript에 타입 시스템을 추가한 언어입니다.

## 장점

- 타입 안정성
- 더 나은 IDE 지원
- 리팩토링 용이성
- 컴파일 타임 에러 발견

이 블로그 프로젝트도 TypeScript로 작성되어 있습니다.`,
    tags: ['TypeScript', 'Programming']
  },
  {
    id: '3',
    title: 'Tailwind CSS로 빠른 스타일링',
    date: '2024-01-05',
    excerpt: 'Tailwind CSS를 활용하면 빠르고 일관된 디자인을 구현할 수 있습니다.',
    content: `# Tailwind CSS로 빠른 스타일링

Tailwind CSS는 utility-first CSS 프레임워크입니다.

## 특징

- 빠른 개발 속도
- 반응형 디자인 용이
- 커스터마이징 가능
- 작은 번들 크기

이 블로그의 UI도 Tailwind CSS로 만들어졌습니다!`,
    tags: ['CSS', 'Design', 'Tailwind']
  }
]

export function getAllPosts(): Post[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostById(id: string): Post | undefined {
  return posts.find(post => post.id === id)
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter(post => 
    post.tags && post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>()
  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => tagSet.add(tag))
    }
  })
  return Array.from(tagSet).sort()
}

