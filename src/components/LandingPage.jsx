import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, GaugeCircle, Dices, BarChart3, Ghost, ClipboardList, QrCode, Timer, Bell, Layout, Settings, Heart, BookOpen, Star, GraduationCap, Users, MessageSquare, Trophy, MoreVertical, LogIn, Sparkles, Quote } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../i18n';
import api from '../services/api';
import ParentPortal from './ParentPortal';
import StudentPortal from './StudentPortal';
// --- THE LOGO COMPONENT ---
import ClassABCLogo from './ClassABCLogo';
import GoogleLoginButton from './GoogleLoginButton';
import OAuthButton from './OAuthButton';
import './LandingPage.css';
import useWindowSize from '../hooks/useWindowSize';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import HelpChatBubble from './HelpChatBubble';
import DonateOverlay from './DonateOverlay';

// Small motion-enabled card wrapper. Uses motion values to create a subtle
// tilt + scale on pointer move. Respects prefers-reduced-motion.
function MotionCard({ children, className, style, ...props }) {
  const shouldReduce = useReducedMotion();
  // Dev override: set `VITE_FORCE_MOTION=true` when running the dev server to force animations.
  const forceMotion = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FORCE_MOTION === 'true';

  // Hooks must run unconditionally. Call all hooks first, then return early if reduced-motion is set.
  const [hovered, setHovered] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  // Slightly snappier springs for a faster response and quicker settle
  const springX = useSpring(mx, { stiffness: 300, damping: 30 });
  const springY = useSpring(my, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);
  const scale = useTransform(hovered, [false, true], [1, 1.02]);

  if (shouldReduce && !forceMotion) {
    return (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    );
  }

  function handlePointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    mx.set(x - 0.5);
    my.set(y - 0.5);
  }

  function handlePointerEnter() {
    setHovered(true);
  }

  function handlePointerLeave() {
    setHovered(false);
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      className={className}
      style={{
        ...style,
        rotateX,
        rotateY,
        scale,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
      }}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Motion-enabled button to animate hover/press with same spring behavior.
function MotionButton({ children, className, style, ...props }) {
  const shouldReduce = useReducedMotion();
  // Hooks first
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  // Softer springs for smoother hover/settle
  const sx = useSpring(mx, { stiffness: 220, damping: 24 });
  const sy = useSpring(my, { stiffness: 220, damping: 24 });

  const rotateY = useTransform(sx, (v) => v * 6);
  const rotateX = useTransform(sy, (v) => -v * 6);
  const scale = useTransform(sx, (v) => 1 + Math.min(0.025, Math.abs(v) * 0.025));

  if (shouldReduce) {
    return (
      <button className={className} style={style} {...props}>
        {children}
      </button>
    );
  }

  const moveRafRef = useRef(0);
  const handlePointerMove = (e) => {
    if (e.pointerType === 'touch') return;
    const el = e.currentTarget;
    const cx = e.clientX;
    const cy = e.clientY;
    if (moveRafRef.current) return;
    moveRafRef.current = requestAnimationFrame(() => {
      moveRafRef.current = 0;
      const rect = el.getBoundingClientRect();
      const w = rect.width || 1;
      const h = rect.height || 1;
      mx.set((cx - rect.left) / w - 0.5);
      my.set((cy - rect.top) / h - 0.5);
    });
  };

  const handlePointerLeave = () => {
    if (moveRafRef.current) {
      cancelAnimationFrame(moveRafRef.current);
      moveRafRef.current = 0;
    }
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.button
      className={className}
      style={{ ...style, rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
      whileHover={{ scale: 1.06 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Check if running in Capacitor (mobile app)
const isCapacitorApp = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();

export default function LandingPage({ onLoginSuccess, classes, setClasses, refreshClasses, showSearchGuide, openModal, onShowPrivacy, onShowTerms, onShowAbout, onShowFAQ, onShowGuide }) {

  // For Capacitor app, default to showing role selection modal
  const [modalMode, setModalMode] = useState(isCapacitorApp ? 'role' : null); // 'role', 'login', 'signup', 'student-login'
  const [modalHistory, setModalHistory] = useState([]); // Track navigation history for swipe-back
  const [portalView, setPortalView] = useState(null); // 'parent' or 'student'
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const isMobile = useWindowSize(768);

  // Navigate with history tracking for swipe-back
  const navigateModal = (newMode) => {
    if (newMode !== modalMode) {
      setModalHistory(prev => [...prev, newMode]);
      setModalMode(newMode);
      window.history.pushState(
        { ...window.history.state, landingModal: newMode },
        '',
        window.location.hash
      );
    }
  };

  // Go back in modal history
  const goBackModal = () => {
    if (modalHistory.length > 0) {
      const newHistory = modalHistory.slice(0, -1);
      const previousMode = newHistory.length > 0 ? newHistory[newHistory.length - 1] : null;
      setModalHistory(newHistory);
      setModalMode(previousMode);
      window.history.pushState(
        { ...window.history.state, landingModal: previousMode },
        '',
        window.location.hash
      );
    }
  };

  // Listen for browser back events on landing page
  useEffect(() => {
    const handlePopState = (event) => {
      const state = event.state;

      if (state && state.landingModal) {
        // Handle modal navigation back
        goBackModal();
      } else if (modalMode) {
        // Close modal if no modal state in history
        setModalMode(null);
        setModalHistory([]);
        window.history.replaceState(
          { ...window.history.state, landingModal: null },
          '',
          window.location.hash
        );
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [modalMode, modalHistory]);

  // Use theme from ThemeContext
  const { isDark, switchTheme } = useTheme();

  // Teacher Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Student/Parent Access State
  const [accessCode, setAccessCode] = useState('');
  const [studentData, setStudentData] = useState(null);

  // UI State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [oauthLoading, setOAuthLoading] = useState(null); // 'azure' | null

  // Forgot Password State
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Mobile menu state
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Donate overlay state
  const [showDonateOverlay, setShowDonateOverlay] = useState(false);

  // Translation hook must be called unconditionally at top-level
  const { t } = useTranslation();

  React.useEffect(() => {
    if (openModal === 'signup') navigateModal('signup');
    if (openModal === 'login') navigateModal('login');
  }, [openModal]);

  // Check if user just verified email and show login modal with success message
  React.useEffect(() => {
    const emailVerified = localStorage.getItem('email_verified');
    if (emailVerified === 'true') {
      // Clear the flag
      localStorage.removeItem('email_verified');
      // Set success message
      setError('Email verified successfully! Please log in to continue.');
      // Open login modal
      setModalMode('login');
      // Clear error after 5 seconds
      setTimeout(() => setError(''), 5000);
    }
  }, []);

  // Open login/signup modal when navigating from guide page
  React.useEffect(() => {
    const modal = localStorage.getItem('guide_open_modal');
    if (modal === 'login') {
      localStorage.removeItem('guide_open_modal');
      setModalMode('login');
    } else if (modal === 'signup') {
      localStorage.removeItem('guide_open_modal');
      setModalMode('signup');
    }
  }, []);

  // Check if user just reset password and show login modal with success message
  React.useEffect(() => {
    const showLoginModal = localStorage.getItem('show_login_modal');
    if (showLoginModal === 'true') {
      // Clear the flag
      localStorage.removeItem('show_login_modal');
      // Set success message
      setError('Password reset successful! Please log in with your new password.');
      // Open login modal directly (skip role selection)
      setModalMode('login');
      // Clear error after 5 seconds
      setTimeout(() => setError(''), 5000);
    }
  }, []);

  // Handle QR code auto-login from URL hash
  React.useEffect(() => {
    const hash = window.location.hash;
    
    // Check for parent-login/{code}
    const parentMatch = hash.match(/#\/parent-login\/([^/]+)/);
    if (parentMatch && parentMatch[1]) {
      setAccessCode(parentMatch[1]);
      // Auto-trigger parent login
      const handleParentAutoLogin = async () => {
        try {
          const data = await api.getStudentByParentCode(parentMatch[1]);
          if (data) {
            setPortalView('parent');
            setStudentData(data);
            // Clear hash after successful login
            window.location.hash = '';
          } else {
            setError('Invalid Parent Access Code');
            setModalMode('role');
          }
        } catch (err) {
          setError('Connection error. Please try again.');
          setModalMode('role');
        }
      };
      handleParentAutoLogin();
      return;
    }

    // Check for student-login/{code}
    const studentMatch = hash.match(/#\/student-login\/([^/]+)/);
    if (studentMatch && studentMatch[1]) {
      const code = studentMatch[1];
      setAccessCode(code);
      // Auto-trigger student login
      const cleanCode = code.replace(/[^0-9]/g, '');
      if (cleanCode.length === 5) {
        const handleStudentAutoLogin = async () => {
          try {
            let foundStudent = null;
            let foundClass = null;

            // Check local classes first
            if (classes && classes.length > 0) {
              for (const c of classes) {
                const s = c.students?.find(stud => String(stud.accessCode) === cleanCode);
                if (s) {
                  foundStudent = s;
                  foundClass = c;
                  break;
                }
              }
            }

            // If not found locally, ask the API
            if (!foundStudent) {
              const remoteData = await api.getStudentByCode(cleanCode, 'student');
              if (remoteData) {
                foundStudent = {
                  id: remoteData.studentId,
                  name: remoteData.studentName,
                  accessCode: cleanCode
                };
                if (remoteData.classData) {
                  foundClass = remoteData.classData;
                  if (setClasses) {
                    setClasses([remoteData.classData]);
                  }
                }
              }
            }

            if (foundStudent && foundClass) {
              const sessionData = {
                studentId: String(foundStudent.id),
                studentName: foundStudent.name,
                accessCode: cleanCode,
                classId: String(foundClass.id)
              };
              localStorage.setItem('classABC_student_portal', JSON.stringify(sessionData));
              setModalMode(null);
              setPortalView('student');
              // Clear hash after successful login
              window.location.hash = '';
            } else {
              setError('Invalid Student Access Code');
              setModalMode('role');
            }
          } catch (err) {
            setError('Connection error. Please try again.');
            setModalMode('role');
          }
        };
        handleStudentAutoLogin();
      }
    }
  }, [classes, setClasses]);

  // Listen for guide action events
  React.useEffect(() => {
    const handleGuideAction = (e) => {
      const action = e.detail;
      switch(action) {
        case 'signup':
          setModalMode('signup');
          break;
        case 'login':
          setModalMode('role');
          break;
        case 'home':
        case 'dashboard':
        case 'settings':
        case 'attendance':
        case 'assignments':
        case 'luckydraw':
        case 'road':
        case 'whiteboard':
        case 'timer':
        case 'buzzer':
        case 'codes':
        case 'inbox':
        case 'reports':
          // These require logged-in user, just show login role selection
          setModalMode('role');
          break;
      }
    };

    window.addEventListener('guide-action', handleGuideAction);
    return () => window.removeEventListener('guide-action', handleGuideAction);
  }, []);

  // --- 1. TEACHER AUTH HANDLERS ---
  const handleTeacherLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!email || !password) {
      setLoading(false);
      return setError('Please enter both email and password.');
    }
    try {
      const resp = await api.login({ email, password });
      if (resp.token) {
        api.setToken(resp.token);
        onLoginSuccess({ ...resp.user, token: resp.token });
      }
    } catch (err) {
      // Provide better error messages
      let errorMsg = err.message || 'Login failed. Please try again.';
      let showResendButton = false;
      if (errorMsg.includes('verify') || errorMsg.includes('403')) {
        errorMsg = 'Please verify your email before logging in. Check your inbox for the verification link.';
        showResendButton = true;
      } else if (errorMsg.includes('authenticate') || errorMsg.includes('Invalid')) {
        errorMsg = 'Invalid email or password. Please try again.';
      } else if (errorMsg.includes('not found')) {
        errorMsg = 'Account not found. Please check your email or sign up.';
      }
      setError({ message: errorMsg, showResendButton });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await api.requestVerification(email);
      setError({ message: 'Verification email sent! Please check your inbox.', showResendButton: true });
      setTimeout(() => setError(''), 5000);
    } catch (err) {
      setError({ message: 'Failed to resend verification email. Please try again later.', showResendButton: true });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (password !== confirmPassword) {
      setLoading(false);
      return setError('Passwords do not match. Please check again New Teacher.');
    }
    if (!email || !password || !name) {
      setLoading(false);
      return setError('Please fill in all required fields.');
    }
    if (password.length < 8) {
      setLoading(false);
      return setError('Password must be at least 8 characters long.');
    }
    if (!agreedToTerms) {
      setLoading(false);
      return setError(t('auth.agree_error'));
    }
    try {
      await api.register({ email, password, name, title });
      navigateModal('verify-email-info');
    } catch (err) {
      // Provide better error messages
      let errorMsg = err.message || 'Registration failed. Please try again.';
      if (errorMsg.includes('already registered') || errorMsg.includes('not_unique')) {
        setError('This email is already registered. Please log in instead.');
        // Automatically switch to login after a short delay
        setTimeout(() => {
          setError(null);
          navigateModal('login');
        }, 2000);
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const resp = await api.loginWithGoogle();
      if (resp?.token) {
        api.setToken(resp.token);
        onLoginSuccess({ ...resp.user, token: resp.token });
      }
    } catch (err) {
      setError(err?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAzureLogin = async () => {
    setError('');
    setOAuthLoading('azure');
    try {
      const resp = await api.loginWithMicrosoft();
      if (resp?.token) {
        api.setToken(resp.token);
        onLoginSuccess({ ...resp.user, token: resp.token });
      }
    } catch (err) {
      setError(err?.message || 'Azure AD sign-in failed. Please try again.');
    } finally {
      setOAuthLoading(null);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.forgotPassword(resetEmail);
      setResetSuccess(true);
    } catch (err) {
      setError('Could not send reset email. ' + (err.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // --- 2. STUDENT LOGIN HANDLER (THE FIX) ---
  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setError('');
    // Normalize code input
    const cleanCode = accessCode.replace(/[^0-9]/g, '');

    if (cleanCode.length < 5) return setError('Enter 5-digit code.');
    setLoading(true);

    try {
      // Step A: Check local classes prop first (Fastest)
      let foundStudent = null;
      let foundClass = null;

      if (classes && classes.length > 0) {
        for (const c of classes) {
          const s = c.students?.find(stud => String(stud.accessCode) === cleanCode);
          if (s) {
            foundStudent = s;
            foundClass = c;
            break;
          }
        }
      }

      // Step B: If not found locally, ask the API (Crucial for fresh devices)
      if (!foundStudent) {
        const remoteData = await api.getStudentByCode(cleanCode, 'student');
        if (remoteData) {
          foundStudent = {
            id: remoteData.studentId,
            name: remoteData.studentName,
            accessCode: cleanCode
          };
          // CRITICAL FIX: The API returns the FULL class data. 
          // We must update the global state so StudentPortal can see assignments.
          if (remoteData.classData) {
            foundClass = remoteData.classData;
            // Inject this class into the global app state
            if (setClasses) {
              setClasses([remoteData.classData]);
            }
          }
        }
      }

      if (foundStudent && foundClass) {
        // Step C: Save Session & Switch View
        const sessionData = {
          studentId: String(foundStudent.id),
          studentName: foundStudent.name,
          accessCode: cleanCode,
          classId: String(foundClass.id)
        };

        localStorage.setItem('classABC_student_portal', JSON.stringify(sessionData));
        setLoading(false);
        setModalMode(null); // Close modal
        setPortalView('student'); // Switch to Portal Component
      } else {
        setError('Invalid student code or class not found.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- SLIDE NAV STATE ---
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef(null);
  const slideRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    const observers = slideRefs.map((ref, i) => {
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActiveSlide(i); }, { threshold: 0.5, root: scrollRef.current });
      if (ref.current) obs.observe(ref.current);
      return obs;
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollToSlide = (i) => {
    slideRefs[i].current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- 3. RENDER PORTALS BASED ON STATE ---
  if (portalView === 'parent') {
    return <ParentPortal onBack={() => { setPortalView(null); setStudentData(null); }} initialStudentData={studentData} />;
  }

  if (portalView === 'student') {
    return (
      <StudentPortal
        onBack={() => { setPortalView(null); setModalMode('student-login'); }}
        classes={classes}
        setClasses={setClasses}
        refreshClasses={refreshClasses}
      />
    );
  }

  // Only show full landing page content if not in Capacitor app
  if (!isCapacitorApp) {
    const slideLabels = ['Home', 'Features', 'Games', 'Reviews', 'Start'];
    return (
      <>
        {/* FIXED NAVBAR */}
        <nav aria-label="Klasiz.fun main navigation" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, padding: isMobile ? '12px 16px' : '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isDark ? 'rgba(9,9,11,0.85)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
          <div style={{ ...modernStyles.logo }}>
            <ClassABCLogo />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
            <button onClick={switchTheme} style={{ padding: '8px', borderRadius: '8px', background: isDark ? 'rgba(255,255,255,0.1)' : '#F1F5F9', color: isDark ? '#e5e5e5' : '#64748B', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={isDark ? t('ui.switch_light') : t('ui.switch_dark')}>
              {isDark ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <LanguageSelector />
            {!isMobile && (
              <>
                <button onClick={() => setShowDonateOverlay(true)} style={{ background: isDark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.07)', border: `1px solid ${isDark ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.15)'}`, color: isDark ? '#fca5a5' : '#dc2626', padding: '8px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Heart size={14} /> {t('nav.donate')}
                </button>
                <button onClick={() => navigateModal('role')} style={{ background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '14px', padding: '8px 14px', borderRadius: '10px', color: isDark ? '#f4f4f5' : '#1A1A1A' }}>
                  {t('nav.login')}
                </button>
              </>
            )}
            {!isMobile && (
              <button onClick={() => navigateModal('signup')} style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(16,185,129,0.35)' }}>
                <Sparkles size={14} /> {t('nav.signup')}
              </button>
            )}
            {isMobile && (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowMobileMenu(!showMobileMenu)} style={{ padding: '8px', borderRadius: '8px', background: isDark ? 'rgba(255,255,255,0.1)' : '#F1F5F9', color: isDark ? '#e5e5e5' : '#64748B', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MoreVertical size={20} />
                </button>
                {showMobileMenu && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: isDark ? '#18181b' : '#fff', borderRadius: '14px', boxShadow: '0 12px 40px rgba(0,0,0,0.18)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}`, padding: '8px', minWidth: '180px', zIndex: 1000 }}>
                    <button onClick={() => { navigateModal('signup'); setShowMobileMenu(false); }} style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#10B981,#059669)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
                      <Sparkles size={15} /> {t('nav.signup')}
                    </button>
                    <button onClick={() => { navigateModal('role'); setShowMobileMenu(false); }} style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: isDark ? '#e5e5e5' : '#1A1A1A', fontWeight: 600, fontSize: '14px' }}>
                      <LogIn size={15} /> {t('nav.login')}
                    </button>
                    <div style={{ height: '1px', background: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0', margin: '4px 6px' }} />
                    <button onClick={() => { setShowDonateOverlay(true); setShowMobileMenu(false); }} style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: isDark ? '#fca5a5' : '#dc2626', fontWeight: 600, fontSize: '14px' }}>
                      <Heart size={15} /> {t('nav.donate')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* RIGHT NAV DOTS */}
        {!isMobile && (
          <div style={{ position: 'fixed', right: '24px', top: '50%', transform: 'translateY(-50%)', zIndex: 150, display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            {slideLabels.map((label, i) => (
              <button
                key={i}
                onClick={() => scrollToSlide(i)}
                title={label}
                style={{ width: '8px', height: activeSlide === i ? '28px' : '8px', borderRadius: '4px', background: activeSlide === i ? '#4CAF50' : isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)', border: 'none', cursor: 'pointer', transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)', padding: 0 }}
              />
            ))}
          </div>
        )}

        {/* SCROLL-SNAP CONTAINER */}
        <div ref={scrollRef} style={{ height: '100vh', overflowY: 'scroll', scrollSnapType: 'y mandatory', overflowX: 'hidden' }}>

          {/* SLIDE 1: HERO */}
          <section ref={slideRefs[0]} style={{ height: '100vh', scrollSnapAlign: 'start', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: isMobile ? '28px' : '72px', position: 'relative', overflow: 'hidden', background: isDark ? '#09090b' : 'linear-gradient(160deg, #f8fafc 0%, #f0fdf4 100%)', padding: isMobile ? '80px 24px 48px' : '80px 80px 40px', boxSizing: 'border-box' }}>
            <div style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%,-50%)', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(76,175,80,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
            <motion.div
              initial={{ opacity: 0, x: isMobile ? 0 : -40, y: isMobile ? 30 : 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ zIndex: 1, flex: 1, maxWidth: isMobile ? '100%' : '480px', textAlign: isMobile ? 'center' : 'left' }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: isDark ? 'rgba(76,175,80,0.15)' : '#F0FDF4', color: isDark ? '#4ade80' : '#15803D', padding: '8px 18px', borderRadius: '30px', fontSize: '13px', fontWeight: 700, marginBottom: '24px', border: `1px solid ${isDark ? 'rgba(76,175,80,0.25)' : 'rgba(76,175,80,0.2)'}` }}>
                <Star size={13} fill="currentColor" /> {t('hero.tag')}
              </div>
              <h1 style={{ fontSize: isMobile ? '38px' : '62px', fontWeight: 950, lineHeight: 1.05, letterSpacing: '-2.5px', margin: '0 0 20px', color: isDark ? '#fafafa' : '#09090b' }}>
                {t('hero.title.line1')}<br />
                <span style={{ background: 'linear-gradient(135deg, #16A34A 0%, #2563EB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('hero.title.gradient')}</span>
              </h1>
              <p style={{ fontSize: isMobile ? '15px' : '17px', color: isDark ? '#a1a1aa' : '#64748B', lineHeight: 1.65, marginBottom: '32px', maxWidth: '420px', ...(isMobile ? { marginInline: 'auto' } : {}) }}>
                {t('hero.subtext')}
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigateModal('signup')} style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '12px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(16,185,129,0.38)' }}>
                  <Sparkles size={16} /> {t('cta.create_class')} <ArrowRight size={16} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigateModal('role')} style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', color: isDark ? '#f4f4f5' : '#1A1A1A', border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`, padding: '14px 28px', borderRadius: '12px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LogIn size={16} /> {t('nav.login')}
                </motion.button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: isMobile ? 0 : 60, y: isMobile ? 20 : 0, scale: 0.93 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay: 0.2 }}
              style={{ flex: isMobile ? 'none' : 1, width: isMobile ? '100%' : undefined, maxWidth: isMobile ? '340px' : '500px', zIndex: 1 }}
            >
              <div style={{ background: '#ffffff', borderRadius: isMobile ? '18px' : '24px', boxShadow: isDark ? '0 24px 60px rgba(0,0,0,0.5)' : '0 24px 60px rgba(0,0,0,0.15)', display: 'flex', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)' }}>
                {!isMobile && (
                  <div style={{ width: '64px', background: '#f0fdf4', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px', gap: '14px', flexShrink: 0 }}>
                    <div style={{ width: '40px', height: '40px', background: '#4CAF50', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Layout size={20} color="#fff" /></div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trophy size={20} color="#94a3b8" /></div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Settings size={20} color="#94a3b8" /></div>
                  </div>
                )}
                <div style={{ flex: 1, padding: isMobile ? '14px 12px' : '18px 16px', display: 'flex', flexDirection: 'column', gap: isMobile ? '10px' : '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: 800, color: '#09090b' }}>{t('mockup.class_name')}</span>
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 600, color: '#16a34a' }}>🥚 {t('mockup.progress')} 85%</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: isMobile ? '6px' : '8px' }}>
                    {[
                      { name: 'Pablo', pts: '+6', init: 'P' },
                      { name: 'Marie', pts: '+9', init: 'M' },
                      { name: 'Albert', pts: '+12', init: 'A' },
                      ...(!isMobile ? [
                        { name: 'Frida', pts: '+15', init: 'F' },
                        { name: 'Leo', pts: '+18', init: 'L' },
                        { name: 'Ada', pts: '+21', init: 'A' },
                      ] : []),
                    ].map((s, i) => (
                      <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: isMobile ? '10px 6px' : '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: isMobile ? '30px' : '36px', height: isMobile ? '30px' : '36px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? '12px' : '14px', fontWeight: 700, color: '#475569' }}>{s.init}</div>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#09090b' }}>{s.name}</span>
                        <div style={{ background: '#dcfce7', borderRadius: '20px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, color: '#16a34a' }}>{s.pts}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: isMobile ? '34px' : '40px', height: isMobile ? '34px' : '40px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><QrCode size={isMobile ? 14 : 17} color="#fff" /></div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}
              style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}
            >
              <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} style={{ width: '22px', height: '34px', border: `2px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.18)'}`, borderRadius: '11px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '5px' }}>
                <div style={{ width: '3px', height: '7px', background: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)', borderRadius: '2px' }} />
              </motion.div>
              <span style={{ fontSize: '10px', color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Scroll</span>
            </motion.div>
          </section>

          {/* SLIDE 2: FEATURES */}
          <section ref={slideRefs[1]} style={{ height: '100vh', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'center', background: isDark ? '#09090b' : '#fff', padding: isMobile ? '80px 20px 24px' : '80px 48px 24px', boxSizing: 'border-box', overflowX: 'hidden', overflowY: isMobile ? 'auto' : 'hidden' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }} style={{ textAlign: 'center', marginBottom: isMobile ? '16px' : '24px' }}>
              <h2 style={{ fontSize: isMobile ? '28px' : '46px', fontWeight: 900, letterSpacing: '-1.5px', margin: '0 0 8px', color: isDark ? '#fafafa' : '#09090b' }}>
                {t('landing.tools_title')}
              </h2>
              <p style={{ fontSize: isMobile ? '13px' : '15px', color: isDark ? '#a1a1aa' : '#64748B', maxWidth: '480px', margin: '0 auto', lineHeight: 1.5 }}>
                {t('landing.tools_subtitle')}
              </p>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: isMobile ? '10px' : '14px', maxWidth: '960px', width: '100%' }}>
              {[
                { icon: <GaugeCircle size={26} color="#16A34A" />, bg: isDark ? 'rgba(22,163,74,0.15)' : '#DCFCE7', title: t('features.meter.title'), desc: t('features.meter.desc') },
                { icon: <Dices size={26} color="#EA580C" />, bg: isDark ? 'rgba(234,88,12,0.15)' : '#FFEDD5', title: t('features.lucky.title'), desc: t('features.lucky.desc') },
                { icon: <BarChart3 size={26} color="#2563EB" />, bg: isDark ? 'rgba(37,99,235,0.15)' : '#DBEAFE', title: t('features.reports.title'), desc: t('features.reports.desc') },
                { icon: <QrCode size={26} color="#0EA5E9" />, bg: isDark ? 'rgba(14,165,233,0.15)' : '#E0F2FE', title: t('features.codes.title'), desc: t('features.codes.desc') },
                { icon: <BookOpen size={26} color="#7C3AED" />, bg: isDark ? 'rgba(124,58,237,0.15)' : '#F3E8FF', title: t('landing.lesson_planner.title'), desc: t('landing.lesson_planner.desc') },
                { icon: <MessageSquare size={26} color="#16A34A" />, bg: isDark ? 'rgba(22,163,74,0.15)' : '#DCFCE7', title: t('features.grading.title'), desc: t('features.grading.desc') },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: [0.2, 0.8, 0.2, 1] }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  style={{ background: isDark ? '#18181b' : '#fafafa', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`, borderRadius: '16px', padding: isMobile ? '14px' : '20px', cursor: 'default' }}
                >
                  <div style={{ width: '48px', height: '48px', background: f.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>{f.icon}</div>
                  <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 800, margin: '0 0 6px', color: isDark ? '#f4f4f5' : '#09090b' }}>{f.title}</h3>
                  <p style={{ fontSize: isMobile ? '12px' : '13px', color: isDark ? '#a1a1aa' : '#64748B', margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* SLIDE 3: GAMES */}
          <section ref={slideRefs[2]} style={{ height: '100vh', scrollSnapAlign: 'start', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: isMobile ? '32px' : '80px', background: isDark ? '#09090b' : 'linear-gradient(160deg, #f0fdf4 0%, #eff6ff 100%)', padding: isMobile ? '80px 24px 40px' : '80px 80px 40px', boxSizing: 'border-box', overflowY: 'auto' }}>
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }} style={{ flex: 1, maxWidth: isMobile ? '100%' : '420px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: isDark ? 'rgba(139,92,246,0.15)' : '#F3E8FF', color: isDark ? '#c084fc' : '#7C3AED', padding: '8px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: 700, marginBottom: '24px', border: `1px solid ${isDark ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.2)'}` }}>
                <Dices size={13} /> {t('landing.play_games.title')}
              </div>
              <h2 style={{ fontSize: isMobile ? '32px' : '52px', fontWeight: 900, letterSpacing: '-2px', margin: '0 0 16px', color: isDark ? '#fafafa' : '#09090b', lineHeight: 1.05 }}>
                Learning<br /><span style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>through play</span>
              </h2>
              <p style={{ fontSize: isMobile ? '15px' : '17px', color: isDark ? '#a1a1aa' : '#64748B', lineHeight: 1.7, marginBottom: '32px' }}>
                {t('landing.play_games.desc')}
              </p>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigateModal('signup')} style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 6px 20px rgba(124,58,237,0.4)' }}>
                {t('landing.play_games.cta')} <ArrowRight size={16} />
              </motion.button>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }} style={{ flex: 1, maxWidth: isMobile ? '100%' : '440px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {[
                { emoji: '\u{1F3AF}', name: 'Lucky Draw', color: '#EA580C' },
                { emoji: '\u{1F3CE}', name: 'Moto Race', color: '#2563EB' },
                { emoji: '\u{1F32A}', name: 'Tornado', color: '#7C3AED' },
                { emoji: '\u{1F3C6}', name: 'Leaderboard', color: '#F59E0B' },
                { emoji: '\u{1F3B2}', name: 'Random Pick', color: '#10B981' },
                { emoji: '\u23F1', name: 'Timer', color: '#EC4899' },
              ].map((g, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
                  whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.18 } }}
                  style={{ background: isDark ? '#18181b' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`, borderRadius: '16px', padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'default', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                >
                  <div style={{ fontSize: '32px', lineHeight: 1 }}>{g.emoji}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#f4f4f5' : '#09090b', textAlign: 'center' }}>{g.name}</div>
                  <div style={{ width: '20px', height: '3px', background: g.color, borderRadius: '2px' }} />
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* SLIDE 4: SOCIAL PROOF */}
          <section ref={slideRefs[3]} style={{ height: '100vh', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: isDark ? '#09090b' : '#fff', padding: isMobile ? '80px 20px 24px' : '80px 48px 24px', boxSizing: 'border-box', overflow: 'hidden' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }} style={{ textAlign: 'center', marginBottom: isMobile ? '16px' : '24px', width: '100%' }}>
              <h2 style={{ fontSize: isMobile ? '26px' : '40px', fontWeight: 900, letterSpacing: '-1.5px', margin: '0 0 6px', color: isDark ? '#fafafa' : '#09090b' }}>
                {t('social_proof.title')}
              </h2>
              <p style={{ fontSize: isMobile ? '14px' : '16px', color: isDark ? '#a1a1aa' : '#64748B', margin: 0 }}>{t('social_proof.subtitle')}</p>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3,1fr)' : 'repeat(3,1fr)', gap: isMobile ? '8px' : '14px', maxWidth: '860px', width: '100%', marginBottom: isMobile ? '12px' : '16px' }}>
              {[
                { value: '50K+', label: t('social_proof.students'), color: '#10B981', icon: <Users size={22} color="#10B981" /> },
                { value: '5000+', label: t('social_proof.classrooms'), color: '#8B5CF6', icon: <Layout size={22} color="#8B5CF6" /> },
                { value: '4.9★', label: t('social_proof.rating'), color: '#F59E0B', icon: <Star size={22} color="#F59E0B" /> },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
                  style={{ background: isDark ? '#18181b' : '#fafafa', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`, borderRadius: '16px', padding: isMobile ? '14px 10px' : '24px 20px', textAlign: 'center' }}
                >
                  {s.icon}
                  <div style={{ fontSize: isMobile ? '26px' : '36px', fontWeight: 900, color: s.color, margin: '6px 0 2px', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: isMobile ? '11px' : '13px', fontWeight: 600, color: isDark ? '#a1a1aa' : '#64748B' }}>{s.label}</div>
                </motion.div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? '10px' : '14px', maxWidth: '1040px', width: '100%' }}>
              {[
                { quote: t('testimonials.quote1'), name: t('testimonials.name1'), role: t('testimonials.role1'), initials: 'SJ', color: '#10B981' },
                { quote: t('testimonials.quote2'), name: t('testimonials.name2'), role: t('testimonials.role2'), initials: 'MC', color: '#2563EB' },
                { quote: t('testimonials.quote3'), name: t('testimonials.name3'), role: t('testimonials.role3'), initials: 'ER', color: '#7C3AED' },
              ].map((tm, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                  style={{ background: isDark ? '#18181b' : '#fafafa', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`, borderRadius: '20px', padding: isMobile ? '20px' : '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  <Quote size={20} color={tm.color} style={{ opacity: 0.5, flexShrink: 0 }} />
                  <p style={{ fontSize: isMobile ? '13px' : '14px', color: isDark ? '#d4d4d8' : '#374151', lineHeight: 1.6, margin: 0, flex: 1 }}>{tm.quote}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg, ${tm.color}, ${tm.color}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>{tm.initials}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: isDark ? '#f4f4f5' : '#09090b' }}>{tm.name}</div>
                      <div style={{ fontSize: '12px', color: isDark ? '#a1a1aa' : '#64748B' }}>{tm.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* SLIDE 5: CTA + FOOTER */}
          <section ref={slideRefs[4]} style={{ height: '100vh', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', background: isDark ? '#09090b' : 'linear-gradient(160deg, #f0fdf4 0%, #eff6ff 100%)', padding: isMobile ? '80px 24px 40px' : '80px 80px 40px', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(76,175,80,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }} style={{ textAlign: 'center', zIndex: 1, maxWidth: '720px' }}>
              <h2 style={{ fontSize: isMobile ? '36px' : '64px', fontWeight: 950, letterSpacing: '-2.5px', margin: '0 0 20px', color: isDark ? '#fafafa' : '#09090b', lineHeight: 1 }}>
                {t('landing.ready.title')}
              </h2>
              <p style={{ fontSize: isMobile ? '16px' : '20px', color: isDark ? '#a1a1aa' : '#64748B', marginBottom: '40px', lineHeight: 1.6, maxWidth: '480px', marginInline: 'auto' }}>
                {t('landing.ready.desc')}
              </p>
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: isMobile ? '40px' : '64px' }}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => navigateModal('signup')} style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#fff', border: 'none', padding: isMobile ? '16px 32px' : '20px 48px', borderRadius: '16px', fontSize: isMobile ? '17px' : '20px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(16,185,129,0.45)' }}>
                  <Sparkles size={20} /> {t('landing.create_account')} <ArrowRight size={20} />
                </motion.button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: isMobile ? '12px' : '20px', flexWrap: 'wrap' }}>
                {[
                  { label: t('footer.privacy'), action: onShowPrivacy },
                  { label: t('footer.terms'), action: onShowTerms },
                  { label: 'FAQ', action: onShowFAQ },
                  { label: 'Guide', action: onShowGuide },
                  { label: t('footer.about'), action: onShowAbout },
                ].map((link, i) => (
                  <button key={i} onClick={link.action} style={{ background: 'none', border: 'none', color: isDark ? '#a1a1aa' : '#64748B', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: '6px' }}>
                    {link.label}
                  </button>
                ))}
              </div>
              <p style={{ marginTop: '24px', fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)', fontWeight: 500 }}>
                {t('footer.copyright', { year: new Date().getFullYear() })}
              </p>
            </motion.div>
          </section>

        </div>
      {/* --- MODAL SYSTEM --- */}
      {modalMode && (
        <div style={{ ...modernStyles.overlay, ...(isDark ? modernStyles.overlayDark : {}) }} className="modal-overlay-in">
          <div style={{ ...modernStyles.modernModal, ...(isMobile ? modernStyles.modernModalMobile : {}), ...(isDark ? modernStyles.modernModalDark : {}) }} className="animated-modal-content modal-animate-center">
            <div style={modernStyles.modalHeader}>
              <div>
                <h2 style={{ margin: 0, fontWeight: 900, fontSize: '24px' }}>
                  {modalMode === 'role' ? t('modal.who') :
                    modalMode === 'student-login' ? t('role.student') :
                      modalMode === 'signup' ? t('auth.create_btn') : t('auth.login_btn')}
                </h2>
              </div>
              <div onClick={() => setModalMode(null)} style={modernStyles.closeBtn}><X size={20} /></div>
            </div>

            {/* 1. ROLE SELECTION */}
            {modalMode === 'role' && (
                <motion.div style={modernStyles.roleGrid} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}>
                <motion.div onClick={() => { setError(''); navigateModal('login'); }} className="lp-role-option" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ ...modernStyles.roleOption, ...(isDark ? modernStyles.roleOptionDark : {}) }}>
                  <div style={{ ...modernStyles.roleIcon, background: isDark ? 'rgba(22, 163, 74, 0.2)' : '#E8F5E9' }}><GraduationCap color="#4CAF50" /></div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>{t('role.teacher')}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>{t('role.teacher.desc')}</p>
                  </div>
                </motion.div>
                <motion.div onClick={() => setPortalView('parent')} className="lp-role-option" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ ...modernStyles.roleOption, ...(isDark ? modernStyles.roleOptionDark : {}) }}>
                  <div style={{ ...modernStyles.roleIcon, background: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FFF1F2' }}><Heart color="#FF5252" /></div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>{t('role.parent')}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>{t('role.parent.desc')}</p>
                  </div>
                </motion.div>
                <motion.div onClick={() => { setError(''); navigateModal('student-login'); }} className="lp-role-option" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ ...modernStyles.roleOption, ...(isDark ? modernStyles.roleOptionDark : {}) }}>
                  <div style={{ ...modernStyles.roleIcon, background: isDark ? 'rgba(20, 184, 166, 0.2)' : '#E0F2F1' }}><BookOpen color="#009688" /></div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>{t('role.student')}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>{t('role.student.desc')}</p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* 2. STUDENT LOGIN FORM */}
            {modalMode === 'student-login' && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                onSubmit={handleStudentLogin}
                style={{ ...modernStyles.authForm, ...(isMobile ? modernStyles.authFormMobile : {}) }}
              >
                {error && <motion.div
                  key={typeof error === 'object' ? error.html : error}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                  className="lp-error-banner"
                  style={{ ...modernStyles.errorBanner, ...(isDark ? modernStyles.errorBannerDark : {}) }}
                >
                  {typeof error === 'object' ? <span dangerouslySetInnerHTML={{ __html: error.html }} /> : error}
                </motion.div>}
                <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '10px', ...(isDark ? { color: '#a1a1aa' } : {}) }}>{t('student.instructions')}</p>
                <motion.input
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  type="text"
                  maxLength={5}
                  placeholder="0 0 0 0 0"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  style={{
                    ...modernStyles.modernInput,
                    ...(isMobile ? modernStyles.modernInputMobile : {}),
                    ...(isDark ? { background: '#27272a', borderColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5' } : {}),
                    textAlign: 'center',
                    fontSize: isMobile ? '20px' : '24px',
                    letterSpacing: isMobile ? '3px' : '5px',
                    fontWeight: 'bold',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  autoFocus
                />
                <MotionButton className="lp-cta" type="submit" disabled={loading} style={{ ...modernStyles.mainCtaPrimary, ...(isMobile ? { ...modernStyles.mainCtaMobile, width: '100%' } : {}) }}>
                  {loading ? t('student.verifying') : t('student.enter')}
                </MotionButton>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => { setError(''); navigateModal('role'); }}
                  whileHover={{ scale: 1.05 }}
                  style={{ textAlign: 'center', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', ...(isDark ? { color: '#a1a1aa' } : {}) }}
                >{t('nav.back')}</motion.p>
              </motion.form>
            )}

            {/* 3. TEACHER AUTH FORMS */}
            {(modalMode === 'signup' || modalMode === 'login') && (
              <form onSubmit={modalMode === 'signup' ? handleSignup : handleTeacherLogin} style={{ ...modernStyles.authForm, ...(isMobile ? modernStyles.authFormMobile : {}) }}>
                {error && <motion.div
                  key={typeof error === 'object' ? error.message : error}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                  className="lp-error-banner"
                  style={{ ...modernStyles.errorBanner, ...(isDark ? modernStyles.errorBannerDark : {}) }}
                >
                  <div style={{ marginBottom: '0' }}>
                    {typeof error === 'object' ? error.message : error}
                  </div>
                  {typeof error === 'object' && error.showResendButton && (
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#3B82F6',
                        padding: '4px 0',
                        fontSize: '13px',
                        cursor: 'pointer',
                        fontWeight: 500,
                        textDecoration: 'underline',
                        marginTop: '8px',
                        display: 'block'
                      }}
                    >
                      Resend
                    </button>
                  )}
                </motion.div>}

                {modalMode === 'login' && (
                  <>
                    <GoogleLoginButton
                      onClick={handleGoogleLogin}
                      disabled={googleLoading || oauthLoading !== null}
                      text={googleLoading ? t('student.verifying') : t('auth.google_signin')}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '12px', marginBottom: '4px' }}>
                      <OAuthButton
                        provider="azure"
                        onClick={handleAzureLogin}
                        loading={oauthLoading === 'azure'}
                        disabled={googleLoading || (oauthLoading !== null && oauthLoading !== 'azure')}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', marginTop: '8px' }}>
                        <span style={{ flex: 1, height: 1, background: isDark ? 'rgba(255,255,255,0.15)' : '#E2E8F0' }} />
                        <span style={{ fontSize: '13px', color: '#64748B', ...(isDark ? { color: '#a1a1aa' } : {}) }}>{t('auth.or')}</span>
                        <span style={{ flex: 1, height: 1, background: isDark ? 'rgba(255,255,255,0.15)' : '#E2E8F0' }} />
                      </div>
                    </div>
                  </>
                )}
                {modalMode === 'signup' && (
                  <>
                    <GoogleLoginButton
                      onClick={handleGoogleLogin}
                      disabled={googleLoading || oauthLoading !== null}
                      text={googleLoading ? t('student.verifying') : t('auth.google_signup')}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '12px', marginBottom: '4px' }}>
                      <OAuthButton
                        provider="azure"
                        onClick={handleAzureLogin}
                        loading={oauthLoading === 'azure'}
                        disabled={googleLoading || (oauthLoading !== null && oauthLoading !== 'azure')}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', marginTop: '8px' }}>
                        <span style={{ flex: 1, height: 1, background: isDark ? 'rgba(255,255,255,0.15)' : '#E2E8F0' }} />
                        <span style={{ fontSize: '13px', color: '#64748B', ...(isDark ? { color: '#a1a1aa' } : {}) }}>{t('auth.or')}</span>
                        <span style={{ flex: 1, height: 1, background: isDark ? 'rgba(255,255,255,0.15)' : '#E2E8F0' }} />
                      </div>
                    </div>
                  </>
                )}
                {modalMode === 'signup' && (
                  <div style={{ display: 'flex', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
                    <select
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      style={{
                        ...modernStyles.modernInput,
                        ...(isMobile ? modernStyles.modernInputMobile : {}),
                        ...(isDark ? { background: '#27272a', borderColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5' } : {}),
                        width: '90px',
                        minWidth: '90px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="" disabled>Title</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Miss">Miss</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                    </select>
                    <input
                      placeholder={t('auth.fullname')}
                      style={{
                        ...modernStyles.modernInput,
                        ...(isMobile ? modernStyles.modernInputMobile : {}),
                        ...(isDark ? { background: '#27272a', borderColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5' } : {}),
                        flex: 1,
                        minWidth: 0,
                        boxSizing: 'border-box'
                      }}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                )}
                <input type="email" placeholder={t('auth.email')} value={email} autoComplete="username" style={{ ...modernStyles.modernInput, ...(isMobile ? modernStyles.modernInputMobile : {}), ...(isDark ? { background: '#27272a', borderColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5' } : {}), width: '100%', boxSizing: 'border-box' }} onChange={e => setEmail(e.target.value)} required />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                  <input type="password" placeholder={t('auth.password')} value={password} autoComplete={modalMode === 'signup' ? 'new-password' : 'current-password'} style={{ ...modernStyles.modernInput, ...(isMobile ? modernStyles.modernInputMobile : {}), ...(isDark ? { background: '#27272a', borderColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5' } : {}), flex: isMobile ? '1' : 1, minWidth: '100%', boxSizing: 'border-box' }} onChange={e => setPassword(e.target.value)} required />
                </div>
                {modalMode === 'signup' && <input type="password" placeholder={t('auth.confirm')} autoComplete="new-password" style={{ ...modernStyles.modernInput, ...(isMobile ? modernStyles.modernInputMobile : {}), ...(isDark ? { background: '#27272a', borderColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5' } : {}), width: '100%', boxSizing: 'border-box' }} onChange={e => setConfirmPassword(e.target.value)} required />}

                {/* Terms & Conditions Checkbox - Only for signup */}
                {modalMode === 'signup' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    marginTop: '12px',
                    padding: '12px',
                    background: agreedToTerms
                      ? (isDark ? 'rgba(74,222,128,0.06)' : '#f0fdf4')
                      : (isDark ? 'rgba(251,146,60,0.07)' : '#fff7ed'),
                    borderRadius: '10px',
                    border: `2px solid ${agreedToTerms
                      ? (isDark ? 'rgba(74,222,128,0.35)' : '#86efac')
                      : (isDark ? 'rgba(251,146,60,0.5)' : '#fb923c')}`,
                    transition: 'border-color 0.2s, background 0.2s'
                  }}>
                    <input
                      type="checkbox"
                      id="agree-terms"
                      checked={agreedToTerms}
                      onChange={e => setAgreedToTerms(e.target.checked)}
                      required
                      style={{
                        marginTop: '2px',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        flexShrink: 0,
                        accentColor: '#4CAF50'
                      }}
                    />
                    <label htmlFor="agree-terms" style={{
                      fontSize: '13px',
                      color: agreedToTerms
                        ? (isDark ? '#a1a1aa' : '#64748B')
                        : (isDark ? '#fdba74' : '#9a3412'),
                      lineHeight: '1.5',
                      margin: 0,
                      cursor: 'pointer',
                      fontWeight: agreedToTerms ? 400 : 500
                    }}>
                      {t('auth.agree_terms')}{' '}
                      <button
                        type="button"
                        onClick={onShowTerms}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#4CAF50',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0,
                          textDecoration: 'underline',
                          fontSize: '13px'
                        }}
                      >
                        {t('footer.terms')}
                      </button>
                      {' '}{t('auth.and')}{' '}
                      <button
                        type="button"
                        onClick={onShowPrivacy}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#4CAF50',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0,
                          textDecoration: 'underline',
                          fontSize: '13px'
                        }}
                      >
                        {t('footer.privacy')}
                      </button>
                    </label>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                  <MotionButton className="lp-cta" type="submit" disabled={loading || (modalMode === 'signup' && !agreedToTerms)} style={{
                    ...(modalMode === 'signup' ? { ...modernStyles.mainCtaPrimary, ...(isDark ? modernStyles.mainCtaPrimaryDark : {}), width: '100%' } : { ...modernStyles.mainCtaSecondary, ...(isDark ? modernStyles.mainCtaSecondaryDark : {}), width: '100%' }),
                    ...(isMobile ? { ...modernStyles.mainCtaMobile, flex: '1' } : {})
                  }}>
                    {loading ? t('student.verifying') : (modalMode === 'signup' ? t('auth.create_btn') : t('auth.login_btn'))}
                  </MotionButton>
                  {modalMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setError(''); setResetEmail(email); navigateModal('forgot-password'); }}
                      style={{
                        fontSize: '13px',
                        color: '#64748B',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        ...(isDark ? { color: '#a1a1aa' } : {}),
                        marginTop: isMobile ? '8px' : '0'
                      }}
                    >
                      {t('auth.forgot')}
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', fontSize: '14px', color: '#64748B', ...(isDark ? { color: '#a1a1aa' } : {}) }}>
                  <span>{modalMode === 'signup' ? t('auth.already') : t('auth.newhere')}</span>
                  <motion.button
                    type="button"
                    onClick={() => { setError(''); navigateModal(modalMode === 'signup' ? 'login' : 'signup'); }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: isDark ? '#fafafa' : '#2D2D30',
                      color: isDark ? '#09090b' : '#fff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {modalMode === 'signup' ? (
                      <>
                        {t('auth.login')} <ArrowRight size={14} />
                      </>
                    ) : (
                      <>
                        <GraduationCap size={14} /> {t('auth.create_account')}
                      </>
                    )}
                  </motion.button>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => { setError(''); setModalMode('role'); }}
                  whileHover={{ scale: 1.05 }}
                  style={{ textAlign: 'center', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', marginTop: '12px', ...(isDark ? { color: '#a1a1aa' } : {}) }}
                >{t('nav.back')}</motion.p>
              </form>
            )}

            {/* 4. FORGOT PASSWORD FORM */}
            {modalMode === 'forgot-password' && (
              <form onSubmit={handleForgotPassword} style={{ ...modernStyles.authForm, ...(isMobile ? modernStyles.authFormMobile : {}) }}>
                {error && <motion.div
                  key={typeof error === 'object' ? error.html : error}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                  className="lp-error-banner"
                  style={{ ...modernStyles.errorBanner, ...(isDark ? modernStyles.errorBannerDark : {}) }}
                >
                  {typeof error === 'object' ? <span dangerouslySetInnerHTML={{ __html: error.html }} /> : error}
                </motion.div>}

                {resetSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                    style={{ padding: 32, textAlign: 'center' }}
                  >
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 0-20 0v-2a10 10 0 0 1 20 0v-2a10 10 0 1 1 20 0v2a10 10 0 1 0-20 0v-2a10 10 0 0 1 20 0v-2a10 10 0 0 1 20 0v2a10 10 0 1 0-20 0v-2a10 10 0 0 1 20 0v2z" />
                        <polyline points="22 12 18 12 2 7 12" />
                        <polyline points="22 6 18 12 2 7 12" />
                      </svg>
                    </div>
                    <h3 style={{ color: '#16A34A', marginBottom: 12, fontSize: '20px' }}>Check your email!</h3>
                    <p style={{ fontSize: '16px', color: '#64748B', marginBottom: 24, ...(isDark ? { color: '#a1a1aa' } : {}) }}>
                      We've sent a password reset link to <strong>{resetEmail}</strong>
                    </p>
                    <MotionButton
                      type="button"
                      onClick={() => { setResetSuccess(false); setResetEmail(''); navigateModal('login'); }}
                      style={{
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '14px',
                        fontSize: '18px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                        width: '100%'
                      }}
                    >
                      Login
                    </MotionButton>
                  </motion.div>
                ) : (
                  <>
                    <p style={{ fontSize: '14px', color: '#64748B', marginBottom: 20, ...(isDark ? { color: '#a1a1aa' } : {}) }}>
                      Enter your email and we'll send you a link to reset your password.
                    </p>
                    <input
                      type="email"
                      placeholder={t('auth.email')}
                      value={resetEmail}
                      autoComplete="username"
                      onChange={(e) => setResetEmail(e.target.value)}
                      style={{ ...modernStyles.modernInput, ...(isMobile ? modernStyles.modernInputMobile : {}), ...(isDark ? { background: '#27272a', borderColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5' } : {}), width: '100%', boxSizing: 'border-box' }}
                      required
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ ...modernStyles.mainCtaAccent, ...(isDark ? modernStyles.mainCtaAccentDark : {}), width: 'auto', minWidth: '140px' }}
                      >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => { setError(''); setResetEmail(''); navigateModal('login'); }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          ...modernStyles.mainCtaGhost,
                          ...(isDark ? modernStyles.mainCtaGhostDark : {}),
                          padding: '10px 16px',
                          borderRadius: '12px',
                          fontSize: '13px',
                          gap: '4px',
                          boxShadow: 'none'
                        }}
                      >
                        <ArrowLeft size={12} /> Login
                      </motion.button>
                    </div>
                  </>
                )}
              </form>
            )}

            {modalMode === 'verify-email-info' && (
              <div style={{ padding: 32, textAlign: 'center' }}>
                <h2 style={{ color: '#4CAF50', marginBottom: 16 }}>{t('auth.account_created') || 'Account Created!'}</h2>
                <p style={{ fontSize: 16, marginBottom: 16, ...(isDark ? { color: '#a1a1aa' } : {}) }}>
                  {t('auth.verify_msg') || 'Please check your email and click the verification link to activate your account.'}<br />
                  {t('auth.verify_block') || 'You will not be able to log in until your email is verified.'}
                </p>
                <button onClick={() => { setError(''); navigateModal('login'); }} style={{ ...modernStyles.mainCta, marginTop: 16, ...(isDark ? modernStyles.mainCtaDark : {}) }}>{t('auth.goto_login') || 'Go to Login'}</button>
              </div>
            )}
          </div>
        </div>
      )}
      <HelpChatBubble />
      <DonateOverlay
        showDonateOverlay={showDonateOverlay}
        setShowDonateOverlay={setShowDonateOverlay}
        isDark={isDark}
        isMobile={isMobile}
      />
    </>
  );
  }

  // For Capacitor app: show only the modal (no landing page content)
  return (
    <>
    <div style={{ ...modernStyles.container, alignItems: 'center', justifyContent: 'center', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      <div style={modernStyles.meshBackground}></div>

      {/* --- FULLSCREEN MODAL FOR CAPACITOR (no overlay, no close button) --- */}
      <div style={{
        ...modernStyles.modernModal,
        ...(isMobile ? modernStyles.modernModalMobile : {}),
        ...(isDark ? modernStyles.modernModalDark : {}),
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        borderRadius: 0,
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {/* Modal header - no close button for Capacitor */}
        <div style={{ ...modernStyles.modalHeader, marginBottom: '30px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            {/* Language selector only on role selection */}
            {modalMode === 'role' && <LanguageSelector />}
            <h2 style={{ margin: 0, fontWeight: 900, fontSize: '20px', ...(isDark ? { color: '#f4f4f5' } : {}) }}>
              {modalMode === 'role' ? t('modal.who') :
                modalMode === 'student-login' ? t('role.student') :
                  modalMode === 'signup' ? t('auth.create_btn') : t('auth.login_btn')}
            </h2>
          </div>
        </div>

            {/* 1. ROLE SELECTION */}
            {modalMode === 'role' && (
                <motion.div style={modernStyles.roleGrid} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}>
                <motion.div onClick={() => { setError(''); navigateModal('login'); }} className="lp-role-option" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ ...modernStyles.roleOption, ...(isDark ? modernStyles.roleOptionDark : {}) }}>
                  <div style={{ ...modernStyles.roleIcon, background: isDark ? 'rgba(22, 163, 74, 0.2)' : '#E8F5E9' }}><GraduationCap color="#4CAF50" /></div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>{t('role.teacher')}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>{t('role.teacher.desc')}</p>
                  </div>
                </motion.div>
                <motion.div onClick={() => setPortalView('parent')} className="lp-role-option" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ ...modernStyles.roleOption, ...(isDark ? modernStyles.roleOptionDark : {}) }}>
                  <div style={{ ...modernStyles.roleIcon, background: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FFF1F2' }}><Heart color="#FF5252" /></div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>{t('role.parent')}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>{t('role.parent.desc')}</p>
                  </div>
                </motion.div>
                <motion.div onClick={() => { setError(''); navigateModal('student-login'); }} className="lp-role-option" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ ...modernStyles.roleOption, ...(isDark ? modernStyles.roleOptionDark : {}) }}>
                  <div style={{ ...modernStyles.roleIcon, background: isDark ? 'rgba(20, 184, 166, 0.2)' : '#E0F2F1' }}><BookOpen color="#009688" /></div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>{t('role.student')}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>{t('role.student.desc')}</p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* 2. STUDENT LOGIN FORM */}
            {modalMode === 'student-login' && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                onSubmit={handleStudentLogin}
                style={{ ...modernStyles.authForm, ...(isMobile ? modernStyles.authFormMobile : {}) }}
              >
                {error && <motion.div
                  key={typeof error === 'object' ? error.html : error}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                  className="lp-error-banner"
                  style={{ ...modernStyles.errorBanner, ...(isDark ? modernStyles.errorBannerDark : {}) }}
                >
                  {typeof error === 'object' ? <span dangerouslySetInnerHTML={{ __html: error.html }} /> : error}
                </motion.div>}
                <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '10px', ...(isDark ? { color: '#a1a1aa' } : {}) }}>{t('student.instructions')}</p>
                <motion.input
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  type="text"
                  maxLength={5}
                  placeholder="0 0 0 0 0"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  style={{
                    ...modernStyles.modernInput,
                    ...(isMobile ? modernStyles.modernInputMobile : {}),
                    ...(isDark ? { background: '#27272a', borderColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5' } : {}),
                    textAlign: 'center',
                    fontSize: isMobile ? '20px' : '24px',
                    letterSpacing: isMobile ? '3px' : '5px',
                    fontWeight: 'bold',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  autoFocus
                />
                <MotionButton className="lp-cta" type="submit" disabled={loading} style={{ ...modernStyles.mainCtaPrimary, ...(isMobile ? { ...modernStyles.mainCtaMobile, width: '100%' } : {}) }}>
                  {loading ? t('student.verifying') : t('student.enter')}
                </MotionButton>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => { setError(''); navigateModal('role'); }}
                  whileHover={{ scale: 1.05 }}
                  style={{ textAlign: 'center', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', ...(isDark ? { color: '#a1a1aa' } : {}) }}
                >{t('nav.back')}</motion.p>
              </motion.form>
            )}

            {/* 3. TEACHER AUTH FORMS */}
            {(modalMode === 'signup' || modalMode === 'login') && (
              <form onSubmit={modalMode === 'signup' ? handleSignup : handleTeacherLogin} style={{ ...modernStyles.authForm, ...(isMobile ? modernStyles.authFormMobile : {}) }}>
                {error && <motion.div
                  key={typeof error === 'object' ? error.message : error}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                  className="lp-error-banner"
                  style={{ ...modernStyles.errorBanner, ...(isDark ? modernStyles.errorBannerDark : {}) }}
                >
                  <div style={{ marginBottom: '0' }}>
                    {typeof error === 'object' ? error.message : error}
                  </div>
                  {typeof error === 'object' && error.showResendButton && (
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#3B82F6',
                        padding: '4px 0',
                        fontSize: '13px',
                        cursor: 'pointer',
                        fontWeight: 500,
                        textDecoration: 'underline',
                        marginTop: '8px',
                        display: 'block'
                      }}
                    >
                      Resend
                    </button>
                  )}
                </motion.div>}

                {modalMode === 'login' && (
                  <>
                    <GoogleLoginButton
                      onClick={handleGoogleLogin}
                      disabled={googleLoading || oauthLoading !== null}
                      text={googleLoading ? t('student.verifying') : t('auth.google_signin')}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '12px', marginBottom: '4px' }}>
                      <OAuthButton
                        provider="azure"
                        onClick={handleAzureLogin}
                        loading={oauthLoading === 'azure'}
                        disabled={googleLoading || (oauthLoading !== null && oauthLoading !== 'azure')}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', marginTop: '8px' }}>
                        <span style={{ flex: 1, height: 1, background: isDark ? 'rgba(255,255,255,0.15)' : '#E2E8F0' }} />
                        <span style={{ fontSize: '13px', color: '#64748B', ...(isDark ? { color: '#a1a1aa' } : {}) }}>{t('auth.or')}</span>
                        <span style={{ flex: 1, height: 1, background: isDark ? 'rgba(255,255,255,0.15)' : '#E2E8F0' }} />
                      </div>
                    </div>
                  </>
                )}
                {modalMode === 'signup' && (
                  <>
                    <GoogleLoginButton
                      onClick={handleGoogleLogin}
                      disabled={googleLoading || oauthLoading !== null}
                      text={googleLoading ? t('student.verifying') : t('auth.google_signup')}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '12px', marginBottom: '4px' }}>
                      <OAuthButton
                        provider="azure"
                        onClick={handleAzureLogin}
                        loading={oauthLoading === 'azure'}
                        disabled={googleLoading || (oauthLoading !== null && oauthLoading !== 'azure')}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', marginTop: '8px' }}>
                        <span style={{ flex: 1, height: 1, background: isDark ? 'rgba(255,255,255,0.15)' : '#E2E8F0' }} />
                        <span style={{ fontSize: '13px', color: '#64748B', ...(isDark ? { color: '#a1a1aa' } : {}) }}>{t('auth.or')}</span>
                        <span style={{ flex: 1, height: 1, background: isDark ? 'rgba(255,255,255,0.15)' : '#E2E8F0' }} />
                      </div>
                    </div>
                  </>
                )}
                {modalMode === 'signup' && (
                  <div style={{ display: 'flex', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
                    <select
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      style={{
                        ...modernStyles.modernInput,
                        ...(isMobile ? modernStyles.modernInputMobile : {}),
                        ...(isDark ? { background: '#27272a', borderColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5' } : {}),
                        width: '90px',
                        minWidth: '90px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="" disabled>Title</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Miss">Miss</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                    </select>
                    <input
                      placeholder={t('auth.fullname')}
                      style={{
                        ...modernStyles.modernInput,
                        ...(isMobile ? modernStyles.modernInputMobile : {}),
                        ...(isDark ? { background: '#27272a', borderColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5' } : {}),
                        flex: 1,
                        minWidth: 0,
                        boxSizing: 'border-box'
                      }}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                )}
                <input type="email" placeholder={t('auth.email')} value={email} autoComplete="username" style={{ ...modernStyles.modernInput, ...(isMobile ? modernStyles.modernInputMobile : {}), ...(isDark ? { background: '#27272a', borderColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5' } : {}), width: '100%', boxSizing: 'border-box' }} onChange={e => setEmail(e.target.value)} required />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                  <input type="password" placeholder={t('auth.password')} value={password} autoComplete={modalMode === 'signup' ? 'new-password' : 'current-password'} style={{ ...modernStyles.modernInput, ...(isMobile ? modernStyles.modernInputMobile : {}), ...(isDark ? { background: '#27272a', borderColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5' } : {}), flex: isMobile ? '1' : 1, minWidth: '100%', boxSizing: 'border-box' }} onChange={e => setPassword(e.target.value)} required />
                </div>
                {modalMode === 'signup' && <input type="password" placeholder={t('auth.confirm')} autoComplete="new-password" style={{ ...modernStyles.modernInput, ...(isMobile ? modernStyles.modernInputMobile : {}), ...(isDark ? { background: '#27272a', borderColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5' } : {}), width: '100%', boxSizing: 'border-box' }} onChange={e => setConfirmPassword(e.target.value)} required />}

                {/* Terms & Conditions Checkbox - Only for signup */}
                {modalMode === 'signup' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    marginTop: '12px',
                    padding: '12px',
                    background: agreedToTerms
                      ? (isDark ? 'rgba(74,222,128,0.06)' : '#f0fdf4')
                      : (isDark ? 'rgba(251,146,60,0.07)' : '#fff7ed'),
                    borderRadius: '10px',
                    border: `2px solid ${agreedToTerms
                      ? (isDark ? 'rgba(74,222,128,0.35)' : '#86efac')
                      : (isDark ? 'rgba(251,146,60,0.5)' : '#fb923c')}`,
                    transition: 'border-color 0.2s, background 0.2s'
                  }}>
                    <input
                      type="checkbox"
                      id="agree-terms"
                      checked={agreedToTerms}
                      onChange={e => setAgreedToTerms(e.target.checked)}
                      required
                      style={{
                        marginTop: '2px',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        flexShrink: 0,
                        accentColor: '#4CAF50'
                      }}
                    />
                    <label htmlFor="agree-terms" style={{
                      fontSize: '13px',
                      color: agreedToTerms
                        ? (isDark ? '#a1a1aa' : '#64748B')
                        : (isDark ? '#fdba74' : '#9a3412'),
                      lineHeight: '1.5',
                      margin: 0,
                      cursor: 'pointer',
                      fontWeight: agreedToTerms ? 400 : 500
                    }}>
                      {t('auth.agree_terms')}{' '}
                      <button
                        type="button"
                        onClick={onShowTerms}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#4CAF50',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0,
                          textDecoration: 'underline',
                          fontSize: '13px'
                        }}
                      >
                        {t('footer.terms')}
                      </button>
                      {' '}{t('auth.and')}{' '}
                      <button
                        type="button"
                        onClick={onShowPrivacy}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#4CAF50',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0,
                          textDecoration: 'underline',
                          fontSize: '13px'
                        }}
                      >
                        {t('footer.privacy')}
                      </button>
                    </label>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                  <MotionButton className="lp-cta" type="submit" disabled={loading || (modalMode === 'signup' && !agreedToTerms)} style={{
                    ...(modalMode === 'signup' ? { ...modernStyles.mainCtaPrimary, ...(isDark ? modernStyles.mainCtaPrimaryDark : {}), width: '100%' } : { ...modernStyles.mainCtaSecondary, ...(isDark ? modernStyles.mainCtaSecondaryDark : {}), width: '100%' }),
                    ...(isMobile ? { ...modernStyles.mainCtaMobile, flex: '1' } : {})
                  }}>
                    {loading ? t('student.verifying') : (modalMode === 'signup' ? t('auth.create_btn') : t('auth.login_btn'))}
                  </MotionButton>
                  {modalMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setError(''); setResetEmail(email); navigateModal('forgot-password'); }}
                      style={{
                        fontSize: '13px',
                        color: '#64748B',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        ...(isDark ? { color: '#a1a1aa' } : {}),
                        marginTop: isMobile ? '8px' : '0'
                      }}
                    >
                      {t('auth.forgot')}
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', fontSize: '14px', color: '#64748B', ...(isDark ? { color: '#a1a1aa' } : {}) }}>
                  <span>{modalMode === 'signup' ? t('auth.already') : t('auth.newhere')}</span>
                  <motion.button
                    type="button"
                    onClick={() => { setError(''); navigateModal(modalMode === 'signup' ? 'login' : 'signup'); }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: isDark ? '#fafafa' : '#2D2D30',
                      color: isDark ? '#09090b' : '#fff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {modalMode === 'signup' ? (
                      <>
                        {t('auth.login')} <ArrowRight size={14} />
                      </>
                    ) : (
                      <>
                        <GraduationCap size={14} /> {t('auth.create_account')}
                      </>
                    )}
                  </motion.button>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => { setError(''); setModalMode('role'); }}
                  whileHover={{ scale: 1.05 }}
                  style={{ textAlign: 'center', fontSize: '13px', color: '#94A3B8', cursor: 'pointer', marginTop: '12px', ...(isDark ? { color: '#a1a1aa' } : {}) }}
                >{t('nav.back')}</motion.p>
              </form>
            )}

            {/* 4. FORGOT PASSWORD FORM */}
            {modalMode === 'forgot-password' && (
              <form onSubmit={handleForgotPassword} style={{ ...modernStyles.authForm, ...(isMobile ? modernStyles.authFormMobile : {}) }}>
                {error && <motion.div
                  key={typeof error === 'object' ? error.html : error}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                  className="lp-error-banner"
                  style={{ ...modernStyles.errorBanner, ...(isDark ? modernStyles.errorBannerDark : {}) }}
                >
                  {typeof error === 'object' ? <span dangerouslySetInnerHTML={{ __html: error.html }} /> : error}
                </motion.div>}

                {resetSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                    style={{ padding: 32, textAlign: 'center' }}
                  >
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 0-20 0v-2a10 10 0 0 1 20 0v-2a10 10 0 1 1 20 0v2a10 10 0 1 0-20 0v-2a10 10 0 0 1 20 0v-2a10 10 0 0 1 20 0v2a10 10 0 1 0-20 0v-2a10 10 0 0 1 20 0v2z" />
                        <polyline points="22 12 18 12 2 7 12" />
                        <polyline points="22 6 18 12 2 7 12" />
                      </svg>
                    </div>
                    <h3 style={{ color: '#16A34A', marginBottom: 12, fontSize: '20px' }}>Check your email!</h3>
                    <p style={{ fontSize: '16px', color: '#64748B', marginBottom: 24, ...(isDark ? { color: '#a1a1aa' } : {}) }}>
                      We've sent a password reset link to <strong>{resetEmail}</strong>
                    </p>
                    <MotionButton
                      type="button"
                      onClick={() => { setResetSuccess(false); setResetEmail(''); navigateModal('login'); }}
                      style={{
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '14px',
                        fontSize: '18px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                        width: '100%'
                      }}
                    >
                      Login
                    </MotionButton>
                  </motion.div>
                ) : (
                  <>
                    <p style={{ fontSize: '14px', color: '#64748B', marginBottom: 20, ...(isDark ? { color: '#a1a1aa' } : {}) }}>
                      Enter your email and we'll send you a link to reset your password.
                    </p>
                    <input
                      type="email"
                      placeholder={t('auth.email')}
                      value={resetEmail}
                      autoComplete="username"
                      onChange={(e) => setResetEmail(e.target.value)}
                      style={{ ...modernStyles.modernInput, ...(isMobile ? modernStyles.modernInputMobile : {}), ...(isDark ? { background: '#27272a', borderColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5' } : {}), width: '100%', boxSizing: 'border-box' }}
                      required
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ ...modernStyles.mainCtaAccent, ...(isDark ? modernStyles.mainCtaAccentDark : {}), width: 'auto', minWidth: '140px' }}
                      >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => { setError(''); setResetEmail(''); navigateModal('login'); }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          ...modernStyles.mainCtaGhost,
                          ...(isDark ? modernStyles.mainCtaGhostDark : {}),
                          padding: '10px 16px',
                          borderRadius: '12px',
                          fontSize: '13px',
                          gap: '4px',
                          boxShadow: 'none'
                        }}
                      >
                        <ArrowLeft size={12} /> Login
                      </motion.button>
                    </div>
                  </>
                )}
              </form>
            )}

            {modalMode === 'verify-email-info' && (
              <div style={{ padding: 32, textAlign: 'center' }}>
                <h2 style={{ color: '#4CAF50', marginBottom: 16 }}>{t('auth.account_created') || 'Account Created!'}</h2>
                <p style={{ fontSize: 16, marginBottom: 16, ...(isDark ? { color: '#a1a1aa' } : {}) }}>
                  {t('auth.verify_msg') || 'Please check your email and click the verification link to activate your account.'}<br />
                  {t('auth.verify_block') || 'You will not be able to log in until your email is verified.'}
                </p>
                <button onClick={() => { setError(''); navigateModal('login'); }} style={{ ...modernStyles.mainCta, marginTop: 16, ...(isDark ? modernStyles.mainCtaDark : {}) }}>{t('auth.goto_login') || 'Go to Login'}</button>
              </div>
            )}

            {/* Footer Links for Capacitor App */}
            <div style={{ marginTop: '20px', padding: '20px', borderTop: '1px solid rgba(0,0,0,0.05)', ...(isDark ? { borderTop: '1px solid rgba(255,255,255,0.1)' } : {}) }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <button
                  onClick={onShowPrivacy}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '8px 12px',
                    ...(isDark ? { color: '#a1a1aa' } : {})
                  }}
                >
                  Privacy Policy
                </button>
                <button
                  onClick={onShowTerms}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '8px 12px',
                    ...(isDark ? { color: '#a1a1aa' } : {})
                  }}
                >
                  Terms & Conditions
                </button>
                <button
                  onClick={onShowFAQ}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '8px 12px',
                    ...(isDark ? { color: '#a1a1aa' } : {})
                  }}
                >
                  FAQ
                </button>
                <button
                  onClick={onShowGuide}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '8px 12px',
                    ...(isDark ? { color: '#a1a1aa' } : {})
                  }}
                >
                  Guide
                </button>
              </div>
            </div>
        </div>
    </div>
    <HelpChatBubble />
    <DonateOverlay
      showDonateOverlay={showDonateOverlay}
      setShowDonateOverlay={setShowDonateOverlay}
      isDark={isDark}
      isMobile={isMobile}
    />
    </>
  );
}

// --- MODERN 2026 STYLES ---
const modernStyles = {
  container: { background: '#fff', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#1A1A1A', overflowX: 'hidden', paddingTop: 0 },
  containerDark: { background: '#09090b', color: '#f4f4f5', paddingTop: 0 },
  meshBackground: { position: 'fixed', inset: 0, background: 'radial-gradient(at 0% 0%, rgba(76, 175, 80, 0.08) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(37, 99, 235, 0.08) 0, transparent 50%)', zIndex: -1 },
  nav: { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(252, 252, 252, 0.68)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(0,0,0,0.04)' },
  navDark: { background: 'rgba(24, 24, 27, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  logo: { fontSize: '20px', fontWeight: 900, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', flexShrink: 0 },
  // logoTag: { background: '#1A1A1A', color: '#fff', fontSize: '11px', padding: '3px 8px', borderRadius: '8px', marginLeft: '8px', fontWeight: 700 },
  navActions: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' },
  themeToggle: { background: 'none', border: 'none', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer', color: '#64748B', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  themeToggleDark: { background: 'rgba(255,255,255,0.1)', color: '#f4f4f5' },
  loginLink: { background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '15px', padding: '12px 18px', borderRadius: '10px' },
  loginLinkDark: { color: '#f4f4f5' },
  signupBtn: { background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)' },
  signupBtnDark: { background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)', boxShadow: '0 4px 16px rgba(52, 211, 153, 0.45)' },
  heroSection: { display: 'flex', alignItems: 'center', gap: '60px', padding: '38px 60px', maxWidth: '1400px', margin: '0 auto', minHeight: '520px' },
  heroContent: { flex: 1 },
  tagBadge: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F0FDF4', color: '#15803D', padding: '8px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: 700, marginBottom: '25px', boxShadow: '0 4px 10px rgba(76, 175, 80, 0.1)' },
  tagBadgeDark: { background: 'rgba(22, 163, 74, 0.2)', color: '#4ade80' },
  heroTitle: { fontSize: '72px', fontWeight: 950, lineHeight: 1, letterSpacing: '-2px', margin: 0, color: '#09090bff' },
  heroTitleDark: { color: '#fafafaff' },
  gradientText: { background: 'linear-gradient(135deg, #16A34A 0%, #2563EB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroSubText: { fontSize: '18px', color: '#64748B', maxWidth: '520px', margin: '30px 0', lineHeight: 1.6 },
  heroSubTextDark: { color: '#a1a1aa' },
  heroBtnGroup: { display: 'flex', gap: '15px', marginTop: '20px' },
  mockupWrapper: { flex: 1.2, position: 'relative', display: 'flex', justifyContent: 'center' },
  appWindow: { width: '100%', maxWidth: '650px', height: '400px', background: '#fff', borderRadius: '24px', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)', display: 'flex', overflow: 'hidden', position: 'relative', zIndex: 10 },
  appWindowDark: { background: '#18181b', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)' },
  appSidebar: { width: '70px', background: '#F8FAFC', borderRight: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: '20px' },
  appSidebarDark: { background: '#27272a', borderRight: '1px solid rgba(255,255,255,0.1)' },
  sidebarIconActive: { color: '#16A34A', background: '#DCFCE7', padding: '10px', borderRadius: '12px' },
  sidebarIconActiveDark: { background: 'rgba(22, 163, 74, 0.2)', color: '#4ade80' },
  sidebarIcon: { color: '#94A3B8', padding: '10px' },
  sidebarIconDark: { color: '#a1a1aa' },
  appContent: { flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' },
  appContentDark: { background: '#18181b' },
  appHeader: { padding: '15px 25px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  appHeaderDark: { borderBottom: '1px solid rgba(255,255,255,0.1)' },
  eggRoadBar: { background: '#F0FDF4', padding: '6px 15px', borderRadius: '20px', width: '200px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' },
  eggRoadBarDark: { background: 'rgba(22, 163, 74, 0.15)' },
  eggFill: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '85%', background: '#4CAF50', opacity: 0.2 },
  eggFillDark: { background: '#4ade80', opacity: 0.3 },
  eggText: { fontSize: '11px', fontWeight: 800, color: '#15803D', zIndex: 1, width: '100%', textAlign: 'center' },
  appGrid: { padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', overflow: 'hidden' },
  appCard: { border: '1px solid #E2E8F0', borderRadius: '16px', padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  appCardDark: { background: '#27272a', border: '1px solid rgba(255,255,255,0.1)' },
  appAvatar: { width: '40px', height: '40px', background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748B' },
  appAvatarDark: { background: 'rgba(255,255,255,0.05)', color: '#a1a1aa' },
  appName: { fontSize: '12px', fontWeight: 700 },
  appNameDark: { color: '#f4f4f5' },
  appScore: { background: '#DCFCE7', color: '#15803D', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' },
  appFab: { position: 'absolute', bottom: '20px', right: '20px', width: '50px', height: '50px', background: '#2D2D30', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' },
  appFabDark: { background: '#fafafa', color: '#09090b' },
  blob1: { position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, #BBF7D0 0%, transparent 70%)', borderRadius: '50%', zIndex: 0, opacity: 0.6 },
  blob2: { position: 'absolute', bottom: '-50px', left: '0px', width: '250px', height: '250px', background: 'radial-gradient(circle, #BFDBFE 0%, transparent 70%)', borderRadius: '50%', zIndex: 0, opacity: 0.6 },
  section: { padding: '100px 60px', maxWidth: '1300px', margin: '0 auto' },
  sectionHeader: { textAlign: 'center', marginBottom: '60px' },
  sectionTitle: { fontSize: '42px', fontWeight: 900, marginBottom: '15px' },
  bentoGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' },
  bentoCard: { background: '#fff', border: '1px solid #E2E8F0', padding: '40px', borderRadius: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', cursor: 'default' },
  bentoCardDark: { background: '#18181b', border: '1px solid rgba(255,255,255,0.1)' },
  bentoTitleDark: { color: '#f4f4f5' },
  bentoTextDark: { color: '#a1a1aa' },
  iconBoxGreen: { width: '60px', height: '60px', background: '#DCFCE7', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' },
  iconBoxGreenDark: { background: 'rgba(22, 163, 74, 0.2)' },
  iconBoxOrange: { width: '60px', height: '60px', background: '#FFEDD5', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' },
  iconBoxOrangeDark: { background: 'rgba(234, 88, 12, 0.2)' },
  iconBoxBlue: { width: '60px', height: '60px', background: '#DBEAFE', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' },
  iconBoxBlueDark: { background: 'rgba(37, 99, 235, 0.2)' },
  iconBoxPurple: { width: '60px', height: '60px', background: '#F3E8FF', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' },
  iconBoxPurpleDark: { background: 'rgba(124, 58, 237, 0.2)' },
  bentoText: { fontSize: '15px', fontWeight: 600, color: '#64748B', lineHeight: 1.6, marginTop: '10px' },
  ctaSection: { textAlign: 'center', padding: '0 20px 100px' },
  ctaSectionDark: { color: '#f4f4f5' },
  mainCta: { width: '100%', background: '#2D2D30', color: '#fff', border: 'none', padding: '18px 36px', borderRadius: '16px', fontSize: '20px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center',justifyContent: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
  mainCtaDark: { background: '#fafafa', color: '#09090b' },
  // Different button styles for 2026 design
  mainCtaPrimary: { width: '100%', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#fff', border: 'none', padding: '18px 32px', borderRadius: '12px', fontSize: '18px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' },
  mainCtaPrimaryDark: { background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)' },
  mainCtaSecondary: { background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#fff', border: 'none', padding: '18px 32px', borderRadius: '12px', fontSize: '18px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' },
  mainCtaSecondaryDark: { background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)', boxShadow: '0 4px 20px rgba(52, 211, 153, 0.5)' },
  mainCtaAccent: { background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)' },
  mainCtaAccentDark: { background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)' },
  mainCtaGhost: { background: 'transparent', border: '2px solid #2D2D30', color: '#2D2D30', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' },
  mainCtaGhostDark: { border: '2px solid #fafafa', color: '#fafafa' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  overlayDark: { background: 'rgba(0,0,0,0.7)' },
modernModal: { width: '480px', maxHeight: '90vh', overflowY: 'auto', background: '#fff', borderRadius: '32px', padding: '40px', boxShadow: '0 40px 100px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0' },
modernModalDark: { background: '#18181b', border: '1px solid rgba(255,255,255,0.1)' },
modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', position: 'sticky', top: 0, background: 'inherit', zIndex: 1, paddingBottom: '16px' },
closeBtn: { padding: '12px', background: '#F1F5F9', borderRadius: '50%', cursor: 'pointer', color: '#1A1A1A', fontWeight: 'bold', fontSize: '18px', flexShrink: 0 },
closeBtnDark: { background: 'rgba(255,255,255,0.2)', color: '#f4f4f5' },
  roleGrid: { display: 'flex', flexDirection: 'column', gap: '15px' },
  roleOption: { display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' },
  roleOptionDark: { background: '#18181b', borderColor: 'rgba(255,255,255,0.1)' },
  roleIcon: { width: '50px', height: '50px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  authForm: { display: 'flex', flexDirection: 'column', gap: '15px' },
  modernInput: { padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '15px', outline: 'none', color: '#1A1A1A' },
  modernInputDark: { background: '#27272a', border: '1px solid rgba(255,255,255,0.1)', color: '#f4f4f5' },
  errorBanner: {
    background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
    color: '#DC2626',
    padding: '14px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 600,
    textAlign: 'center',
    border: '2px solid #FCA5A5',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
    position: 'relative',
    overflow: 'hidden'
  },
  errorBannerDark: {
    background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%)',
    color: '#FCA5A5',
    padding: '14px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 600,
    textAlign: 'center',
    border: '2px solid rgba(252, 165, 165, 0.4)',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
    position: 'relative',
    overflow: 'hidden'
  },
  logoMobile: { maxWidth: '240px' },
  // Mobile specific variants
  navMobile: { padding: '12px 16px', flexWrap: 'wrap' },
  signupBtnMobile: { padding: '8px 12px', borderRadius: '8px', fontSize: '13px' },
  heroSectionMobile: { flexDirection: 'column', padding: '25px 20px', minHeight: 'auto' },
  heroTitleMobile: { fontSize: '34px', lineHeight: 1.05 },
  heroSubTextMobile: { fontSize: '15px', maxWidth: '100%', margin: '12px 0' },
  mockupWrapperMobile: { display: 'none' },
  appGridMobile: { gridTemplateColumns: 'repeat(2, 1fr)' },
  bentoGridMobile: { gridTemplateColumns: 'repeat(1, 1fr)' },
  bentoCardMobile: { padding: '20px', borderRadius: '18px' },
modernModalMobile: {
  width: 'calc(100% - 32px)',
  maxWidth: '400px',
  maxHeight: '90vh',
  overflowY: 'auto',
  padding: '24px 20px',
  margin: '0 auto',
  boxSizing: 'border-box'
  },
  authFormMobile: { maxWidth: '100%', width: '100%', boxSizing: 'border-box' },
  modernInputMobile: {
    padding: '14px 12px',
    borderRadius: '12px',
    fontSize: '15px',
    width: '100%',
    boxSizing: 'border-box'
  },
  mainCtaMobile: { padding: '12px 18px', fontSize: '14px' },
  // Premium Features Showcase styles
  featuresShowcase: { padding: '100px 60px', maxWidth: '1400px', margin: '0 auto' },
  featuresShowcaseMobile: { padding: '40px 20px' },
  featuresHeader: { textAlign: 'center', marginBottom: '60px' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' },
  featuresGridMobile: { gridTemplateColumns: 'repeat(1, 1fr)', gap: '30px' },
  featureCard: { background: '#fff', border: '1px solid #E2E8F0', borderRadius: '32px', padding: '40px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', transition: 'all 0.3s ease' },
  featureCardDark: { background: '#18181b', border: '1px solid rgba(255,255,255,0.1)' },
  featureIconWrapper: { width: '80px', height: '80px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' },
  featureScreenshot: { width: '100%', height: '200px', background: '#F8FAFC', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '2px dashed #E2E8F0', overflow: 'hidden' },
  featureScreenshotDark: { background: '#27272a', border: '2px dashed rgba(255,255,255,0.1)' },
  featureCta: { color: '#fff', border: 'none', padding: '14px 24px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', marginTop: 'auto' },
  featuresBottomCta: { marginTop: '80px', textAlign: 'center', padding: '60px', background: 'linear-gradient(135deg, #F0FDF4 0%, #DBEAFE 100%)', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.05)' },
  featuresBottomCtaDark: { background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)', border: '1px solid rgba(255,255,255,0.1)' },
  // Social Proof Section
  socialProofSection: { background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)' },
  socialProofSectionDark: { background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginTop: '60px' },
  statCard: { background: '#fff', padding: '40px 30px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', transition: 'transform 0.3s ease' },
  statCardDark: { background: '#18181b', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' },
  // Testimonials Section
  testimonialsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' },
  testimonialsGridMobile: { gridTemplateColumns: 'repeat(1, 1fr)' },
  testimonialCard: { background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', height: '100%' },
  testimonialCardDark: { background: '#18181b', border: '1px solid rgba(255,255,255,0.1)' },
  // FAQ Section
  faqItem: { background: '#fff', padding: '24px 28px', borderRadius: '16px', border: '1px solid #E2E8F0', transition: 'box-shadow 0.2s ease' },
  faqItemDark: { background: '#18181b', border: '1px solid rgba(255,255,255,0.1)' },
  footer: { padding: '40px 20px', marginTop: '60px', borderTop: '1px solid rgba(0,0,0,0.05)', background: '#fafafa' },
  footerDark: { borderTop: '1px solid rgba(255,255,255,0.1)', background: '#18181b' },
  footerContent: { maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' },
  footerCopyright: { fontSize: '14px', color: '#64748B', margin: 0, fontWeight: 500 },
  footerCopyrightDark: { color: '#a1a1aa' },
  footerLinks: { display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' },
  footerLink: { background: 'none', border: 'none', color: '#64748B', fontSize: '14px', fontWeight: 600, cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', transition: 'all 0.2s' },
  footerLinkDark: { color: '#a1a1aa' },
  footerSeparator: { color: '#cbd5e1', fontSize: '14px', fontWeight: 400 },
  footerSeparatorDark: { color: '#52525b' },
};