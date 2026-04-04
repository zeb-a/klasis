/**
 * When the OAuth popup lands on /api/oauth2-redirect?code=... but the server (or SW)
 * incorrectly returns the SPA (Klasiz index.html), PocketBase's callback script never runs.
 * A same-origin fetch with cache: 'no-store' often still reaches the real API; if the
 * response is PocketBase's HTML (<title>PocketBase</title>), replace the document so the
 * oauth handshake can complete.
 *
 * Server-side fix is still required: nginx must proxy /api/* to PocketBase, and the SW
 * should use navigateFallbackDenylist for /api/.
 */
export async function maybeRecoverOAuthPopup() {
  if (typeof window === 'undefined') return false;

  const path = window.location.pathname || '';
  if (path !== '/api/oauth2-redirect') return false;

  const params = new URLSearchParams(window.location.search || '');
  const code = params.get('code');
  if (!code) return false;

  try {
    const res = await fetch(window.location.href, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: { Accept: 'text/html' }
    });

    if (!res.ok) {
      // Recovery fetch failed — if we're in a popup, manually relay code+state and close.
      if (window.opener) {
        const state = params.get('state');
        try {
          window.opener.postMessage({ code, state }, window.location.origin);
          window.opener.postMessage(JSON.stringify({ code, state }), window.location.origin);
        } catch {}
        try { window.close(); } catch {}
        return true;
      }
      return false;
    }

    const html = await res.text();
    // Real PocketBase callback page uses this title (SPA uses "Klasiz…").
    if (!/<title[^>]*>[\s\S]*pocketbase[\s\S]*<\/title>/i.test(html)) {
      // PocketBase HTML not detected — relay manually if in popup.
      if (window.opener) {
        const state = params.get('state');
        try {
          window.opener.postMessage({ code, state }, window.location.origin);
          window.opener.postMessage(JSON.stringify({ code, state }), window.location.origin);
        } catch {}
        try { window.close(); } catch {}
        return true;
      }
      return false;
    }

    document.open();
    document.write(html);
    document.close();
    // Fallback: if PocketBase's window.close() doesn't fire (some browsers block it
    // after document.write), close the popup ourselves after a short delay.
    setTimeout(() => { try { window.close(); } catch {} }, 1200);
    return true;
  } catch {
    // Network error — relay manually if in popup.
    if (window.opener) {
      const state = params.get('state');
      try {
        window.opener.postMessage({ code, state }, window.location.origin);
        window.opener.postMessage(JSON.stringify({ code, state }), window.location.origin);
      } catch {}
      try { window.close(); } catch {}
      return true;
    }
    return false;
  }
}
