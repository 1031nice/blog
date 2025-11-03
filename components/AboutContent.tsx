'use client'

import { useEffect, useState } from 'react'

export default function AboutContent() {
  const [content, setContent] = useState('로딩 중...')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        setContent(data.content || '')
        setLoading(false)
      })
      .catch(err => {
        console.error('About 내용 로드 오류:', err)
        setContent('내용을 불러올 수 없습니다.')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="prose prose-lg dark:prose-invert">
      {content.split('\n').map((paragraph, index) => (
        <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          {paragraph}
        </p>
      ))}
    </div>
  )
}
