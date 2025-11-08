import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content } = body

    // 유효성 검사
    if (!title || !content) {
      return NextResponse.json(
        { error: '제목과 본문이 필요합니다.' },
        { status: 400 }
      )
    }

    // API 키 확인
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('GEMINI_API_KEY가 설정되지 않았습니다.')
      return NextResponse.json(
        { error: '서버 설정 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    // Gemini API 초기화
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // 요약 생성을 위한 프롬프트
    const prompt = `다음 블로그 포스트의 제목과 본문을 읽고, 2-3문장으로 간결하게 요약해주세요. 요약은 한국어로 작성하고, 포스트의 핵심 내용을 잘 전달해야 합니다.

제목: ${title}

본문:
${content}

요약:`

    // AI 요약 생성
    const result = await model.generateContent(prompt)
    const response = await result.response
    const excerpt = response.text().trim()

    return NextResponse.json(
      { excerpt },
      { status: 200 }
    )
  } catch (error) {
    console.error('요약 생성 오류:', error)
    
    // 에러 타입에 따른 처리
    if (error instanceof Error) {
      // API 키 오류
      if (error.message.includes('API_KEY')) {
        return NextResponse.json(
          { error: 'API 키가 유효하지 않습니다.' },
          { status: 401 }
        )
      }
      // 할당량 초과
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: '요약 생성에 실패했습니다. 다시 시도해주세요.' },
      { status: 500 }
    )
  }
}

