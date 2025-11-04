import { getAllPosts, getPostsByTag, getAllTags } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PostsPageProps {
  searchParams: {
    tag?: string
  }
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const selectedTag = searchParams.tag
  const posts = selectedTag ? await getPostsByTag(selectedTag) : await getAllPosts()
  const allTags = await getAllTags()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          {selectedTag ? `Tag: ${selectedTag}` : 'All Posts'}
        </h1>
        {selectedTag && (
          <Link 
            href="/posts"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← 모든 포스트 보기
          </Link>
        )}
      </div>

      {/* 태그 필터 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={`/posts?tag=${encodeURIComponent(tag)}`}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* 포스트 목록 */}
      <div className="space-y-6">
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
    </div>
  )
}

