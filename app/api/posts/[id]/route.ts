import { NextRequest, NextResponse } from 'next/server'
import { updatePost, getPostById, deletePost } from '@/lib/posts'
import { checkAuth } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Next.js 15에서 params가 Promise일 수 있음
    const resolvedParams = await Promise.resolve(params)
    const id = resolvedParams.id

    // 인증 확인
    if (!checkAuth(request)) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }
    const body = await request.json()
    const { title, excerpt, content, tags } = body

    // 포스트 존재 여부 확인
    const existingPost = await getPostById(id)
    if (!existingPost) {
      return NextResponse.json(
        { error: '포스트를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 유효성 검사
    if (!title || !content) {
      return NextResponse.json(
        { error: '제목, 내용은 필수입니다.' },
        { status: 400 }
      )
    }

    // 포스트 업데이트
    await updatePost(id, {
      title: title.trim(),
      excerpt: excerpt ? excerpt.trim() : undefined,
      content: content.trim(),
      tags: tags && Array.isArray(tags) ? tags : [],
    })

    return NextResponse.json(
      { id, message: '포스트가 성공적으로 수정되었습니다.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('포스트 수정 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Next.js 15에서 params가 Promise일 수 있음
    const resolvedParams = await Promise.resolve(params)
    const id = resolvedParams.id

    // 인증 확인
    if (!checkAuth(request)) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    // 포스트 존재 여부 확인
    const existingPost = await getPostById(id)
    if (!existingPost) {
      return NextResponse.json(
        { error: '포스트를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 포스트 삭제
    await deletePost(id)

    return NextResponse.json(
      { message: '포스트가 성공적으로 삭제되었습니다.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('포스트 삭제 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

