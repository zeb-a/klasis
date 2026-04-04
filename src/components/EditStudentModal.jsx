import React from 'react';
import { createPortal } from 'react-dom';
import { X, Camera } from 'lucide-react';
import SafeAvatar from './SafeAvatar';
import { boringAvatar, avatarByCharacter } from '../utils/avatar';
import { AVATAR_SETS, getAvatarFromSet, generateAvatarSetList } from '../utils/bulkAvatarSets';
import { styles } from './ClassDashboard.styles';
import { useTranslation } from '../i18n';

export default function EditStudentModal({
  editingStudentId,
  editStudentName, setEditStudentName,
  editStudentAvatar, setEditStudentAvatar,
  editSelectedSeed, setEditSelectedSeed,
  editAvatarSetId, setEditAvatarSetId,
  editAvatarSetList, setEditAvatarSetList,
  editSelectedAvatarIndex, setEditSelectedAvatarIndex,
  showEditAvatarPicker, setShowEditAvatarPicker,
  hoveredEditChar,
  editAvatarSectionRef,
  editFileInputRef,
  getEditDropdownPosition,
  handleSaveStudentEdit,
  onClose,
}) {
  const { t } = useTranslation();

  if (!editingStudentId) return null;

  return (
    <div style={styles.overlay} className="modal-overlay-in">
      <div style={styles.modal} className="animated-modal-content modal-animate-center">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>{t('edit_student.title')}</h3>
          <button style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#64748b', padding: 8, borderRadius: 8, transition: 'all 0.2s ease' }} onClick={onClose} onMouseEnter={(e) => e.target.style.transform = 'rotate(90deg) scale(1.1)'} onMouseLeave={(e) => e.target.style.transform = 'rotate(0deg) scale(1)'}><X /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20, overflow: 'visible', position: 'relative' }} ref={editAvatarSectionRef}>
          <div
            style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#F8FAFC', border: '3px solid #E2E8F0', position: 'relative', cursor: 'pointer' }}
            onClick={() => setShowEditAvatarPicker(!showEditAvatarPicker)}
          >
            <SafeAvatar src={
              editStudentAvatar ||
              (editAvatarSetId && editSelectedAvatarIndex !== null ? getAvatarFromSet(editAvatarSetId, editSelectedAvatarIndex) : null) ||
              (editSelectedSeed ? avatarByCharacter(editSelectedSeed) : null) ||
              boringAvatar(editStudentName || 'anon', 'boy')
            } name={editStudentName} alt={editStudentName} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = boringAvatar(editStudentName); }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#4CAF50', color: 'white', padding: '6px', borderRadius: '50%' }}><Camera size={14} /></div>
          </div>
          <div style={{ marginTop: 8, textAlign: 'center', fontSize: 13, color: '#64748B', fontWeight: 500, cursor: 'pointer' }} onClick={() => setShowEditAvatarPicker(!showEditAvatarPicker)}>
            {t('edit_student.change_avatar')}
          </div>

          {/* Upload button */}
          <input ref={editFileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files && e.target.files[0]; if (!f) return; if (f.size > 1024 * 1024) { alert(t('profile.image_too_large')); return; } const reader = new FileReader(); reader.onload = () => { setEditStudentAvatar(reader.result); setEditSelectedSeed(null); setEditAvatarSetId(null); setEditAvatarSetList([]); setEditSelectedAvatarIndex(null); }; reader.readAsDataURL(f); }} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
            <button onClick={() => editFileInputRef.current && editFileInputRef.current.click()} style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.2s ease' }}>
              {editStudentAvatar ? t('profile.change_photo') : t('profile.upload_photo')}
            </button>
            {editStudentAvatar && (
              <button onClick={() => { setEditStudentAvatar(null); setEditAvatarSetId('dicebear-adventurers'); setEditAvatarSetList(generateAvatarSetList('dicebear-adventurers', 50)); setEditSelectedAvatarIndex(0); setEditSelectedSeed(null); }} style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 500, fontSize: 13, color: '#64748b', transition: 'all 0.2s ease' }}>{t('profile.remove')}</button>
            )}
          </div>
        </div>

        {/* AVATAR PICKER DROPDOWN - Rendered via portal to escape modal */}
        {showEditAvatarPicker && editAvatarSectionRef.current && (
          <>
            {createPortal(
              <div
                style={{
                  position: 'fixed',
                  ...getEditDropdownPosition(),
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
                {(() => {
                  const currentAvatarSetId = editAvatarSetId || 'dicebear-adventurers';
                  const currentAvatarSetList = editAvatarSetList.length > 0 ? editAvatarSetList : generateAvatarSetList('dicebear-adventurers', 50);
                  const currentAvatarSetName = AVATAR_SETS.find(s => s.id === currentAvatarSetId)?.name || 'Adventurers';

                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                          {currentAvatarSetName} Avatars
                        </div>
                        <button
                          onClick={() => setShowEditAvatarPicker(false)}
                          style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#64748b', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                          onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
                          onMouseLeave={(e) => e.target.style.background = '#f1f5f9'}
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', justifyItems: 'center', width: '100%', overflowY: 'auto', maxHeight: '320px', paddingRight: '4px' }}>
                        {currentAvatarSetList.map((avatar) => (
                          <button
                            key={avatar.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditSelectedAvatarIndex(avatar.index);
                              setEditSelectedSeed(null);
                              setEditStudentAvatar(null);
                              setEditAvatarSetId(currentAvatarSetId);
                              setEditAvatarSetList(currentAvatarSetList);
                              setShowEditAvatarPicker(false);
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
                              ...(editSelectedAvatarIndex === avatar.index ? styles.avatarOptionSelected : {}),
                              ...(hoveredEditChar === avatar.id ? { transform: 'scale(1.1)', zIndex: 10, boxShadow: '0 8px 16px rgba(0,0,0,0.15)' } : {})
                            }}
                            title={`${avatar.setName} #${avatar.index + 1}`}
                          >
                            <img src={avatar.url} alt={`Avatar ${avatar.index}`} style={{ width: 36, height: 36, borderRadius: 6 }} />
                          </button>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>,
              document.body
            )}
          </>
        )}

        <input autoFocus placeholder={t('edit_student.student_name')} value={editStudentName} onChange={(e) => setEditStudentName(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: 16, outline: 'none', fontSize: 14, color: '#334155', transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }} onFocus={(e) => { e.target.style.borderColor = '#4CAF50'; e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }} />

        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button style={{ padding: '14px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 600, fontSize: 14, cursor: 'pointer', flex: 1, transition: 'all 0.2s ease' }} onClick={onClose}>{t('edit_student.cancel')}</button>
          <button
            data-save-student-btn
            style={{
              padding: '14px 20px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: 14,
              flex: 1,
              opacity: editStudentName.trim() ? 1 : 0.5,
              cursor: editStudentName.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease'
            }}
            onClick={handleSaveStudentEdit}
            disabled={!editStudentName.trim()}
          >{t('edit_student.save_changes')}</button>
        </div>
      </div>
    </div>
  );
}
