# 👶 옹알옹알 (Toddler Flash Cards)

영유아가 사물의 이름과 모양을 쉽고 재미있게 익힐 수 있도록 제작된 심플한 웹 애플리케이션입니다.

👉 **[라이브 데모 보기](https://lifenjoy51.github.io/flash-card/)**

## ✨ 주요 기능

- **시각적 인지 학습:** 선명한 사물 이미지와 한글 단어를 매칭하여 보여줍니다.
- **청각적 자극 (TTS):** 그림을 클릭하면 부드러운 한국어 음성으로 단어 이름을 읽어줍니다.
- **간편한 조작:** 2단계 클릭 인터페이스 (그림 확인 → 단어 학습 → 다음 그림).
- **모바일/태블릿 최적화:** 세로 모드 최적화 및 전체화면 모드 지원.
- **PWA 지원:** '홈 화면에 추가'를 통해 실제 앱처럼 주소창 없이 사용 가능.
- **자동 최적화:** 아이들의 시청 경험을 위해 파스텔톤 배경색이 랜덤하게 변경됩니다.

## 🛠 기술 스택

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Inline Styles (Flexbox)
- **Voice:** Web Speech API (Browser Native TTS)
- **Deployment:** GitHub Pages & GitHub Actions (Auto CI/CD)

## 📁 프로젝트 구조

```text
flash-card/
├── public/
│   ├── images/       # 최적화된 사물 이미지 (.jpg, .png)
│   ├── icon.svg      # PWA 앱 아이콘
│   ├── manifest.json # PWA 매니페스트
│   └── sw.js         # Service Worker (오프라인 캐싱)
├── src/
│   ├── App.tsx       # 메인 앱 로직 및 데이터 관리
│   └── main.tsx      # 진입점
├── .github/
│   └── workflows/    # GitHub Actions 자동 배포 설정
└── tsconfig.json     # TypeScript 설정
```

## 🚀 개발 및 배포

### 로컬 실행
```bash
npm install
npm run dev
```

### 이미지 추가 가이드
아이들의 시력 보호와 빠른 로딩을 위해 이미지는 다음 기준을 권장합니다:
1. **파일명:** 영문 소문자로 지정 (예: `apple.jpg`)
2. **용량:** 50KB 미만 권장 (SIPS 또는 이미지 압축 도구 활용)
3. **데이터 등록:** `src/App.tsx`의 `wordData` 배열에 `{ name: '한글이름', file: '영문파일명.jpg' }` 형태로 추가

### 이미지 생성 프롬프트
사물 사진을 영유아용 일러스트로 변환할 때 아래 프롬프트를 사용합니다. `{Target Object}`에 대상 사물명을 넣고, Source Image로 실물 사진을 첨부합니다.

<details>
<summary>프롬프트 전문 보기</summary>

```
Role:
You are an expert illustrator creating educational materials for toddlers
(around 20 months old). Your goal is to transform realistic photos into
clear, simple, and engaging illustrations for flashcards.

Input:
- Source Image: (첨부)
- Target Object: {Target Object}

Instructions:
1. Identify: Locate the "{Target Object}" within the Source Image.

2. Reconstruct to Whole (Crucial Step):
   - Assess if the object is partially cut off by the edge of the photo.
   - If cut off, use your knowledge of the object to imagine and reconstruct
     the missing parts, creating a view of the entire, complete object.
   - Ensure the reconstructed parts maintain logical continuity in shape,
     color, and texture with the visible parts in the photo.

3. Isolate & Background: Completely remove all original background elements,
   other objects, and clutter. Place the now-complete object on a solid,
   clean white background (#FFFFFF). No shadows or floor textures.

4. Style (Toddler-Friendly Vector): Convert the realistic (and reconstructed)
   object into a friendly, cute vector illustration.
   - Outlines: Use bold, thick, smooth black outlines to define the shape clearly.
   - Shapes: Simplify complex geometry into basic, rounded shapes.
     Avoid sharp corners if possible.
   - Colors: Use solid, cheerful, high-contrast flat colors based on the
     object's actual color. No gradients, complex textures, or realistic shading.
   - Perspective: Present the complete object from its most recognizable angle
     (canonical view).

Goal:
The final image should be an instantly recognizable, clean, and simple icon
of the entire "{Target Object}" that a 20-month-old baby can easily identify,
even if the original photo was cropped.
```

</details>

### 자동 배포
`main` 브랜치에 코드가 `push`되면 GitHub Actions가 자동으로 빌드하여 `gh-pages` 브랜치로 배포합니다.

## 📝 라이선스
개인 학습 및 육아 목적으로 자유롭게 수정 및 사용 가능합니다.
