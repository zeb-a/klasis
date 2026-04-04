import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect, useState, useMemo, useRef } from 'react';
import { boringAvatar } from '../utils/avatar';
import { StickerDisplay } from './StickerPicker';

// Helper for clamp in inline styles
const clamp = (min, val, max) => Math.max(min, Math.min(val, max));

// Device capability detection
const isLowEndDevice = typeof navigator !== 'undefined' && (
  navigator.hardwareConcurrency <= 2 ||
  (navigator.deviceMemory && navigator.deviceMemory <= 2)
);
const prefersReducedMotion = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Adaptive particle counts based on device
const PARTICLE_COUNTS = isLowEndDevice || prefersReducedMotion
  ? { rain: 2, float: 2, around: 2, ring: 2, trail: 2, wave: 2 }
  : { rain: 4, float: 3, around: 3, ring: 2, trail: 3, wave: 2 };

// Adaptive animation durations (shorter on low-end devices)
const DURATION_SCALE = isLowEndDevice || prefersReducedMotion ? 0.7 : 1;

// Lightweight simplified effects (reduced from 20 to 8 most effective ones)
const SURPRISE_EFFECTS = [
  {
    id: 'star-shower',
    emoji: '✨',
    type: 'rain-down',
    duration: 1.3,
    description: 'Sparkling stars rain down'
  },
  {
    id: 'pop-star',
    emoji: '⭐',
    type: 'pop-center',
    duration: 1.2,
    description: 'A star pops in'
  },
  {
    id: 'balloon-float',
    emoji: '🎈',
    type: 'float-up',
    duration: 1.4,
    description: 'A balloon floats up'
  },
  {
    id: 'trophy-pop',
    emoji: '🏆',
    type: 'pop-center',
    duration: 1.2,
    description: 'A trophy pops in'
  },
  {
    id: 'heart-float',
    emoji: '💕',
    type: 'float-around',
    duration: 1.3,
    description: 'Hearts float around'
  },
  {
    id: 'rocket-shoot',
    emoji: '🚀',
    type: 'shoot-up',
    duration: 1.4,
    description: 'A rocket shoots up'
  },
  {
    id: 'power-ring',
    emoji: '⚡',
    type: 'ring-expand',
    duration: 1.2,
    description: 'Power rings expand'
  },
  {
    id: 'superstar',
    emoji: '💫',
    type: 'pop-center',
    duration: 1.3,
    description: 'A superstar appears'
  }
];

// Simplified negative effects (reduced from 9 to 5)
const NEGATIVE_EFFECTS = [
  {
    id: 'sad-face',
    sticker: 'disappointed.json',
    type: 'pop-center',
    duration: 1.2,
    description: 'A disappointed face appears'
  },
  {
    id: 'no-no-monkey',
    sticker: 'no-evil-monkey.json',
    type: 'pop-center',
    duration: 1.3,
    description: 'A monkey covers its eyes'
  },
  {
    id: 'head-shake',
    sticker: 'head-shake.json',
    type: 'shake',
    duration: 1.4,
    description: 'A head shakes in disapproval'
  },
  {
    id: 'poop-shake',
    sticker: 'poop.json',
    type: 'shake',
    duration: 1.3,
    description: 'A poop shakes its head'
  },
  {
    id: 'bomb-drop',
    sticker: 'bomb.json',
    type: 'drop-bounce',
    duration: 1.4,
    description: 'A bomb drops and bounces'
  },
  {
    id: 'big-frown',
    sticker: 'big-frown.json',
    type: 'pop-center',
    duration: 1.3,
    description: 'A big frown appears'
  },
  {
    id: 'distress',
    sticker: 'distress.json',
    type: 'shake',
    duration: 1.3,
    description: 'A distressed face'
  },
  {
    id: 'screaming',
    sticker: 'screaming.json',
    type: 'pop-center',
    duration: 1.4,
    description: 'A screaming face'
  },
  {
    id: 'no-no-sign',
    sticker: 'No No.json',
    type: 'pop-center',
    duration: 1.2,
    description: 'A no-no sign'
  }
];

// Simplified positive effects (reduced from 20 to 8)
const POSITIVE_EFFECTS = [
  {
    id: 'good-job',
    sticker: 'good-job.json',
    type: 'pop-bounce',
    duration: 1.3,
    description: 'A good job sticker bounces in'
  },
  {
    id: 'party-popper',
    sticker: 'Party-popper.json',
    type: 'pop-center',
    duration: 1.4,
    description: 'A celebration party popper'
  },
  {
    id: 'gold-medal',
    sticker: 'gold-medal.json',
    type: 'pop-center',
    duration: 1.2,
    description: 'A gold medal appears'
  },
  {
    id: 'gold-medal-2',
    sticker: 'gold-medal-2.json',
    type: 'pop-center',
    duration: 1.3,
    description: 'Another gold medal'
  },
  {
    id: 'silver-medal',
    sticker: 'silver-medal.json',
    type: 'pop-center',
    duration: 1.2,
    description: 'A silver medal appears'
  },
  {
    id: 'trophy-shine',
    sticker: 'trophy.json',
    type: 'pop-center',
    duration: 1.4,
    description: 'A shining trophy'
  },
  {
    id: 'clapping-hands',
    sticker: 'clapping.json',
    type: 'pop-center',
    duration: 1.3,
    description: 'Clapping hands appear'
  },
  {
    id: 'clap',
    sticker: 'clap.json',
    type: 'pop-bounce',
    duration: 1.3,
    description: 'Clapping celebration'
  },
  {
    id: 'balloon-float',
    sticker: 'balloon.json',
    type: 'pop-bounce',
    duration: 1.4,
    description: 'A colorful balloon appears'
  },
  {
    id: 'fist-pump',
    sticker: 'fist-pupm.json',
    type: 'pop-bounce',
    duration: 1.3,
    description: 'A fist pump celebration!'
  },
  {
    id: 'sun-shine',
    sticker: 'sun.json',
    type: 'pop-center',
    duration: 1.4,
    description: 'A shining sun appears'
  },
  {
    id: 'glowing-star',
    sticker: 'glowing-star.json',
    type: 'pop-center',
    duration: 1.4,
    description: 'A glowing star'
  },
  {
    id: 'strong',
    sticker: 'strong.json',
    type: 'pop-bounce',
    duration: 1.3,
    description: 'Strong pose'
  },
  {
    id: 'cool-badge',
    sticker: 'cool-badge.json',
    type: 'pop-center',
    duration: 1.4,
    description: 'A cool badge'
  },
  {
    id: 'rainbow',
    sticker: 'rainbow.json',
    type: 'pop-center',
    duration: 1.5,
    description: 'A rainbow'
  },
  {
    id: 'robot',
    sticker: 'robot.json',
    type: 'pop-center',
    duration: 1.2,
    description: 'A robot'
  },
  {
    id: 'hand-shake',
    sticker: 'hand-shake.json',
    type: 'pop-bounce',
    duration: 1.3,
    description: 'A handshake'
  },
  {
    id: 'salute',
    sticker: 'salute.json',
    type: 'pop-center',
    duration: 1.2,
    description: 'A salute'
  },
  {
    id: 'light-bulb',
    sticker: 'light-bulb.json',
    type: 'pop-center',
    duration: 1.3,
    description: 'A lightbulb idea'
  },
  {
    id: 'on-target',
    sticker: 'on-target.json',
    type: 'pop-center',
    duration: 1.2,
    description: 'On target'
  },
  {
    id: 'crystal-ball',
    sticker: 'crystal-ball.json',
    type: 'pop-center',
    duration: 1.4,
    description: 'A crystal ball'
  },
  {
    id: 'wand',
    sticker: 'wand.json',
    type: 'pop-center',
    duration: 1.4,
    description: 'A magic wand'
  },
  {
    id: 'star-struck',
    sticker: 'star-struck.json',
    type: 'pop-center',
    duration: 1.3,
    description: 'Star struck face'
  },
  {
    id: 'trumpet',
    sticker: 'trumpet.json',
    type: 'pop-center',
    duration: 1.3,
    description: 'A trumpet'
  },
  {
    id: 'camera-flash',
    sticker: 'camera-flash.json',
    type: 'pop-center',
    duration: 1.2,
    description: 'Camera flash'
  },
  {
    id: 'rose',
    sticker: 'rose.json',
    type: 'pop-center',
    duration: 1.4,
    description: 'A rose'
  },
  {
    id: 'butterfly',
    sticker: 'butterfly.json',
    type: 'pop-center',
    duration: 1.5,
    description: 'A butterfly'
  },
  {
    id: 'graduation-cap',
    sticker: 'graduation-cap.json',
    type: 'pop-center',
    duration: 1.3,
    description: 'A graduation cap'
  },
  {
    id: 'birthday-cake',
    sticker: 'birthday-cake.json',
    type: 'pop-center',
    duration: 1.4,
    description: 'A birthday cake'
  },
  {
    id: 'snowman',
    sticker: 'snowman.json',
    type: 'pop-center',
    duration: 1.2,
    description: 'A snowman'
  },
  {
    id: 'ferris',
    sticker: 'ferris.json',
    type: 'pop-center',
    duration: 1.4,
    description: 'A ferris wheel'
  },
  {
    id: 'canoe',
    sticker: 'canoe.json',
    type: 'pop-center',
    duration: 1.3,
    description: 'A canoe'
  },
  {
    id: 'uni-corn',
    sticker: 'uni-corn.json',
    type: 'pop-center',
    duration: 1.5,
    description: 'A unicorn'
  },
  {
    id: 'dino',
    sticker: 'dino.json',
    type: 'pop-center',
    duration: 1.4,
    description: 'A dinosaur'
  },
  {
    id: 'dance',
    sticker: 'dance.json',
    type: 'pop-bounce',
    duration: 1.4,
    description: 'Dancing'
  },
  {
    id: 'volcano',
    sticker: 'volcano.json',
    type: 'pop-center',
    duration: 1.3,
    description: 'A volcano'
  },
  {
    id: '100',
    sticker: '100.json',
    type: 'pop-center',
    duration: 1.5,
    description: '100 percent'
  },
  {
    id: 'raised-eyebrows',
    sticker: 'raised-eyebrows.json',
    type: 'pop-center',
    duration: 1.2,
    description: 'Raised eyebrows'
  },
  {
    id: 'scratching-head',
    sticker: 'scratching-my-head.json',
    type: 'pop-center',
    duration: 1.3,
    description: 'Scratching head'
  }
];

// Select a random surprise effect
const getRandomEffect = () => {
  return SURPRISE_EFFECTS[Math.floor(Math.random() * SURPRISE_EFFECTS.length)];
};

// Select a random negative effect
const getRandomNegativeEffect = () => {
  return NEGATIVE_EFFECTS[Math.floor(Math.random() * NEGATIVE_EFFECTS.length)];
};

// Select a random positive effect
const getRandomPositiveEffect = () => {
  return POSITIVE_EFFECTS[Math.floor(Math.random() * POSITIVE_EFFECTS.length)];
};

// Large card point animation with student avatar and behavior emoji
export const PointAnimation = ({ isVisible, studentAvatar, studentName, points = 1, behaviorEmoji = '⭐', pointName, onComplete, students, behaviorAudio, stickerId }) => {
  const isPositive = points > 0;

  // Random surprise effect state
  const [currentEffect, setCurrentEffect] = useState(null);
  const [shouldHide, setShouldHide] = useState(false);
  const audioRef = useRef(null);

  // Random position for sticker (so they don't always appear in the same place)
  const randomPosition = useMemo(() => ({
    top: `${20 + Math.random() * 40}%`,
    left: `${25 + Math.random() * 50}%`
  }), [isVisible]);

  // Auto-hide after animation shows. Random Lottie “surprise” stickers only when a card sticker is set.
  useEffect(() => {
    if (isVisible) {
      setShouldHide(false);
      if (stickerId) {
        if (isPositive) {
          setCurrentEffect(getRandomPositiveEffect());
        } else {
          setCurrentEffect(getRandomNegativeEffect());
        }
      } else {
        setCurrentEffect(null);
      }
      const hideDelay = isLowEndDevice || prefersReducedMotion ? 1200 : 1500;
      const timeout = setTimeout(() => {
        setShouldHide(true);
      }, hideDelay);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, isPositive, stickerId]);
  
  // Simplified audio playback - reduced complexity
  useEffect(() => {
    if (!isVisible || prefersReducedMotion) return;

    const playAudio = async () => {
      try {
        let audioFile = null;

        // Determine audio file
        if (behaviorAudio && behaviorAudio !== 'none') {
          if (behaviorAudio.startsWith('custom_')) {
            try {
              const customAudioFiles = JSON.parse(localStorage.getItem('customAudioFiles') || '[]');
              const customAudio = customAudioFiles.find(a => a.file === behaviorAudio);
              if (customAudio?.data) {
                audioFile = customAudio.data;
              }
            } catch (e) {
              console.warn('Failed to load custom audio:', e);
            }
          } else {
            audioFile = `/audio/${behaviorAudio}`;
          }
        }

        if (audioFile) {
          let objectURL = null;
          if (audioFile.startsWith('data:')) {
            try {
              const mimeType = audioFile.match(/^data:([^;]+);/)?.[1] || 'audio/mpeg';
              const base64Data = audioFile.split(',')[1];
              const bytes = new Uint8Array(base64Data.length);
              for (let i = 0; i < base64Data.length; i++) {
                bytes[i] = base64Data.charCodeAt(i);
              }
              const blob = new Blob([bytes], { type: mimeType });
              objectURL = URL.createObjectURL(blob);
              audioFile = objectURL;
            } catch (e) {
              return;
            }
          }

          audioRef.current = new Audio();
          audioRef.current.volume = 0.7;
          audioRef.current.src = audioFile;
          audioRef.current.play().catch(() => {});

          audioRef.current.onended = () => {
            if (objectURL) URL.revokeObjectURL(objectURL);
          };
        }
      } catch (err) {
        console.warn('Audio playback failed:', err);
      }
    };

    playAudio();

    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        } catch (e) {}
      }
    };
  }, [isVisible, isPositive, points, behaviorAudio]);

  const backgroundColor = isPositive
    ? '#FFB800'
    : '#FF5252';
  const borderColor = isPositive ? '#FF9800' : '#FF1744';

  // Render the random surprise effect - simplified with fewer keyframes
  const renderSurpriseEffect = () => {
    if (!currentEffect) return null;
    if (prefersReducedMotion) return null; // Skip effects if reduced motion

    // Handle effects with stickers (both positive and negative)
    if (currentEffect.sticker) {
      const { sticker, type, duration } = currentEffect;
      const adjustedDuration = duration * DURATION_SCALE;

      switch (type) {
        case 'pop-center':
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.8, 1.2] }}
              transition={{ duration: adjustedDuration, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                width: '160px',
                height: '160px',
                left: randomPosition.left,
                top: randomPosition.top,
                transform: 'translate(-50%, -50%)',
                zIndex: 9999999,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))'
              }}
            >
              <StickerDisplay stickerId={sticker} size={160} animated={true} />
            </motion.div>
          );

        case 'shake':
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.8, 1.2], rotate: [0, -15, 15, 0] }}
              transition={{ duration: adjustedDuration, ease: 'easeInOut' }}
              style={{
                position: 'fixed',
                width: '160px',
                height: '160px',
                left: randomPosition.left,
                top: randomPosition.top,
                transform: 'translate(-50%, -50%)',
                zIndex: 9999999,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))'
              }}
            >
              <StickerDisplay stickerId={sticker} size={160} animated={true} />
            </motion.div>
          );

        case 'drop-bounce':
          return (
            <motion.div
              initial={{ opacity: 0, y: '-10vh' }}
              animate={{ opacity: [0, 1, 1, 0], y: ['10vh', '40vh', '35vh', '40vh'] }}
              transition={{ duration: adjustedDuration, ease: 'easeInOut' }}
              style={{
                position: 'fixed',
                width: '140px',
                height: '140px',
                left: randomPosition.left,
                transform: 'translateX(-50%)',
                zIndex: 9999999,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))'
              }}
            >
              <StickerDisplay stickerId={sticker} size={140} animated={true} />
            </motion.div>
          );

        case 'pop-bounce':
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.8, 1.4] }}
              transition={{ duration: adjustedDuration, type: 'spring', stiffness: 150 }}
              style={{
                position: 'fixed',
                width: '160px',
                height: '160px',
                left: randomPosition.left,
                top: randomPosition.top,
                transform: 'translate(-50%, -50%)',
                zIndex: 9999999,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 8px 20px rgba(255,215,0,0.4))'
              }}
            >
              <StickerDisplay stickerId={sticker} size={160} animated={true} />
            </motion.div>
          );

        default:
          return null;
      }
    }

    // Handle positive effects with emojis (simplified)
    const { emoji, type, duration } = currentEffect;
    const adjustedDuration = duration * DURATION_SCALE;

    switch (type) {
      case 'pop-center':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 0.8] }}
            transition={{ duration: adjustedDuration, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              fontSize: '64px',
              left: '50%',
              top: '40%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999999,
              pointerEvents: 'none'
            }}
          >
            {emoji}
          </motion.div>
        );

      case 'rain-down':
        return (
          <>
            {[...Array(PARTICLE_COUNTS.rain)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: '-10vh' }}
                animate={{ opacity: [0, 1, 0], y: ['10vh', '90vh'] }}
                transition={{ duration: adjustedDuration, delay: i * 0.1, ease: 'linear' }}
                style={{
                  position: 'fixed',
                  fontSize: '32px',
                  left: `${20 + Math.random() * 60}%`,
                  zIndex: 9999999,
                  pointerEvents: 'none'
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </>
        );

      case 'float-up':
        return (
          <>
            {[...Array(PARTICLE_COUNTS.float)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: '110vh' }}
                animate={{ opacity: [0, 1, 0], y: ['90vh', '10vh'] }}
                transition={{ duration: adjustedDuration, delay: i * 0.12, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  fontSize: '40px',
                  left: `${15 + Math.random() * 70}%`,
                  zIndex: 9999999,
                  pointerEvents: 'none'
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </>
        );

      case 'float-around':
        return (
          <>
            {[...Array(PARTICLE_COUNTS.around)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.6] }}
                transition={{ duration: adjustedDuration, delay: i * 0.1, ease: 'easeInOut' }}
                style={{
                  position: 'fixed',
                  fontSize: '36px',
                  left: `${30 + Math.random() * 40}%`,
                  top: `${30 + Math.random() * 40}%`,
                  zIndex: 9999999,
                  pointerEvents: 'none'
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </>
        );

      case 'shoot-up':
        return (
          <motion.div
            initial={{ opacity: 0, y: '100vh' }}
            animate={{ opacity: [0, 1, 0], y: ['80vh', '10vh'] }}
            transition={{ duration: adjustedDuration, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              fontSize: '56px',
              left: '50%',
              transform: 'translateX(50%)',
              zIndex: 9999999,
              pointerEvents: 'none'
            }}
          >
            {emoji}
          </motion.div>
        );

      case 'ring-expand':
        return (
          <>
            {[...Array(PARTICLE_COUNTS.ring)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.6, scale: 0.5 }}
                animate={{ opacity: [0.6, 0.2, 0], scale: [0.5, 2.5, 3.5] }}
                transition={{ duration: adjustedDuration * 0.8, delay: i * 0.15, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  fontSize: '40px',
                  left: '50%',
                  top: '40%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 9999999,
                  pointerEvents: 'none',
                  border: '3px solid rgba(255,215,0,0.5)',
                  borderRadius: '50%'
                }}
              >
                {i === 0 && emoji}
              </motion.div>
            ))}
          </>
        );

      default:
        return null;
    }
  };
  
  const content = (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && !shouldHide && (
        <>
          {/* Random surprise effect */}
          <AnimatePresence>
            {renderSurpriseEffect()}
          </AnimatePresence>

          {/* Badge - simplified animations */}
          <motion.div
            data-point-animation="true"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 300
            }}
            style={{
              position: 'fixed',
              bottom: '5vh',
              left: '25%',
              transform: 'translateX(-50%)',
              background: backgroundColor,
              borderRadius: '24px',
              padding: '18px clamp(16px, 4vw, 40px)',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 'clamp(16px, 4vw, 32px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 16px rgba(255,255,255,0.2)',
              zIndex: 9999999,
              minWidth: stickerId ? 'clamp(280px, 45vw, 500px)' : 'fit-content',
              maxWidth: '85vw',
              border: `3px solid ${borderColor}`,
              willChange: 'transform',
              backfaceVisibility: 'hidden'
            }}
          >
            {/* Student Avatar */}
            <motion.img
              src={studentAvatar || boringAvatar(studentName || 'Student', 'boy')}
              alt={studentName}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.25, type: 'spring' }}
              style={{
                width: 'clamp(64px, 10vw, 96px)',
                height: 'clamp(64px, 10vw, 96px)',
                borderRadius: '50%',
                objectFit: 'cover',
                border: `3px solid ${borderColor}`,
                boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                flexShrink: 0
              }}
              onError={(e) => {
                e.target.src = boringAvatar(studentName || 'Student', 'boy');
              }}
            />

            {/* Animated Points - simplified */}
            <motion.span
              animate={{
                scale: isPositive ? [1, 1.2, 1] : [1, 0.9, 1]
              }}
              transition={{
                duration: 0.3,
                repeat: 1,
                repeatDelay: 0.2,
                ease: 'easeOut'
              }}
              style={{
                fontSize: 'clamp(36px, 7vw, 56px)',
                fontWeight: 900,
                color: 'white',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                display: 'inline-block',
                flex: '0 0 auto',
                textAlign: 'center',
                margin: '0 10px'
              }}
            >
              {isPositive ? '+' : ''}{points}
            </motion.span>

            {/* Student Name */}
            <span
              style={{
                fontSize: 'clamp(16px, 3vw, 22px)',
                fontWeight: 700,
                color: 'white',
                textShadow: '0 2px 6px rgba(0,0,0,0.5)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 'clamp(90px, 14vw, 130px)',
                flexShrink: 0,
                marginLeft: '30px'
              }}
            >
              {studentName}
            </span>

            {/* Spacer to push sticker to the right */}
            <div style={{ flex: 1 }} />

            {/* Sticker - simplified */}
            {stickerId && (
              <div
                style={{
                  filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.3))',
                  flexShrink: 0
                }}
              >
                <StickerDisplay stickerId={stickerId} size={clamp(60, 72, 88)} animated={!isLowEndDevice} />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};
