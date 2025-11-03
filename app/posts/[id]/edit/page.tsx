import { getPostById } from '@/lib/posts'
import { notFound } from 'next/navigation'
import PostForm from '@/components/PostForm'

export const dynamic = 'force-dynamic'

interface EditPostPageProps {
  params: {
    id: string
  }
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const post = getPostById(params.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">포스트 수정</h1>
      <PostForm postId={post.id} initialData={post} />
    </div>
  )
}

