import { useState } from 'react';
import { useTranslation } from '@/i18n';

const SpellTheWordSetup = ({
  spellTheWordConfig,
  setSpellTheWordConfig,
  selectedClass,
  onBack,
  onGameStart,
  selectedStudents,
  setSelectedStudents
}) => {
  const { t } = useTranslation();
  const [spellTheWordTab, setSpellTheWordTab] = useState('words');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileDrop = (files) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    const readers = imageFiles.map(file => {
      return new Promise(resolve => {
        const r = new FileReader();
        r.onload = () => resolve({ url: r.result, name: file.name });
        r.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(results => {
      const newWords = results.map(r => {
        const word = r.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        return {
          id: Date.now() + Math.random(),
          word: word,
          image: r.url
        };
      });
      setSpellTheWordConfig(prev => ({ ...prev, words: [...prev.words, ...newWords] }));
    });
  };

  const addWords = (text) => {
    const words = text.split(/[,，\n]+/).map(w => w.trim()).filter(Boolean);
    if (words.length) {
      setSpellTheWordConfig(prev => ({
        ...prev,
        words: [...prev.words, ...words.map(w => ({ id: Date.now() + Math.random(), word: w, image: null }))]
      }));
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '800px',
      padding: '40px',
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(20px)',
      borderRadius: '28px',
      border: '4px solid #EC4899',
      boxShadow: '0 24px 56px rgba(236, 72, 153, 0.25)',
      marginTop: '44px',
      marginBottom: '44px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={onBack}
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 3px 12px rgba(255, 107, 107, 0.3)'
          }}
        >
          ← {t('games.back')}
        </button>
        <div style={{ textAlign: 'center', flex: 1, minWidth: '160px' }}>
          <div style={{
            fontSize: '20px',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            fontFamily: 'Comic Sans MS, cursive, sans-serif'
          }}>
            🔤 Spell the Word
          </div>
          {selectedClass && (
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>{t('games.select_class')}: {selectedClass.name}</div>
          )}
        </div>
        <div style={{ width: '80px' }} />
      </div>

      {/* Tab selector */}
      <div style={{ marginBottom: '18px', padding: '14px 18px', background: '#FDF2F8', borderRadius: '16px', border: '2px solid #EC489940' }}>
        <label style={{ fontSize: '14px', fontWeight: '700', color: '#9F1239', display: 'block', marginBottom: '10px' }}>
          📋 Content Type
        </label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setSpellTheWordTab('words')}
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: '700',
              border: '2px solid',
              borderRadius: '12px',
              cursor: 'pointer',
              background: spellTheWordTab === 'words' ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : '#fff',
              color: spellTheWordTab === 'words' ? '#fff' : '#78716c',
              borderColor: spellTheWordTab === 'words' ? '#EC4899' : '#E7E5E4'
            }}
          >
            ✏️ Words
          </button>
          <button
            type="button"
            onClick={() => setSpellTheWordTab('images')}
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: '700',
              border: '2px solid',
              borderRadius: '12px',
              cursor: 'pointer',
              background: spellTheWordTab === 'images' ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : '#fff',
              color: spellTheWordTab === 'images' ? '#fff' : '#78716c',
              borderColor: spellTheWordTab === 'images' ? '#EC4899' : '#E7E5E4'
            }}
          >
            🖼️ Images & Words
          </button>
        </div>
      </div>

      {/* Words tab */}
      {spellTheWordTab === 'words' && (
        <div style={{ marginBottom: '18px', padding: '14px 18px', background: '#f8fafc', borderRadius: '16px', border: '2px solid #EC489940' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#9F1239', display: 'block', marginBottom: '8px' }}>
            ✏️ {t('games.enter_word')}
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder={t('games.enter_word') + " - e.g., apple, banana, cat, dog..."}
              id="spelltheword-words-input"
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '2px solid #E7E5E4',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const input = document.getElementById('spelltheword-words-input');
                  const text = (input?.value || '').trim();
                  if (!text) return;
                  addWords(text);
                  if (input) input.value = '';
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById('spelltheword-words-input');
                const text = (input?.value || '').trim();
                if (!text) return;
                addWords(text);
                if (input) input.value = '';
              }}
              style={{
                padding: '10px 18px',
                fontSize: '14px',
                fontWeight: '700',
                border: '2px solid #EC4899',
                borderRadius: '10px',
                background: '#fff',
                color: '#BE185D',
                cursor: 'pointer'
              }}
            >
              {t('games.add')}
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', maxHeight: '120px', overflowY: 'auto' }}>
            {spellTheWordConfig.words.map((item, idx) => (
              <button
                key={`${item.id}-${idx}`}
                type="button"
                onClick={() => setSpellTheWordConfig(prev => ({ ...prev, words: prev.words.filter((_, i) => i !== idx) }))}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '2px solid #EC4899',
                  background: '#FDF2F8',
                  color: '#9F1239',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {item.word} ✕
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Images tab */}
      {spellTheWordTab === 'images' && (
        <div
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setIsDragging(false);
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const files = e.dataTransfer.files;
            if (files.length > 0) {
              handleFileDrop(files);
            }
          }}
          style={{ marginBottom: '18px', padding: '18px', background: isDragging ? '#FCE7F3' : '#f8fafc', borderRadius: '16px', border: isDragging ? '3px dashed #EC4899' : '2px solid #EC489940', transition: 'all 0.3s' }}
        >
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#9F1239', display: 'block', marginBottom: '8px' }}>
            {t('games.upload_images_bulk')}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            id="spelltheword-bulk-images"
            onChange={(e) => {
              const files = e.target.files;
              if (!files?.length) return;
              handleFileDrop(files);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => document.getElementById('spelltheword-bulk-images').click()}
            style={{
              padding: '24px 20px',
              fontSize: '16px',
              fontWeight: '700',
              border: isDragging ? '3px dashed #EC4899' : '2px dashed #EC4899',
              borderRadius: '15px',
              background: isDragging ? '#FCE7F3' : '#fff',
              color: '#EC4899',
              cursor: 'pointer',
              marginBottom: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%'
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <div style={{ fontSize: '15px' }}>{t('games.select_images')}</div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
              or drag and drop images here
            </div>
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '12px', maxHeight: '200px', overflowY: 'auto', padding: '8px', background: '#fff', borderRadius: '10px' }}>
            {spellTheWordConfig.words.filter(w => w.image).map((item, idx) => (
              <div key={`${item.id}-${idx}`} style={{ position: 'relative', aspectRatio: 1, borderRadius: '8px', overflow: 'hidden', border: '2px solid #EC4899', boxShadow: '0 2px 8px rgba(236, 72, 153, 0.2)' }}>
                <img src={item.image} alt={item.word} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => setSpellTheWordConfig(prev => ({ ...prev, words: prev.words.filter((_, i) => i !== idx) }))}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#EC4899',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  ×
                </button>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(236, 72, 153, 0.9)', color: '#fff', fontSize: '11px', fontWeight: '600', padding: '4px 6px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.word}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Player count selection */}
      {selectedClass && (
        <div style={{ marginBottom: '18px', padding: '14px 18px', background: '#FDF2F8', borderRadius: '16px', border: '2px solid #EC489940' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#9F1239', display: 'block', marginBottom: '8px' }}>
            {t('games.number_of_players')}
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            {[1, 2].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setSelectedStudents([]);
                  setSpellTheWordConfig(prev => ({ ...prev, playerCount: n }));
                }}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: '700',
                  border: '2px solid',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: (spellTheWordConfig.playerCount || 2) === n ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : '#fff',
                  color: (spellTheWordConfig.playerCount || 2) === n ? '#fff' : '#78716c',
                  borderColor: (spellTheWordConfig.playerCount || 2) === n ? '#EC4899' : '#E7E5E4'
                }}
              >
                {n}
              </button>
            ))}
          </div>
          {(spellTheWordConfig.playerCount || 2) === 2 && (
            <>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#9F1239', display: 'block', marginBottom: '8px' }}>
                {t('games.select_n_players').replace('{count}', 2)}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px', maxHeight: '140px', overflowY: 'auto' }}>
                {(selectedClass.students || []).map(student => {
                  const isSelected = selectedStudents.some(p => p.id === student.id);
                  const isFull = selectedStudents.length >= 2;
                  return (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) setSelectedStudents(prev => prev.filter(p => p.id !== student.id));
                        else if (!isFull) setSelectedStudents(prev => [...prev, { id: student.id, name: student.name, avatar: student.avatar, color: ['#22c55e', '#ec4899'][prev.length] }]);
                      }}
                      disabled={!isSelected && isFull}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '10px',
                        border: '2px solid',
                        borderColor: isSelected ? '#EC4899' : '#E2E8F0',
                        background: isSelected ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : '#fff',
                        color: isSelected ? '#fff' : '#475569',
                        cursor: !isSelected && isFull ? 'not-allowed' : 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        opacity: !isSelected && isFull ? 0.5 : 1,
                        textAlign: 'left'
                      }}
                    >
                      {isSelected ? '✓ ' : ''}{student.name}
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', color: selectedStudents.length === 2 ? '#EC4899' : '#64748B', fontWeight: '600' }}>
                {t('games.selected_n_of_n')
                  .replace('{selected}', selectedStudents.length)
                  .replace('{count}', 2)}
              </div>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          const playerCount = spellTheWordConfig.playerCount || 2;
          const hasEnoughWords = spellTheWordConfig.words.length >= 5;
          const hasEnoughPlayers = !selectedClass || (playerCount === 1) || selectedStudents.length === playerCount;
          
          if (hasEnoughWords && hasEnoughPlayers) {
            onGameStart(selectedStudents.slice(0, playerCount), {
              words: spellTheWordConfig.words,
              playerCount: spellTheWordConfig.playerCount || 2
            });
          }
        }}
        disabled={
          spellTheWordConfig.words.length < 5 ||
          (selectedClass && (spellTheWordConfig.playerCount || 2) === 2 && selectedStudents.length !== 2)
        }
        style={{
          width: '100%',
          padding: '16px 24px',
          fontSize: '18px',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
          color: '#fff',
          border: 'none',
          borderRadius: '16px',
          cursor: 'pointer',
          boxShadow: spellTheWordConfig.words.length >= 5 &&
            (!selectedClass || (spellTheWordConfig.playerCount || 2) === 1 || selectedStudents.length === 2)
            ? '0 6px 24px rgba(236, 72, 153, 0.4)' : 'none',
          opacity: spellTheWordConfig.words.length >= 5 &&
            (!selectedClass || (spellTheWordConfig.playerCount || 2) === 1 || selectedStudents.length === 2)
            ? 1 : 0.6
        }}
      >
        🔤 Start Game
      </button>
    </div>
  );
};

export default SpellTheWordSetup;
