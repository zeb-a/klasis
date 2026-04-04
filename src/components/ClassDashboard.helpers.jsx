/* eslint-disable no-unused-vars */
import React, { useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

// Loading spinner for lazy-loaded components
export const DashboardLoader = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    background: 'transparent'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #4CAF50',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Helper component for Sidebar Icons
export const SidebarIcon = ({ icon: Icon, label, onClick, isActive, badge, style, dataNavbarIcon, variant = 'sidebar', forceLabelRow = false }) => {
  const [hovered, setHovered] = React.useState(false);
  const [dockTipPos, setDockTipPos] = React.useState(null);
  const dockWrapRef = React.useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const actionHintMap = {
    Assignments: 'Create assignments',
    'Inbox / Grading': 'Review submissions',
    'Lucky Draw': 'Pick random students',
    Road: 'See class progress',
    'Attendance': 'Take attendance',
    Reports: 'View class reports',
    'Class Timer': 'Run class timer',
    'Attention Buzzer': 'Get class attention',
    Whiteboard: 'Open whiteboard',
    'Class Tools': 'Customize class tools'
  };
  const dockHint = actionHintMap[label] || label;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(e);
  };

  useLayoutEffect(() => {
    if (variant !== 'dock' || !hovered) {
      setDockTipPos(null);
      return;
    }
    const el = dockWrapRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setDockTipPos({ left: r.left + r.width / 2, top: r.top });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [variant, hovered]);

  if (variant === 'dock') {
    const dockIconPx = 22;
    const dockHitPx = 40;
    return (
      <>
        <div
          ref={dockWrapRef}
          style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: dockHitPx, height: dockHitPx, flexShrink: 0 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div
            onClick={handleClick}
            data-navbar-icon={dataNavbarIcon}
            role="button"
            tabIndex={0}
            aria-label={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: dockHitPx,
              height: dockHitPx,
              borderRadius: 12,
              background: isActive ? '#E8F5E9' : (hovered ? '#F8FAFC' : 'transparent'),
              border: isActive ? '1px solid #4CAF50' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'transform 180ms ease, background 180ms ease, border-color 180ms ease',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              position: 'relative',
              zIndex: hovered ? 2 : 1
            }}
          >
            <Icon size={dockIconPx} style={{ ...style, color: isActive ? '#4CAF50' : style?.color || '#636E72' }} />
          </div>
          {badge && (
            <div style={{ position: 'absolute', top: -2, right: -2, pointerEvents: 'none', zIndex: 2 }}>
              {badge}
            </div>
          )}
        </div>
        {hovered && dockTipPos && createPortal(
          <div
            style={{
              position: 'fixed',
              left: dockTipPos.left,
              top: dockTipPos.top,
              transform: 'translate(-50%, -100%)',
              marginTop: -8,
              padding: '6px 10px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              zIndex: 2147483646,
              pointerEvents: 'none',
              boxShadow: '0 8px 24px rgba(15,23,42,0.25)',
              background: '#1e293b',
              color: '#f8fafc'
            }}
          >
            {dockHint}
          </div>,
          document.body
        )}
      </>
    );
  }

  // Desktop: icon + text inline, Mobile: icon only with tooltip
  if (isMobile && !forceLabelRow) {
    return (
      <div
        style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%', padding: '6px 0', boxSizing: 'border-box' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          onClick={handleClick}
          data-navbar-icon={dataNavbarIcon}
          role="button"
          tabIndex={0}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: 10,
            background: hovered ? '#F8FAFC' : 'transparent',
            boxShadow: hovered ? '0 8px 20px rgba(2,6,23,0.08)' : 'none',
            transform: hovered ? 'translateY(-3px) scale(1.03)' : 'translateY(0) scale(1)',
            transition: 'all 180ms ease',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Icon style={{ ...style, color: isActive ? '#4CAF50' : style?.color || '#636E72' }} />
        </div>
        {badge && (
          <div style={{ position: 'absolute', top: '0', right: '8px', pointerEvents: 'none', zIndex: 2 }}>
            {badge}
          </div>
        )}
        {hovered && (
          <div style={{
            position: 'absolute',
            left: '72px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#2D3436',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '8px',
            zIndex: 2000,
            whiteSpace: 'nowrap',
            fontSize: '14px',
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {label}
          </div>
        )}
      </div>
    );
  } else {
  // Desktop: icon + text inline
  return (
    <div
      style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', padding: '6px 12px', boxSizing: 'border-box' }}
    >
      <div
        onClick={handleClick}
        data-navbar-icon={dataNavbarIcon}
        data-active={isActive ? 'true' : undefined}
        role="button"
        tabIndex={0}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          padding: '10px 14px',
          borderRadius: 10,
          background: isActive ? '#E8F5E9' : (hovered ? '#F8FAFC' : 'transparent'),
          boxShadow: hovered ? '0 4px 12px rgba(2,6,23,0.06)' : 'none',
          transition: 'all 180ms ease',
          cursor: 'pointer',
          border: isActive ? '1px solid #4CAF50' : 'none',
          position: 'relative',
          zIndex: 1
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Icon style={{ ...style, color: isActive ? '#4CAF50' : style?.color || '#636E72', flexShrink: 0 }} />
        <span style={{
          fontSize: '13px',
          fontWeight: 500,
          color: isActive ? '#2E7D32' : '#374151',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {label}
        </span>
      </div>
      {badge && (
        <div style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          zIndex: 2
        }}>
          {badge}
        </div>
      )}
    </div>
  );
  }
};

// Advanced Animated Hamburger Icon Component
export const AnimatedHamburger = ({ isOpen, ...props }) => {
  return (
    <div
      {...props}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        ...props.style
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top line - becomes \ side of X when open */}
        <line
          x1="5"
          y1="6"
          x2="19"
          y2="6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isOpen ? 'translate(0, 6px) rotate(45deg)' : 'translate(0, 0) rotate(0deg)',
            transformOrigin: '12px 6px',
            opacity: 1
          }}
        />
        {/* Middle line - fades out */}
        <line
          x1="5"
          y1="12"
          x2="19"
          y2="12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: isOpen ? 0 : 1
          }}
        />
        {/* Bottom line - becomes / side of X when open */}
        <line
          x1="5"
          y1="18"
          x2="19"
          y2="18"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isOpen ? 'translate(0, -6px) rotate(-45deg)' : 'translate(0, 0) rotate(0deg)',
            transformOrigin: '12px 18px',
            opacity: 1
          }}
        />
      </svg>
    </div>
  );
};

// Reusable icon button with hover tooltip (for header controls)
export const IconButton = React.forwardRef(({ title, onClick, children, style }, ref) => {
  const [hovered, setHovered] = React.useState(false);
  const [tooltipPos, setTooltipPos] = React.useState({ left: 0, top: 0 });
  const localRef = React.useRef(null);

  // support forwarded ref while keeping a local ref for measurements
  const setRefs = (el) => {
    localRef.current = el;
    if (!ref) return;
    if (typeof ref === 'function') ref(el); else ref.current = el;
  };

  const baseStyle = {
    background: '#fff',
    color: '#475569',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0',
    width: 48,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 180ms ease',
    ...style
  };

  const hoverBackground = style?.background ?? '#F8FAFC';
  const hoverStyle = hovered
    ? { background: hoverBackground, transform: 'translateY(-2px)', boxShadow: '0 10px 28px rgba(2,6,23,0.08)' }
    : {};

  const handleMouseEnter = () => {
    const el = localRef.current;
    if (el && el.getBoundingClientRect) {
      const rect = el.getBoundingClientRect();
      setTooltipPos({ left: rect.left + rect.width / 2, top: rect.bottom + 8 });
    }
    setHovered(true);
  };

  const handleMouseLeave = () => setHovered(false);

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        ref={setRefs}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ ...baseStyle, ...hoverStyle }}
      >
        {children}
      </button>
      {hovered && (
        <div style={{
          position: 'fixed',
          left: tooltipPos.left,
          top: tooltipPos.top,
          transform: 'translateX(-50%)',
          background: '#2D3436',
          color: 'white',
          padding: '6px 10px',
          borderRadius: 8,
          zIndex: 99999,
          whiteSpace: 'nowrap',
          fontSize: 12,
          pointerEvents: 'none',
          boxShadow: '0 6px 18px rgba(0,0,0,0.12)'
        }}>{title}</div>
      )}
    </div>
  );
});
