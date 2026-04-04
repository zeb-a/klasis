import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, X, Maximize2, Minimize2 } from 'lucide-react';
import useWindowSize from '../hooks/useWindowSize';

const KidTimer = ({ onComplete, onClose, floating = false, floatingCompact = false, onFloatingStageChange }) => {
  const isMobile = useWindowSize(768);
  const isTablet = useWindowSize(1024);
  const isDesktop = !isMobile && !isTablet;
  const [selectedMinutes, setSelectedMinutes] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mode, setMode] = useState('setup');

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const audioContextRef = useRef(null);
  const animationRef = useRef(null);
  const containerRef = useRef(null);

  const minuteOptions = [1, 2, 3, 5, 10, 30];
  const presetRows = [minuteOptions.slice(0, 3), minuteOptions.slice(3, 6)];

  const clampMinutes = (mins) => Math.max(1, Math.min(240, Number.isFinite(mins) ? mins : 30));
  const [customMinutes, setCustomMinutes] = useState(String(30));

  useEffect(() => {
    // Keep custom input in sync with the selected duration.
    setCustomMinutes(String(selectedMinutes));
  }, [selectedMinutes]);

  // Initialize Web Audio API
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return () => {
      const animationFrame = animationRef.current;
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  const playSound = (frequency = 800, duration = 100, type = 'sine') => {
    if (!audioContextRef.current) return;
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.1;
    const now = audioContextRef.current.currentTime;
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration / 1000);
    oscillator.start(now);
    oscillator.stop(now + duration / 1000);
  };

  // Ticking sound - only for timers under 5 minutes
  useEffect(() => {
    if (isRunning && timeLeft > 0 && selectedMinutes < 5) {
      playSound(800, 30, 'square');
    }
  }, [timeLeft, isRunning, selectedMinutes]);

  // Countdown Logic
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;

          // Warning beeps for short timers (< 5 min): last 10 seconds
          if (newTime <= 10 && newTime > 0 && selectedMinutes < 5) {
            playSound(1000, 200, 'sawtooth');
          }

          // One-time alarm at 1 minute remaining for long timers (≥ 5 min)
          if (newTime === 60 && selectedMinutes >= 5) {
            playSound(1200, 500, 'sine');
          }

          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, selectedMinutes]);

  // Handle timer completion when timeLeft reaches 0
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Clear, noticeable alarm: a short multi-beep sequence.
      try {
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      } catch {
        // ignore vibrate errors
      }
      const alarm = [
        { f: 880, d: 140, t: 'square', wait: 0 },
        { f: 1040, d: 140, t: 'square', wait: 180 },
        { f: 880, d: 220, t: 'sine', wait: 420 }
      ];
      alarm.forEach((p) => {
        window.setTimeout(() => {
          playSound(p.f, p.d, p.t);
        }, p.wait);
      });
      if (onComplete) onComplete();
    }

  }, [timeLeft, isRunning]);

  const selectTime = (mins) => {
    setSelectedMinutes(mins);
    setTimeLeft(mins * 60);
    setMode('running');
    setIsRunning(true);
    onFloatingStageChange?.('running');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode('setup');
    setTimeLeft(selectedMinutes * 60);
    onFloatingStageChange?.('setup');
  };

  const changeDuration = () => {
    // Keep the UI in the "setup" screen without auto-starting.
    setIsRunning(false);
    setMode('setup');
    setTimeLeft(selectedMinutes * 60);
    onFloatingStageChange?.('setup');
  };

  const getUrgencyColor = () => {
    const progress = timeLeft / (selectedMinutes * 60);
    if (progress > 0.5) return { primary: '#6366F1', secondary: '#A5B4FC', glow: 'rgba(99, 102, 241, 0.3)' };
    if (progress > 0.25) return { primary: '#F59E0B', secondary: '#FCD34D', glow: 'rgba(245, 158, 11, 0.3)' };
    return { primary: '#EF4444', secondary: '#FCA5A5', glow: 'rgba(239, 68, 68, 0.3)' };
  };

  const getPhaseText = () => {
    const progress = timeLeft / (selectedMinutes * 60);
    if (progress > 0.5) return 'TIME TO FOCUS';
    if (progress > 0.25) return 'HALF WAY';
    return 'ALMOST DONE!';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSeconds = selectedMinutes * 60;
  const colors = getUrgencyColor();

  if (floating && floatingCompact) {
    const safeTotal = totalSeconds > 0 ? totalSeconds : 1;
    const elapsedDeg = ((safeTotal - timeLeft) / safeTotal) * 360;
    const ringBg = `conic-gradient(${colors.primary} ${elapsedDeg}deg, rgba(148,163,184,0.25) 0deg)`;

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 999,
          background: ringBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isMobile ? '0 18px 45px rgba(0,0,0,0.25)' : '0 22px 55px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          position: 'relative',
          userSelect: 'none'
        }}
      >
        <div
          style={{
            width: '88%',
            height: '88%',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.96)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(15,23,42,0.10)'
          }}
        >
          <div
            style={{
              fontWeight: 950,
              fontVariantNumeric: 'tabular-nums',
              fontSize: isMobile ? 20 : 22,
              color: colors.primary,
              lineHeight: 1.05,
              letterSpacing: '-0.5px'
            }}
          >
            {formatTime(timeLeft)}
          </div>
        </div>

        <button
          type="button"
          data-timer-action
          aria-label={isRunning ? 'Pause timer' : 'Resume timer'}
          onClick={(e) => {
            e.stopPropagation();
            setIsRunning((v) => !v);
          }}
          style={{
            position: 'absolute',
            right: 8,
            bottom: 8,
            width: isMobile ? 30 : 34,
            height: isMobile ? 30 : 34,
            borderRadius: 999,
            border: '1px solid rgba(148,163,184,0.25)',
            background: 'rgba(255,255,255,0.96)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: colors.primary,
            boxShadow: '0 10px 26px rgba(15,23,42,0.12)'
          }}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button
          type="button"
          data-timer-action
          aria-label="Close timer"
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          style={{
            position: 'absolute',
            left: 8,
            top: 8,
            width: isMobile ? 28 : 32,
            height: isMobile ? 28 : 32,
            borderRadius: 999,
            border: '1px solid rgba(148,163,184,0.25)',
            background: 'rgba(255,255,255,0.96)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
            boxShadow: '0 10px 26px rgba(15,23,42,0.12)'
          }}
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  // --- RENDER ---
  return (
    <div
      ref={containerRef}
      className="safe-area-top"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        minHeight: floating ? 'auto' : isFullscreen ? '100vh' : 'auto',
        padding: floating ? '0' : isFullscreen ? '40px 20px' : '0',
        background: isFullscreen
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'transparent',
        transition: 'all 0.3s ease'
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: floating ? '12px' : mode === 'setup' ? '60px' : '20px',
          right: floating ? '12px' : '20px',
          background: isFullscreen ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
  
          borderRadius: '50%',
          padding: '12px',
          cursor: 'pointer',
          color: isFullscreen ? '#fff' : '#64748B',
          transition: 'all 0.2s',
          zIndex: 100
        }}
      >
        <X size={24} />
      </button>

      {/* Fullscreen Toggle (only in running mode) */}
      {mode === 'running' && !floating && (
        <button
          onClick={toggleFullscreen}
          style={{
            position: 'absolute',
            top: '20px',
            right: mode === 'setup' ? '70px' : '70px',
            background: isFullscreen ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
       
            borderRadius: '50%',
            padding: '12px',
            cursor: 'pointer',
            color: isFullscreen ? '#fff' : '#64748B',
            transition: 'all 0.2s',
            zIndex: 100
          }}
        >
          {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
        </button>
      )}
      {/* MODE 1: SETUP (Choose Minutes) */}
      {mode === 'setup' && (
        <div style={{
          animation: 'fadeIn 0.5s',
          width: '100%',
          padding: floating
            ? '52px 14px 24px'
            : (isFullscreen ? '60px 20px' : '40px 20px'),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(30px, 5vw, 50px)',
          minHeight: isFullscreen ? 'calc(100vh - 120px)' : 'auto'
        }}>
          <div style={{
            background: isFullscreen ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: 'clamp(16px, 3vw, 24px) clamp(32px, 6vw, 48px)',
            borderRadius: 'clamp(16px, 3vw, 24px)',
            color: isFullscreen ? '#fff' : '#fff',
            fontWeight: '800',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            whiteSpace: 'nowrap',
            fontSize: 'clamp(18px, 4vw, 24px)',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
          }}>
            <Clock size={isFullscreen ? 40 : 32} color={isFullscreen ? '#fff' : '#fff'} /> CLASS TIMER
          </div>

          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              fontSize: 'clamp(20px, 4vw, 28px)',
              color: isFullscreen ? '#fff' : '#1E293B',
              margin: '0 0 8px 0',
              fontWeight: 800,
              textAlign: 'center',
              letterSpacing: '0.5px'
            }}>
              How long do we focus?
            </h2>
            <p style={{
              fontSize: 'clamp(14px, 3vw, 16px)',
              color: isFullscreen ? 'rgba(255,255,255,0.8)' : '#64748B',
              margin: 0,
              fontWeight: 500
            }}>
              Select a duration to begin
            </p>
          </div>

          <div style={{ width: '100%', maxWidth: 900 }}>
            {presetRows.map((row, rowIdx) => (
              <div
                key={rowIdx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 'clamp(10px, 2vw, 18px)',
                  width: '100%',
                  justifyContent: 'center',
                  marginBottom: rowIdx === presetRows.length - 1 ? 0 : 'clamp(14px, 2.5vw, 18px)'
                }}
              >
                {row.map((mins) => (
                  <button
                    key={mins}
                    onClick={() => selectTime(mins)}
                    className="timer-select-btn"
                    style={{
                      padding: isMobile
                        ? 'clamp(14px, 3.8vw, 20px)'
                        : isTablet
                          ? 'clamp(18px, 4.2vw, 26px)'
                          : 'clamp(22px, 4.8vw, 32px)',
                      borderRadius: isMobile ? 'clamp(12px, 2.8vw, 16px)' : 'clamp(14px, 2.8vw, 20px)',
                      border: 'none',
                      background: isFullscreen ? 'rgba(255,255,255,0.15)' : '#fff',
                      color: isFullscreen ? '#fff' : '#6366F1',
                      fontSize: isMobile
                        ? 'clamp(22px, 5.8vw, 30px)'
                        : isTablet
                          ? 'clamp(24px, 6.2vw, 36px)'
                          : 'clamp(28px, 6.6vw, 44px)',
                      fontWeight: 900,
                      cursor: 'pointer',
                      boxShadow: isFullscreen ? '0 8px 24px rgba(0,0,0,0.2)' : '0 8px 24px rgba(99, 102, 241, 0.15)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ fontSize: 'inherit', fontWeight: 900, lineHeight: 1 }}>{mins}</span>
                    <span style={{
                      fontSize: isMobile ? 'clamp(10px, 2vw, 12px)' : 'clamp(12px, 2.5vw, 14px)',
                      fontWeight: 600,
                      opacity: 0.8,
                      lineHeight: 1,
                      letterSpacing: '1px'
                    }}>MIN</span>
                  </button>
                ))}
              </div>
            ))}

            {/* Custom duration (whatever number): intuitive "type + START" */}
            <div
              style={{
                marginTop: floating ? 14 : 18,
                padding: '14px 12px',
                borderRadius: 18,
                border: isFullscreen ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(99,102,241,0.18)',
                background: isFullscreen ? 'rgba(255,255,255,0.10)' : 'rgba(99,102,241,0.08)',
                boxShadow: isFullscreen ? '0 10px 30px rgba(0,0,0,0.15)' : '0 10px 30px rgba(99,102,241,0.10)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 950, color: isFullscreen ? '#fff' : '#4338ca' }}>Custom minutes</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: isFullscreen ? 'rgba(255,255,255,0.85)' : '#6366F1' }}>1 - 240</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    const n = parseInt(customMinutes || '0', 10);
                    setCustomMinutes(String(clampMinutes((Number.isFinite(n) ? n : 30) - 1)));
                  }}
                  style={{
                    border: 'none',
                    background: 'rgba(255,255,255,0.85)',
                    color: '#4F46E5',
                    borderRadius: 12,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontWeight: 950,
                    boxShadow: '0 8px 24px rgba(79,70,229,0.10)'
                  }}
                  aria-label="decrease custom minutes"
                >
                  -1
                </button>

                <input
                  inputMode="numeric"
                  type="number"
                  min={1}
                  max={240}
                  step={1}
                  value={customMinutes}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setCustomMinutes('');
                      return;
                    }
                    const num = parseInt(val, 10);
                    if (!Number.isNaN(num)) setCustomMinutes(String(clampMinutes(num)));
                  }}
                  onBlur={() => {
                    const num = parseInt(customMinutes || '0', 10);
                    setCustomMinutes(String(clampMinutes(Number.isFinite(num) ? num : 30)));
                  }}
                  style={{
                    width: floating ? 86 : 110,
                    padding: '12px 12px',
                    borderRadius: 14,
                    border: isFullscreen ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(79,70,229,0.22)',
                    outline: 'none',
                    background: '#fff',
                    fontWeight: 950,
                    fontSize: 20,
                    color: '#0f172a',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.06)'
                  }}
                  aria-label="custom minutes"
                />

                <button
                  type="button"
                  onClick={() => {
                    const n = parseInt(customMinutes || '0', 10);
                    setCustomMinutes(String(clampMinutes((Number.isFinite(n) ? n : 30) + 1)));
                  }}
                  style={{
                    border: 'none',
                    background: 'rgba(255,255,255,0.85)',
                    color: '#4F46E5',
                    borderRadius: 12,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontWeight: 950,
                    boxShadow: '0 8px 24px rgba(79,70,229,0.10)'
                  }}
                  aria-label="increase custom minutes"
                >
                  +1
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const num = parseInt(customMinutes || '0', 10);
                    selectTime(clampMinutes(Number.isFinite(num) ? num : 30));
                  }}
                  style={{
                    border: 'none',
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    color: '#fff',
                    borderRadius: 14,
                    padding: '12px 16px',
                    cursor: 'pointer',
                    fontWeight: 950,
                    boxShadow: '0 14px 34px rgba(99,102,241,0.20)'
                  }}
                >
                  START
                </button>
              </div>
            </div>
          </div>

          <style>{`
            .timer-select-btn:hover {
              transform: translateY(-8px) scale(1.02);
              background: ${isFullscreen ? 'rgba(255,255,255,0.25)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'} !important;
              color: #fff !important;
              box-shadow: 0 16px 40px rgba(102, 126, 234, 0.4) !important;
            }
            .timer-select-btn:active {
              transform: translateY(-4px) scale(0.98);
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulse-ring {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.02); }
            }
          `}</style>
        </div>
      )}

      {/* MODE 2: RUNNING (The Big Timer) */}
      {mode === 'running' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(30px, 5vw, 50px)',
          width: '100%',
          maxWidth: isFullscreen ? '100%' : '700px',
          padding: isFullscreen ? '80px 20px' : '60px 20px',
          animation: 'fadeIn 0.5s',
          height: isFullscreen ? 'calc(100vh - 160px)' : 'auto',
          justifyContent: 'center'
        }}>

          {/* Visual Timer Ring with Modern Design */}
          <div style={{
            position: 'relative',
            width: isFullscreen ? 'clamp(300px, 35vw, 500px)' : 'clamp(240px, 45vw, 360px)',
            height: isFullscreen ? 'clamp(300px, 35vw, 500px)' : 'clamp(240px, 45vw, 360px)',
            borderRadius: '50%',
            background: `conic-gradient(${colors.primary} ${((totalSeconds - timeLeft) / totalSeconds) * 360}deg, ${isFullscreen ? 'rgba(255,255,255,0.1)' : '#E2E8F0'} 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isFullscreen
              ? `0 30px 80px ${colors.glow}, 0 0 60px ${colors.glow}`
              : `0 25px 60px -10px ${colors.glow}`,
            transition: 'all 0.5s ease',
            animation:
              !prefersReducedMotion && timeLeft > 0 && isRunning ? 'pulse-ring 2s ease-in-out infinite' : 'none'
          }}>
            {/* Inner Circle */}
            <div style={{
              width: isFullscreen ? 'clamp(260px, 30vw, 440px)' : 'clamp(210px, 40vw, 320px)',
              height: isFullscreen ? 'clamp(260px, 30vw, 440px)' : 'clamp(210px, 40vw, 320px)',
              borderRadius: '50%',
              background: isFullscreen ? 'rgba(255,255,255,0.95)' : '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    
            }}>
              <div style={{
                fontSize: isFullscreen ? 'clamp(64px, 10vw, 120px)' : 'clamp(56px, 12vw, 96px)',
                fontWeight: 900,
                color: colors.primary,
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
                letterSpacing: '-2px'
              }}>
                {formatTime(timeLeft)}
              </div>
              <div style={{
                color: isFullscreen ? '#64748B' : '#94A3B8',
                fontWeight: 700,
                marginTop: '8px',
                fontSize: isFullscreen ? 'clamp(16px, 2.5vw, 24px)' : 'clamp(14px, 3vw, 18px)',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}>
                {timeLeft === 0 ? 'TIME\'S UP!' : getPhaseText()}
              </div>
              {!isRunning && timeLeft > 0 && (
                <div style={{
                  color: isFullscreen ? '#94A3B8' : '#CBD5E1',
                  fontWeight: 600,
                  marginTop: '4px',
                  fontSize: isFullscreen ? 'clamp(14px, 2vw, 18px)' : 'clamp(12px, 2.5vw, 16px)',
                  letterSpacing: '1px'
                }}>
                  PAUSED
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            maxWidth: '500px',
            height: 'clamp(8px, 1.5vw, 12px)',
            background: isFullscreen ? 'rgba(255,255,255,0.2)' : '#E2E8F0',
            borderRadius: '10px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${(timeLeft / totalSeconds) * 100}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              borderRadius: '10px',
              transition: 'width 0.5s ease, background 0.3s ease'
            }} />
          </div>

          {/* Time Remaining Text */}
          <div style={{
            color: isFullscreen ? 'rgba(255,255,255,0.9)' : '#64748B',
            fontWeight: 600,
            fontSize: isFullscreen ? 'clamp(16px, 2.5vw, 20px)' : 'clamp(14px, 2.5vw, 18px)',
            textAlign: 'center',
            letterSpacing: '1px'
          }}>
            {Math.ceil(timeLeft / 60)} minutes remaining
          </div>

          {/* Controls */}
          <div style={{
            display: 'flex',
            gap: 'clamp(16px, 3vw, 24px)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '600px'
          }}>
            <button
              onClick={() => setIsRunning(!isRunning)}
              style={{
                padding: 'clamp(16px, 3.5vw, 24px) clamp(32px, 6vw, 48px)',
                borderRadius: 'clamp(16px, 3vw, 24px)',
                border: 'none',
                background: isRunning
                  ? (isFullscreen ? 'rgba(239, 68, 68, 0.9)' : '#FEF2F2')
                  : (isFullscreen ? 'rgba(255,255,255,0.9)' : '#ECFDF5'),
                color: isRunning
                  ? (isFullscreen ? '#fff' : '#EF4444')
                  : (isFullscreen ? '#6366F1' : '#10B981'),
                fontSize: 'clamp(16px, 3.5vw, 20px)',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: isRunning
                  ? (isFullscreen ? '0 8px 24px rgba(239, 68, 68, 0.4)' : '0 8px 24px rgba(239, 68, 68, 0.15)')
                  : (isFullscreen ? '0 8px 24px rgba(255,255,255,0.3)' : '0 8px 24px rgba(16, 185, 129, 0.15)'),
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
              {isRunning ? 'PAUSE' : 'RESUME'}
            </button>

            <button
              onClick={resetTimer}
              style={{
                padding: 'clamp(16px, 3.5vw, 24px) clamp(24px, 4.5vw, 32px)',
                borderRadius: 'clamp(16px, 3vw, 24px)',
                border: 'none',
                background: isFullscreen ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
                color: isFullscreen ? '#fff' : '#64748B',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 'clamp(14px, 3vw, 18px)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          
              }}
            >
              <RotateCcw size={24} />
              RESET
            </button>

            <button
              onClick={changeDuration}
              style={{
                padding: 'clamp(16px, 3.5vw, 24px) clamp(24px, 4.5vw, 32px)',
                borderRadius: 'clamp(16px, 3vw, 24px)',
                border: 'none',
                background: isFullscreen ? 'rgba(255,255,255,0.2)' : '#EEF2FF',
                color: isFullscreen ? '#fff' : '#4F46E5',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: 'clamp(14px, 3vw, 18px)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isFullscreen ? '0 8px 24px rgba(99,102,241,0.25)' : '0 8px 24px rgba(79,70,229,0.12)'
              }}
            >
              <Clock size={24} />
              CHANGE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KidTimer;