import Link from 'next/link'
import AboutContent from '@/components/AboutContent'

export const dynamic = 'force-dynamic'

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-4xl font-bold">About</h1>
        <Link
          href="/about/edit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          수정
        </Link>
      </div>
      <AboutContent />
    </div>
  )
}

