import { useEffect } from 'react';
import { wordData } from './data';
import { imageUrl } from './imageUrl';

export default function Gallery() {
  useEffect(() => {
    const body = document.body;
    body.style.overflow = 'auto';
    body.style.position = 'static';
    return () => {
      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
    };
  }, []);

  return (
    <div style={{
      minHeight: '100dvh',
      backgroundColor: '#FAFAFA',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>
          전체 카드
        </h1>
        <button
          onClick={() => { window.location.hash = ''; }}
          style={{
            padding: '10px 20px',
            borderRadius: '50px',
            border: 'none',
            backgroundColor: 'rgba(0,0,0,0.1)',
            color: '#666',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          카드놀이
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '12px',
      }}>
        {wordData.map((item, i) => (
          <div
            key={`${item.file}-${i}`}
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <img
              src={imageUrl(item.file)}
              alt={item.name}
              style={{
                width: '100%',
                aspectRatio: '1',
                objectFit: 'contain',
                display: 'block',
                backgroundColor: '#f5f5f5',
              }}
            />
            <p style={{
              margin: 0,
              padding: '8px',
              textAlign: 'center',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#333',
            }}>
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
