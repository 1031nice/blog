# Commit Guide

## 커밋 메시지 규칙

모든 커밋 메시지는 **영어로 간결하게** 작성합니다.

## 커밋 타입

커밋 메시지는 다음 형식을 따릅니다:

```
<type>: <subject>
```

### 타입 목록

- **feat**: 새 기능 추가
- **fix**: 버그 수정
- **refactor**: 리팩토링 (기능 변경 없이 코드 개선)
- **style**: 스타일 변경 (코드 포맷팅, 세미콜론 등)
- **post**: 포스트 추가/수정
- **docs**: 문서 업데이트
- **chore**: 기타 작업 (빌드 설정, 패키지 관리 등)

## 예시

```
feat: add tag-based filtering functionality
fix: resolve post sorting issue for same date
refactor: migrate from JSON to markdown file system
style: update button styling
post: add new post about Next.js
docs: update README with setup instructions
chore: update dependencies
```

## 본문 (선택사항)

필요한 경우 본문을 추가할 수 있습니다:

```
feat: add blog post writing feature

- Create new post page (/posts/new)
- Implement PostForm component
- Add API route for post saving
```

## 주의사항

- 커밋 메시지는 영어로 작성
- 간결하고 명확하게
- 첫 번째 줄은 50자 이내 권장
- 타입과 제목 사이에 콜론과 공백 포함 (`feat: `)

