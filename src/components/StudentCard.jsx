import { useState, useEffect, useRef } from 'react';
import { boringAvatar } from '../utils/avatar';
import SafeAvatar from './SafeAvatar'; // eslint-disable-line no-unused-vars
import { Edit2, Trash2, X } from 'lucide-react'; // eslint-disable-line no-unused-vars
import useIsTouchDevice from '../hooks/useIsTouchDevice';

const StudentCard = ({
  student,
  onClick,
  onEdit,
  onDelete,
  animating = false,
  animationType = 'small',
  displaySize = 'regular',
  disableActions = false,
  isMultiSelectMode = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isPointsAnimating, setIsPointsAnimating] = useState(false);
  const [isLevelUp, setIsLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(null);
  
  const timerRef = useRef(null);
  const wasLongPress = useRef(false);
  const isTouchDevice = useIsTouchDevice();

  // Calculate level and progress
  const calculateLevel = (score) => {
    return Math.floor(score / 50) + 1;
  };
  
  const calculateProgress = (score) => {
    return (score % 50) / 50 * 100;
  };

  // Get level color based on level number
  const getLevelColor = (level) => {
    if (!level || level < 1) level = 1; // Safety check
    
    const colors = [
      { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', progress: '#4CAF50' }, // Level 1
      { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', progress: '#FF9800' }, // Level 2
      { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', progress: '#2196F3' }, // Level 3
      { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', progress: '#9C27B0' }, // Level 4
      { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', progress: '#FF5722' }, // Level 5
      { bg: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', progress: '#795548' }, // Level 6
      { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', progress: '#E91E63' }, // Level 7
      { bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', progress: '#3F51B5' }, // Level 8
      { bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', progress: '#009688' }, // Level 9
      { bg: 'linear-gradient(135deg, #fecfef 0%, #fecfef 100%)', progress: '#CDDC39' }, // Level 10
      { bg: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', progress: '#FFC107' }, // Level 11
      { bg: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', progress: '#795548' }, // Level 12
      { bg: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', progress: '#607D8B' }, // Level 13
      { bg: 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)', progress: '#FF5722' }, // Level 14
      { bg: 'linear-gradient(135deg, #9890e3 0%, #b1f4cf 100%)', progress: '#4CAF50' }, // Level 15
    ];
    return colors[Math.min(level - 1, colors.length - 1)];
  };

  // Get avatar background color based on level group (every 3 levels)
  const getAvatarBackgroundColor = (level) => {
    const colorGroup = Math.floor((level - 1) / 3);
    const avatarColors = [
      '#FFEAA7', // Levels 1-3 (default yellow)
      '#FFD700', // Levels 4-6 (gold)
      '#FF6B6B', // Levels 7-9 (coral red)
      '#4ECDC4', // Levels 10-12 (turquoise)
      '#95E1D3', // Levels 13-15 (mint green)
      '#AA96DA', // Levels 16-18 (lavender)
      '#FCBAD3', // Levels 19-21 (pink)
      '#A8E6CF', // Levels 22-24 (light green)
      '#FFD3B6', // Levels 25-27 (peach)
      '#FFAAA5', // Levels 28-30 (salmon)
    ];
    return avatarColors[Math.min(colorGroup, avatarColors.length - 1)];
  };

  const level = calculateLevel(student.score || 0);
  const progress = calculateProgress(student.score || 0);
  const levelColor = getLevelColor(level || 1);

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Track level changes
  useEffect(() => {
    const currentLevel = calculateLevel(student.score || 0);
    
    // First time, set previous level
    if (previousLevel === null) {
      setPreviousLevel(currentLevel);
      return;
    }
    
    // Check if level increased
    if (currentLevel > previousLevel) {
      setIsLevelUp(true);
      setPreviousLevel(currentLevel);
      
      // Reset confetti after animation
      setTimeout(() => setIsLevelUp(false), 1500);
    } else {
      setPreviousLevel(currentLevel);
    }
  }, [student.score]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (animating) {
      setIsAnimating(true);
      setIsPointsAnimating(true);
      
      // duration per animationType
      const dmap = { small: 800, medium: 1200, large: 1600, confetti: 2200 };
      const t = setTimeout(() => setIsAnimating(false), dmap[animationType] || 900);
      const pointsT = setTimeout(() => setIsPointsAnimating(false), 800);
      
      return () => {
        clearTimeout(t);
        clearTimeout(pointsT);
      };
    } else {
      setIsAnimating(false);
      setIsPointsAnimating(false);
    }
  }, [animating, animationType, prefersReducedMotion]);

  // --- LONG PRESS LOGIC ---
  const handlePointerDown = () => {
    if (disableActions || (!onEdit && !onDelete)) return;
    
    wasLongPress.current = false;
    
    // Start 500ms timer
    timerRef.current = setTimeout(() => {
      wasLongPress.current = true;
      if (navigator.vibrate) navigator.vibrate(50);
      setShowActions(true);
    }, 500);
  };

  const handlePointerUpOrLeave = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    // Only hide if it's a mouse moving away. Touch users need to see the buttons to tap them.
    if (e.pointerType === 'mouse' && e.type === 'pointerleave') {
      setIsHovered(false);
      setShowActions(false);
    }
  };

  const handleCardClick = (e) => {
    // 1. If we just triggered a long press menu, STOP the normal click
    if (wasLongPress.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // 2. Ignore clicks if we are hitting the action buttons
    if (e.target.closest('[data-action-btn]')) return;

    // 3. Multi-select logic
    if (isMultiSelectMode) return;

    // 4. Normal Point Reward Logic
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 + window.scrollX;
    const centerY = rect.top + rect.height / 2 + window.scrollY;
    if (onClick) onClick(student, { x: centerX, y: centerY });
  };

  const displayAvatar = student.avatar || boringAvatar(student.name, student.gender);
  const isSpacious = displaySize === 'spacious';
  const actionSize = displaySize === 'compact'
    ? { inset: 4, gap: 4, radius: 8, pad: 6, icon: 13 }
    : displaySize === 'regular'
      ? { inset: 8, gap: 6, radius: 9, pad: 8, icon: 15 }
      : { inset: 12, gap: 8, radius: 10, pad: 10, icon: 17 };

  return (
    <div
      className="student-card"
      data-student-id={student.id}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUpOrLeave}
      onPointerLeave={handlePointerUpOrLeave}
      onPointerCancel={handlePointerUpOrLeave}
      onClick={handleCardClick}
      onPointerEnter={(e) => {
        if (e.pointerType === 'touch') return;
        setIsHovered(true);
      }}
      style={{
          backgroundColor: 'white',
          borderRadius: displaySize === 'compact' ? '12px' : isSpacious ? '28px' : '24px',
          padding: displaySize === 'compact' ? '6px' : isSpacious ? '26px' : '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isAnimating ? (animationType === 'confetti' ? '0 30px 60px rgba(255, 192, 203, 0.3), 0 10px 30px rgba(99,102,241,0.12)' : '0 20px 40px rgba(76,175,80,0.18)') : '0 8px 16px rgba(0,0,0,0.05)',
          cursor: isMultiSelectMode ? 'default' : 'pointer',
          transition: isAnimating ? 'transform 200ms cubic-bezier(.2,.9,.2,1), box-shadow 200ms' : 'transform 0.2s',
          transform: isAnimating ? (animationType === 'small' ? 'scale(1.06)' : animationType === 'medium' ? 'scale(1.1) rotate(-1deg)' : animationType === 'large' ? 'scale(1.14)' : 'scale(1.16)') : (isHovered ? 'scale(1.05)' : 'scale(1)'),
          position: 'relative',
          aspectRatio: '1 / 1',
          width: '100%',
          boxSizing: 'border-box',
          opacity: isMultiSelectMode ? 0.7 : 1,
          touchAction: 'manipulation',
          userSelect: 'none'
        }}
    >
      {/* Action Buttons - Moved back to top right corner */}
      {(isHovered || showActions) && (onEdit || onDelete) && (
        <div 
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            position: 'absolute', 
            top: actionSize.inset,
            right: actionSize.inset,
            display: 'flex', 
            gap: actionSize.gap,
            zIndex: 10
          }}
        >
          {onEdit && (
            <button
              data-action-btn
              onClick={(e) => { e.stopPropagation(); onEdit(student); setShowActions(false); }}
              disabled={disableActions}
              style={{
                background: 'white', border: '1px solid #ddd',
                borderRadius: actionSize.radius, padding: actionSize.pad, cursor: disableActions ? 'not-allowed' : 'pointer',
                color: disableActions ? '#999' : '#4CAF50', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
                opacity: disableActions ? 0.4 : 1
              }}
              onMouseEnter={(e) => { if (!disableActions) e.currentTarget.style.background = '#E8F5E9'; }}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <Edit2 size={actionSize.icon} />
            </button>
          )}
          {onDelete && (
            <button
              data-action-btn
              onClick={(e) => { e.stopPropagation(); onDelete(student); setShowActions(false); }}
              disabled={disableActions}
              style={{
                background: 'white', border: '1px solid #ddd',
                borderRadius: actionSize.radius, padding: actionSize.pad, cursor: disableActions ? 'not-allowed' : 'pointer',
                color: disableActions ? '#999' : '#FF6B6B', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
                opacity: disableActions ? 0.4 : 1
              }}
              onMouseEnter={(e) => { if (!disableActions) e.currentTarget.style.background = '#FFEBEE'; }}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <Trash2 size={actionSize.icon} />
            </button>
          )}
          {/* Close button specifically for touch users to dismiss the menu without clicking anything else */}
          {showActions && isTouchDevice && (
             <button
               data-action-btn
               onClick={(e) => { e.stopPropagation(); setShowActions(false); }}
               style={{
                 background: '#f1f5f9', border: '1px solid #ddd',
                 borderRadius: actionSize.radius, padding: actionSize.pad, cursor: 'pointer',
                 color: '#64748b', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 transition: 'all 0.2s'
               }}
             >
               <X size={actionSize.icon} />
             </button>
          )}
        </div>
      )}

      {/* Score Badge */}
      {displaySize === 'compact' ? (
        <div style={{
          position: 'absolute',
          top: 7,
          left: 7,
          background: 'rgba(227, 242, 253, 0.98)',
          color: '#1976D2',
          padding: '2px 5px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '10px',
          border: '1px solid rgba(255,255,255,0.95)',
          boxShadow: '0 1px 4px rgba(99, 102, 241, 0.12)',
          zIndex: 1,
          maxWidth: 'calc(100% - 14px)',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {student.score}
        </div>
      ) : (
        <div style={{
          position: 'absolute', top: displaySize === 'regular' ? '12px' : '16px', left: displaySize === 'regular' ? '12px' : '16px',
          background: '#E3F2FD', color: '#2196F3',
          width: displaySize === 'regular' ? 'clamp(36px, 12%, 56px)' : 'clamp(48px, 15%, 64px)',
          height: displaySize === 'regular' ? 'clamp(36px, 12%, 56px)' : 'clamp(48px, 15%, 64px)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: displaySize === 'regular' ? 'clamp(0.9rem, 3vw, 1.3rem)' : 'clamp(1.1rem, 4vw, 1.6rem)',
          transform: isPointsAnimating ? 'scale(1.2)' : 'scale(1)',
          transition: 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          boxShadow: isPointsAnimating ? '0 6px 20px rgba(33, 150, 243, 0.4)' : '0 2px 8px rgba(33, 150, 243, 0.2)'
        }}>
          {student.score}
        </div>
      )}

      {/* Level Badge */}
      {displaySize !== 'compact' && (
        <div style={{
          position: 'absolute',
          top: displaySize === 'regular' ? '12px' : '16px',
          right: displaySize === 'regular' ? '12px' : '16px',
          background: isLevelUp ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' : levelColor.bg,
          color: 'white',
          width: displaySize === 'regular' ? 'clamp(28px, 10%, 40px)' : 'clamp(32px, 12%, 48px)',
          height: displaySize === 'regular' ? 'clamp(28px, 10%, 40px)' : 'clamp(32px, 12%, 48px)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: displaySize === 'regular' ? 'clamp(0.8rem, 2.5vw, 1rem)' : 'clamp(0.9rem, 3vw, 1.1rem)',
          boxShadow: isLevelUp ? '0 8px 25px rgba(255, 215, 0, 0.6)' : `0 2px 8px ${levelColor.progress}40`,
          border: '2px solid white',
          transform: isLevelUp ? 'scale(1.3)' : 'scale(1)',
          transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        }}>
          {level}
          {/* Tiny Badge */}
          {level > 1 && (
            <div style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              background: '#FFD700',
              color: '#333',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              fontSize: '7px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }}>
              ⭐
            </div>
          )}
        </div>
      )}

      {/* Progress Bar - Vertical Thick Round Orange */}
      {displaySize !== 'compact' && (
        <div style={{
          position: 'absolute',
          top: displaySize === 'regular' ? '60px' : '70px',
          right: displaySize === 'regular' ? '8px' : '10px',
          bottom: displaySize === 'regular' ? '60px' : '70px',
          width: '12px',
          backgroundColor: '#f0f0f0',
          borderRadius: '6px',
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {/* Progress Fill */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: `${progress}%`,
            background: '#FF8C00',
            borderRadius: '6px',
            transition: 'height 0.3s ease',
            boxShadow: '0 0 4px rgba(255, 140, 0, 0.6)'
          }} />
          
          {/* Volume Knob */}
          {progress > 0 && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: `${Math.max(0, progress - 4)}%`,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: 'white',
                border: `3px solid ${levelColor.progress}`,
                boxShadow: `0 0 8px ${levelColor.progress}99`,
                transition: 'bottom 0.3s ease',
                transform: 'translateX(-50%)',
                zIndex: 1
              }}
            />
          )}
        </div>
      )}

      {/* Avatar */}
      <SafeAvatar
        src={displayAvatar}
        name={student.name}
        alt={student.name}
        loading="lazy"
        style={{
          width: displaySize === 'compact' ? '50%' : isSpacious ? '85%' : '70%',
          height: displaySize === 'compact' ? '50%' : isSpacious ? '85%' : '70%',
          borderRadius: '50%',
          objectFit: 'cover',
          border: displaySize === 'compact' ? '2px solid white' : 'clamp(3px, 1.5%, 6px) solid white',
          boxShadow: isAnimating ? (animationType === 'confetti' ? '0 12px 36px rgba(255, 105, 180, 0.25)' : '0 10px 30px rgba(76,175,80,0.18)') : '0 4px 10px rgba(0,0,0,0.1)',
          backgroundColor: getAvatarBackgroundColor(level),
          transition: 'transform 220ms ease, box-shadow 220ms ease, background-color 0.3s ease',
          transform: isPointsAnimating ? 'translateY(-3px) rotate(5deg)' : 'translateY(0) rotate(0deg)'
        }}
      />

      {/* Name Display */}
      {displaySize === 'compact' ? (
        <svg viewBox="0 0 150 50" style={{
          position: 'absolute',
          bottom: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '92%',
          height: '48px',
          pointerEvents: 'none'
        }}>
          <defs>
            <path id={`textPathStudent-${student.id}`} d="M 10,5 Q 75,50 140,5" />
          </defs>
          <text fill="#2D3436" fontSize="14" fontWeight="900" textAnchor="middle">
            <textPath href={`#textPathStudent-${student.id}`} startOffset="50%">
              {student.name}
            </textPath>
          </text>
        </svg>
      ) : (
        <div style={{
          position: 'absolute',
          bottom: '14px',
          fontWeight: '800',
          fontSize: isSpacious ? 'clamp(1.05rem, 4.8%, 1.35rem)' : 'clamp(0.9rem, 4%, 1.2rem)',
          color: '#2D3436',
          textAlign: 'center',
          maxWidth: '85%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {student.name}
        </div>
      )}
    </div>
  );
};

export default StudentCard;