import { NextRequest } from 'next/server'
import { auth } from '@/auth'

// 인증 확인 헬퍼 함수 (NextAuth 세션 기반)
export async function checkAuth(request: NextRequest): Promise<boolean> {
  const session = await auth()
  return !!session?.user
}

