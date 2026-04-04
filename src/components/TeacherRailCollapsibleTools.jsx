import { useState, useCallback } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Download,
  LogOut,
  User
} from 'lucide-react';
import { useTranslation } from '../i18n';
import { useTheme } from '../ThemeContext';
import { useToast } from './Toast';

/**
 * Collapsible tools block for the teacher class rail (lesson planner, export backup).
 * Donate and theme live in the class header account menu when a class is open.
 * When includeAccountInRail is true (no class selected), also shows profile + logout.
 */
export default function TeacherRailCollapsibleTools({
  user,
  classes,
  railCollapsed,
  onOpenLessonPlanner,
  onEditProfile,
  onLogout,
  includeAccountInRail = false
}) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { addToast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const handleExportData = useCallback(() => {
    try {
      const backupData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        classes: Array.isArray(classes) ? classes : []
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `klasiz_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addToast(t('teacher_portal.backup_downloaded'), 'success');
    } catch {
      addToast(t('teacher_portal.backup_failed'), 'error');
    }
  }, [classes, addToast, t]);

  const btnBase = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
    width: '100%',
    padding: '10px 12px',
    borderRadius: 12,
    border: isDark ? '1px solid rgba(148,163,184,0.2)' : '1px solid rgba(15,23,42,0.08)',
    background: isDark ? 'rgba(30,41,59,0.55)' : 'rgba(255,255,255,0.9)',
    color: isDark ? '#e2e8f0' : '#0f172a',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
    boxSizing: 'border-box'
  };

  const iconBtnCollapsed = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 40,
    padding: 0,
    borderRadius: 12,
    border: isDark ? '1px solid rgba(148,163,184,0.2)' : '1px solid rgba(15,23,42,0.1)',
    background: isDark ? 'rgba(30,41,59,0.55)' : 'rgba(255,255,255,0.92)',
    color: isDark ? '#e2e8f0' : '#0f172a',
    cursor: 'pointer'
  };

  const toggleRow = (
    <button
      type="button"
      onClick={() => setExpanded((e) => !e)}
      title={expanded ? t('teacher_portal.collapse_tools') : t('teacher_portal.expand_tools')}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: railCollapsed ? 'center' : 'space-between',
        width: '100%',
        padding: railCollapsed ? '8px 4px' : '10px 12px',
        borderRadius: 12,
        border: isDark ? '1px solid rgba(148,163,184,0.18)' : '1px solid rgba(15,23,42,0.08)',
        background: isDark ? 'rgba(30,41,59,0.4)' : 'rgba(248,250,252,0.95)',
        cursor: 'pointer',
        color: isDark ? '#94a3b8' : '#64748b',
        fontWeight: 700,
        fontSize: railCollapsed ? 0 : 11,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        gap: 8
      }}
    >
      {!railCollapsed && <span>{t('teacher_portal.workspace_tools')}</span>}
      {expanded ? <ChevronUp size={railCollapsed ? 20 : 16} /> : <ChevronDown size={railCollapsed ? 20 : 16} />}
    </button>
  );

  const toolIcon = (Icon, label, onClick, extra = {}) => (
    <button
      type="button"
      onClick={onClick}
      title={label}
      style={{
        ...btnBase,
        ...(railCollapsed ? iconBtnCollapsed : {}),
        justifyContent: railCollapsed ? 'center' : 'flex-start',
        ...extra
      }}
      onMouseEnter={(e) => {
        if (!railCollapsed) return;
        e.currentTarget.style.transform = 'scale(1.08)';
        e.currentTarget.style.boxShadow = isDark ? '0 6px 14px rgba(0,0,0,0.35)' : '0 4px 12px rgba(15,23,42,0.12)';
      }}
      onMouseLeave={(e) => {
        if (!railCollapsed) return;
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <Icon size={railCollapsed ? 20 : 18} />
      {!railCollapsed && <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>}
    </button>
  );

  return (
    <>
      <div
        style={{
          borderTop: isDark ? '1px solid rgba(148,163,184,0.15)' : '1px solid rgba(15,23,42,0.06)',
          padding: railCollapsed ? 8 : 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flexShrink: 0
        }}
      >
        {toggleRow}
        {expanded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {onOpenLessonPlanner && toolIcon(BookOpen, t('landing.lesson_planner.title'), onOpenLessonPlanner)}
            {toolIcon(Download, t('teacher_portal.export_backup'), handleExportData)}

            {includeAccountInRail && user && (
              <>
                <button
                  type="button"
                  onClick={() => onEditProfile?.()}
                  title={t('teacher_portal.edit_profile')}
                  style={{
                    ...btnBase,
                    ...(railCollapsed ? iconBtnCollapsed : {}),
                    justifyContent: railCollapsed ? 'center' : 'flex-start'
                  }}
                  onMouseEnter={(e) => {
                    if (!railCollapsed) return;
                    e.currentTarget.style.transform = 'scale(1.08)';
                    e.currentTarget.style.boxShadow = isDark ? '0 6px 14px rgba(0,0,0,0.35)' : '0 4px 12px rgba(15,23,42,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    if (!railCollapsed) return;
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <User size={railCollapsed ? 20 : 18} />
                  {!railCollapsed && <span style={{ flex: 1, textAlign: 'left' }}>{t('teacher_portal.edit_profile')}</span>}
                </button>
                <button
                  type="button"
                  onClick={() => setLogoutConfirm(true)}
                  title={t('teacher_portal.logout')}
                  style={{
                    ...btnBase,
                    ...(railCollapsed ? iconBtnCollapsed : {}),
                    justifyContent: railCollapsed ? 'center' : 'flex-start',
                    color: '#DC2626',
                    borderColor: 'rgba(220,38,38,0.35)'
                  }}
                  onMouseEnter={(e) => {
                    if (!railCollapsed) return;
                    e.currentTarget.style.transform = 'scale(1.08)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(220,38,38,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    if (!railCollapsed) return;
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <LogOut size={railCollapsed ? 20 : 18} />
                  {!railCollapsed && <span style={{ flex: 1, textAlign: 'left' }}>{t('teacher_portal.logout')}</span>}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {logoutConfirm && (
        <div
          className="modal-overlay-in"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.25)',
            zIndex: 400000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}
          onClick={() => setLogoutConfirm(false)}
        >
          <div
            style={{
              background: isDark ? '#1e293b' : '#fff',
              borderRadius: 20,
              padding: 24,
              maxWidth: 360,
              width: '100%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ margin: '0 0 16px', fontWeight: 700 }}>{t('teacher_portal.sure_logout')}</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 12,
                  border: 'none',
                  background: '#DC2626',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setLogoutConfirm(false);
                  onLogout?.();
                }}
              >
                {t('teacher_portal.yes')}
              </button>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 12,
                  border: '1px solid #e5e7eb',
                  background: 'transparent',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                onClick={() => setLogoutConfirm(false)}
              >
                {t('teacher_portal.no')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
