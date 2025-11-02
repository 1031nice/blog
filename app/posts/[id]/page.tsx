import { getPostById } from '@/lib/posts'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PostPageProps {
  params: {
    id: string
  }
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostById(params.id)

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        href="/posts"
        className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline"
      >
        ← Back to Posts
      </Link>
      
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {new Date(post.date).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/posts?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm rounded transition-colors cursor-pointer"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
          {post.content.split('\n').map((paragraph, index) => {
            if (paragraph.startsWith('# ')) {
              return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h1>
            }
            if (paragraph.startsWith('## ')) {
              return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{paragraph.slice(3)}</h2>
            }
            if (paragraph.startsWith('### ')) {
              return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{paragraph.slice(4)}</h3>
            }
            if (paragraph.startsWith('- ')) {
              return <li key={index} className="ml-6 mb-2">{paragraph.slice(2)}</li>
            }
            if (paragraph.trim() === '') {
              return <br key={index} />
            }
            return <p key={index} className="mb-4">{paragraph}</p>
          })}
        </div>
      </div>
    </article>
  )
}

