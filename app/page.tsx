import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import Link from 'next/link'

export default function Home() {
  const posts = getAllPosts().slice(0, 3) // 최신 3개만 표시

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="mb-12">
        <h1 className="text-5xl font-bold mb-4">Welcome to My Blog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          개발과 일상의 이야기를 공유하는 공간입니다.
        </p>
        <Link
          href="/posts"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          모든 포스트 보기
        </Link>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Latest Posts</h2>
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">아직 작성된 포스트가 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  )
}

