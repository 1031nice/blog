import { getAllPosts, getPostsByTag, getAllTags } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PostsPageProps {
  searchParams: {
    tag?: string
    page?: string
  }
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const selectedTag = searchParams.tag
  const currentPage = parseInt(searchParams.page || '1', 10)
  const pageSize = 5

  // 태그 필터가 있으면 페이징 없이 모든 포스트 가져온 후 클라이언트 사이드 페이징
  const { posts, total, totalPages } = selectedTag 
    ? await (async () => {
        const allPosts = await getPostsByTag(selectedTag)
        const totalPosts = allPosts.length
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        return {
          posts: allPosts.slice(start, end),
          total: totalPosts,
          totalPages: Math.ceil(totalPosts / pageSize)
        }
      })()
    : await getAllPosts(currentPage, pageSize)

  const allTags = await getAllTags()

  // 페이지네이션 URL 생성
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams()
    if (selectedTag) params.set('tag', selectedTag)
    if (page > 1) params.set('page', page.toString())
    return `/posts${params.toString() ? `?${params.toString()}` : ''}`
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {selectedTag ? `Tag: ${selectedTag}` : 'All Posts'}
        </h1>
        {selectedTag && (
          <Link 
            href="/posts"
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            ← 모든 포스트 보기
          </Link>
        )}
      </div>

      {/* 태그 필터 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const tagParams = new URLSearchParams()
            tagParams.set('tag', tag)
            return (
              <Link
                key={tag}
                href={`/posts?${tagParams.toString()}`}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedTag === tag
                    ? 'bg-green-600 dark:bg-green-700 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400'
                }`}
              >
                {tag}
              </Link>
            )
          })}
        </div>
      </div>

      {/* 포스트 목록 */}
      <div className="space-y-6 mb-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            {selectedTag ? `"${selectedTag}" 태그가 붙은 포스트가 없습니다.` : '아직 작성된 포스트가 없습니다.'}
          </p>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {/* 이전 페이지 */}
          {currentPage > 1 ? (
            <Link
              href={getPageUrl(currentPage - 1)}
              className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            >
              이전
            </Link>
          ) : (
            <span className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md opacity-50 cursor-not-allowed text-gray-500 dark:text-gray-500">
              이전
            </span>
          )}

          {/* 페이지 번호 */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
            // 첫 페이지, 마지막 페이지, 현재 페이지 주변만 표시
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
            ) {
              return (
                <Link
                  key={pageNum}
                  href={getPageUrl(pageNum)}
                  className={`px-4 py-2 text-sm border rounded-md transition-colors ${
                    pageNum === currentPage
                      ? 'bg-green-600 dark:bg-green-700 text-white border-green-600 dark:border-green-700'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {pageNum}
                </Link>
              )
            } else if (
              pageNum === currentPage - 2 ||
              pageNum === currentPage + 2
            ) {
              return (
                <span key={pageNum} className="px-2 text-gray-500 dark:text-gray-400">
                  ...
                </span>
              )
            }
            return null
          })}

          {/* 다음 페이지 */}
          {currentPage < totalPages ? (
            <Link
              href={getPageUrl(currentPage + 1)}
              className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            >
              다음
            </Link>
          ) : (
            <span className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md opacity-50 cursor-not-allowed text-gray-500 dark:text-gray-500">
              다음
            </span>
          )}
        </div>
      )}

      {/* 페이지 정보 */}
      {total > 0 && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          <p>
            {total}개 중 {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, total)}개 표시
          </p>
        </div>
      )}
    </div>
  )
}

