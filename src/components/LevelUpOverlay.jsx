import React from 'react';
import SafeAvatar from './SafeAvatar'; // eslint-disable-line no-unused-vars
import { boringAvatar } from '../utils/avatar';

const LevelUpOverlay = ({ student, isVisible, onClose }) => {
  if (!isVisible || !student) return null;

  const level = Math.floor((student.score || 0) / 50) + 1;
  const displayAvatar = student.avatar || boringAvatar(student.name, student.gender);

  // Auto-close after 3 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      {/* Disco Light Beams */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none'
      }}>
        {/* Red Beam */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '150px',
          height: '150vh',
          background: 'linear-gradient(45deg, transparent, rgba(255, 0, 0, 0.6), transparent)',
          transform: 'translate(-50%, -50%) rotate(0deg)',
          transformOrigin: 'center',
          animation: 'beam-rotate-red 2s linear infinite'
        }} />
        
        {/* Blue Beam */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '120px',
          height: '150vh',
          background: 'linear-gradient(45deg, transparent, rgba(0, 100, 255, 0.6), transparent)',
          transform: 'translate(-50%, -50%) rotate(90deg)',
          transformOrigin: 'center',
          animation: 'beam-rotate-blue 2.5s linear infinite reverse'
        }} />
        
        {/* Green Beam */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100px',
          height: '150vh',
          background: 'linear-gradient(45deg, transparent, rgba(0, 255, 0, 0.6), transparent)',
          transform: 'translate(-50%, -50%) rotate(180deg)',
          transformOrigin: 'center',
          animation: 'beam-rotate-green 3s linear infinite'
        }} />
        
        {/* Yellow Beam */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '130px',
          height: '150vh',
          background: 'linear-gradient(45deg, transparent, rgba(255, 255, 0, 0.6), transparent)',
          transform: 'translate(-50%, -50%) rotate(270deg)',
          transformOrigin: 'center',
          animation: 'beam-rotate-yellow 1.8s linear infinite reverse'
        }} />
      </div>

      {/* LEVEL UP Text */}
      <div style={{
        position: 'absolute',
        top: '10%',
        fontSize: 'clamp(3rem, 8vw, 6rem)',
        fontWeight: '900',
        fontFamily: '"Comic Sans MS", "Chalkboard SE", "Bradley Hand", cursive, sans-serif',
        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #FFA07A, #98D8C8, #FFD700)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textShadow: '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.4)',
        zIndex: 10,
        animation: 'bounce-rainbow 1.5s ease-in-out infinite',
        letterSpacing: '2px',
        transform: 'rotate(-2deg)'
      }}>
        LEVEL UP!
      </div>

      {/* Student Info Container */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
      }}>
        {/* Avatar */}
        <div style={{
          width: 'clamp(100px, 20vw, 150px)',
          height: 'clamp(100px, 20vw, 150px)',
          borderRadius: '50%',
          border: '4px solid #FFD700',
          boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)',
          marginBottom: '20px',
          overflow: 'hidden'
        }}>
          <SafeAvatar
            src={displayAvatar}
            name={student.name}
            alt={student.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* Name */}
        <div style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: '800',
          fontFamily: '"Comic Sans MS", "Chalkboard SE", "Bradley Hand", cursive, sans-serif',
          background: 'linear-gradient(45deg, #FF69B4, #FFB6C1, #FFC0CB, #FFD700)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 20px rgba(255, 105, 180, 0.8), 0 0 40px rgba(255, 105, 180, 0.4)',
          marginBottom: '10px',
          transform: 'rotate(1deg)',
          letterSpacing: '1px'
        }}>
          {student.name}
        </div>

        {/* Level Badge */}
        <div style={{
          position: 'absolute',
          bottom: '80px',
          right: '-40px',
          background: 'linear-gradient(135deg, #FF69B4 0%, #FFB6C1 25%, #FFD700 50%, #98FB98 75%, #87CEEB 100%)',
          color: 'white',
          width: 'clamp(50px, 10vw, 70px)',
          height: 'clamp(50px, 10vw, 70px)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '900',
          fontFamily: '"Comic Sans MS", "Chalkboard SE", "Bradley Hand", cursive, sans-serif',
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          border: '4px solid white',
          boxShadow: '0 0 30px rgba(255, 105, 180, 0.8), 0 0 60px rgba(255, 105, 180, 0.4)',
          transform: 'rotate(3deg)',
          textShadow: '0 0 10px rgba(0, 0, 0, 0.8)'
        }}>
          {level}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes beam-rotate-red {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes beam-rotate-blue {
          from { transform: translate(-50%, -50%) rotate(90deg); }
          to { transform: translate(-50%, -50%) rotate(450deg); }
        }
        
        @keyframes beam-rotate-green {
          from { transform: translate(-50%, -50%) rotate(180deg); }
          to { transform: translate(-50%, -50%) rotate(540deg); }
        }
        
        @keyframes beam-rotate-yellow {
          from { transform: translate(-50%, -50%) rotate(270deg); }
          to { transform: translate(-50%, -50%) rotate(630deg); }
        }
        
        @keyframes bounce-rainbow {
          0% { 
            transform: rotate(-2deg) scale(1) translateY(0px);
          }
          25% { 
            transform: rotate(2deg) scale(1.1) translateY(-10px);
          }
          50% { 
            transform: rotate(-1deg) scale(1.05) translateY(-5px);
          }
          75% { 
            transform: rotate(1deg) scale(1.1) translateY(-8px);
          }
          100% { 
            transform: rotate(-2deg) scale(1) translateY(0px);
          }
        }
      `}</style>
    </div>
  );
};

export default LevelUpOverlay;
