// Table of Contents 유틸리티 함수

export interface TocItem {
  id: string
  text: string
  level: number
}

/**
 * 마크다운 텍스트에서 제목을 추출하고 TOC 아이템을 생성합니다.
 */
export function extractHeadings(content: string): TocItem[] {
  const lines = content.split('\n')
  const headings: TocItem[] = []
  const idCounts: Record<string, number> = {}
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    // h1 (# )
    if (trimmed.startsWith('# ')) {
      const text = trimmed.slice(2).trim()
      if (text) {
        let id = generateId(text)
        if (idCounts[id]) {
          idCounts[id]++
          id = `${id}-${idCounts[id]}`
        } else {
          idCounts[id] = 1
        }
        headings.push({
          id,
          text,
          level: 1
        })
      }
    }
    // h2 (## )
    else if (trimmed.startsWith('## ')) {
      const text = trimmed.slice(3).trim()
      if (text) {
        let id = generateId(text)
        if (idCounts[id]) {
          idCounts[id]++
          id = `${id}-${idCounts[id]}`
        } else {
          idCounts[id] = 1
        }
        headings.push({
          id,
          text,
          level: 2
        })
      }
    }
    // h3 (### )
    else if (trimmed.startsWith('### ')) {
      const text = trimmed.slice(4).trim()
      if (text) {
        let id = generateId(text)
        if (idCounts[id]) {
          idCounts[id]++
          id = `${id}-${idCounts[id]}`
        } else {
          idCounts[id] = 1
        }
        headings.push({
          id,
          text,
          level: 3
        })
      }
    }
    // h4 (#### )
    else if (trimmed.startsWith('#### ')) {
      const text = trimmed.slice(5).trim()
      if (text) {
        let id = generateId(text)
        if (idCounts[id]) {
          idCounts[id]++
          id = `${id}-${idCounts[id]}`
        } else {
          idCounts[id] = 1
        }
        headings.push({
          id,
          text,
          level: 4
        })
      }
    }
    // h5 (##### )
    else if (trimmed.startsWith('##### ')) {
      const text = trimmed.slice(6).trim()
      if (text) {
        let id = generateId(text)
        if (idCounts[id]) {
          idCounts[id]++
          id = `${id}-${idCounts[id]}`
        } else {
          idCounts[id] = 1
        }
        headings.push({
          id,
          text,
          level: 5
        })
      }
    }
    // h6 (###### )
    else if (trimmed.startsWith('###### ')) {
      const text = trimmed.slice(7).trim()
      if (text) {
        let id = generateId(text)
        if (idCounts[id]) {
          idCounts[id]++
          id = `${id}-${idCounts[id]}`
        } else {
          idCounts[id] = 1
        }
        headings.push({
          id,
          text,
          level: 6
        })
      }
    }
  }
  
  return headings
}

/**
 * 텍스트에서 안전한 ID를 생성합니다.
 */
export function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 특수문자 제거
    .replace(/\s+/g, '-') // 공백을 하이픈으로
    .replace(/-+/g, '-') // 연속된 하이픈을 하나로
    .trim()
    .replace(/^-|-$/g, '') // 앞뒤 하이픈 제거
}

/**
 * 제목 텍스트에 ID를 추가한 HTML을 반환합니다.
 */
export function addIdsToHeadings(content: string): string {
  const lines = content.split('\n')
  const result: string[] = []
  const idCounts: Record<string, number> = {}
  
  for (const line of lines) {
    const trimmed = line.trim()
    let modified = false
    
    // h1 (# )
    if (trimmed.startsWith('# ')) {
      const text = trimmed.slice(2).trim()
      if (text) {
        let id = generateId(text)
        // 중복 ID 처리
        if (idCounts[id]) {
          idCounts[id]++
          id = `${id}-${idCounts[id]}`
        } else {
          idCounts[id] = 1
        }
        result.push(`# ${text} {#${id}}`)
        modified = true
      }
    }
    // h2 (## )
    else if (trimmed.startsWith('## ')) {
      const text = trimmed.slice(3).trim()
      if (text) {
        let id = generateId(text)
        if (idCounts[id]) {
          idCounts[id]++
          id = `${id}-${idCounts[id]}`
        } else {
          idCounts[id] = 1
        }
        result.push(`## ${text} {#${id}}`)
        modified = true
      }
    }
    // h3 (### )
    else if (trimmed.startsWith('### ')) {
      const text = trimmed.slice(4).trim()
      if (text) {
        let id = generateId(text)
        if (idCounts[id]) {
          idCounts[id]++
          id = `${id}-${idCounts[id]}`
        } else {
          idCounts[id] = 1
        }
        result.push(`### ${text} {#${id}}`)
        modified = true
      }
    }
    // h4 (#### )
    else if (trimmed.startsWith('#### ')) {
      const text = trimmed.slice(5).trim()
      if (text) {
        let id = generateId(text)
        if (idCounts[id]) {
          idCounts[id]++
          id = `${id}-${idCounts[id]}`
        } else {
          idCounts[id] = 1
        }
        result.push(`#### ${text} {#${id}}`)
        modified = true
      }
    }
    // h5 (##### )
    else if (trimmed.startsWith('##### ')) {
      const text = trimmed.slice(6).trim()
      if (text) {
        let id = generateId(text)
        if (idCounts[id]) {
          idCounts[id]++
          id = `${id}-${idCounts[id]}`
        } else {
          idCounts[id] = 1
        }
        result.push(`##### ${text} {#${id}}`)
        modified = true
      }
    }
    // h6 (###### )
    else if (trimmed.startsWith('###### ')) {
      const text = trimmed.slice(7).trim()
      if (text) {
        let id = generateId(text)
        if (idCounts[id]) {
          idCounts[id]++
          id = `${id}-${idCounts[id]}`
        } else {
          idCounts[id] = 1
        }
        result.push(`###### ${text} {#${id}}`)
        modified = true
      }
    }
    
    if (!modified) {
      result.push(line)
    }
  }
  
  return result.join('\n')
}

