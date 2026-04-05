// Page Help Context utilities for Astro
// This replaces PageHelpContext.jsx with a vanilla JS/TypeScript approach

export interface PageHelpState {
  pageId: string | null;
}

export interface PageHelpActions {
  setPageId: (pageId: string | null) => void;
}

export type PageHelpContext = PageHelpState & PageHelpActions;

/**
 * Map of view names to help page IDs
 */
const VIEW_TO_PAGE_ID_MAP: Record<string, string> = {
  'portal': 'teacher-portal',
  'dashboard': 'class-dashboard',
  'settings': 'settings-cards',
  'egg': 'class-dashboard',
  'lesson-planner': 'lesson-planner',
  'torenado': 'games',
  'setup': 'teacher-portal'
};

/**
 * Get the help page ID for a given view
 */
export function getPageIdForView(view: string): string {
  return VIEW_TO_PAGE_ID_MAP[view] || 'teacher-portal';
}

/**
 * Set the current page ID for help context
 * This is called when navigating between views
 */
export function setCurrentPageId(pageId: string | null): void {
  if (typeof window === 'undefined') return;
  
  // Store in sessionStorage for cross-component access
  if (pageId) {
    sessionStorage.setItem('current-help-page-id', pageId);
  } else {
    sessionStorage.removeItem('current-help-page-id');
  }
  
  // Dispatch custom event for components listening to help changes
  window.dispatchEvent(new CustomEvent('help-page-changed', { 
    detail: { pageId } 
  }));
}

/**
 * Get the current page ID from sessionStorage
 */
export function getCurrentPageId(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('current-help-page-id');
}

/**
 * Initialize page help system - call this on app startup
 */
export function initPageHelp(): PageHelpContext {
  const initialPageId = getCurrentPageId();
  
  return {
    pageId: initialPageId,
    setPageId: (pageId: string | null) => {
      setCurrentPageId(pageId);
    }
  };
}

/**
 * Listen for page help changes
 * Use this in components that need to react to help page changes
 */
export function onPageHelpChanged(callback: (pageId: string | null) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{ pageId: string | null }>;
    callback(customEvent.detail.pageId);
  };
  
  window.addEventListener('help-page-changed', handler);
  
  return () => {
    window.removeEventListener('help-page-changed', handler);
  };
}

/**
 * Client-side script to initialize page help tracking
 * Include this in your Astro layout or pages
 */
export function pageHelpInitScript(): string {
  return `
    (function() {
      const setCurrentPageId = (pageId) => {
        if (!window) return;
        if (pageId) {
          sessionStorage.setItem('current-help-page-id', pageId);
        } else {
          sessionStorage.removeItem('current-help-page-id');
        }
        window.dispatchEvent(new CustomEvent('help-page-changed', { 
          detail: { pageId } 
        }));
      };
      
      // Expose globally for Alpine.js and other scripts
      window.setHelpPageId = setCurrentPageId;
      window.getHelpPageId = () => sessionStorage.getItem('current-help-page-id');
    })();
  `.trim();
}
