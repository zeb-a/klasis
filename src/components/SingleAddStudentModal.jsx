import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Camera } from 'lucide-react';
import { getAvatarFromSet, generateAvatarSetList } from '../utils/bulkAvatarSets';
import SafeAvatar from './SafeAvatar';
import { detectGender } from '../utils/gender';
import { useToast } from './Toast';

export default function SingleAddStudentModal({ onClose, onSave }) {
  const { addToast } = useToast();
  
  const avatarSectionRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [avatarList, setAvatarList] = useState([]);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
  const [studentName, setStudentName] = useState('');
  const [customPhoto, setCustomPhoto] = useState(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Initialize Adventurers avatars (50 avatars)
  useEffect(() => {
    const avatars = generateAvatarSetList('dicebear-adventurers', 50);
    setAvatarList(avatars || []);
  }, []);

  const getDropdownPosition = useCallback(() => {
    if (!avatarSectionRef.current) return { top: 0, left: 0 };
    const rect = avatarSectionRef.current.getBoundingClientRect();
    return {
      top: rect.top - 200,
      left: rect.left + rect.width / 2 - 190
    };
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      addToast('Image too large. Max 2MB.', 'error');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setCustomPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!studentName.trim()) {
      addToast('Please enter a student name', 'error');
      return;
    }

    const student = {
      name: studentName.trim(),
      gender: detectGender(studentName),
      avatar: customPhoto || getAvatarFromSet('dicebear-adventurers', selectedAvatarIndex),
      avatarSetId: customPhoto ? null : 'dicebear-adventurers',
      avatarIndex: customPhoto ? null : selectedAvatarIndex
    };

    onSave(student);
    addToast(`${studentName} added!`, 'success');
  };

  const canSave = studentName.trim().length > 0;

  return (
    <>
      <div style={styles.overlay} className="modal-overlay-in">
        <div style={styles.modal} className="animated-modal-content modal-animate-center">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Add A Student</h3>
            <button 
              style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#64748b', padding: 8, borderRadius: 8, transition: 'all 0.2s ease' }} 
              onClick={onClose}
              onMouseEnter={(e) => e.target.style.transform = 'rotate(90deg) scale(1.1)'} 
              onMouseLeave={(e) => e.target.style.transform = 'rotate(0deg) scale(1)'}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20, overflow: 'visible', position: 'relative' }} ref={avatarSectionRef}>
            <div
              style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#F8FAFC', border: '3px solid #E2E8F0', position: 'relative', cursor: 'pointer' }}
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            >
              <SafeAvatar 
                src={customPhoto || getAvatarFromSet('dicebear-adventurers', selectedAvatarIndex)} 
                name={studentName || 'New Student'} 
                alt="Avatar" 
                style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#4CAF50', color: 'white', padding: '6px', borderRadius: '50%' }}>
                <Camera size={14} />
              </div>
            </div>
            <div style={{ marginTop: 8, textAlign: 'center', fontSize: 13, color: '#64748B', fontWeight: 500, cursor: 'pointer' }} onClick={() => setShowAvatarPicker(!showAvatarPicker)}>
              Change Avatar
            </div>

            {/* Upload button */}
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
              <button 
                onClick={() => fileInputRef.current && fileInputRef.current.click()} 
                style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.2s ease' }}
              >
                {customPhoto ? 'Change Photo' : 'Upload Photo'}
              </button>
              {customPhoto && (
                <button 
                  onClick={() => setCustomPhoto(null)} 
                  style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 500, fontSize: 13, color: '#64748b', transition: 'all 0.2s ease' }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* AVATAR PICKER DROPDOWN - Rendered via portal to escape modal */}
          {showAvatarPicker && avatarSectionRef.current && (
            <>
              {createPortal(
                <div
                  style={{
                    position: 'fixed',
                    ...getDropdownPosition(),
                    background: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    zIndex: 100001,
                    padding: '16px',
                    width: '380px',
                    maxHeight: '400px'
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="animated-modal-content modal-animate-scale"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                      Adventurers Avatars
                    </div>
                    <button
                      onClick={() => setShowAvatarPicker(false)}
                      style={{
                        background: '#f1f5f9',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        padding: '6px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
                      onMouseLeave={(e) => e.target.style.background = '#f1f5f9'}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(5, 1fr)', 
                    gap: '8px', 
                    justifyItems: 'center', 
                    width: '100%',
                    overflowY: 'auto',
                    maxHeight: '320px',
                    paddingRight: '4px'
                  }}>
                    {avatarList.map((avatar) => (
                      <button
                        key={avatar.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAvatarIndex(avatar.index);
                          setCustomPhoto(null);
                          setShowAvatarPicker(false);
                        }}
                        style={{
                          background: 'white',
                          border: '2px solid #e9ecef',
                          borderRadius: 8,
                          padding: 4,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 2,
                          fontSize: 8,
                          color: '#666',
                          fontWeight: 500,
                          outline: 'none',
                          width: '60px',
                          justifySelf: 'center',
                          ...(selectedAvatarIndex === avatar.index && !customPhoto ? { borderColor: '#4CAF50', boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.1)' } : {})
                        }}
                        title={`Avatar ${avatar.index + 1}`}
                      >
                        <img src={avatar.url} alt={`Avatar ${avatar.index}`} style={{ width: 36, height: 36, borderRadius: 6 }} />
                      </button>
                    ))}
                  </div>
                </div>,
                document.body
              )}
            </>
          )}

          <input 
            autoFocus 
            placeholder="Student name" 
            value={studentName} 
            onChange={(e) => setStudentName(e.target.value)} 
            style={{ 
              width: '100%', 
              boxSizing: 'border-box', 
              padding: '12px 14px', 
              borderRadius: '10px', 
              border: '1px solid #e2e8f0', 
              marginBottom: 16, 
              outline: 'none', 
              fontSize: 14, 
              color: '#334155', 
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease' 
            }} 
            onFocus={(e) => { 
              e.target.style.borderColor = '#4CAF50'; 
              e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)'; 
            }} 
            onBlur={(e) => { 
              e.target.style.borderColor = '#E2E8F0'; 
              e.target.style.boxShadow = 'none'; 
            }} 
          />

          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button 
              style={{ 
                padding: '14px 20px', 
                borderRadius: '10px', 
                border: '1px solid #e2e8f0', 
                background: 'white', 
                color: '#64748b', 
                fontWeight: 600, 
                fontSize: 14, 
                cursor: 'pointer', 
                flex: 1, 
                transition: 'all 0.2s ease' 
              }} 
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              style={{
                padding: '14px 20px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: 14,
                flex: 1,
                opacity: canSave ? 1 : 0.5,
                cursor: canSave ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease'
              }}
              onClick={handleSave}
              disabled={!canSave}
            >
              Add Student
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  },
  modal: {
    background: 'white',
    borderRadius: '24px',
    width: '90%',
    maxWidth: '500px',
    padding: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  avatarOptionSelected: {
    borderColor: '#4CAF50',
    boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)'
  }
};