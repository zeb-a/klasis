// Error Boundary utilities for Astro
// This replaces ErrorBoundary.jsx with vanilla JS error handling

export interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo?: string | null;
}

export interface ErrorHandlers {
  reset: () => void;
  reportError: (error: Error, context?: string) => void;
}

export type ErrorContext = ErrorState & ErrorHandlers;

/**
 * Global error handler for uncaught errors
 */
export function setupGlobalErrorHandler(): void {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    
    // Log to analytics/monitoring service if configured
    if (window.classABC?.logError) {
      window.classABC.logError(event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        message: event.message
      });
    }
    
    // Store error for recovery
    storeLastError({
      hasError: true,
      error: event.error,
      errorInfo: `At ${event.filename}:${event.lineno}:${event.colno} - ${event.message}`
    });
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Log to analytics/monitoring service if configured
    if (window.classABC?.logError) {
      window.classABC.logError(event.reason, { type: 'unhandledrejection' });
    }
    
    // Store error for recovery
    storeLastError({
      hasError: true,
      error: event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      errorInfo: 'Unhandled promise rejection'
    });
  });
}

/**
 * Store last error in sessionStorage for recovery
 */
function storeLastError(errorState: ErrorState): void {
  if (typeof sessionStorage === 'undefined') return;
  
  try {
    const errorData = {
      hasError: errorState.hasError,
      timestamp: Date.now(),
      message: errorState.error?.message,
      stack: errorState.error?.stack,
      errorInfo: errorState.errorInfo
    };
    sessionStorage.setItem('last-error', JSON.stringify(errorData));
  } catch (e) {
    // Ignore storage errors
  }
}

/**
 * Get last error from sessionStorage
 */
export function getLastError(): ErrorState | null {
  if (typeof sessionStorage === 'undefined') return null;
  
  try {
    const data = sessionStorage.getItem('last-error');
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    // Only consider errors from the last 5 minutes
    if (Date.now() - parsed.timestamp > 5 * 60 * 1000) {
      sessionStorage.removeItem('last-error');
      return null;
    }
    
    return {
      hasError: parsed.hasError,
      error: parsed.message ? new Error(parsed.message) : null,
      errorInfo: parsed.errorInfo
    };
  } catch (e) {
    return null;
  }
}

/**
 * Clear stored error
 */
export function clearLastError(): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.removeItem('last-error');
}

/**
 * Initialize error handling system
 */
export function initErrorHandling(): ErrorContext {
  setupGlobalErrorHandler();
  
  const lastError = getLastError();
  
  return {
    hasError: lastError?.hasError ?? false,
    error: lastError?.error ?? null,
    errorInfo: lastError?.errorInfo ?? null,
    reset: () => {
      clearLastError();
      // Reload the page to recover
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    },
    reportError: (error: Error, context?: string) => {
      console.error(`Error reported${context ? ` in ${context}` : ''}:`, error);
      
      if (typeof window !== 'undefined' && window.classABC?.logError) {
        window.classABC.logError(error, { context });
      }
      
      storeLastError({
        hasError: true,
        error,
        errorInfo: context
      });
    }
  };
}

/**
 * Create an error boundary wrapper for client-side components
 * This returns HTML that can be used as a fallback
 */
export function createErrorFallbackHTML(onRetry?: string): string {
  return `
    <div class="error-boundary" style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
      background: #fef2f2;
      color: #991b1b;
    ">
      <h1 style="font-size: 48px; margin-bottom: 20px;">⚠️</h1>
      <h2 style="font-size: 24px; margin-bottom: 12px; font-weight: 700;">
        Something went wrong
      </h2>
      <p style="font-size: 16px; margin-bottom: 24px; max-width: 500px; text-align: center;">
        We're sorry, but an unexpected error occurred. Please try refreshing the page.
      </p>
      <button
        onclick="${onRetry || 'window.location.reload()'}"
        style="
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 700;
          background: #991b1b;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        "
      >
        Try Again
      </button>
    </div>
  `.trim();
}

/**
 * Client-side script to initialize error handling
 * Include this in your Astro layout with <script> tag
 */
export function errorHandlingInitScript(): string {
  return `
    (function() {
      const storeLastError = (errorState) => {
        if (!sessionStorage) return;
        try {
          const errorData = {
            hasError: errorState.hasError,
            timestamp: Date.now(),
            message: errorState.error?.message,
            stack: errorState.error?.stack,
            errorInfo: errorState.errorInfo
          };
          sessionStorage.setItem('last-error', JSON.stringify(errorData));
        } catch (e) {
          // Ignore storage errors
        }
      };
      
      window.addEventListener('error', (event) => {
        console.error('Global error caught:', event.error);
        storeLastError({
          hasError: true,
          error: event.error,
          errorInfo: \`At \${event.filename}:\${event.lineno}:\${event.colno} - \${event.message}\`
        });
      });
      
      window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        storeLastError({
          hasError: true,
          error: event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
          errorInfo: 'Unhandled promise rejection'
        });
      });
      
      // Expose globally
      window.clearLastError = () => sessionStorage?.removeItem('last-error');
      window.getLastError = () => {
        try {
          const data = sessionStorage?.getItem('last-error');
          return data ? JSON.parse(data) : null;
        } catch (e) {
          return null;
        }
      };
    })();
  `.trim();
}

// Extend Window interface for global error handling
declare global {
  interface Window {
    classABC?: {
      logError?: (error: Error, meta?: Record<string, unknown>) => void;
    };
    clearLastError?: () => void;
    getLastError?: () => Record<string, unknown> | null;
    setHelpPageId?: (pageId: string | null) => void;
    getHelpPageId?: () => string | null;
  }
}
