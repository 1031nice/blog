import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import PostForm from '@/components/PostForm'

export default async function NewPostPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">새 포스트 작성</h1>
      <PostForm />
    </div>
  )
}

