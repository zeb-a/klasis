/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef, useMemo, useCallback, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';

import api from '../services/api';
import { Dices, Trophy, Settings, Award, Home, Camera, SmilePlus, Sliders, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowUpDown, CheckSquare, BarChart2, ClipboardList, Maximize, Minimize, MessageSquare, Clock, CheckCircle, Siren, Zap, MoreVertical, X, Check, Users, Crown, Gamepad2, LogOut, User, Heart, Sun, Moon } from 'lucide-react';

// Lazy load large components that are only shown conditionally
const ReportsPage = lazy(() => import('./ReportsPage'));
const BulkAddStudentModal = lazy(() => import('./BulkAddStudentModal'));
const Whiteboard = lazy(() => import('./Whiteboard'));

// Core components that are always needed - NOT lazy-loaded
import StudentCard from './StudentCard';
import BehaviorModal from './BehaviorModal';
import LuckyDrawModal from './LuckyDrawModal';
import AddStudentModal from './AddStudentModal';
import SingleAddStudentModal from './SingleAddStudentModal';
import AddStudentDropdown from './AddStudentDropdown';
import SafeAvatar from './SafeAvatar';
import { PointAnimation } from './PointAnimation';
import LevelUpOverlay from './LevelUpOverlay';
import { boringAvatar, avatarByCharacter } from '../utils/avatar';
import { AVATAR_SETS, getAvatarFromSet, generateAvatarSetList } from '../utils/bulkAvatarSets';
import InboxPage from './InboxPage'; // ⚡ NEW IMPORT: Ensure this file exists
import KidTimer from './KidTimer';
import { Presentation } from 'lucide-react'; // Wide board icon
const AssignmentsPage = lazy(() => import('./AssignmentsPage'));
import AccessCodesPage from './AccessCodesPage'; // Add this line
const SettingsPage = lazy(() => import('./SettingsPage'));
import PointsHistoryView from './PointsHistoryView';
import EggRoad from './EggRoad';
import GamesSidebar from './GamesSidebar';
import DonateOverlay from './DonateOverlay';
import { DOCK_FLOAT_MARGIN_PX, DOCK_RESERVE_COLLAPSED_PX, DOCK_RESERVE_EXPANDED_PX } from './TeacherWorkspace';
import ClassStickyNote from './ClassStickyNote';
import { useTranslation } from '../i18n';
import { usePageHelp } from '../PageHelpContext';
import { useTheme } from '../ThemeContext';
import { DashboardLoader, SidebarIcon, AnimatedHamburger, IconButton } from './ClassDashboard.helpers';
import { styles } from './ClassDashboard.styles';
import EditStudentModal from './EditStudentModal';

export default function ClassDashboard({
  activeClass,
  behaviors,
  onBack,
  onOpenEggRoad,
  onOpenSettings,
  updateClasses,
  updateClassesAndSave,
  refreshClasses,
  onOpenAssignments,
  onOpenGames,
  onOpenGameFromDashboard,
  user,
  /** When set (e.g. desktop teacher split with class rail), shifts fixed UI so it clears the rail. */
  leftDockInsetPx = 0,
  /** All teacher classes (for switching without returning to the portal). Omit when not needed. */
  teacherClasses,
  onSwitchClass,
  /** Merged teacher workspace: bottom dock, no left rail, no home icon. */
  mergedWorkspace = false,
  layoutChrome = { top: 0, left: 0, bottom: 0 },
  bottomToolbarHost = null,
  dockCollapsed = false,
  onDockCollapsedChange,
  classRailHidden = false,
  /** Merged teacher workspace: account menu in header (profile / logout). */
  onEditProfile,
  onLogout
}) {
  const { t, lang } = useTranslation();
  const { isDark, switchTheme } = useTheme();
  // Handler to merge imported behaviors from another class into the active class.
  // Listens for the custom event dispatched by BehaviorModal when the user requests an import.
  useEffect(() => {
    const handler = (e) => {
      const { sourceBehaviors } = e.detail || {};
      if (!sourceBehaviors || !Array.isArray(sourceBehaviors) || !activeClass) return;
      // Merge: only add behaviors that don't already exist (by id or label)
      // Save imported behaviors with current class ID
      (async () => {
        try {
          await api.saveBehaviors(sourceBehaviors.map(sb => ({ ...sb, id: undefined })), activeClass.id, user?.email);
        } catch (err) {
          console.warn('Failed to save imported behaviors:', err);
        }
      })();
      updateClasses(prev => prev.map(c => {
        if (c.id !== activeClass.id) return c;
        const existingKeys = new Set((c.behaviors || []).map(b => b.id || b.label));
        const toAdd = sourceBehaviors.filter(sb => !(existingKeys.has(sb.id) || existingKeys.has(sb.label)));
        if (toAdd.length === 0) return c;
        return { ...c, behaviors: [...(c.behaviors || []), ...toAdd] };
      }));
    };
    window.addEventListener('behavior-import:request', handler);
    return () => window.removeEventListener('behavior-import:request', handler);
  }, [activeClass, updateClasses]);

  // Load full class data when dashboard opens (if we only have minimal data)
  useEffect(() => {
    if (!activeClass || !updateClasses || !user?.email) return;
    
    // Check if we need to load full data (empty arrays indicate minimal load)
    const needsFullData = (
      !activeClass.tasks || activeClass.tasks.length === 0 ||
      !activeClass.assignments || activeClass.assignments.length === 0
    );
    
    if (needsFullData) {
      // Load full data for this specific class
      api.getClasses(user.email).then(fullData => {
        if (fullData && Array.isArray(fullData)) {
          const updatedClass = fullData.find(c => c.id === activeClass.id);
          if (updatedClass) {
            updateClasses(prev => prev.map(c => 
              c.id === activeClass.id ? { ...c, ...updatedClass } : c
            ));
          }
        }
      }).catch(err => {
        console.warn('Failed to load full class data:', err);
      });
    }
  }, [activeClass?.id, updateClasses, user?.email]);

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isBulkAddStudentOpen, setIsBulkAddStudentOpen] = useState(false);
  const [isSingleAddStudentOpen, setIsSingleAddStudentOpen] = useState(false);
  const [showAddStudentMenu, setShowAddStudentMenu] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentAvatar, setEditStudentAvatar] = useState(null);
  const [editSelectedSeed, setEditSelectedSeed] = useState(null);
  const [editAvatarSetId, setEditAvatarSetId] = useState(null);
  const [editAvatarSetList, setEditAvatarSetList] = useState([]);
  const [editSelectedAvatarIndex, setEditSelectedAvatarIndex] = useState(null);
  const [showEditAvatarPicker, setShowEditAvatarPicker] = useState(false);
  const [originalEditAvatar, setOriginalEditAvatar] = useState(null); // Store original avatar to detect changes
  const [hoveredEditChar, setHoveredEditChar] = useState(null);
  const [deleteConfirmStudentId, setDeleteConfirmStudentId] = useState(null);
  const editFileInputRef = useRef(null);
  const editAvatarSectionRef = useRef(null);
  const addStudentButtonRef = useRef(null);

  const getEditDropdownPosition = useCallback(() => {
    if (!editAvatarSectionRef.current) return { top: 0, left: 0 };

    const rect = editAvatarSectionRef.current.getBoundingClientRect();
    return {
      top: rect.top - 200,
      left: rect.left + rect.width / 2 - 190
    };
  }, []);
  // TEMPORARY: default to visible so we can verify the aside and chevron are rendered.
  // Change this back to `false` after verifying in the browser.
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [sidebarVisible, setSidebarVisible] = useState(true); // Always visible by default
  // Load display size from localStorage or use default based on viewport
  const savedDisplaySize = typeof window !== 'undefined' ? localStorage.getItem('displaySize') : null;
  const [displaySize, setDisplaySize] = useState(savedDisplaySize || (isMobile ? 'compact' : 'spacious'));
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [showClassBehaviorModal, setShowClassBehaviorModal] = useState(false);
  const [showMultiSelectBehaviorModal, setShowMultiSelectBehaviorModal] = useState(false);
  // Animations for awarded students: id -> { type }
  const [animatingStudents, setAnimatingStudents] = useState({});
  
  // Level up overlay state
  const [levelUpStudent, setLevelUpStudent] = useState(null);

  // Debounce refs for point-giving to prevent race conditions
  const pointUpdateTimeoutRef = useRef(null);
  const pendingStudentUpdatesRef = useRef(new Map()); // studentId -> { score, history }
  const isUpdatingRef = useRef(false);

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Wrapper to save display size to localStorage
  const updateDisplaySize = useCallback((size) => {
    setDisplaySize(size);
    if (typeof window !== 'undefined') {
      localStorage.setItem('displaySize', size);
    }
  }, []);

  /** Whole Class tile: stack matches StudentCard density (mobile 2-col "regular" was blowing row height). */
  const wholeClassDenseLayout =
    displaySize === 'compact' || (isMobile && displaySize === 'regular');
  const wholeClassMobileSpacious = isMobile && displaySize === 'spacious';

  // Keep track of viewport width to switch sidebar to a compact tab bar on small screens
  useEffect(() => {
    const onResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const triggerAnimationForIds = (ids = [], points = 1) => {
    if (prefersReducedMotion) return;
    const map = {
      1: { type: 'small', dur: 800 },
      2: { type: 'medium', dur: 1200 },
      3: { type: 'large', dur: 1600 },
      5: { type: 'confetti', dur: 2200 }
    };
    const { type, dur } = map[points] || { type: 'small', dur: 900 };
    setAnimatingStudents((prev) => {
      const copy = { ...prev };
      ids.forEach((id) => { copy[id] = { type }; });
      return copy;
    });
    // Clear after duration
    setTimeout(() => {
      setAnimatingStudents((prev) => {
        const copy = { ...prev };
        ids.forEach((id) => { delete copy[id]; });
        return copy;
      });
    }, dur);
  };
  const [showGridMenu, setShowGridMenu] = useState(false);
  const [showPoint, setShowPoint] = useState({ visible: false, student: null, points: 1, behaviorEmoji: '⭐', behaviorAudio: null, stickerId: null });
  const [isAttendanceMode, setIsAttendanceMode] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [absentStudents, setAbsentStudents] = useState(new Set());
  const [attendanceBaselineAbsent, setAttendanceBaselineAbsent] = useState(new Set());
  const [attendanceDirty, setAttendanceDirty] = useState(false);
  const [isClassToolsPanelOpen, setIsClassToolsPanelOpen] = useState(false);
  const [isClassToolsSettingsCollapsed, setIsClassToolsSettingsCollapsed] = useState(true);
  const [showGamesSidebar, setShowGamesSidebar] = useState(false);
  const [classSwitcherOpen, setClassSwitcherOpen] = useState(false);
  const classSwitcherRef = useRef(null);
  const classToolsPanelRef = useRef(null);

  // Helper to close Class Tools panel when an item is selected
  const closeClassToolsPanel = () => {
    if (isClassToolsPanelOpen) {
      setIsClassToolsPanelOpen(false);
      setIsClassToolsSettingsCollapsed(true);
    }
  };

  const handleSidebarItemClick = (callback) => {
    return () => {
      closeClassToolsPanel();
      callback();
    };
  };

  // Close Class Tools panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isClassToolsPanelOpen && classToolsPanelRef.current && !classToolsPanelRef.current.contains(event.target)) {
        closeClassToolsPanel();
      }
    };

    if (isClassToolsPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isClassToolsPanelOpen]);

  // App Settings State - Feature Toggles
  const [appSettings, setAppSettings] = useState({
    showNavbar: true,
    showAssignments: true, // Premium - unlocked
    showInbox: true, // Premium - unlocked
    showLuckyDraw: true,
    showEggRoad: true,
    showAttendance: true,
    showAccessCodes: true, // Premium - unlocked
    showReports: true,
    showTimer: true,
    showBuzzer: true,
    showWhiteboard: true,
    showPointsCards: true,
    isPremium: true, // Premium unlocked
  });

  useEffect(() => {
    const newAbsent = new Set();
    activeClass.students?.forEach(s => {
      if (s.attendance === 'absent' && s.attendanceDate === today) {
        newAbsent.add(s.id);
      }
    });
    setAbsentStudents(newAbsent);
  }, [activeClass.students, today]);

  const areSetsEqual = (a, b) => {
    if (a.size !== b.size) return false;
    for (const item of a) {
      if (!b.has(item)) return false;
    }
    return true;
  };

  const openAttendanceMode = () => {
    const base = new Set();
    (activeClass.students || []).forEach((s) => {
      if (s.attendance === 'absent' && s.attendanceDate === today) base.add(s.id);
    });
    setAttendanceBaselineAbsent(base);
    setAbsentStudents(new Set(base));
    setAttendanceDirty(false);
    setIsMultiSelectMode(false);
    setMultiSelectedStudents(new Set());
    setIsAttendanceMode(true);
  };

  const cancelAttendanceMode = () => {
    setAbsentStudents(new Set(attendanceBaselineAbsent));
    setAttendanceDirty(false);
    setIsAttendanceMode(false);
  };

  const saveAttendanceMode = () => {
    const nextAbsent = new Set(absentStudents);
    updateClasses(prev => prev.map(c =>
      c.id === activeClass.id
        ? {
            ...c,
            students: c.students.map(st => ({
              ...st,
              attendance: nextAbsent.has(st.id) ? 'absent' : 'present',
              attendanceDate: today
            }))
          }
        : c
    ));
    setAttendanceBaselineAbsent(new Set(nextAbsent));
    setAttendanceDirty(false);
    setIsAttendanceMode(false);
  };

  const [showCodesPage, setShowCodesPage] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Toggle Function
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
      });
    } else {
      document.exitFullscreen();
    }
  };
  // ... existing states ...
  const [showSortMenu, setShowSortMenu] = useState(false); // ⚡ NEW: Toggle for sort menu
  const [sortBy, setSortBy] = useState('score'); // ⚡ NEW: default to 'score' (highest points)
  const [showHeaderMenu, setShowHeaderMenu] = useState(false); // ⚡ NEW: Toggle for 3-dot menu in header
  const headerMenuBtnRef = useRef(null);
  const headerMenuRef = useRef(null);
  const [teacherAccountMenuOpen, setTeacherAccountMenuOpen] = useState(false);
  const [showDonateOverlay, setShowDonateOverlay] = useState(false);
  const [teacherLogoutConfirm, setTeacherLogoutConfirm] = useState(false);
  const teacherAccountBtnRef = useRef(null);
  const teacherAccountMenuRef = useRef(null);

  // Refs for menu buttons + menus so we can detect outside clicks and position menus
  const sortBtnRef = useRef(null);
  const gridBtnRef = useRef(null);
  const sortMenuRef = useRef(null);
  const gridMenuRef = useRef(null);
  // Refs for sidebar and its toggle chevron so outside clicks can hide the aside
  const sidebarRef = useRef(null);
  const chevronRef = useRef(null);

  // ⚡ NEW: Helper to get students in the correct order (memoized for performance)
  const sortedStudents = useMemo(() => {
    if (!activeClass || !activeClass.students) return [];
    const students = [...activeClass.students]; // Create a copy to sort safely

    if (sortBy === 'name') {
      return students.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'score') {
      // Sort by score (Highest first), fallback to 0 if undefined
      return students.sort((a, b) => (b.score || 0) - (a.score || 0));
    }
    return students;
  }, [activeClass?.students, sortBy]);
  // Sync state if user presses 'Esc' key
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Close menus when clicking outside of the buttons/menus
  useEffect(() => {
    const onDocClick = (e) => {
      const target = e.target;

      // If clicking inside the header menu container (mobile 3-dot menu), keep it open
      if (headerMenuRef.current && headerMenuRef.current.contains(target)) return;

      // If clicking on the 3-dot menu button, toggle it (the onClick handles this)
      if (headerMenuBtnRef.current && headerMenuBtnRef.current.contains(target)) return;

      // If clicking inside the sort menu (desktop), keep it open
      if (sortMenuRef.current && sortMenuRef.current.contains(target)) return;

      // If clicking on the sort menu button, toggle it (the onClick handles this)
      if (sortBtnRef.current && sortBtnRef.current.contains(target)) return;

      // If clicking inside the grid menu (desktop), keep it open
      if (gridMenuRef.current && gridMenuRef.current.contains(target)) return;

      // If clicking on the grid menu button, toggle it (the onClick handles this)
      if (gridBtnRef.current && gridBtnRef.current.contains(target)) return;

      if (classSwitcherRef.current && classSwitcherRef.current.contains(target)) return;

      if (teacherAccountMenuRef.current && teacherAccountMenuRef.current.contains(target)) return;
      if (teacherAccountBtnRef.current && teacherAccountBtnRef.current.contains(target)) return;

      // If no menus are open, nothing to do
      if (!showHeaderMenu && !showSortMenu && !showGridMenu && !classSwitcherOpen && !teacherAccountMenuOpen) return;

      // Close all menus
      setShowSortMenu(false);
      setShowGridMenu(false);
      setShowHeaderMenu(false);
      setClassSwitcherOpen(false);
      setTeacherAccountMenuOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [showHeaderMenu, showSortMenu, showGridMenu, classSwitcherOpen, teacherAccountMenuOpen]);

  useEffect(() => {
    if (!classSwitcherOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setClassSwitcherOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [classSwitcherOpen]);

  // Hide the sidebar/aside when clicking anywhere outside it (but not when clicking the chevron toggle)
  // Applies on both mobile and desktop
  useEffect(() => {
    const onAnyClick = (e) => {
      const target = e.target;
      // Only consider hiding when aside is currently visible
      if (!sidebarVisible) return;
      // If click inside the sidebar, do nothing
      if (sidebarRef.current && sidebarRef.current.contains(target)) return;
      // If click on the chevron/toggle button, do nothing (the button's onClick handles toggling)
      if (chevronRef.current && chevronRef.current.contains(target)) return;
      // Otherwise hide the sidebar
      setSidebarVisible(false);
    };
    document.addEventListener('click', onAnyClick);
    return () => document.removeEventListener('click', onAnyClick);
  }, [sidebarVisible]);
  // --- BUZZER STATE ---
  const [isLuckyDrawOpen, setIsLuckyDrawOpen] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [buzzerState, setBuzzerState] = useState('idle'); // 'idle', 'counting', 'buzzing'
  const [buzzerCount, setBuzzerCount] = useState(5);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false); // Multi-select mode for student cards
  const [multiSelectedStudents, setMultiSelectedStudents] = useState(new Set()); // Students selected in multi-select mode
  const [showHistory, setShowHistory] = useState(false); // Points history modal
  const audioCtxRef = useRef(null);
  const mainOscRef = useRef(null);

  // Initialize Audio Context on demand
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  const startBuzzerSequence = () => {
    initAudio();
    setBuzzerState('counting');
    setBuzzerCount(5);
  };

  const stopBuzzer = () => {
    if (mainOscRef.current) {
      mainOscRef.current.stop();
      mainOscRef.current = null;
    }
    setBuzzerState('idle');
  };
  // --- SUBMISSIONS & MESSAGES STATE ---
  const DASHBOARD_VIEW_MODES = useMemo(
    () => new Set(['students', 'assignments', 'messages', 'codes', 'settings', 'reports', 'timer', 'whiteboard', 'luckyDraw', 'appSettings', 'eggroad']),
    []
  );
  const getViewModeFromUrl = useCallback(() => {
    if (typeof window === 'undefined') return 'students';
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && DASHBOARD_VIEW_MODES.has(tab)) return tab;
    const hash = (window.location.hash || '').replace(/^#/, '');
    if (hash.startsWith('dashboard-')) {
      const legacyMode = hash.replace(/^dashboard-/, '');
      if (DASHBOARD_VIEW_MODES.has(legacyMode)) return legacyMode;
    }
    return 'students';
  }, [DASHBOARD_VIEW_MODES]);
  const [viewMode, setViewMode] = useState(() => getViewModeFromUrl()); // 'students', 'reports', 'assignments', etc.
  const viewModeRef = useRef('students');
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerFloatingStage, setTimerFloatingStage] = useState('setup'); // 'setup' | 'running'
  const [timerBubblePos, setTimerBubblePos] = useState(() => {
    if (typeof window === 'undefined') return { x: 16, y: 110 };
    const size = window.innerWidth <= 768 ? 96 : 112;
    return { x: Math.max(8, window.innerWidth - size - 16), y: 110 };
  });
  const bubbleDragRef = useRef(null);

  const clampNumber = (n, min, max) => Math.max(min, Math.min(max, n));

  const handleTimerBubblePointerDown = (e) => {
    // Don't start dragging when tapping timer controls.
    const target = e.target;
    if (target && typeof target.closest === 'function' && target.closest('[data-timer-action]')) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const bubbleSize = isMobile ? 96 : 112;
    const startX = e.clientX;
    const startY = e.clientY;

    bubbleDragRef.current = {
      pointerId: e.pointerId,
      offsetX: startX - timerBubblePos.x,
      offsetY: startY - timerBubblePos.y,
      bubbleSize
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Pointer capture may fail for older browsers; drag still works via events.
    }
  };

  const handleTimerBubblePointerMove = (e) => {
    const drag = bubbleDragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    const bubbleSize = drag.bubbleSize || (isMobile ? 96 : 112);
    const pad = 8;
    const x = clampNumber(e.clientX - drag.offsetX, pad, window.innerWidth - bubbleSize - pad);
    const y = clampNumber(e.clientY - drag.offsetY, 72, window.innerHeight - bubbleSize - pad);
    setTimerBubblePos({ x, y });
  };

  const handleTimerBubblePointerUp = (e) => {
    const drag = bubbleDragRef.current;
    if (!drag) return;
    if (drag.pointerId === e.pointerId) bubbleDragRef.current = null;
  };
  // If the app navigates to the legacy `timer` view mode (hash/back), keep the timer floating instead.
  useEffect(() => {
    if (viewMode === 'timer') {
      setTimerOpen(true);
      setTimerFloatingStage('setup');
      setViewMode('students');
    }
  }, [viewMode]);
  const { setPageId } = usePageHelp();

    // Sync viewModeRef.current with viewMode whenever viewMode changes
    useEffect(() => {
      viewModeRef.current = viewMode;
    }, [viewMode]);
  // Sync dashboard sub-view to help bubble (page-relevant help)
  useEffect(() => {
    const map = {
      students: 'class-dashboard',
      assignments: 'assignments',
      messages: 'inbox',
      codes: 'access-codes',
      settings: 'settings',
      reports: 'class-dashboard',
      timer: 'class-dashboard',
      whiteboard: 'whiteboard',
      luckyDraw: 'class-dashboard',
      eggroad: 'class-dashboard',
      appSettings: 'class-dashboard'
    };
    setPageId(map[viewMode] || 'class-dashboard');
  }, [viewMode, setPageId]);

  // Use existing state declarations from earlier in the file (isLuckyDrawOpen, showWhiteboard, buzzerState)
  const modalRef = useRef(null);

  const buildDashboardUrl = useCallback((mode = viewModeRef.current || 'students') => {
    const next = new URL(window.location.href);
    if (mode && mode !== 'students') next.searchParams.set('tab', mode);
    else next.searchParams.delete('tab');
    if ((next.hash || '').startsWith('#dashboard-')) next.hash = '';
    return `${next.pathname}${next.search}${next.hash}`;
  }, []);

  // Special handler for buzzer since it calls a function instead of just setting state
  const startBuzzerWithHistory = () => {
    startBuzzerSequence();
    window.history.pushState(
      { ...window.history.state, dashboardModal: 'buzzer' },
      '',
      buildDashboardUrl()
    );
  };

  // Custom setViewMode that tracks history
  const setViewModeWithHistory = (newMode) => {
    if (newMode !== viewModeRef.current) {
      // Push browser history and keep URL path/query (avoid hash-only URLs).
      window.history.pushState(
        { ...window.history.state, dashboardViewMode: newMode },
        '',
        buildDashboardUrl(newMode)
      );
      viewModeRef.current = newMode;
      setViewMode(newMode);
    }
  };

  // Track modal states in browser history for swipe-back
  const openModalWithHistory = (modalType, setOpenFn) => {
    setOpenFn(true);
    window.history.pushState(
      { ...window.history.state, dashboardModal: modalType },
      '',
      buildDashboardUrl()
    );
  };

  const closeModal = () => {
    setIsLuckyDrawOpen(false);
    setShowWhiteboard(false);
    setShowHistory(false);
    setBuzzerState('idle');
    window.history.replaceState(
      { ...window.history.state, dashboardModal: null },
      '',
      buildDashboardUrl()
    );
  };

  // Initialize browser history with students viewMode
  useEffect(() => {
    if (!window.history.state || !window.history.state.dashboardViewMode) {
      window.history.replaceState(
        { ...window.history.state, dashboardViewMode: getViewModeFromUrl(), dashboardModal: null },
        '',
        buildDashboardUrl(getViewModeFromUrl())
      );
    }
  }, [buildDashboardUrl, getViewModeFromUrl]);

  // Listen for custom event from App.jsx when swipe-back happens on dashboard
  useEffect(() => {
    const handleDashboardViewModeChange = (event) => {
      const newViewMode = event.detail;
      // Map 'dashboard' to 'students' for consistency
      const actualViewMode = newViewMode === 'dashboard' ? 'students' : newViewMode;
      viewModeRef.current = actualViewMode;
      setViewMode(actualViewMode);
    };

    const handleModalClose = () => {
      closeModal();
    };

    window.addEventListener('dashboardViewModeChange', handleDashboardViewModeChange);
    window.addEventListener('modalClose', handleModalClose);
    return () => {
      window.removeEventListener('dashboardViewModeChange', handleDashboardViewModeChange);
      window.removeEventListener('modalClose', handleModalClose);
    };
  }, []);

  // Handle browser back button for dashboard views
  useEffect(() => {
    const handlePopState = (event) => {
      const state = event.state;
      if (state?.dashboardViewMode) {
        const newMode = state.dashboardViewMode === 'dashboard' ? 'students' : state.dashboardViewMode;
        viewModeRef.current = newMode;
        setViewMode(newMode);
      } else {
        const nextFromUrl = getViewModeFromUrl();
        viewModeRef.current = nextFromUrl;
        setViewMode(nextFromUrl);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [getViewModeFromUrl]);

  // Cleanup point update timeout on unmount
  useEffect(() => {
    return () => {
      if (pointUpdateTimeoutRef.current) {
        clearTimeout(pointUpdateTimeoutRef.current);
      }
    };
  }, []);

  const [submissions, setSubmissions] = useState([]);
  const [, setLoadingSubmissions] = useState(false);

  // 1. Fetch fresh data from PocketBase
  const fetchFreshSubmissions = async () => {
    if (!activeClass || !activeClass.id) return;
    setLoadingSubmissions(true);
    try {
      const data = await api.pbRequest(
        `/collections/submissions/records?filter=(class_id='${activeClass.id}')&sort=-created`
      );
      setSubmissions(data.items || []);
    } catch (err) {
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // 2. Handle Grading (Passed to InboxPage)
  const handleGradeSubmit = async (submissionId, gradeValue) => {
    try {
      // First, get the submission to find the student ID and previous grade
      const submission = await api.pbRequest(`/collections/submissions/records/${submissionId}`);
      const previousGrade = Number(submission.grade) || 0;

      // Update the submission with grade and status
      await api.pbRequest(`/collections/submissions/records/${submissionId}`, {
        method: 'PATCH',
        body: JSON.stringify({ grade: gradeValue, status: 'graded' })
      });

      // Add only the difference to the student's total score (for regrading)
      if (submission.student_id && gradeValue) {
        const newGrade = Number(gradeValue);
        const pointsToAdd = newGrade - previousGrade;

        // Only update if there's a difference
        if (pointsToAdd !== 0) {
          updateClassesAndSave((prev) =>
            prev.map((c) =>
              c.id === activeClass.id
                ? {
                    ...c,
                    students: c.students.map((s) =>
                      s.id.toString() === submission.student_id.toString()
                        ? { ...s, score: (Number(s.score) || 0) + pointsToAdd }
                        : s
                    )
                  }
                : c
            )
          );
        }
      }

      // Refresh local data so the UI updates instantly
      await fetchFreshSubmissions();
    } catch (err) {
      alert('Failed to save grade. Check console.');
    }
  };

  const generate5DigitCode = () => Math.floor(10000 + Math.random() * 90000).toString();

  useEffect(() => {
    if (!showGridMenu) return;
    const t = setTimeout(() => setShowGridMenu(false), 2000);
    return () => clearTimeout(t);
  }, [showGridMenu]);
  // Handle Countdown Logic
  useEffect(() => {
    let timer;
    if (buzzerState === 'counting') {
      if (buzzerCount > 0) {
        // --- LOUDER COUNTDOWN "BEEP" ---
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'square'; // Harsher, more audible wave
        osc.frequency.value = 1200; // Piercing high pitch
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        gain.gain.setValueAtTime(0.3, audioCtxRef.current.currentTime); // Louder volume
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.2);

        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.2);
        timer = setTimeout(() => setBuzzerCount(buzzerCount - 1), 1000);
      } else {
        // --- EXTREME CONTINUOUS ALARM ---
        setBuzzerState('buzzing');

        // Dual oscillators create a "beating" effect that is physically harder to ignore
        const osc1 = audioCtxRef.current.createOscillator();
        const osc2 = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.frequency.value = 180; // Low buzz
        osc2.frequency.value = 184; // Slight offset creates jarring vibration

        const lfo = audioCtxRef.current.createOscillator();
        const lfoGain = audioCtxRef.current.createGain();
        lfo.frequency.value = 8; // Faster "wah-wah" modulation
        lfoGain.gain.value = 40;
        lfo.connect(lfoGain);
        lfoGain.connect(osc1.frequency);
        lfoGain.connect(osc2.frequency);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        gain.gain.value = 0.4; // Significantly Louder

        osc1.start();
        osc2.start();
        lfo.start();
        mainOscRef.current = { stop: () => { osc1.stop(); osc2.stop(); lfo.stop(); } };
      }
    }
    return () => clearTimeout(timer);
  }, [buzzerState, buzzerCount]);
  const ensureCodesAndOpen = () => {
    const currentAccessCodes = typeof activeClass.Access_Codes === 'object' && activeClass.Access_Codes !== null
      ? activeClass.Access_Codes
      : {};

    let needsUpdate = false;
    const updatedCodesObject = { ...currentAccessCodes };

    activeClass.students.forEach(s => {
      if (!updatedCodesObject[s.id]) {
        needsUpdate = true;
        updatedCodesObject[s.id] = {
          parentCode: generate5DigitCode(),
          studentCode: generate5DigitCode()
        };
      }
    });

    if (needsUpdate) {
      updateClasses(prev => prev.map(c =>
        c.id === activeClass.id ? { ...c, Access_Codes: updatedCodesObject } : c
      ));
    }
    setShowCodesPage(true);
  };

  // --- STUDENT MANAGEMENT HANDLERS ---
  const handleEditStudent = useCallback((student) => {
    setEditingStudentId(student.id);
    setEditStudentName(student.name || '');
    setEditStudentAvatar(student.avatar || null);
    setOriginalEditAvatar(student.avatar || null); // Store original avatar

    // Check if student has an avatar set (from bulk add)
    if (student.avatarSetId && AVATAR_SETS.find(s => s.id === student.avatarSetId)) {
      const avatarSet = AVATAR_SETS.find(s => s.id === student.avatarSetId);
      setEditAvatarSetId(student.avatarSetId);
      setEditAvatarSetList(generateAvatarSetList(student.avatarSetId, avatarSet?.count || 30));
      setEditSelectedAvatarIndex(student.avatarIndex || 0);
      setEditSelectedSeed(null);
    } else {
      // Student doesn't have an avatar set
      // Check if they have a custom uploaded photo (base64 or external URL that's not a boringAvatar URL)
      const hasCustomPhoto = student.avatar &&
        !student.avatar.startsWith('data:image/svg+xml') &&
        !student.avatar.startsWith('http://i.pravatar.cc');

      if (hasCustomPhoto) {
        // Keep the custom uploaded photo
        // Don't set any avatar set or seed - let editStudentAvatar handle it
        setEditAvatarSetId(null);
        setEditAvatarSetList([]);
        setEditSelectedAvatarIndex(null);
        setEditSelectedSeed(null);
      } else {
        // No custom photo, default to animal avatars
        setEditAvatarSetId(null);
        setEditAvatarSetList([]);
        setEditSelectedAvatarIndex(null);
        setEditSelectedSeed(null);
      }
    }
  }, []);

  const handleSaveStudentEdit = () => {
    if (!editStudentName.trim()) return;

    // Handle avatar - either uploaded photo, avatar set avatar, or animal avatar
    let finalAvatar;
    let finalAvatarSetId = null;
    let finalAvatarIndex = null;

    // Only use editStudentAvatar if it's different from the original
    if (editStudentAvatar && editStudentAvatar !== originalEditAvatar) {
      // User uploaded a new custom photo
      finalAvatar = editStudentAvatar;
    } else if (editAvatarSetId && editSelectedAvatarIndex !== null) {
      // User selected from avatar set
      finalAvatar = getAvatarFromSet(editAvatarSetId, editSelectedAvatarIndex);
      finalAvatarSetId = editAvatarSetId;
      finalAvatarIndex = editSelectedAvatarIndex;
    } else if (editSelectedSeed) {
      // User selected animal avatar (original behavior)
      finalAvatar = avatarByCharacter(editSelectedSeed);
    } else {
      // No change to avatar - preserve the original
      const currentStudent = activeClass.students.find(s => s.id === editingStudentId);
      finalAvatar = currentStudent?.avatar;
      finalAvatarSetId = currentStudent?.avatarSetId;
      finalAvatarIndex = currentStudent?.avatarIndex;
    }

    updateClassesAndSave((prev) =>
      prev.map((c) =>
        c.id === activeClass.id
          ? {
            ...c,
            students: c.students.map((s) =>
              s.id === editingStudentId
                ? { ...s, name: editStudentName, avatar: finalAvatar, avatarSetId: finalAvatarSetId, avatarIndex: finalAvatarIndex }
                : s
            )
          }
          : c
      )
    );

    setEditingStudentId(null);
    setEditStudentName('');
    setEditStudentAvatar(null);
    setOriginalEditAvatar(null);
    setEditSelectedSeed(null);
    setEditAvatarSetId(null);
    setEditAvatarSetList([]);
    setEditSelectedAvatarIndex(null);
  };

  const handleCloseEditModal = () => {
    setEditingStudentId(null);
    setEditStudentName('');
    setEditStudentAvatar(null);
    setOriginalEditAvatar(null);
    setEditSelectedSeed(null);
    setEditAvatarSetId(null);
    setEditAvatarSetList([]);
    setEditSelectedAvatarIndex(null);
    setHoveredEditChar(null);
  };

  const handleDeleteStudent = useCallback((student) => {
    updateClassesAndSave((prev) =>
      prev.map((c) => {
        if (c.id === activeClass.id) {
          const updatedCodes = { ...(c.Access_Codes || {}) };
          delete updatedCodes[student.id];
          return {
            ...c,
            students: c.students.filter((s) => s.id !== student.id),
            Access_Codes: updatedCodes
          };
        }
        return c;
      })
    );
    setDeleteConfirmStudentId(null);
  }, [activeClass?.id, updateClassesAndSave]);

  const handleGivePoint = async (behavior) => {
    if (!selectedStudent) return;
    const today = new Date().toISOString().split('T')[0];
    if (selectedStudent.attendance === 'absent' && selectedStudent.attendanceDate === today) {
      return;
    }

    const newLog = {
      label: behavior.label,
      pts: behavior.pts,
      type: behavior.type,
      timestamp: new Date().toISOString()
    };

    const previousScore = Number(selectedStudent.score) || 0;
    const newScore = previousScore + (Number(behavior.pts) || 0);
    
    const updatedStudent = {
      ...selectedStudent,
      score: newScore,
      history: [...(selectedStudent.history || []), newLog]
    };

    // Check for level up
    const previousLevel = Math.floor(previousScore / 50) + 1;
    const newLevel = Math.floor(newScore / 50) + 1;
    
    if (newLevel > previousLevel) {
      setLevelUpStudent(updatedStudent);
      // Auto-hide overlay after 3 seconds
      setTimeout(() => setLevelUpStudent(null), 3000);
    }

    setShowPoint({ visible: true, student: selectedStudent, points: behavior.pts, behaviorEmoji: behavior.icon || '⭐', behaviorAudio: behavior.audio, stickerId: behavior.stickerId });

    // Update local state immediately (optimistic update)
    updateClasses((prev) =>
      prev.map((c) =>
        c.id === activeClass.id
          ? {
            ...c,
            students: c.students.map((s) => {
              if (s.id === selectedStudent.id) {
                return updatedStudent;
              }
              return s;
            })
          }
        : c
      )
    );

    // Trigger animation for the single winner
    try { triggerAnimationForIds([selectedStudent.id], behavior.pts); } catch (e) { /* ignore */ }

    // Batch the update - add to pending updates
    pendingStudentUpdatesRef.current.set(selectedStudent.id, {
      score: updatedStudent.score,
      history: updatedStudent.history
    });

    // Debounce the server update - if multiple clicks happen within 500ms, they'll be batched
    if (pointUpdateTimeoutRef.current) {
      clearTimeout(pointUpdateTimeoutRef.current);
    }

    pointUpdateTimeoutRef.current = setTimeout(async () => {
      if (isUpdatingRef.current) return;
      isUpdatingRef.current = true;

      try {
        const updates = Array.from(pendingStudentUpdatesRef.current.entries()).map(([id, updates]) => ({ id, updates }));

        if (updates.length === 1) {
          // Single student - use updateStudent
          const result = await api.updateStudent(activeClass.id, updates[0].id, updates[0].updates);
        } else if (updates.length > 1) {
          // Multiple students - use batch updateStudents
          const result = await api.updateStudents(activeClass.id, updates);
        }

        pendingStudentUpdatesRef.current.clear();
      } catch (error) {
        console.error('Failed to update student points:', error);
      } finally {
        isUpdatingRef.current = false;
      }
    }, 500);

    setSelectedStudent(null);
  };

  const handleGivePointsToClass = async (behavior) => {
    if (!activeClass?.students) return;
    const presentStudents = activeClass.students.filter(s => !absentStudents.has(s.id));

    const newLog = {
      label: behavior.label,
      pts: behavior.pts,
      type: behavior.type,
      timestamp: new Date().toISOString()
    };

    // Prepare updates for all present students
    const studentUpdates = presentStudents.map(s => ({
      id: s.id,
      updates: {
        score: (Number(s.score) || 0) + (Number(behavior.pts) || 0),
        history: [...(s.history || []), newLog]
      }
    }));

    setShowPoint({ visible: true, student: { name: t('dashboard.whole_class'), students: presentStudents }, points: behavior.pts, behaviorEmoji: behavior.icon || '⭐', behaviorAudio: behavior.audio, stickerId: behavior.stickerId });

    // Update server efficiently - batch update
    try {
      await api.updateStudents(activeClass.id, studentUpdates);
    } catch (error) {
      console.error('Failed to update class points:', error);
    }

    // Optimistic UI update
    updateClasses((prev) =>
      prev.map((c) =>
        c.id === activeClass.id
          ? { ...c, students: (c.students || []).map((s) => {
              if (!s?.id || absentStudents.has(s.id)) return s;
              return {
                ...s,
                score: (Number(s.score) || 0) + (Number(behavior.pts) || 0),
                history: [...(s.history || []), newLog]
              };
            })
          }
        : c
      )
    );
    setShowClassBehaviorModal(false);
    // Trigger animation for present students only
    try { triggerAnimationForIds(presentStudents.map(s => s.id), behavior.pts); } catch (e) { console.warn('triggerAnimationForIds failed', e); }
  };

  // Function to give points to multiple selected students via behavior modal
  const handleGivePointsToMultiSelect = async (behavior) => {
    const selectedStudentsArray = Array.from(multiSelectedStudents)
      .map(id => sortedStudents.find(s => s.id === id))
      .filter(Boolean);

    if (selectedStudentsArray.length === 0) return;

    const newLog = {
      label: behavior.label,
      pts: behavior.pts,
      type: behavior.type,
      timestamp: new Date().toISOString()
    };

    // Prepare batch updates
    const studentUpdates = selectedStudentsArray.map(s => ({
      id: s.id,
      updates: {
        score: (Number(s.score) || 0) + (Number(behavior.pts) || 0),
        history: [...(s.history || []), newLog]
      }
    }));

    // 1. Trigger the animation for the selected students
    setShowPoint({
      visible: true,
      student: { name: `${selectedStudentsArray.length} Selected`, students: selectedStudentsArray },
      points: behavior.pts,
      behaviorEmoji: behavior.icon || '⭐',
      behaviorAudio: behavior.audio,
      stickerId: behavior.stickerId
    });

    // 2. Update server efficiently - batch update
    try {
      await api.updateStudents(activeClass.id, studentUpdates);
    } catch (error) {
      console.error('Failed to update multi-select points:', error);
    }

    // 3. Optimistic UI update
    updateClasses((prev) =>
      prev.map((c) =>
        c.id === activeClass.id
          ? {
            ...c,
            students: c.students.map((s) => {
              // Check if this student is in our selected array
              const isSelected = selectedStudentsArray.find(sel => sel.id === s.id);
              if (isSelected) {
                return {
                  ...s,
                  score: (Number(s.score) || 0) + (Number(behavior.pts) || 0),
                  history: [...(s.history || []), newLog]
                };
              }
              return s;
            })
          }
          : c
      )
    );

    // Clear selections and close modal
    setMultiSelectedStudents(new Set());
    setIsMultiSelectMode(false);
    setShowMultiSelectBehaviorModal(false);

    // Trigger animation for selected students
    try { triggerAnimationForIds(selectedStudentsArray.map(s => s.id), behavior.pts); } catch (e) { console.warn('triggerAnimationForIds failed', e); }
  };

  const handleDeleteMultiSelectedStudents = useCallback(() => {
    const selectedIds = Array.from(multiSelectedStudents);
    if (selectedIds.length === 0) return;
    const confirmed = window.confirm(`Delete ${selectedIds.length} selected student${selectedIds.length > 1 ? 's' : ''}?`);
    if (!confirmed) return;
    const applyUpdate = updateClassesAndSave || updateClasses;
    applyUpdate((prev) =>
      (prev || []).map((c) =>
        c.id === activeClass.id
          ? { ...c, students: (c.students || []).filter((s) => !multiSelectedStudents.has(s.id)) }
          : c
      )
    );
    const nextAbsent = new Set(absentStudents);
    selectedIds.forEach((id) => nextAbsent.delete(id));
    setAbsentStudents(nextAbsent);
    setMultiSelectedStudents(new Set());
    setIsMultiSelectMode(false);
  }, [multiSelectedStudents, updateClassesAndSave, updateClasses, activeClass?.id, absentStudents]);

  // --- SURGICAL ADDITION FOR LUCKY DRAW MULTI-WINNERS ---
  const handleGivePointsToMultiple = async (studentsArray, points = 1) => {
    const newLog = {
      label: 'Lucky Draw Winner',
      pts: points,
      type: 'wow',
      timestamp: new Date().toISOString()
    };

    // Prepare batch updates
    const studentUpdates = studentsArray.map(s => ({
      id: s.id,
      updates: {
        score: (Number(s.score) || 0) + (Number(points) || 0),
        history: [...(s.history || []), newLog]
      }
    }));

    // 1. Trigger the animation for the whole group
    setShowPoint({
      visible: true,
      student: { name: `${studentsArray.length} Winners`, students: studentsArray },
      points: points,
      behaviorEmoji: '🎉'
    });

    // 2. Update server efficiently - batch update
    try {
      await api.updateStudents(activeClass.id, studentUpdates);
    } catch (error) {
      console.error('Failed to update multi-select points:', error);
    }

    // 3. Optimistic UI update
    updateClasses((prev) =>
      prev.map((c) =>
        c.id === activeClass.id
          ? {
            ...c,
            students: c.students.map((s) => {
              // Check if this student is in our winners array
              const isWinner = studentsArray.find(w => w.id === s.id);
              if (isWinner) {
                return {
                  ...s,
                  score: (Number(s.score) || 0) + (Number(points) || 0),
                  history: [...(s.history || []), newLog]
                };
              }
              return s;
            })
          }
        : c
      )
    );
    // Trigger animation for winners
    try { triggerAnimationForIds(studentsArray.map(w => w.id), points); } catch (e) { console.warn('triggerAnimationForIds failed', e); }
  };

    if (!activeClass) return <div style={{ ...styles.layout, overflowX: 'hidden' }}>{t('dashboard.no_students')}</div>;
    // Sum up all points from all students safely
  const totalClassPoints = activeClass?.students?.reduce((acc, s) => acc + (Number(s.score) || 0), 0) || 0;
  const dockPx = mergedWorkspace ? 0 : (Number(leftDockInsetPx) || 0);
  const chromeTop = mergedWorkspace ? (Number(layoutChrome?.top) || 0) : 0;
  const chromeLeft = mergedWorkspace ? (Number(layoutChrome?.left) || 0) : dockPx;
  const chromeBottom = mergedWorkspace ? (Number(layoutChrome?.bottom) || 0) : 0;
  const navVariant = mergedWorkspace ? 'dock' : 'sidebar';
  const effectiveNavVariant = mergedWorkspace && isClassToolsPanelOpen ? 'sidebar' : navVariant;
  const forceLabelRowInPanel = mergedWorkspace && isClassToolsPanelOpen;

  /** Sub-views use a neutral surface in merged workspace so class canvas color never shows through gaps / dock reserve (matches ReportsPage). */
  const dashboardSubPage =
    viewMode === 'messages' ||
    viewMode === 'codes' ||
    viewMode === 'settings' ||
    viewMode === 'assignments' ||
    viewMode === 'timer' ||
    viewMode === 'reports' ||
    viewMode === 'luckyDraw' ||
    viewMode === 'eggroad' ||
    viewMode === 'appSettings';
  const classCanvasBg = activeClass?.background_color || '#F4F1EA';
  const mergedNeutralSurfaceBg = isDark ? '#0f172a' : '#ffffff';
  const mergedShellBackground = mergedWorkspace
    ? (dashboardSubPage ? mergedNeutralSurfaceBg : classCanvasBg)
    : null;

  const floatingDockChrome = isDark
    ? {
        background: 'rgba(30,41,59,0.88)',
        border: '1px solid rgba(148,163,184,0.28)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.42)'
      }
    : {
        background: 'rgba(255,255,255,0.92)',
        border: '1px solid rgba(15,23,42,0.1)',
        boxShadow: '0 16px 44px rgba(15,23,42,0.14)'
      };

  const navShellStyle = mergedWorkspace
    ? {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: 8,
        width: '100%',
        maxWidth: '100%',
        padding: 2,
        boxSizing: 'border-box',
        overflowX: 'hidden',
        overflowY: 'auto',
        borderRadius: 14,
        position: 'relative',
        zIndex: 100000,
        pointerEvents: 'auto'
      }
    : isMobile
      ? {
          position: 'fixed',
          left: dockPx,
          top: 0,
          height: '100vh',
          width: '72px',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '6px',
          background: '#EEF2FF',
          transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          boxShadow: sidebarVisible ? '0 0 20px rgba(0,0,0,0.06)' : 'none',
          outline: '3px solid rgba(99,102,241,0.12)',
          borderRight: '1px solid rgba(0,0,0,0.04)',
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingBottom: 16
        }
      : {
          width: '210px',
          background: '#EEF2FF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '4px',
          borderRight: '1px solid rgba(0,0,0,0.06)',
          position: 'fixed',
          left: dockPx,
          top: 0,
          height: '100vh',
          zIndex: 99999,
          transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          boxShadow: sidebarVisible ? '0 0 20px rgba(0,0,0,0.1)' : 'none',
          outline: '3px solid rgba(99,102,241,0.08)',
          boxSizing: 'border-box',
          marginTop: '7px',
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingBottom: 16
        };

  // --- CONDITIONAL RENDERS FOR SUB-PAGES ---

  return (
    <>
      <div style={{
        ...styles.layout,
        background: mergedShellBackground ?? classCanvasBg,
        overflowX: 'hidden',
        transition: 'none',
        ...(mergedWorkspace
          ? { flexDirection: 'column', height: '100%', minHeight: 0, flex: 1, alignSelf: 'stretch' }
          : {})
      }}>
        <style>{`
          @keyframes pulseChevron { 
            0% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-4px) scale(1.08); }
            100% { transform: translateY(0) scale(1); }
          }
        `}</style>
        {/* --- SIDEBAR (left) or bottom dock (merged workspace) --- */}
        {appSettings.showNavbar && (() => {
          const dockNavBody = (
        <nav
          ref={sidebarRef}
          className={mergedWorkspace ? undefined : 'safe-area-top'}
          style={navShellStyle}
        >
          {!mergedWorkspace && (
          <SidebarIcon
            icon={Home}
            variant={effectiveNavVariant}
            forceLabelRow={forceLabelRowInPanel}
            label={t('nav.back')}
            onClick={handleSidebarItemClick(() => { 
              onBack(); 
              setViewModeWithHistory('students'); 
              if (isMobile) setSidebarVisible(false); 
            })}
            style={styles.icon}
          />
          )}

          {appSettings.showAssignments && (
          <SidebarIcon
            variant={effectiveNavVariant}
            forceLabelRow={forceLabelRowInPanel}
            icon={ClipboardList}
            label={t('dashboard.assignments')}
            onClick={handleSidebarItemClick(() => {
              closeModal();
              setViewModeWithHistory('assignments');
              if (isMobile) setSidebarVisible(false);
            })}
            isActive={viewMode === 'assignments'}
          />
          )}

          {appSettings.showInbox && (
          <SidebarIcon
            variant={effectiveNavVariant}
            forceLabelRow={forceLabelRowInPanel}
            icon={MessageSquare}
            label={t('dashboard.inbox_grading')}
            onClick={handleSidebarItemClick(() => {
              closeModal();
              setViewModeWithHistory('messages');
              fetchFreshSubmissions();
              if (isMobile) setSidebarVisible(false);
            })}
            isActive={viewMode === 'messages'}
            style={styles.icon}
            badge={(
              <>
                {submissions.filter(s => s.status === 'submitted').length > 0 && (
                  <span style={styles.badge}>
                    {submissions.filter(s => s.status === 'submitted').length}
                  </span>
                )}
              </>
            )}
          />
          )}

          {appSettings.showLuckyDraw && (
          <SidebarIcon
            variant={effectiveNavVariant}
            forceLabelRow={forceLabelRowInPanel}
            icon={Dices}
            label={t('dashboard.lucky_draw')}
            onClick={handleSidebarItemClick(() => {
              closeModal();
              openModalWithHistory('luckyDraw', setIsLuckyDrawOpen);
              if (isMobile) setSidebarVisible(false);
            })}
            isActive={isLuckyDrawOpen}
            style={styles.icon}
            dataNavbarIcon="lucky-draw"
          />
          )}

          {appSettings.showEggRoad && (
          <SidebarIcon
            variant={effectiveNavVariant}
            forceLabelRow={forceLabelRowInPanel}
            icon={Trophy}
            label={t('dashboard.road')}
            onClick={handleSidebarItemClick(() => {
              closeModal();
              setViewModeWithHistory('eggroad');
              if (isMobile) setSidebarVisible(false);
            })}
            isActive={viewMode === 'eggroad'}
            style={styles.icon}
            dataNavbarIcon="egg-road"
          />
          )}

          {appSettings.showAttendance && (
          <SidebarIcon
            variant={effectiveNavVariant}
            forceLabelRow={forceLabelRowInPanel}
            icon={CheckSquare}
            label={t('dashboard.attendance_mode')}
            onClick={handleSidebarItemClick(() => {
              closeModal();
              if (!isAttendanceMode) {
                setViewModeWithHistory('students');
                openAttendanceMode();
              } else {
                cancelAttendanceMode();
              }
              if (isMobile) setSidebarVisible(false);
            })}
            isActive={isAttendanceMode}
            style={styles.icon}
            dataNavbarIcon="attendance"
          />
          )}

          {appSettings.showReports && (
          <SidebarIcon
            variant={effectiveNavVariant}
            forceLabelRow={forceLabelRowInPanel}
            icon={BarChart2}
            label={t('dashboard.reports')}
            onClick={handleSidebarItemClick(() => {
              closeModal();
              setViewModeWithHistory('reports');
              updateClasses(prev => prev.map(c => c.id === activeClass.id ? { ...c, isViewingReports: true } : c));
              if (isMobile) setSidebarVisible(false);
            })}
            isActive={viewMode === 'reports'}
            style={styles.icon}
          />
          )}
          {appSettings.showTimer && (
          <SidebarIcon
            variant={effectiveNavVariant}
            forceLabelRow={forceLabelRowInPanel}
            icon={Clock}
            label={t('dashboard.class_timer')}
            onClick={handleSidebarItemClick(() => {
              closeModal();
              setTimerOpen(true);
              setTimerFloatingStage('setup');
              if (isMobile) setSidebarVisible(false);
            })}
            isActive={timerOpen}
            style={styles.icon}
          />
          )}
          {appSettings.showBuzzer && (
          <SidebarIcon
            variant={effectiveNavVariant}
            forceLabelRow={forceLabelRowInPanel}
            icon={Siren}
            label={t('dashboard.attention_buzzer')}
            onClick={() => {
              closeModal();
              startBuzzerWithHistory();
              if (isMobile) setSidebarVisible(false);
            }}
            isActive={buzzerState !== 'idle'}
            style={{ ...styles.icon, color: buzzerState !== 'idle' ? '#FF5252' : '#636E72' }}
          />
          )}
          {appSettings.showWhiteboard && (
          <SidebarIcon
            variant={effectiveNavVariant}
            forceLabelRow={forceLabelRowInPanel}
            icon={Presentation}
            label={t('dashboard.whiteboard')}
            onClick={() => {
              closeModal();
              openModalWithHistory('whiteboard', setShowWhiteboard);
              if (isMobile) setSidebarVisible(false);
            }}
            isActive={showWhiteboard}
            style={styles.icon}
          />
          )}
          {appSettings.showPointsCards && (
          <SidebarIcon
            variant={effectiveNavVariant}
            forceLabelRow={forceLabelRowInPanel}
            icon={Award}
            label={t('dashboard.points_cards')}
            onClick={() => {
              closeModal();
              setViewModeWithHistory('settings');
              if (isMobile) setSidebarVisible(false);
            }}
            isActive={viewMode === 'settings'}
            style={styles.icon}
            dataNavbarIcon="settings"
          />
          )}
        </nav>
          );
          const attendanceDockEl = mergedWorkspace && isAttendanceMode ? (
            <div
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: isMobile ? 8 : 12,
                flexWrap: 'wrap',
                maxWidth: 'min(calc(100vw - 24px), 1200px)',
                padding: isMobile ? '10px 12px' : '12px 16px',
                borderRadius: 999,
                border: floatingDockChrome.border,
                background: floatingDockChrome.background,
                boxShadow: floatingDockChrome.boxShadow,
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)'
              }}
            >
              <button
                onClick={() => {
                  const next = new Set();
                  setAbsentStudents(next);
                  setAttendanceDirty(!areSetsEqual(next, attendanceBaselineAbsent));
                }}
                style={{ border: 'none', background: 'transparent', color: '#4F46E5', fontWeight: 800, fontSize: isMobile ? 14 : 18, cursor: 'pointer' }}
              >
                🟢 Mark all present
              </button>
              <button
                onClick={() => {
                  const next = new Set((activeClass.students || []).map((s) => s.id));
                  setAbsentStudents(next);
                  setAttendanceDirty(!areSetsEqual(next, attendanceBaselineAbsent));
                }}
                style={{ border: 'none', background: 'transparent', color: '#4F46E5', fontWeight: 800, fontSize: isMobile ? 14 : 18, cursor: 'pointer' }}
              >
                🔴 Mark all absent
              </button>
              <button
                onClick={cancelAttendanceMode}
                style={{ border: 'none', background: 'transparent', color: '#6D28D9', fontWeight: 800, fontSize: isMobile ? 14 : 18, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={saveAttendanceMode}
                disabled={!attendanceDirty}
                style={{
                  border: 'none',
                  borderRadius: 999,
                  padding: isMobile ? '10px 14px' : '10px 16px',
                  background: attendanceDirty ? 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)' : '#CBD5E1',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: isMobile ? 14 : 17,
                  cursor: attendanceDirty ? 'pointer' : 'not-allowed'
                }}
              >
                Save attendance
              </button>
            </div>
          ) : null;
          const multiSelectDockEl = mergedWorkspace && isMultiSelectMode && !isAttendanceMode ? (
            <div
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: isMobile ? 8 : 12,
                flexWrap: 'wrap',
                maxWidth: 'min(calc(100vw - 24px), 1200px)',
                padding: isMobile ? '10px 12px' : '12px 16px',
                borderRadius: 999,
                border: floatingDockChrome.border,
                background: floatingDockChrome.background,
                boxShadow: floatingDockChrome.boxShadow,
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)'
              }}
            >
              <span style={{ color: isDark ? '#e2e8f0' : '#334155', fontWeight: 900, fontSize: isMobile ? 12 : 14 }}>
                {multiSelectedStudents.size} selected
              </span>
              <button
                onClick={() => setShowMultiSelectBehaviorModal(true)}
                disabled={multiSelectedStudents.size === 0}
                style={{
                  border: 'none',
                  borderRadius: 999,
                  padding: isMobile ? '10px 14px' : '10px 16px',
                  background: multiSelectedStudents.size === 0 ? '#CBD5E1' : 'linear-gradient(135deg, #16A34A 0%, #059669 100%)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: isMobile ? 14 : 16,
                  cursor: multiSelectedStudents.size === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Give points
              </button>
              <button
                onClick={handleDeleteMultiSelectedStudents}
                disabled={multiSelectedStudents.size === 0}
                style={{
                  border: 'none',
                  borderRadius: 999,
                  padding: isMobile ? '10px 14px' : '10px 16px',
                  background: multiSelectedStudents.size === 0 ? '#CBD5E1' : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: isMobile ? 14 : 16,
                  cursor: multiSelectedStudents.size === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Delete students
              </button>
              <button
                onClick={() => {
                  setIsMultiSelectMode(false);
                  setMultiSelectedStudents(new Set());
                }}
                style={{ border: 'none', background: 'transparent', color: '#6D28D9', fontWeight: 800, fontSize: isMobile ? 14 : 18, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          ) : null;

          const classToolsNavEl = !mergedWorkspace ? dockNavBody : null;
          const classToolsPanelEl = mergedWorkspace && isClassToolsPanelOpen ? (
              <div
                ref={classToolsPanelRef}
                style={{
                  position: 'fixed',
                  top: 0,
                  right: 0,
                  width: isMobile ? 'min(66vw, 238px)' : 'clamp(204px, 18.7vw, 272px)',
                  height: '100vh',
                  overflowY: 'auto',
                  borderRadius: 0,
                  padding: 10,
                  zIndex: 100051,
                  borderLeft: isDark ? '1px solid rgba(148,163,184,0.2)' : '1px solid rgba(15,23,42,0.08)',
                  background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.96)',
                  backdropFilter: 'none',
                  WebkitBackdropFilter: 'none',
                  boxShadow: isDark ? '0 0 20px rgba(0,0,0,0.1)' : '0 0 20px rgba(15,23,42,0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, padding: '2px 4px 8px', borderBottom: isDark ? '1px solid rgba(148,163,184,0.15)' : '1px solid rgba(15,23,42,0.06)' }}>
                  <div style={{ fontWeight: 900, fontSize: 15, color: isDark ? '#e2e8f0' : '#0f172a' }}>Class Tools</div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsClassToolsPanelOpen(false);
                      setIsClassToolsSettingsCollapsed(true);
                    }}
                    style={{ border: 'none', background: 'transparent', color: isDark ? '#cbd5e1' : '#475569', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Close
                  </button>
                </div>
                <div style={{ display: 'grid', gap: 8, padding: '8px 4px' }}>
                  {dockNavBody}
                </div>
                <div style={{ marginTop: 10, borderTop: isDark ? '1px solid rgba(148,163,184,0.15)' : '1px solid rgba(15,23,42,0.06)', paddingTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setIsClassToolsSettingsCollapsed((v) => !v)}
                    style={{
                      width: '100%',
                      border: 'none',
                      background: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 6px 8px',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#64748b' }}>
                      Class Tools Settings
                    </span>
                    {isClassToolsSettingsCollapsed ? <ChevronDown size={14} color={isDark ? '#94a3b8' : '#64748b'} /> : <ChevronUp size={14} color={isDark ? '#94a3b8' : '#64748b'} />}
                  </button>
                  {!isClassToolsSettingsCollapsed && <div style={{ display: 'grid', gap: 8 }}>
                    {[
                      ['showAssignments', 'Assignments'],
                      ['showInbox', 'Inbox / Grading'],
                      ['showLuckyDraw', 'Lucky Draw'],
                      ['showEggRoad', 'Class Journey'],
                      ['showAttendance', 'Attendance'],
                      ['showReports', 'Reports'],
                      ['showTimer', 'Class Timer'],
                      ['showBuzzer', 'Attention Buzzer'],
                      ['showWhiteboard', 'Whiteboard'],
                      ['showPointsCards', 'Points & Cards']
                    ].map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          const nextSettings = { ...appSettings, [key]: !appSettings[key] };
                          setAppSettings(nextSettings);
                          updateClasses((prev) => prev.map((c) => (c.id === activeClass.id ? { ...c, appSettings: nextSettings } : c)));
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          border: isDark ? '1px solid rgba(148,163,184,0.2)' : '1px solid rgba(15,23,42,0.08)',
                          borderRadius: 10,
                          background: isDark ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.9)',
                          color: isDark ? '#e2e8f0' : '#0f172a',
                          padding: '9px 10px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <span>{label}</span>
                        <span style={{ color: appSettings[key] ? '#16a34a' : '#94a3b8', fontWeight: 900 }}>
                          {appSettings[key] ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    ))}
                  </div>}
                </div>
              </div>
          ) : null;
          if (attendanceDockEl) {
            if (bottomToolbarHost) return createPortal(attendanceDockEl, bottomToolbarHost);
            return attendanceDockEl;
          }
          if (multiSelectDockEl) {
            if (bottomToolbarHost) return createPortal(multiSelectDockEl, bottomToolbarHost);
            return multiSelectDockEl;
          }
          if (classToolsPanelEl) return createPortal(classToolsPanelEl, document.body);
          if (mergedWorkspace) return null;
          if (bottomToolbarHost) return createPortal(classToolsNavEl, bottomToolbarHost);
          return classToolsNavEl;
        })()}

          <style>{`
            @keyframes hamburgerPulse {
              0%, 100% { 
                transform: scale(1);
                box-shadow: 0 6px 18px rgba(0,0,0,0.12);
              }
              50% { 
                transform: scale(1.05);
                box-shadow: 0 8px 24px rgba(99,102,241,0.25);
              }
            }
            @keyframes hamburgerGlow {
              0%, 100% {
                box-shadow: 0 6px 18px rgba(0,0,0,0.12), 0 0 0 0 rgba(99,102,241,0);
              }
              50% {
                box-shadow: 0 8px 24px rgba(99,102,241,0.2), 0 0 20px 2px rgba(99,102,241,0.1);
              }
            }
            @keyframes hamburgerIconRotate {
              0%, 100% { transform: rotate(0deg); }
              25% { transform: rotate(-5deg); }
              75% { transform: rotate(5deg); }
            }
            @keyframes hamburgerFadeIn {
              0% { opacity: 0; transform: translateX(-20px); }
              100% { opacity: 1; transform: translateX(0); }
            }
          `}</style>

          {appSettings.showNavbar && !mergedWorkspace && (
          <button
            ref={chevronRef}
            onMouseDown={(e) => e.stopPropagation()} // prevent document listener from firing on click
            onClick={(e) => { e.stopPropagation(); setSidebarVisible(prev => !prev); }}
            style={(() => {
              const baseStyles = {
                position: 'fixed',
                zIndex: 9999999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                willChange: 'transform, left',
                color: isDark ? '#E5E7EB' : '#1F2933',
                background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.96)',
                border: isDark
                  ? '1px solid rgba(148,163,184,0.85)'
                  : '1px solid rgba(148,163,184,0.8)',
                boxShadow: isDark
                  ? '0 8px 24px rgba(15,23,42,0.85)'
                  : '0 6px 18px rgba(15,23,42,0.25)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              };

              if (isMobile) {
                const baseLeft = sidebarVisible ? '84px' : '6px';
                return {
                  ...baseStyles,
                  left: dockPx ? `calc(${dockPx}px + ${baseLeft})` : baseLeft,
                  top: '5px',
                  borderRadius: '12px',
                  width: '48px',
                  height: '48px',
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                };
              }
              const baseLeftDesk = sidebarVisible ? '220px' : '6px';
              return {
                ...baseStyles,
                left: dockPx ? `calc(${dockPx}px + ${baseLeftDesk})` : baseLeftDesk,
                top: 6,
                borderRadius: '12px',
                width: '44px',
                height: '48px',
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              };
            })()}
          >
            <AnimatedHamburger isOpen={sidebarVisible} />
          </button>
          )}

        {/* BUZZER OVERLAY */}
        {buzzerState !== 'idle' && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999, // On top of everything
            background: buzzerState === 'buzzing' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: buzzerState === 'buzzing' ? 'pulseRed 0.5s infinite alternate' : 'none'
          }}>
            <style>{`
      @keyframes pulseRed { from { background: rgba(255, 0, 0, 0.1); } to { background: rgba(255, 0, 0, 0.3); } }
      @keyframes scaleIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    `}</style>

            <div style={{
              textAlign: 'center',
              color: 'white',
              animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
              {buzzerState === 'counting' ? (
                <>
                  <div style={{ fontSize: '180px', fontWeight: '900', textShadow: '0 0 50px rgba(99, 102, 241, 0.5)' }}>
                    {buzzerCount}
                  </div>
                  <p style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '4px', opacity: 0.8 }}>EYES ON ME</p>
                </>
              ) : (
                <>
                  <Zap size={100} color="#FFD700" style={{ marginBottom: '20px' }} />
                  <h1 style={{ fontSize: '64px', fontWeight: '900', marginBottom: '40px' }}>ATTENTION!</h1>
                  <button
                    onClick={stopBuzzer}
                    style={{
                      padding: '24px 60px',
                      borderRadius: '30px',
                      border: 'none',
                      background: 'white',
                      color: 'red',
                      fontSize: '24px',
                      fontWeight: '900',
                      cursor: 'pointer',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    I'M LISTENING
                  </button>
                </>
              )}

            </div>

          </div>
        )}
        <main style={{
          ...styles.content,
          ...(mergedWorkspace
            ? {
                height: 'auto',
                minHeight: 0,
                flex: 1,
                maxHeight: '100%'
              }
            : {}),
          marginLeft: mergedWorkspace
            ? 0
            : (appSettings.showNavbar
              ? (sidebarVisible ? (isMobile ? '72px' : '210px') : '0')
              : (isMobile ? '60px' : '60px')),
          transition: 'margin-left 0.3s ease',
          paddingTop: (() => {
            if (mergedWorkspace) {
              if (dashboardSubPage) return chromeTop;
              // Sticky class toolbar is in-flow; workspace header is outside this scroll area.
              return 'var(--safe-top, 0px)';
            }
            return dashboardSubPage ? 0 : `calc(${isMobile ? '60px' : '80px'} + var(--safe-top, 0px))`;
          })(),
          paddingBottom: 0,
          ...(mergedWorkspace
            ? {
                background: mergedShellBackground,
                display: 'flex',
                flexDirection: 'column'
              }
            : {}),
          overflowX: 'hidden',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          {(() => {
            const mergedMainBody = (
          <>
          {/* 1. MESSAGES VIEW */}
          {viewMode === 'messages' ? (
            <div key="messages" className="page-animate-in" style={{ height: '100%' }}>
              <InboxPage
                activeClass={activeClass}
                submissions={submissions}
                onGradeSubmit={handleGradeSubmit} // Uses the grading logic in Dashboard
                onBack={() => setViewModeWithHistory('students')} // Closes the window
              />
            </div>
          ) /* 2. ⚡ WIDER TIMER VIEW ⚡ */
            : viewMode === 'timer' ? null :  /* 3. REPORTS VIEW */
              viewMode === 'reports' ? (
                <div key="reports" className="page-animate-in" style={{ height: '100%' }}>
                  <Suspense fallback={<DashboardLoader />}>
                    <ReportsPage
                      activeClass={activeClass}
                      onBack={() => setViewModeWithHistory('students')}
                      updateClasses={updateClasses}
                    />
                  </Suspense>
                </div>
              ) : viewMode === 'assignments' ? (
                <div key="assignments" className="page-animate-in" style={{ height: '100%' }}>
                  <Suspense fallback={<DashboardLoader />}> 
                  <AssignmentsPage
                    activeClass={activeClass}
                    onBack={() => setViewModeWithHistory('students')}
                    onPublish={(data) => {
                      // This logic replaces the "missing" onOpenAssignments
                      updateClasses(prev => prev.map(c =>
                        c.id === activeClass.id
                          ? { ...c, assignments: [...(c.assignments || []), data] }
                          : c
                      ));
                      // Go back after publishing
                      setViewModeWithHistory('students');
                    }}
                  />
                  </Suspense>
                </div>
              ) : viewMode === 'codes' ? ( // Add this block
                <AccessCodesPage
                  activeClass={activeClass}
                  onBack={() => setViewModeWithHistory('students')}
                />
              ) : viewMode === 'settings' ? (
                <div key={`settings-${activeClass.id}`} className="page-animate-in" style={{ height: '100%' }}>
                  <Suspense fallback={<DashboardLoader />}>
                  <SettingsPage
                    key={`settings-page-${activeClass.id}`}
                    activeClass={activeClass}
                    user={user}
                    behaviors={activeClass.behaviors || behaviors}
                    onBack={() => setViewModeWithHistory('students')}
                    onUpdateBehaviors={(newBehaviorsList) => {
                    // ⚡ FIX: Safely update the class with the new array of cards
                    updateClasses(prevClasses => prevClasses.map(c =>
                      c.id === activeClass.id
                        ? { ...c, behaviors: newBehaviorsList }
                        : c
                    ));
                  }}
                />
                </Suspense>
                </div>
              ) : viewMode === 'eggroad' ? (
                <div key="eggroad" className="page-animate-in" style={{ height: '100%' }}>
                  <EggRoad
                    classData={activeClass}
                    allClasses={teacherClasses}
                    onBack={() => setViewModeWithHistory('students')}
                  />
                </div>
              ) : (
                /* 3. STANDARD DASHBOARD VIEW (Default) */

                <>
                  <div
                    style={
                      mergedWorkspace
                        ? {
                          position: 'sticky',
                          top: 0,
                          zIndex: 50,
                          width: '100%',
                          flexShrink: 0,
                          alignSelf: 'stretch'
                        }
                        : { display: 'contents' }
                    }
                  >
                  <header
                    className="safe-area-top"
                    style={{
                      ...styles.header,
                      width: mergedWorkspace ? '100%' : (dockPx ? `calc(100% - ${dockPx}px)` : '100%'),
                      marginLeft: 0,
                      paddingRight: isMobile ? '10px' : '14px',
                      paddingLeft: mergedWorkspace ? 12 : undefined,
                      paddingTop: mergedWorkspace ? 6 : undefined,
                      paddingBottom: mergedWorkspace ? 6 : undefined,
                      boxSizing: 'border-box',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: mergedWorkspace ? 'relative' : 'fixed',
                      left: mergedWorkspace ? 0 : chromeLeft,
                      right: 0,
                      top: mergedWorkspace ? undefined : chromeTop,
                      zIndex: mergedWorkspace ? 1 : 999,
                      borderRadius: mergedWorkspace ? 0 : styles.header.borderRadius,
                      borderBottom: mergedWorkspace ? (isDark ? '1px solid rgba(148,163,184,0.15)' : '1px solid rgba(15,23,42,0.08)') : styles.header.borderBottom,
                      flexShrink: 0
                    }}
                  >
                    {/* Left: merged workspace shows class title here; else home or spacer */}
                    {mergedWorkspace ? (
                      <div style={{
                        fontWeight: 800,
                        fontSize: isMobile ? 14 : 16,
                        color: isDark ? '#f1f5f9' : '#0F172A',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: isMobile ? '42%' : '38%',
                        flexShrink: 0,
                        marginLeft: classRailHidden ? (isMobile ? 50 : 42) : 0,
                        marginRight: 10
                      }}
                      >
                        <div>{activeClass.name}</div>
                        <div style={{
                          fontSize: isMobile ? 11 : 12,
                          fontWeight: 600,
                          color: isDark ? '#94a3b8' : '#64748b',
                          marginTop: 2
                        }}>
                          {activeClass.students?.length || 0} {(activeClass.students?.length || 0) === 1 ? 'student' : 'students'}
                        </div>
                      </div>
                    ) : !appSettings.showNavbar ? (
                      <button
                        onClick={onBack}
                        title={t('appSettings.home')}
                        style={{
                          width: isMobile ? '40px' : '44px',
                          height: isMobile ? '40px' : '44px',
                          borderRadius: '10px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Home size={isMobile ? 18 : 20} color="white" />
                      </button>
                    ) : (
                      <div style={{ width: isMobile ? '40px' : '100px' }} />
                    )}

                    {/* Center: class title (hidden in merged workspace — shown in workspace header) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '9px', flexWrap: 'wrap', justifyContent: 'center', flex: mergedWorkspace ? 1 : undefined }}>
                      {!mergedWorkspace && (
                      <h2 style={{ fontSize: isMobile ? '18px' : '1.5rem', fontWeight: 900, color: '#0F172A', margin: 0, marginRight: 10 }}>
                        {activeClass.name}
                      </h2>
                      )}
                      {!mergedWorkspace && activeClass.id === 'demo-class' && (
                        <span style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          padding: '4px 10px',
                          borderRadius: 20,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                        }}>
                          DEMO
                        </span>
                      )}
                      {onSwitchClass && (teacherClasses || []).length > 1 && !dockPx && !mergedWorkspace && (
                        <div ref={classSwitcherRef} style={{ position: 'relative', flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setClassSwitcherOpen((o) => !o);
                            }}
                            aria-expanded={classSwitcherOpen}
                            aria-haspopup="listbox"
                            title={t('dashboard.switch_class') || 'Switch class'}
                            style={{
                              position: 'relative',
                              width: 56,
                              height: 44,
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              padding: 0
                            }}
                          >
                            {(teacherClasses || []).filter((c) => String(c.id) !== String(activeClass.id)).slice(0, 3).map((c, i) => (
                              <SafeAvatar
                                key={c.id}
                                src={c.avatar || boringAvatar(c.name || 'class')}
                                name={c.name}
                                style={{
                                  position: 'absolute',
                                  left: 2 + i * 10,
                                  top: 2 + i * 3,
                                  width: 30,
                                  height: 30,
                                  borderRadius: 9,
                                  objectFit: 'cover',
                                  border: '2px solid white',
                                  boxShadow: '0 3px 10px rgba(15,23,42,0.2)',
                                  zIndex: 3 - i,
                                  transform: `rotate(${-10 + i * 10}deg)`
                                }}
                              />
                            ))}
                            <ChevronDown
                              size={14}
                              color={isDark ? '#94a3b8' : '#64748b'}
                              style={{ position: 'absolute', right: -2, bottom: 0, pointerEvents: 'none' }}
                            />
                          </button>
                          {classSwitcherOpen && (
                            <div
                              role="listbox"
                              aria-label={t('dashboard.switch_class') || 'Switch class'}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                position: 'absolute',
                                top: 'calc(100% + 10px)',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                minWidth: 232,
                                maxWidth: 'min(92vw, 320px)',
                                maxHeight: 'min(360px, 55vh)',
                                overflowY: 'auto',
                                padding: 10,
                                borderRadius: 18,
                                zIndex: 10050,
                                background: isDark ? 'rgba(15,23,42,0.94)' : 'rgba(255,255,255,0.96)',
                                backdropFilter: 'blur(14px)',
                                WebkitBackdropFilter: 'blur(14px)',
                                border: isDark ? '1px solid rgba(148,163,184,0.25)' : '1px solid rgba(15,23,42,0.08)',
                                boxShadow: isDark ? '0 24px 48px rgba(0,0,0,0.45)' : '0 20px 40px rgba(15,23,42,0.12)'
                              }}
                            >
                              <div style={{
                                fontSize: 10,
                                fontWeight: 800,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                color: isDark ? '#94a3b8' : '#64748b',
                                margin: '4px 8px 10px',
                                textAlign: 'center'
                              }}
                              >
                                {t('dashboard.class_deck_hint') || 'Jump to another class'}
                              </div>
                              {(teacherClasses || []).map((cls) => {
                                const active = String(cls.id) === String(activeClass.id);
                                return (
                                  <button
                                    key={cls.id}
                                    type="button"
                                    role="option"
                                    aria-selected={active}
                                    onClick={() => {
                                      onSwitchClass(cls.id);
                                      setClassSwitcherOpen(false);
                                    }}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 12,
                                      width: '100%',
                                      padding: '10px 12px',
                                      marginBottom: 4,
                                      borderRadius: 14,
                                      border: active ? '2px solid #4CAF50' : '1px solid transparent',
                                      background: active
                                        ? (isDark ? 'rgba(34,197,94,0.14)' : 'rgba(76,175,80,0.1)')
                                        : (isDark ? 'rgba(30,41,59,0.45)' : '#f8fafc'),
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      color: isDark ? '#f1f5f9' : '#0f172a',
                                      fontWeight: active ? 800 : 600,
                                      fontSize: 14
                                    }}
                                  >
                                    <SafeAvatar
                                      src={cls.avatar || boringAvatar(cls.name || 'class')}
                                      name={cls.name}
                                      style={{ width: 40, height: 40, borderRadius: 11, objectFit: 'cover', flexShrink: 0 }}
                                    />
                                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cls.name}</span>
                                    {active && <Check size={18} color="#22c55e" aria-hidden />}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                      {isAttendanceMode && (
                        <div style={{ background: '#FEF3C7', color: '#92400E', padding: '8px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, display: 'flex', gap: 10, alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: '13px' }}>{t('dashboard.attendance_tip')}</span>
                        </div>
                      )}
                    </div>

                    {/* Right side: Controls */}
                    {isMobile ? (
                      /* Mobile: 3-dot menu */
                      <div style={{ width: '100px', display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ position: 'relative' }}>
                          <IconButton
                            ref={headerMenuBtnRef}
                            title={t('dashboard.menu')}
                            onClick={() => setShowHeaderMenu(prev => !prev)}
                          >
                            <MoreVertical size={22} />
                          </IconButton>

                          {showHeaderMenu && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                ...styles.gridMenu,
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                right: 0,
                                minWidth: '200px'
                              }}
                              ref={headerMenuRef}
                            >
                              {/* Sort */}
                              <div style={{ position: 'relative' }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowSortMenu(prev => { const next = !prev; if (next) setShowGridMenu(false); return next; });
                                  }}
                                  style={{
                                    ...styles.gridOption,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px 12px'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <ArrowUpDown size={18} />
                                    <span>{t('dashboard.sort_students')}</span>
                                  </div>
                                  <ChevronDown size={14} />
                                </button>

                                {showSortMenu && (
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                      position: 'absolute',
                                      right: '100%',
                                      top: 0,
                                      marginRight: '8px',
                                      background: 'white',
                                      borderRadius: '12px',
                                      padding: '8px',
                                      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                      minWidth: '180px',
                                      zIndex: 100000
                                    }}
                                  >
                                    <div style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('dashboard.sort_by')}</div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSortBy('name');
                                        setShowSortMenu(false);
                                        setShowHeaderMenu(false);
                                      }}
                                      style={{
                                        ...styles.gridOption,
                                        background: sortBy === 'name' ? '#EEF2FF' : 'transparent',
                                        color: sortBy === 'name' ? '#6366F1' : '#475569'
                                      }}
                                    >
                                      <span style={{ flex: 1, textAlign: 'left' }}>{t('dashboard.name_az')}</span>
                                      {sortBy === 'name' && <CheckCircle size={14} />}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSortBy('score');
                                        setShowSortMenu(false);
                                        setShowHeaderMenu(false);
                                      }}
                                      style={{
                                        ...styles.gridOption,
                                        background: sortBy === 'score' ? '#EEF2FF' : 'transparent',
                                        color: sortBy === 'score' ? '#6366F1' : '#475569'
                                      }}
                                    >
                                      <span style={{ flex: 1, textAlign: 'left' }}>{t('dashboard.highest_points')}</span>
                                      {sortBy === 'score' && <CheckCircle size={14} />}
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Display Size */}
                              <div style={{ position: 'relative' }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowGridMenu(prev => { const next = !prev; if (next) setShowSortMenu(false); return next; });
                                  }}
                                  style={{
                                    ...styles.gridOption,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px 12px'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Sliders size={18} />
                                    <span>{t('dashboard.display_size')}</span>
                                  </div>
                                  <ChevronDown size={14} />
                                </button>

                                {showGridMenu && (
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                      position: 'absolute',
                                      right: '100%',
                                      top: 0,
                                      marginRight: '8px',
                                      background: 'white',
                                      borderRadius: '12px',
                                      padding: '8px',
                                      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                      minWidth: '180px',
                                      zIndex: 100000
                                    }}
                                  >
                                    <div style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('dashboard.display_size')}</div>
                                    {[
                                      { key: 'compact', label: t('dashboard.compact') },
                                      { key: 'regular', label: t('dashboard.regular') },
                                      { key: 'spacious', label: t('dashboard.spacious') }
                                    ].map(({ key, label }) => (
                                      <button
                                        key={key}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateDisplaySize(key);
                                          setShowGridMenu(false);
                                          setShowHeaderMenu(false);
                                        }}
                                        style={{
                                          ...styles.gridOption,
                                          background: displaySize === key ? '#EEF2FF' : 'transparent',
                                          color: displaySize === key ? '#6366F1' : '#475569'
                                        }}
                                      >
                                        <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
                                        {displaySize === key && <CheckCircle size={14} />}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Fullscreen */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFullscreen();
                                  setShowHeaderMenu(false);
                                }}
                                style={{ ...styles.gridOption, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px' }}
                              >
                                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                                <span style={{ flex: 1, textAlign: 'left' }}>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</span>
                              </button>

                              {/* Select Multiple */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isAttendanceMode) {
                                    setShowHeaderMenu(false);
                                    return;
                                  }
                                  setIsMultiSelectMode(!isMultiSelectMode);
                                  setMultiSelectedStudents(new Set());
                                  setShowHeaderMenu(false);
                                }}
                                style={{
                                  ...styles.gridOption,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10,
                                  padding: '10px 12px',
                                  background: isAttendanceMode ? '#F1F5F9' : (isMultiSelectMode ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'),
                                  color: isAttendanceMode ? '#94A3B8' : (isMultiSelectMode ? '#fff' : '#475569')
                                }}
                              >
                                <CheckSquare size={18} />
                                <span style={{ flex: 1, textAlign: 'left' }}>Select Multiple</span>
                              </button>

                              {/* Games */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowGamesSidebar(true);
                                  setShowHeaderMenu(false);
                                }}
                                style={{
                                  ...styles.gridOption,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10,
                                  padding: '10px 12px',
                                  background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                                  color: '#fff'
                                }}
                              >
                                <Gamepad2 size={18} />
                                <span style={{ flex: 1, textAlign: 'left' }}>{t('games.title')}</span>
                              </button>

                              {/* Points History */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowHistory(true);
                                  setShowHeaderMenu(false);
                                }}
                                style={{
                                  ...styles.gridOption,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10,
                                  padding: '10px 12px'
                                }}
                              >
                                <Clock size={18} />
                                <span style={{ flex: 1, textAlign: 'left' }}>{t('dashboard.points_history')}</span>
                              </button>

                              {/* App Settings */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsClassToolsPanelOpen(true);
                                  setShowHeaderMenu(false);
                                }}
                                style={{
                                  ...styles.gridOption,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10,
                                  padding: '10px 12px',
                                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                                  color: '#fff'
                                }}
                              >
                                <Settings size={18} />
                                <span style={{ flex: 1, textAlign: 'left' }}>Class Tools</span>
                              </button>

                              {mergedWorkspace && onEditProfile && onLogout && user && (
                                <>
                                  <div style={{ height: 1, background: isDark ? 'rgba(148,163,184,0.2)' : '#E2E8F0', margin: '8px 4px' }} />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEditProfile();
                                      setShowHeaderMenu(false);
                                    }}
                                    style={{
                                      ...styles.gridOption,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 10,
                                      padding: '10px 12px'
                                    }}
                                  >
                                    <User size={18} />
                                    <span style={{ flex: 1, textAlign: 'left' }}>{t('teacher_portal.edit_profile')}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowDonateOverlay(true);
                                      setShowHeaderMenu(false);
                                    }}
                                    style={{
                                      ...styles.gridOption,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 10,
                                      padding: '10px 12px'
                                    }}
                                  >
                                    <Heart size={18} />
                                    <span style={{ flex: 1, textAlign: 'left' }}>{t('nav.donate')}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      switchTheme();
                                      setShowHeaderMenu(false);
                                    }}
                                    style={{
                                      ...styles.gridOption,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 10,
                                      padding: '10px 12px'
                                    }}
                                  >
                                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                                    <span style={{ flex: 1, textAlign: 'left' }}>{isDark ? t('teacher_portal.theme_light') : t('teacher_portal.theme_dark')}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowHeaderMenu(false);
                                      setTeacherLogoutConfirm(true);
                                    }}
                                    style={{
                                      ...styles.gridOption,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 10,
                                      padding: '10px 12px',
                                      color: '#DC2626'
                                    }}
                                  >
                                    <LogOut size={18} />
                                    <span style={{ flex: 1, textAlign: 'left' }}>{t('teacher_portal.logout')}</span>
                                  </button>
                                </>
                              )}
                          </div>
                        )}
                        </div>
                      </div>
                    ) : (
                      /* Desktop: Individual buttons */
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Games Button - Opens Sidebar */}
                        <IconButton
                          onClick={() => setShowGamesSidebar(true)}
                          title={t('games.title')}
                          style={{
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                            '--icon-color': 'white'
                          }}
                        >
                          <Gamepad2 size={22} style={{ pointerEvents: 'none', color: 'var(--icon-color, white)' }} />
                        </IconButton>

                        <div style={{ position: 'relative' }}>
                          <IconButton
                            ref={sortBtnRef}
                            title={t('dashboard.sort_students')}
                            onClick={() => setShowSortMenu(prev => { const next = !prev; if (next) setShowGridMenu(false); return next; })}
                          >
                            <ArrowUpDown size={22} />
                          </IconButton>

                          {showSortMenu && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                ...styles.gridMenu,
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                right: 0
                              }}
                              ref={sortMenuRef}
                            >
                              <div style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('dashboard.sort_by')}</div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSortBy('name');
                                  setShowSortMenu(false);
                                }}
                                style={{
                                  ...styles.gridOption,
                                  background: sortBy === 'name' ? '#EEF2FF' : 'transparent',
                                  color: sortBy === 'name' ? '#6366F1' : '#475569'
                                }}
                              >
                                <span>{t('dashboard.name_az')}</span>
                                {sortBy === 'name' && <CheckCircle size={16} />}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSortBy('score');
                                  setShowSortMenu(false);
                                }}
                                style={{
                                  ...styles.gridOption,
                                  background: sortBy === 'score' ? '#EEF2FF' : 'transparent',
                                  color: sortBy === 'score' ? '#6366F1' : '#475569'
                                }}
                              >
                                <span>{t('dashboard.highest_points')}</span>
                                {sortBy === 'score' && <CheckCircle size={16} />}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Points History */}
                        <IconButton
                          title={t('dashboard.points_history')}
                          onClick={() => setShowHistory(true)}
                        >
                          <Clock size={22} />
                        </IconButton>

                        <div style={{ position: 'relative' }}>
                          <IconButton
                            ref={gridBtnRef}
                            title={t('dashboard.display_size')}
                            onClick={() => setShowGridMenu(prev => { const next = !prev; if (next) setShowSortMenu(false); return next; })}
                          >
                            <Sliders size={22} />
                          </IconButton>

                          {showGridMenu && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                ...styles.gridMenu,
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                right: 0
                              }}
                              ref={gridMenuRef}
                            >
                              <div style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('dashboard.display_size')}</div>
                              {[
                                { key: 'compact', label: t('dashboard.compact') },
                                { key: 'regular', label: t('dashboard.regular') },
                                { key: 'spacious', label: t('dashboard.spacious') }
                              ].map(({ key, label }) => (
                                <button
                                  key={key}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateDisplaySize(key);
                                    setShowGridMenu(false);
                                  }}
                                  style={{
                                    ...styles.gridOption,
                                    background: displaySize === key ? '#EEF2FF' : 'transparent',
                                    color: displaySize === key ? '#6366F1' : '#475569'
                                  }}
                                >
                                  <span>{label}</span>
                                  {displaySize === key && <CheckCircle size={16} />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <IconButton
                          title={isFullscreen ? t('dashboard.exit_fullscreen') : t('dashboard.enter_fullscreen')}
                          onClick={toggleFullscreen}
                        >
                          {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
                        </IconButton>

                        {/* Select Multiple Button */}
                        <button
                          onClick={() => {
                            if (isAttendanceMode) return;
                            setIsMultiSelectMode(!isMultiSelectMode);
                            setMultiSelectedStudents(new Set());
                          }}
                          disabled={isAttendanceMode}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: isMobile ? 0 : '8px',
                            padding: isMobile ? '10px' : '12px 16px',
                            borderRadius: '12px',
                            background: isAttendanceMode ? '#F1F5F9' : (isMultiSelectMode ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#fff'),
                            color: isAttendanceMode ? '#94A3B8' : (isMultiSelectMode ? '#fff' : '#475569'),
                            border: isMultiSelectMode ? 'none' : '1px solid #E2E8F0',
                            fontWeight: 700,
                            fontSize: isMobile ? '11px' : '14px',
                            cursor: isAttendanceMode ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: isMultiSelectMode ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
                            transform: isMultiSelectMode ? 'translateY(-2px)' : 'translateY(0)'
                          }}
                        >
                          <CheckSquare size={isMobile ? 18 : 22} />
                          {!isMobile && <span>Select Multiple</span>}
                        </button>
                        <button
                          onClick={() => setIsClassToolsPanelOpen((v) => !v)}
                          title="Class Tools"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: isMobile ? '6px' : '8px',
                            padding: isMobile ? '10px' : '10px 14px',
                            borderRadius: '12px',
                            border: '1px solid #E2E8F0',
                            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: isMobile ? '11px' : '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: isClassToolsPanelOpen ? '0 6px 16px rgba(99, 102, 241, 0.4)' : '0 4px 12px rgba(99, 102, 241, 0.28)'
                          }}
                        >
                          <Sliders size={isMobile ? 18 : 20} />
                          {!isMobile && <span>Class Tools</span>}
                        </button>

                        {mergedWorkspace && onEditProfile && onLogout && user && (
                          <div style={{ position: 'relative', marginLeft: 6 }} ref={teacherAccountBtnRef}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTeacherAccountMenuOpen((o) => !o);
                              }}
                              title={t('dashboard.account_menu')}
                              aria-expanded={teacherAccountMenuOpen}
                              aria-haspopup="menu"
                              style={{
                                height: 44,
                                minWidth: 44,
                                padding: '0 8px',
                                borderRadius: 12,
                                border: isDark ? '1px solid rgba(148,163,184,0.35)' : '1px solid #E2E8F0',
                                background: isDark ? 'rgba(30,41,59,0.85)' : '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 4,
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(15,23,42,0.06)'
                              }}
                            >
                              <SafeAvatar
                                src={user.avatar}
                                name={user.name || user.email}
                                style={{ width: 30, height: 30, borderRadius: 9, objectFit: 'cover', flexShrink: 0 }}
                              />
                              <ChevronDown size={16} color={isDark ? '#94a3b8' : '#64748b'} style={{ flexShrink: 0 }} aria-hidden />
                            </button>
                            {teacherAccountMenuOpen && (
                              <div
                                ref={teacherAccountMenuRef}
                                role="menu"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  position: 'absolute',
                                  top: 'calc(100% + 8px)',
                                  right: 0,
                                  minWidth: 200,
                                  padding: 6,
                                  borderRadius: 14,
                                  zIndex: 10060,
                                  background: isDark ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)',
                                  border: isDark ? '1px solid rgba(148,163,184,0.25)' : '1px solid rgba(15,23,42,0.1)',
                                  boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.45)' : '0 12px 32px rgba(15,23,42,0.12)'
                                }}
                              >
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    onEditProfile();
                                    setTeacherAccountMenuOpen(false);
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: 'none',
                                    borderRadius: 10,
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: isDark ? '#e2e8f0' : '#0f172a',
                                    textAlign: 'left'
                                  }}
                                >
                                  <User size={18} /> {t('teacher_portal.edit_profile')}
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    setShowDonateOverlay(true);
                                    setTeacherAccountMenuOpen(false);
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: 'none',
                                    borderRadius: 10,
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: isDark ? '#e2e8f0' : '#0f172a',
                                    textAlign: 'left'
                                  }}
                                >
                                  <Heart size={18} /> {t('nav.donate')}
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    switchTheme();
                                    setTeacherAccountMenuOpen(false);
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: 'none',
                                    borderRadius: 10,
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: isDark ? '#e2e8f0' : '#0f172a',
                                    textAlign: 'left'
                                  }}
                                >
                                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                                  {isDark ? t('teacher_portal.theme_light') : t('teacher_portal.theme_dark')}
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    setTeacherAccountMenuOpen(false);
                                    setTeacherLogoutConfirm(true);
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: 'none',
                                    borderRadius: 10,
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: '#DC2626',
                                    textAlign: 'left'
                                  }}
                                >
                                  <LogOut size={18} /> {t('teacher_portal.logout')}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                  </header>
                  </div>

                    {/* Multi-select Action Bar - Shows when students are selected */}
                    {isMultiSelectMode && !isAttendanceMode && multiSelectedStudents.size > 0 && !mergedWorkspace && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: 'fixed',
                          bottom: isMobile ? '10px' : '10px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          display: 'flex',
                          gap: isMobile ? '8px' : '12px',
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          borderRadius: '20px',
                          padding: isMobile ? '12px' : '14px 20px',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          zIndex: 1000,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          maxWidth: 'calc(100% - 40px)',
                          width: 'auto'
                        }}
                      >
                        {/* Close Button */}
                        <button
                          onClick={() => {
                            setIsMultiSelectMode(false);
                            setMultiSelectedStudents(new Set());
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: isMobile ? '6px' : '8px',
                            padding: isMobile ? '10px' : '10px 16px',
                            borderRadius: '12px',
                            background: '#EEF2FF',
                            color: '#4F46E5',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: isMobile ? '11px' : '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            flexShrink: 0
                          }}
                        >
                          <X size={isMobile ? 18 : 18} />
                          <span>Close</span>
                        </button>

                        {/* Mark as Absent Button */}
                        <button
                          onClick={() => {
                            const selectedStudentIds = Array.from(multiSelectedStudents);
                            if (selectedStudentIds.length === 0) return;
                            
                            const today = new Date().toISOString().split('T')[0];
                            const allSelectedAbsent = selectedStudentIds.every(id => absentStudents.has(id));
                            const newAbsent = new Set(absentStudents);
                            
                            updateClasses(prev => prev.map(c => {
                              if (c.id !== activeClass.id) return c;
                              return {
                                ...c,
                                students: c.students.map(s => {
                                  if (!multiSelectedStudents.has(s.id)) return s;
                                  if (allSelectedAbsent) {
                                    // Mark as present
                                    newAbsent.delete(s.id);
                                    return { ...s, attendance: 'present', attendanceDate: today };
                                  } else {
                                    // Mark as absent
                                    newAbsent.add(s.id);
                                    return { ...s, attendance: 'absent', attendanceDate: today };
                                  }
                                })
                              };
                            }));
                            setAbsentStudents(newAbsent);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: isMobile ? '6px' : '8px',
                            padding: isMobile ? '10px' : '10px 16px',
                            borderRadius: '12px',
                            background: '#FEF2F2',
                            color: '#DC2626',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: isMobile ? '11px' : '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            flexShrink: 0
                          }}
                        >
                          <Users size={isMobile ? 18 : 18} />
                          <span>
                            {multiSelectedStudents.size > 0
                              ? (Array.from(multiSelectedStudents).every(id => absentStudents.has(id))
                                  ? 'Mark as Present'
                                  : 'Mark as Absent')
                              : 'Mark as Absent'}
                          </span>
                        </button>

                        {/* Give Points Button */}
                        <button
                          onClick={() => {
                            setShowMultiSelectBehaviorModal(true);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: isMobile ? '6px' : '8px',
                            padding: isMobile ? '10px' : '10px 16px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            color: '#fff',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: isMobile ? '11px' : '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                            flexShrink: 0
                          }}
                        >
                          <Check size={isMobile ? 18 : 18} />
                          <span>Give Points</span>
                        </button>
                      </div>
                    )}

                  <div className="student-cards-container page-animate-in" style={{
                    display: 'grid',
                    alignItems: 'start',
                    isolation: 'isolate',
                    border: 'none',
                    gridTemplateColumns: isMobile
                      ? (displaySize === 'compact'
                        ? 'repeat(3, minmax(0, 1fr))'
                        : displaySize === 'regular'
                          ? 'repeat(2, minmax(0, 1fr))'
                          : 'repeat(1, minmax(0, 1fr))')
                      : displaySize === 'compact'
                        ? 'repeat(auto-fill, minmax(120px, 1fr))'
                        : displaySize === 'regular'
                          ? 'repeat(auto-fill, minmax(180px, 1fr))'
                          : 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: isMobile
                      ? (displaySize === 'compact' ? '10px' : displaySize === 'regular' ? '14px' : '18px')
                      : displaySize === 'compact' ? '16px' : displaySize === 'regular' ? '20px' : '28px',
                    padding: isMobile
                      ? (displaySize === 'compact' ? '12px' : displaySize === 'regular' ? '14px' : '18px')
                      : displaySize === 'compact' ? '16px' : displaySize === 'regular' ? '20px' : '28px',
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    overflowX: 'hidden',
                    // Ensure gaps between student cards use the same class background.
                    // Otherwise the browser/body background can show through as a 2nd color.
                    background: activeClass?.background_color || 'transparent',
                    zIndex: 1
                  }}>
                    {/* Whole Class Card - Same structure as StudentCard */}
                    <div
                      style={{
                        background: 'linear-gradient(145deg, #4f46e5 0%, #6366f1 40%, #7c3aed 72%, #a855f7 100%)',
                        borderRadius: wholeClassDenseLayout ? '12px' : displaySize === 'spacious' ? '28px' : '24px',
                        padding: wholeClassDenseLayout ? '6px' : displaySize === 'spacious' ? '26px' : '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        position: 'relative',
                        aspectRatio: wholeClassMobileSpacious ? 'auto' : '1 / 1',
                        height: wholeClassMobileSpacious ? 'min(72vw, 360px)' : undefined,
                        width: '100%',
                        minHeight: 0,
                        boxSizing: 'border-box',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        overflow: 'hidden',
                        zIndex: 2
                      }}
                      onClick={() => {
                        if (isAttendanceMode) return;
                        setShowClassBehaviorModal(true);
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 15px 25px -5px rgba(99, 102, 241, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(99, 102, 241, 0.4)';
                      }}
                    >
                      {isAttendanceMode && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: '#94A3B8',
                            color: '#fff',
                            border: '3px solid rgba(255,255,255,0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 14,
                            fontWeight: 900,
                            zIndex: 3
                          }}
                          title="Attendance not applicable for whole class"
                        >
                          -
                        </div>
                      )}
                      {wholeClassDenseLayout ? (
                        <>
                          <div
                            style={{
                              position: 'absolute',
                              top: 6,
                              left: 6,
                              right: 6,
                              textAlign: 'center',
                              pointerEvents: 'none',
                              zIndex: 2
                            }}
                          >
                            <span
                              style={{
                                display: 'block',
                                fontWeight: 900,
                                fontSize: displaySize === 'compact' ? '10px' : '11px',
                                lineHeight: 1.2,
                                color: '#fff',
                                textShadow: '0 1px 2px rgba(79, 70, 229, 0.35)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {t('dashboard.whole_class')}
                            </span>
                          </div>
                          <div
                            style={{
                              flex: 1,
                              minHeight: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '100%',
                              paddingTop: displaySize === 'compact' ? 12 : 13,
                              color: '#fff'
                            }}
                          >
                            <SmilePlus
                              size={displaySize === 'compact' ? 26 : 30}
                              strokeWidth={2.25}
                            />
                          </div>
                          <div
                            style={{
                              padding: '2px 8px',
                              background: 'rgba(255, 255, 255, 0.22)',
                              borderRadius: '10px',
                              fontSize: displaySize === 'compact' ? '11px' : '12px',
                              fontWeight: 800,
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 3,
                              border: '1px solid rgba(255, 255, 255, 0.42)',
                              whiteSpace: 'nowrap',
                              position: 'absolute',
                              bottom: 5,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              maxWidth: '92%',
                              boxSizing: 'border-box'
                            }}
                          >
                            <Trophy
                              size={displaySize === 'compact' ? 11 : 12}
                              color="#FDE047"
                              fill="#EAB308"
                            />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {totalClassPoints.toLocaleString()}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ color: '#fff' }}>
                            <SmilePlus size={40} />
                          </div>
                          <div style={{ marginTop: 10, fontWeight: '900', fontSize: '1rem', color: 'white' }}>{t('dashboard.whole_class')}</div>

                          <div
                            style={{
                              marginTop: '10px',
                              padding: '4px 12px',
                              background: 'rgba(255, 255, 255, 0.2)',
                              borderRadius: '16px',
                              fontSize: '18px',
                              fontWeight: '800',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              border: '1px solid rgba(255, 255, 255, 0.35)'
                            }}
                          >
                            <Trophy size={16} color="#FDE047" fill="#EAB308" />
                            {totalClassPoints.toLocaleString()} {t('dashboard.pts')}
                          </div>
                        </>
                      )}
                    </div>
                    {sortedStudents.map((s) => {
                      const today = new Date().toISOString().split('T')[0];
                      const isAbsentToday = absentStudents.has(s.id) || (s.attendance === 'absent' && s.attendanceDate === today);
                      return (

                        <div
                          key={s.id}
                          onClick={(event) => {
                            if (isMultiSelectMode) {
                              // Multi-select mode: toggle selection
                              const next = new Set(multiSelectedStudents);
                              if (next.has(s.id)) next.delete(s.id); else next.add(s.id);
                              setMultiSelectedStudents(next);
                            } else if (isAttendanceMode) {
                              const next = new Set(absentStudents);
                              if (next.has(s.id)) next.delete(s.id); else next.add(s.id);
                              setAbsentStudents(next);
                              setAttendanceDirty(!areSetsEqual(next, attendanceBaselineAbsent));
                            } else if (event?.ctrlKey || event?.metaKey) {
                              const next = new Set(selectedStudents);
                              if (next.has(s.id)) next.delete(s.id); else next.add(s.id);
                              setSelectedStudents(next);
                            } else if (!isAbsentToday) {
                              setSelectedStudent(s);
                            }
                          }}
                          style={{
                            position: 'relative',
                            zIndex: 1,
                            opacity: isMultiSelectMode
                              ? (multiSelectedStudents.size > 0 && !multiSelectedStudents.has(s.id) ? 0.4 : 1)
                              : (isAttendanceMode ? 1 : (isAbsentToday ? 0.4 : (selectedStudents.size > 0 && !selectedStudents.has(s.id) ? 0.5 : 1))),
                            transition: 'opacity 0.15s, filter 0.15s',
                            cursor: isMultiSelectMode || isAttendanceMode ? 'pointer' : isAbsentToday ? 'not-allowed' : 'default',
                            filter: isMultiSelectMode && !multiSelectedStudents.has(s.id) ? 'grayscale(1)' : (isAttendanceMode ? 'grayscale(0)' : (isAbsentToday ? 'grayscale(1)' : 'grayscale(0)')),
                            pointerEvents: 'auto'
                          }}
                        >
                          {isAttendanceMode && (
                            <div
                              style={{
                                position: 'absolute',
                                top: displaySize === 'compact' ? '6px' : '10px',
                                right: displaySize === 'compact' ? '6px' : '10px',
                                width: displaySize === 'compact' ? '24px' : '34px',
                                height: displaySize === 'compact' ? '24px' : '34px',
                                borderRadius: '50%',
                                background: isAbsentToday ? '#e11d48' : '#58CC02',
                                border: '3px solid rgba(255,255,255,0.9)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 11,
                                color: '#fff',
                                fontSize: displaySize === 'compact' ? '12px' : '16px',
                                fontWeight: 900
                              }}
                            >
                              <User size={displaySize === 'compact' ? 12 : 16} />
                            </div>
                          )}
                          {/* Selection Circle - Shows in multi-select mode */}
                          {isMultiSelectMode && (
                            <div
                              style={{
                                position: 'absolute',
                                top: displaySize === 'compact' ? '6px' : '12px',
                                right: displaySize === 'compact' ? '6px' : '12px',
                                width: displaySize === 'compact' ? '24px' : '32px',
                                height: displaySize === 'compact' ? '24px' : '32px',
                                borderRadius: '50%',
                                background: multiSelectedStudents.has(s.id)
                                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                                  : 'rgba(255, 255, 255, 0.9)',
                                border: multiSelectedStudents.has(s.id) ? 'none' : '2px solid #E2E8F0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10,
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                backdropFilter: 'blur(10px)'
                              }}
                            >
                              {multiSelectedStudents.has(s.id) && <Check size={displaySize === 'compact' ? 14 : 18} color="white" />}
                            </div>
                          )}
                          <StudentCard
                            student={s}
                            isCompact={displaySize === 'compact'}
                            displaySize={displaySize}
                            onClick={() => {
                              if (isAttendanceMode) {
                                return;
                              } else if (!isAbsentToday && !isMultiSelectMode) {
                                setAnimatingStudents({}); // Cancel any ongoing card animations
                                setShowPoint({ visible: false, student: null, points: 0, behaviorEmoji: '⭐', behaviorAudio: null, stickerId: null }); // Cancel point animation
                                setSelectedStudent(s);
                              }
                            }}
                            onEdit={handleEditStudent}
                            onDelete={() => setDeleteConfirmStudentId(s.id)}
                            animating={Boolean(animatingStudents && animatingStudents[s.id])}
                            animationType={animatingStudents && animatingStudents[s.id] ? animatingStudents[s.id].type : undefined}
                            disableActions={isMultiSelectMode || isAttendanceMode}
                            disableClick={isMultiSelectMode || isAttendanceMode}
                          />
                          {selectedStudents.has(s.id) && <div style={{ position: 'absolute', inset: 0, borderRadius: displaySize === 'compact' ? '50%' : displaySize === 'spacious' ? '28px' : '24px', border: '3px solid #4CAF50', pointerEvents: 'none', zIndex: 5 }} />}
                        </div>
                      );
                    })}
                    {/* Add Students Button */}
                    <div
                      ref={addStudentButtonRef}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: displaySize === 'compact' ? '12px' : '24px',
                        padding: displaySize === 'compact' ? '6px' : '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        position: 'relative',
                        aspectRatio: '1 / 1',
                        width: '100%',
                        boxSizing: 'border-box',
                        border: '2px dashed #ddd'
                      }}
                      onClick={(e) => { e.stopPropagation(); setShowAddStudentMenu(!showAddStudentMenu); }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.borderColor = '#6366F1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.borderColor = '#ddd';
                      }}
                    >
                      <Users size={displaySize === 'compact' ? 40 : 56} style={{ color: '#6366F1' }} />
                      <div style={{
                        marginTop: displaySize === 'compact' ? '8px' : '12px',
                        fontWeight: '700',
                        fontSize: displaySize === 'compact' ? '12px' : '1rem',
                        color: '#6366F1',
                        textAlign: 'center'
                      }}>Add Students</div>
                      {showAddStudentMenu && createPortal(
                        <AddStudentDropdown
                          onClose={() => setShowAddStudentMenu(false)}
                          onOpenSingle={() => setIsSingleAddStudentOpen(true)}
                          onOpenBulk={() => setIsBulkAddStudentOpen(true)}
                          buttonRef={addStudentButtonRef}
                        />,
                        document.body
                      )}
                    </div>

                  </div>
                </>
              )}
          </>
            );
            return mergedWorkspace ? (
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  background: mergedShellBackground
                }}
              >
                {mergedMainBody}
              </div>
            ) : mergedMainBody;
          })()}
        </main>

        {timerOpen && createPortal(
          timerFloatingStage === 'running' ? (
            <div
              style={{
                position: 'fixed',
                left: timerBubblePos.x,
                top: timerBubblePos.y,
                width: isMobile ? 96 : 112,
                height: isMobile ? 96 : 112,
                zIndex: 100001,
                cursor: 'grab',
                touchAction: 'none'
              }}
              onPointerDown={handleTimerBubblePointerDown}
              onPointerMove={handleTimerBubblePointerMove}
              onPointerUp={handleTimerBubblePointerUp}
              onPointerCancel={handleTimerBubblePointerUp}
            >
              <KidTimer
                floating
                floatingCompact
                onFloatingStageChange={setTimerFloatingStage}
                onClose={() => setTimerOpen(false)}
                onComplete={() => setTimerOpen(false)}
              />
            </div>
          ) : (
            <div
              style={{
                position: 'fixed',
                left: '50%',
                bottom: mergedWorkspace
                  ? DOCK_FLOAT_MARGIN_PX + (dockCollapsed ? DOCK_RESERVE_COLLAPSED_PX : DOCK_RESERVE_EXPANDED_PX) + 12
                  : 16,
                transform: 'translateX(-50%)',
                zIndex: 100001,
                width: isMobile ? '92vw' : 460,
                maxWidth: '92vw',
                maxHeight: '80vh',
                overflow: 'auto',
                borderRadius: 28,
                background: isDark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.96)',
                border: isDark ? '1px solid rgba(148,163,184,0.18)' : '1px solid rgba(15,23,42,0.08)',
                boxShadow: isDark ? '0 30px 80px rgba(0,0,0,0.5)' : '0 30px 80px rgba(15,23,42,0.18)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)'
              }}
            >
              <KidTimer
                floating
                onFloatingStageChange={setTimerFloatingStage}
                onClose={() => {
                  setTimerOpen(false);
                  setTimerFloatingStage('setup');
                }}
                onComplete={() => {
                  setTimerOpen(false);
                  setTimerFloatingStage('setup');
                }}
              />
            </div>
          ),
          document.body
        )}

        {activeClass?.id && updateClassesAndSave && (
          <ClassStickyNote
            key={String(activeClass.id)}
            classId={activeClass.id}
            className={activeClass.name}
            stickyNote={activeClass.sticky_note}
            classBackgroundColor={activeClass.background_color}
            isDark={isDark}
            onPersist={(snap) => {
              updateClassesAndSave((prev) =>
                prev.map((c) => (c.id === activeClass.id ? { ...c, sticky_note: snap } : c))
              );
            }}
          />
        )}

        {/* MODALS */}
        {selectedStudent && <BehaviorModal student={selectedStudent} behaviors={activeClass.behaviors || behaviors} onClose={() => setSelectedStudent(null)} onGivePoint={handleGivePoint} />}
        {showClassBehaviorModal && (
          <BehaviorModal
            student={{ name: '', hideName: true }}
            behaviors={activeClass.behaviors || behaviors}
            onClose={() => setShowClassBehaviorModal(false)}
            onGivePoint={handleGivePointsToClass}
          />
        )}
        {showMultiSelectBehaviorModal && (
          <BehaviorModal
            student={{ name: '', hideName: true }}
            behaviors={activeClass.behaviors || behaviors}
            onClose={() => setShowMultiSelectBehaviorModal(false)}
            onGivePoint={handleGivePointsToMultiSelect}
          />
        )}
        {/* {isLuckyDrawOpen && <LuckyDrawModal students={activeClass.students} onClose={() => setIsLuckyDrawOpen(false)} onWinner={(s) => { setIsLuckyDrawOpen(false); setSelectedStudent(s); }} />} */}
        {isLuckyDrawOpen && (
          <LuckyDrawModal
            students={activeClass.students}
            onClose={closeModal}
            onWinner={(winnerData, points = 1) => {
              // Ensure the points chosen in the modal are used when awarding
              if (Array.isArray(winnerData)) {
                handleGivePointsToMultiple(winnerData, points);
              } else {
                // Single winner: award the chosen points as well
                handleGivePointsToMultiple([winnerData], points);
              }
              closeModal();
            }}
            onRequestAddStudents={() => setIsAddStudentOpen(true)}
            onOpenGames={() => {
              setShowGamesSidebar(true);
              onOpenGames?.();
            }}
          />
        )}

        {/* ⚡ OLD GRADING MODAL IS GONE - CLEANER CODE! ⚡ */}

        {isAddStudentOpen && (
          <AddStudentModal
            onClose={() => setIsAddStudentOpen(false)}
            onSave={(newStudent) => {
              const studentId = Date.now();
              const newCodes = { parentCode: generate5DigitCode(), studentCode: generate5DigitCode() };
              updateClassesAndSave((prev) => prev.map((c) =>
                c.id === activeClass.id ? { ...c, students: [...c.students, { ...newStudent, id: studentId, score: 0 }], Access_Codes: { ...(c.Access_Codes || {}), [studentId]: newCodes } } : c
              ));
              setIsAddStudentOpen(false);
            }}
          />
        )}

        {/* BULK ADD STUDENT MODAL */}
        {isBulkAddStudentOpen && (
          <Suspense fallback={<DashboardLoader />}>
            <BulkAddStudentModal
              onClose={() => setIsBulkAddStudentOpen(false)}
              onSave={(studentsToAdd) => {
                const newStudents = studentsToAdd.map((student) => {
                  const studentId = Date.now() + Math.random();
                  const newCodes = { parentCode: generate5DigitCode(), studentCode: generate5DigitCode() };
                  return {
                    ...student,
                    id: studentId,
                    score: 0
                  };
                });

                const newAccessCodes = {};
                newStudents.forEach(s => {
                  newAccessCodes[s.id] = { parentCode: generate5DigitCode(), studentCode: generate5DigitCode() };
                });

                updateClassesAndSave((prev) => prev.map((c) =>
                  c.id === activeClass.id
                    ? {
                      ...c,
                      students: [...c.students, ...newStudents],
                      Access_Codes: { ...(c.Access_Codes || {}), ...newAccessCodes }
                    }
                    : c
                ));
                setIsBulkAddStudentOpen(false);
              }}
            />
          </Suspense>
        )}

        {/* SINGLE ADD STUDENT MODAL */}
        {isSingleAddStudentOpen && (
          <SingleAddStudentModal
            onClose={() => setIsSingleAddStudentOpen(false)}
            onSave={(newStudent) => {
              const studentId = Date.now();
              const newCodes = { parentCode: generate5DigitCode(), studentCode: generate5DigitCode() };
              updateClassesAndSave((prev) => prev.map((c) =>
                c.id === activeClass.id ? { ...c, students: [...c.students, { ...newStudent, id: studentId, score: 0 }], Access_Codes: { ...(c.Access_Codes || {}), [studentId]: newCodes } } : c
              ));
              setIsSingleAddStudentOpen(false);
            }}
          />
        )}

        {/* EDIT STUDENT MODAL */}
        <EditStudentModal
          editingStudentId={editingStudentId}
          editStudentName={editStudentName} setEditStudentName={setEditStudentName}
          editStudentAvatar={editStudentAvatar} setEditStudentAvatar={setEditStudentAvatar}
          editSelectedSeed={editSelectedSeed} setEditSelectedSeed={setEditSelectedSeed}
          editAvatarSetId={editAvatarSetId} setEditAvatarSetId={setEditAvatarSetId}
          editAvatarSetList={editAvatarSetList} setEditAvatarSetList={setEditAvatarSetList}
          editSelectedAvatarIndex={editSelectedAvatarIndex} setEditSelectedAvatarIndex={setEditSelectedAvatarIndex}
          showEditAvatarPicker={showEditAvatarPicker} setShowEditAvatarPicker={setShowEditAvatarPicker}
          hoveredEditChar={hoveredEditChar}
          editAvatarSectionRef={editAvatarSectionRef}
          editFileInputRef={editFileInputRef}
          getEditDropdownPosition={getEditDropdownPosition}
          handleSaveStudentEdit={handleSaveStudentEdit}
          onClose={handleCloseEditModal}
        />

        {deleteConfirmStudentId && (
          <div style={styles.overlay} className="modal-overlay-in">
            <div style={{ ...styles.modal, width: 360 }}>
              <h3 style={{ marginBottom: 12 }}>{t('edit_student.delete_confirm')}</h3>
              <p style={{ color: '#666' }}>{t('edit_student.delete_sure')} <strong>'{activeClass.students.find((s) => s.id === deleteConfirmStudentId)?.name}'</strong>?</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={() => setDeleteConfirmStudentId(null)} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #E2E8F0', background: 'white' }}>{t('edit_student.cancel')}</button>
                <button onClick={() => handleDeleteStudent(activeClass.students.find((s) => s.id === deleteConfirmStudentId))} style={{ flex: 1, padding: 10, borderRadius: 8, border: 'none', background: '#FF6B6B', color: 'white' }}>{t('edit_student.delete')}</button>
              </div>
            </div>
          </div>
        )}
        {showWhiteboard && (
          <Suspense fallback={<DashboardLoader />}>
            <Whiteboard onClose={closeModal} />
          </Suspense>
        )}

        {/* Points History Modal */}
        {showHistory && (
          <PointsHistoryView
            activeClass={activeClass}
            onClose={() => setShowHistory(false)}
            refreshClasses={refreshClasses}
          />
        )}

        <PointAnimation key={showPoint.visible ? `${showPoint.student?.id}-${showPoint.points}-${showPoint.stickerId}` : 'hidden'} isVisible={showPoint.visible} studentAvatar={showPoint.student?.avatar} studentName={showPoint.student?.name} students={showPoint.student?.students} points={showPoint.points} behaviorEmoji={showPoint.behaviorEmoji} behaviorAudio={showPoint.behaviorAudio} stickerId={showPoint.stickerId} onComplete={() => setShowPoint({ visible: false, student: null, points: 0, behaviorEmoji: '⭐', behaviorAudio: null, stickerId: null })} />

        {teacherLogoutConfirm && mergedWorkspace && onLogout && (
          <div
            className="modal-overlay-in"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15,23,42,0.28)',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              zIndex: 200100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16
            }}
            onClick={() => setTeacherLogoutConfirm(false)}
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
                  onClick={() => {
                    setTeacherLogoutConfirm(false);
                    onLogout();
                  }}
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
                >
                  {t('teacher_portal.yes')}
                </button>
                <button
                  type="button"
                  onClick={() => setTeacherLogoutConfirm(false)}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 12,
                    border: '1px solid #e5e7eb',
                    background: 'transparent',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {t('teacher_portal.no')}
                </button>
              </div>
            </div>
          </div>
        )}

        <DonateOverlay
          showDonateOverlay={showDonateOverlay}
          setShowDonateOverlay={setShowDonateOverlay}
          isDark={isDark}
          isMobile={isMobile}
        />

        {/* Games Sidebar */}
        <GamesSidebar
          isOpen={showGamesSidebar}
          onClose={() => setShowGamesSidebar(false)}
          activeClass={activeClass}
          onGameSelect={onOpenGameFromDashboard}
        />

        {/* Level Up Overlay */}
        <LevelUpOverlay 
          student={levelUpStudent}
          isVisible={!!levelUpStudent}
          onClose={() => setLevelUpStudent(null)}
        />

      </div>

    </>
  );
}
