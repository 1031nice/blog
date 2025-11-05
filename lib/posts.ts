import { supabase } from './supabase'

export interface Post {
  id: string
  title: string
  date: string
  excerpt?: string
  content: string
  tags?: string[]
  updatedAt?: string
}

// 데이터베이스 스키마 타입
interface DatabasePost {
  id: string
  title: string
  date: string
  excerpt: string | null
  content: string
  tags: string[] | null
  updated_at: string | null
}

// 데이터베이스 결과를 Post 인터페이스로 변환
function dbPostToPost(dbPost: DatabasePost): Post {
  return {
    id: dbPost.id,
    title: dbPost.title,
    date: dbPost.date,
    excerpt: dbPost.excerpt || undefined,
    content: dbPost.content,
    tags: dbPost.tags || [],
    updatedAt: dbPost.updated_at || undefined,
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('포스트 읽기 오류:', error)
      return []
    }

    return (data || []).map(dbPostToPost)
  } catch (error) {
    console.error('포스트 읽기 오류:', error)
    return []
  }
}

export async function getPostById(id: string): Promise<Post | undefined> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('포스트 읽기 오류:', error)
      return undefined
    }

    return data ? dbPostToPost(data) : undefined
  } catch (error) {
    console.error('포스트 읽기 오류:', error)
    return undefined
  }
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .contains('tags', [tag])
      .order('date', { ascending: false })

    if (error) {
      console.error('포스트 읽기 오류:', error)
      return []
    }

    // 대소문자 구분 없이 필터링 (Supabase는 대소문자 구분)
    const posts = (data || []).map(dbPostToPost)
    return posts.filter(post =>
      post.tags && post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    )
  } catch (error) {
    console.error('포스트 읽기 오류:', error)
    return []
  }
}

export async function getAllTags(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('tags')

    if (error) {
      console.error('태그 읽기 오류:', error)
      return []
    }

    const tagSet = new Set<string>()
    ;(data || []).forEach((post: { tags: string[] | null }) => {
      if (post.tags) {
        post.tags.forEach(tag => tagSet.add(tag))
      }
    })

    return Array.from(tagSet).sort()
  } catch (error) {
    console.error('태그 읽기 오류:', error)
    return []
  }
}

export async function addPost(post: Post): Promise<void> {
  try {
    const { error } = await supabase
      .from('posts')
      .insert({
        id: post.id,
        title: post.title,
        date: post.date,
        excerpt: post.excerpt || null,
        content: post.content,
        tags: post.tags || [],
      })

    if (error) {
      console.error('포스트 저장 오류:', error)
      throw new Error(`Failed to save post: ${error.message}`)
    }
  } catch (error) {
    console.error('포스트 저장 오류:', error)
    throw error
  }
}

export async function updatePost(id: string, updatedPost: Partial<Post>): Promise<void> {
  try {
    // 기존 포스트 확인
    const existingPost = await getPostById(id)
    if (!existingPost) {
      throw new Error(`Post with id ${id} not found`)
    }

    const { error } = await supabase
      .from('posts')
      .update({
        title: updatedPost.title ?? existingPost.title,
        excerpt: updatedPost.excerpt !== undefined ? (updatedPost.excerpt || null) : existingPost.excerpt || null,
        content: updatedPost.content ?? existingPost.content,
        tags: updatedPost.tags || existingPost.tags || [],
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('포스트 수정 오류:', error)
      throw new Error(`Failed to update post: ${error.message}`)
    }
  } catch (error) {
    console.error('포스트 수정 오류:', error)
    throw error
  }
}
