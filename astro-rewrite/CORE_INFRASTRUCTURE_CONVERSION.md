# Core Infrastructure Conversion Guide

This document describes the conversion of React core infrastructure files to Astro-compatible vanilla JavaScript/TypeScript utilities.

## Overview

The following React files have been converted:

| React File | Astro Replacement | Location |
|------------|------------------|----------|
| `ThemeContext.jsx` | `theme.ts` | `/workspace/astro-rewrite/src/lib/theme.ts` |
| `PageHelpContext.jsx` | `pageHelp.ts` | `/workspace/astro-rewrite/src/lib/pageHelp.ts` |
| `ErrorBoundary.jsx` | `errorBoundary.ts` | `/workspace/astro-rewrite/src/lib/errorBoundary.ts` |
| `main.jsx` | Layout + Scripts | Integrated into `MainLayout.astro` |
| `App.jsx` | To be converted | Next priority |

## Key Changes

### 1. Theme Management (`theme.ts`)

**React Approach:**
- Context API with provider/wrapper pattern
- State management via `useState` and `useEffect`
- Component-based theme toggling

**Astro Approach:**
- Vanilla TypeScript utility functions
- Direct DOM manipulation for theme application
- localStorage-based persistence
- System preference detection
- Inline script for immediate theme application (prevents FOUC)

**Usage in Astro:**
```astro
---
import { themeInitScript } from '../lib/theme';
---
<script is:inline>{themeInitScript()}</script>
```

**Key Functions:**
- `getInitialTheme()` - Get theme from localStorage or system preference
- `applyTheme(theme)` - Apply theme to document
- `initTheme()` - Initialize theme system and return context object
- `themeInitScript()` - Generate inline script for layout

### 2. Page Help System (`pageHelp.ts`)

**React Approach:**
- Context API for cross-component help state
- Provider wrapper around app sections

**Astro Approach:**
- sessionStorage-based state sharing
- Custom events for cross-component communication
- Global window functions for Alpine.js integration

**Usage in Astro:**
```astro
---
import { pageHelpInitScript } from '../lib/pageHelp';
---
<script is:inline>{pageHelpInitScript()}</script>
```

**Key Functions:**
- `getPageIdForView(view)` - Map view names to help page IDs
- `setCurrentPageId(pageId)` - Set current help context
- `getCurrentPageId()` - Get current help page ID
- `onPageHelpChanged(callback)` - Listen for help changes
- `pageHelpInitScript()` - Generate initialization script

**Alpine.js Integration:**
```html
<div x-data x-init="setHelpPageId('dashboard')">
  <!-- Help bubble will show dashboard-specific help -->
</div>
```

### 3. Error Handling (`errorBoundary.ts`)

**React Approach:**
- Error Boundary class component
- `componentDidCatch` lifecycle method
- Render fallback UI on error

**Astro Approach:**
- Global error event listeners
- sessionStorage for error persistence
- Client-side recovery mechanisms
- Fallback HTML generation

**Usage in Astro:**
```astro
---
import { errorHandlingInitScript, createErrorFallbackHTML } from '../lib/errorBoundary';
---
<div id="error-boundary-fallback" style="display: none;">
  {createErrorFallbackHTML()}
</div>
<script is:inline>{errorHandlingInitScript()}</script>
```

**Key Functions:**
- `setupGlobalErrorHandler()` - Install global error listeners
- `getLastError()` - Retrieve last error from storage
- `clearLastError()` - Clear stored error
- `initErrorHandling()` - Initialize error system
- `createErrorFallbackHTML()` - Generate error UI
- `errorHandlingInitScript()` - Generate initialization script

### 4. Main Layout (`MainLayout.astro`)

**Changes:**
- Added inline scripts for core infrastructure
- Integrated theme, page help, and error handling
- Error boundary fallback container
- Proper script loading order for optimal performance

## Migration Notes

### What Changed

1. **No More Context Providers**: Replaced with storage-based state (localStorage/sessionStorage)
2. **No More Hooks**: Replaced with plain functions and event listeners
3. **Immediate Execution**: Critical scripts run inline before page render
4. **Event-Based Communication**: Components communicate via custom events instead of context

### What Stayed the Same

1. **Theme Logic**: Same dark mode CSS rules and exclusion patterns
2. **Help Mapping**: Same view-to-page-id mappings
3. **Error Recovery**: Same error storage and recovery approach
4. **User Experience**: Identical behavior from user perspective

## Usage Examples

### Theme Toggle Button
```html
<button 
  onclick="
    const current = localStorage.getItem('theme-preference');
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme-preference', next);
    // Theme will auto-apply via listener or manual call
  "
>
  Toggle Theme
</button>
```

### Setting Help Context in Alpine Component
```html
<div 
  x-data="{ init() { setHelpPageId('class-dashboard') } }"
  x-init="init()"
>
  <!-- Dashboard content -->
</div>
```

### Error Reporting in Client Scripts
```javascript
try {
  // Some operation
} catch (error) {
  if (window.classABC?.logError) {
    window.classABC.logError(error, { context: 'student-import' });
  }
}
```

## Next Steps

1. **Convert App.jsx**: Create routing/navigation utilities
2. **Convert main.jsx features**: Migrate remaining initialization logic
3. **Update Components**: Refactor React components to use new utilities
4. **Testing**: Verify all features work identically to React version

## Files Created

- `/workspace/astro-rewrite/src/lib/theme.ts` - Theme management
- `/workspace/astro-rewrite/src/lib/pageHelp.ts` - Help system
- `/workspace/astro-rewrite/src/lib/errorBoundary.ts` - Error handling
- `/workspace/astro-rewrite/src/layouts/MainLayout.astro` - Updated layout

## Dependencies

These utilities are framework-agnostic and require:
- Modern browser with localStorage/sessionStorage support
- No external dependencies
- Compatible with Alpine.js, vanilla JS, or any client-side framework
