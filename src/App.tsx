import { useState, useMemo } from 'react';

// 영문 파일명과 한글 이름을 매칭한 리스트입니다.
const wordData = [
  { name: '컵', file: 'cup.jpg' },
  { name: '바지', file: 'pants.jpg' },
  { name: '포크', file: 'fork.jpg' },
  { name: '의자', file: 'chair_child.jpg' },
  { name: '의자', file: 'chair_adult.jpg' },
  { name: '텐트', file: 'tent.jpg' },
  { name: '신발', file: 'shoes.jpg' },
  { name: '양말', file: 'socks.jpg' },
  { name: '인형', file: 'doll.jpg' },
  { name: '세탁기', file: 'washer.jpg' },
  { name: '체온계', file: 'thermometer.jpg' },
  { name: '냉장고', file: 'fridge.jpg' },
  { name: '숟가락', file: 'spoon.jpg' },
  { name: '젓가락', file: 'chopsticks.jpg' },
  { name: '휴지', file: 'tissue.jpg' },
  { name: '휴지', file: 'toilet_paper.jpg' },
  { name: '우유', file: 'milk.jpg' },
  { name: '티비', file: 'tv.jpg' },
  { name: '놀이터', file: 'playground.jpg' },
  { name: '자동차', file: 'car.jpg' },
  { name: '로봇청소기', file: 'robot_vacuum.jpg' },
  { name: '식빵', file: 'bread.jpg' },
  { name: '딸기', file: 'strawberry.jpg' },
  { name: '바나나', file: 'banana.jpg' },
  { name: '귤', file: 'tangerine.jpg' },
  { name: '밥', file: 'rice.jpg' },
  { name: '사과', file: 'apple.jpg' }
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [showText, setShowText] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 셔플된 리스트 생성
  const shuffledList = useMemo(() => {
    return [...wordData].sort(() => Math.random() - 0.5);
  }, []);

  const currentItem = shuffledList[index];

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    setTimeout(() => {
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'ko-KR';
      msg.rate = 0.8;
      window.speechSynthesis.speak(msg);
    }, 50);
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;

    if (!showText) {
      setShowText(true);
      speak(currentItem.name);
    } else {
      window.speechSynthesis.cancel();
      setShowText(false);
      setIndex((prev) => (prev + 1) % shuffledList.length);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const bgColors = ['#FFF5F5', '#F0FFF4', '#F0F5FF', '#FFFBEB', '#F5F3FF'];
  const bgColor = useMemo(() => bgColors[index % bgColors.length], [index]);

  return (
    <div 
      onClick={handleClick}
      style={{
        width: '100dvw',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        cursor: 'pointer',
        userSelect: 'none',
        padding: '20px',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {document.fullscreenEnabled && (
        <button
          onClick={toggleFullScreen}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '10px 15px',
            borderRadius: '50px',
            border: 'none',
            backgroundColor: 'rgba(0,0,0,0.1)',
            color: '#666',
            fontSize: '0.9rem',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          {isFullscreen ? '창 모드' : '전체화면'}
        </button>
      )}

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: '40px'
      }}>
        <img 
          src={`images/${currentItem.file}`} 
          alt={currentItem.name}
          key={currentItem.file}
          style={{
            maxWidth: '100%',
            maxHeight: '65dvh',
            objectFit: 'contain',
            borderRadius: '24px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease'
          }}
        />
      </div>

      <div style={{
        height: '25dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      }}>
        {showText && (
          <h1 style={{
            fontSize: 'max(4rem, 15vw)',
            margin: 0,
            color: '#333',
            textAlign: 'center',
            wordBreak: 'keep-all',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            {currentItem.name}
          </h1>
        )}
      </div>
      
      {!showText && (
        <p style={{ color: '#aaa', fontSize: '1.2rem', position: 'absolute', bottom: '30px' }}>
          그림을 터치해 보세요!
        </p>
      )}
    </div>
  );
}
