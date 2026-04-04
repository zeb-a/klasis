import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { fallbackInitialsDataUrl } from '../utils/avatar';
import { generateAvatarSetList, getAvatarFromSet } from '../utils/bulkAvatarSets';
import { X, Camera } from 'lucide-react';

import { detectGender } from '../utils/gender';
import { useModalKeyboard } from '../hooks/useKeyboardShortcuts';
import { useTranslation } from '../i18n';
import { useToast } from './Toast';

export default function AddStudentModal({ onClose, onSave }) {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('boy');
  const [uploadedAvatar, setUploadedAvatar] = useState(null);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
  const [avatarList, setAvatarList] = useState([]);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [hoveredAvatar, setHoveredAvatar] = useState(null);
  const avatarSectionRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize Adventurers avatars
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

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      alert(t('add_student.image_large'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedAvatar(reader.result);
      setSelectedAvatarIndex(0);
    };
    reader.readAsDataURL(file);
  };

  // Handle keyboard shortcuts
  const handleSave = () => {
    if (name.trim()) {
      addToast('Student added successfully!', 'success');
      onSave({
        name: name.trim(),
        gender,
        avatar: uploadedAvatar || getAvatarFromSet('dicebear-adventurers', selectedAvatarIndex),
        avatarSetId: uploadedAvatar ? null : 'dicebear-adventurers',
        avatarIndex: uploadedAvatar ? null : selectedAvatarIndex
      });
    }
  };

  useModalKeyboard(handleSave, onClose, !showAvatarPicker);

  // Use uploaded avatar, otherwise use selected Adventurers avatar
  const avatarUrl = uploadedAvatar || getAvatarFromSet('dicebear-adventurers', selectedAvatarIndex);

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    setShowAvatarPicker(!showAvatarPicker);
  };

  return (
    <div style={styles.overlay} className="modal-overlay-in">
      <div style={styles.modal} className="animated-modal-content modal-animate-center">
        <div style={styles.modalHeader}>
          <h3>{t('add_student.title')}</h3>
          <button style={styles.closeBtn} onClick={onClose}><X /></button>
        </div>

        <div style={{ ...styles.avatarSection, overflow: 'visible', position: 'relative' }} ref={avatarSectionRef}>
          <div
            style={{ ...styles.previewContainer, cursor: 'pointer' }}
            onClick={handleAvatarClick}
          >
            <img src={avatarUrl} alt="Preview" style={styles.previewImg} onError={(e) => { e.target.onerror = null; e.target.src = fallbackInitialsDataUrl(name); }} />
            <div style={styles.cameraBadge}><Camera size={14} /></div>
          </div>
          <div style={{ marginTop: 8, textAlign: 'center', fontSize: 13, color: '#64748B', fontWeight: 500, cursor: 'pointer' }} onClick={handleAvatarClick}>
            {t('add_student.change_avatar')}
          </div>

          {/* Upload button */}
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
            <button onClick={() => fileInputRef.current && fileInputRef.current.click()} style={styles.uploadBtn}>
              {uploadedAvatar ? t('add_student.change_photo') : t('add_student.upload_photo')}
            </button>
            {uploadedAvatar && (
              <button onClick={() => { setUploadedAvatar(null); setSelectedAvatarIndex(0); }} style={styles.removeBtn}>{t('add_student.remove')}</button>
            )}
          </div>
        </div>

        {/* GENDER SELECTION */}
        <div style={styles.genderSection}>
          <label style={styles.genderLabel}>{t('add_student.gender')}</label>
          <div style={styles.genderButtons}>
            <button
              onClick={() => setGender('boy')}
              style={{
                ...styles.genderBtn,
                ...(gender === 'boy' ? styles.genderBtnActive : {})
              }}
            >
              👦 {t('add_student.boy')}
            </button>
            <button
              onClick={() => setGender('girl')}
              style={{
                ...styles.genderBtn,
                ...(gender === 'girl' ? styles.genderBtnActive : {})
              }}
            >
              👧 {t('add_student.girl')}
            </button>
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
                        setUploadedAvatar(null);
                        setShowAvatarPicker(false);
                      }}
                      onMouseEnter={() => setHoveredAvatar(avatar.id)}
                      onMouseLeave={() => setHoveredAvatar(null)}
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
                        ...(selectedAvatarIndex === avatar.index && !uploadedAvatar ? styles.avatarOptionSelected : {}),
                        ...(hoveredAvatar === avatar.id ? { transform: 'scale(1.1)', zIndex: 10, boxShadow: '0 8px 16px rgba(0,0,0,0.15)' } : {})
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

        {/* NAME INPUT WITH AUTO-GENDER DETECTION */}
        <input
          type="text"
          placeholder={t('add_student.name_placeholder')}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            // Auto-detect gender when name changes
            if (e.target.value.trim()) {
              const detectedGender = detectGender(e.target.value);
              setGender(detectedGender);
            }
          }}
          onBlur={() => {
            // Auto-detect gender when mouse leaves input
            if (name.trim()) {
              const detectedGender = detectGender(name);
              setGender(detectedGender);
            }
          }}
          style={styles.input}
        />
        {!name.trim() && (
          <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 8 }}>{t('add_student.name_required')}</div>
        )}

        <div style={styles.footer}>
          {/* CANCEL BUTTON */}
          <button style={styles.cancelBtn} onClick={onClose}>{t('add_student.cancel')}</button>
          <button
            data-enter-submit
            data-save-student-btn
            style={{
              ...styles.saveBtn,
              opacity: name.trim() ? 1 : 0.6,
              cursor: name.trim() ? 'pointer' : 'not-allowed'
            }}
            onClick={handleSave}
            disabled={!name.trim()}
          >{t('add_student.add')}</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
  modal: { background: 'white', padding: '30px', borderRadius: '24px', width: '420px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', zIndex: 10000, position: 'relative' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' },
  avatarSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', overflow: 'visible', position: 'relative' },
  previewContainer: { position: 'relative', marginBottom: '12px' },
  previewImg: { width: '100px', height: '100px', borderRadius: '50%', background: '#F8FAFC', border: '3px solid #E2E8F0' },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, background: '#4CAF50', color: 'white', padding: '6px', borderRadius: '50%' },
  uploadBtn: { padding: '10px 14px', borderRadius: '12px', border: 'none', background: '#4CAF50', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: 14 },
  removeBtn: { padding: '8px 12px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontSize: 13 },
  genderSection: { marginBottom: '20px' },
  genderLabel: { display: 'block', marginBottom: '8px', fontSize: 14, fontWeight: 600, color: '#334155' },
  genderButtons: { display: 'flex', gap: '12px' },
  genderBtn: { flex: 1, padding: '12px 16px', borderRadius: '12px', border: '2px solid #E2E8F0', background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#64748B', transition: 'all 0.2s' },
  genderBtnActive: { borderColor: '#4CAF50', background: '#F0FDF4', color: '#16A34A' },
  avatarGrid: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', justifyItems: 'center', width: '100%' },
  avatarOption: { background: 'white', border: '2px solid #e9ecef', borderRadius: '10px', padding: '8px', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '9px', color: '#666', fontWeight: 500, outline: 'none', width: '70px', justifySelf: 'center', position: 'relative' },
  avatarOptionSelected: { background: 'white', border: '2px solid #4CAF50', boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)' },
  avatarImg: { width: '32px', height: '32px', borderRadius: '6px' },
  avatarLabel: { fontSize: '8px', color: '#999', textTransform: 'capitalize' },
  input: { width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '16px', outline: 'none', fontSize: 15, color: '#334155' },
  footer: { display: 'flex', gap: 10, marginTop: '10px' },
  cancelBtn: { padding: '12px 20px', borderRadius: '12px', border: 'none', background: '#F1F5F9', color: '#64748B', fontWeight: 600, fontSize: 14, cursor: 'pointer', flex: 1 },
  saveBtn: { padding: '12px 20px', borderRadius: '12px', border: 'none', background: '#4CAF50', color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer', flex: 1 }
};
