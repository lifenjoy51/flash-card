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

`.env` 파일에 `APPS_SCRIPT_URL`과 `SPREADSHEET_ID`를 저장 (gitignore 됨). 시트명: `data`, 컬럼: `word`, `added` (TRUE/FALSE).

- `added=TRUE` → 이미지 파일 완료 (코드에 등록됨), `added=FALSE` → 단어만 등록됨
- **읽기**: `?action=read`
- **추가**: `?action=append&word=단어` (URL 인코딩 필요, 중복 자동 방지, `added=FALSE`로 추가)
- **전체 동기화**: `?action=sync&data=BASE64` — JSON 배열을 Base64 인코딩하여 전송. 코드 단어와 시트 단어의 **합집합**. 코드에 있는 단어는 `added=TRUE`, 시트에만 있는 단어는 기존 상태 유지. 양쪽 어디서도 단어가 삭제되지 않음.

## 이미지 생성

Gemini API(`gemini-2.5-flash-image`)로 이미지를 생성한다. API 키는 환경변수 `GOOGLE_API_KEY`에 설정.

### 일반 사물 프롬프트 (반드시 아래 프롬프트를 그대로 사용할 것)

```
Role: You are an expert illustrator creating educational materials for toddlers (around 20 months old). Your goal is to create a clear, simple, and engaging illustration of '{한글단어}' ({영문단어}) for a flashcard.

Instructions:
1. Draw the complete, entire '{한글단어}' ({영문단어}) as it would commonly appear in Seoul, South Korea in the current year. Use a familiar, everyday Korean appearance for the object.
   Draw it from its most recognizable angle (canonical view).
2. Background: Place the object on a solid, clean white background (#FFFFFF). No shadows or floor textures.
3. Style (Toddler-Friendly Vector):
   - Outlines: Use bold, thick, smooth black outlines to define the shape clearly.
   - Shapes: Simplify complex geometry into basic, rounded shapes. Avoid sharp corners if possible.
   - Colors: Use solid, simple flat colors. If the object has a well-known, natural color (e.g., banana=yellow, strawberry=red, tree=green), use that realistic color. If the object has no representative color (e.g., cup, bowl, book), use white or light gray as the base color. Use only 1-3 colors per object. No rainbow or multicolor schemes. No gradients, complex textures, or realistic shading.
   - Perspective: Isometric style with a 3/4 angle view and slight 3D depth.
4. No text or labels in the image. The output image must be a perfect square (1:1 aspect ratio). The object should be centered and fill the entire frame edge-to-edge with zero margin or padding.

Goal: The final image should be an instantly recognizable, clean, and simple icon of the entire '{한글단어}' ({영문단어}) that a 20-month-old baby can easily identify.
```

### 신체 부위 프롬프트 (눈, 코, 입, 귀, 손, 발, 혀, 목 등)

신체 부위는 분리된 모습이 징그러울 수 있으므로, 귀여운 아기 캐릭터 위에 해당 부위만 강조하는 방식으로 그린다.

```
Role: You are an expert illustrator creating educational materials for toddlers (around 20 months old). Your goal is to create a clear, simple, and engaging illustration highlighting '{한글단어}' ({영문단어}) for a flashcard.

Instructions:
1. Draw a simple, cute toddler character (full face for facial features, or full body for limbs). The '{한글단어}' ({영문단어}) must be drawn in full detail with bold, thick black outlines and vivid, realistic colors. All other body parts should be drawn in very light gray (#E0E0E0) with thin outlines, so the '{한글단어}' ({영문단어}) clearly stands out as the focal point.
2. Background: Place the character on a solid, clean white background (#FFFFFF). No shadows or floor textures.
3. Style (Toddler-Friendly Vector):
   - Outlines: Use bold, thick, smooth black outlines ONLY for the '{한글단어}' ({영문단어}). Use thin, light gray outlines for the rest of the body.
   - Shapes: Simplify complex geometry into basic, rounded shapes. Avoid sharp corners if possible.
   - Colors: Use solid, simple flat colors ONLY for the '{한글단어}' ({영문단어}) based on its realistic skin/body color. The rest of the body should be very light gray or faded. No gradients, complex textures, or realistic shading.
   - Perspective: Front-facing view for facial features (눈, 코, 입). Side-facing view for ear (귀). Simple front or side view for limbs (손, 발).
4. No text or labels in the image. The output image must be a perfect square (1:1 aspect ratio). The character should be centered and fill the entire frame edge-to-edge with zero margin or padding.

Goal: The final image should make the '{한글단어}' ({영문단어}) instantly recognizable by highlighting it on a cute toddler character, so a 20-month-old baby can easily identify which body part it refers to.
```

### 자연물 캐릭터 프롬프트 (달, 해, 별, 꽃, 나무 등)

사실적으로 그리면 아이가 어려워할 수 있는 자연물은 그림책 스타일의 귀여운 캐릭터로 그린다.

```
Role: You are an expert illustrator creating educational materials for toddlers (around 20 months old). Your goal is to create a clear, simple, and engaging illustration of '{한글단어}' ({영문단어}) for a flashcard.

Instructions:
1. Draw '{한글단어}' ({영문단어}) in a cute, friendly character style that toddlers would see in Korean children's picture books. Give it a simple, adorable smiling face (two dot eyes and a small curved mouth). Use the most iconic, child-friendly shape (e.g., crescent for moon, round with short rays for sun, five-pointed for star).
2. Background: Place the object on a solid, clean white background (#FFFFFF). No shadows or floor textures.
3. Style (Toddler-Friendly Vector):
   - Outlines: Use bold, thick, smooth black outlines to define the shape clearly.
   - Shapes: Simplify complex geometry into basic, rounded shapes. Avoid sharp corners if possible.
   - Colors: Use solid, simple flat colors based on the object's iconic color (e.g., yellow for moon/star, orange-yellow for sun). Use only 1-3 colors per object. No rainbow or multicolor schemes. No gradients, complex textures, or realistic shading.
   - Perspective: Flat, front-facing view.
4. No text or labels in the image. The output image must be a perfect square (1:1 aspect ratio). The object should be centered and fill the entire frame edge-to-edge with zero margin or padding.

Goal: The final image should be a cute, friendly, and instantly recognizable character version of '{한글단어}' ({영문단어}) that a 20-month-old baby can easily identify and feel comfortable with.
```

### 후처리 (생성 후 반드시 수행)

Python PIL을 사용하여 처리한다. 한글 파일명 원본(`public/images/`)에서 영문 파일명으로 변환.

1. **여백 트림**: 흰색 여백(threshold=20)을 자동 감지하여 제거. 콘텐츠만 남긴 뒤 정사각형으로 맞춤 (긴 변 기준, 흰색 패딩)
2. **size별 리사이즈** (실물 크기 반영):
   - `xl` (버스, 미끄럼틀 등): 512px
   - `lg` (냉장고, 자전거 등): 460px
   - `md` (노트북, 의자 등): 400px
   - `sm` (컵, 사과 등): 340px
   - `xs` (숟가락, 포크 등): 280px
3. **512x512 패딩**: 흰색(#FFFFFF) 여백으로 정사각형 통일
4. **JPEG 저장**: quality=80
5. `wordData`에 `{ name, file, size }` 형태로 등록

> **참고**: 한글 파일명 원본은 `.gitignore`에서 제외됨 (`public/images/[가-힣]*`). macOS 파일명은 NFD 인코딩이므로 Python에서 `unicodedata.normalize('NFC', ...)` 처리 필요.
