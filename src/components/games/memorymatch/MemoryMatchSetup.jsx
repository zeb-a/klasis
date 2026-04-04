import { useState } from 'react';
import { useTranslation } from '@/i18n';
import { processUploadedImages } from '../shared/imageHelpers';

const MemoryMatchSetup = ({
  memoryMatchConfig,
  setMemoryMatchConfig,
  memoryMatchBulkUploadImages,
  setMemoryMatchBulkUploadImages,
  selectedClass,
  onBack,
  onGameStart,
  selectedStudents,
  setSelectedStudents
}) => {
  const { t } = useTranslation();
  
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const addMemoryMatchContentItem = (text, image, type) => {
    setMemoryMatchConfig(prev => ({
      ...prev,
      contentItems: [...prev.contentItems, { text, src: image, type }]
    }));
  };

  const handleMemoryMatchFileDrop = async (files) => {
    try {
      const images = await processUploadedImages(files);
      setMemoryMatchBulkUploadImages(prev => [...prev, ...images]);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const removeMemoryMatchItem = (index) => {
    setMemoryMatchConfig(prev => ({
      ...prev,
      contentItems: prev.contentItems.filter((_, i) => i !== index)
    }));
  };

  const canStartGame = () => {
    return selectedStudents.length >= 1 &&
      (memoryMatchConfig.contentItems.length >= 2 ||
       (memoryMatchBulkUploadImages.length >= 2 && memoryMatchBulkUploadImages.length % 2 === 0));
  };

  const handleStartGame = () => {
    if (!canStartGame()) return;

    const finalConfig = { ...memoryMatchConfig };

    if (memoryMatchBulkUploadImages.length > 0 && memoryMatchBulkUploadImages.length % 2 === 0) {
      const newContentItems = [...finalConfig.contentItems];
      memoryMatchBulkUploadImages.forEach(imgData => {
        newContentItems.push({ text: imgData.name || '', src: imgData.src, type: 'image' });
      });
      finalConfig.contentItems = newContentItems;
      setMemoryMatchBulkUploadImages([]);
    }

    onGameStart(selectedStudents);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '700px',
      padding: '30px',
      background: 'rgba(255, 255, 255, 0.98)',
      borderRadius: '30px',
      border: '5px solid #8B5CF6',
      boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3)',
      marginTop: '50px',
      marginBottom: '50px'
    }}>
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
            background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            fontFamily: 'Comic Sans MS, cursive, sans-serif'
          }}>
            🧠 {t('games.memory_match_config')}
          </div>
        </div>

        <div style={{ width: '80px' }}></div>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '15px', border: '2px solid #ddd' }}>
        <label style={{
          color: '#333',
          fontSize: '15px',
          fontWeight: '700',
          display: 'block',
          marginBottom: '10px'
        }}>
          📚 {t('games.content_items')} ({memoryMatchConfig.contentItems.length}):
        </label>

        <div
          onDragEnter={() => setIsDraggingFile(true)}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setIsDraggingFile(false);
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingFile(false);
            const files = e.dataTransfer.files;
            if (files.length > 0) {
              handleMemoryMatchFileDrop(files);
            }
          }}
          style={{ marginBottom: '15px' }}
        >
          <button
            onClick={() => document.getElementById('memory-bulk-file-input').click()}
            style={{
              width: '100%',
              padding: '24px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              border: isDraggingFile ? '3px dashed #8B5CF6' : '2px dashed #8B5CF6',
              borderRadius: '15px',
              background: isDraggingFile ? '#F3E8FF' : '#fff',
              color: '#8B5CF6',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <div style={{ fontSize: '36px' }}>📸📸📸</div>
            <div style={{ fontSize: '15px' }}>{t('games.upload_multiple')}</div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
              or drag and drop images here
            </div>
          </button>
          <input
            id="memory-bulk-file-input"
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={async (e) => {
              const files = e.target.files;
              if (!files || files.length === 0) return;

              try {
                const images = await processUploadedImages(files);
                setMemoryMatchBulkUploadImages(prev => [...prev, ...images]);
                e.target.value = '';
              } catch (error) {
                          alert(`Error: ${error.message}`);
              }
            }}
          />
        </div>

        {memoryMatchBulkUploadImages.length > 0 && (
          <div
            onDragEnter={() => setIsDraggingFile(true)}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsDraggingFile(false);
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingFile(false);
              const files = e.dataTransfer.files;
              if (files.length > 0) {
                handleMemoryMatchFileDrop(files);
              }
            }}
            style={{
              marginBottom: '15px',
              padding: '15px',
              background: isDraggingFile ? '#DBEAFE' : '#F0F9FF',
              borderRadius: '12px',
              border: isDraggingFile ? '3px dashed #3B82F6' : '2px solid #3B82F6',
              transition: 'all 0.3s'
            }}
          >
            <label style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#1E40AF',
              marginBottom: '10px',
              display: 'block'
            }}>
              {t('games.add_labels_for_images').replace('{count}', memoryMatchBulkUploadImages.length)}
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '12px',
              maxHeight: '300px',
              overflowY: 'auto',
              padding: '12px',
              background: '#fff',
              borderRadius: '10px'
            }}>
              {memoryMatchBulkUploadImages.map((imgData, index) => (
                <div key={imgData.id} style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  padding: '8px',
                  background: '#F9FAFB',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB'
                }}>
                  <img
                    src={imgData.src}
                    alt={`Image ${index + 1}`}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      border: '2px solid #3B82F6',
                      flexShrink: 0
                    }}
                  />
                  <input
                    type="text"
                    placeholder={t('games.label_for_image').replace('{index}', index + 1)}
                    defaultValue={imgData.name || ''}
                    id={`memory-word-input-${imgData.id}`}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      fontSize: '12px',
                      border: '2px solid #E5E7EB',
                      borderRadius: '6px',
                      background: '#fff',
                      color: '#333',
                      outline: 'none',
                      minWidth: '80px'
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        document.getElementById(`memory-add-btn-${imgData.id}`)?.click();
                      }
                    }}
                    onChange={(e) => {
                      setMemoryMatchBulkUploadImages(prev =>
                        prev.map(img =>
                          img.id === imgData.id ? { ...img, name: e.target.value } : img
                        )
                      );
                    }}
                  />
                  <button
                    id={`memory-add-btn-${imgData.id}`}
                    onClick={() => {
                      const wordInput = document.getElementById(`memory-word-input-${imgData.id}`);
                      const text = wordInput?.value?.trim();
                      if (text) {
                        addMemoryMatchContentItem(text, imgData.src, 'image');
                        setMemoryMatchBulkUploadImages(prev => prev.filter(img => img.id !== imgData.id));
                      } else {
                        alert(t('games.enter_label_for_image'));
                      }
                    }}
                    style={{
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #3B82F6, #1E40AF)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      flexShrink: 0
                    }}
                  >
                    {t('games.add')}
                  </button>
                  <button
                    onClick={() => {
                      setMemoryMatchBulkUploadImages(prev => prev.filter(img => img.id !== imgData.id));
                    }}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {memoryMatchBulkUploadImages.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  onClick={() => {
                    memoryMatchBulkUploadImages.forEach(imgData => {
                      addMemoryMatchContentItem('', imgData.src, 'image');
                    });
                    setMemoryMatchBulkUploadImages([]);
                  }}
                  disabled={memoryMatchBulkUploadImages.length % 2 !== 0}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: memoryMatchBulkUploadImages.length % 2 === 0
                      ? 'linear-gradient(135deg, #10B981, #059669)'
                      : '#ccc',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: memoryMatchBulkUploadImages.length % 2 === 0 ? 'pointer' : 'not-allowed',
                    opacity: memoryMatchBulkUploadImages.length % 2 === 0 ? 1 : 0.5
                  }}
                >
                  {t('games.quick_start_images').replace('{count}', memoryMatchBulkUploadImages.length)}
                </button>
                <button
                  onClick={() => setMemoryMatchBulkUploadImages([])}
                  style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: '#EF4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  {t('games.clear')}
                </button>
              </div>
            )}
          </div>
        )}

        {(memoryMatchConfig.contentItems.length < 2 && memoryMatchBulkUploadImages.length < 2) && (
          <div style={{
            marginTop: '10px',
            padding: '10px 15px',
            background: '#FEF2F2',
            borderRadius: '10px',
            border: '2px solid #EF4444',
            textAlign: 'center',
            fontSize: '13px',
            color: '#EF4444',
            fontWeight: '600'
          }}>
            ⚠️ {t('games.need_pairs').replace('{count}', 2)}
          </div>
        )}

        {memoryMatchBulkUploadImages.length > 0 && memoryMatchBulkUploadImages.length % 2 !== 0 && (
          <div style={{
            marginTop: '10px',
            padding: '10px 15px',
            background: '#FFFBEB',
            borderRadius: '10px',
            border: '2px solid #F59E0B',
            textAlign: 'center',
            fontSize: '12px',
            color: '#92400E',
            fontWeight: '600'
          }}>
            ⚠️ {t('games.upload_even_images_warning')}
          </div>
        )}

        {memoryMatchBulkUploadImages.length > 0 && memoryMatchBulkUploadImages.length % 2 === 0 && (
          <div style={{
            marginTop: '10px',
            padding: '10px 15px',
            background: '#EFF6FF',
            borderRadius: '10px',
            border: '2px solid #3B82F6',
            textAlign: 'center',
            fontSize: '12px',
            color: '#1E40AF',
            fontWeight: '500',
            lineHeight: '1.5'
          }}>
            💡 <strong>{t('games.tip')}:</strong> {t('games.tip_add_labels')}
            <br />
            <span style={{ fontSize: '11px', color: '#6B7280' }}>
              {t('games.tip_skip_labels')}
            </span>
          </div>
        )}

        {memoryMatchConfig.contentItems.length > 0 && (
          <div
            onDragEnter={() => setIsDraggingFile(true)}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsDraggingFile(false);
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingFile(false);
              const files = e.dataTransfer.files;
              if (files.length > 0) {
                handleMemoryMatchFileDrop(files);
              }
            }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              maxHeight: '200px',
              overflowY: 'auto',
              padding: '12px',
              background: isDraggingFile ? '#F3E8FF' : '#fff',
              borderRadius: '12px',
              border: isDraggingFile ? '3px dashed #8B5CF6' : '2px solid #E5E7EB',
              transition: 'all 0.2s'
            }}
          >
            {memoryMatchConfig.contentItems.map((item, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = 'move';
                  setDraggedItemIndex(index);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (draggedItemIndex !== null && draggedItemIndex !== index) {
                    e.currentTarget.style.background = '#EDE9FE';
                    e.currentTarget.style.borderColor = '#8B5CF6';
                  }
                }}
                onDragLeave={(e) => {
                  if (draggedItemIndex !== null && draggedItemIndex !== index) {
                    e.currentTarget.style.background = '#F9FAFB';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (draggedItemIndex !== null && draggedItemIndex !== index) {
                    const newItems = [...memoryMatchConfig.contentItems];
                    const [draggedItem] = newItems.splice(draggedItemIndex, 1);
                    newItems.splice(index, 0, draggedItem);
                    setMemoryMatchConfig(prev => ({ ...prev, contentItems: newItems }));
                  }
                  setDraggedItemIndex(null);
                  e.currentTarget.style.background = '#F9FAFB';
                  e.currentTarget.style.borderColor = '#E5E7EB';
                }}
                onDragEnd={() => {
                  setDraggedItemIndex(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  background: '#F9FAFB',
                  borderRadius: '8px',
                  border: '2px solid #E5E7EB',
                  fontSize: '12px',
                  fontWeight: '600',
                  position: 'relative',
                  cursor: 'grab',
                  userSelect: 'none',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ color: '#9CA3AF', cursor: 'grab', fontSize: '16px', marginRight: '2px' }}>⋮⋮</span>
                {item.type === 'image' && (
                  <img
                    src={item.src}
                    alt={item.text}
                    style={{
                      width: '30px',
                      height: '30px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: '1px solid #E5E7EB'
                    }}
                  />
                )}
                <span style={{ color: '#333' }}>{item.text}</span>
                <button
                  onClick={() => removeMemoryMatchItem(index)}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'rgba(255, 107, 107, 0.9)',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedClass && (
        <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '15px', border: '2px solid #8B5CF6' }}>
          <label style={{
            color: '#333',
            fontSize: '14px',
            fontWeight: '700',
            display: 'block',
            marginBottom: '10px'
          }}>
            {t('games.select_students')}
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '8px',
            maxHeight: '150px',
            overflowY: 'auto',
            padding: '6px'
          }}>
            {selectedClass.students.map(student => {
              const isSelected = selectedStudents.some(p => p.id === student.id);
              const isFull = selectedStudents.length >= 4;
              return (
                <button
                  key={student.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedStudents(prev => prev.filter(p => p.id !== student.id));
                    } else if (!isFull) {
                      setSelectedStudents(prev => [...prev, {
                        id: student.id,
                        name: student.name,
                        color: ['#00d9ff', '#ff00ff', '#00ff00', '#ffff00'][prev.length]
                      }]);
                    }
                  }}
                  disabled={!isSelected && isFull}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '2px solid',
                    cursor: !isSelected && isFull ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    background: isSelected
                      ? 'linear-gradient(135deg, #8B5CF6, #A78BFA)'
                      : 'white',
                    borderColor: isSelected ? '#8B5CF6' : '#E5E7EB',
                    color: isSelected ? '#fff' : '#4B5563',
                    opacity: !isSelected && isFull ? '0.5' : '1',
                    fontSize: '13px',
                    fontWeight: '600',
                    position: 'relative',
                    textAlign: 'left'
                  }}
                >
                  {isSelected ? '✓ ' : ''}{student.name}
                </button>
              );
            })}
          </div>
          <div style={{
            marginTop: '10px',
            fontSize: '13px',
            color: selectedStudents.length >= 1 ? '#8B5CF6' : '#6B7280',
            fontWeight: '600'
          }}>
            {t('games.selected_n_of_n')
              .replace('{selected}', selectedStudents.length)
              .replace('{count}', 4)}{' '}
            {selectedStudents.length >= 1
              ? t('games.selected_ready')
              : t('games.select_range_players').replace('{min}', 1).replace('{max}', 4)}
          </div>
        </div>
      )}

      <button
        onClick={handleStartGame}
        disabled={!canStartGame()}
        style={{
          width: '100%',
          padding: '18px',
          fontSize: '20px',
          fontWeight: '900',
          border: 'none',
          borderRadius: '15px',
          cursor: canStartGame() ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease',
          background: canStartGame()
            ? 'linear-gradient(135deg, #8B5CF6, #A78BFA)'
            : '#ccc',
          color: '#fff',
          textShadow: 'none',
          boxShadow: canStartGame()
            ? '0 8px 30px rgba(139, 92, 246, 0.4)'
            : 'none',
          opacity: canStartGame() ? 1 : 0.5
        }}
      >
        {t('games.start_memory_match')}
      </button>
    </div>
  );
};

export default MemoryMatchSetup;
