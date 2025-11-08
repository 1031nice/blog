import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  tag?: string
}

export default function Pagination({ currentPage, totalPages, tag }: PaginationProps) {
  // 안전성 체크
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages))
  const safeTotalPages = Math.max(1, totalPages)

  // URL 파라미터를 유지하면서 페이지 링크 생성
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams()
    if (page > 1) {
      params.set('page', page.toString())
    }
    if (tag) {
      params.set('tag', tag)
    }
    const queryString = params.toString()
    return `/posts${queryString ? `?${queryString}` : ''}`
  }

  if (safeTotalPages <= 1) {
    return null
  }

  const pages = []
  const maxVisible = 5 // 보여줄 최대 페이지 번호 개수
  
  let startPage = Math.max(1, safeCurrentPage - Math.floor(maxVisible / 2))
  let endPage = Math.min(safeTotalPages, startPage + maxVisible - 1)
  
  // 끝쪽에 있을 때 시작점 조정
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* 이전 버튼 */}
      {safeCurrentPage > 1 ? (
        <Link
          href={createPageUrl(safeCurrentPage - 1)}
          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
        >
          이전
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-400 dark:text-gray-600 cursor-not-allowed">
          이전
        </span>
      )}

      {/* 첫 페이지 */}
      {startPage > 1 && (
        <>
          <Link
            href={createPageUrl(1)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
          >
            1
          </Link>
          {startPage > 2 && (
            <span className="px-2 text-gray-400 dark:text-gray-600">...</span>
          )}
        </>
      )}

      {/* 페이지 번호들 */}
      {pages.map((page) => (
        <Link
          key={page}
          href={createPageUrl(page)}
          className={`px-3 py-2 text-sm border rounded-md transition-colors ${
            page === safeCurrentPage
              ? 'bg-green-600 dark:bg-green-700 text-white border-green-600 dark:border-green-700'
              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {page}
        </Link>
      ))}

      {/* 마지막 페이지 */}
      {endPage < safeTotalPages && (
        <>
          {endPage < safeTotalPages - 1 && (
            <span className="px-2 text-gray-400 dark:text-gray-600">...</span>
          )}
          <Link
            href={createPageUrl(safeTotalPages)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
          >
            {safeTotalPages}
          </Link>
        </>
      )}

      {/* 다음 버튼 */}
      {safeCurrentPage < safeTotalPages ? (
        <Link
          href={createPageUrl(safeCurrentPage + 1)}
          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
        >
          다음
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-400 dark:text-gray-600 cursor-not-allowed">
          다음
        </span>
      )}
    </div>
  )
}

