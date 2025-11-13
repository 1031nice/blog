import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'

// 개발 환경에서는 Credentials provider도 사용 가능
const isDevelopment = process.env.NODE_ENV === 'development'

const providers = []

// 개발 환경에서만 Credentials provider 추가 (빠른 로컬 개발용)
if (isDevelopment) {
  providers.push(
    Credentials({
      name: 'Development Login',
      credentials: {
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const devPassword = process.env.DEV_PASSWORD || 'dev'
        if (credentials?.password === devPassword) {
          return {
            id: 'dev-user',
            name: 'Development User',
            email: 'dev@localhost',
            image: null,
          }
        }
        return null
      },
    })
  )
}

// GitHub OAuth 활성화 여부 확인
const githubEnabled = process.env.GITHUB_ENABLED !== 'false' && 
                      process.env.GITHUB_CLIENT_ID && 
                      process.env.GITHUB_CLIENT_SECRET

// 프로덕션 또는 GitHub OAuth가 설정되고 활성화된 경우 GitHub provider 추가
if (githubEnabled) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  )
}

// AUTH_SECRET 필수 체크 (더 명확한 에러 메시지)
if (!process.env.AUTH_SECRET) {
  throw new Error(
    'AUTH_SECRET 환경 변수가 설정되지 않았습니다. .env.local 파일에 AUTH_SECRET을 추가하세요.'
  )
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdminPage = nextUrl.pathname.startsWith('/posts/new') || 
                           nextUrl.pathname.includes('/edit') ||
                           nextUrl.pathname.startsWith('/about/edit')
      if (isOnAdminPage) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      return true
    },
  },
})

