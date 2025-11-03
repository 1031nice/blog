import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const ABOUT_FILE = join(process.cwd(), 'content', 'about.txt')

// GET: About 내용 읽기
export async function GET() {
  try {
    if (!existsSync(ABOUT_FILE)) {
      // 파일이 없으면 기본 내용 반환
      const defaultContent = `안녕하세요! 이 블로그에 오신 것을 환영합니다.
여기서는 개발, 기술, 그리고 일상의 생각들을 공유합니다.
Next.js와 TypeScript로 만든 개인 블로그입니다.`
      return NextResponse.json({ content: defaultContent })
    }

    const content = readFileSync(ABOUT_FILE, 'utf-8')
    return NextResponse.json({ content })
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

    writeFileSync(ABOUT_FILE, content.trim(), 'utf-8')

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
