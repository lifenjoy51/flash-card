import { useState, useEffect, useMemo } from 'react';
import { wordData } from './data';
import { imageUrl } from './imageUrl';
import Gallery from './Gallery';

function FlashCard() {
  const [index, setIndex] = useState(0);
  const [showText, setShowText] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 숨긴 카드 로드
  const hiddenCards = useMemo(() => {
    try {
      const raw = localStorage.getItem('hiddenCards');
      if (raw) return new Set<string>(JSON.parse(raw));
    } catch { /* ignore */ }
    return new Set<string>();
  }, []);

  // 셔플된 리스트 생성 (숨긴 카드 제외)
  const shuffledList = useMemo(() => {
    const visible = wordData.filter(item => !hiddenCards.has(item.file));
    return visible.sort(() => Math.random() - 0.5);
  }, [hiddenCards]);

  const currentItem = shuffledList[index];

  if (shuffledList.length === 0) {
    return (
      <div style={{
        width: '100dvw',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        gap: '20px',
      }}>
        <p style={{ fontSize: '1.3rem', color: '#666' }}>
          모든 카드가 숨김 상태입니다
        </p>
        <button
          onClick={() => { window.location.hash = 'gallery'; }}
          style={{
            padding: '12px 24px',
            borderRadius: '50px',
            border: 'none',
            backgroundColor: 'rgba(0,0,0,0.1)',
            color: '#666',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          전체보기에서 카드 켜기
        </button>
      </div>
    );
  }

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
      <button
        onClick={() => { window.location.hash = 'gallery'; }}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px 15px',
          borderRadius: '50px',
          border: 'none',
          backgroundColor: 'rgba(0,0,0,0.1)',
          color: '#666',
          fontSize: '0.9rem',
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        전체보기
      </button>
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
            zIndex: 10,
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
          src={imageUrl(currentItem.file)}
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

function getPage(): string {
  const hash = window.location.hash.replace('#', '');
  return hash || 'flashcard';
}

export default function App() {
  const [page, setPage] = useState(getPage);

  useEffect(() => {
    const onHashChange = () => setPage(getPage());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (page === 'gallery') {
    return <Gallery />;
  }

  return <FlashCard />;
}
