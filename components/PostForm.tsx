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
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          tags: tagsArray,
        }),
      })

      if (!response.ok) {
        throw new Error(isEditMode ? '포스트 수정에 실패했습니다.' : '포스트 저장에 실패했습니다.')
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="포스트 제목을 입력하세요"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
          요약
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="포스트 요약을 입력하세요 (선택사항)"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          내용 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          required
          value={formData.content}
          onChange={handleChange}
          rows={15}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          placeholder="포스트 내용을 입력하세요 (마크다운 형식 가능)"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-2">
          태그
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (isEditMode ? '수정 중...' : '저장 중...') : (isEditMode ? '포스트 수정' : '포스트 저장')}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  )
}

