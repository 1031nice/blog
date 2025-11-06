import Link from 'next/link'
import AboutContent from '@/components/AboutContent'

export const dynamic = 'force-dynamic'

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">About</h1>
        <Link
          href="/about/edit"
          className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-sm"
        >
          수정
        </Link>
      </div>
      <AboutContent />
    </div>
  )
}

