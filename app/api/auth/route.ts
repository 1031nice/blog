import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth'

// 로그인 (비밀번호 확인 및 쿠키 설정)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    const correctPassword = process.env.ADMIN_PASSWORD

    if (!correctPassword) {
      return NextResponse.json(
        { error: '서버 설정 오류: 비밀번호가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    if (password === correctPassword) {
      const response = NextResponse.json(
        { success: true, message: '인증에 성공했습니다.' },
        { status: 200 }
      )

      // 쿠키 설정 (30일 유효)
      response.cookies.set('authenticated', 'true', {
        httpOnly: true, // JavaScript로 접근 불가 (보안)
        secure: process.env.NODE_ENV === 'production', // HTTPS만 (프로덕션)
        sameSite: 'strict', // CSRF 방지
        maxAge: 60 * 60 * 24 * 30, // 30일
        path: '/',
      })

      return response
    } else {
      return NextResponse.json(
        { error: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('로그인 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 인증 상태 확인
export async function GET(request: NextRequest) {
  const authenticated = checkAuth(request)
  return NextResponse.json({ authenticated }, { status: 200 })
}

// 로그아웃
export async function DELETE(request: NextRequest) {
  const response = NextResponse.json(
    { success: true, message: '로그아웃되었습니다.' },
    { status: 200 }
  )

  // 쿠키 삭제
  response.cookies.delete('authenticated')

  return response
}

