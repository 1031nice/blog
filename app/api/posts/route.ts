import { NextRequest, NextResponse } from 'next/server'
import { Post, addPost } from '@/lib/posts'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, excerpt, content, tags } = body

    // 유효성 검사
    if (!title || !content) {
      return NextResponse.json(
        { error: '제목, 내용은 필수입니다.' },
        { status: 400 }
      )
    }

    // 새 포스트 생성
    const newPost: Post = {
      id: Date.now().toString(), // 간단한 ID 생성 (실제로는 UUID 등을 사용하는 것이 좋음)
      title: title.trim(),
      excerpt: excerpt ? excerpt.trim() : undefined,
      content: content.trim(),
      date: new Date().toISOString(), // ISO 8601 형식 (YYYY-MM-DDTHH:mm:ss.sssZ)
      tags: tags && Array.isArray(tags) ? tags : [],
    }

    // Supabase에 저장
    await addPost(newPost)

    return NextResponse.json(
      { id: newPost.id, message: '포스트가 성공적으로 저장되었습니다.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('포스트 저장 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

