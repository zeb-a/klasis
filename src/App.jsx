import { useState, useEffect, useLayoutEffect, useMemo, useRef, lazy, Suspense } from 'react';
import api from './services/api';
import PasswordResetPage from './components/PasswordResetPage';
import ConfirmAccountPage from './components/ConfirmAccountPage';
import VerifyEmailPage from './components/VerifyEmailPage';
import ErrorBoundary from './components/ErrorBoundary';
import { PageHelpProvider, usePageHelp } from './PageHelpContext';
import HelpChatBubble from './components/HelpChatBubble';
import { ToastProvider } from './components/Toast';
import BrandedAppLoader from './components/BrandedAppLoader';

import './components/ModalAnimations.css';
import { clearChunkRecoveryAttempt } from './chunkLoadRecovery';
import { useTheme } from './ThemeContext';

// Safe JSON parser that returns a fallback on error - prevents app crashes from corrupted data
function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return fallback;
  }
}

// Lazy load large components to reduce initial bundle size
const LandingPage = lazy(() => import('./components/LandingPage'));
const ProfileModal = lazy(() => import('./components/ProfileModal'));
const TeacherWorkspace = lazy(() => import('./components/TeacherWorkspace'));
const ClassDashboard = lazy(() => import('./components/ClassDashboard'));
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./components/TermsPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const FAQPage = lazy(() => import('./components/FAQPage'));
const GuideDocumentation = lazy(() => import('./components/GuideDocumentation'));
const GameCenter = lazy(() => import('./components/GameCenter'));
const LessonPlannerPage = lazy(() => import('./components/lesson-planner/LessonPlannerPage'));

// --- INITIAL DATA ---

import { fallbackInitialsDataUrl } from './utils/avatar';

const MOCK_CLASS = {
  id: 'demo-class',
  name: 'Demo Class',
  students: [
    { id: 1, name: 'Emma Watson', gender: 'girl', score: 15, avatar: fallbackInitialsDataUrl('Emma Watson') },
    { id: 2, name: 'Liam Johnson', gender: 'boy', score: 8, avatar: fallbackInitialsDataUrl('Liam Johnson') },
    { id: 3, name: 'Olivia Smith', gender: 'girl', score: 22, avatar: fallbackInitialsDataUrl('Olivia Smith') },
    { id: 4, name: 'Noah Brown', gender: 'boy', score: 5, avatar: fallbackInitialsDataUrl('Noah Brown') },
    { id: 5, name: 'Ava Davis', gender: 'girl', score: 12, avatar: fallbackInitialsDataUrl('Ava Davis') }
  ],
  theme: 'ocean',
  createdAt: Date.now()
};

const INITIAL_STUDENTS = [
  { id: 1, name: 'Pablo Picasso', gender: 'boy', score: 0, avatar: fallbackInitialsDataUrl('Pablo Picasso') },
  { id: 2, name: 'Marie Curie', gender: 'girl', score: 0, avatar: fallbackInitialsDataUrl('Marie Curie') }
];

const INITIAL_BEHAVIORS = [
  { id: 1, label: 'Helped Friend', pts: 1, type: 'wow' },
  { id: 2, label: 'Great Work', pts: 2, type: 'wow' },
  { id: 3, label: 'On Task', pts: 1, type: 'wow' },
  { id: 4, label: 'Kindness', pts: 1, type: 'wow' },
  { id: 5, label: 'Noisy', pts: -1, type: 'nono' },
  { id: 6, label: 'Disruptive', pts: -2, type: 'nono' }
];

// Note: this file now centralizes app state and delegates UI to components in `/src/components`.
// The large in-file LandingPage/TeacherPortal implementations were replaced with
// imports so each component can be maintained separately.

// Sync current app view to help context (so bubble shows page-relevant help)
function PageHelpViewSyncer({ view }) {
  const { setPageId } = usePageHelp();
  useEffect(() => {
    const map = {
      portal: 'teacher-portal',
      dashboard: 'class-dashboard',
      settings: 'settings-cards',
      egg: 'class-dashboard',
      'lesson-planner': 'lesson-planner',
      torenado: 'games',
      setup: 'teacher-portal'
    };
    setPageId(map[view] || 'teacher-portal');
  }, [view, setPageId]);
  return null;
}

function LoggedInLayout({ view, children }) {
  return (
    <PageHelpProvider>
      <ToastProvider>
        <PageHelpViewSyncer view={view} />
        {children}
        <HelpChatBubble />
      </ToastProvider>
    </PageHelpProvider>
  );
}

// ==========================================
// 3. MAIN APP (THE TRAFFIC CONTROLLER)
// ==========================================
// Check for password reset token BEFORE any hash manipulation
function getHashRoute() {
  const hash = window.location.hash || '';
  const path = window.location.pathname || '';
  const parseAuthToken = (input, prefix) => {
    if (!input.startsWith(prefix)) return null;
    return input.replace(prefix, '').split('/')[0] || null;
  };
  // PocketBase uses /_/#/auth/reset-password/{TOKEN} format for password reset
  const resetFromHash = parseAuthToken(hash, '#/auth/reset-password/');
  const resetFromPath = parseAuthToken(path, '/auth/reset-password/');
  if (resetFromHash || resetFromPath) {
    return { page: 'reset', token: resetFromHash || resetFromPath };
  }
  // Also handle confirm-password-reset variant (for backwards compatibility)
  const confirmResetFromHash = parseAuthToken(hash, '#/auth/confirm-password-reset/');
  const confirmResetFromPath = parseAuthToken(path, '/auth/confirm-password-reset/');
  if (confirmResetFromHash || confirmResetFromPath) {
    return { page: 'reset', token: confirmResetFromHash || confirmResetFromPath };
  }
  // PocketBase uses /_/#/auth/confirm-verification/{TOKEN} format
  const confirmFromHash = parseAuthToken(hash, '#/auth/confirm-verification/');
  const confirmFromPath = parseAuthToken(path, '/auth/confirm-verification/');
  if (confirmFromHash || confirmFromPath) {
    return { page: 'confirm', token: confirmFromHash || confirmFromPath };
  }
  return { page: null };
}

function getPublicRoute() {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname || '/';
  if (path === '/about') return 'about';
  if (path === '/faq') return 'faq';
  if (path === '/privacy') return 'privacy';
  if (path === '/terms') return 'terms';
  if (path === '/guide') return 'guide';
  return 'home';
}

function upsertMetaTag(attr, key, content) {
  if (typeof document === 'undefined') return;
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function App() {
  const splashDismissedRef = useRef(false);
  useLayoutEffect(() => {
    if (splashDismissedRef.current) return;
    splashDismissedRef.current = true;
    const el = document.getElementById('app-loading-splash');
    if (!el) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const removeNode = () => {
      el.remove();
    };
    if (reduce) {
      removeNode();
      return;
    }
    el.classList.add('app-loading-splash--out');
    const onEnd = () => removeNode();
    el.addEventListener('transitionend', onEnd, { once: true });
    const t = window.setTimeout(onEnd, 600);
    return () => clearTimeout(t);
  }, []);

  // Successful mount: allow chunk-load recovery again after the next deploy.
  useEffect(() => {
    clearChunkRecoveryAttempt();
  }, []);

  // Check for special hash routes FIRST (before any hash manipulation)
  const hashRoute = getHashRoute();

  // Replace hash with pathname on first load for better SEO
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash && hash.startsWith('#') && !hash.startsWith('#/auth/')) {
      const legacy = hash.replace(/^#/, '');
      // Legacy dashboard sub-routes: #dashboard-assignments -> /dashboard?tab=assignments
      if (legacy.startsWith('dashboard-')) {
        const tab = legacy.replace(/^dashboard-/, '');
        const next = new URL(window.location.href);
        next.pathname = '/dashboard';
        if (tab && tab !== 'students') next.searchParams.set('tab', tab);
        else next.searchParams.delete('tab');
        next.hash = '';
        window.history.replaceState(null, '', `${next.pathname}${next.search}`);
        return;
      }
      // Simple hash to pathname conversion (not changing routing logic)
      window.history.replaceState(null, '', `/${legacy}`);
    }
  }, []);

  const { isDark } = useTheme();
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
  const [publicRoute, setPublicRoute] = useState(getPublicRoute);

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('classABC_logged_in');
    const token = localStorage.getItem('classABC_pb_token') || localStorage.getItem('classABC_token');
    if (stored && token) {
      return safeParse(stored, null);
    }
    return null;
  });

  // authReady: true once we know definitively whether a session exists.
  // Prevents the class-loading effect from firing with a null user while
  // restorePocketBaseAuth() is still in flight (avoids the blank-class flash).
  const [authReady, setAuthReady] = useState(() => {
    const stored = localStorage.getItem('classABC_logged_in');
    const token = localStorage.getItem('classABC_pb_token') || localStorage.getItem('classABC_token');
    return !!(stored && token); // already resolved from localStorage
  });

  const [showProfile, setShowProfile] = useState(false);
  const [classes, setClasses] = useState(() => {
    // PERFORMANCE: Seed from cache immediately for instant UI display
    const stored = localStorage.getItem('classABC_logged_in');
    const token = localStorage.getItem('classABC_pb_token') || localStorage.getItem('classABC_token');
    if (stored && token) {
      const u = safeParse(stored, null);
      if (u?.email) {
        const cached = safeParse(localStorage.getItem(`classABC_data_${u.email}`), []);
        // Return cached classes immediately, even if empty, to prevent loading delay
        return cached;
      }
    }
    return [];
  });
  const [behaviors, setBehaviors] = useState(() => safeParse(localStorage.getItem('classABC_behaviors'), INITIAL_BEHAVIORS));
  const [activeClassId, setActiveClassId] = useState(null);

  // If Google OAuth lands back on the landing page, `classABC_logged_in` might
  // not be set even though a PocketBase session exists. Try restoring once.
  const didTryRestoreAuthRef = useRef(false);
  useEffect(() => {
    if (user) { setAuthReady(true); return; }
    if (didTryRestoreAuthRef.current) return;
    didTryRestoreAuthRef.current = true;
    api
      .restorePocketBaseAuth?.()
      .then((restored) => {
        if (restored?.user) setUser(restored.user);
      })
      .catch(() => {
        // Intentionally ignore restore errors; the app will stay on the landing page.
      })
      .finally(() => {
        setAuthReady(true);
      });
  }, [user]);

  const initialView = (() => {
    const validViews = ['portal', 'dashboard', 'egg', 'settings', 'setup', 'torenado', 'lesson-planner',
                       'tornado', 'faceoff', 'memorymatch', 'quiz', 'motorace', 'horserace', 'spelltheword'];
    const pathView = (window.location.pathname || '/portal').replace(/^\/+/, '');
    if (validViews.includes(pathView)) return pathView;
    const h = (window.location.hash || '#portal').replace(/^#/, '');
    return validViews.includes(h) ? h : 'portal';
  })();
  const [view, setView] = useState(initialView);
  const [viewHistory, setViewHistory] = useState([initialView]);

  // Track the current index in history to prevent conflicts
  const historyRef = useRef(0);

  // Dynamic SEO tags for public pages + clean noindex policy for authenticated app screens.
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const baseUrl = 'https://klasiz.fun';
    const current = new URL(window.location.href);
    const cleanPath = current.pathname || '/';
    const canonical = `${baseUrl}${cleanPath}${current.search || ''}`;

    const isPublic = !user;
    const defaultTitle = 'Klasiz.fun - Modern Classroom Management';
    const defaultDescription =
      'Klasiz.fun helps teachers manage classrooms with points, assignments, reports, games, and parent-friendly progress tracking.';

    let title = defaultTitle;
    let description = defaultDescription;
    let robots = 'index, follow';
    let ogType = 'website';

    if (isPublic) {
      if (publicRoute === 'about') {
        title = 'About Klasiz.fun - Classroom Tools for Teachers';
        description = 'Learn how Klasiz.fun helps teachers run engaging classes with behavior points, assignments, reports, and games.';
      } else if (publicRoute === 'privacy') {
        title = 'Privacy Policy - Klasiz.fun';
        description = 'Read how Klasiz.fun handles and protects teacher, student, and parent data.';
      } else if (publicRoute === 'terms') {
        title = 'Terms of Service - Klasiz.fun';
        description = 'Review the terms and usage guidelines for Klasiz.fun.';
      } else if (publicRoute === 'faq') {
        title = 'FAQ - Klasiz.fun';
        description = 'Frequently asked questions about classroom management, assignments, parent access, and platform features.';
      } else {
        title = defaultTitle;
        description = defaultDescription;
      }
    } else {
      const dashboardTab = new URLSearchParams(window.location.search).get('tab') || 'students';
      const appViewTitles = {
        portal: 'Teacher Portal - Klasiz.fun',
        dashboard: `Dashboard (${dashboardTab}) - Klasiz.fun`,
        'lesson-planner': 'Lesson Planner - Klasiz.fun',
        settings: 'Settings - Klasiz.fun',
        egg: 'Class Journey - Klasiz.fun',
        setup: 'Setup Wizard - Klasiz.fun',
        torenado: 'Game Center - Klasiz.fun',
        tornado: 'Tornado - Klasiz.fun',
        faceoff: 'Face Off - Klasiz.fun',
        memorymatch: 'Memory Match - Klasiz.fun',
        quiz: 'Quiz - Klasiz.fun',
        motorace: 'Moto Race - Klasiz.fun',
        horserace: 'Horse Race - Klasiz.fun',
        spelltheword: 'Spell the Word - Klasiz.fun'
      };
      title = appViewTitles[view] || 'Teacher App - Klasiz.fun';
      description = 'Teacher workspace for classes, students, assignments, reports, and classroom tools.';
      robots = 'noindex, nofollow';
      ogType = 'article';
    }

    document.title = title;
    upsertCanonical(canonical);

    upsertMetaTag('name', 'description', description);
    upsertMetaTag('name', 'robots', robots);
    upsertMetaTag('property', 'og:title', title);
    upsertMetaTag('property', 'og:description', description);
    upsertMetaTag('property', 'og:url', canonical);
    upsertMetaTag('property', 'og:type', ogType);
    upsertMetaTag('name', 'twitter:title', title);
    upsertMetaTag('name', 'twitter:description', description);
    upsertMetaTag('name', 'twitter:url', canonical);
  }, [user, publicRoute, view, viewHistory.length]);

  // Track public SPA route based on pathname for logged-out pages
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      setPublicRoute(getPublicRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigate with history tracking for swipe-back
  const navigate = (newView) => {
    const prevView = viewHistory[viewHistory.length - 1];
    // Only push to history if it's a new view (not going back)
    if (newView !== prevView) {
      setViewHistory(prev => [...prev, newView]);
      setView(newView);
      window.history.pushState({ view: newView, appHistoryIndex: ++historyRef.current }, '', `/${newView}`);
    }
  };

  const handleTorenadoBack = () => navigate('dashboard');

  // Listen for browser back events (popstate) - This handles swipe-back
  useEffect(() => {
    if (!user) return;
    const handlePopState = (event) => {
      const state = event.state;

      // Read view from pathname (for SEO-friendly URLs)
      const path = window.location.pathname.replace(/^\//, '');
      if (path && path !== window.location.hash.replace(/^#/, '')) {
        // Pathname changed, update view
        const validViews = ['portal', 'dashboard', 'egg', 'settings', 'setup', 'torenado', 'lesson-planner',
                           'tornado', 'faceoff', 'memorymatch', 'quiz', 'motorace', 'horserace', 'spelltheword'];
        if (validViews.includes(path)) {
          setViewHistory(prev => {
            // Remove current view from history if it matches path
            const filtered = prev.filter(v => v !== path);
            return [...filtered, path];
          });
          setView(path);
          return;
        }
      }

      // Check if this is a dashboard modal close (LuckyDraw, Whiteboard, Buzzer)
      if (state && state.dashboardModal) {
        // Dispatch event to close the modal
        window.dispatchEvent(new CustomEvent('modalClose', { detail: state.dashboardModal }));
        return;
      }

      // Check if this is internal dashboard navigation (dashboardViewMode)
      if (state && state.dashboardViewMode) {
        // This is handled by ClassDashboard internally
        // We need to trigger a re-render to let ClassDashboard see the state change
        // Dispatch a custom event that ClassDashboard can listen to
        window.dispatchEvent(new CustomEvent('dashboardViewModeChange', { detail: state.dashboardViewMode }));
        return;
      }

      // Handle app-level navigation
      if (viewHistory.length > 1) {
        // Pop the current view from history
        const newHistory = viewHistory.slice(0, -1);
        const previousView = newHistory[newHistory.length - 1];

        // Update React state
        setViewHistory(newHistory);
        setView(previousView);

        // Replace the browser history to keep app history in sync
        window.history.replaceState({ view: previousView, appHistoryIndex: --historyRef.current }, '', `/${previousView}`);
      } else {
        // If at root, prevent going back to browser homepage
        window.history.replaceState({ view: 'portal', appHistoryIndex: 0 }, '', '/portal');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [viewHistory]);

  // 1. Add state to track if we are in the assignment studio
  const [isAssignmentStudioOpen, setIsAssignmentStudioOpen] = useState(false);

  const saveTimeoutRef = useRef(null);

  // Check for email verification token in URL
  const verificationToken = useMemo(() => {
    const hash = window.location.hash || '';
    const path = window.location.pathname || '';
    // Supports both legacy hash and clean path formats.
    const match = hash.match(/auth\/confirm-verification\/([^/]+)/)
      || path.match(/\/auth\/confirm-verification\/([^/]+)/);
    return match ? match[1] : null;
  }, []);

  if (verificationToken) {
    return (
      <Suspense fallback={<BrandedAppLoader />}>
        <VerifyEmailPage
          token={verificationToken}
          onSuccess={async () => {
            window.location.hash = '';
            localStorage.setItem('email_verified', 'true');
            window.location.reload();
          }}
          onError={() => {
            window.history.replaceState(null, '', '/');
          }}
        />
      </Suspense>
    );
  }

// Load classes and behaviors (for both logged in users and when accessed via student portal)
  useEffect(() => {
    if (!authReady) return; // wait until we know the auth state

    // restore token into api layer if present
    const token = localStorage.getItem('classABC_pb_token') || localStorage.getItem('classABC_token');
    if (token) api.setToken(token);

    let mounted = true;

    // Helper: persist fresh classes to localStorage so the next load is instant
    const cacheClasses = (email, data) => {
      if (!email || !Array.isArray(data) || data.length === 0) return;
      try {
        localStorage.setItem(`classABC_data_${email}`, JSON.stringify(data));
      } catch { /* quota exceeded — ignore */ }
    };

// Load classes from PocketBase (try to use user email if available, otherwise load publically accessible data)
    (async () => {
      try {
        let remote = [];
        if (user) {
          // If user is logged in, load their classes minimal first
          remote = await api.getClassesMinimal(user.email);
        } else {
          // If no user is logged in (student portal access), we should attempt to load the latest classes
          // We'll try to get the email from localStorage to load the appropriate classes
          const storedUser = localStorage.getItem('classABC_logged_in');
          if (storedUser) {
            try {
              const parsedUser = safeParse(storedUser, null);
              if (parsedUser) {
                remote = await api.getClassesMinimal(parsedUser.email);
              }
            } catch {
              // Fallback to localStorage cache
              const parsedUser = safeParse(storedUser, null);
              const key = `classABC_data_${parsedUser?.email || 'anonymous'}`;
              const localClasses = safeParse(localStorage.getItem(key), []);
              if (localClasses.length > 0 && mounted) setClasses(localClasses);
            }
          }
        }

        if (mounted && Array.isArray(remote)) {
          if (remote.length > 0) {
            setClasses(remote);
            // Persist to localStorage so the next page load is instant (stale-while-revalidate)
            const emailKey = user?.email || safeParse(localStorage.getItem('classABC_logged_in'), null)?.email;
            cacheClasses(emailKey, remote);
            // Clear demo class and flag when user has real classes
            localStorage.removeItem('classABC_demo_shown');
          } else if (user && !localStorage.getItem('classABC_demo_shown')) {
            // New user with no classes - show demo class
            setClasses([MOCK_CLASS]);
            localStorage.setItem('classABC_demo_shown', 'true');
          }
        }
      } catch {
            // backend not available — show cached classes so the user isn't left with blank screen
            const userEmail = user?.email || safeParse(localStorage.getItem('classABC_logged_in'), null)?.email || 'anonymous';
            const key = `classABC_data_${userEmail}`;
            const localClasses = safeParse(localStorage.getItem(key), []);
            if (mounted && localClasses.length > 0) setClasses(localClasses);
          }
    })();

    // Load behaviors from PocketBase
    (async () => {
      try {
        let remote = [];
        if (user) {
          try {
            remote = await api.getBehaviors(activeClassId, user.email);
          } catch (e) {
            console.warn('Could not fetch from behaviors collection:', e);
          }
        }

        if (mounted && Array.isArray(remote) && remote.length > 0) {
          setBehaviors(remote);
        } else {
          // Fallback to localStorage or initial behaviors
          const localBehaviors = safeParse(localStorage.getItem('classABC_behaviors'), INITIAL_BEHAVIORS);
          if (mounted) {
            setBehaviors(localBehaviors);
            // Auto-save initial behaviors for new users
            if (user && remote.length === 0) {
              try {
                await api.saveBehaviors(INITIAL_BEHAVIORS, null, user.email);
              } catch (e) {
                console.warn('[APP] Failed to auto-save initial behaviors:', e);
              }
            }
          }
        }
      } catch (e) {
        // backend not available — load from localStorage fallback
        const localBehaviors = safeParse(localStorage.getItem('classABC_behaviors'), INITIAL_BEHAVIORS);
        if (mounted) setBehaviors(localBehaviors);
      }
    })();

    return () => { mounted = false; };
  }, [user, activeClassId, authReady]);

  // persist behaviors and classes per user (localStorage + backend when available)
  const isSavingRef = useRef(false);

  // Explicit save function - called manually, not auto-triggered
  const saveData = async (dataToSave = classes, deletedIds = []) => {
    const token = localStorage.getItem('classABC_pb_token') || localStorage.getItem('classABC_token');

    if (!user || !token) {
      return;
    }

    // Prevent concurrent saves
    if (isSavingRef.current) {
      return;
    }

    // Debounce saves
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      isSavingRef.current = true;
      try {
        await api.saveClasses(user.email, dataToSave, behaviors, deletedIds);
        localStorage.setItem('classABC_behaviors', JSON.stringify(behaviors));
      } catch (e) {
        // Silently fail - UI already updated
      } finally {
        isSavingRef.current = false;
      }
    }, 1000);
  };

  const onLoginSuccess = (u) => {
    api.setToken(u.token);
    localStorage.setItem('classABC_pb_token', u.token);
    localStorage.setItem('classABC_logged_in', JSON.stringify(u));
    // Clear old localStorage data to avoid mixing with PocketBase
    localStorage.removeItem(`classABC_data_${u.email}`);
    // Don't clear classABC_behaviors - use it as fallback and sync with backend
    setUser(u);
  };

  // Wrapper to update classes and save
  const updateClassesAndSave = (updater) => {
    setClasses(prev => {
      const next = updater(prev);
      // Find deleted IDs by comparing prev and next
      const deletedIds = prev.filter(p => !next.find(n => n.id === p.id)).map(c => c.id);
      // Pass the new state directly to avoid stale closure bug
      saveData(next, deletedIds);
      return next;
    });
  };

  // Wrapper to update classes WITHOUT auto-save (for operations that save themselves)
  const updateClassesOnly = (updater) => {
    setClasses(updater);
  };

  const onLogout = () => {
    localStorage.removeItem('classABC_logged_in');
    // clear any persisted auth token
    api.setToken(null);
    localStorage.removeItem('classABC_pb_token');
    localStorage.removeItem('classABC_token');
    setUser(null);
    setClasses([]);
    setActiveClassId(null);
    setView('portal');
    setViewHistory(['portal']);
  };

  const onAddClass = async (newClass) => {
    setClasses(prev => {
      // Remove demo class if it exists when adding first real class
      const filtered = prev.filter(c => c.id !== 'demo-class');
      const next = [...filtered, newClass];

      // Clear the demo_shown flag since user now has real classes
      localStorage.removeItem('classABC_demo_shown');

      // persist to localStorage
      try {
        if (user && user.email) {
          const key = `classABC_data_${user.email}`;
          localStorage.setItem(key, JSON.stringify(next));
        }
      // eslint-disable-next-line no-unused-vars, no-empty
      } catch (e) { }
      return next;
    });

    // Explicitly save to server
    saveData();
  };

  const handleTornadoBack = () => {
    navigate('portal');
  };

  const onSelectClass = (classId) => {
    setActiveClassId(classId);
    navigate('dashboard');
  };

  const updateClasses = (updater) => {
    // Accept either functional updater or direct value
    setClasses(prev => {
      const next = (typeof updater === 'function' ? updater(prev) : updater);
      try {
        if (user && user.email) {
          const key = `classABC_data_${user.email}`;
          localStorage.setItem(key, JSON.stringify(next));
        }
      // eslint-disable-next-line no-unused-vars, no-empty
      } catch (e) { }
      return next;
    });
  };

    const activeClass = Array.isArray(classes) ? classes.find(c => c.id === activeClassId) || null : null;

  // Hydrate heavy JSON fields for the selected class only.
  useEffect(() => {
    if (view !== 'portal' && view !== 'dashboard') return;
    if (!activeClassId) return;
    if (typeof activeClassId === 'number') return; // not yet persisted

    const idStr = String(activeClassId);
    if (idStr === 'demo-class') return;

    let cancelled = false;
    (async () => {
      const details = await api.getClassDetails?.(idStr, user?.email);
      if (cancelled || !details) return;
      setClasses((prev) =>
        (prev || []).map((c) => {
          if (String(c.id) !== idStr) return c;

          const localSn = c?.sticky_note;
          const serverSn = details?.sticky_note;

          const localUpdatedAt =
            localSn && typeof localSn === 'object' && typeof localSn.__updatedAt === 'number'
              ? localSn.__updatedAt
              : null;

          const serverUpdatedAt =
            serverSn && typeof serverSn === 'object' && typeof serverSn.__updatedAt === 'number'
              ? serverSn.__updatedAt
              : null;

          // Keep whichever sticky note was persisted more recently.
          // This prevents async hydration from overwriting the user's latest drag/typing.
          let stickyToUse = serverSn;
          if (localUpdatedAt != null && serverUpdatedAt != null) {
            stickyToUse = localUpdatedAt >= serverUpdatedAt ? localSn : serverSn;
          } else if (localUpdatedAt != null && serverUpdatedAt == null) {
            stickyToUse = localSn;
          }

          return {
            ...c,
            ...details,
            sticky_note: stickyToUse
          };
        })
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [activeClassId, view, user?.email]);

  // Function to manually refresh classes from backend
  const refreshClasses = async () => {
    try {
      let userEmail = user?.email;

      // If no user is logged in, try to get the email from localStorage
      if (!user) {
        const storedUser = localStorage.getItem('classABC_logged_in');
        if (storedUser) {
          try {
            const parsedUser = safeParse(storedUser, null);
            if (parsedUser) {
              userEmail = parsedUser.email;
            }
          } catch {
            return;
          }
        } else {
          // For student portal (no teacher user), load all classes from PocketBase (with pagination)
          try {
            let classes = [];
            let page = 1;
            while (true) {
              const res = await api.pbRequest(`/collections/classes/records?page=${page}&perPage=500`);
              const pageItems = res.items || [];
              classes = classes.concat(pageItems.map(c => ({
              ...c,
              students: Array.isArray(c.students) ? c.students : safeParse(c.students, []),
              tasks: Array.isArray(c.tasks) ? c.tasks : safeParse(c.tasks, []),
              assignments: Array.isArray(c.assignments) ? c.assignments : safeParse(c.assignments, []),
              submissions: Array.isArray(c.submissions) ? c.submissions : safeParse(c.submissions, []),
              studentAssignments: Array.isArray(c.studentAssignments) ? c.studentAssignments : safeParse(c.studentAssignments, []),
              student_submissions: Array.isArray(c.student_submissions) ? c.student_submissions : safeParse(c.student_submissions, []),
              Access_Codes: typeof c.Access_Codes === 'object' ? c.Access_Codes : safeParse(c.Access_Codes, {})
            })));
              if (pageItems.length < 500) break;
              page++;
            }
            if (classes && Array.isArray(classes)) {
              setClasses(classes);
            }
          } catch (e) {
            // Silent fail
          }
          return;
        }
      }

      if (userEmail) {
        const remoteClasses = await api.getClassesMinimal(userEmail);
        if (remoteClasses && Array.isArray(remoteClasses)) {
          setClasses(remoteClasses);
        }
      }
    } catch (error) {
      // Silent fail
    }
  };

  // --- THIS BLOCK MUST BE HERE (ABOVE THE MAIN RETURN) ---
  if (isAssignmentStudioOpen) {
    return (
      <Suspense fallback={<BrandedAppLoader />}>
        <AssignmentsPage
        activeClass={activeClass}
        onBack={() => setIsAssignmentStudioOpen(false)}
        onPublish={async (assignmentData) => {
          const newAsn = { 
            ...assignmentData, 
            id: Date.now(),
            // Ensure consistent formatting of assignedTo array
            assignedTo: Array.isArray(assignmentData.assignedTo) ? 
              assignmentData.assignedTo.map(id => String(id)) : 
              (assignmentData.assignedTo || 'all'),  // Store who it's assigned to
            assignedToAll: assignmentData.assignedToAll !== undefined ? assignmentData.assignedToAll : true  // Default to all
          };

          // Compute new classes array and persist both in state and backend
          let newClasses;
          setClasses(prevClasses => {
            newClasses = prevClasses.map(c => {
              if (String(c.id) === String(activeClass.id)) {
                return {
                  ...c,
                  assignments: [...(c.assignments || []), newAsn],
                  submissions: c.submissions || [],
                  student_submissions: c.student_submissions || [],
                  studentAssignments: [
                    ...(c.studentAssignments || []),
                    ...(c.students || []).filter(s => {
                      if (newAsn.assignedToAll) return true;
                      if (Array.isArray(newAsn.assignedTo) && newAsn.assignedTo.includes(String(s.id))) return true;
                      return false;
                    }).map(s => ({
                      id: Date.now() + '_' + s.id,
                      assignmentId: newAsn.id,
                      studentId: s.id,
                      classId: c.id,
                      status: 'assigned',
                      answers: {},
                      assignedAt: new Date().toISOString()
                    }))
                  ]
                };
              }
              return c;
            });
            return newClasses;
          });

          // Explicitly save to server
          saveData();

          // Simulate a notification to students that a new assignment is available
          // This would trigger updates in the student portals

          setIsAssignmentStudioOpen(false);
        }}

      />
      </Suspense>
    );
  }

  // Handle /reset/:token and /confirm/:token (using hashRoute computed at component start)
  if (hashRoute.page === 'reset') {
    return <PasswordResetPage token={hashRoute.token} onSuccess={() => {
      // Clear the reset hash and set a flag to open login modal
      window.location.hash = '';
      localStorage.setItem('show_login_modal', 'true');
      window.location.reload();
    }} />;
  }
  if (hashRoute.page === 'confirm') {
    return <ConfirmAccountPage token={hashRoute.token} onSuccess={() => { window.location.hash = ''; }} />;
  }

      // Landing page (no user logged in) — no help bubble here
  if (!user) {
    const navigatePublic = (path) => {
      if (typeof window === 'undefined') return;
      if (window.location.pathname === path) return;
      window.history.pushState({}, '', path);
      setPublicRoute(getPublicRoute());
    };

    if (publicRoute === 'about') {
      return (
        <ToastProvider>
          <Suspense fallback={<BrandedAppLoader />}>
            <AboutPage
              isDark={isDark}
              isMobile={isMobile}
              onBack={() => navigatePublic('/')}
            />
          </Suspense>
        </ToastProvider>
      );
    }

    if (publicRoute === 'faq') {
      return (
        <ToastProvider>
          <Suspense fallback={<BrandedAppLoader />}>
            <FAQPage
              isDark={isDark}
              isMobile={isMobile}
              onBack={() => navigatePublic('/')}
            />
          </Suspense>
        </ToastProvider>
      );
    }

    if (publicRoute === 'privacy') {
      return (
        <ToastProvider>
          <Suspense fallback={<BrandedAppLoader />}>
            <PrivacyPolicyPage onClose={() => navigatePublic('/')} />
          </Suspense>
        </ToastProvider>
      );
    }

    if (publicRoute === 'terms') {
      return (
        <ToastProvider>
          <Suspense fallback={<BrandedAppLoader />}>
            <TermsPage onClose={() => navigatePublic('/')} />
          </Suspense>
        </ToastProvider>
      );
    }

    if (publicRoute === 'guide') {
      return (
        <ToastProvider>
          <Suspense fallback={<BrandedAppLoader />}>
            <GuideDocumentation
              onBack={() => navigatePublic('/')}
              onOpenLogin={() => {
                localStorage.setItem('guide_open_modal', 'login');
                navigatePublic('/');
              }}
              onOpenSignup={() => {
                localStorage.setItem('guide_open_modal', 'signup');
                navigatePublic('/');
              }}
            />
          </Suspense>
        </ToastProvider>
      );
    }

    return (
      <ToastProvider>
        <Suspense fallback={<BrandedAppLoader />}>
          <LandingPage
          onLoginSuccess={onLoginSuccess}
          classes={classes}
          setClasses={setClasses}
          refreshClasses={refreshClasses}
          showSearchGuide={() => {}}
          openModal={(action) => {
            window.dispatchEvent(new CustomEvent('guide-action', { detail: action }));
          }}
          onShowPrivacy={() => navigatePublic('/privacy')}
          onShowTerms={() => navigatePublic('/terms')}
          onShowAbout={() => navigatePublic('/about')}
          onShowFAQ={() => navigatePublic('/faq')}
          onShowGuide={() => navigatePublic('/guide')}
        />
        </Suspense>
      </ToastProvider>
    );
  }

  // Teacher area: single merged workspace (class rail + dashboard + bottom tools)
  if (view === 'portal' || view === 'dashboard') {
    return (
      <LoggedInLayout view={view}>
        <Suspense fallback={<BrandedAppLoader />}>
          <TeacherWorkspace
            view={view}
            activeClass={activeClass}
            activeClassId={activeClassId}
            classes={classes}
            user={user}
            onSelectClass={onSelectClass}
            onBackFromDashboard={() => { setActiveClassId(null); navigate('portal'); }}
            onAddClass={(c) => onAddClass(c)}
            onLogout={onLogout}
            onEditProfile={() => setShowProfile(true)}
            onUpdateUser={(updatedUser) => {
              setUser((u) => {
                const merged = { ...u, ...updatedUser };
                localStorage.setItem('classABC_logged_in', JSON.stringify(merged));
                return merged;
              });
            }}
            showProfileModal={showProfile}
            setShowProfileModal={setShowProfile}
            updateClasses={updateClassesOnly}
            updateClassesAndSave={updateClassesAndSave}
            onOpenTorenado={() => navigate('torenado')}
            onOpenLessonPlanner={() => navigate('lesson-planner')}
            behaviors={behaviors}
            refreshClasses={refreshClasses}
            onUpdateBehaviors={(next) => setBehaviors(next)}
            onOpenAssignments={() => setIsAssignmentStudioOpen(true)}
            onOpenGames={() => {
              /* Games: ClassDashboard manages GamesSidebar */
            }}
            onOpenGameFromDashboard={(gameId, classData) => {
              localStorage.setItem('selected_game_type', gameId);
              localStorage.setItem('selected_class_id', classData.id);
              navigate('torenado');
            }}
            onOpenEggRoad={() => navigate('egg')}
            onOpenSettings={() => navigate('settings')}
            onOpenSetup={() => navigate('setup')}
          />
        </Suspense>
      </LoggedInLayout>
    );
  }

  if (view === 'egg' && activeClass) {
    return (
      <LoggedInLayout view={view}>
        <Suspense fallback={<BrandedAppLoader />}>
          <EggRoad
            classData={activeClass}
            onBack={() => navigate('dashboard')}
            onResetProgress={() => {
              const updated = (prev) => prev.map(c =>
                c.id === activeClass.id
                  ? { ...c, students: c.students.map(s => ({ ...s, score: 0 })) }
                  : c
              );
              setClasses(updated);
            }}
          />
        </Suspense>
      </LoggedInLayout>
    );
  }

  if (view === 'settings' && activeClass) {
    return (
      <LoggedInLayout view={view}>
        <Suspense fallback={<BrandedAppLoader />}>
          <SettingsPage
            activeClass={activeClass}
            behaviors={behaviors}
            user={user}
            onBack={() => navigate('dashboard')}
            onUpdateBehaviors={(next) => setBehaviors(next)}
            onUpdateStudents={(nextStudents) => updateClasses(prev => prev.map(c => c.id === activeClass.id ? { ...c, students: nextStudents } : c))}
          />
        </Suspense>
      </LoggedInLayout>
    );
  }

  if (view === 'setup') {
    return (
      <LoggedInLayout view={view}>
        <Suspense fallback={<BrandedAppLoader />}>
          <SetupWizard onComplete={(newStudents, className) => {
            const newClass = { id: Date.now(), name: className || 'New Class', students: newStudents };
            onAddClass(newClass);
            setActiveClassId(newClass.id);
            navigate('dashboard');
          }} />
        </Suspense>
      </LoggedInLayout>
    );
  }

  // Game Center (including all game-specific hashes)
  if (view === 'torenado' || view === 'tornado' || view === 'faceoff' || view === 'memorymatch' || view === 'quiz' || view === 'motorace' || view === 'horserace' || view === 'spelltheword') {
    return (
      <LoggedInLayout view={view}>
        <Suspense fallback={<BrandedAppLoader />}>
          <GameCenter onBack={handleTorenadoBack} classes={classes} />
        </Suspense>
      </LoggedInLayout>
    );
  }

  // Lesson Planner
  if (view === 'lesson-planner') {
    return (
      <LoggedInLayout view={view}>
        <Suspense fallback={<BrandedAppLoader />}>
          <LessonPlannerPage
            user={user}
            classes={classes}
            onBack={() => navigate(activeClassId ? 'dashboard' : 'portal')}
          />
        </Suspense>
      </LoggedInLayout>
    );
  }

  // Fallback to portal
  return (
    <LoggedInLayout view={view}>
      <Suspense fallback={<BrandedAppLoader />}>
        <TeacherWorkspace
          view="portal"
          activeClass={null}
          activeClassId={activeClassId}
          classes={classes}
          user={user}
          onSelectClass={onSelectClass}
          onBackFromDashboard={() => { setActiveClassId(null); navigate('portal'); }}
          onAddClass={(c) => onAddClass(c)}
          onLogout={onLogout}
          onEditProfile={() => setShowProfile(true)}
          updateClasses={updateClassesOnly}
          updateClassesAndSave={updateClassesAndSave}
          onOpenTorenado={() => navigate('torenado')}
          onOpenLessonPlanner={() => navigate('lesson-planner')}
          behaviors={behaviors}
          refreshClasses={refreshClasses}
          onUpdateBehaviors={(next) => setBehaviors(next)}
          onOpenAssignments={() => setIsAssignmentStudioOpen(true)}
          onOpenGames={() => {}}
          onOpenGameFromDashboard={(gameId, classData) => {
            localStorage.setItem('selected_game_type', gameId);
            localStorage.setItem('selected_class_id', classData.id);
            navigate('torenado');
          }}
          onOpenEggRoad={() => navigate('egg')}
          onOpenSettings={() => navigate('settings')}
          onOpenSetup={() => navigate('setup')}
        />
      </Suspense>
    </LoggedInLayout>
  );
}

// --- STYLES ---
const _modernStyles = {
  container: { height: '100vh', background: '#fff', fontFamily: 'system-ui', overflowY: 'auto' },
  glow: { position: 'fixed', top: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 50% -20%, #e8f5e9, transparent)', pointerEvents: 'none' },
  nav: { padding: '20px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.8)', position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontSize: '24px', fontWeight: '900', letterSpacing: '-1px' },
  badge: { fontSize: '10px', background: '#000', color: '#fff', padding: '2px 8px', borderRadius: '10px', verticalAlign: 'middle' },
  navLinks: { display: 'flex', gap: '30px', alignItems: 'center' },
  anchor: { textDecoration: 'none', color: '#444', fontWeight: '500' },
  loginBtn: { background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  signupBtn: { background: '#1a1a1b', color: '#fff', padding: '10px 20px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  hero: { textAlign: 'center', padding: '100px 20px' },
  tagline: { color: '#4CAF50', fontWeight: 'bold', marginBottom: '15px' },
  heroTitle: { fontSize: '75px', fontWeight: '900', lineHeight: 1.1, letterSpacing: '-3px' },
  gradientText: { background: 'linear-gradient(90deg, #4CAF50, #2E7D32)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroSub: { fontSize: '20px', color: '#666', maxWidth: '600px', margin: '20px auto' },
  mainCta: { background: '#000', color: '#fff', padding: '18px 35px', borderRadius: '15px', fontSize: '18px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' },
  infoSection: { padding: '80px', background: '#f9f9f9' },
  sectionHeading: { textAlign: 'center', fontSize: '40px', fontWeight: '900', marginBottom: '50px' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' },
  infoCard: { background: '#fff', padding: '30px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
  iconBg: { width: '50px', height: '50px', background: '#f5f5f5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' },
  howSection: { padding: '80px', display: 'flex', gap: '50px', alignItems: 'center' },
  howContent: { flex: 1 },
  step: { display: 'flex', gap: '20px', marginBottom: '30px' },
  stepNum: { minWidth: '40px', height: '40px', background: '#4CAF50', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  howVisual: { flex: 1, height: '350px', background: '#eee', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  mockupCard: { background: '#fff', padding: '20px 40px', borderRadius: '15px', fontWeight: 'bold', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  bentoContainer: { width: '700px', background: '#fff', padding: '50px', borderRadius: '35px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' },
  bentoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' },
  bentoCard: { background: '#f5f5f7', padding: '30px', borderRadius: '25px', cursor: 'pointer', textAlign: 'center' },
  authForm: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '15px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px' }
};

const _styles = {
  lobbyContainer: { padding: '60px', background: '#F4F1EA', minHeight: '100vh' },
  heroTitle: { fontSize: '2.5rem', fontWeight: '900' },
  logoutBtn: { padding: '10px 15px', borderRadius: '12px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '25px' },
  classCard: { background: 'white', padding: '30px', borderRadius: '30px', textAlign: 'center', cursor: 'pointer' },
  addClassCard: { border: '2px dashed #ccc', borderRadius: '30px', height: '180px', cursor: 'pointer', background: 'transparent' },
  appLayout: { display: 'flex', height: '100vh', background: '#F4F1EA' },
  sidebar: { width: '80px', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', gap: '40px' },
  header: { padding: '20px 40px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  groupBtn: { background: '#4CAF50', color: 'white', padding: '10px 20px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  eggTrack: { width: '200px', height: '12px', background: '#eee', borderRadius: '10px', position: 'relative' },
  eggFill: { height: '100%', background: '#4CAF50', borderRadius: '10px' },
  eggIcon: { position: 'absolute', top: '-15px', fontSize: '1.5rem' },
  eggCounter: { position: 'absolute', top: '15px', fontSize: '10px', fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: '40px', right: '40px', width: '60px', height: '60px', borderRadius: '50%', background: '#4CAF50', color: '#fff', border: 'none', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalCard: { background: 'white', padding: '40px', borderRadius: '30px', width: '400px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  avatarPickerContainer: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  mainAvatarPreview: { width: '100px', height: '100px', borderRadius: '50%', background: '#f0f0f0', position: 'relative' },
  cameraIcon: { position: 'absolute', bottom: 0, right: 0, background: '#4CAF50', color: '#fff', padding: '5px', borderRadius: '50%', cursor: 'pointer' },
  genderToggle: { display: 'flex', background: '#f0f0f0', borderRadius: '10px', padding: '5px', marginBottom: '20px' },
  genderActive: { flex: 1, background: '#fff', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 'bold' },
  genderInactive: { flex: 1, background: 'transparent', border: 'none', padding: '8px', color: '#888' },
  input: { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '15px' },
  saveBtn: { width: '100%', padding: '15px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold' },
  bigCardOverlay: { position: 'fixed', inset: 0, background: '#fff', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  bigCardContent: { textAlign: 'center' },
  bigCardAvatar: { width: '250px', borderRadius: '50%' }
};

export default function WrappedApp() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}