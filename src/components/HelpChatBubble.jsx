import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageCircle, X, Send, HelpCircle, Layout, ClipboardList, MessageSquare, Settings, QrCode, Presentation, BarChart3, Clock, Siren, Home, BookOpen, Heart, Calendar, Gamepad2, RotateCcw, Trophy, Brain, Zap, Target, Wind, Flame } from 'lucide-react';
import HELP_GUIDES, { parseSections, getMatchingSection, normalizeHelpBody, getHelpEntry } from '../help_guides';
import { useTranslation } from '../i18n';
import { useTheme } from '../ThemeContext';
import { usePageHelp } from '../PageHelpContext';

// ... Keep your PAGE_ICONS and getPageIcon setup exactly as it is ...
const PAGE_ICONS = {
  'landing': Home,
  'teacher-portal': Home,
  'class-dashboard': Layout,
  'assignments': ClipboardList,
  'inbox': MessageSquare,
  'Messages & Grading': MessageSquare,
  'settings': Settings,
  'settings-cards': Settings,
  'access-codes': QrCode,
  'whiteboard': Presentation,
  'parent-portal': Heart,
  'student-portal': BookOpen,
  'reports': BarChart3,
  'timer': Clock,
  'buzzer': Siren,
  'lesson-planner': Calendar,
  'games': Gamepad2,
  'games-config': Settings,
    'tornado-game': RotateCcw,
  'tornado-config': Settings,
  'memorymatch-game': Brain,
  'memorymatch-config': Settings,
  'quiz-game': Target,
  'quiz-config': Settings,
  'faceoff-game': Trophy,
  'faceoff-config': Settings,
  'motorace-game': Zap,
  'motorace-config': Settings,
  'horserace-game': Wind,
  'horserace-config': Settings,
  'spelltheword-game': Flame,
  'spelltheword-config': Settings
};

function getPageIcon(pageId) {
  return PAGE_ICONS[pageId] || HelpCircle;
}

export default function HelpChatBubble() {
  const { pageId } = usePageHelp();
  const { lang } = useTranslation();
  const { isDark } = useTheme();
  
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState(null);
  const [suggestionFocus, setSuggestionFocus] = useState(-1);
  const [showHelpMessage, setShowHelpMessage] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Fallback
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  // Native Framer Motion values for 60fps drag (bypasses React renders)
  const bubbleX = useMotionValue(0);
  const bubbleY = useMotionValue(0);

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const prevPageIdRef = useRef(pageId);
  const panelRef = useRef(null);
  const bubbleRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Load saved position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('chatBubblePosition');
    let initX = 20;
    let initY = window.innerHeight - 65;

    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        initX = Math.min(Math.max(0, parsed.x), window.innerWidth - 45);
        initY = Math.min(Math.max(0, parsed.y), window.innerHeight - 45);
      } catch (e) {
        console.warn('Failed to parse saved position');
      }
    }
    setPosition({ x: initX, y: initY });
  }, []);

  // Sync state changes to hardware accelerated values
  useEffect(() => {
    bubbleX.set(position.x);
    bubbleY.set(position.y);
  }, [position.x, position.y, bubbleX, bubbleY]);

  const handlePointerDown = (e) => {
    if (e.button !== 0) return;
    if (open) setOpen(false); // Auto-close panel before dragging

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const maxX = windowSize.width - 45;
    const maxY = windowSize.height - 45;
    
    // Update framer motion directly. This prevents React from re-rendering the whole tree!
    const nextX = Math.max(0, Math.min(maxX, e.clientX - dragOffset.x));
    const nextY = Math.max(0, Math.min(maxY, e.clientY - dragOffset.y));
    
    bubbleX.set(nextX);
    bubbleY.set(nextY);
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    // Now that the user let go, sync the final position back to React state 
    // so the panel knows where to calculate its placement
    const finalX = bubbleX.get();
    const finalY = bubbleY.get();
    setPosition({ x: finalX, y: finalY });
    localStorage.setItem('chatBubblePosition', JSON.stringify({ x: finalX, y: finalY }));
  };

  const panelPlacement = useMemo(() => {
    const bw = 45; 
    const bh = 45; 
    const gap = 16; 
    const padding = 16; 
    const ww = windowSize.width;
    const wh = windowSize.height;

    const px = position.x;
    const py = position.y;

    const isBottomHalf = (py + bh / 2) > wh / 2;
    const isRightHalf = (px + bw / 2) > ww / 2;

    let top = 'auto', bottom = 'auto', left = 'auto', right = 'auto';
    let transformOrigin = 'center';

    if (isBottomHalf) {
      bottom = `${Math.max(padding, wh - py + gap)}px`;
      transformOrigin = isRightHalf ? 'bottom right' : 'bottom left';
    } else {
      top = `${Math.max(padding, py + bh + gap)}px`;
      transformOrigin = isRightHalf ? 'top right' : 'top left';
    }

    if (isRightHalf) {
      right = `${Math.max(padding, ww - px - bw)}px`;
    } else {
      left = `${Math.max(padding, px)}px`;
    }

    return { top, bottom, left, right, transformOrigin };
  }, [position, windowSize]);

  // Tooltip should follow the bubble and choose a side dynamically.
  const tooltipLeft = useTransform(bubbleX, (x) => {
    const bubbleCenterX = x + 32;
    const isRightHalf = bubbleCenterX > windowSize.width / 2;
    const raw = isRightHalf ? x - 10 : x + 74;
    return clamp(raw, 12, windowSize.width - 12);
  });
  const tooltipTop = useTransform(bubbleY, (y) => {
    const bubbleCenterY = y + 32;
    const isTopHalf = bubbleCenterY < windowSize.height / 2;
    const raw = isTopHalf ? y + 32 : y + 20;
    return clamp(raw, 12, windowSize.height - 12);
  });

  const entry = useMemo(() => {
    if (!pageId) return null;
    return getHelpEntry(HELP_GUIDES, lang, pageId);
  }, [pageId, lang]);

  const allSections = useMemo(() => {
    if (!pageId || pageId === 'landing') {
      const allGuides = HELP_GUIDES[lang] || {};
      let combinedSections = [];
      for (const guide of Object.values(allGuides)) {
        combinedSections = combinedSections.concat(parseSections(guide));
      }
      return combinedSections;
    }
    return entry ? parseSections(entry) : [];
  }, [pageId, lang, entry]);

  const sections = useMemo(() => {
    if (!pageId || pageId === 'landing') return allSections;
    return entry ? parseSections(entry) : [];
  }, [pageId, lang, entry, allSections]);

  const suggestions = useMemo(() => {
    const filteredTitles = sections.map(s => s.title).filter(title => {
      const lowerTitle = title.toLowerCase();
      return !lowerTitle.includes('setup guide') &&
             !lowerTitle.includes('how to play') &&
             !lowerTitle.includes('how to manage');
    });
    return filteredTitles.slice(0, 12);
  }, [sections]);

  const filteredSuggestions = useMemo(() => {
    if (!input.trim()) return suggestions;
    const q = input.toLowerCase();
    return suggestions.filter(s => s.toLowerCase().includes(q));
  }, [suggestions, input]);

  useEffect(() => {
    if (pageId && pageId !== prevPageIdRef.current) {
      setShowHelpMessage(true);
      const timer = setTimeout(() => setShowHelpMessage(false), 2000);
      prevPageIdRef.current = pageId;
      return () => clearTimeout(timer);
    }
  }, [pageId]);

  useEffect(() => {
    if (open) setAnswer(null);
  }, [open]);

  useEffect(() => {
    if (suggestionFocus >= 0 && listRef.current) {
      const el = listRef.current.children[suggestionFocus];
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [suggestionFocus, filteredSuggestions.length]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!pageId && !allSections.length) return null;

  const showSection = (section) => {
    setAnswer(section);
    setInput('');
    setSuggestionFocus(-1);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const q = (input || '').trim();
    if (!q) return;
    setInput('');
    setSuggestionFocus(-1);

    let match = null;
    const searchSections = (!pageId || pageId === 'landing') ? allSections : sections;
    const normalizedQuery = q.toLowerCase();

    if (searchSections.length > 0) {
      const exactMatch = searchSections.find(
        (s) =>
          s.title.toLowerCase() === normalizedQuery ||
          normalizedQuery.includes(s.title.toLowerCase())
      );
      if (exactMatch) {
        match = exactMatch;
      } else {
        const tempEntry = {
          body: searchSections.map((s) => `### ${s.title}\n${s.body}`).join('\n\n---\n\n')
        };
        match = getMatchingSection(tempEntry, normalizedQuery);
      }
    }
    setAnswer(match || entry);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
      setSuggestionFocus(-1);
      return;
    }
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSuggestionFocus(prev => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSuggestionFocus(prev => (prev <= 0 ? filteredSuggestions.length - 1 : prev - 1));
    }
    if (e.key === 'Enter' && suggestionFocus >= 0 && filteredSuggestions[suggestionFocus]) {
      e.preventDefault();
      const title = filteredSuggestions[suggestionFocus];
      const section = sections.find(s => s.title === title);
      if (section) showSection(section);
      setSuggestionFocus(-1);
    }
  };

  const Icon = getPageIcon(pageId);

  const bubbleBg = isDark
    ? 'linear-gradient(145deg, rgba(139, 92, 246, 0.9) 0%, rgba(34, 211, 238, 0.85) 100%)'
    : 'linear-gradient(145deg, rgba(139, 92, 246, 0.95) 0%, rgba(34, 211, 238, 0.9) 100%)';
  const panelBg = isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.88)';
  const glassBorder = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.6)';
  const glow = '0 0 40px rgba(139, 92, 246, 0.35), 0 0 80px rgba(34, 211, 238, 0.2)';

  const bubbleContent = (
    <>
      {/* 1. The Bubble Button - Now using x and y for hardware acceleration */}
      <motion.button
        ref={bubbleRef}
        aria-label="Help"
        onClick={() => { if (!isDragging) setOpen(!open); }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          position: 'fixed',
          left: 0,        // Pinned to top left, movement is handled by translate
          top: 0,
          x: bubbleX,     // Motion Value connected!
          y: bubbleY,     // Motion Value connected!
          width: 45,
          height: 45,
          borderRadius: '50%',
          border: `2px solid ${glassBorder}`,
          background: bubbleBg,
          color: '#fff',
          boxShadow: glow,
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 9998,
          touchAction: 'none' 
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={isDragging ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 18 }}
        whileHover={{ scale: isDragging ? 1 : 1.08 }}
        whileTap={{ scale: isDragging ? 1 : 0.96 }}
      >
        <motion.span
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, repeatDelay: 2.2, duration: 0.5, ease: 'easeInOut' }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <MessageCircle size={21} strokeWidth={2} />
        </motion.span>
      </motion.button>

      {/* 2. The Smart Tooltip */}
      {!open && showHelpMessage && (
        <motion.div
          style={{
            position: 'fixed',
            left: tooltipLeft,
            top: tooltipTop,
            transform: 'translate(0, -50%)',
            zIndex: 9999,
            background: panelBg,
            color: isDark ? '#f4f4f5' : '#1E293B',
            padding: '12px 18px',
            borderRadius: 20,
            boxShadow: glow,
            border: `1px solid ${glassBorder}`,
            fontSize: 14,
            fontWeight: 700,
            maxWidth: 220,
            pointerEvents: 'none',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          ✨ I can help!
        </motion.div>
      )}

      {/* 3. The Smart Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed',
              top: panelPlacement.top,
              bottom: panelPlacement.bottom,
              left: panelPlacement.left,
              right: panelPlacement.right,
              transformOrigin: panelPlacement.transformOrigin,
              zIndex: 9999,
              width: 'min(420px, calc(100vw - 32px))',
              maxHeight: 'min(75vh, 560px)',
              background: panelBg,
              borderRadius: 28,
              boxShadow: glow,
              border: `1px solid ${glassBorder}`,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '18px 20px',
              borderBottom: `1px solid ${glassBorder}`,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.08)'
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 16,
                background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.4) 0%, rgba(34, 211, 238, 0.35) 100%)',
                border: `1px solid ${glassBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
              }}>
                <Icon size={24} strokeWidth={2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: isDark ? '#a5b4fc' : '#6366f1', fontWeight: 700 }}>
                  Help for this page
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#fff' : '#1E293B' }}>
                  {answer?.title || entry?.title || 'Help'}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  padding: 10, borderRadius: 14, border: `1px solid ${glassBorder}`,
                  background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)',
                  color: isDark ? '#f4f4f5' : '#64748B', cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Area */}
            <div style={{
              flex: 1, overflow: 'auto', padding: 16,
              display: 'flex', flexDirection: 'column', gap: 12
            }}>
              {!answer ? (
                <>
                  <p style={{ fontSize: 13, color: isDark ? '#a1a1aa' : '#64748B', margin: 0 }}>
                    Ask something or pick a topic:
                  </p>
                  {filteredSuggestions.length > 0 && (
                    <div ref={listRef} style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      {filteredSuggestions.map((s, i) => (
                        <button
                          key={i} type="button"
                          onClick={() => { const section = sections.find(sec => sec.title === s); if (section) showSection(section); }}
                          style={{
                            padding: '10px 14px', borderRadius: 14,
                            border: `1px solid ${suggestionFocus === i ? (isDark ? 'rgba(139, 92, 246, 0.6)' : 'rgba(139, 92, 246, 0.4)') : glassBorder}`,
                            background: suggestionFocus === i
                              ? (isDark ? 'rgba(139, 92, 246, 0.35)' : 'rgba(139, 92, 246, 0.12)')
                              : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)'),
                            color: isDark ? '#f4f4f5' : '#334155', fontSize: 12, fontWeight: 600,
                            cursor: 'pointer', textAlign: 'left', maxWidth: '100%'
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="help-chat-markdown" style={{ fontSize: 14, lineHeight: 1.65, color: isDark ? '#d4d4d8' : '#475569' }}>
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => <h1 style={{ margin: '12px 0 8px', fontSize: 16, fontWeight: 800, color: isDark ? '#fff' : '#1E293B' }}>{children}</h1>,
                      h2: ({ children }) => <h2 style={{ margin: '12px 0 6px', fontSize: 15, fontWeight: 700, color: isDark ? '#f4f4f5' : '#334155' }}>{children}</h2>,
                      h3: ({ children }) => <h3 style={{ margin: '10px 0 4px', fontSize: 14, fontWeight: 700, color: isDark ? '#e5e5e5' : '#475569' }}>{children}</h3>,
                      p: ({ children }) => <p style={{ margin: '6px 0' }}>{children}</p>,
                      ul: ({ children }) => <ul style={{ margin: '6px 0', paddingLeft: 20 }}>{children}</ul>,
                      ol: ({ children }) => <ol style={{ margin: '6px 0', paddingLeft: 20 }}>{children}</ol>,
                      li: ({ children }) => <li style={{ margin: '4px 0' }}>{children}</li>,
                      strong: ({ children }) => <strong style={{ fontWeight: 700, color: isDark ? '#f4f4f5' : '#1E293B' }}>{children}</strong>,
                      table: ({ children }) => <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, margin: '8px 0' }}>{children}</table>,
                      th: ({ children }) => <th style={{ padding: '8px 10px', textAlign: 'left', borderBottom: `2px solid ${isDark ? 'rgba(255,255,255,0.2)' : '#E2E8F0'}` }}>{children}</th>,
                      td: ({ children }) => <td style={{ padding: '8px 10px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>{children}</td>,
                      hr: () => <hr style={{ border: 'none', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}`, margin: '12px 0' }} />
                    }}
                  >
                    {normalizeHelpBody(answer.body)}
                  </Markdown>
                  <button
                    type="button" onClick={() => setAnswer(null)}
                    style={{
                      marginTop: 14, padding: '10px 16px', borderRadius: 14, border: `1px solid ${glassBorder}`,
                      background: isDark ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.1)',
                      color: isDark ? '#c4b5fd' : '#6366f1', fontSize: 12, fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    ✨ Ask another question
                  </button>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} style={{
              padding: 14, borderTop: `1px solid ${glassBorder}`, display: 'flex', gap: 10, alignItems: 'center',
              background: isDark ? 'rgba(0,0,0,0.15)' : 'rgba(248,250,252,0.8)'
            }}>
              <input
                ref={inputRef} type="text" value={input}
                onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Ask about this page..."
                style={{
                  flex: 1, padding: '14px 18px', borderRadius: 16, border: `1px solid ${glassBorder}`,
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)',
                  color: isDark ? '#f4f4f5' : '#1A1A1A', fontSize: 14, outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: 14, borderRadius: 16, border: `1px solid ${glassBorder}`,
                  background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.9) 0%, rgba(34, 211, 238, 0.85) 100%)',
                  color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.35)'
                }}
              >
                <Send size={18} strokeWidth={2} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return typeof document !== 'undefined' ? createPortal(bubbleContent, document.body) : null;
}