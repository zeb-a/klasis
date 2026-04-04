import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { boringAvatar, fallbackInitialsDataUrl, AVATAR_OPTIONS, avatarByCharacter } from '../utils/avatar';

import { useModalKeyboard } from '../hooks/useKeyboardShortcuts';
import { Camera, X, User, Mail, Lock, KeyRound, Sparkles, Upload } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useToast } from './Toast';
import { useTheme } from '../ThemeContext';

export default function ProfileModal({ user, onSave, onClose }) {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { isDark } = useTheme();

  const [title, setTitle] = useState(user.title || '');
  const [name, setName] = useState(user.name || '');
  const [avatar, setAvatar] = useState(user.avatar || boringAvatar(user.name || user.email));

  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [uploadedAvatar, setUploadedAvatar] = useState(null);

  // Function to get selected character based on current user data
  const getSelectedCharacter = useCallback((currentUser) => {
    if (!currentUser.avatar) return '';
    for (const opt of AVATAR_OPTIONS) {
      if (currentUser.avatar === avatarByCharacter(opt.name)) return opt.name;
    }
    return '';
  }, []);

  // Initialize state
  useEffect(() => {
    setTitle(user.title || '');
    setName(user.name || '');
    setAvatar(user.avatar || boringAvatar(user.name || user.email));
    setSelectedCharacter(getSelectedCharacter(user));
    setUploadedAvatar(null);
  }, [user, getSelectedCharacter]);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [hoveredChar, setHoveredChar] = useState(null);
  const avatarSectionRef = useRef(null);
  const fileInputRef = useRef(null);
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const theme = useMemo(() => ({
    overlayBg: isDark ? 'rgba(15, 23, 42, 0.38)' : 'rgba(15, 23, 42, 0.14)',
    shell: isDark
      ? {
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 50%, rgba(30, 41, 59, 0.95) 100%)',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset, 0 20px 40px -12px rgba(0,0,0,0.4), 0 0 60px -20px rgba(0,0,0,0.2)',
        }
      : {
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 50%, rgba(241, 245, 249, 0.98) 100%)',
          border: '1px solid rgba(203, 213, 225, 0.4)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.8) inset, 0 20px 40px -12px rgba(0, 0, 0, 0.08), 0 0 60px -20px rgba(0, 0, 0, 0.04)',
        },
    muted: isDark ? 'rgba(148, 163, 184, 0.9)' : '#64748b',
    heading: isDark ? '#f1f5f9' : '#0f172a',
    sub: isDark ? '#94a3b8' : '#64748b',
    fieldBg: isDark ? 'rgba(15, 23, 42, 0.55)' : '#f8fafc',
    fieldBorder: isDark ? 'rgba(148, 163, 184, 0.2)' : '#e2e8f0',
    fieldBorderFocus: isDark ? 'rgba(129, 140, 248, 0.55)' : '#6366f1',
    chip: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)',
    sectionLine: isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.08)',
    pickerBg: isDark ? 'rgba(30, 41, 59, 0.96)' : '#ffffff',
    pickerBorder: isDark ? 'rgba(148, 163, 184, 0.25)' : '#e2e8f0',
    errorBg: isDark ? 'rgba(239, 68, 68, 0.12)' : '#fef2f2',
    errorText: isDark ? '#fca5a5' : '#b91c1c',
  }), [isDark]);

  const getDropdownPosition = useCallback(() => {
    if (!avatarSectionRef.current) return { top: 0, left: 0 };

    const rect = avatarSectionRef.current.getBoundingClientRect();
    const pickerW = Math.min(360, window.innerWidth - 24);
    let left = rect.left + rect.width / 2 - pickerW / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - pickerW - 12));
    const top = Math.min(rect.bottom + 12, window.innerHeight - 280);
    return { top, left, width: pickerW };
  }, []);

  const handleSaveWithValidation = () => {
    if (password && password !== confirm) {
      setError(t('profile.passwords_no_match'));
      return;
    }
    if (!name.trim()) {
      setError(t('profile.name_empty'));
      return;
    }
    handleSave({ preventDefault: () => {} });
  };

  useModalKeyboard(handleSaveWithValidation, onClose, !showAvatarPicker);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    if (password && password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSaving(true);
    try {
      let avatarToSave = avatar;
      if (selectedCharacter) {
        avatarToSave = avatarByCharacter(selectedCharacter);
      }
      if (uploadedAvatar) {
        avatarToSave = uploadedAvatar;
      }
      await onSave({ id: user.id, title, name, avatar: avatarToSave, password, oldPassword });

      if (password) {
        addToast('Password changed successfully!', 'success');
      }
      if (title !== user.title || name !== user.name || avatarToSave !== user.avatar) {
        addToast('Profile updated successfully!', 'success');
      }
      onClose();
    } catch (err) {
      setError(err.message || t('profile.failed_update'));
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setError(t('profile.image_too_large'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
      setUploadedAvatar(reader.result);
      setSelectedCharacter('');
    };
    reader.onerror = () => setError(t('profile.failed_read'));
    reader.readAsDataURL(file);
  };

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    setShowAvatarPicker(!showAvatarPicker);
  };

  const currentAvatar = uploadedAvatar || (selectedCharacter ? avatarByCharacter(selectedCharacter) : avatar);

  const inputStyle = (extra = {}) => ({
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 14px',
    borderRadius: 12,
    border: `1px solid ${theme.fieldBorder}`,
    fontSize: 15,
    outline: 'none',
    background: theme.fieldBg,
    color: theme.heading,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    ...extra,
  });

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: theme.sub,
    marginBottom: 6,
  };

  const sectionLabel = (Icon, text) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: 10,
          background: theme.chip,
          color: isDark ? '#a5b4fc' : '#4f46e5',
        }}
      >
        <Icon size={17} strokeWidth={2} />
      </span>
      <span style={{ fontSize: 14, fontWeight: 700, color: theme.heading }}>{text}</span>
    </div>
  );

  return createPortal(
    <div
      role="presentation"
      style={{
        position: 'fixed',
        inset: 0,
        background: theme.overlayBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px 16px',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      className="modal-overlay-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        onClick={(e) => e.stopPropagation()}
        data-glass-dialog="true"
        style={{
          ...theme.shell,
          borderRadius: 22,
          width: 'min(100%, 440px)',
          maxWidth: 440,
          maxHeight: 'min(90vh, 640px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          backdropFilter: 'blur(22px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(22px) saturate(1.2)',
        }}
        className="animated-modal-content modal-animate-center"
      >
        {/* Top accent */}
        <div
          style={{
            height: 4,
            width: '100%',
            flexShrink: 0,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6 45%, #22c55e)',
            opacity: 0.95,
          }}
        />

        <div style={{ padding: '20px 22px 16px', flexShrink: 0, position: 'relative' }}>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('general.close')}
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 40,
              height: 40,
              borderRadius: 12,
              border: `1px solid ${theme.fieldBorder}`,
              background: isDark ? 'rgba(15,23,42,0.5)' : 'rgba(248,250,252,0.9)',
              color: theme.muted,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s, color 0.2s, transform 0.15s',
            }}
          >
            <X size={20} strokeWidth={2} />
          </button>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingRight: 44 }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: 14,
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(34,197,94,0.15))',
                color: isDark ? '#c4b5fd' : '#5b21b6',
              }}
            >
              <Sparkles size={22} />
            </span>
            <div>
              <h2 id="profile-modal-title" style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: theme.heading }}>
                {t('profile.edit_profile')}
              </h2>
              <p style={{ margin: '6px 0 0', fontSize: 13, lineHeight: 1.45, color: theme.sub, maxWidth: 300 }}>
                {t('profile.modal_subtitle')}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSave}
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            padding: '0 22px 22px',
            gap: 0,
          }}
        >
          {/* Avatar */}
          <div
            ref={avatarSectionRef}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px 0 20px',
              position: 'relative',
              overflow: 'visible',
            }}
          >
            <button
              type="button"
              onClick={handleAvatarClick}
              style={{
                position: 'relative',
                padding: 0,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderRadius: '50%',
              }}
            >
              <div
                style={{
                  padding: 3,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7 50%, #22c55e)',
                  boxShadow: isDark ? '0 12px 40px rgba(99,102,241,0.25)' : '0 12px 32px rgba(99,102,241,0.2)',
                }}
              >
                <img
                  src={currentAvatar}
                  alt=""
                  style={{
                    width: 92,
                    height: 92,
                    borderRadius: '50%',
                    display: 'block',
                    objectFit: 'cover',
                    background: isDark ? '#0f172a' : '#f1f5f9',
                    border: `3px solid ${isDark ? '#1e293b' : '#fff'}`,
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackInitialsDataUrl(name);
                  }}
                />
              </div>
              <span
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(34,197,94,0.45)',
                  border: `2px solid ${isDark ? '#1e293b' : '#fff'}`,
                }}
              >
                <Camera size={15} />
              </span>
            </button>
            <p style={{ margin: '14px 0 4px', fontSize: 13, fontWeight: 600, color: theme.heading }}>
              {t('profile.change_avatar')}
            </p>
            <input ref={fileInputRef} id="profile-avatar-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 8,
                padding: '10px 18px',
                borderRadius: 12,
                border: `1px solid ${theme.fieldBorder}`,
                background: theme.fieldBg,
                color: theme.heading,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'transform 0.15s, border-color 0.2s',
              }}
            >
              <Upload size={16} />
              {uploadedAvatar ? t('profile.change_photo') : t('profile.upload_photo')}
            </button>
            {uploadedAvatar && (
              <button
                type="button"
                onClick={() => { setUploadedAvatar(null); setSelectedCharacter(''); }}
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: theme.muted,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                }}
              >
                {t('profile.remove')}
              </button>
            )}
          </div>

          {showAvatarPicker && avatarSectionRef.current && createPortal(
            <div
              data-glass-dialog="true"
              style={{
                position: 'fixed',
                ...getDropdownPosition(),
                background: isDark ? 'rgba(30, 41, 59, 0.55)' : 'rgba(255,255,255,0.82)',
                border: `1px solid ${theme.pickerBorder}`,
                borderRadius: 16,
                boxShadow: isDark ? '0 24px 48px rgba(0,0,0,0.45)' : '0 20px 40px rgba(15,23,42,0.12)',
                zIndex: 100001,
                padding: 14,
                backdropFilter: 'blur(18px) saturate(1.15)',
                WebkitBackdropFilter: 'blur(18px) saturate(1.15)',
              }}
              onClick={(e) => e.stopPropagation()}
              className="animated-modal-content modal-animate-scale"
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: theme.sub, marginBottom: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {t('profile.pick_character')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, width: '100%' }}>
                {AVATAR_OPTIONS.map((char) => (
                  <button
                    key={char.name}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCharacter(char.name);
                      setUploadedAvatar(null);
                      setShowAvatarPicker(false);
                    }}
                    onMouseEnter={() => setHoveredChar(char.name)}
                    onMouseLeave={() => setHoveredChar(null)}
                    style={{
                      position: 'relative',
                      background: isDark ? 'rgba(15,23,42,0.6)' : '#f8fafc',
                      border: selectedCharacter === char.name ? '2px solid #6366f1' : `2px solid ${theme.fieldBorder}`,
                      borderRadius: 12,
                      padding: 6,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      outline: 'none',
                      transition: 'transform 0.15s, box-shadow 0.2s',
                      boxShadow: selectedCharacter === char.name ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
                      ...(hoveredChar === char.name ? { transform: 'scale(1.06)' } : {}),
                    }}
                    title={char.label}
                  >
                    <img
                      src={avatarByCharacter(char.name)}
                      alt=""
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        objectFit: 'cover',
                        ...(hoveredChar === char.name
                          ? { transform: 'scale(4)', position: 'absolute', bottom: 44, left: '50%', marginLeft: -20, zIndex: 20, boxShadow: '0 12px 24px rgba(0,0,0,0.2)', borderRadius: 8 }
                          : {}),
                      }}
                    />
                    <span style={{ fontSize: 7, color: theme.muted, textTransform: 'capitalize', fontWeight: 600 }}>{char.name}</span>
                  </button>
                ))}
              </div>
            </div>,
            document.body
          )}

          <div style={{ height: 1, background: theme.sectionLine, margin: '4px 0 18px' }} />

          {sectionLabel(User, t('profile.section_identity'))}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: '0 0 88px' }}>
              <label htmlFor="profile-title" style={labelStyle}>Title</label>
              <select
                id="profile-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle({ padding: '12px 10px', cursor: 'pointer' })}
              >
                <option value="">—</option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Miss">Miss</option>
                <option value="Ms.">Ms.</option>
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <label htmlFor="profile-name" style={labelStyle}>{t('profile.full_name')}</label>
              <input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('profile.full_name')} style={inputStyle()} autoComplete="name" />
            </div>
          </div>

          {sectionLabel(Mail, t('profile.email'))}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <input
              type="text"
              value={user.email || ''}
              readOnly
              autoComplete="username"
              placeholder={t('profile.email')}
              aria-label={t('profile.email')}
              style={inputStyle({ opacity: 0.85, cursor: 'not-allowed' })}
            />
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: theme.muted, pointerEvents: 'none' }}>
              <Lock size={16} />
            </span>
          </div>

          <div style={{ height: 1, background: theme.sectionLine, margin: '8px 0 18px' }} />

          {sectionLabel(KeyRound, t('profile.section_security'))}
          <p style={{ margin: '-6px 0 14px', fontSize: 12, lineHeight: 1.5, color: theme.sub }}>
            {t('profile.password_hint')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <div>
              <label htmlFor="profile-old-pw" style={labelStyle}>{t('profile.current_password')}</label>
              <input id="profile-old-pw" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder={t('profile.current_password')} autoComplete="current-password" style={inputStyle()} />
            </div>
            <div>
              <label htmlFor="profile-new-pw" style={labelStyle}>{t('profile.new_password')}</label>
              <input id="profile-new-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('profile.new_password')} autoComplete="new-password" style={inputStyle()} />
            </div>
            <div>
              <label htmlFor="profile-confirm-pw" style={labelStyle}>{t('profile.confirm_new_password')}</label>
              <input id="profile-confirm-pw" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder={t('profile.confirm_new_password')} autoComplete="new-password" style={inputStyle()} />
            </div>
          </div>

          {error && (
            <div
              role="alert"
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                background: theme.errorBg,
                color: theme.errorText,
                fontSize: 13,
                fontWeight: 600,
                textAlign: 'center',
                marginBottom: 14,
                border: `1px solid ${isDark ? 'rgba(248,113,113,0.25)' : '#fecaca'}`,
              }}
            >
              {error}
            </div>
          )}

          <button
            data-enter-submit
            type="submit"
            disabled={saving}
            style={{
              marginTop: 'auto',
              width: '100%',
              padding: '14px 20px',
              borderRadius: 14,
              border: 'none',
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: '0.02em',
              cursor: saving ? 'wait' : 'pointer',
              opacity: saving ? 0.75 : 1,
              background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #4f46e5 100%)',
              color: '#ffffff',
              boxShadow: '0 10px 28px -6px rgba(99, 102, 241, 0.55)',
              transition: 'transform 0.15s ease, box-shadow 0.2s ease',
            }}
          >
            {saving ? t('profile.saving') : t('profile.save_changes')}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
