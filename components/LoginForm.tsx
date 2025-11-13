'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

const isDevelopment = process.env.NODE_ENV === 'development'

interface LoginFormProps {
  githubEnabled?: boolean
}

export default function LoginForm({ githubEnabled = false }: LoginFormProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGitHubSignIn = () => {
    signIn('github', { callbackUrl: '/posts/new' })
  }

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        password,
        redirect: false,
        callbackUrl: '/posts/new',
      })

      if (result?.error) {
        setError('비밀번호가 올바르지 않습니다.')
        setIsSubmitting(false)
      } else if (result?.ok) {
        window.location.href = '/posts/new'
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">관리자 로그인</h1>
        
        <div className="space-y-6">
          {/* 개발 환경: 빠른 로컬 로그인 */}
          {isDevelopment && (
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                개발 모드: 빠른 로그인 (비밀번호: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">dev</code>)
              </p>
              <form onSubmit={handleDevLogin} className="space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="개발 비밀번호"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? '로그인 중...' : '개발 로그인'}
                </button>
              </form>
            </div>
          )}

          {/* GitHub OAuth 로그인 */}
          {githubEnabled && (
            <div>
              {isDevelopment && (
                <p className="text-center text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  또는 GitHub 계정으로 로그인
                </p>
              )}
              {!isDevelopment && (
                <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                  GitHub 계정으로 로그인하세요
                </p>
              )}
              <button
                onClick={handleGitHubSignIn}
                className="w-full px-6 py-3 bg-gray-900 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
                GitHub로 로그인
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

