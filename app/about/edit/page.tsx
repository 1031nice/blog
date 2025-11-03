import AboutForm from '@/components/AboutForm'

export const dynamic = 'force-dynamic'

export default function EditAboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">About 수정</h1>
      <AboutForm />
    </div>
  )
}
