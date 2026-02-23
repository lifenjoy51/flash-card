import { useState, useMemo } from 'react';

// 파일 시스템의 실제 파일명 리스트입니다.
const imageFiles = [
  '컵.jpg',
  '바지.jpg',
  '포크.jpg',
  '의자_아이.jpg',
  '의자_어른.jpg',
  '가방.jpg',
  '텐트.jpg',
  '신발.jpg',
  '양말.jpg',
  '인형.jpg',
  '세탁기.jpg',
  '체온계.png',
  '냉장고.jpg',
  '숟가락.jpg',
  '젓가락.jpg'
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [showText, setShowText] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 셔플된 리스트 생성
  const shuffledList = useMemo(() => {
    return [...imageFiles].sort(() => Math.random() - 0.5);
  }, []);

  const currentFile = shuffledList[index];
  
  // 언더바(_) 앞부분을 단어 이름으로 추출
  const displayName = useMemo(() => {
    const baseName = currentFile.split('.')[0];
    return baseName.split('_')[0];
  }, [currentFile]);

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
    // 버튼 클릭 시에는 카드 전환 로직 실행 안 함
    if ((e.target as HTMLElement).closest('button')) return;

    if (!showText) {
      setShowText(true);
      speak(displayName);
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
        width: '100vw',
        height: '100vh',
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
      {/* 전체화면 버튼 */}
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

      {/* 이미지 영역 (세로 모드 최적화) */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: '40px'
      }}>
        <img 
          src={`images/${currentFile}`} 
          alt={displayName}
          key={currentFile}
          style={{
            maxWidth: '100%',
            maxHeight: '65vh',
            objectFit: 'contain',
            borderRadius: '24px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease'
          }}
        />
      </div>

      {/* 텍스트 영역 */}
      <div style={{
        height: '25vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      }}>
        {showText && (
          <h1 style={{
            fontSize: 'max(4rem, 15vw)', // 세로 모드에서 큰 글씨
            margin: 0,
            color: '#333',
            textAlign: 'center',
            wordBreak: 'keep-all',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            {displayName}
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
