import { lazy, Suspense, useState, useCallback, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Archive,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Edit2,
  GripVertical,
  MoreVertical,
  Plus,
  Trash2,
  Upload,
  X,
  StickyNote,
  Type
} from 'lucide-react';
import SafeAvatar from './SafeAvatar';
import { useTheme } from '../ThemeContext';
import { useTranslation } from '../i18n';
import TeacherClassModals from './TeacherClassModals';
import TeacherRailCollapsibleTools from './TeacherRailCollapsibleTools';
import ProfileModal from './ProfileModal';
import { boringAvatar } from '../utils/avatar';
import api from '../services/api';

const ClassDashboard = lazy(() => import('./ClassDashboard')); // Cache bust: v2

export const TEACHER_CLASS_RAIL_PX = 280;
export const TEACHER_CLASS_RAIL_COLLAPSED_PX = 68;

/** Bottom inset for scroll areas: floating dock + margin (expanded vs collapsed). */
export const DOCK_FLOAT_MARGIN_PX = 16;
/** Icon-only dock may wrap to two rows; keep content clear of floating pill. */
export const DOCK_RESERVE_EXPANDED_PX = 120;
export const DOCK_RESERVE_COLLAPSED_PX = 52;

/** Fixed menu for class row actions; height used to flip above anchor when needed. */
const RAIL_CLASS_MENU_W = 168;
const RAIL_CLASS_MENU_H = 148;
const AUTO_ARCHIVE_INACTIVITY_DAYS = 30;
const AUTO_ARCHIVE_MS = AUTO_ARCHIVE_INACTIVITY_DAYS * 24 * 60 * 60 * 1000;

function computeRailClassMenuPosition(anchorRect) {
  const gap = 6;
  let top = anchorRect.bottom + gap;
  let left = anchorRect.right - RAIL_CLASS_MENU_W;
  left = Math.max(8, Math.min(left, window.innerWidth - RAIL_CLASS_MENU_W - 8));
  if (top + RAIL_CLASS_MENU_H > window.innerHeight - 8) {
    top = Math.max(8, anchorRect.top - RAIL_CLASS_MENU_H - gap);
  }
  return { top, left };
}

/**
 * Single merged page: account header, collapsible class rail, class dashboard, bottom tools.
 */
export default function TeacherWorkspace({
  view: _view,
  activeClass,
  activeClassId,
  classes,
  user,
  onSelectClass,
  onBackFromDashboard,
  onAddClass: _onAddClass,
  onLogout,
  onEditProfile,
  onUpdateUser,
  updateClasses,
  updateClassesAndSave,
  onOpenTorenado: _onOpenTorenado,
  onOpenLessonPlanner,
  behaviors,
  refreshClasses,
  onUpdateBehaviors,
  onOpenAssignments,
  onOpenGames,
  showProfileModal,
  setShowProfileModal,
  onOpenGameFromDashboard,
  onOpenEggRoad,
  onOpenSettings,
  onOpenSetup: _onOpenSetup
}) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [bottomToolbarHost, setBottomToolbarHost] = useState(null);
  const [dockCollapsed, setDockCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
  });
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [classActions, setClassActions] = useState(null);
  const [archivedClassPrompt, setArchivedClassPrompt] = useState(null);
  const [archivedSectionCollapsed, setArchivedSectionCollapsed] = useState(true);
  /** Class row ⋮ menu: portaled to body so it is not clipped by the scroll area. */
  const [classActionsMenu, setClassActionsMenu] = useState(null);

  // --- Class order drag-and-drop ---
  const orderKey = user?.email ? `classABC_classOrder_${user.email}` : null;
  const [classOrder, setClassOrder] = useState(() => {
    if (!orderKey) return [];
    try { return JSON.parse(localStorage.getItem(orderKey) || '[]'); }
    catch { return []; }
  });
  const dragIdRef = useRef(null);
  const currentOrderRef = useRef([]);
  const [draggingId, setDraggingId] = useState(null);

  // On mount: try to load from backend; backend wins over localStorage
  useEffect(() => {
    if (!user?.id) return;
    api.getClassOrder(user.id).then((remoteOrder) => {
      if (Array.isArray(remoteOrder) && remoteOrder.length > 0) {
        setClassOrder(remoteOrder);
        if (orderKey) localStorage.setItem(orderKey, JSON.stringify(remoteOrder));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Close the portaled class action menu when clicking anywhere outside it.
  // This avoids a full-screen overlay that can trigger dark-mode backdrop blur.
  useEffect(() => {
    if (!classActionsMenu) return;
    const onPointerDown = (e) => {
      const target = e.target;
      if (target && typeof target.closest === 'function') {
        if (target.closest('[data-class-actions-menu]')) return;
        if (target.closest('[data-class-actions-button]')) return;
      }
      setClassActionsMenu(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [classActionsMenu]);

  const railWidth = railCollapsed ? 0 : TEACHER_CLASS_RAIL_PX;

  const handleImportClick = useCallback(() => {
    document.getElementById('teacher-class-import-input')?.click?.();
  }, []);

  const activeClasses = (classes || []).filter((c) => !c.archived);

  const orderedActiveClasses = useMemo(() => {
    if (!classOrder.length) return activeClasses;
    const idx = {};
    classOrder.forEach((id, i) => { idx[String(id)] = i; });
    return [...activeClasses].sort((a, b) => {
      const ai = idx[String(a.id)] ?? 9999;
      const bi = idx[String(b.id)] ?? 9999;
      return ai - bi;
    });
  }, [activeClasses, classOrder]);

  useEffect(() => {
    currentOrderRef.current = orderedActiveClasses.map((c) => String(c.id));
  }, [orderedActiveClasses]);

  const handleClassDragStart = (e, classId) => {
    dragIdRef.current = String(classId);
    setDraggingId(String(classId));
    e.dataTransfer.effectAllowed = 'move';
    if (classOrder.length === 0) {
      setClassOrder(currentOrderRef.current);
    }
  };

  const handleClassDragOver = (e, classId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const overId = String(classId);
    const dragId = dragIdRef.current;
    if (!dragId || dragId === overId) return;
    setClassOrder((prev) => {
      const base = prev.length ? prev.map(String) : [...currentOrderRef.current];
      const dragIdx = base.indexOf(dragId);
      const overIdx = base.indexOf(overId);
      if (dragIdx < 0 || overIdx < 0) return prev;
      const next = [...base];
      next.splice(dragIdx, 1);
      next.splice(overIdx, 0, dragId);
      return next;
    });
  };

  const handleClassDragEnd = () => {
    dragIdRef.current = null;
    setDraggingId(null);
    if (!classOrder.length) return;
    const finalOrder = classOrder;
    if (orderKey) localStorage.setItem(orderKey, JSON.stringify(finalOrder));
    if (user?.id) api.saveClassOrder(user.id, finalOrder);
  };
  const archivedClasses = (classes || []).filter((c) => c.archived);
  const getClassLastInteractionMs = useCallback((cls) => {
    const directCandidates = [
      cls?.lastInteractionAt,
      cls?.lastActivityAt
    ].filter(Boolean);
    const directMs = directCandidates
      .map((value) => new Date(value).getTime())
      .filter((v) => Number.isFinite(v));

    let maxMs = directMs.length ? Math.max(...directMs) : 0;
    const students = Array.isArray(cls?.students) ? cls.students : [];
    students.forEach((student) => {
      const history = Array.isArray(student?.history) ? student.history : [];
      history.forEach((entry) => {
        const ts = new Date(entry?.timestamp).getTime();
        if (Number.isFinite(ts) && ts > maxMs) maxMs = ts;
      });
    });
    return maxMs || null;
  }, []);

  const handleSelectClass = useCallback((classId) => {
    const cls = (classes || []).find((c) => String(c.id) === String(classId));
    if (cls?.archived) {
      onBackFromDashboard?.();
      setArchivedClassPrompt(cls);
      setClassActionsMenu(null);
      return;
    }
    setArchivedClassPrompt(null);
    onSelectClass(classId);
    setRailCollapsed(true);
    setClassActionsMenu(null);
  }, [onSelectClass, classes, onBackFromDashboard]);

  const handleDeletedClass = useCallback((id) => {
    if (activeClassId != null && String(activeClassId) === String(id)) {
      onBackFromDashboard?.();
    }
  }, [activeClassId, onBackFromDashboard]);

  useEffect(() => {
    if (!activeClass) setRailCollapsed(false);
  }, [activeClass]);

  useEffect(() => {
    if (!Array.isArray(classes) || classes.length === 0 || !updateClassesAndSave) return;
    const now = Date.now();
    const staleIds = (classes || [])
      .filter((cls) => {
        if (!cls || cls.archived || String(cls.id) === 'demo-class') return false;
        const lastMs = getClassLastInteractionMs(cls);
        if (!lastMs) return false;
        return now - lastMs >= AUTO_ARCHIVE_MS;
      })
      .map((cls) => String(cls.id));
    if (staleIds.length === 0) return;
    const staleSet = new Set(staleIds);
    updateClassesAndSave((prev) =>
      (prev || []).map((c) =>
        staleSet.has(String(c.id))
          ? { ...c, archived: true, archivedAt: new Date().toISOString(), archivedReason: 'inactivity' }
          : c
      )
    );
  }, [classes, updateClassesAndSave, getClassLastInteractionMs]);

  useEffect(() => {
    if (railCollapsed) setClassActionsMenu(null);
  }, [railCollapsed]);

  const [isMobileLayout, setIsMobileLayout] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 768px)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const onChange = () => setIsMobileLayout(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Close rail when user clicks outside it.
  useEffect(() => {
    if (railCollapsed) return;
    const onPointerDownCapture = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest('[data-teacher-class-rail]')) return;
      if (target.closest('[data-teacher-rail-toggle]')) return;
      if (target.closest('[data-class-actions-menu]')) return;
      if (target.closest('[data-class-actions-button]')) return;
      if (target.closest('[data-glass-dialog]')) return;
      setRailCollapsed(true);
    };
    document.addEventListener('pointerdown', onPointerDownCapture, true);
    return () => document.removeEventListener('pointerdown', onPointerDownCapture, true);
  }, [railCollapsed]);

  useEffect(() => {
    if (!classActionsMenu) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setClassActionsMenu(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [classActionsMenu]);

  const dockBottomReserve = DOCK_FLOAT_MARGIN_PX;

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        background: isDark ? '#0f172a' : '#F4F1EA',
      }}
    >
      <TeacherClassModals
        classes={classes}
        user={user}
        updateClasses={updateClasses}
        updateClassesAndSave={updateClassesAndSave}
        addModalOpen={addModalOpen}
        onCloseAddModal={() => setAddModalOpen(false)}
        isDark={isDark}
        registerClassActions={setClassActions}
        onClassCreated={(id) => onSelectClass(id)}
        onDeletedClass={handleDeletedClass}
      />

      {showProfileModal && (
        <ProfileModal 
          user={user} 
          onSave={async (data) => {
            try {
              const result = await api.updateProfile({ ...data, id: user.id });
              if (result && result.user) {
                // Update user in App state
                onUpdateUser?.(result.user);
                setShowProfileModal(false);
              } else {
                // Fallback: update with the data directly if no result.user
                onUpdateUser?.({ ...user, ...data });
                setShowProfileModal(false);
              }
            } catch (err) {
              let msg = 'Failed to update profile.';
              if (err?.body) {
                try {
                  const body = typeof err.body === 'string' ? JSON.parse(err.body) : err.body;
                  msg = body.error || body.message || 'Failed to update profile.';
                } catch {
                  msg = typeof err.body === 'string' ? err.body : err.message || 'Failed to update profile.';
                }
              } else if (err?.message) {
                msg = err.message;
              }
              alert(msg);
            }
          }} 
          onClose={() => setShowProfileModal(false)} 
        />
      )}

      <aside
        data-teacher-class-rail
        role="navigation"
        aria-label={t('teacher_portal.my_classes')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: railCollapsed ? 0 : TEACHER_CLASS_RAIL_PX,
          flexShrink: 0,
          borderRight: isDark ? '1px solid rgba(148,163,184,0.2)' : '1px solid rgba(15,23,42,0.08)',
          background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.96)',
          minHeight: 0,
          overflow: 'hidden',
          position: 'relative',
          transform: railCollapsed ? 'translateX(-100%)' : 'translateX(0)',
          opacity: railCollapsed ? 0 : 1,
          pointerEvents: railCollapsed ? 'none' : 'auto',
          transition: 'transform 0.15s linear, opacity 0.12s linear'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: railCollapsed ? 'center' : 'space-between',
            padding: railCollapsed ? '8px 4px' : '8px 10px',
            borderBottom: isDark ? '1px solid rgba(148,163,184,0.15)' : '1px solid rgba(15,23,42,0.06)',
            flexShrink: 0
          }}
        >
          {!railCollapsed && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isDark ? '#e2e8f0' : '#1e293b',
                textShadow: isDark ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.1)',
                background: isDark ? 'linear-gradient(135deg, #e2e8f0, #94a3b8)' : 'linear-gradient(135deg, #1e293b, #475569)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                paddingBottom: '6px',
                marginBottom: '4px',
                borderBottom: isDark ? '1px solid rgba(148,163,184,0.25)' : '1px solid rgba(15,23,42,0.12)',
                display: 'block',
                width: '100%'
              }}
            >
              {t('teacher_portal.my_classes')}
            </span>
          )}
          <button
            type="button"
            title={railCollapsed ? t('teacher_portal.expand_rail') : t('teacher_portal.collapse_rail')}
            onClick={() => setRailCollapsed((c) => !c)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 10,
              border: isDark ? '1px solid rgba(148,163,184,0.25)' : '1px solid rgba(15,23,42,0.1)',
              background: isDark ? 'rgba(30,41,59,0.6)' : '#fff',
              cursor: 'pointer',
              color: isDark ? '#e2e8f0' : '#0f172a'
            }}
          >
            {railCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: railCollapsed ? '6px 4px' : '4px 10px 12px' }}>
          {orderedActiveClasses.map((cls) => {
            const active = String(cls.id) === String(activeClassId);
            const studentCount = Array.isArray(cls.students) ? cls.students.length : 0;
            const badgeBg = active
              ? (isDark ? 'rgba(34,197,94,0.25)' : 'rgba(76,175,80,0.16)')
              : (isDark ? 'rgba(148,163,184,0.20)' : '#EEF2FF');
            const badgeColor = active ? (isDark ? '#DCFCE7' : '#15803d') : (isDark ? '#E2E8F0' : '#4F46E5');
            const isDragging = draggingId === String(cls.id);
            return (
              <div
                key={cls.id}
                draggable={!railCollapsed}
                onDragStart={(e) => handleClassDragStart(e, cls.id)}
                onDragOver={(e) => handleClassDragOver(e, cls.id)}
                onDragEnd={handleClassDragEnd}
                style={{
                  position: 'relative',
                  marginBottom: railCollapsed ? 8 : 6,
                  opacity: isDragging ? 0.45 : 1,
                  transition: 'opacity 0.15s ease'
                }}
              >
                <button
                  type="button"
                  onClick={() => handleSelectClass(cls.id)}
                  title={`${cls.name} (${studentCount})`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: railCollapsed ? 0 : 10,
                    justifyContent: railCollapsed ? 'center' : 'flex-start',
                    width: '100%',
                    textAlign: 'left',
                    padding: railCollapsed ? '6px 4px' : '10px 40px 10px 6px',
                    borderRadius: 14,
                    border: active
                      ? '2px solid #4CAF50'
                      : isDark
                        ? '1px solid rgba(148,163,184,0.15)'
                        : '1px solid rgba(15,23,42,0.06)',
                    background: active
                      ? isDark
                        ? 'rgba(34,197,94,0.12)'
                        : 'rgba(76,175,80,0.1)'
                      : isDark
                        ? 'rgba(30,41,59,0.6)'
                        : 'rgba(255,255,255,0.85)',
                    cursor: 'pointer',
                    transition: 'transform 0.18s ease, box-shadow 0.18s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!railCollapsed) return;
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = isDark
                      ? '0 6px 16px rgba(0,0,0,0.35)'
                      : '0 6px 16px rgba(15,23,42,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    if (!railCollapsed) return;
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {!railCollapsed && (
                    <span
                      title="Drag to reorder"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: isDark ? 'rgba(148,163,184,0.5)' : 'rgba(100,116,139,0.4)',
                        cursor: 'grab',
                        flexShrink: 0,
                        marginRight: -4
                      }}
                    >
                      <GripVertical size={14} />
                    </span>
                  )}
                  <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
                    <SafeAvatar
                      src={cls.avatar || boringAvatar(cls.name || 'class')}
                      name={cls.name || '?'}
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    {railCollapsed && (
                      <span
                        aria-label={`${studentCount} students`}
                        style={{
                          position: 'absolute',
                          right: -4,
                          bottom: -4,
                          minWidth: 18,
                          height: 18,
                          padding: '0 6px',
                          borderRadius: 999,
                          background: badgeBg,
                          color: badgeColor,
                          border: isDark ? '1px solid rgba(148,163,184,0.22)' : '1px solid rgba(79,70,229,0.12)',
                          fontSize: 11,
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxSizing: 'border-box',
                          lineHeight: 1
                        }}
                      >
                        {studentCount}
                      </span>
                    )}
                  </div>
                  {!railCollapsed && (
                    <span
                      style={{
                        fontWeight: active ? 800 : 600,
                        fontSize: 13,
                        color: isDark ? '#f1f5f9' : '#0f172a',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1
                      }}
                    >
                      {cls.name}
                    </span>
                  )}
                  {!railCollapsed && (
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: 999,
                        background: badgeBg,
                        color: badgeColor,
                        fontWeight: 900,
                        fontSize: 12,
                        flexShrink: 0,
                        border: isDark ? '1px solid rgba(148,163,184,0.18)' : '1px solid rgba(79,70,229,0.10)',
                        lineHeight: 1.1
                      }}
                    >
                      {studentCount}
                    </span>
                  )}
                </button>
                {!railCollapsed && (
                  <button
                    type="button"
                    aria-label="Class actions"
                  data-class-actions-button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (classActionsMenu?.cls?.id === cls.id) {
                        setClassActionsMenu(null);
                      } else {
                        const pos = computeRailClassMenuPosition(e.currentTarget.getBoundingClientRect());
                        setClassActionsMenu({ cls, ...pos });
                      }
                    }}
                    style={{
                      position: 'absolute',
                      right: 6,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: 'none',
                      background: isDark ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.9)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isDark ? '#94a3b8' : '#64748b',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                    }}
                  >
                    <MoreVertical size={16} />
                  </button>
                )}
              </div>
            );
          })}

        </div>

        <div
          style={{
            padding: railCollapsed ? 8 : 12,
            borderTop: isDark ? '1px solid rgba(148,163,184,0.15)' : '1px solid rgba(15,23,42,0.06)',
            display: 'flex',
            flexDirection: railCollapsed ? 'row' : 'column',
            flexWrap: 'wrap',
            justifyContent: railCollapsed ? 'center' : 'stretch',
            gap: railCollapsed ? 8 : 8,
            flexShrink: 0
          }}
        >
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            title={t('teacher_portal.add_new_class')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: railCollapsed ? 0 : 8,
              width: railCollapsed ? 44 : '100%',
              minWidth: railCollapsed ? 44 : undefined,
              padding: railCollapsed ? 10 : 10,
              borderRadius: 12,
              border: '1px dashed rgba(76,175,80,0.45)',
              background: 'rgba(76,175,80,0.06)',
              color: '#15803d',
              fontWeight: 700,
              fontSize: railCollapsed ? 0 : 13,
              cursor: 'pointer',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease'
            }}
            onMouseEnter={(e) => {
              if (!railCollapsed) return;
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(21,128,61,0.25)';
            }}
            onMouseLeave={(e) => {
              if (!railCollapsed) return;
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Plus size={railCollapsed ? 22 : 16} />
            {!railCollapsed && t('teacher_portal.add_new_class')}
          </button>
          {railCollapsed ? (
            <button
              type="button"
              onClick={handleImportClick}
              title={t('teacher_portal.import_classes')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                minWidth: 44,
                padding: 10,
                borderRadius: 12,
                border: '2px dashed rgba(59, 130, 246, 0.45)',
                background: 'rgba(59, 130, 246, 0.06)',
                color: '#1d4ed8',
                cursor: 'pointer',
                boxSizing: 'border-box',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(29,78,216,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Upload size={22} />
            </button>
          ) : (
            <label
              htmlFor="teacher-class-import-input"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
                padding: 10,
                borderRadius: 12,
                border: '2px dashed rgba(59, 130, 246, 0.45)',
                background: 'rgba(59, 130, 246, 0.06)',
                color: '#1d4ed8',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <Upload size={16} />
              {t('teacher_portal.import_classes')}
            </label>
          )}
        </div>

        <TeacherRailCollapsibleTools
          user={user}
          classes={classes}
          railCollapsed={railCollapsed}
          onOpenLessonPlanner={onOpenLessonPlanner}
          onEditProfile={onEditProfile}
          onLogout={onLogout}
          includeAccountInRail={!activeClass}
        />
        {railCollapsed && archivedClasses.length > 0 && (
          <div
            style={{
              padding: 8,
              borderTop: isDark ? '1px solid rgba(148,163,184,0.15)' : '1px solid rgba(15,23,42,0.06)',
              display: 'flex',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <button
              type="button"
              onClick={() => setRailCollapsed(false)}
              title={`Archived classes (${archivedClasses.length})`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                minWidth: 44,
                padding: 10,
                borderRadius: 12,
                border: '1px solid rgba(148,163,184,0.30)',
                background: isDark ? 'rgba(51,65,85,0.62)' : 'rgba(241,245,249,0.95)',
                color: isDark ? '#e2e8f0' : '#475569',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <Archive size={18} />
              <span
                style={{
                  position: 'absolute',
                  right: -2,
                  top: -2,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 999,
                  background: '#7C3AED',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  boxSizing: 'border-box'
                }}
              >
                {archivedClasses.length}
              </span>
            </button>
          </div>
        )}
        {!railCollapsed && archivedClasses.length > 0 && (
          <div
            style={{
              padding: '8px 12px 10px',
              borderTop: isDark ? '1px solid rgba(148,163,184,0.15)' : '1px solid rgba(15,23,42,0.06)',
              flexShrink: 0
            }}
          >
            <div
              style={{
                border: isDark ? '1px solid rgba(148,163,184,0.2)' : '1px solid rgba(15,23,42,0.08)',
                borderRadius: 12,
                padding: 6,
                background: isDark ? 'rgba(30,41,59,0.45)' : 'rgba(248,250,252,0.88)'
              }}
            >
              <button
                type="button"
                onClick={() => setArchivedSectionCollapsed((prev) => !prev)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: isDark ? '#94a3b8' : '#64748b',
                  padding: '6px 6px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer'
                }}
              >
                <span>Archived Classes</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 999,
                      fontSize: 10,
                      fontWeight: 900,
                      color: isDark ? '#e2e8f0' : '#475569',
                      background: 'rgba(148,163,184,0.2)'
                    }}
                  >
                    {archivedClasses.length}
                  </span>
                  {archivedSectionCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </span>
              </button>
              {!archivedSectionCollapsed && (
                <div style={{ maxHeight: 190, overflowY: 'auto', padding: '4px 2px 2px' }}>
                  {archivedClasses.map((cls) => {
                    const studentCount = Array.isArray(cls.students) ? cls.students.length : 0;
                    return (
                      <button
                        key={`archived-${cls.id}`}
                        type="button"
                        onClick={() => handleSelectClass(cls.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px',
                          borderRadius: 10,
                          border: isDark ? '1px solid rgba(148,163,184,0.15)' : '1px solid rgba(15,23,42,0.06)',
                          background: isDark ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.9)',
                          cursor: 'pointer',
                          marginBottom: 6,
                          opacity: 0.9
                        }}
                      >
                        <SafeAvatar
                          src={cls.avatar || boringAvatar(cls.name || 'class')}
                          name={cls.name || '?'}
                          style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover', filter: 'grayscale(0.45)' }}
                        />
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 12,
                            color: isDark ? '#cbd5e1' : '#334155',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1
                          }}
                        >
                          {cls.name}
                        </span>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 999,
                            background: isDark ? 'rgba(148,163,184,0.2)' : '#E2E8F0',
                            color: isDark ? '#e2e8f0' : '#475569',
                            fontWeight: 900,
                            fontSize: 11,
                            flexShrink: 0
                          }}
                        >
                          {studentCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
      {railCollapsed && (
        <button
          type="button"
          data-teacher-rail-toggle
          onClick={() => setRailCollapsed(false)}
          title={t('teacher_portal.expand_rail')}
          aria-label={t('teacher_portal.expand_rail')}
          style={{
            position: 'fixed',
            left: 4,
            top: 8,
            zIndex: 120001,
            width: 40,
            height: 52,
            borderRadius: 14,
            border: isDark ? '1px solid rgba(148,163,184,0.35)' : '1px solid rgba(15,23,42,0.14)',
            background: isDark ? 'rgba(15,23,42,0.88)' : 'rgba(255,255,255,0.94)',
            color: isDark ? '#e2e8f0' : '#334155',
            boxShadow: isDark ? '0 10px 24px rgba(2,6,23,0.45)' : '0 8px 20px rgba(15,23,42,0.18)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            transition: 'transform 180ms ease, box-shadow 180ms ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; }}
        >
          <ChevronRight size={18} />
        </button>
      )}

      {classActionsMenu && !railCollapsed && createPortal(
        <>
          <div
            role="menu"
            data-class-actions-menu
            style={{
              position: 'fixed',
              left: classActionsMenu.left,
              top: classActionsMenu.top,
              zIndex: 400001,
              minWidth: RAIL_CLASS_MENU_W,
              // Dark mode: transparent "glass" so we don't look like the whole page got darkened.
              background: isDark ? 'rgba(15,23,42,0.65)' : '#fff',
              backdropFilter: isDark ? 'blur(12px)' : undefined,
              WebkitBackdropFilter: isDark ? 'blur(12px)' : undefined,
              borderRadius: 12,
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
              border: isDark ? '1px solid rgba(148,163,184,0.22)' : '1px solid rgba(15,23,42,0.08)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              data-class-actions-item
              onClick={() => {
                classActions?.openEdit?.(classActionsMenu.cls);
                setClassActionsMenu(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '10px 12px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 14,
                color: isDark ? '#1a1a1a' : '#0f172a'
              }}
            >
              <Edit2 size={16} /> {t('teacher_portal.edit_class')}
            </button>
            {classActionsMenu.cls.id !== 'demo-class' && (
              <button
                type="button"
                onClick={() => {
                  updateClassesAndSave?.((prev) =>
                    (prev || []).map((c) =>
                      String(c.id) === String(classActionsMenu.cls.id)
                        ? { ...c, archived: true, archivedAt: new Date().toISOString(), archivedReason: 'manual' }
                        : c
                    )
                  );
                  if (String(activeClassId) === String(classActionsMenu.cls.id)) {
                    onBackFromDashboard?.();
                  }
                  setClassActionsMenu(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '10px 12px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 14,
                  color: isDark ? '#e2e8f0' : '#0f172a'
                }}
              >
                <Upload size={16} /> Archive class
              </button>
            )}
            {classActionsMenu.cls.id !== 'demo-class' && (
              <button
                type="button"
                onClick={() => {
                  classActions?.requestDelete?.(classActionsMenu.cls.id);
                  setClassActionsMenu(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '10px 12px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 14,
                  color: '#DC2626'
                }}
              >
                <Trash2 size={16} /> {t('teacher_portal.delete_class')}
              </button>
            )}
          </div>
        </>,
        document.body
      )}

      <div
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          alignSelf: 'stretch',
          // Neutral shell; class canvas color comes from ClassDashboard (student grid only in merged mode).
          background: activeClass ? (isDark ? '#0f172a' : '#ffffff') : undefined
        }}
      >
        {archivedClassPrompt && createPortal(
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
              padding: 20
            }}
            onClick={() => setArchivedClassPrompt(null)}
          >
            <div
              style={{
                maxWidth: 520,
                background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.98)',
                border: isDark ? '1px solid rgba(148,163,184,0.2)' : '1px solid rgba(15,23,42,0.08)',
                borderRadius: 18,
                padding: 20,
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                color: isDark ? '#e2e8f0' : '#0f172a'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 900 }}>
                Archived Class
              </h3>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>
                <strong>{archivedClassPrompt.name}</strong> is archived. Do you want to unarchive this class and move it back to My Classes?
              </p>
              <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setArchivedClassPrompt(null)}
                  style={{
                    border: '1px solid rgba(148,163,184,0.28)',
                    borderRadius: 12,
                    background: 'transparent',
                    padding: '10px 14px',
                    fontWeight: 800,
                    fontSize: 14,
                    cursor: 'pointer'
                  }}
                >
                  Back to panel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateClassesAndSave?.((prev) =>
                      (prev || []).map((c) =>
                        String(c.id) === String(archivedClassPrompt.id)
                          ? { ...c, archived: false, archivedAt: null, archivedReason: null, lastInteractionAt: new Date().toISOString() }
                          : c
                      )
                    );
                    setArchivedClassPrompt(null);
                  }}
                  style={{
                    border: 'none',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #6366F1 0%, #7C3AED 100%)',
                    padding: '10px 14px',
                    fontWeight: 800,
                    fontSize: 14,
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Unarchive class
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
        {activeClass ? (
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignSelf: 'stretch' }}>
          <Suspense fallback={null}>
            <ClassDashboard
              user={user}
              activeClass={activeClass}
              behaviors={behaviors}
              onBack={() => {}}
              onOpenEggRoad={onOpenEggRoad}
              onOpenSettings={onOpenSettings}
              updateClasses={updateClasses}
              updateClassesAndSave={updateClassesAndSave}
              refreshClasses={refreshClasses}
              onUpdateBehaviors={onUpdateBehaviors}
              onOpenAssignments={onOpenAssignments}
              onOpenGames={onOpenGames}
              onOpenGameFromDashboard={onOpenGameFromDashboard}
              leftDockInsetPx={0}
              teacherClasses={activeClasses}
              onSwitchClass={onSelectClass}
              mergedWorkspace
              onEditProfile={onEditProfile}
              onLogout={onLogout}
              layoutChrome={{
                top: 0,
                left: railWidth,
                bottom: dockBottomReserve
              }}
              bottomToolbarHost={bottomToolbarHost}
              dockCollapsed={dockCollapsed}
              onDockCollapsedChange={setDockCollapsed}
              classRailHidden={railCollapsed}
            />
          </Suspense>
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 32,
              textAlign: 'center',
              color: isDark ? '#94a3b8' : '#64748b',
              fontSize: 16,
              fontWeight: 600,
              gap: 12
            }}
          >
            <p style={{ margin: 0, maxWidth: 340, lineHeight: 1.5 }}>
              {activeClasses.length === 0
                ? t('teacher_portal.no_classes_yet')
                : t('teacher_portal.select_class_to_open')}
            </p>
          </div>
        )}
      </div>

      {activeClass ? (
        <div
          ref={setBottomToolbarHost}
          aria-hidden={false}
          style={{
            position: 'fixed',
            left: '50%',
            bottom: DOCK_FLOAT_MARGIN_PX,
            transform: 'translateX(-50%)',
            zIndex: 100000,
            pointerEvents: 'none',
            maxWidth: 'min(calc(100vw - 24px), 1200px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        />
      ) : null}
    </div>
  );
}
