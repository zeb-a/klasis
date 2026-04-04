import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, ChevronDown, Home, Book, Settings, Download, Users, MessageSquare, Award, Gamepad2, Calendar, FileText, Image, Search, Globe, Menu, X, ArrowUp, LogIn, UserPlus, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import HELP_GUIDES from '../help_guides';
import { useTranslation } from '../i18n';

/* ───────────────── Strip all markdown artifacts from text ───────────────── */
function stripMd(s) {
  if (!s) return '';
  return s
    .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .trim();
}

/* ───────────────── Inline markdown → HTML ───────────────── */
function inlineMarkdown(text, codeStyle) {
  if (!text) return '';
  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/(?:^|[^*])\*([^*]+)\*(?=[^*]|$)/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, `<code style="${codeStyle}">$1</code>`);
}

/* ───────────────── Extract snippet around a match ───────────────── */
function getSnippet(body, query, maxLen = 80) {
  if (!body || !query) return '';
  const clean = stripMd(body);
  const lower = clean.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return clean.slice(0, maxLen) + '…';
  const start = Math.max(0, idx - 30);
  const end = Math.min(clean.length, idx + query.length + 50);
  let snippet = (start > 0 ? '…' : '') + clean.slice(start, end) + (end < clean.length ? '…' : '');
  return snippet;
}

function normalizeForSearch(s) {
  return stripMd(String(s || ''))
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildSearchChunks(title, body) {
  const chunks = [];
  const lines = String(body || '').split('\n');

  // Always index title strongly.
  if (title) chunks.push({ text: stripMd(title), weight: 4 });

  for (const raw of lines) {
    const line = stripMd(raw);
    if (!line) continue;
    // Skip pure separators.
    if (/^[-_]{3,}$/.test(line)) continue;

    // Headings get higher weight, then list items, then plain lines.
    const trimmedRaw = String(raw || '').trim();
    const isHeading = /^#{1,6}\s+/.test(trimmedRaw) || /^\*\*[^*]+\*\*$/.test(trimmedRaw);
    const isList = /^[-*]\s+/.test(trimmedRaw) || /^\d+\.\s+/.test(trimmedRaw);
    const weight = isHeading ? 3 : isList ? 2 : 1;
    chunks.push({ text: line, weight });
  }

  return chunks;
}

function normalizeLangCode(code) {
  const raw = String(code || '').trim();
  if (!raw) return 'en';
  return raw.toLowerCase().split(/[-_]/)[0];
}

function isGuideEntry(v) {
  return Boolean(
    v &&
    typeof v === 'object' &&
    typeof v.title === 'string' &&
    typeof v.body === 'string'
  );
}

function isGuideMap(v) {
  if (!v || typeof v !== 'object') return false;
  const entries = Object.values(v);
  return entries.some(isGuideEntry);
}

export default function GuideDocumentation({ onBack, onOpenLogin, onOpenSignup } = {}) {
  const { isDark, switchTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const { lang, setLang } = useTranslation();

  const guideLang = normalizeLangCode(lang || 'en');
  const changeGuideLang = useCallback((code) => {
    setLang?.(normalizeLangCode(code));
  }, [setLang]);

  const [activeSection, setActiveSection] = useState('landing');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef(null);

  /* ── Local mobile detection ── */
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  const searchRef = useRef(null);
  const langRef = useRef(null);

  /* ── Theme ── */
  const t = useMemo(() => ({
    bg: isDark ? '#0b0d10' : '#f7f8fc',
    sidebar: isDark ? '#111318' : '#ffffff',
    sidebarBorder: isDark ? '#1e2028' : '#e5e7eb',
    card: isDark ? '#15171c' : '#ffffff',
    cardBorder: isDark ? '#1e2028' : '#e5e7eb',
    text: isDark ? '#d1d5db' : '#374151',
    textSecondary: isDark ? '#9ca3af' : '#6b7280',
    textMuted: isDark ? '#6b7280' : '#9ca3af',
    heading: isDark ? '#f9fafb' : '#111827',
    border: isDark ? '#1e2028' : '#e5e7eb',
    code: isDark ? '#1e293b' : '#f1f5f9',
    codeText: isDark ? '#e2e8f0' : '#334155',
    accent: '#6366f1',
    accentLight: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)',
    accentBorder: isDark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)',
    hover: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)',
    tableBg: isDark ? '#13151a' : '#fafbfd',
    tableStripe: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
    gradient1: '#6366f1',
    gradient2: isDark ? '#8b5cf6' : '#a78bfa',
    dropdownBg: isDark ? '#1a1c22' : '#ffffff',
    dropdownHover: isDark ? '#22242b' : '#f3f4f6',
    highlight: isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.12)',
  }), [isDark]);

  const codeInlineStyle = `background:${t.code};color:${t.codeText};padding:0.125rem 0.375rem;border-radius:4px;font-size:0.85em;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace`;

  /* ── Section definitions ── */
  const SECTION_ORDER = [
    'landing', 'teacher-portal', 'class-dashboard', 'assignments',
    'inbox', 'games', 'games-config', 'whiteboard', 'access-codes',
    'settings', 'settings-cards', 'lesson-planner', 'student-portal',
    'parent-portal', 'reports', 'Messages & Grading',
        'tornado-game', 'tornado-config',
    'memorymatch-game', 'memorymatch-config',
    'quiz-game', 'quiz-config',
    'faceoff-game', 'faceoff-config',
    'motorace-game', 'motorace-config',
    'horserace-game', 'horserace-config',
    'spelltheword-game', 'spelltheword-config',
  ];

  const SECTION_META = {
    landing:              { icon: Home,           fallback: 'Getting Started' },
    'teacher-portal':     { icon: Settings,       fallback: 'Teacher Portal' },
    'class-dashboard':    { icon: Users,          fallback: 'Class Dashboard' },
    assignments:          { icon: FileText,       fallback: 'Assignments' },
    inbox:                { icon: MessageSquare,  fallback: 'Messages & Grading' },
    'Messages & Grading': { icon: MessageSquare,  fallback: 'Inbox — Review' },
    games:                { icon: Gamepad2,       fallback: 'Games' },
    'games-config':       { icon: Gamepad2,       fallback: 'Games Config' },
    whiteboard:           { icon: Image,          fallback: 'Whiteboard' },
    'access-codes':       { icon: Download,       fallback: 'Access Codes' },
    settings:             { icon: Award,          fallback: 'Settings' },
    'settings-cards':     { icon: Award,          fallback: 'Point Cards' },
    'lesson-planner':     { icon: Calendar,       fallback: 'Lesson Planner' },
    'student-portal':     { icon: Users,          fallback: 'Student Portal' },
    'parent-portal':      { icon: Book,           fallback: 'Parent Portal' },
    reports:              { icon: FileText,       fallback: 'Reports' },
        'tornado-game':       { icon: Gamepad2,       fallback: 'Tornado Game' },
    'tornado-config':     { icon: Gamepad2,       fallback: 'Tornado Setup' },
    'memorymatch-game':   { icon: Gamepad2,       fallback: 'Memory Match' },
    'memorymatch-config': { icon: Gamepad2,       fallback: 'Memory Setup' },
    'quiz-game':          { icon: Gamepad2,       fallback: 'Quiz Game' },
    'quiz-config':        { icon: Gamepad2,       fallback: 'Quiz Setup' },
    'faceoff-game':       { icon: Gamepad2,       fallback: 'Face-Off Game' },
    'faceoff-config':     { icon: Gamepad2,       fallback: 'Face-Off Setup' },
    'motorace-game':      { icon: Gamepad2,       fallback: 'MotoRace Game' },
    'motorace-config':    { icon: Gamepad2,       fallback: 'MotoRace Setup' },
    'horserace-game':     { icon: Gamepad2,       fallback: 'Horse Race Game' },
    'horserace-config':   { icon: Gamepad2,       fallback: 'Horse Race Setup' },
    'spelltheword-game':  { icon: Gamepad2,       fallback: 'Spell the Word' },
    'spelltheword-config':{ icon: Gamepad2,       fallback: 'Spell Setup' },
  };

  const LANGUAGE_LABELS = { en: 'English', zh: '中文', es: 'Español', fr: 'Français' };
  const LANGUAGE_FLAGS  = { en: '🇬🇧', zh: '🇨🇳', es: '🇪🇸', fr: '🇫🇷' };

  /* ── Available languages (only those with content) ── */
  const availableGuideLanguages = useMemo(() => {
    const keys = Object.keys(HELP_GUIDES)
      .filter((k) => isGuideMap(HELP_GUIDES[k]))
      .map(normalizeLangCode);
    return Array.from(new Set(keys));
  }, []);

  /* ── Resolve guide data for current language ── */
  const guidesForLang = useMemo(() => {
    if (isGuideMap(HELP_GUIDES[guideLang])) return HELP_GUIDES[guideLang];
    return HELP_GUIDES.en;
  }, [guideLang]);

  /* ── Navigation ── */
  const navigation = useMemo(() => {
    const localizedIds = Object.keys(guidesForLang || {});
    const allIds = [...SECTION_ORDER, ...localizedIds.filter(id => !SECTION_ORDER.includes(id))];
    const languageLikeKeys = new Set(['en', 'zh', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'ru', 'ar', 'hi']);
    return allIds
      .filter((id) => {
        const normalizedId = normalizeLangCode(id);
        if (languageLikeKeys.has(normalizedId) && id.length <= 5) return false;
        const candidate = guidesForLang[id] || HELP_GUIDES.en[id];
        return isGuideEntry(candidate);
      })
      .map(id => {
        const icon = SECTION_META[id]?.icon || Book;
        const fallback = SECTION_META[id]?.fallback || id;
        const guide = guidesForLang[id] || HELP_GUIDES.en[id];
        const title = stripMd(guide?.title) || fallback;
        const body = guide?.body || '';
        return {
          id, icon,
          title,
          body,
          searchText: `${fallback} ${guide?.title || ''} ${guide?.body || ''}`.toLowerCase(),
          searchChunks: buildSearchChunks(title, body),
        };
      });
  }, [guidesForLang]);

  /* ── Search results with deep autocomplete ── */
  const searchResults = useMemo(() => {
    const rawQ = searchQuery.trim();
    const q = normalizeForSearch(rawQ);
    if (!q || q.length < 2) return [];

    const qTokens = q.split(' ').filter(Boolean);
    const ranked = [];

    for (const item of navigation) {
      for (const chunk of item.searchChunks || []) {
        const norm = normalizeForSearch(chunk.text);
        if (!norm) continue;

        const exactPhrase = norm.includes(q);
        const allTokens = qTokens.every(t => norm.includes(t));
        if (!exactPhrase && !allTokens) continue;

        // Higher score for exact phrase, shorter match distance, and semantically stronger chunks.
        let score = 0;
        if (exactPhrase) score += 200;
        if (allTokens) score += 80;
        score += (chunk.weight || 1) * 20;
        score += Math.max(0, 60 - Math.abs(norm.length - q.length));

        ranked.push({
          id: item.id,
          title: item.title,
          icon: item.icon,
          snippet: chunk.text,
          score
        });
      }
    }

    ranked.sort((a, b) => b.score - a.score);

    // Deduplicate near-identical results per section/snippet pair.
    const seen = new Set();
    const out = [];
    for (const r of ranked) {
      const key = `${r.id}::${normalizeForSearch(r.snippet)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(r);
      if (out.length >= 12) break;
    }
    return out;
  }, [searchQuery, navigation]);

  const filteredNavigation = useMemo(() => {
    const q = normalizeForSearch(searchQuery.trim());
    if (!q || q.length < 2) return navigation;
    const ids = new Set(searchResults.map(r => r.id));
    return navigation.filter(item => ids.has(item.id));
  }, [searchQuery, navigation, searchResults]);

  useEffect(() => {
    if (!filteredNavigation.length) return;
    if (!filteredNavigation.some(item => item.id === activeSection)) {
      setActiveSection(filteredNavigation[0].id);
    }
  }, [filteredNavigation, activeSection]);

  /* ── Close dropdowns on outside click ── */
  useEffect(() => {
    const handleClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangDropdownOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocused(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* ── Scroll to top button ── */
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => setShowScrollTop(el.scrollTop > 400);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

  const selectSearchResult = (id) => {
    setActiveSection(id);
    setSearchQuery('');
    setSearchFocused(false);
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ═══════════════════════  MARKDOWN PARSER  ═══════════════════════ */
  const parseMarkdown = (text) => {
    if (!text) return [];
    const lines = text.split('\n');
    const content = [];
    let currentList = null;
    let i = 0;
    const flushList = () => { if (currentList) { content.push(currentList); currentList = null; } };

    while (i < lines.length) {
      const raw = lines[i];
      const trimmed = raw.trim();
      if (!trimmed) { flushList(); i++; continue; }
      if (/^(\*\s*\*\s*\*[\s*]*|---[\s-]*|___[\s_]*)$/.test(trimmed)) { flushList(); content.push({ type: 'divider' }); i++; continue; }
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) { flushList(); const level = headingMatch[1].length; content.push({ type: level <= 2 ? 'h2' : level === 3 ? 'h3' : 'h4', text: stripMd(headingMatch[2]) }); i++; continue; }
      if (/^\*\*[^*]+\*\*$/.test(trimmed)) { flushList(); content.push({ type: 'h4', text: trimmed.replace(/^\*\*/, '').replace(/\*\*$/, '') }); i++; continue; }
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        flushList();
        const parseRow = (r) => r.split('|').slice(1, -1).map(c => c.trim());
        const headers = parseRow(trimmed); i++;
        if (i < lines.length && /^\|[\s:|-]+\|$/.test(lines[i].trim())) i++;
        const rows = [];
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) { rows.push(parseRow(lines[i].trim())); i++; }
        content.push({ type: 'table', headers, rows }); continue;
      }
      const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (olMatch) { if (!currentList || currentList.type !== 'ordered') { flushList(); currentList = { type: 'ordered', items: [] }; } currentList.items.push(olMatch[2]); i++; continue; }
      const ulMatch = trimmed.match(/^[-*]\s+(.*)$/);
      if (ulMatch && !/^(\*\s*\*\s*\*[\s*]*)$/.test(trimmed)) { if (!currentList || currentList.type !== 'unordered') { flushList(); currentList = { type: 'unordered', items: [] }; } currentList.items.push(ulMatch[1]); i++; continue; }
      const indentMatch = raw.match(/^\s{2,}[-*]\s+(.*)$/);
      if (indentMatch && currentList) { currentList.items.push('  ' + indentMatch[1]); i++; continue; }
      flushList(); content.push({ type: 'paragraph', text: trimmed }); i++;
    }
    flushList();
    return content;
  };

  /* ═══════════════════════  RENDERER  ═══════════════════════ */
  const renderContent = (blocks) => {
    const fmt = (text) => inlineMarkdown(text, codeInlineStyle);
    return blocks.map((block, idx) => {
      switch (block.type) {
        case 'h2': return <h2 key={idx} style={{ fontSize: '1.625rem', fontWeight: 700, color: t.heading, margin: '2.5rem 0 0.75rem', letterSpacing: '-0.01em', lineHeight: 1.3 }}>{block.text}</h2>;
        case 'h3': return <h3 key={idx} style={{ fontSize: '1.25rem', fontWeight: 600, color: t.heading, margin: '2rem 0 0.625rem', lineHeight: 1.35 }}>{block.text}</h3>;
        case 'h4': return <h4 key={idx} style={{ fontSize: '1rem', fontWeight: 600, color: t.text, margin: '1.5rem 0 0.5rem', paddingLeft: '0.75rem', borderLeft: `3px solid ${t.accent}`, lineHeight: 1.4 }}>{block.text}</h4>;
        case 'paragraph': return <p key={idx} style={{ color: t.text, lineHeight: 1.75, marginBottom: '0.875rem', fontSize: '0.9375rem' }} dangerouslySetInnerHTML={{ __html: fmt(block.text) }} />;
        case 'ordered': return (<ol key={idx} style={{ color: t.text, lineHeight: 1.75, marginBottom: '1rem', paddingLeft: '1.75rem', fontSize: '0.9375rem' }}>{block.items.map((item, j) => <li key={j} style={{ marginBottom: '0.375rem', paddingLeft: '0.25rem' }} dangerouslySetInnerHTML={{ __html: fmt(item) }} />)}</ol>);
        case 'unordered': return (<ul key={idx} style={{ color: t.text, lineHeight: 1.75, marginBottom: '1rem', paddingLeft: '1.75rem', fontSize: '0.9375rem', listStyleType: 'disc' }}>{block.items.map((item, j) => { const ind = item.startsWith('  '); return <li key={j} style={{ marginBottom: '0.375rem', paddingLeft: ind ? '1rem' : '0.25rem', listStyleType: ind ? 'circle' : undefined }} dangerouslySetInnerHTML={{ __html: fmt(ind ? item.trim() : item) }} />; })}</ul>);
        case 'table': return (
          <div key={idx} style={{ overflowX: 'auto', marginBottom: '1.25rem', borderRadius: 10, border: `1px solid ${t.border}` }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              {block.headers.some(h => h) && <thead><tr style={{ background: t.tableBg }}>{block.headers.map((h, hi) => <th key={hi} style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontWeight: 600, color: t.heading, borderBottom: `1px solid ${t.border}` }} dangerouslySetInnerHTML={{ __html: fmt(h) }} />)}</tr></thead>}
              <tbody>{block.rows.map((row, ri) => <tr key={ri} style={{ background: ri % 2 ? t.tableStripe : 'transparent' }}>{row.map((cell, ci) => <td key={ci} style={{ padding: '0.5rem 0.75rem', color: t.text, borderBottom: `1px solid ${t.border}` }} dangerouslySetInnerHTML={{ __html: fmt(cell) }} />)}</tr>)}</tbody>
            </table>
          </div>);
        case 'divider': return <hr key={idx} style={{ border: 'none', borderTop: `1px solid ${t.border}`, margin: '2rem 0' }} />;
        default: return null;
      }
    });
  };

  /* ── Current guide ── */
  const currentGuide = guidesForLang[activeSection] || HELP_GUIDES.en[activeSection];
  const sectionCount = navigation.length;
  const currentLangLabel = LANGUAGE_LABELS[guideLang] || guideLang.toUpperCase();
  const currentLangFlag = LANGUAGE_FLAGS[guideLang] || '🌐';

  /* ═══════════════════════  RENDER  ═══════════════════════ */
  return (
    <div data-guide-docs="true" style={{
      height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: t.bg,
      color: t.text, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      position: 'relative',
    }}>

      {/* ═══════════ TOP HEADER ═══════════ */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1rem', height: 52, flexShrink: 0,
        backgroundColor: t.sidebar, borderBottom: `1px solid ${t.sidebarBorder}`,
        zIndex: 10,
      }}>
        {/* Left: Mobile hamburger + Back */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isMobile && (
            <button type="button" onClick={() => setSidebarOpen(o => !o)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 7, borderRadius: 8, border: `1px solid ${t.border}`,
              background: 'transparent', color: t.text, cursor: 'pointer',
            }}>
              {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          )}
          {onBack && (
            <button type="button" onClick={onBack} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 8,
              border: `1px solid ${t.border}`, background: 'transparent',
              color: t.textSecondary, cursor: 'pointer', fontSize: 13, fontWeight: 500,
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = t.text; e.currentTarget.style.borderColor = t.text; }}
            onMouseLeave={e => { e.currentTarget.style.color = t.textSecondary; e.currentTarget.style.borderColor = t.border; }}>
              <ArrowLeft size={14} />
              {!isMobile && 'Back'}
            </button>
          )}
        </div>

        {/* Center: branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: `linear-gradient(135deg, ${t.gradient1}, ${t.gradient2})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 13,
          }}>K</div>
          <span style={{ fontSize: 14, fontWeight: 700, color: t.heading }}>Klasiz.fun Docs</span>
        </div>

        {/* Right: Dark mode + Login + Create Account */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button type="button" onClick={switchTheme} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 7, borderRadius: 8, border: `1px solid ${t.border}`,
            background: 'transparent', color: t.textSecondary, cursor: 'pointer',
            transition: 'color 0.15s',
          }}>
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          {!isMobile && onOpenLogin && (
            <button type="button" onClick={onOpenLogin} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8,
              border: `1px solid ${t.border}`, background: 'transparent',
              color: t.text, cursor: 'pointer', fontSize: 13, fontWeight: 500,
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = t.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
              <LogIn size={14} />
              Log In
            </button>
          )}
          {!isMobile && onOpenSignup && (
            <button type="button" onClick={onOpenSignup} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8, border: 'none',
              background: t.accent, color: '#fff',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              <UserPlus size={14} />
              Create Account
            </button>
          )}
        </div>
      </header>

      {/* ═══════════ BODY (sidebar + content) ═══════════ */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* Mobile sidebar backdrop */}
        {isMobile && sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{
            position: 'fixed', inset: 0, zIndex: 190,
            background: 'rgba(0,0,0,0.45)',
          }} />
        )}

      {/* ═══════════ SIDEBAR ═══════════ */}
      <aside style={{
        width: 290, minWidth: 290, backgroundColor: t.sidebar,
        borderRight: `1px solid ${t.sidebarBorder}`,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        ...(isMobile ? {
          position: 'fixed', top: 52, bottom: 0, left: 0, zIndex: 200,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: sidebarOpen ? '4px 0 24px rgba(0,0,0,0.2)' : 'none',
        } : {}),
      }}>
        {/* Header */}
        <div style={{ padding: '1.75rem 1.5rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${t.gradient1}, ${t.gradient2})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 16,
            }}>K</div>
            <div>
              <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: t.heading, margin: 0, lineHeight: 1.2 }}>Klasiz.fun</h1>
              <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 500 }}>Documentation</span>
            </div>
          </div>

          {/* ── Language selector dropdown ── */}
          <div ref={langRef} style={{ position: 'relative', margin: '1rem 0 0.875rem' }}>
            <button type="button" onClick={() => setLangDropdownOpen(o => !o)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px', borderRadius: 10,
              border: `1px solid ${t.border}`, background: t.card, color: t.text,
              cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'border-color 0.15s',
            }}>
              <Globe size={14} style={{ color: t.accent, flexShrink: 0 }} />
              <span>{currentLangFlag} {currentLangLabel}</span>
              <ChevronDown size={14} style={{ marginLeft: 'auto', color: t.textMuted, transform: langDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>

            {langDropdownOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                marginTop: 4, borderRadius: 10, overflow: 'hidden',
                border: `1px solid ${t.border}`, background: t.dropdownBg,
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }}>
                {availableGuideLanguages.map(code => (
                  <button key={code} type="button"
                    onClick={() => { changeGuideLang(code); setLangDropdownOpen(false); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                      padding: '9px 14px', border: 'none', cursor: 'pointer',
                      background: guideLang === code ? t.highlight : 'transparent',
                      color: guideLang === code ? t.accent : t.text,
                      fontSize: 13, fontWeight: guideLang === code ? 600 : 400,
                      textAlign: 'left', transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => { if (guideLang !== code) e.currentTarget.style.background = t.dropdownHover; }}
                    onMouseLeave={e => { if (guideLang !== code) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{ fontSize: 16 }}>{LANGUAGE_FLAGS[code] || '🌐'}</span>
                    <span>{LANGUAGE_LABELS[code] || code.toUpperCase()}</span>
                    {guideLang === code && <span style={{ marginLeft: 'auto', fontSize: 12 }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Search with autocomplete ── */}
          <div ref={searchRef} style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: t.textMuted, zIndex: 2 }} />
            <input
              type="text" value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search docs everywhere..."
              style={{
                width: '100%', border: `1px solid ${searchFocused ? t.accent : t.border}`,
                background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
                color: t.text, borderRadius: 10, padding: '8px 10px 8px 30px',
                fontSize: 13, outline: 'none', transition: 'border-color 0.15s',
                boxSizing: 'border-box',
              }}
            />
            {/* Autocomplete dropdown */}
            {searchFocused && searchResults.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                marginTop: 4, borderRadius: 10, overflow: 'hidden',
                border: `1px solid ${t.border}`, background: t.dropdownBg,
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)', maxHeight: 320, overflowY: 'auto',
              }}>
                {searchResults.map(result => {
                  const Icon = result.icon;
                  return (
                    <button key={result.id}
                      onMouseDown={(e) => { e.preventDefault(); selectSearchResult(result.id); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '10px 14px', border: 'none', cursor: 'pointer',
                        background: 'transparent', color: t.text,
                        fontSize: 13, textAlign: 'left', transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = t.dropdownHover}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Icon size={14} style={{ marginTop: 2, flexShrink: 0, color: t.accent }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: t.heading, marginBottom: 2 }}>{result.title}</div>
                        <div style={{ fontSize: 11, color: t.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{result.snippet}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {searchFocused && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                marginTop: 4, borderRadius: 10, padding: '14px',
                border: `1px solid ${t.border}`, background: t.dropdownBg,
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                textAlign: 'center', fontSize: 13, color: t.textMuted,
              }}>
                No results for "{searchQuery.trim()}"
              </div>
            )}
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, overflowY: 'auto', paddingBottom: '1rem' }}>
          {filteredNavigation.map(item => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button key={item.id}
                onClick={() => { setActiveSection(item.id); mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); if (isMobile) setSidebarOpen(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '0.625rem',
                  padding: '0.5rem 1.5rem', margin: 0,
                  background: active ? t.accentLight : 'transparent',
                  border: 'none', borderLeft: active ? `3px solid ${t.accent}` : '3px solid transparent',
                  color: active ? t.accent : t.textSecondary,
                  cursor: 'pointer', transition: 'all 0.15s',
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  textAlign: 'left', lineHeight: 1.4,
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = t.hover; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={15} style={{ flexShrink: 0, opacity: active ? 1 : 0.65 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
                {active && <ChevronRight size={14} style={{ marginLeft: 'auto', flexShrink: 0, opacity: 0.6 }} />}
              </button>
            );
          })}
          {filteredNavigation.length === 0 && (
            <div style={{ padding: '1.5rem', color: t.textMuted, fontSize: 13, textAlign: 'center' }}>No results found</div>
          )}
        </nav>

        {/* Footer */}
        <div style={{ padding: '0.75rem 1.5rem', borderTop: `1px solid ${t.sidebarBorder}`, fontSize: 11, color: t.textMuted }}>
          {sectionCount} articles · {availableGuideLanguages.length} languages
        </div>
      </aside>

      {/* ═══════════ MAIN CONTENT ═══════════ */}

      <main ref={mainRef} style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {currentGuide && (
          <div style={{ maxWidth: 760, margin: '0 auto', padding: isMobile ? '1.25rem 1rem 3rem' : '3rem 2.5rem 4rem' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.5rem', fontSize: 13, color: t.textMuted }}>
              <Home size={13} />
              <span>Guide</span>
              <ChevronRight size={12} />
              <span style={{ color: t.accent, fontWeight: 500 }}>{stripMd(currentGuide.title)}</span>
            </div>

            {/* Title card */}
            <div style={{
              background: `linear-gradient(135deg, ${t.gradient1}, ${t.gradient2})`,
              borderRadius: 16, padding: '2rem 2.25rem', marginBottom: '2.25rem',
              color: '#fff', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ position: 'absolute', bottom: -20, left: '40%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
              <h1 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0, lineHeight: 1.25, position: 'relative' }}>
                {stripMd(currentGuide.title)}
              </h1>
              <p style={{ margin: '0.5rem 0 0', fontSize: 14, opacity: 0.85, position: 'relative' }}>
                {currentLangFlag} {currentLangLabel} · {navigation.findIndex(n => n.id === activeSection) + 1} of {sectionCount}
              </p>
            </div>

            {/* Body */}
            <article style={{
              background: t.card, borderRadius: 14,
              border: `1px solid ${t.cardBorder}`, padding: '2rem 2.25rem',
            }}>
              {renderContent(parseMarkdown(currentGuide.body))}
            </article>

            {/* Prev / Next */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', gap: '1rem' }}>
              {(() => {
                const curIdx = navigation.findIndex(n => n.id === activeSection);
                const prev = curIdx > 0 ? navigation[curIdx - 1] : null;
                const next = curIdx < navigation.length - 1 ? navigation[curIdx + 1] : null;
                return (<>
                  {prev ? (
                    <button onClick={() => { setActiveSection(prev.id); scrollToTop(); }} style={{
                      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                      padding: '1rem 1.25rem', borderRadius: 12,
                      border: `1px solid ${t.border}`, background: t.card,
                      cursor: 'pointer', color: t.text, transition: 'border-color 0.15s',
                    }} onMouseEnter={e => e.currentTarget.style.borderColor = t.accent} onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
                      <span style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>← Previous</span>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{prev.title}</span>
                    </button>
                  ) : <div style={{ flex: 1 }} />}
                  {next ? (
                    <button onClick={() => { setActiveSection(next.id); scrollToTop(); }} style={{
                      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                      padding: '1rem 1.25rem', borderRadius: 12,
                      border: `1px solid ${t.border}`, background: t.card,
                      cursor: 'pointer', color: t.text, transition: 'border-color 0.15s',
                    }} onMouseEnter={e => e.currentTarget.style.borderColor = t.accent} onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
                      <span style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Next →</span>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{next.title}</span>
                    </button>
                  ) : <div style={{ flex: 1 }} />}
                </>);
              })()}
            </div>
          </div>
        )}

        {/* Scroll-to-top FAB */}
        {showScrollTop && (
          <button onClick={scrollToTop} style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 40,
            width: 42, height: 42, borderRadius: '50%',
            background: t.accent, color: '#fff', border: 'none',
            cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ArrowUp size={18} />
          </button>
        )}
      </main>
      </div>
    </div>
  );
}
