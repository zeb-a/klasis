import { useState, useCallback, useEffect, useMemo } from 'react';
import { X, Upload, Shuffle, GraduationCap, Palette, Trash2 } from 'lucide-react';
import SafeAvatar from './SafeAvatar';
import { useTranslation } from '../i18n';
import { useToast } from './Toast';
import { useTheme } from '../ThemeContext';
import api from '../services/api';
import { avatarByCharacter, AVATAR_OPTIONS } from '../utils/avatar';

/**
 * Add / edit / delete class — glass-style modals aligned with ProfileModal.
 */
export default function TeacherClassModals({
  classes,
  user,
  updateClasses,
  updateClassesAndSave,
  addModalOpen,
  onCloseAddModal,
  isDark: isDarkProp,
  registerClassActions,
  onClassCreated,
  onDeletedClass
}) {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { isDark: themeDark } = useTheme();
  const isDark = isDarkProp ?? themeDark;

  const [editingClassId, setEditingClassId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [newClassName, setNewClassName] = useState('');
  const [newClassAvatar, setNewClassAvatar] = useState(null);
  const [newClassGrade, setNewClassGrade] = useState('');
  const [newPresetId, setNewPresetId] = useState(AVATAR_OPTIONS[0].name);
  const [newClassBackgroundColor, setNewClassBackgroundColor] = useState('');
  const [showPresetPicker, setShowPresetPicker] = useState(false);

  const [editingClassName, setEditingClassName] = useState('');
  const [editingClassAvatar, setEditingClassAvatar] = useState(null);
  const [editingClassGrade, setEditingClassGrade] = useState('');
  const [editPresetId, setEditPresetId] = useState(AVATAR_OPTIONS[0].name);
  const [editingClassBackgroundColor, setEditingClassBackgroundColor] = useState('');
  const [showEditPresetPicker, setShowEditPresetPicker] = useState(false);

  // Grade options from Pre-K to K-12
  const GRADE_OPTIONS = [
    { value: 'pre-k', label: 'Pre-K' },
    { value: 'kindergarten', label: 'Kindergarten' },
    { value: '1st', label: '1st Grade' },
    { value: '2nd', label: '2nd Grade' },
    { value: '3rd', label: '3rd Grade' },
    { value: '4th', label: '4th Grade' },
    { value: '5th', label: '5th Grade' },
    { value: '6th', label: '6th Grade' },
    { value: '7th', label: '7th Grade' },
    { value: '8th', label: '8th Grade' },
    { value: '9th', label: '9th Grade' },
    { value: '10th', label: '10th Grade' },
    { value: '11th', label: '11th Grade' },
    { value: '12th', label: '12th Grade' }
  ];

  // Background color options
  const BACKGROUND_COLORS = [
    { value: '', label: 'Default', color: '#F4F1EA' },
    { value: '#FEF3C7', label: 'Warm Yellow', color: '#FEF3C7' },
    { value: '#DBEAFE', label: 'Sky Blue', color: '#DBEAFE' },
    { value: '#E9D5FF', label: 'Lavender', color: '#E9D5FF' },
    { value: '#FCE7F3', label: 'Pink', color: '#FCE7F3' },
    { value: '#D1FAE5', label: 'Mint', color: '#D1FAE5' },
    { value: '#FED7AA', label: 'Peach', color: '#FED7AA' },
    { value: '#E5E7EB', label: 'Light Gray', color: '#E5E7EB' },
    { value: '#1F2937', label: 'Dark Gray', color: '#1F2937' },
    { value: '#1E293B', label: 'Dark Blue', color: '#1E293B' },
    { value: '#18181B', label: 'Black', color: '#18181B' }
  ];

  const theme = useMemo(() => ({
    overlayBg: isDark ? 'rgba(15, 23, 42, 0.38)' : 'rgba(15, 23, 42, 0.14)',
    shell: isDark
      ? {
          background:
            'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 50%, rgba(30, 41, 59, 0.95) 100%)',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.03) inset, 0 20px 40px -12px rgba(0,0,0,0.4), 0 0 60px -20px rgba(0,0,0,0.2)',
        }
      : {
          background:
            'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 50%, rgba(241, 245, 249, 0.98) 100%)',
          border: '1px solid rgba(203, 213, 225, 0.4)',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.8) inset, 0 20px 40px -12px rgba(0, 0, 0, 0.08), 0 0 60px -20px rgba(0, 0, 0, 0.04)',
        },
    muted: isDark ? 'rgba(148, 163, 184, 0.9)' : '#64748b',
    heading: isDark ? '#f1f5f9' : '#0f172a',
    sub: isDark ? '#94a3b8' : '#64748b',
    fieldBg: isDark ? 'rgba(15, 23, 42, 0.55)' : '#f8fafc',
    fieldBorder: isDark ? 'rgba(148, 163, 184, 0.22)' : '#e2e8f0',
    chip: isDark ? 'rgba(34, 197, 94, 0.14)' : 'rgba(34, 197, 94, 0.12)',
    sectionLine: isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.08)',
    dropzoneBg: isDark ? 'rgba(15, 23, 42, 0.35)' : 'rgba(248, 250, 252, 0.9)',
    presetTileBg: isDark ? 'rgba(15, 23, 42, 0.45)' : '#ffffff',
    presetTileBorder: isDark ? 'rgba(148, 163, 184, 0.2)' : '#e2e8f0',
  }), [isDark]);

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: theme.sub,
    marginBottom: 6,
  };

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
    transition: 'border-color 0.15s linear',
    ...extra,
  });

  const resetAddForm = useCallback(() => {
    setNewClassName('');
    setNewClassAvatar(null);
    setNewClassGrade('');
    setNewPresetId(AVATAR_OPTIONS[0].name);
    setNewClassBackgroundColor('');
    setShowPresetPicker(false);
  }, []);

  const applyPresetToName = (name, presetName, setAvatar) => {
    setAvatar(avatarByCharacter(presetName));
  };

  const handleShuffleNew = () => {
    const i = Math.floor(Math.random() * AVATAR_OPTIONS.length);
    const name = AVATAR_OPTIONS[i].name;
    setNewPresetId(name);
    if (!newClassAvatar || newClassAvatar.startsWith('data:image/svg')) {
      applyPresetToName(newClassName, name, setNewClassAvatar);
    }
  };

  const handleCreateClass = () => {
    if (!newClassName.trim()) return;
    let avatar = newClassAvatar;
    if (!avatar || (typeof avatar === 'string' && avatar.startsWith('data:image/svg'))) {
      avatar = avatarByCharacter(newPresetId);
    }
    const newClass = {
      id: Date.now().toString(),
      name: newClassName.trim(),
      avatar,
      avatar_character: '',
      avatar_seed: '',
      background_color: newClassBackgroundColor || '',
      grade: newClassGrade,
      students: []
    };
    updateClassesAndSave((prev) => [...prev, newClass]);
    onCloseAddModal?.();
    resetAddForm();
    onClassCreated?.(newClass.id);
    addToast(t('teacher_portal.class_created') || 'Class created');
  };

  const classToEdit = classes?.find((c) => c.id === editingClassId);
  const classToDelete = classes?.find((c) => c.id === deleteConfirmId);

  const handleSaveEdit = () => {
    if (!editingClassName.trim() || !editingClassId) return;
    let avatar = editingClassAvatar;
    if (!avatar || (typeof avatar === 'string' && avatar.startsWith('data:image/svg'))) {
      avatar = avatarByCharacter(editPresetId);
    }
    updateClassesAndSave((prev) =>
      prev.map((cls) =>
        cls.id === editingClassId
          ? {
              ...cls,
              name: editingClassName.trim(),
              avatar,
              avatar_character: '',
              avatar_seed: '',
              background_color: editingClassBackgroundColor,
              grade: editingClassGrade
            }
          : cls
      )
    );
    setEditingClassId(null);
    addToast(t('teacher_portal.class_updated') || 'Class updated');
  };

  const handleDeleteClass = (classId) => {
    updateClassesAndSave((prev) => prev.filter((cls) => cls.id !== classId));
    setDeleteConfirmId(null);
    onDeletedClass?.(classId);
    addToast(t('teacher_portal.class_deleted') || 'Class deleted');
  };

  const openEdit = useCallback((cls) => {
    if (!cls) return;
    setEditingClassId(cls.id);
    setEditingClassName(cls.name);
    setEditingClassAvatar(cls.avatar || null);
    setEditingClassGrade(cls.grade || '');
    setEditingClassBackgroundColor(cls.background_color || '');
    setEditPresetId(AVATAR_OPTIONS[0].name);
    setShowEditPresetPicker(false);
  }, []);

  useEffect(() => {
    if (!registerClassActions) return undefined;
    registerClassActions({
      openEdit,
      requestDelete: (classId) => setDeleteConfirmId(classId)
    });
    return () => registerClassActions(null);
  }, [registerClassActions, openEdit]);

  const handleImportData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!imported || !Array.isArray(imported.classes)) throw new Error('Invalid');
        if (!window.confirm('Merge backup with your current classes?')) return;
        const mergedClasses = [...(classes || [])];
        imported.classes.forEach((importedCls) => {
          if (mergedClasses.some((c) => c.name.toLowerCase() === (importedCls.name || '').toLowerCase())) return;
          mergedClasses.push({
            ...importedCls,
            id: Date.now() + Math.random(),
            created: undefined,
            updated: undefined,
            collectionId: undefined,
            collectionName: undefined
          });
        });
        updateClasses(mergedClasses);
        if (user?.email) {
          await api.saveClasses(user.email, mergedClasses, []);
        }
        addToast('Import complete. Reloading…', 'success');
        window.location.reload();
      } catch {
        addToast('Could not import file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const renderPresetGrid = (selectedId, onSelect) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 10,
        maxHeight: 220,
        overflowY: 'auto',
        padding: 4,
      }}
    >
      {AVATAR_OPTIONS.map((av) => {
        const src = avatarByCharacter(av.name);
        const active = av.name === selectedId;
        return (
          <button
            key={av.name}
            type="button"
            onClick={() => onSelect(av.name)}
            title={av.label}
            style={{
              border: active ? '2px solid #22c55e' : `2px solid ${theme.presetTileBorder}`,
              borderRadius: 12,
              padding: 4,
              cursor: 'pointer',
              background: active ? 'rgba(34,197,94,0.12)' : theme.presetTileBg,
              transition: 'transform 0.12s linear',
            }}
          >
            <img src={src} alt="" style={{ width: '100%', aspectRatio: '1', borderRadius: 8, display: 'block' }} />
          </button>
        );
      })}
    </div>
  );

  const formBody = (mode) => {
    const isAdd = mode === 'add';
    const nameValue = isAdd ? newClassName : editingClassName;
    const setName = isAdd ? setNewClassName : setEditingClassName;
    const avatarValue = isAdd ? newClassAvatar : editingClassAvatar;
    const setAvatar = isAdd ? setNewClassAvatar : setEditingClassAvatar;
    const gradeValue = isAdd ? newClassGrade : editingClassGrade;
    const setGrade = isAdd ? setNewClassGrade : setEditingClassGrade;
    const presetId = isAdd ? newPresetId : editPresetId;
    const setPreset = isAdd ? setNewPresetId : setEditPresetId;
    const showPicker = isAdd ? showPresetPicker : showEditPresetPicker;
    const setShowPicker = isAdd ? setShowPresetPicker : setShowEditPresetPicker;
    const bgColor = isAdd ? newClassBackgroundColor : editingClassBackgroundColor;
    const setBg = isAdd ? setNewClassBackgroundColor : setEditingClassBackgroundColor;
    const onSave = isAdd ? handleCreateClass : handleSaveEdit;
    const uploadId = isAdd ? 'upload-new-class' : `upload-edit-${editingClassId}`;
    const preview = avatarValue || avatarByCharacter(presetId);

    if (showPicker) {
      return (
        <div style={{ padding: '0 4px' }}>
          <p style={{ fontSize: 13, color: theme.sub, marginBottom: 14, lineHeight: 1.5 }}>
            {t('teacher_portal.preset_avatar_hint')}
          </p>
          {renderPresetGrid(presetId, (id) => {
            setPreset(id);
            if (!avatarValue || (typeof avatarValue === 'string' && avatarValue.startsWith('data:image/svg'))) {
              applyPresetToName(nameValue, id, setAvatar);
            }
          })}
          <button
            type="button"
            onClick={() => setShowPicker(false)}
            style={{
              marginTop: 16,
              width: '100%',
              padding: '12px 16px',
              borderRadius: 12,
              border: `1px solid ${theme.fieldBorder}`,
              background: theme.fieldBg,
              color: theme.heading,
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            {t('general.done')}
          </button>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              style={{
                padding: 3,
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #22c55e, #6366f1)',
                boxShadow: isDark ? '0 10px 28px rgba(34,197,94,0.2)' : '0 8px 24px rgba(99,102,241,0.2)',
              }}
            >
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 17,
                  overflow: 'hidden',
                  border: `3px solid ${isDark ? '#0f172a' : '#fff'}`,
                  background: theme.fieldBg,
                }}
              >
                <SafeAvatar src={preview} name={nameValue} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setShowPicker(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#22c55e',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {t('teacher_portal.change')}
              </button>
              <button
                type="button"
                onClick={isAdd ? handleShuffleNew : () => {
                  const i = Math.floor(Math.random() * AVATAR_OPTIONS.length);
                  const n = AVATAR_OPTIONS[i].name;
                  setEditPresetId(n);
                  if (!editingClassAvatar || editingClassAvatar.startsWith('data:image/svg')) {
                    applyPresetToName(editingClassName, n, setEditingClassAvatar);
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  background: 'none',
                  border: 'none',
                  color: theme.muted,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Shuffle size={12} />
                {t('teacher_portal.shuffle')}
              </button>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label htmlFor={`class-name-${mode}`} style={labelStyle}>{t('teacher_portal.class_name')}</label>
            <input
              id={`class-name-${mode}`}
              value={nameValue}
              placeholder={isAdd ? t('teacher_portal.name_placeholder') : ''}
              onChange={(e) => {
                setName(e.target.value);
                if (!avatarValue || (typeof avatarValue === 'string' && avatarValue.startsWith('data:image/svg'))) {
                  applyPresetToName(e.target.value, presetId, setAvatar);
                }
              }}
              autoFocus={isAdd}
              style={inputStyle()}
            />
            
            {/* Grade Selection */}
            <div style={{ marginTop: 12 }}>
              <label htmlFor={`class-grade-${mode}`} style={labelStyle}>Grade</label>
              <select
                id={`class-grade-${mode}`}
                value={gradeValue}
                onChange={(e) => setGrade(e.target.value)}
                style={{
                  ...inputStyle(),
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 8px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '16px',
                  paddingRight: '36px'
                }}
              >
                <option value="">Select Grade</option>
                {GRADE_OPTIONS.map((grade) => (
                  <option key={grade.value} value={grade.value}>
                    {grade.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor={uploadId} style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Upload size={14} style={{ opacity: 0.8 }} />
            {t('teacher_portal.upload_photo')}
          </label>
          <label
            htmlFor={uploadId}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              minHeight: 100,
              padding: 16,
              borderRadius: 14,
              border: `2px dashed ${theme.fieldBorder}`,
              background: theme.dropzoneBg,
              cursor: 'pointer',
              transition: 'border-color 0.15s linear',
            }}
          >
            <Upload size={22} color={theme.muted} />
            <span style={{ fontSize: 14, fontWeight: 600, color: theme.heading }}>{t('teacher_portal.click_upload')}</span>
          </label>
          <input
            id={uploadId}
            type="file"
            accept="image/*"
            onChange={(ev) => {
              const f = ev.target.files?.[0];
              if (!f) return;
              const reader = new FileReader();
              reader.onload = () => setAvatar(reader.result);
              reader.readAsDataURL(f);
            }}
            style={{ display: 'none' }}
          />
        </div>

        <div>
          <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Palette size={14} style={{ opacity: 0.8 }} />
            {t('teacher_portal.class_dashboard_bg')}
          </label>
          <div style={{ 
            display: 'flex', 
            gap: 10, 
            alignItems: 'center',
            marginTop: 8
          }}>
            <div style={{
              position: 'relative',
              width: 48,
              height: 48
            }}>
              <input
                type="color"
                value={bgColor || '#F4F1EA'}
                onChange={(e) => setBg(e.target.value)}
                style={{
                  width: '100%',
                  height: '100%',
                  padding: 0,
                  borderRadius: 12,
                  border: `2px solid ${theme.fieldBorder}`,
                  cursor: 'pointer',
                  background: 'transparent',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.15s linear'
                }}
                aria-label={t('teacher_portal.class_dashboard_bg')}
              />
              <div style={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}>
                <Palette size={10} color="white" />
              </div>
            </div>
            
            <div style={{
              flex: 1,
              height: 48,
              borderRadius: 12,
              border: `2px solid ${theme.fieldBorder}`,
              background: bgColor || '#F4F1EA',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.15s linear'
            }}>
              <div style={{
                position: 'absolute',
                top: 4,
                right: 4,
                fontSize: 11,
                fontWeight: 600,
                color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
                background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
                padding: '2px 6px',
                borderRadius: 4,
              }}>
                {bgColor || '#F4F1EA'}
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={!nameValue.trim()}
          style={{
            width: '100%',
            marginTop: 4,
            padding: '14px 20px',
            borderRadius: 14,
            border: 'none',
            fontSize: 16,
            fontWeight: 800,
            cursor: nameValue.trim() ? 'pointer' : 'not-allowed',
            opacity: nameValue.trim() ? 1 : 0.5,
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 45%, #15803d 100%)',
            color: '#fff',
            boxShadow: '0 10px 28px -6px rgba(34, 197, 94, 0.45)',
          }}
        >
          {isAdd ? t('teacher_portal.create') : t('teacher_portal.save')}
        </button>
      </div>
    );
  };

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: theme.overlayBg,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 300000,
    padding: 16,
  };

  const formShell = (title, titleId, hint, onClose, children) => (
    <div
      role="presentation"
      style={overlayStyle}
      className="modal-overlay-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-glass-dialog="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...theme.shell,
          borderRadius: 22,
          width: 'min(100%, 480px)',
          maxWidth: 480,
          maxHeight: 'min(92vh, 720px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
        className="animated-modal-content modal-animate-center"
      >
        <div
          style={{
            height: 4,
            width: '100%',
            flexShrink: 0,
            background: 'linear-gradient(90deg, #22c55e, #6366f1 50%, #8b5cf6)',
          }}
        />
        <div style={{ padding: '18px 22px 12px', position: 'relative', flexShrink: 0 }}>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('general.close')}
            style={{
              position: 'absolute',
              top: 10,
              right: 14,
              width: 40,
              height: 40,
              borderRadius: 12,
              border: `1px solid ${theme.fieldBorder}`,
              background: isDark ? 'rgba(15,23,42,0.45)' : 'rgba(248,250,252,0.85)',
              color: theme.muted,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingRight: 48 }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: 14,
                background: theme.chip,
                color: isDark ? '#86efac' : '#15803d',
              }}
            >
              <GraduationCap size={22} />
            </span>
            <div>
              <h2 id={titleId} style={{ margin: 0, fontSize: 21, fontWeight: 800, letterSpacing: '-0.02em', color: theme.heading }}>
                {title}
              </h2>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: theme.sub, lineHeight: 1.45, maxWidth: 360 }}>
                {hint}
              </p>
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: theme.sectionLine, margin: '0 22px' }} />
        <div style={{ padding: '20px 22px 22px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {addModalOpen && formShell(
        t('teacher_portal.create_new_class'),
        'class-modal-add-title',
        t('teacher_portal.class_modal_hint_new'),
        () => { onCloseAddModal?.(); resetAddForm(); },
        formBody('add')
      )}

      {editingClassId && classToEdit && formShell(
        t('teacher_portal.edit_class'),
        'class-modal-edit-title',
        t('teacher_portal.class_modal_hint_edit'),
        () => setEditingClassId(null),
        formBody('edit')
      )}

      {deleteConfirmId && classToDelete && (
        <div
          role="presentation"
          style={overlayStyle}
          className="modal-overlay-in"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="class-delete-title"
            data-glass-dialog="true"
            onClick={(e) => e.stopPropagation()}
            style={{
              ...theme.shell,
              borderRadius: 22,
              width: 'min(100%, 400px)',
              maxWidth: 400,
              padding: '24px 22px 22px',
              position: 'relative',
            }}
            className="animated-modal-content modal-animate-center"
          >
            <div
              style={{
                height: 3,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                borderRadius: '22px 22px 0 0',
                background: 'linear-gradient(90deg, #f87171, #ef4444)',
              }}
            />
            <button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              aria-label={t('general.close')}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 36,
                height: 36,
                borderRadius: 10,
                border: `1px solid ${theme.fieldBorder}`,
                background: isDark ? 'rgba(15,23,42,0.45)' : 'rgba(248,250,252,0.9)',
                color: theme.muted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 8 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  border: `1px solid ${isDark ? 'rgba(248,113,113,0.25)' : '#fecaca'}`,
                }}
              >
                <Trash2 size={28} color="#ef4444" strokeWidth={2} />
              </div>
              <h2 id="class-delete-title" style={{ margin: 0, fontSize: 19, fontWeight: 800, color: theme.heading }}>
                {t('teacher_portal.delete_class')}
              </h2>
              <p style={{ margin: '12px 0 20px', fontSize: 14, lineHeight: 1.55, color: theme.sub }}>
                {t('teacher_portal.delete_confirm').replace('{name}', classToDelete.name)}
              </p>
              <p style={{ margin: '0 0 20px', fontSize: 12, fontWeight: 600, color: '#f87171' }}>
                {t('teacher_portal.cannot_undo')}
              </p>
              <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                <button
                  type="button"
                  onClick={() => handleDeleteClass(deleteConfirmId)}
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: 'none',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 14,
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(239,68,68,0.35)',
                  }}
                >
                  {t('teacher_portal.delete')}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: `1px solid ${theme.fieldBorder}`,
                    background: theme.fieldBg,
                    color: theme.heading,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  {t('general.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <input id="teacher-class-import-input" type="file" accept=".json" onChange={handleImportData} style={{ display: 'none' }} />
    </>
  );
}
