import { useState } from 'react';
import { useTranslation } from '@/i18n';

const HorseRaceSetup = ({
  horseRaceConfig,
  setHorseRaceConfig,
  selectedClass,
  onBack,
  onGameStart,
  selectedStudents,
  setSelectedStudents
}) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileDrop = (files) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    const readers = imageFiles.map(file => {
      return new Promise(resolve => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(urls => {
      setHorseRaceConfig(prev => ({ ...prev, items: [...prev.items, ...urls] }));
    });
  };

  const addWords = (text) => {
    const words = text.split(/[,，\n]+/).map(w => w.trim()).filter(Boolean);
    if (words.length) {
      setHorseRaceConfig(prev => ({ ...prev, items: [...prev.items, ...words] }));
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '720px',
      padding: '28px',
      background: 'rgba(255, 255, 255, 0.98)',
      borderRadius: '28px',
      border: '4px solid #F59E0B',
      boxShadow: '0 24px 56px rgba(249, 115, 22, 0.25)',
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
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            fontFamily: 'Comic Sans MS, cursive, sans-serif'
          }}>
            🏍️ {t('games.horserace_config')}
          </div>
          {selectedClass && (
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>{t('games.select_class')}: {selectedClass.name}</div>
          )}
        </div>
        <div style={{ width: '80px' }} />
      </div>

      {/* Content type: Text OR Images only */}
      <div style={{ marginBottom: '18px', padding: '14px 18px', background: '#FFFBEB', borderRadius: '16px', border: '2px solid #F59E0B40' }}>
        <label style={{ fontSize: '14px', fontWeight: '700', color: '#92400E', display: 'block', marginBottom: '10px' }}>
          📋 {t('games.text')} / {t('games.image')}
        </label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setHorseRaceConfig(prev => ({ ...prev, contentType: 'text', items: prev.contentType === 'text' ? prev.items : [] }))}
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: '700',
              border: '2px solid',
              borderRadius: '12px',
              cursor: 'pointer',
              background: horseRaceConfig.contentType === 'text' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : '#fff',
              color: horseRaceConfig.contentType === 'text' ? '#fff' : '#78716c',
              borderColor: horseRaceConfig.contentType === 'text' ? '#F59E0B' : '#E7E5E4'
            }}
          >
            ✏️ {t('games.text')}
          </button>
          <button
            type="button"
            onClick={() => setHorseRaceConfig(prev => ({ ...prev, contentType: 'images', items: prev.contentType === 'images' ? prev.items : [] }))}
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: '700',
              border: '2px solid',
              borderRadius: '12px',
              cursor: 'pointer',
              background: horseRaceConfig.contentType === 'images' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : '#fff',
              color: horseRaceConfig.contentType === 'images' ? '#fff' : '#78716c',
              borderColor: horseRaceConfig.contentType === 'images' ? '#F59E0B' : '#E7E5E4'
            }}
          >
            🖼️ {t('games.image')}
          </button>
        </div>
      </div>

      {horseRaceConfig.contentType === 'text' && (
        <div style={{ marginBottom: '18px', padding: '14px 18px', background: '#f8fafc', borderRadius: '16px', border: '2px solid #F59E0B40' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#92400E', display: 'block', marginBottom: '8px' }}>
            ✏️ {t('games.enter_word')}
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder={t('games.enter_word')}
              id="horserace-words-input"
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
                  const input = document.getElementById('horserace-words-input');
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
                const input = document.getElementById('horserace-words-input');
                const text = (input?.value || '').trim();
                if (!text) return;
                addWords(text);
                if (input) input.value = '';
              }}
              style={{
                padding: '10px 18px',
                fontSize: '14px',
                fontWeight: '700',
                border: '2px solid #F59E0B',
                borderRadius: '10px',
                background: '#fff',
                color: '#F59E0B',
                cursor: 'pointer'
              }}
            >
              {t('games.add')}
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', maxHeight: '120px', overflowY: 'auto' }}>
            {horseRaceConfig.items.map((word, idx) => (
              <button
                key={`${word}-${idx}`}
                type="button"
                onClick={() => setHorseRaceConfig(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }))}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '2px solid #F59E0B',
                  background: '#FFFBEB',
                  color: '#92400E',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {word} ✕
              </button>
            ))}
          </div>
        </div>
      )}

      {horseRaceConfig.contentType === 'images' && (
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
          style={{ marginBottom: '18px', padding: '18px', background: isDragging ? '#FEF3C7' : '#f8fafc', borderRadius: '16px', border: isDragging ? '3px dashed #F59E0B' : '2px solid #F59E0B40', transition: 'all 0.3s' }}
        >
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#92400E', display: 'block', marginBottom: '8px' }}>
            {t('games.upload_images_bulk')}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            id="horserace-bulk-images"
            onChange={(e) => {
              const files = e.target.files;
              if (!files?.length) return;
              const readers = Array.from(files).map(file => {
                return new Promise(resolve => {
                  const r = new FileReader();
                  r.onload = () => resolve(r.result);
                  r.readAsDataURL(file);
                });
              });
              Promise.all(readers).then(urls => {
                setHorseRaceConfig(prev => ({ ...prev, items: [...prev.items, ...urls] }));
                e.target.value = '';
              });
            }}
          />
          <button
            type="button"
            onClick={() => document.getElementById('horserace-bulk-images').click()}
            style={{
              padding: '24px 20px',
              fontSize: '16px',
              fontWeight: '700',
              border: isDragging ? '3px dashed #F59E0B' : '2px dashed #F59E0B',
              borderRadius: '15px',
              background: isDragging ? '#FEF3C7' : '#fff',
              color: '#F59E0B',
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
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            {horseRaceConfig.items.map((src, idx) => (
              <div key={idx} style={{ position: 'relative', aspectRatio: 1, borderRadius: '8px', overflow: 'hidden', border: '2px solid #F59E0B' }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => setHorseRaceConfig(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }))}
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'rgba(239,68,68,0.9)',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 12,
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Players: 2, 3, or 4 */}
      {selectedClass && (
        <div style={{ marginBottom: '18px', padding: '14px 18px', background: '#FFFBEB', borderRadius: '16px', border: '2px solid #F59E0B40' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#92400E', display: 'block', marginBottom: '8px' }}>
            {t('games.number_of_players')}
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            {[2, 3, 4].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setSelectedStudents([]);
                  setHorseRaceConfig(prev => ({ ...prev, playerCount: n }));
                }}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: '700',
                  border: '2px solid',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: (horseRaceConfig.playerCount || 2) === n ? 'linear-gradient(135deg, #F59E0B, #D97706)' : '#fff',
                  color: (horseRaceConfig.playerCount || 2) === n ? '#fff' : '#78716c',
                  borderColor: (horseRaceConfig.playerCount || 2) === n ? '#F59E0B' : '#E7E5E4'
                }}
              >
                {n}
              </button>
            ))}
          </div>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#92400E', display: 'block', marginBottom: '8px' }}>
            {t('games.select_n_players').replace('{count}', (horseRaceConfig.playerCount || 2))}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px', maxHeight: '140px', overflowY: 'auto' }}>
            {(selectedClass.students || []).map(student => {
              const isSelected = selectedStudents.some(p => p.id === student.id);
              const maxP = horseRaceConfig.playerCount || 2;
              const isFull = selectedStudents.length >= maxP;
              return (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => {
                    if (isSelected) setSelectedStudents(prev => prev.filter(p => p.id !== student.id));
                    else if (!isFull) setSelectedStudents(prev => [...prev, { id: student.id, name: student.name, color: ['#00d9ff', '#ff00ff', '#00ff88', '#ffcc00'][prev.length] }]);
                  }}
                  disabled={!isSelected && isFull}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '2px solid',
                    borderColor: isSelected ? '#F59E0B' : '#E2E8F0',
                    background: isSelected ? 'linear-gradient(135deg, #F59E0B, #D97706)' : '#fff',
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
          <div style={{ marginTop: '8px', fontSize: '13px', color: selectedStudents.length === (horseRaceConfig.playerCount || 2) ? '#F59E0B' : '#64748B', fontWeight: '600' }}>
            {t('games.selected_n_of_n')
              .replace('{selected}', selectedStudents.length)
              .replace('{count}', (horseRaceConfig.playerCount || 2))}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          const count = horseRaceConfig.playerCount || 2;
          if (selectedStudents.length === count && horseRaceConfig.items.length >= 10) {
            onGameStart(selectedStudents.map((p, i) => ({ ...p, color: ['#00d9ff', '#ff00ff', '#00ff88', '#ffcc00'][i] })));
          }
        }}
        disabled={selectedStudents.length !== (horseRaceConfig.playerCount || 2) || horseRaceConfig.items.length < 10}
        style={{
          width: '100%',
          padding: '16px',
          fontSize: '18px',
          fontWeight: '900',
          border: 'none',
          borderRadius: '14px',
          cursor: selectedStudents.length === (horseRaceConfig.playerCount || 2) && horseRaceConfig.items.length >= 10 ? 'pointer' : 'not-allowed',
          background: selectedStudents.length === (horseRaceConfig.playerCount || 2) && horseRaceConfig.items.length >= 10
            ? 'linear-gradient(135deg, #F59E0B, #D97706)'
            : '#ccc',
          color: '#fff',
          boxShadow: selectedStudents.length === (horseRaceConfig.playerCount || 2) && horseRaceConfig.items.length >= 10 ? '0 6px 24px rgba(249, 115, 22, 0.4)' : 'none',
          opacity: selectedStudents.length === (horseRaceConfig.playerCount || 2) && horseRaceConfig.items.length >= 10 ? 1 : 0.6
        }}
      >
        🏍️ {t('games.start_game')} ({t('games.need_pairs').replace('{count}', 10)})
      </button>
    </div>
  );
};

export default HorseRaceSetup;
