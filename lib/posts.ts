import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

export interface Post {
  id: string
  title: string
  date: string
  excerpt: string
  content: string
  tags?: string[]
}

const POSTS_DIR = join(process.cwd(), 'content', 'posts')

// Frontmatter 파싱 함수
function parseFrontmatter(content: string): { frontmatter: Record<string, any>, body: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    throw new Error('Invalid frontmatter format')
  }

  const frontmatterText = match[1]
  const body = match[2]

  // YAML 파싱 (간단한 버전)
  const frontmatter: Record<string, any> = {}
  const lines = frontmatterText.split('\n')

  let currentKey = ''
  let currentValue: any = null
  let inArray = false
  let arrayKey = ''

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // 배열 항목 체크
    if (trimmed.startsWith('- ')) {
      const item = trimmed.slice(2).replace(/^"|"$/g, '')
      if (inArray && arrayKey) {
        if (!Array.isArray(frontmatter[arrayKey])) {
          frontmatter[arrayKey] = []
        }
        frontmatter[arrayKey].push(item)
      }
      continue
    }

    // 키-값 쌍
    const colonIndex = trimmed.indexOf(':')
    if (colonIndex > 0) {
      // 이전 배열 종료
      if (inArray && arrayKey) {
        inArray = false
        arrayKey = ''
      }

      const key = trimmed.slice(0, colonIndex).trim()
      const value = trimmed.slice(colonIndex + 1).trim().replace(/^"|"$/g, '')

      if (value === '' || value === '[]') {
        // 배열 시작
        inArray = true
        arrayKey = key
        frontmatter[key] = []
      } else {
        frontmatter[key] = value
        currentKey = key
        currentValue = value
      }
    }
  }

  return { frontmatter, body }
}

// 마크다운 파일을 Post로 변환
function parseMarkdownFile(filePath: string): Post | null {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const { frontmatter, body } = parseFrontmatter(content)

    return {
      id: frontmatter.id || '',
      title: frontmatter.title || '',
      date: frontmatter.date || '',
      excerpt: frontmatter.excerpt || '',
      content: body.trim(),
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : (frontmatter.tags ? [frontmatter.tags] : [])
    }
  } catch (error) {
    console.error(`파일 파싱 오류 ${filePath}:`, error)
    return null
  }
}

// Post를 마크다운 파일 형식으로 변환
function postToMarkdown(post: Post): string {
  const tagsYaml = post.tags && post.tags.length > 0
    ? `tags:\n${post.tags.map(tag => `  - "${tag}"`).join('\n')}`
    : 'tags: []'

  return `---
id: "${post.id}"
title: "${post.title}"
date: "${post.date}"
excerpt: "${post.excerpt}"
${tagsYaml}
---

${post.content}`
}

function readPosts(): Post[] {
  try {
    if (!existsSync(POSTS_DIR)) {
      return []
    }

    const files = readdirSync(POSTS_DIR)
    const posts: Post[] = []

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = join(POSTS_DIR, file)
        const post = parseMarkdownFile(filePath)
        if (post) {
          posts.push(post)
        }
      }
    }

    return posts
  } catch (error) {
    console.error('포스트 읽기 오류:', error)
    return []
  }
}

export function getAllPosts(): Post[] {
  const posts = readPosts()
  return posts.sort((a, b) => {
    // datetime으로 정렬 (ISO 8601 형식 또는 YYYY-MM-DD 형식 모두 처리)
    const aDate = new Date(a.date).getTime()
    const bDate = new Date(b.date).getTime()
    return bDate - aDate // 최신순 (내림차순)
  })
}

export function getPostById(id: string): Post | undefined {
  const posts = getAllPosts()
  return posts.find(post => post.id === id)
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter(post => 
    post.tags && post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tagSet = new Set<string>()
  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => tagSet.add(tag))
    }
  })
  return Array.from(tagSet).sort()
}

export function addPost(post: Post): void {
  const fileName = `${post.id}.md`
  const filePath = join(POSTS_DIR, fileName)
  const markdown = postToMarkdown(post)
  writeFileSync(filePath, markdown, 'utf-8')
}

