'use client'

import { useEffect, useState } from 'react'
import { TocItem } from '@/lib/toc'

interface TableOfContentsProps {
  items: TocItem[]
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [isMobileOpen, setIsMobileOpen] = useState(true)

  useEffect(() => {
    if (items.length === 0) {
      return
    }

    const handleScroll = () => {
      const headings = items.map(item => {
        const element = document.getElementById(item.id)
        return {
          id: item.id,
          element,
          top: element ? element.getBoundingClientRect().top : Infinity
        }
      })

      const currentHeading = headings
        .filter(h => h.top >= 0 && h.top < 200)
        .sort((a, b) => a.top - b.top)[0]

      if (currentHeading) {
        setActiveId(currentHeading.id)
      } else {
        if (window.scrollY < 100) {
          setActiveId(items[0]?.id || '')
        } else {
          const aboveViewport = headings
            .filter(h => h.top < 0)
            .sort((a, b) => b.top - a.top)[0]
          if (aboveViewport) {
            setActiveId(aboveViewport.id)
          }
        }
      }
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [items])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  if (items.length === 0) {
    return null
  }

  const tocList = (
    <ul className="space-y-1 text-sm">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            onClick={(e) => {
              handleClick(e, item.id)
              setIsMobileOpen(false)
            }}
            className={`
              block py-1 transition-colors
              ${item.level === 1 ? 'pl-0 font-medium' : ''}
              ${item.level === 2 ? 'pl-3' : ''}
              ${item.level === 3 ? 'pl-6 text-xs' : ''}
              ${item.level === 4 ? 'pl-9 text-xs' : ''}
              ${item.level === 5 ? 'pl-12 text-xs' : ''}
              ${item.level === 6 ? 'pl-14 text-xs' : ''}
              ${
                activeId === item.id
                  ? 'text-green-600 dark:text-green-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  )

  const tocContent = (
    <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 py-2">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
        목차
      </h2>
      {tocList}
    </div>
  )

  return (
    <>
      <nav className="lg:hidden">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="목차 토글"
        >
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            목차
          </span>
          <svg
            className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
              isMobileOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {isMobileOpen && (
          <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
            {tocList}
          </div>
        )}
      </nav>

      <nav className="hidden lg:block">
        <div className="max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain">
          {tocContent}
        </div>
      </nav>
    </>
  )
}

