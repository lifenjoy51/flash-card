import { useEffect, useState, useCallback } from 'react';
import { wordData } from './data';
import { imageUrl } from './imageUrl';

const HIDDEN_CARDS_KEY = 'hiddenCards';

function loadHiddenCards(): Set<string> {
  try {
    const raw = localStorage.getItem(HIDDEN_CARDS_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch { /* ignore */ }
  return new Set();
}

function saveHiddenCards(set: Set<string>) {
  localStorage.setItem(HIDDEN_CARDS_KEY, JSON.stringify([...set]));
}

type Filter = 'all' | 'visible' | 'hidden';

const filterOptions: { value: Filter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'visible', label: '켜짐' },
  { value: 'hidden', label: '꺼짐' },
];

export default function Gallery() {
  const [hiddenCards, setHiddenCards] = useState<Set<string>>(loadHiddenCards);
  const [filter, setFilter] = useState<Filter>('all');

  const toggleHidden = useCallback((file: string) => {
    setHiddenCards(prev => {
      const next = new Set(prev);
      if (next.has(file)) {
        next.delete(file);
      } else {
        next.add(file);
      }
      saveHiddenCards(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const body = document.body;
    body.style.overflow = 'auto';
    body.style.position = 'static';
    return () => {
      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
    };
  }, []);

  const filteredData = wordData
    .filter(item => {
      if (filter === 'visible') return !hiddenCards.has(item.file);
      if (filter === 'hidden') return hiddenCards.has(item.file);
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'ko'));

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
        marginBottom: '12px',
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
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
      }}>
        {filterOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            style={{
              padding: '6px 14px',
              borderRadius: '50px',
              border: 'none',
              backgroundColor: filter === opt.value ? '#333' : 'rgba(0,0,0,0.08)',
              color: filter === opt.value ? '#fff' : '#666',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '12px',
      }}>
        {filteredData.map((item, i) => {
          const hidden = hiddenCards.has(item.file);
          return (
            <div
              key={`${item.file}-${i}`}
              style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: hidden ? 'none' : '0 2px 8px rgba(0,0,0,0.08)',
                border: hidden ? '2px dashed #ccc' : '2px solid transparent',
                opacity: hidden ? 0.3 : 1,
                filter: hidden ? 'grayscale(100%)' : 'none',
                position: 'relative',
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
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px',
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#333',
                }}>
                  {item.name}
                </p>
                <button
                  onClick={() => toggleHidden(item.file)}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '50px',
                    border: 'none',
                    backgroundColor: hidden ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.06)',
                    color: hidden ? '#999' : '#888',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {hidden ? '켜기' : '끄기'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
