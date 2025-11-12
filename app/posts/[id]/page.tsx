import { getPostById } from '@/lib/posts'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DeletePostButton from '@/components/DeletePostButton'
import TableOfContents from '@/components/TableOfContents'
import ScrollToTop from '@/components/ScrollToTop'
import { extractHeadings, generateId } from '@/lib/toc'

export const dynamic = 'force-dynamic'

interface PostPageProps {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostById(params.id)

  if (!post) {
    notFound()
  }

  const headings = extractHeadings(post.content)
  const hasToc = headings.length > 0

  const renderContent = () => {
    const idCounts: Record<string, number> = {}
    return post.content.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('# ')) {
        const text = paragraph.slice(2).trim()
        let id = generateId(text)
        if (idCounts[id]) {
          idCounts[id]++
          id = `${id}-${idCounts[id]}`
        } else {
          idCounts[id] = 1
        }
        return (
          <h1 
            key={index} 
            id={id}
            className="text-3xl font-bold mt-8 mb-4 scroll-mt-20"
          >
            {text}
          </h1>
        )
      }
      if (paragraph.startsWith('## ')) {
        const text = paragraph.slice(3).trim()
        let id = generateId(text)
        if (idCounts[id]) {
          idCounts[id]++
          id = `${id}-${idCounts[id]}`
        } else {
          idCounts[id] = 1
        }
        return (
          <h2 
            key={index} 
            id={id}
            className="text-2xl font-bold mt-6 mb-3 scroll-mt-20"
          >
            {text}
          </h2>
        )
      }
      if (paragraph.startsWith('### ')) {
        const text = paragraph.slice(4).trim()
        let id = generateId(text)
        if (idCounts[id]) {
          idCounts[id]++
          id = `${id}-${idCounts[id]}`
        } else {
          idCounts[id] = 1
        }
        return (
          <h3 
            key={index} 
            id={id}
            className="text-xl font-bold mt-4 mb-2 scroll-mt-20"
          >
            {text}
          </h3>
        )
      }
      if (paragraph.startsWith('#### ')) {
        const text = paragraph.slice(5).trim()
        let id = generateId(text)
        if (idCounts[id]) {
          idCounts[id]++
          id = `${id}-${idCounts[id]}`
        } else {
          idCounts[id] = 1
        }
        return (
          <h4 
            key={index} 
            id={id}
            className="text-lg font-bold mt-4 mb-2 scroll-mt-20"
          >
            {text}
          </h4>
        )
      }
      if (paragraph.startsWith('##### ')) {
        const text = paragraph.slice(6).trim()
        let id = generateId(text)
        if (idCounts[id]) {
          idCounts[id]++
          id = `${id}-${idCounts[id]}`
        } else {
          idCounts[id] = 1
        }
        return (
          <h5 
            key={index} 
            id={id}
            className="text-base font-bold mt-4 mb-2 scroll-mt-20"
          >
            {text}
          </h5>
        )
      }
      if (paragraph.startsWith('###### ')) {
        const text = paragraph.slice(7).trim()
        let id = generateId(text)
        if (idCounts[id]) {
          idCounts[id]++
          id = `${id}-${idCounts[id]}`
        } else {
          idCounts[id] = 1
        }
        return (
          <h6 
            key={index} 
            id={id}
            className="text-sm font-bold mt-4 mb-2 scroll-mt-20"
          >
            {text}
          </h6>
        )
      }
      if (paragraph.startsWith('- ')) {
        return <li key={index} className="ml-6 mb-2">{paragraph.slice(2)}</li>
      }
      if (paragraph.trim() === '') {
        return <br key={index} />
      }
      return <p key={index} className="mb-4">{paragraph}</p>
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex gap-8 items-start">
        {hasToc && (
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-24 self-start">
            <TableOfContents items={headings} />
          </aside>
        )}
        
        <div className="flex-1 flex justify-center min-w-0">
          <article className="w-full max-w-3xl">
            {hasToc && (
              <div className="lg:hidden mb-6">
                <TableOfContents items={headings} />
              </div>
            )}
            
            <Link 
              href="/posts"
              className="inline-block mb-6 text-green-600 dark:text-green-400 hover:underline"
            >
              ← Back to Posts
            </Link>
            
            <header className="mb-8 relative">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <h1 className="text-4xl font-bold flex-1 text-gray-900 dark:text-gray-100">{post.title}</h1>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/posts/${post.id}/edit`}
                  className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  수정
                </Link>
                <DeletePostButton postId={post.id} postTitle={post.title} />
              </div>
            </div>
            <div className="text-gray-600 dark:text-gray-400 space-y-1">
              <p>
                작성일: {new Date(post.date).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              {post.updatedAt && (
                <p className="text-sm">
                  수정일: {new Date(post.updatedAt).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/posts?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 text-sm rounded transition-colors cursor-pointer"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                {renderContent()}
              </div>
            </div>
          </article>
        </div>
      </div>
      <ScrollToTop />
    </div>
  )
}
