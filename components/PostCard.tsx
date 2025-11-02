import Link from 'next/link'
import { Post } from '@/lib/posts'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <Link href={`/posts/${post.id}`}>
        <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {post.title}
        </h2>
      </Link>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
        {new Date(post.date).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
        {post.excerpt}
      </p>
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/posts?tag=${encodeURIComponent(tag)}`}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs rounded transition-colors cursor-pointer"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
      <Link
        href={`/posts/${post.id}`}
        className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
      >
        Read more →
      </Link>
    </article>
  )
}

