/**
 * After a new deploy, hashed JS chunks change. A stale Service Worker / Cache Storage
 * can leave the browser with an old index that references missing chunks →
 * "Importing a module script failed" on lazy routes (e.g. TeacherWorkspace).
 * One recovery: unregister SW, clear caches, reload once per attempt.
 */

const SESSION_KEY = 'klasiz_chunk_recovery_attempt';

function isChunkLoadError(msg) {
  return /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk \d+ failed|error loading dynamically imported module/i.test(
    String(msg || '')
  );
}

export function clearChunkRecoveryAttempt() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function installChunkLoadRecovery() {
  if (typeof window === 'undefined') return;

  const recover = async () => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') return;
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      return;
    }
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    } catch {
      /* ignore */
    }
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  window.addEventListener('unhandledrejection', (e) => {
    const msg = e.reason?.message ?? e.reason;
    if (isChunkLoadError(msg)) {
      e.preventDefault();
      recover();
    }
  });
}
