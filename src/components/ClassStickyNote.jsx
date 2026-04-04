import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronUp, GripHorizontal, X, StickyNote, Type } from 'lucide-react';

/** Default shape persisted on class.sticky_note (PocketBase JSON field). */
export function defaultStickyNote() {
  // Calculate middle-right position (16px from right edge, vertically centered)
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const defaultLeft = Math.max(16, vw - 316); // 300px width + 16px margin from right
  const defaultTop = Math.max(96, (vh - 280) / 2); // Vertically center the 280px height
  
  return {
    body: '',
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
    fontSizePx: 14,
    folded: false,
    hidden: false,
    posL: defaultLeft,
    posT: defaultTop,
    width: 300,
    height: 280,
    images: []
  };
}

const FONT_OPTIONS = [
  { id: 'system', label: 'System', value: 'ui-sans-serif, system-ui, -apple-system, sans-serif' },
  { id: 'serif', label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { id: 'mono', label: 'Mono', value: '"SF Mono", "Consolas", "Courier New", monospace' },
  { id: 'rounded', label: 'Rounded', value: '"Nunito", "Segoe UI", system-ui, sans-serif' },
  { id: 'hand', label: 'Casual', value: '"Comic Sans MS", "Chalkboard SE", cursive' }
];

const FONT_SIZE_OPTIONS = [11, 12, 13, 14, 15, 16, 18, 20, 22, 24];

function clamp(n, min, max) {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  return Math.min(hi, Math.max(lo, n));
}

async function compressImageFile(file, maxW = 900, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      try {
        let { width, height } = img;
        if (width > maxW) {
          height = (height * maxW) / width;
          width = maxW;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        URL.revokeObjectURL(url);
        resolve(dataUrl);
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('image load failed'));
    };
    img.src = url;
  });
}

function mergeNote(raw) {
  const d = defaultStickyNote();
  if (!raw || typeof raw !== 'object') return d;
  const fontSizePx =
    typeof raw.fontSizePx === 'number' && raw.fontSizePx > 0 ? raw.fontSizePx : d.fontSizePx;
  return {
    ...d,
    ...raw,
    fontSizePx,
    images: Array.isArray(raw.images) ? raw.images : d.images
  };
}

const selectStyle = (borderColor, ink) => ({
  fontSize: 12,
  fontWeight: 600,
  padding: '6px 8px',
  borderRadius: 8,
  border: `1px solid ${borderColor}`,
  background: 'rgba(255,255,255,0.78)',
  color: ink,
  cursor: 'pointer',
  minWidth: 0
});

/**
 * Per-class sticky note: draggable header, fold, resize handle, fonts at bottom.
 */
export default function ClassStickyNote({
  classId,
  className,
  stickyNote,
  classBackgroundColor,
  isDark,
  onPersist
}) {
  const saveTimer = useRef(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  const localRef = useRef(null);
  const [showFontToolbar, setShowFontToolbar] = useState(false);

  const [local, setLocal] = useState(() => {
    // Try to load from localStorage first
    try {
      const saved = localStorage.getItem(`sticky_note_${classId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return mergeNote(parsed);
      }
    } catch (e) {
      console.warn('Failed to load sticky note from localStorage:', e);
    }
    // Fallback to prop data
    return mergeNote(stickyNote);
  });

  useEffect(() => {
    // Only update if localStorage doesn't have data or if stickyNote prop is newer
    try {
      const saved = localStorage.getItem(`sticky_note_${classId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedTime = parsed.__updatedAt || 0;
        const propTime = stickyNote?.__updatedAt || 0;
        
        // Only use prop data if it's newer than localStorage
        if (propTime > savedTime) {
          setLocal(mergeNote(stickyNote));
        }
      } else {
        // No localStorage data, use prop
        setLocal(mergeNote(stickyNote));
      }
    } catch (e) {
      // Fallback to prop data
      setLocal(mergeNote(stickyNote));
    }
  }, [classId, stickyNote]);

  useLayoutEffect(() => {
    localRef.current = local;
  }, [local]);

  const scheduleSave = useCallback(
    (next) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        // Save to localStorage immediately for persistence
        try {
          localStorage.setItem(`sticky_note_${classId}`, JSON.stringify(next));
        } catch (e) {
          console.warn('Failed to save sticky note to localStorage:', e);
        }
        // Also save to backend
        const toSave = { ...next, __updatedAt: Date.now() };
        onPersist?.(toSave);
      }, 650);
    },
    [onPersist, classId]
  );

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const patch = useCallback(
    (partial) => {
      setLocal((prev) => {
        const next = { ...prev, ...partial };
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave]
  );

  const moveOnly = useCallback((posL, posT) => {
    setLocal((prev) => ({ ...prev, posL, posT }));
  }, []);

  const persistPosition = useCallback(
    (posL, posT) => {
      setLocal((prev) => {
        const next = { ...prev, posL, posT };
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave]
  );

  const sizeOnly = useCallback((width, height) => {
    setLocal((prev) => ({ ...prev, width, height }));
  }, []);

  const persistSize = useCallback(
    (width, height) => {
      setLocal((prev) => {
        const next = { ...prev, width, height };
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave]
  );

  const bg = classBackgroundColor || '#FEF9C3';
  const borderColor = isDark ? 'rgba(148,163,184,0.35)' : 'rgba(15,23,42,0.12)';
  const ink = isDark ? '#0f172a' : '#1e293b';
  const paperTint = isDark ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.88)';

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const w = clamp(local.width, 220, Math.min(720, vw - local.posL - 8));
  const h = local.folded ? 48 : clamp(local.height, 160, Math.min(vh - local.posT - 8, 900));

  const computeDragPos = (e) => {
    const d = dragRef.current;
    if (!d) return null;
    const innerVw = window.innerWidth;
    const innerVh = window.innerHeight;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    const maxL = innerVw - d.w - 8;
    const maxT = innerVh - d.h - 8;
    return {
      nl: clamp(d.origL + dx, 8, maxL),
      nt: clamp(d.origT + dy, 8, maxT)
    };
  };

  const onDragHeaderPointerDown = (e) => {
    if (e.button !== 0) return;
    const t = e.target;
    if (t && typeof t.closest === 'function' && t.closest('button')) return;
    const cur = localRef.current;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origL: cur.posL,
      origT: cur.posT,
      w,
      h: local.folded ? 48 : h
    };

    const onMove = (ev) => {
      if (!dragRef.current) return;
      if (ev.buttons === 0) {
        const pos = computeDragPos(ev);
        dragRef.current = null;
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        document.removeEventListener('pointercancel', onUp);
        if (pos) persistPosition(pos.nl, pos.nt);
        return;
      }
      const pos = computeDragPos(ev);
      if (pos) moveOnly(pos.nl, pos.nt);
    };

    const onUp = (ev) => {
      if (!dragRef.current) return;
      const pos = computeDragPos(ev);
      dragRef.current = null;
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onUp);
      if (pos) persistPosition(pos.nl, pos.nt);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onUp);
  };

  /** Bottom handle: vertical drag resizes height (textarea-style). Corner uses diagonal for width + height. */
  const computeResizeSize = (e) => {
    const s = resizeRef.current;
    if (!s) return null;
    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    const innerVw = window.innerWidth;
    const innerVh = window.innerHeight;
    const cur = localRef.current;
    const maxW = Math.min(720, innerVw - cur.posL - 8);
    const maxH = Math.min(900, innerVh - cur.posT - 8);
    if (s.mode === 'corner') {
      return {
        nw: clamp(s.origW + dx, 220, maxW),
        nh: clamp(s.origH + dy, 160, maxH)
      };
    }
    return {
      nw: s.origW,
      nh: clamp(s.origH + dy, 160, maxH)
    };
  };

  const onResizePointerDown = (e, mode) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const cur = localRef.current;
    resizeRef.current = {
      mode: mode === 'corner' ? 'corner' : 'edge',
      startX: e.clientX,
      startY: e.clientY,
      origW: cur.width,
      origH: cur.height
    };

    const onMove = (ev) => {
      if (!resizeRef.current) return;
      if (ev.buttons === 0) {
        const curState = localRef.current;
        resizeRef.current = null;
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        document.removeEventListener('pointercancel', onUp);
        persistSize(curState.width, curState.height);
        return;
      }
      const sz = computeResizeSize(ev);
      if (sz) sizeOnly(sz.nw, sz.nh);
    };

    const onUp = (ev) => {
      if (!resizeRef.current) return;
      const sz = computeResizeSize(ev);
      resizeRef.current = null;
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onUp);
      if (sz) persistSize(sz.nw, sz.nh);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onUp);
  };

  const addImagesFromFiles = async (files) => {
    const list = Array.from(files || []).filter((f) => f.type.startsWith('image/')).slice(0, 6);
    const nextImages = [...(local.images || [])];
    for (const file of list) {
      if (nextImages.length >= 5) break;
      try {
        const dataUrl = await compressImageFile(file);
        if (dataUrl.length > 450_000) continue;
        nextImages.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, dataUrl });
      } catch {
        /* skip */
      }
    }
    patch({ images: nextImages });
  };

  const onPaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const files = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const f = items[i].getAsFile();
        if (f) files.push(f);
      }
    }
    if (files.length) {
      e.preventDefault();
      addImagesFromFiles(files);
    }
  };

  const removeImage = (id) => {
    patch({ images: (local.images || []).filter((im) => im.id !== id) });
  };

  if (typeof document === 'undefined') return null;

  const fontFamilyId = FONT_OPTIONS.find((f) => f.value === local.fontFamily)?.id || 'system';
  const fontSizeVal = FONT_SIZE_OPTIONS.includes(local.fontSizePx)
    ? local.fontSizePx
    : 14;

  const reopen = local.hidden && (
    <button
      type="button"
      onClick={() => patch({ hidden: false, folded: false })}
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: 16,
        zIndex: 2147483640,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '9px 18px',
        borderRadius: 999,
        border: `1px solid ${borderColor}`,
        background: `linear-gradient(135deg, ${paperTint} 0%, ${bg} 100%)`,
        color: ink,
        fontWeight: 800,
        fontSize: 13,
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(15,23,42,0.22), 0 0 0 1px rgba(255,255,255,0.12) inset',
        whiteSpace: 'nowrap',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      <StickyNote size={15} style={{ opacity: 0.75 }} />
      {className || 'Class'} notes
    </button>
  );

  const note = !local.hidden && (
    <div
      style={{
        position: 'fixed',
        left: local.posL,
        top: local.posT,
        width: w,
        minHeight: local.folded ? 48 : undefined,
        height: local.folded ? 48 : h,
        zIndex: 2147483640,
        borderRadius: 14,
        border: `1px solid ${borderColor}`,
        boxShadow: `0 18px 50px rgba(15,23,42,0.2), 0 0 0 1px rgba(255,255,255,0.06) inset`,
        background: `linear-gradient(180deg, ${paperTint} 0%, ${bg} 38%, ${bg} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        touchAction: 'none'
      }}
    >
      <div
        role="presentation"
        onPointerDown={onDragHeaderPointerDown}
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 10px',
          borderBottom: local.folded ? 'none' : `1px solid ${borderColor}`,
          background: 'rgba(255,255,255,0.25)',
          backdropFilter: 'blur(8px)',
          cursor: 'grab',
          userSelect: 'none',
          touchAction: 'none'
        }}
      >
        <StickyNote size={16} style={{ color: ink, opacity: 0.75, flexShrink: 0, pointerEvents: 'none' }} />
        <span
          style={{
            flex: 1,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: ink,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}
        >
          {className || 'Class'} notes
        </span>
        <button
          type="button"
          title={local.folded ? 'Expand' : 'Fold'}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            patch({ folded: !local.folded });
          }}
          style={{
            border: 'none',
            background: 'rgba(15,23,42,0.06)',
            borderRadius: 8,
            padding: 6,
            cursor: 'pointer',
            display: 'flex',
            color: ink
          }}
        >
          {local.folded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <button
          type="button"
          title="Close (reopen from Notes chip)"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            patch({ hidden: true });
          }}
          style={{
            border: 'none',
            background: 'rgba(239,68,68,0.12)',
            borderRadius: 8,
            padding: 6,
            cursor: 'pointer',
            display: 'flex',
            color: '#b91c1c'
          }}
        >
          <X size={16} />
        </button>
      </div>

      {!local.folded && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            padding: '10px 10px 0',
            gap: 8
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {(local.images || []).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, flexShrink: 0 }}>
              {(local.images || []).map((im) => (
                <div key={im.id} style={{ position: 'relative', width: 72, height: 72, borderRadius: 8, overflow: 'hidden', border: `1px solid ${borderColor}` }}>
                  <img src={im.dataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => removeImage(im.id)}
                    style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      border: 'none',
                      background: 'rgba(0,0,0,0.55)',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <textarea
            value={local.body}
            onChange={(e) => patch({ body: e.target.value })}
            onPaste={onPaste}
            placeholder="Lesson plan, reminders…"
            style={{
              flex: 1,
              minHeight: 72,
              resize: 'none',
              border: `1px solid ${borderColor}`,
              borderRadius: 10,
              padding: 10,
              fontSize: local.fontSizePx,
              lineHeight: 1.5,
              fontFamily: local.fontFamily,
              color: ink,
              background: 'rgba(255,255,255,0.55)',
              outline: 'none'
            }}
          />

          {/* Resize: bottom edge = height (textarea-style); corner = width + height */}
          <div
            style={{
              flexShrink: 0,
              position: 'relative',
              marginLeft: -10,
              marginRight: -10,
              height: 16,
              touchAction: 'none',
              userSelect: 'none'
            }}
          >
            <div
              role="separator"
              aria-orientation="horizontal"
              title="Drag to resize height"
              onPointerDown={(e) => onResizePointerDown(e, 'edge')}
              style={{
                position: 'absolute',
                left: 0,
                right: 14,
                top: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'ns-resize',
                borderTop: `1px dashed ${borderColor}`,
                background: 'rgba(255,255,255,0.2)'
              }}
            >
              <GripHorizontal size={18} style={{ color: ink, opacity: 0.45 }} />
            </div>
            <div
              title="Drag to resize width and height"
              onPointerDown={(e) => onResizePointerDown(e, 'corner')}
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: 18,
                height: 16,
                cursor: 'nwse-resize',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                paddingRight: 2,
                paddingBottom: 1
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden style={{ opacity: 0.5, color: ink }}>
                <path
                  fill="currentColor"
                  d="M10 10H6v-1h3V6h1v4zM10 6H8V4h2v2zM6 10H4V8h2v2z"
                />
              </svg>
            </div>
          </div>

          {/* Compact Font Controls */}
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <button
              type="button"
              onMouseEnter={() => setShowFontToolbar(true)}
              onFocus={() => setShowFontToolbar(true)}
              style={{
                width: 24,
                height: 24,
                border: 'none',
                background: isDark ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.9)',
                borderRadius: 4,
                color: ink,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease'
              }}
              title="Font settings"
            >
              <Type size={12} />
            </button>

            {/* Floating Font Toolbar */}
            {showFontToolbar && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 28,
                  left: 0,
                  background: isDark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.95)',
                  border: `1px solid ${borderColor}`,
                  borderRadius: 6,
                  padding: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  backdropFilter: 'blur(8px)',
                  zIndex: 10
                }}
                onMouseEnter={() => setShowFontToolbar(true)}
                onMouseLeave={() => setShowFontToolbar(false)}
              >
                <select
                  value={fontFamilyId}
                  onChange={(e) => {
                    const opt = FONT_OPTIONS.find((f) => f.id === e.target.value);
                    if (opt) patch({ fontFamily: opt.value });
                  }}
                  aria-label="Font family"
                  style={{
                    ...selectStyle(borderColor, ink),
                    fontSize: 11,
                    padding: '2px 6px',
                    minWidth: 70,
                    height: 24
                  }}
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <select
                  value={String(fontSizeVal)}
                  onChange={(e) => patch({ fontSizePx: Number(e.target.value) })}
                  aria-label="Font size"
                  style={{
                    ...selectStyle(borderColor, ink),
                    fontSize: 11,
                    padding: '2px 6px',
                    width: 50,
                    height: 24
                  }}
                >
                  {FONT_SIZE_OPTIONS.map((px) => (
                    <option key={px} value={String(px)}>
                      {px}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(
    <>
      {reopen}
      {note}
    </>,
    document.body
  );
}
