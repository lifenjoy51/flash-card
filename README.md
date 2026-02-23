# 👶 20개월 낱말카드 (Toddler Flash Cards)

20개월 전후의 영유아가 사물의 이름과 모양을 쉽고 재미있게 익힐 수 있도록 제작된 심플한 웹 애플리케이션입니다.

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
- **Styling:** Vanilla CSS (Flexbox)
- **Voice:** Web Speech API (Browser Native TTS)
- **Deployment:** GitHub Pages & GitHub Actions (Auto CI/CD)

## 📁 프로젝트 구조

```text
flash-card/
├── public/
│   └── images/      # 최적화된 사물 이미지 (.jpg, .png)
├── src/
│   ├── App.tsx      # 메인 앱 로직 및 데이터 관리
│   └── main.tsx     # 진입점
├── .github/
│   └── workflows/   # GitHub Actions 자동 배포 설정
└── tsconfig.json    # TypeScript 설정
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

### 자동 배포
`main` 브랜치에 코드가 `push`되면 GitHub Actions가 자동으로 빌드하여 `gh-pages` 브랜치로 배포합니다.

## 📝 라이선스
개인 학습 및 육아 목적으로 자유롭게 수정 및 사용 가능합니다.
