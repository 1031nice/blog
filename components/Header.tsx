import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
            My Blog
          </Link>
          <nav className="flex gap-6">
            <Link 
              href="/" 
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/posts" 
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Posts
            </Link>
            <Link 
              href="/about" 
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

