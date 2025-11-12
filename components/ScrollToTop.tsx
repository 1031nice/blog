'use client'

import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // 300px 이상 스크롤했을 때만 버튼 표시
      setIsVisible(window.scrollY > 300)
    }

    // 초기 상태 확인
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <button
      onClick={scrollToTop}
      className="lg:hidden fixed bottom-6 right-6 z-50 bg-green-600 dark:bg-green-700 text-white p-3 rounded-full shadow-lg hover:bg-green-700 dark:hover:bg-green-600 transition-all hover:scale-110"
      aria-label="맨 위로 이동"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  )
}

