export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-6">About</h1>
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          안녕하세요! 이 블로그에 오신 것을 환영합니다.
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          여기서는 개발, 기술, 그리고 일상의 생각들을 공유합니다.
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Next.js와 TypeScript로 만든 개인 블로그입니다.
        </p>
      </div>
    </div>
  )
}

