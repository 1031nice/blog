import Link from 'next/link'
import { Post } from '@/lib/posts'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-white dark:bg-gray-900/50 hover:shadow-lg hover:border-green-500/50 dark:hover:border-green-600/50 transition-all">
      <Link href={`/posts/${post.id}`}>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400 transition-colors">
          {post.title}
        </h2>
      </Link>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
        {new Date(post.date).toLocaleString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
      {post.excerpt && (
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
          {post.excerpt}
        </p>
      )}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/posts?tag=${encodeURIComponent(tag)}`}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 text-xs rounded transition-colors cursor-pointer"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
      <Link
        href={`/posts/${post.id}`}
        className="inline-block mt-4 text-green-600 dark:text-green-400 hover:underline font-medium"
      >
        Read more →
      </Link>
    </article>
  )
}

