import { useState } from 'react';
import { useTranslation } from '@/i18n';

const MotoRaceSetup = ({
  motoRaceConfig,
  setMotoRaceConfig,
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
      setMotoRaceConfig(prev => ({ ...prev, items: [...prev.items, ...urls] }));
    });
  };

  const addWords = (text) => {
    const words = text.split(/[,，\n]+/).map(w => w.trim()).filter(Boolean);
    if (words.length) {
      setMotoRaceConfig(prev => ({ ...prev, items: [...prev.items, ...words] }));
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '720px',
      padding: '28px',
      background: 'rgba(255, 255, 255, 0.98)',
      borderRadius: '28px',
      border: '4px solid #F97316',
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
            background: 'linear-gradient(135deg, #F97316, #EA580C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            fontFamily: 'Comic Sans MS, cursive, sans-serif'
          }}>
            🏍️ {t('games.motorace_config')}
          </div>
          {selectedClass && (
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>{t('games.select_class')}: {selectedClass.name}</div>
          )}
        </div>
        <div style={{ width: '80px' }} />
      </div>

      {/* Content type: Text OR Images only */}
      <div style={{ marginBottom: '18px', padding: '14px 18px', background: '#FFF7ED', borderRadius: '16px', border: '2px solid #F9731640' }}>
        <label style={{ fontSize: '14px', fontWeight: '700', color: '#9A3412', display: 'block', marginBottom: '10px' }}>
          📋 {t('games.text')} / {t('games.image')}
        </label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setMotoRaceConfig(prev => ({ ...prev, contentType: 'text', items: prev.contentType === 'text' ? prev.items : [] }))}
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: '700',
              border: '2px solid',
              borderRadius: '12px',
              cursor: 'pointer',
              background: motoRaceConfig.contentType === 'text' ? 'linear-gradient(135deg, #F97316, #EA580C)' : '#fff',
              color: motoRaceConfig.contentType === 'text' ? '#fff' : '#78716c',
              borderColor: motoRaceConfig.contentType === 'text' ? '#F97316' : '#E7E5E4'
            }}
          >
            ✏️ {t('games.text')}
          </button>
          <button
            type="button"
            onClick={() => setMotoRaceConfig(prev => ({ ...prev, contentType: 'images', items: prev.contentType === 'images' ? prev.items : [] }))}
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: '700',
              border: '2px solid',
              borderRadius: '12px',
              cursor: 'pointer',
              background: motoRaceConfig.contentType === 'images' ? 'linear-gradient(135deg, #F97316, #EA580C)' : '#fff',
              color: motoRaceConfig.contentType === 'images' ? '#fff' : '#78716c',
              borderColor: motoRaceConfig.contentType === 'images' ? '#F97316' : '#E7E5E4'
            }}
          >
            🖼️ {t('games.image')}
          </button>
        </div>
      </div>

      {motoRaceConfig.contentType === 'text' && (
        <div style={{ marginBottom: '18px', padding: '14px 18px', background: '#f8fafc', borderRadius: '16px', border: '2px solid #F9731640' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#9A3412', display: 'block', marginBottom: '8px' }}>
            ✏️ {t('games.enter_word')}
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder={t('games.enter_word')}
              id="motorace-words-input"
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
                  const input = document.getElementById('motorace-words-input');
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
                const input = document.getElementById('motorace-words-input');
                const text = (input?.value || '').trim();
                if (!text) return;
                addWords(text);
                if (input) input.value = '';
              }}
              style={{
                padding: '10px 18px',
                fontSize: '14px',
                fontWeight: '700',
                border: '2px solid #F97316',
                borderRadius: '10px',
                background: '#fff',
                color: '#F97316',
                cursor: 'pointer'
              }}
            >
              {t('games.add')}
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', maxHeight: '120px', overflowY: 'auto' }}>
            {motoRaceConfig.items.map((word, idx) => (
              <button
                key={`${word}-${idx}`}
                type="button"
                onClick={() => setMotoRaceConfig(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }))}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '2px solid #F97316',
                  background: '#FFF7ED',
                  color: '#9A3412',
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

      {motoRaceConfig.contentType === 'images' && (
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
          style={{ marginBottom: '18px', padding: '18px', background: isDragging ? '#FFEDD5' : '#f8fafc', borderRadius: '16px', border: isDragging ? '3px dashed #F97316' : '2px solid #F9731640', transition: 'all 0.3s' }}
        >
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#9A3412', display: 'block', marginBottom: '8px' }}>
            {t('games.upload_images_bulk')}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            id="motorace-bulk-images"
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
                setMotoRaceConfig(prev => ({ ...prev, items: [...prev.items, ...urls] }));
                e.target.value = '';
              });
            }}
          />
          <button
            type="button"
            onClick={() => document.getElementById('motorace-bulk-images').click()}
            style={{
              padding: '24px 20px',
              fontSize: '16px',
              fontWeight: '700',
              border: isDragging ? '3px dashed #F97316' : '2px dashed #F97316',
              borderRadius: '15px',
              background: isDragging ? '#FFEDD5' : '#fff',
              color: '#F97316',
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
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            {motoRaceConfig.items.map((src, idx) => (
              <div key={idx} style={{ position: 'relative', aspectRatio: 1, borderRadius: '8px', overflow: 'hidden', border: '2px solid #F97316' }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => setMotoRaceConfig(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }))}
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
        <div style={{ marginBottom: '18px', padding: '14px 18px', background: '#FFF7ED', borderRadius: '16px', border: '2px solid #F9731640' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#9A3412', display: 'block', marginBottom: '8px' }}>
            {t('games.number_of_players')}
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            {[2, 3, 4].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setSelectedStudents([]);
                  setMotoRaceConfig(prev => ({ ...prev, playerCount: n }));
                }}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: '700',
                  border: '2px solid',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: (motoRaceConfig.playerCount || 2) === n ? 'linear-gradient(135deg, #F97316, #EA580C)' : '#fff',
                  color: (motoRaceConfig.playerCount || 2) === n ? '#fff' : '#78716c',
                  borderColor: (motoRaceConfig.playerCount || 2) === n ? '#F97316' : '#E7E5E4'
                }}
              >
                {n}
              </button>
            ))}
          </div>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#9A3412', display: 'block', marginBottom: '8px' }}>
            {t('games.select_n_players').replace('{count}', (motoRaceConfig.playerCount || 2))}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px', maxHeight: '140px', overflowY: 'auto' }}>
            {(selectedClass.students || []).map(student => {
              const isSelected = selectedStudents.some(p => p.id === student.id);
              const maxP = motoRaceConfig.playerCount || 2;
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
                    borderColor: isSelected ? '#F97316' : '#E2E8F0',
                    background: isSelected ? 'linear-gradient(135deg, #F97316, #EA580C)' : '#fff',
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
          <div style={{ marginTop: '8px', fontSize: '13px', color: selectedStudents.length === (motoRaceConfig.playerCount || 2) ? '#F97316' : '#64748B', fontWeight: '600' }}>
            {t('games.selected_n_of_n')
              .replace('{selected}', selectedStudents.length)
              .replace('{count}', (motoRaceConfig.playerCount || 2))}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          const count = motoRaceConfig.playerCount || 2;
          if (selectedStudents.length === count && motoRaceConfig.items.length >= 2) {
            onGameStart(selectedStudents.map((p, i) => ({ ...p, color: ['#00d9ff', '#ff00ff', '#00ff88', '#ffcc00'][i] })));
          }
        }}
        disabled={selectedStudents.length !== (motoRaceConfig.playerCount || 2) || motoRaceConfig.items.length < 2}
        style={{
          width: '100%',
          padding: '16px',
          fontSize: '18px',
          fontWeight: '900',
          border: 'none',
          borderRadius: '14px',
          cursor: selectedStudents.length === (motoRaceConfig.playerCount || 2) && motoRaceConfig.items.length >= 2 ? 'pointer' : 'not-allowed',
          background: selectedStudents.length === (motoRaceConfig.playerCount || 2) && motoRaceConfig.items.length >= 2
            ? 'linear-gradient(135deg, #F97316, #EA580C)'
            : '#ccc',
          color: '#fff',
          boxShadow: selectedStudents.length === (motoRaceConfig.playerCount || 2) && motoRaceConfig.items.length >= 2 ? '0 6px 24px rgba(249, 115, 22, 0.4)' : 'none',
          opacity: selectedStudents.length === (motoRaceConfig.playerCount || 2) && motoRaceConfig.items.length >= 2 ? 1 : 0.6
        }}
      >
        🏍️ {t('games.start_game')} (Need {Math.max(2 - motoRaceConfig.items.length, 0)} more)
      </button>
    </div>
  );
};

export default MotoRaceSetup;
