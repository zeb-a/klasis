# App.jsx Conversion - React to Astro

## Overview

`App.jsx` was the central router and state manager in the React application. In Astro, this functionality is distributed across:

1. **File-based routing** (`src/pages/*.astro`) - replaces React Router
2. **AppLayout.astro** - provides shared app shell and global state management
3. **appState.ts** - utility functions for managing shared state
4. **Alpine.js** - client-side reactivity where needed

## What Was Converted

### 1. Routing System

**React (App.jsx):**
```jsx
// Hash-based routing with manual history management
const [view, setView] = useState(initialView);
const navigate = (newView) => {
  setView(newView);
  window.history.pushState({ view: newView }, '', `/${newView}`);
};
```

**Astro:**
- File-based routing: `/src/pages/portal.astro`, `/src/pages/dashboard.astro`, etc.
- Clean URLs without hash: `/portal`, `/dashboard`
- Browser history handled natively by Astro
- State synchronization via custom events

### 2. Authentication State

**React:**
```jsx
const [user, setUser] = useState(() => {
  const stored = localStorage.getItem('classABC_logged_in');
  return safeParse(stored, null);
});
```

**Astro (appState.ts):**
```typescript
export function getUser(): User | null {
  const stored = localStorage.getItem('classABC_logged_in');
  const token = localStorage.getItem('classABC_pb_token');
  if (stored && token) {
    return safeParse<User | null>(stored, null);
  }
  return null;
}

export function setUser(user: User | null): void {
  // Sets localStorage and dispatches 'auth-change' event
}
```

### 3. Class Data Management

**React:**
```jsx
const [classes, setClasses] = useState(() => {
  const stored = localStorage.getItem(`classABC_data_${user.email}`);
  return safeParse(stored, []);
});
```

**Astro (appState.ts):**
```typescript
export function getClasses(): ClassData[] {
  const user = getUser();
  if (user?.email) {
    return safeParse(localStorage.getItem(`classABC_data_${user.email}`), []);
  }
  return [];
}

export function setClasses(classes: ClassData[]): void {
  // Persists to localStorage and dispatches 'classes-change' event
}
```

### 4. Navigation & History

**React:**
```jsx
const [viewHistory, setViewHistory] = useState([initialView]);
const navigate = (newView) => {
  setViewHistory(prev => [...prev, newView]);
  setView(newView);
  window.history.pushState({ view: newView }, '', `/${newView}`);
};

// Handle browser back button
useEffect(() => {
  const handlePopState = () => { /* complex history management */ };
  window.addEventListener('popstate', handlePopState);
}, [viewHistory]);
```

**Astro:**
- Native browser history with file-based routes
- Custom events for state synchronization
- Simplified navigation function in `appState.ts`:

```typescript
export function navigate(view: AppView): void {
  window.history.pushState({ view, timestamp: Date.now() }, '', `/${view}`);
  window.dispatchEvent(new CustomEvent('navigate', { detail: { view } }));
}
```

### 5. Special Routes (Password Reset, Email Verification)

**React:**
```jsx
function getHashRoute() {
  const resetFromHash = parseAuthToken(hash, '#/auth/reset-password/');
  if (resetFromHash) return { page: 'reset', token: resetFromHash };
  // ... more checks
}

if (hashRoute.page === 'reset') {
  return <PasswordResetPage token={hashRoute.token} />;
}
```

**Astro:**
- Dedicated pages: `/src/pages/auth/reset-password/[token].astro`
- Server-side token extraction in page `getStaticPaths`
- Cleaner separation of concerns

### 6. SEO & Meta Tags

**React:**
```jsx
useEffect(() => {
  document.title = title;
  upsertMetaTag('name', 'description', description);
  upsertCanonical(canonical);
}, [user, publicRoute, view]);
```

**Astro:**
- Server-side meta tags in layout frontmatter:
```astro
---
export interface Props {
  title: string;
  description?: string;
}
const { title, description } = Astro.props;
---
<head>
  <title>{title}</title>
  <meta name="description" content={description} />
</head>
```

### 7. Loading Splash Screen

**React:**
```jsx
useLayoutEffect(() => {
  const el = document.getElementById('app-loading-splash');
  if (!el) return;
  el.classList.add('app-loading-splash--out');
  el.addEventListener('transitionend', removeNode);
}, []);
```

**Astro (AppLayout.astro):**
- Built into layout with Alpine.js
- Automatic removal after initialization
- Respects `prefers-reduced-motion`

### 8. Error Boundary

**React:**
```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**Astro:**
- Global error handling script in `errorBoundary.ts`
- Injected via `errorHandlingInitScript()` in layout
- Fallback UI populated dynamically

## Architecture Comparison

### React (Centralized)
```
App.jsx (1252 lines)
├── State management (useState, useEffect)
├── Routing logic
├── Auth handling
├── Class data management
├── Behavior management
├── Navigation history
├── SEO meta tags
└── Conditional rendering of all views
```

### Astro (Distributed)
```
src/
├── layouts/
│   └── AppLayout.astro (app shell, global state)
├── lib/
│   ├── appState.ts (state utilities)
│   ├── theme.ts (theme management)
│   ├── pageHelp.ts (help system)
│   └── errorBoundary.ts (error handling)
├── pages/
│   ├── index.astro (landing page)
│   ├── portal.astro
│   ├── dashboard.astro
│   ├── settings.astro
│   └── auth/
│       └── reset-password/[token].astro
└── components/
    └── *.astro (islands for interactivity)
```

## Key Differences

| Feature | React | Astro |
|---------|-------|-------|
| **Routing** | Client-side (hash/path) | File-based, server-side |
| **State** | React Context + useState | localStorage + custom events |
| **Initial Load** | JS bundle downloads, then renders | HTML pre-rendered, JS enhances |
| **SEO** | Dynamic meta tags via useEffect | Server-side meta tags |
| **Navigation** | React state updates | Browser native + events |
| **Code Splitting** | lazy() + Suspense | Automatic per-page |
| **Error Handling** | ErrorBoundary component | Global script + fallback UI |

## Migration Guide

### For Components Using App.jsx State

**Before (React):**
```jsx
import { usePageHelp } from './PageHelpContext';
import { useTheme } from './ThemeContext';

function MyComponent() {
  const { setPageId } = usePageHelp();
  const { isDark } = useTheme();
  
  return <div className={isDark ? 'dark' : ''}>...</div>;
}
```

**After (Astro):**
```astro
---
// Server-side: props passed from page
const { isDark } = Astro.props;
---
<div class:list={['my-component', isDark && 'dark']}>
  <!-- Content -->
</div>

<script>
  // Client-side: use custom events
  window.addEventListener('auth-change', (e) => {
    console.log('User changed:', e.detail);
  });
</script>
```

### For Navigation

**Before (React):**
```jsx
const navigate = (view) => {
  setView(view);
  window.history.pushState({}, '', `/${view}`);
};

<button onClick={() => navigate('dashboard')}>Go to Dashboard</button>
```

**After (Astro):**
```astro
<!-- Simple link (full page load) -->
<a href="/dashboard" class="btn">Go to Dashboard</a>

<!-- Or with Alpine.js for SPA-like feel -->
<button 
  x-on:click="navigate('dashboard')"
  class="btn"
>
  Go to Dashboard
</button>
```

### For Auth State

**Before (React):**
```jsx
const [user, setUser] = useState(getUserFromStorage());

useEffect(() => {
  // Listen for auth changes
}, []);
```

**After (Astro):**
```astro
<script>
  // Check auth status
  const user = JSON.parse(localStorage.getItem('classABC_logged_in'));
  
  // Listen for changes
  window.addEventListener('auth-change', (e) => {
    // Update UI
  });
</script>
```

## Files Created

1. **`src/layouts/AppLayout.astro`** - Main app shell replacing App.jsx wrapper
2. **`src/lib/appState.ts`** - State management utilities
3. **Updated `src/layouts/MainLayout.astro`** - Now imports all init scripts

## Testing Checklist

- [ ] User authentication flow (login/logout)
- [ ] Navigation between views (portal → dashboard → settings)
- [ ] Browser back/forward buttons work correctly
- [ ] Password reset links work (`/auth/reset-password/:token`)
- [ ] Email verification links work
- [ ] Dark mode persists across navigation
- [ ] Class data loads from localStorage
- [ ] Behaviors persist correctly
- [ ] Loading splash appears and disappears smoothly
- [ ] Error boundary catches and displays errors
- [ ] SEO meta tags are correct for each page
- [ ] Mobile swipe-back navigation works

## Next Steps

1. Create individual page components for each view:
   - `src/pages/portal.astro`
   - `src/pages/dashboard.astro`
   - `src/pages/settings.astro`
   - etc.

2. Convert remaining components to Astro islands

3. Implement API service layer for PocketBase integration

4. Add progressive enhancement for JavaScript-disabled users
