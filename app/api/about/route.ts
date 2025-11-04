import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const DEFAULT_CONTENT = `안녕하세요! 이 블로그에 오신 것을 환영합니다.
여기서는 개발, 기술, 그리고 일상의 생각들을 공유합니다.
Next.js와 TypeScript로 만든 개인 블로그입니다.`

// GET: About 내용 읽기
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('about')
      .select('content')
      .eq('id', 'about')
      .single()

    if (error) {
      // 레코드가 없으면 기본 내용 반환
      if (error.code === 'PGRST116') {
        return NextResponse.json({ content: DEFAULT_CONTENT })
      }
      console.error('About 내용 읽기 오류:', error)
      return NextResponse.json(
        { error: '서버 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ content: data?.content || DEFAULT_CONTENT })
  } catch (error) {
    console.error('About 내용 읽기 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// PUT: About 내용 업데이트
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json(
        { error: '내용은 필수입니다.' },
        { status: 400 }
      )
    }

    // upsert를 사용하여 레코드가 없으면 생성, 있으면 업데이트
    const { error } = await supabase
      .from('about')
      .upsert({
        id: 'about',
        content: content.trim(),
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error('About 내용 업데이트 오류:', error)
      return NextResponse.json(
        { error: '서버 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'About 내용이 성공적으로 업데이트되었습니다.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('About 내용 업데이트 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
