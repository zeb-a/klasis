import { useState } from 'react';
import { useTranslation } from '@/i18n';

const TornadoSetup = ({
  config,
  setConfig,
  selectedClass,
  onBack,
  onGameStart,
  selectedStudents,
  setSelectedStudents,
  isTeamMode,
  setIsTeamMode,
  playerCount,
  setPlayerCount,
  isReplay
}) => {
  const { t } = useTranslation();
  const [isDraggingTornado, setIsDraggingTornado] = useState(false);

  const addWord = (word) => {
    setConfig(prev => ({ ...prev, decorativeElements: [...prev.decorativeElements, word] }));
  };

  const handleTornadoFileDrop = (files) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    const newImages = imageFiles.slice(0, 20).map(file => URL.createObjectURL(file));
    setConfig(prev => ({ ...prev, decorativeElements: [...prev.decorativeElements, ...newImages] }));
  };

  const removeWord = (word) => {
    setConfig(prev => ({
      ...prev,
      decorativeElements: prev.decorativeElements.filter(e => e !== word)
    }));
  };

  const removeImage = (image) => {
    setConfig(prev => ({
      ...prev,
      decorativeElements: prev.decorativeElements.filter(e => e !== image)
    }));
  };

  const handleStartGame = () => {
    if (isTeamMode) {
      const students = selectedClass.students || [];
      const teams = [];
      for (let i = 0; i < playerCount; i++) {
        const teamMembers = students.filter((_, idx) => idx % playerCount === i);
        teams.push({
          id: i,
          name: t('games.team_name').replace('{number}', i + 1),
          color: ['#00d9ff', '#ff00ff', '#00ff88', '#ffcc00'][i],
          members: teamMembers
        });
      }
      onGameStart(teams);
    } else {
      if (selectedStudents.length >= 2) {
        onGameStart(selectedStudents);
      }
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '800px',
      padding: '40px',
      background: 'rgba(255, 255, 255, 0.98)',
      borderRadius: '30px',
      border: '5px solid #4ECDC4',
      boxShadow: '0 20px 60px rgba(78, 205, 196, 0.3)',
      marginTop: '50px',
      marginBottom: '50px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px'
      }}>
        <button
          onClick={onBack}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.6)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4)';
          }}
        >
          ← {t('games.back')}
        </button>

        {selectedClass && (
          <div style={{
            textAlign: 'center',
            flex: 1,
            margin: '0 20px'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#6B7280',
              marginBottom: '4px'
            }}>
              {isTeamMode ? `👥 ${t('games.teams')}` : `👤 ${t('games.individual')}`}
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4, #95E1D3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              fontFamily: 'Comic Sans MS, cursive, sans-serif'
            }}>
              {selectedClass.name}
            </div>
          </div>
        )}

        {!selectedClass && (
          <h1 style={{
            fontSize: '32px',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4, #95E1D3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            fontFamily: 'Comic Sans MS, cursive, sans-serif',
            flex: 1,
            textAlign: 'center'
          }}>
            {t('games.torenado_game')}
          </h1>
        )}

        <div style={{ width: '100px' }}></div>
      </div>

      {selectedClass && (
        <div style={{ marginBottom: '25px' }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '6px',
            background: '#F3F4F6',
            borderRadius: '16px'
          }}>
            <button
              onClick={() => {
                setIsTeamMode(false);
                setPlayerCount(2);
                setSelectedStudents([]);
              }}
              style={{
                flex: 1,
                padding: '14px 24px',
                fontSize: '16px',
                fontWeight: '700',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: !isTeamMode ? 'linear-gradient(135deg, #3B82F6, #10B981)' : 'transparent',
                color: !isTeamMode ? '#fff' : '#6B7280',
                boxShadow: !isTeamMode ? '0 4px 15px rgba(16, 185, 129, 0.3)' : 'none'
              }}
            >
              👤 Individual
            </button>
            <button
              onClick={() => {
                setIsTeamMode(true);
                setPlayerCount(2);
                setSelectedStudents([]);
              }}
              style={{
                flex: 1,
                padding: '14px 24px',
                fontSize: '16px',
                fontWeight: '700',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: isTeamMode ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'transparent',
                color: isTeamMode ? '#fff' : '#6B7280',
                boxShadow: isTeamMode ? '0 4px 15px rgba(139, 92, 246, 0.3)' : 'none'
              }}
            >
              {t('games.teams_label')}
            </button>
          </div>
        </div>
      )}

      {isTeamMode && (
        <div style={{ marginBottom: '25px', padding: '20px', background: '#F8FAFC', borderRadius: '18px', border: '3px solid #8B5CF6' }}>
          <label style={{
            color: '#333',
            fontSize: '18px',
            fontWeight: '700',
            display: 'block',
            marginBottom: '15px'
          }}>
            {t('games.teams_label')}
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[2, 3, 4].map(count => (
              <button
                key={count}
                onClick={() => {
                  setPlayerCount(count);
                  if (selectedClass?.students) {
                    const teams = Array.from({ length: count }, (_, i) =>
                      selectedClass.students.filter((_, idx) => idx % count === i)
                    );
                  }
                }}
                style={{
                  padding: '15px 30px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  border: '3px solid',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: playerCount === count
                    ? 'linear-gradient(135deg, #F59E0B, #EF4444)'
                    : 'white',
                  borderColor: playerCount === count ? '#F59E0B' : '#E5E7EB',
                  color: playerCount === count ? '#fff' : '#4B5563',
                  boxShadow: playerCount === count
                    ? '0 6px 20px rgba(245, 158, 11, 0.4)'
                    : '0 2px 6px rgba(0,0,0,0.05)',
                  transform: playerCount === count ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                {count} Teams
              </button>
            ))}
          </div>
        </div>
      )}

      {isTeamMode && selectedClass && playerCount > 0 && (
        <div style={{ marginBottom: '25px', padding: '20px', background: '#F8FAFC', borderRadius: '18px', border: '3px solid #8B5CF6' }}>
          <label style={{
            color: '#333',
            fontSize: '18px',
            fontWeight: '700',
            display: 'block',
            marginBottom: '15px'
          }}>
            👥 {t('games.teams')}:
          </label>
          <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {Array.from({ length: playerCount }).map((_, i) => {
              const teamMembers = (selectedClass.students || []).filter((_, idx) => idx % playerCount === i);
              const teamColor = ['#00d9ff', '#ff00ff', '#00ff88', '#ffcc00'][i];
              return (
                <div key={i} style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: teamColor + '20',
                  border: `2px solid ${teamColor}`
                }}>
                  <strong style={{ color: teamColor, fontSize: '14px' }}>Team {i + 1}</strong>
                  <ul style={{ margin: '8px 0 0 16px', paddingLeft: '20px', fontSize: '13px' }}>
                    {teamMembers.map(student => (
                      <li key={student.id}>{student.name}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedClass && !isTeamMode && (
        <div style={{ marginBottom: '25px', padding: '20px', background: '#F8FAFC', borderRadius: '18px', border: '3px solid #10B981' }}>
          <label style={{
            color: '#333',
            fontSize: '18px',
            fontWeight: '700',
            display: 'block',
            marginBottom: '12px'
          }}>
            {t('games.select_students')}
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '10px',
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '8px'
          }}>
            {selectedClass.students.map(student => {
              const isSelected = selectedStudents.some(p => p.id === student.id);
              const isMaxReached = selectedStudents.length >= 4;
              return (
                <button
                  key={student.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedStudents(prev => prev.filter(p => p.id !== student.id));
                    } else if (!isMaxReached) {
                      setSelectedStudents(prev => [...prev, {
                        id: student.id,
                        name: student.name,
                        color: ['#00d9ff', '#ff00ff', '#00ff88', '#ffcc00'][prev.length]
                      }]);
                    }
                  }}
                  disabled={!isSelected && isMaxReached}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '2px solid',
                    cursor: !isSelected && isMaxReached ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    background: isSelected
                      ? 'linear-gradient(135deg, #10B981, #059669)'
                      : 'white',
                    borderColor: isSelected ? '#10B981' : '#E5E7EB',
                    color: isSelected ? '#fff' : '#4B5563',
                    opacity: !isSelected && isMaxReached ? '0.5' : '1',
                    fontSize: '14px',
                    fontWeight: '600',
                    position: 'relative',
                    textAlign: 'left'
                  }}
                >
                  {isSelected ? '✓ ' : ''}{student.name}
                  {isMaxReached && !isSelected && (
                    <span style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: '#EF4444',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      4
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div style={{
            marginTop: '12px',
            fontSize: '14px',
            color: selectedStudents.length >= 2 ? '#10B981' : '#6B7280',
            fontWeight: '600'
          }}>
            {t('games.selected_count').replace('{selected}', selectedStudents.length).replace('{ready}', selectedStudents.length >= 2 ? t('games.selected_ready') : t('games.selected_not_ready'))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '30px', padding: '25px', background: '#f8f9fa', borderRadius: '20px', border: '3px solid #ddd' }}>
        <label style={{
          color: '#333',
          fontSize: '20px',
          fontWeight: '700',
          display: 'block',
          marginBottom: '15px'
        }}>
          {t('games.number_of_tiles')}
        </label>
        <input
          type="range"
          min="10"
          max="40"
          value={config.squareCount}
          onChange={(e) => setConfig(prev => ({ ...prev, squareCount: parseInt(e.target.value) }))}
          style={{
            width: '100%',
            height: '15px',
            borderRadius: '8px',
            background: 'linear-gradient(90deg, #00d9ff, #ff00ff)',
            outline: 'none',
            marginBottom: '15px',
            cursor: 'pointer'
          }}
        />
        <div style={{
          textAlign: 'center',
          color: '#333',
          fontSize: '28px',
          fontWeight: '900',
          padding: '15px',
          background: '#fff',
          borderRadius: '15px',
          border: '3px solid #00d9ff',
          boxShadow: '0 4px 15px rgba(0, 217, 255, 0.2)'
        }}>
          {config.squareCount} Tiles
        </div>
      </div>

      <div style={{ marginBottom: '30px', padding: '25px', background: '#f8f9fa', borderRadius: '20px', border: '3px solid #ddd' }}>
        <label style={{
          color: '#333',
          fontSize: '20px',
          fontWeight: '700',
          display: 'block',
          marginBottom: '15px'
        }}>
          {t('games.numbered_tiles')}
        </label>
        <button
          onClick={() => setConfig(prev => ({ ...prev, numberedSquares: !prev.numberedSquares }))}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            fontWeight: 'bold',
            borderWidth: '3px',
            borderStyle: 'solid',
            borderColor: config.numberedSquares ? '#00ff88' : '#ccc',
            borderRadius: '15px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            background: config.numberedSquares
              ? 'linear-gradient(135deg, #00ff88, #00d9ff)'
              : '#fff',
            color: config.numberedSquares ? '#000' : '#333',
            boxShadow: config.numberedSquares
              ? '0 4px 15px rgba(0, 255, 136, 0.4)'
              : '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          {config.numberedSquares ? t('games.enabled') : t('games.disabled')}
        </button>
      </div>

      <div style={{ marginBottom: '30px', padding: '25px', background: '#f8f9fa', borderRadius: '20px', border: '3px solid #ddd' }}>
        <label style={{
          color: '#333',
          fontSize: '20px',
          fontWeight: '700',
          display: 'block',
          marginBottom: '15px'
        }}>
          {t('games.tornado_count')}
        </label>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setConfig(prev => ({ ...prev, tornadoCount: 'random' }))}
            style={{
              padding: '15px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderWidth: '3px',
              borderStyle: 'solid',
              borderColor: config.tornadoCount === 'random' ? '#ff00ff' : '#ccc',
              borderRadius: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: config.tornadoCount === 'random'
                ? 'linear-gradient(135deg, #ff00ff, #ff6600)'
                : '#fff',
              color: config.tornadoCount === 'random' ? '#000' : '#333',
              boxShadow: config.tornadoCount === 'random'
                ? '0 4px 15px rgba(255, 0, 255, 0.4)'
                : '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            🎲 Random
          </button>
          {[1, 2, 3, 4, 5].map(count => (
            <button
              key={count}
              onClick={() => setConfig(prev => ({ ...prev, tornadoCount: count }))}
              style={{
                padding: '15px 25px',
                fontSize: '16px',
                fontWeight: 'bold',
                borderWidth: '3px',
                borderStyle: 'solid',
                borderColor: config.tornadoCount === count ? '#ff00ff' : '#ccc',
                borderRadius: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: config.tornadoCount === count
                  ? 'linear-gradient(135deg, #ff00ff, #ff6600)'
                  : '#fff',
                color: config.tornadoCount === count ? '#000' : '#333',
                boxShadow: config.tornadoCount === count
                  ? '0 4px 15px rgba(255, 0, 255, 0.4)'
                  : '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '30px', padding: '25px', background: '#f8f9fa', borderRadius: '20px', border: '3px solid #ddd' }}>
        <label style={{
          color: '#333',
          fontSize: '20px',
          fontWeight: '700',
          display: 'block',
          marginBottom: '15px'
        }}>
          {t('games.upload_pictures_review')}
        </label>

        <div
          onDragEnter={() => setIsDraggingTornado(true)}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setIsDraggingTornado(false);
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingTornado(false);
            const files = e.dataTransfer.files;
            if (files.length > 0) {
              handleTornadoFileDrop(files);
            }
          }}
          style={{
            width: '100%',
            padding: '30px',
            marginBottom: '15px',
            fontSize: '14px',
            border: isDraggingTornado ? '4px dashed #4ECDC4' : '3px dashed #4ECDC4',
            borderRadius: '15px',
            background: isDraggingTornado ? '#E0F2F1' : '#fff',
            color: '#333',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          }}
          onClick={() => document.getElementById('fileInput').click()}
          onMouseEnter={(e) => {
            if (!isDraggingTornado) {
              e.target.style.transform = 'scale(1.01)';
              e.target.style.boxShadow = '0 4px 15px rgba(78, 205, 196, 0.15)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isDraggingTornado) {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          <input
            id="fileInput"
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const files = Array.from(e.target.files);
              const newImages = files.slice(0, 20).map(file => URL.createObjectURL(file));
              setConfig(prev => ({ ...prev, decorativeElements: [...prev.decorativeElements, ...newImages] }));
            }}
          />
          <div style={{ fontSize: '42px', marginBottom: '10px' }}>📸</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#4ECDC4', marginBottom: '6px' }}>
            {t('games.click_upload_images')}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>
            {t('games.drag_drop_files')}
          </div>
        </div>

        <div style={{
          padding: '20px',
          background: '#fff',
          borderRadius: '20px',
          color: '#333',
          fontSize: '20px',
          fontWeight: 'bold',
          border: '3px solid #4ECDC4',
          boxShadow: '0 4px 20px rgba(78, 205, 196, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>✨</span>
            <span style={{ fontSize: '24px', fontWeight: '900', color: '#4ECDC4' }}>
              {config.decorativeElements.filter(e => e.startsWith('data:') || e.startsWith('blob:')).length} / 20
            </span>
            <span style={{ fontSize: '18px', color: '#666', fontWeight: '500' }}>
              {t('games.images_loaded_suffix')}
            </span>
          </div>

          {config.decorativeElements.filter(e => e.startsWith('data:') || e.startsWith('blob:')).length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
              gap: '10px',
              marginTop: '15px'
            }}>
              {config.decorativeElements.filter(e => e.startsWith('data:') || e.startsWith('blob:')).map((img, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '2px solid #4ECDC4',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => removeImage(img)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img src={img} alt={`Upload ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    top: '3px',
                    right: '3px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'rgba(255, 107, 107, 0.9)',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #fff'
                  }}>
                    ✕
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '30px', padding: '25px', background: '#f8f9fa', borderRadius: '20px', border: '3px solid #ddd' }}>
        <label style={{ color: '#333', fontSize: '20px', fontWeight: '700', display: 'block', marginBottom: '15px' }}>
          ✏️ {t('games.enter_word')}:
        </label>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder={t('games.words_csv_placeholder')}
            onChange={(e) => {
              const words = e.target.value.split(',').map(w => w.trim()).filter(w => w);
              const currentWords = config.decorativeElements.filter(e => typeof e === 'string' && !e.startsWith('data:') && !e.startsWith('blob:'));
              const images = config.decorativeElements.filter(e => e.startsWith('data:') || e.startsWith('blob:'));
              setConfig(prev => ({ ...prev, decorativeElements: [...images, ...words] }));
            }}
            style={{
              flex: 1,
              padding: '15px 20px',
              fontSize: '16px',
              border: '3px solid #FF6B6B',
              borderRadius: '15px',
              background: '#fff',
              color: '#333',
              outline: 'none'
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input[type="text"]');
              if (input) {
                const words = input.value.split(',').map(w => w.trim()).filter(w => w);
                const images = config.decorativeElements.filter(e => e.startsWith('data:') || e.startsWith('blob:'));
                setConfig(prev => ({ ...prev, decorativeElements: [...prev.decorativeElements, ...words] }));
                input.value = '';
              }
            }}
            style={{
              padding: '15px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #4ECDC4, #95E1D3)',
              color: '#000',
              border: '3px solid #4ECDC4',
              borderRadius: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 6px 20px rgba(78, 205, 196, 0.5)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(78, 205, 196, 0.3)';
            }}
          >
            {t('games.add')}
          </button>
        </div>

        <div style={{ padding: '15px', background: '#fff', borderRadius: '15px', border: '2px solid #FF6B6B', minHeight: '60px' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#666', marginBottom: '10px' }}>
            {t('games.added_words')}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {config.decorativeElements.filter(e => typeof e === 'string' && !e.startsWith('data:') && !e.startsWith('blob:')).map((word, index) => (
              <button
                key={index}
                onClick={() => removeWord(word)}
                style={{
                  padding: '8px 14px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #FFE4E1, #FFD1D0)',
                  color: '#FF6B6B',
                  border: '2px solid #FF6B6B',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {word}
                <span style={{ fontSize: '12px', fontWeight: '900' }}>✕</span>
              </button>
            ))}
            {config.decorativeElements.filter(e => typeof e === 'string' && !e.startsWith('data:') && !e.startsWith('blob:')).length === 0 && (
              <div style={{ fontSize: '14px', color: '#999', fontStyle: 'italic' }}>
                {t('games.no_words_added_yet')}
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleStartGame}
        disabled={isTeamMode ? false : selectedStudents.length < 2}
        style={{
          width: '100%',
          padding: '25px',
          fontSize: '28px',
          fontWeight: '900',
          border: 'none',
          borderRadius: '20px',
          cursor: isTeamMode || selectedStudents.length >= 2 ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease',
          background: isTeamMode || selectedStudents.length >= 2
            ? 'linear-gradient(135deg, #00d9ff, #00ff88, #ff00ff)'
            : '#ccc',
          color: '#000',
          textShadow: 'none',
          boxShadow: isTeamMode || selectedStudents.length >= 2
            ? '0 10px 40px rgba(0, 217, 255, 0.5)'
            : 'none',
          opacity: isTeamMode || selectedStudents.length >= 2 ? 1 : 0.5
        }}
        onMouseOver={(e) => {
          if (isTeamMode || selectedStudents.length >= 2) {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 15px 50px rgba(0, 217, 255, 0.8)';
          }
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = isTeamMode || selectedStudents.length >= 2
            ? '0 10px 40px rgba(0, 217, 255, 0.5)'
            : 'none';
        }}
      >
        {t('games.start_game')}
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 10px 40px rgba(0, 217, 255, 0.5); }
          50% { box-shadow: 0 10px 60px rgba(255, 0, 255, 0.7); }
        }
      `}</style>
    </div>
  );
};

export default TornadoSetup;
