import { cookies } from 'next/headers'
import AboutForm from '@/components/AboutForm'
import LoginForm from '@/components/LoginForm'

export const dynamic = 'force-dynamic'

export default async function EditAboutPage() {
  const cookieStore = await cookies()
  const authenticated = cookieStore.get('authenticated')?.value === 'true'

  if (!authenticated) {
    return <LoginForm />
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">About 수정</h1>
      <AboutForm />
    </div>
  )
}
