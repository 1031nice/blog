import { NextRequest } from 'next/server'

// 인증 확인 헬퍼 함수
export function checkAuth(request: NextRequest): boolean {
  const authenticated = request.cookies.get('authenticated')?.value === 'true'
  return authenticated
}

