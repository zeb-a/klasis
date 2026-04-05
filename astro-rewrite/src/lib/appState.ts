/**
 * App Router Conversion - React to Astro
 * 
 * In Astro, we don't have a client-side router like React Router.
 * Instead, we use:
 * 1. File-based routing (src/pages/*.astro)
 * 2. Shared state via localStorage + custom events
 * 3. Layouts for common UI patterns
 * 4. Client-side islands for interactivity
 * 
 * This file provides utilities for managing app state that was previously in App.jsx
 */

// Safe JSON parser that returns a fallback on error - prevents app crashes from corrupted data
export function safeParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

// Auth state management (replaces useState for user/auth)
export interface User {
  id: string;
  email: string;
  name?: string;
  token?: string;
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('classABC_logged_in');
  const token = localStorage.getItem('classABC_pb_token') || localStorage.getItem('classABC_token');
  if (stored && token) {
    return safeParse<User | null>(stored, null);
  }
  return null;
}

export function setUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('classABC_logged_in', JSON.stringify(user));
    if (user.token) {
      localStorage.setItem('classABC_pb_token', user.token);
    }
  } else {
    localStorage.removeItem('classABC_logged_in');
    localStorage.removeItem('classABC_pb_token');
    localStorage.removeItem('classABC_token');
  }
  // Dispatch event for other components to react
  window.dispatchEvent(new CustomEvent('auth-change', { detail: user }));
}

export function clearAuth(): void {
  setUser(null);
  window.dispatchEvent(new CustomEvent('logout'));
}

// Class data management
export interface Student {
  id: number | string;
  name: string;
  gender: 'boy' | 'girl';
  score: number;
  avatar?: string;
}

export interface ClassData {
  id: string | number;
  name: string;
  students: Student[];
  theme?: string;
  createdAt?: number;
  assignments?: any[];
  submissions?: any[];
  studentAssignments?: any[];
  tasks?: any[];
  sticky_note?: any;
  Access_Codes?: any;
}

export function getClasses(): ClassData[] {
  if (typeof window === 'undefined') return [];
  const user = getUser();
  if (user?.email) {
    const cached = safeParse<ClassData[]>(localStorage.getItem(`classABC_data_${user.email}`), []);
    return cached;
  }
  return [];
}

export function setClasses(classes: ClassData[]): void {
  if (typeof window === 'undefined') return;
  const user = getUser();
  if (user?.email) {
    try {
      localStorage.setItem(`classABC_data_${user.email}`, JSON.stringify(classes));
    } catch {
      // quota exceeded — ignore
    }
  }
  window.dispatchEvent(new CustomEvent('classes-change', { detail: classes }));
}

// Behavior management
export interface Behavior {
  id: number;
  label: string;
  pts: number;
  type: 'wow' | 'nono';
}

const INITIAL_BEHAVIORS: Behavior[] = [
  { id: 1, label: 'Helped Friend', pts: 1, type: 'wow' },
  { id: 2, label: 'Great Work', pts: 2, type: 'wow' },
  { id: 3, label: 'On Task', pts: 1, type: 'wow' },
  { id: 4, label: 'Kindness', pts: 1, type: 'wow' },
  { id: 5, label: 'Noisy', pts: -1, type: 'nono' },
  { id: 6, label: 'Disruptive', pts: -2, type: 'nono' }
];

export function getBehaviors(): Behavior[] {
  if (typeof window === 'undefined') return INITIAL_BEHAVIORS;
  return safeParse<Behavior[]>(localStorage.getItem('classABC_behaviors'), INITIAL_BEHAVIORS);
}

export function setBehaviors(behaviors: Behavior[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('classABC_behaviors', JSON.stringify(behaviors));
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent('behaviors-change', { detail: behaviors }));
}

// View/Navigation management
export type AppView = 
  | 'portal' 
  | 'dashboard' 
  | 'egg' 
  | 'settings' 
  | 'setup' 
  | 'torenado' 
  | 'lesson-planner'
  | 'tornado' 
  | 'faceoff' 
  | 'memorymatch' 
  | 'quiz' 
  | 'motorace' 
  | 'horserace' 
  | 'spelltheword';

const VALID_VIEWS: AppView[] = [
  'portal', 'dashboard', 'egg', 'settings', 'setup', 'torenado', 'lesson-planner',
  'tornado', 'faceoff', 'memorymatch', 'quiz', 'motorace', 'horserace', 'spelltheword'
];

export function getCurrentView(): AppView {
  if (typeof window === 'undefined') return 'portal';
  const path = window.location.pathname.replace(/^\/+/, '');
  if (VALID_VIEWS.includes(path as AppView)) {
    return path as AppView;
  }
  return 'portal';
}

export function navigate(view: AppView): void {
  if (typeof window === 'undefined') return;
  window.history.pushState({ view, timestamp: Date.now() }, '', `/${view}`);
  window.dispatchEvent(new CustomEvent('navigate', { detail: { view } }));
}

export function goBack(): void {
  if (typeof window === 'undefined') return;
  window.history.back();
}

// Public route management
export type PublicRoute = 'home' | 'about' | 'faq' | 'privacy' | 'terms' | 'guide';

export function getPublicRoute(): PublicRoute {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname || '/';
  if (path === '/about') return 'about';
  if (path === '/faq') return 'faq';
  if (path === '/privacy') return 'privacy';
  if (path === '/terms') return 'terms';
  if (path === '/guide') return 'guide';
  return 'home';
}

// Demo class for new users
export const MOCK_CLASS: ClassData = {
  id: 'demo-class',
  name: 'Demo Class',
  students: [
    { id: 1, name: 'Emma Watson', gender: 'girl', score: 15, avatar: '' },
    { id: 2, name: 'Liam Johnson', gender: 'boy', score: 8, avatar: '' },
    { id: 3, name: 'Olivia Smith', gender: 'girl', score: 22, avatar: '' },
    { id: 4, name: 'Noah Brown', gender: 'boy', score: 5, avatar: '' },
    { id: 5, name: 'Ava Davis', gender: 'girl', score: 12, avatar: '' }
  ],
  theme: 'ocean',
  createdAt: Date.now()
};

export function hasDemoClassShown(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('classABC_demo_shown');
}

export function setDemoClassShown(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('classABC_demo_shown', 'true');
}

export function clearDemoClassShown(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('classABC_demo_shown');
}

// Assignment studio state
export function isAssignmentStudioOpen(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem('assignment_studio_open') === 'true';
}

export function setAssignmentStudioOpen(open: boolean): void {
  if (typeof window === 'undefined') return;
  if (open) {
    sessionStorage.setItem('assignment_studio_open', 'true');
  } else {
    sessionStorage.removeItem('assignment_studio_open');
  }
  window.dispatchEvent(new CustomEvent('assignment-studio-toggle', { detail: { open } }));
}

// Profile modal state
export function isProfileModalOpen(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem('profile_modal_open') === 'true';
}

export function setProfileModalOpen(open: boolean): void {
  if (typeof window === 'undefined') return;
  if (open) {
    sessionStorage.setItem('profile_modal_open', 'true');
  } else {
    sessionStorage.removeItem('profile_modal_open');
  }
  window.dispatchEvent(new CustomEvent('profile-modal-toggle', { detail: { open } }));
}

// Active class management
export function getActiveClassId(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('active_class_id');
}

export function setActiveClassId(id: string | null): void {
  if (typeof window === 'undefined') return;
  if (id) {
    sessionStorage.setItem('active_class_id', id);
  } else {
    sessionStorage.removeItem('active_class_id');
  }
  window.dispatchEvent(new CustomEvent('active-class-change', { detail: { id } }));
}

// Initialize app state on load
export function initAppState(): void {
  if (typeof window === 'undefined') return;
  
  // Listen for popstate (browser back/forward)
  window.addEventListener('popstate', () => {
    window.dispatchEvent(new CustomEvent('navigate', { 
      detail: { view: getCurrentView() } 
    }));
  });
}

// Generate inline script for Astro
export function appStateInitScript(): string {
  return `
    // Initialize app state management
    (function() {
      if (typeof window === 'undefined') return;
      
      // Listen for popstate (browser back/forward)
      window.addEventListener('popstate', function() {
        const path = window.location.pathname.replace(/^\\/+/, '');
        const validViews = ['portal', 'dashboard', 'egg', 'settings', 'setup', 'torenado', 'lesson-planner',
                           'tornado', 'faceoff', 'memorymatch', 'quiz', 'motorace', 'horserace', 'spelltheword'];
        if (validViews.includes(path)) {
          window.dispatchEvent(new CustomEvent('navigate', { detail: { view: path } }));
        }
      });
      
      // Clear chunk recovery on successful load
      try {
        localStorage.removeItem('classABC_chunk_recovery_attempts');
      } catch (e) {}
    })();
  `.trim();
}

// Call this once when app loads
if (typeof window !== 'undefined') {
  initAppState();
}
