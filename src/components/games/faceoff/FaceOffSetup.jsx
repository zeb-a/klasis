import { useState } from 'react';
import { useTranslation } from '@/i18n';

const FaceOffSetup = ({
  faceOffConfig,
  setFaceOffConfig,
  selectedClass,
  onBack,
  onGameStart,
  selectedStudents,
  setSelectedStudents
}) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [playerSelectionError, setPlayerSelectionError] = useState(false);
  const [wordErrors, setWordErrors] = useState({});

  const handleBulkImageUpload = (files) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    const readers = imageFiles.map(file => {
      return new Promise(resolve => {
        const r = new FileReader();
        r.onload = () => {
          // Extract filename and remove extension for the word
          const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
          resolve({
            word: fileName, // Use filename as word
            image: r.result
          });
        };
        r.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(pairs => {
      setFaceOffConfig(prev => ({
        ...prev,
        wordImagePairs: [...prev.wordImagePairs, ...pairs]
      }));
    });
  };

  const addWordImagePair = () => {
    setFaceOffConfig(prev => ({
      ...prev,
      wordImagePairs: [...prev.wordImagePairs, { word: '', image: null }]
    }));
  };

  const updateWordImagePair = (index, updates) => {
    setFaceOffConfig(prev => ({
      ...prev,
      wordImagePairs: prev.wordImagePairs.map((pair, i) =>
        i === index ? { ...pair, ...updates } : pair
      )
    }));
    // Clear error for this word when user types
    if (updates.word) {
      setWordErrors(prev => ({ ...prev, [index]: false }));
    }
  };

  const removeWordImagePair = (index) => {
    setFaceOffConfig(prev => ({
      ...prev,
      wordImagePairs: prev.wordImagePairs.filter((_, i) => i !== index)
    }));
  };

  const clearPlayerError = () => {
    setPlayerSelectionError(false);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '700px',
      padding: '30px',
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(20px)',
      borderRadius: '30px',
      border: '5px solid #FF6B6B',
      boxShadow: '0 20px 60px rgba(255, 107, 107, 0.3)',
      marginTop: '50px',
      marginBottom: '50px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <button
          onClick={onBack}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 3px 12px rgba(255, 107, 107, 0.3)'
          }}
        >
          ← {t('games.back')}
        </button>
        <div style={{
          textAlign: 'center',
          flex: 1,
          margin: '0 15px'
        }}>
          <div style={{
            fontSize: '20px',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            fontFamily: 'Comic Sans MS, cursive, sans-serif'
          }}>
            ⚡ {t('games.faceoff_config')}
          </div>
          {selectedClass && (
            <div style={{
              fontSize: '12px',
              color: '#666',
              marginTop: '4px'
            }}>
              {t('games.select_class')}: {selectedClass.name}
            </div>
          )}
        </div>
        <div style={{ width: '80px' }}></div>
      </div>

      {/* Rounds Selection */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '15px', border: '2px solid #ddd' }}>
        <label style={{
          color: '#333',
          fontSize: '15px',
          fontWeight: '700',
          display: 'block',
          marginBottom: '10px'
        }}>
          🎯 {t('games.rounds')}:
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[5, 10, 20, 30].map(round => (
            <button
              key={round}
              type="button"
              onClick={() => setFaceOffConfig(prev => ({ ...prev, rounds: round }))}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: '2px solid',
                borderRadius: '10px',
                cursor: 'pointer',
                background: faceOffConfig.rounds === round ? 'linear-gradient(135deg, #FF6B6B, #FF8E8E)' : '#fff',
                color: faceOffConfig.rounds === round ? '#fff' : '#666',
                borderColor: faceOffConfig.rounds === round ? '#FF6B6B' : '#ddd'
              }}
            >
              {round}
            </button>
          ))}
        </div>
        <div style={{
          marginTop: '10px',
          fontSize: '12px',
          color: '#6B7280',
          fontStyle: 'italic',
          fontWeight: '500'
        }}>
          💡 Choose how many rounds to play in this game session
        </div>
      </div>

      {/* Game Mode Selection */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '15px', border: '2px solid #ddd' }}>
        <label style={{
          color: '#333',
          fontSize: '15px',
          fontWeight: '700',
          display: 'block',
          marginBottom: '10px'
        }}>
          Game Mode:
        </label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setFaceOffConfig(prev => ({ ...prev, mode: 'words' }))}
            style={{
              padding: '12px 18px',
              fontSize: '14px',
              fontWeight: 'bold',
              border: '2px solid',
              borderRadius: '12px',
              cursor: 'pointer',
              background: faceOffConfig.mode === 'words' ? 'linear-gradient(135deg, #FF6B6B, #FF8E8E)' : '#fff',
              color: faceOffConfig.mode === 'words' ? '#fff' : '#666',
              borderColor: faceOffConfig.mode === 'words' ? '#FF6B6B' : '#ddd',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: '900' }}>Word Mode</div>
            <div style={{ fontSize: '12px', fontWeight: '500', marginTop: '2px' }}>Show word, pick image</div>
          </button>
          <button
            type="button"
            onClick={() => setFaceOffConfig(prev => ({ ...prev, mode: 'pictures' }))}
            style={{
              padding: '12px 18px',
              fontSize: '14px',
              fontWeight: 'bold',
              border: '2px solid',
              borderRadius: '12px',
              cursor: 'pointer',
              background: faceOffConfig.mode === 'pictures' ? 'linear-gradient(135deg, #FF6B6B, #FF8E8E)' : '#fff',
              color: faceOffConfig.mode === 'pictures' ? '#fff' : '#666',
              borderColor: faceOffConfig.mode === 'pictures' ? '#FF6B6B' : '#ddd',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: '900' }}>Picture Mode</div>
            <div style={{ fontSize: '12px', fontWeight: '500', marginTop: '2px' }}>Show picture, pick word</div>
          </button>
        </div>
      </div>

      {/* Bulk Image Upload */}
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
            handleBulkImageUpload(files);
          }
        }}
        style={{ marginBottom: '20px', padding: '20px', background: isDragging ? '#FEE2E2' : '#FEF2F2', borderRadius: '15px', border: isDragging ? '3px dashed #FF6B6B' : '2px solid #FF6B6B40', transition: 'all 0.3s' }}
      >
        <label style={{ fontSize: '15px', fontWeight: '700', color: '#333', display: 'block', marginBottom: '8px' }}>
          Upload Images (Bulk)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          id="faceoff-bulk-images"
          onChange={(e) => {
            const files = e.target.files;
            if (!files?.length) return;
            handleBulkImageUpload(files);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          onClick={() => document.getElementById('faceoff-bulk-images').click()}
          style={{
            padding: '24px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            border: isDragging ? '3px dashed #FF6B6B' : '2px dashed #FF6B6B',
            borderRadius: '15px',
            background: isDragging ? '#FEE2E2' : '#fff',
            color: '#FF6B6B',
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
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <div style={{ fontSize: '15px' }}>Click to Select Images</div>
          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
            or drag and drop images here
          </div>
        </button>
      </div>

      {/* Word-Image Pairs Management */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#FEF2F2', borderRadius: '15px', border: '2px solid #FF6B6B40' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <label style={{ fontSize: '15px', fontWeight: '700', color: '#333', display: 'block' }}>
            🔗 {t('games.word_image_pairs')} ({faceOffConfig.wordImagePairs.length})
          </label>
          <button
            type="button"
            onClick={addWordImagePair}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 'bold',
              border: '2px solid #FF6B6B',
              borderRadius: '10px',
              background: '#fff',
              color: '#FF6B6B',
              cursor: 'pointer'
            }}
          >
            + Add Pair
          </button>
        </div>

        {/* Scrollable list of pairs */}
        <div style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '6px' }}>
          {faceOffConfig.wordImagePairs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px', color: '#94A3B8', fontSize: '14px' }}>
              No word-image pairs yet. Add some!
            </div>
          )}
          {faceOffConfig.wordImagePairs.map((pair, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '12px',
                padding: '12px 14px',
                background: '#fff',
                borderRadius: '12px',
                border: '2px solid #FCA5A5',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Enter word..."
                  value={pair.word}
                  onChange={(e) => updateWordImagePair(idx, { word: e.target.value })}
                  onBlur={() => {
                    // Show error if word is empty
                    if (!pair.word || pair.word.trim() === '') {
                      setWordErrors(prev => ({ ...prev, [idx]: true }));
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: wordErrors[idx] ? '2px solid #EF4444' : '1px solid #E2E8F0',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: wordErrors[idx] ? 'none' : undefined
                  }}
                />
                {wordErrors[idx] && (
                  <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px', fontWeight: '600' }}>
                    ⚠️ Please enter a word
                  </div>
                )}
              </div>
              <div style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #FF6B6B', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pair.image ? (
                  <img src={pair.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', cursor: 'pointer' }}>
                    <span style={{ fontSize: '24px' }}>📷</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => updateWordImagePair(idx, { image: reader.result });
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeWordImagePair(idx)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#FEE2E2',
                  color: '#EF4444',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Select 2 Players */}
      {selectedClass && (
        <div style={{ marginBottom: '20px', padding: '15px', background: playerSelectionError ? '#FEF2F2' : '#FEF2F2', borderRadius: '15px', border: `2px solid ${playerSelectionError ? '#EF4444' : '#FF6B6B40'}` }}>
          <label style={{ fontSize: '15px', fontWeight: '700', color: '#333', display: 'block', marginBottom: '10px' }}>
            👤 Select Players (exactly 2):
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px', maxHeight: '140px', overflowY: 'auto' }}>
            {(selectedClass.students || []).map(student => {
              const isSelected = selectedStudents.some(p => p.id === student.id);
              const isFull = selectedStudents.length >= 2;
              return (
                <button
                  key={student.id}
                  onClick={() => {
                    clearPlayerError();
                    if (isSelected) setSelectedStudents(prev => prev.filter(p => p.id !== student.id));
                    else if (!isFull) setSelectedStudents(prev => [...prev, { id: student.id, name: student.name, color: ['#00d9ff', '#ff00ff'][prev.length] }]);
                  }}
                  disabled={!isSelected && isFull}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '2px solid',
                    borderColor: isSelected ? '#FF6B6B' : '#E2E8F0',
                    background: isSelected ? 'linear-gradient(135deg, #FF6B6B, #FF8E8E)' : '#fff',
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
          <div style={{ marginTop: '8px', fontSize: '13px', color: playerSelectionError ? '#EF4444' : (selectedStudents.length === 2 ? '#FF6B6B' : '#64748B'), fontWeight: '600' }}>
            {playerSelectionError
              ? 'Please select exactly 2 players'
              : (
                <>
                  Selected {selectedStudents.length} of 2 players{' '}
                  {selectedStudents.length === 2
                    ? '✓ Ready!'
                    : '- Select exactly 2 players'}
                </>
              )
            }
          </div>
        </div>
      )}

      {/* Start Game Button */}
      <button
        onClick={() => {
          const playersSelected = selectedStudents.length === 2;
          setPlayerSelectionError(!playersSelected);

          // Check for empty words
          const hasEmptyWords = faceOffConfig.wordImagePairs.some(pair => !pair.word || pair.word.trim() === '');
          if (hasEmptyWords) {
            // Show errors for all empty words
            const newErrors = {};
            faceOffConfig.wordImagePairs.forEach((pair, idx) => {
              if (!pair.word || pair.word.trim() === '') {
                newErrors[idx] = true;
              }
            });
            setWordErrors(newErrors);
            return;
          }

          // Clear all word errors
          setWordErrors({});

          const hasEnoughPairs = faceOffConfig.wordImagePairs.length >= 5;
          if (playersSelected && hasEnoughPairs) {
            onGameStart(selectedStudents.map((p, i) => ({ ...p, color: ['#00d9ff', '#ff00ff'][i] })));
          }
        }}
        disabled={selectedStudents.length !== 2 || faceOffConfig.wordImagePairs.length < 5}
        style={{
          width: '100%',
          padding: '16px',
          fontSize: '18px',
          fontWeight: '900',
          border: 'none',
          borderRadius: '14px',
          cursor: selectedStudents.length === 2 && faceOffConfig.wordImagePairs.length >= 5 ? 'pointer' : 'not-allowed',
          background: selectedStudents.length === 2 && faceOffConfig.wordImagePairs.length >= 5
            ? 'linear-gradient(135deg, #FF6B6B, #FF8E8E)'
            : '#ccc',
          color: '#fff',
          boxShadow: selectedStudents.length === 2 && faceOffConfig.wordImagePairs.length >= 5
            ? '0 8px 30px rgba(255, 107, 107, 0.4)'
            : 'none',
          opacity: selectedStudents.length === 2 && faceOffConfig.wordImagePairs.length >= 5 ? 1 : 0.5
        }}
      >
        {t('games.start_faceoff')}
      </button>
    </div>
  );
};

export default FaceOffSetup;
