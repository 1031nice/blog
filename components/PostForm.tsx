'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Post } from '@/lib/posts'

interface PostFormProps {
  postId?: string
  initialData?: Post
}

export default function PostForm({ postId, initialData }: PostFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingExcerpt, setIsGeneratingExcerpt] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditMode = !!postId
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    tags: initialData?.tags?.join(', ') || ''
  })

  // initialData가 변경되면 폼 데이터 업데이트
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        excerpt: initialData.excerpt || '',
        content: initialData.content || '',
        tags: initialData.tags?.join(', ') || ''
      })
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const url = isEditMode ? `/api/posts/${postId}` : '/api/posts'
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 포함
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          tags: tagsArray,
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('인증이 필요합니다. 페이지를 새로고침하고 다시 로그인해주세요.')
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || (isEditMode ? '포스트 수정에 실패했습니다.' : '포스트 저장에 실패했습니다.'))
      }

      const data = await response.json()
      // 완전 새로고침하여 최신 데이터 로드
      router.push(`/posts/${isEditMode ? postId : data.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleGenerateExcerpt = async () => {
    // 제목과 본문이 없으면 요약 생성 불가
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('제목과 본문을 먼저 입력해주세요.')
      return
    }

    setIsGeneratingExcerpt(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-excerpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || '요약 생성에 실패했습니다.')
      }

      const data = await response.json()
      setFormData(prev => ({
        ...prev,
        excerpt: data.excerpt,
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : '요약 생성 중 오류가 발생했습니다.')
    } finally {
      setIsGeneratingExcerpt(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:border-green-600 transition-colors"
          placeholder="포스트 제목을 입력하세요"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
            요약
          </label>
          <button
            type="button"
            onClick={handleGenerateExcerpt}
            disabled={isGeneratingExcerpt || !formData.title.trim() || !formData.content.trim()}
            className="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-600 dark:hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none flex items-center gap-2"
            title={!formData.title.trim() || !formData.content.trim() ? '제목과 본문을 먼저 입력해주세요' : 'AI로 요약 자동 생성'}
          >
            {isGeneratingExcerpt ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>생성 중...</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>AI로 생성</span>
              </>
            )}
          </button>
        </div>
        <textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:border-green-600 transition-colors"
          placeholder="포스트 요약을 입력하세요 (선택사항) 또는 'AI로 생성' 버튼을 클릭하여 자동 생성"
        />
        {formData.excerpt && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            요약이 생성되었습니다. 필요시 수정하세요.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
          내용 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          required
          value={formData.content}
          onChange={handleChange}
          rows={15}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:border-green-600 font-mono text-sm transition-colors"
          placeholder="포스트 내용을 입력하세요 (마크다운 형식 가능)"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
          태그
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:border-green-600 transition-colors"
          placeholder="태그를 쉼표로 구분하세요 (예: Next.js, React, Web Development)"
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          쉼표(,)로 태그를 구분하세요
        </p>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (isEditMode ? '수정 중...' : '저장 중...') : (isEditMode ? '포스트 수정' : '포스트 저장')}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  )
}

