// Theme management utilities for Astro
// This replaces ThemeContext.jsx with a vanilla JS/TypeScript approach

export interface ThemeState {
  theme: 'light' | 'dark';
  isDark: boolean;
}

export interface ThemeActions {
  setTheme: (theme: 'light' | 'dark') => void;
  switchTheme: () => void;
  toggleTheme: (theme: 'light' | 'dark') => void;
}

export type ThemeContext = ThemeState & ThemeActions;

/**
 * Get the current theme from localStorage or system preference
 */
export function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  const userPreference = localStorage.getItem('theme-preference');
  if (userPreference === 'dark' || userPreference === 'light') {
    return userPreference;
  }
  
  // No user preference - check system
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
}

/**
 * Apply theme to the document
 */
export function applyTheme(theme: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Add class to disable transitions before changing theme
  root.classList.add('theme-switching');
  
  // Set theme attribute
  root.setAttribute('data-theme', theme);
  
  // Apply dark mode styles
  applyDarkModeStyles(theme === 'dark');
  
  // Remove class after a brief delay
  requestAnimationFrame(() => {
    setTimeout(() => {
      root.classList.remove('theme-switching');
    }, 50);
  });
}

/**
 * Apply dark mode CSS overrides
 */
function applyDarkModeStyles(isDark: boolean): void {
  if (typeof document === 'undefined') return;
  
  let styleElement = document.getElementById('dark-mode-override');
  const style = styleElement || document.createElement('style');
  style.id = 'dark-mode-override';
  
  if (isDark) {
    style.textContent = `
      /* CRITICAL: EXCLUDE PointAnimation using data attributes - HIGHEST PRIORITY */
      [data-point-animation="true"] {
        background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%) !important;
        color: white !important;
        border-color: #FFA500 !important;
      }

      [data-point-animation-backdrop="true"] {
        background: rgba(0,0,0,0.5) !important;
      }

      /* All children of PointAnimation preserve original colors */
      [data-point-animation="true"] * {
        color: white !important;
        background: transparent !important;
        border-color: inherit !important;
      }

      /* Apply gentle dark mode to everything EXCEPT PointAnimation, game screens, and elements that shouldn't have backgrounds */
      *:not([data-point-animation]):not([data-point-animation-backdrop]):not([data-point-animation] *):not([data-game-screen]):not([data-game-screen] *):not([data-games-hub]):not([data-games-hub] *):not([data-sticker-picker]):not([data-sticker-picker] *):not([data-sticker-display]):not([data-sticker-display] *):not(.modal-overlay-in):not(.modal-overlay-out):not(.animated-modal-overlay):not([data-glass-dialog]):not([data-glass-dialog] *):not([data-guide-docs]):not([data-guide-docs] *):not(span):not(em):not(strong):not(code):not(mark):not(i):not(b):not(img):not(a):not(input):not(textarea):not(select):not(svg):not(path):not(circle):not(line):not(polyline):not(polygon):not(rect):not(g) {
        background-color: #252525 !important;
        color: #f0f0f0 !important;
        border-color: #4a4a4a !important;
      }

      /* Readable text: force light color so text is visible on dark backgrounds */
      span:not([data-guide-docs] *), em:not([data-guide-docs] *), strong:not([data-guide-docs] *), code:not([data-guide-docs] *), mark:not([data-guide-docs] *), i:not([data-guide-docs] *), b:not([data-guide-docs] *), p:not([data-guide-docs] *), h1:not([data-guide-docs] *), h2:not([data-guide-docs] *), h3:not([data-guide-docs] *), h4:not([data-guide-docs] *), h5:not([data-guide-docs] *), h6:not([data-guide-docs] *), label:not([data-guide-docs] *), td:not([data-guide-docs] *), th:not([data-guide-docs] *), li:not([data-guide-docs] *) {
        color: #f0f0f0 !important;
      }

      /* FIX BLACK SHADOWS: Remove dark backgrounds from elements that shouldn't have them */
      div[style*="background"], div[style*="Background"], 
      [class*="DonateOverlay"], [class*="donate"], [class*="qr"],
      [data-point-animation-backdrop], .modal-overlay-in, .modal-overlay-out, .animated-modal-overlay,
      [role="dialog"], [data-glass-dialog] {
        background-color: transparent !important;
        background: transparent !important;
      }

      /* Transparent background for text/inline/emoji/avatars so no black boxes */
      span:not([class*="card"]):not([class*="btn"]):not([class*="button"]):not([style*="background"]):not([style*="Background"]),
      em, strong, code, mark, i, b,
      img, img.emoji, [class*="emoji"], [data-emoji],
      a:not([class*="btn"]):not([class*="button"]):not([role="button"]) {
        background-color: transparent !important;
      }
      
      /* Avatar/emoji wrappers (div containing only img) — no black background */
      div:has(> img), [class*="avatar"] {
        background-color: transparent !important;
      }

      /* Icons (SVG): no black background — transparent so icon shape is visible; color from parent */
      svg, svg path, svg circle, svg line, svg polyline, svg polygon, svg rect, svg g {
        background-color: transparent !important;
        background: none !important;
      }

      /* Nav/sidebar: ensure text and icons are clearly visible (light on dark) */
      nav:not([data-guide-docs] *), nav:not([data-guide-docs] *) * {
        color: #f0f0f0 !important;
      }
      nav [data-active="true"], nav [data-active="true"] * {
        color: #4CAF50 !important;
      }
      nav svg {
        color: inherit !important;
      }

      button:not([data-guide-docs] *), .btn:not([data-guide-docs] *) {
        background-color: #252525 !important;
        color: #f0f0f0 !important;
      }

      /* Play button & primary actions: keep green, ensure white text for contrast */
      [data-play-btn],
      [data-primary-btn] {
        background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%) !important;
        background-color: #2E7D32 !important;
        color: #ffffff !important;
        border-color: #388E3C !important;
      }
      [data-play-btn] *, [data-primary-btn] * {
        color: #ffffff !important;
      }

      /* Play modal & class selection cards: dark card, light text */
      [data-play-modal],
      [data-play-modal] [data-play-card] {
        background: #2d2d2d !important;
        background-color: #2d2d2d !important;
        border-color: #4a4a4a !important;
        color: #f0f0f0 !important;
      }
      [data-play-modal] h1, [data-play-modal] h2, [data-play-modal] h3, [data-play-modal] h4,
      [data-play-modal] p, [data-play-modal] span, [data-play-modal] div {
        color: #f0f0f0 !important;
      }
      [data-play-modal] [data-play-card][data-selected="true"] {
        border-color: #4CAF50 !important;
        background: #1e3d20 !important;
        background-color: #1e3d20 !important;
      }
      [data-play-modal] .btn-secondary, [data-play-modal] [class*="cancel"] {
        background: #3d3d3d !important;
        color: #f0f0f0 !important;
      }

      /* Games hub & game screens: consistent dark UI */
      [data-games-hub], [data-game-screen] {
        background: #1a1a1a !important;
      }
      [data-games-hub] *, [data-game-screen] * {
        color: inherit;
      }

      input:not([data-guide-docs] *), textarea:not([data-guide-docs] *), select:not([data-guide-docs] *) {
        background-color: #2e2e2e !important;
        color: #f0f0f0 !important;
      }

      /* Clearer white borders for modals */
      .modal, [role="dialog"], [style*="borderRadius: 24px"], [style*="border-radius: 24px"],
      .animated-modal-content, [style*="zIndex: 10000"], [style*="zIndex: 100001"] {
        border: 2px solid rgba(255, 255, 255, 0.3) !important;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1) !important;
      }
    `;
  } else {
    style.textContent = '';
  }
  
  if (!styleElement) {
    document.head.appendChild(style);
  }
}

/**
 * Save theme preference to localStorage
 */
export function saveThemePreference(theme: 'light' | 'dark'): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('theme-preference', theme);
}

/**
 * Initialize theme management - call this on app startup
 */
export function initTheme(): ThemeContext {
  const theme = getInitialTheme();
  
  // Apply theme immediately
  applyTheme(theme);
  
  // Listen for system theme changes
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      const userPreference = localStorage.getItem('theme-preference');
      // Only auto-switch if user hasn't set a preference
      if (!userPreference) {
        const newTheme = e.matches ? 'dark' : 'light';
        applyTheme(newTheme);
      }
    });
  }
  
  return {
    theme,
    isDark: theme === 'dark',
    setTheme: (newTheme: 'light' | 'dark') => {
      applyTheme(newTheme);
      saveThemePreference(newTheme);
    },
    toggleTheme: (newTheme: 'light' | 'dark') => {
      applyTheme(newTheme);
      saveThemePreference(newTheme);
    },
    switchTheme: () => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      saveThemePreference(newTheme);
    }
  };
}

/**
 * Client-side script to initialize theme on page load
 * Include this in your Astro layout with <script> tag
 */
export function themeInitScript(): string {
  return `
    (function() {
      const getInitialTheme = () => {
        const userPreference = localStorage.getItem('theme-preference');
        if (userPreference === 'dark' || userPreference === 'light') {
          return userPreference;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        }
        return 'light';
      };
      
      const applyTheme = (theme) => {
        const root = document.documentElement;
        root.classList.add('theme-switching');
        root.setAttribute('data-theme', theme);
        requestAnimationFrame(() => {
          setTimeout(() => {
            root.classList.remove('theme-switching');
          }, 50);
        });
      };
      
      const theme = getInitialTheme();
      applyTheme(theme);
    })();
  `.trim();
}
