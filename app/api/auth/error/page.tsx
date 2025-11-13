'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  let errorMessage = '로그인에 실패했습니다.'
  let errorDescription = '알 수 없는 오류가 발생했습니다.'

  if (error === 'AccessDenied') {
    errorMessage = '접근 권한이 없습니다'
    errorDescription = '이 계정은 관리자 권한이 없습니다. 관리자에게 문의하세요.'
  } else if (error === 'Configuration') {
    errorMessage = '서버 설정 오류'
    errorDescription = '인증 설정에 문제가 있습니다. 관리자에게 문의하세요.'
  } else if (error === 'Verification') {
    errorMessage = '인증 실패'
    errorDescription = '인증 과정에서 오류가 발생했습니다. 다시 시도해주세요.'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-800">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {errorMessage}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {errorDescription}
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full px-4 py-2 bg-gray-900 dark:bg-gray-800 text-white text-center rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/login"
            className="block w-full px-4 py-2 bg-green-600 dark:bg-green-700 text-white text-center rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
          >
            다시 로그인하기
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-800">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 w-12 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}

