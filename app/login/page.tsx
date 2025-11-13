import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  // 서버에서 GitHub OAuth 활성화 여부 확인
  const githubEnabled = 
    process.env.GITHUB_ENABLED !== 'false' && 
    !!process.env.GITHUB_CLIENT_ID && 
    !!process.env.GITHUB_CLIENT_SECRET

  return <LoginForm githubEnabled={githubEnabled} />
}

