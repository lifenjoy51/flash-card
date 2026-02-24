# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고하는 안내 문서입니다.

## 프로젝트 개요

**옹알옹알** — 영유아용 한국어 낱말카드 웹 앱. 사물 이미지와 한글 단어를 보여주고 TTS로 발음을 들려준다. 모바일/태블릿에 최적화되어 있으며 전체화면 및 PWA를 지원한다.

## 명령어

- `npm run dev` — Vite 개발 서버 실행
- `npm run build` — TypeScript 검사 + Vite 프로덕션 빌드 (`tsc && vite build`)
- `npm run preview` — 프로덕션 빌드 로컬 미리보기
- 테스트 러너나 린터는 설정되어 있지 않음.

## 아키텍처

Vite 기반 React 18 + TypeScript 단일 페이지 앱. 라우터나 상태관리 라이브러리 없이 `src/App.tsx` 하나의 컴포넌트로 구성.

- **단어 데이터**: `src/App.tsx`의 `wordData` 배열에 하드코딩. 각 항목은 `{ name: string, file: string }` 형태로 한글 단어와 `public/images/` 내 이미지 파일명을 매핑.
- **인터랙션 흐름**: 2단계 클릭 — 첫 클릭 시 단어 표시 + Web Speech API TTS 발음, 두 번째 클릭 시 다음 카드로 이동.
- **스타일링**: CSS 파일 없이 모두 인라인 스타일. 카드마다 파스텔 배경색이 순환.
- **PWA**: `public/manifest.json` + `public/sw.js`로 구성. 아이콘은 `public/icon.svg`. Service Worker는 이미지 cache-first, 나머지 network-first 전략.
- **배포**: GitHub Actions를 통한 GitHub Pages 배포. base URL은 `/flash-card/` (`vite.config.ts`에서 설정).

## 카드 추가 방법

`public/images/`에 이미지 추가 (영문 파일명, 50KB 미만) 후 `src/App.tsx`의 `wordData` 배열에 항목 추가.

## Google Sheets 단어 관리

`.env` 파일에 `APPS_SCRIPT_URL`과 `SPREADSHEET_ID`를 저장 (gitignore 됨). 시트명: `data`, 컬럼: `word`, `added_date`.

- `added_date` 있음 → 이미지 파일 완료, 없음 → 단어만 등록됨
- **읽기**: `?action=read`
- **추가**: `?action=append&word=단어` (한글은 `--data-urlencode` 사용, 중복 자동 방지)
- **전체 동기화**: `?action=sync&items=JSON배열`

## 이미지 생성

Gemini API(`gemini-2.5-flash-image`)로 이미지를 생성한다. API 키는 환경변수 `GOOGLE_API_KEY`에 설정. 프롬프트에 isometric 스타일(3/4 앵글, 약간의 입체감)을 명시한다. 생성 후 반드시 아래 후처리를 수행한다:

1. `sips -Z 512`로 최대 512px 리사이즈
2. `sips -s format jpeg -s formatOptions 80`으로 JPG 변환
3. 원본 PNG 삭제
4. `wordData`에 `.jpg` 확장자로 등록
