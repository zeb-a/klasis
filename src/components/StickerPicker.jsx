import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';

// Lottie Component - loads .lottie and .json files using lottie-react
const LottieDisplay = ({ src, size = 64, animated = true }) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch(src);
        if (response.ok) {
          const data = await response.json();
          setAnimationData(data);
        }
      } catch (error) {
        console.error('Error loading animation:', error);
      }
    };
    loadAnimation();
  }, [src]);

  if (!animationData) {
    return <div style={{ width: size, height: size }} />;
  }

  return (
    <Lottie
      animationData={animationData}
      loop={animated}
      autoplay={animated}
      style={{ width: size, height: size, background: 'transparent' }}
      rendererSettings={{
        preserveAspectRatio: 'xMidYMid slice',
        className: 'lottie-transparent'
      }}
    />
  );
};

// POSITIVE REWARD STICKERS - Using Lottie files
const POSITIVE_STICKERS = [
  { id: '100', file: '100.json', name: '100 Points', color: '#FFD700' },
  { id: 'balloon', file: 'balloon.json', name: 'Balloon', color: '#E91E63' },
  { id: 'birthday-cake', file: 'birthday-cake.json', name: 'Birthday Cake', color: '#FF9800' },
  { id: 'butterfly', file: 'butterfly.json', name: 'Butterfly', color: '#9C27B0' },
  { id: 'clap', file: 'clap.json', name: 'Clap', color: '#FF9800' },
  { id: 'clapping', file: 'clapping.json', name: 'Clapping', color: '#FF9800' },
  { id: 'cool-badge', file: 'cool-badge.json', name: 'Cool Badge', color: '#2196F3' },
  { id: 'crystal-ball', file: 'crystal-ball.json', name: 'Crystal Ball', color: '#9C27B0' },
  { id: 'dance', file: 'dance.json', name: 'Dance', color: '#E91E63' },
  { id: 'fist-pump', file: 'fist-pupm.json', name: 'Fist Pump', color: '#4CAF50' },
  { id: 'glowing-star', file: 'glowing-star.json', name: 'Glowing Star', color: '#FFD700' },
  { id: 'gold-medal', file: 'gold-medal.json', name: 'Gold Medal', color: '#FFD700' },
  { id: 'good-job', file: 'good-job.json', name: 'Good Job', color: '#4CAF50' },
  { id: 'graduation-cap', file: 'graduation-cap.json', name: 'Graduation', color: '#2196F3' },
  { id: 'hand-shake', file: 'hand-shake.json', name: 'Handshake', color: '#4CAF50' },
  { id: 'light-bulb', file: 'light-bulb.json', name: 'Light Bulb', color: '#FFD700' },
  { id: 'on-target', file: 'on-target.json', name: 'On Target', color: '#FF9800' },
  { id: 'party-popper', file: 'Party-popper.json', name: 'Party Popper', color: '#E91E63' },
  { id: 'rainbow', file: 'rainbow.json', name: 'Rainbow', color: '#9C27B0' },
  { id: 'rose', file: 'rose.json', name: 'Rose', color: '#E91E63' },
  { id: 'silver-medal', file: 'silver-medal.json', name: 'Silver Medal', color: '#90A4AE' },
  { id: 'star-struck', file: 'star-struck.json', name: 'Star Struck', color: '#FFD700' },
  { id: 'strong', file: 'strong.json', name: 'Strong', color: '#FF9800' },
  { id: 'trophy', file: 'trophy.json', name: 'Trophy', color: '#FFD700' },
  { id: 'trumpet', file: 'trumpet.json', name: 'Trumpet', color: '#FFD700' },
  { id: 'uni-corn', file: 'uni-corn.json', name: 'Unicorn', color: '#9C27B0' },
  { id: 'wand', file: 'wand.json', name: 'Magic Wand', color: '#9C27B0' },
  { id: 'canoe', file: 'canoe.json', name: 'Canoe', color: '#2196F3' },
  { id: 'dino', file: 'dino.json', name: 'Dino', color: '#4CAF50' },
  { id: 'salute', file: 'salute.json', name: 'Salute', color: '#4CAF50' },
  { id: 'raised-eyebrows', file: 'raised-eyebrows.json', name: 'Raised Eyebrows', color: '#FF9800' }
];

// NEGATIVE / GENTLE REMINDER STICKERS - Using Lottie files
const NEGATIVE_STICKERS = [
  { id: 'big-frown', file: 'big-frown.json', name: 'Big Frown', color: '#90A4AE' },
  { id: 'distress', file: 'distress.json', name: 'Distress', color: '#FF9800' },
  { id: 'ferris', file: 'ferris.json', name: 'Ferris Wheel', color: '#9C27B0' },
  { id: 'no-no', file: 'No No.json', name: 'No No', color: '#F44336' },
  { id: 'disappointed', file: 'disappointed.json', name: 'Disappointed', color: '#90A4AE' },
  { id: 'head-shake', file: 'head-shake.json', name: 'Head Shake', color: '#FF9800' },
  { id: 'no-evil-monkey', file: 'no-evil-monkey.json', name: 'No Evil', color: '#795548' },
  { id: 'poop', file: 'poop.json', name: 'Poop', color: '#795548' },
  { id: 'bomb', file: 'bomb.json', name: 'Bomb', color: '#F44336' },
  { id: 'robot', file: 'sun.json', name: 'Robot', color: '#607D8B' },
  { id: 'screaming', file: 'screaming.json', name: 'Screaming', color: '#F44336' },
  { id: 'snowman', file: 'snowman.json', name: 'Snowman', color: '#2196F3' },
  { id: 'volcano', file: 'volcano.json', name: 'Volcano', color: '#F44336' },
  { id: 'camera-flash', file: 'camera-flash.json', name: 'Attention', color: '#FF9800' },
  { id: 'scratching-my-head', file: 'scratching-my-head.json', name: 'Confused', color: '#607D8B' }
];

// 3D Sticker Display Component with high-quality rendering
export const StickerDisplay = ({ stickerId, size = 64, animated = true }) => {
  if (stickerId == null || stickerId === '') return null;

  const allStickers = [...POSITIVE_STICKERS, ...NEGATIVE_STICKERS];

  // Handle both formats: 'sticker-id' and 'sticker-id.json'
  const normalizedId = stickerId.replace('.json', '');
  const sticker = allStickers.find(s => s.id === normalizedId || s.file === stickerId);

  if (!sticker) return null;

  const animations = animated ? {
    initial: { scale: 0.3, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: 'spring', duration: 0.8, bounce: 0.3 }
  } : {};

  return (
    <motion.div
      {...animations}
      data-sticker-display="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        background: sticker.color,
        boxShadow: `
          0 4px 8px rgba(0,0,0,0.2),
          0 6px 16px rgba(0,0,0,0.15)
        `,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Render Lottie animation if file exists, otherwise render emoji */}
      {sticker.file ? (
        <LottieDisplay
          src={`/stickers/${sticker.file}`}
          size={size * 0.75}
          animated={animated}
        />
      ) : (
        <span
          style={{
            fontSize: size * 0.55,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            zIndex: 1,
            lineHeight: 1
          }}
        >
          {sticker.emoji}
        </span>
      )}
    </motion.div>
  );
};

// Main Sticker Picker Component
export const StickerPicker = ({ isOpen, onClose, onSelectSticker, selectedStickerId, cardType = 'wow' }) => {
  const [activeTab, setActiveTab] = useState('positive');

  const stickers = activeTab === 'positive' ? POSITIVE_STICKERS : NEGATIVE_STICKERS;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={onClose}
          data-sticker-picker="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: 24,
              width: '90%',
              maxWidth: 600,
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: 24,
                borderBottom: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#1F2937' }}>
                Choose Sticker
              </h2>
              <button
                onClick={onClose}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: 'none',
                  background: '#F3F4F6',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  color: '#6B7280',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#E5E7EB'}
                onMouseLeave={(e) => e.target.style.background = '#F3F4F6'}
              >
                ×
              </button>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: 'flex',
                padding: 16,
                gap: 8,
                background: '#F9FAFB',
                borderBottom: '1px solid #E5E7EB'
              }}
            >
              <button
                onClick={() => setActiveTab('positive')}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  border: 'none',
                  background: activeTab === 'positive' ? '#4CAF50' : '#E5E7EB',
                  color: activeTab === 'positive' ? 'white' : '#6B7280',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                ✨ Positive Rewards ({POSITIVE_STICKERS.length})
              </button>
              <button
                onClick={() => setActiveTab('reminder')}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  border: 'none',
                  background: activeTab === 'reminder' ? '#F44336' : '#E5E7EB',
                  color: activeTab === 'reminder' ? 'white' : '#6B7280',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                💭 Gentle Reminders ({NEGATIVE_STICKERS.length})
              </button>
            </div>

            {/* Sticker Grid */}
            <div
              style={{
                padding: 20,
                overflowY: 'auto',
                flex: 1
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                  gap: 12
                }}
              >
                <motion.button
                  type="button"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelectSticker(null)}
                  data-sticker-picker="true"
                  style={{
                    background: selectedStickerId == null ? '#F3F4F6' : '#F9FAFB',
                    border: '2px solid',
                    borderColor: selectedStickerId == null ? '#64748B' : '#E5E7EB',
                    borderRadius: 16,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minHeight: 120,
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ fontSize: 28, lineHeight: 1 }}>✕</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#374151', textAlign: 'center' }}>
                    No sticker
                  </span>
                </motion.button>
                {stickers.map((sticker) => (
                  <motion.button
                    key={sticker.id}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectSticker(sticker.id)}
                    data-sticker-picker="true"
                    style={{
                      background: selectedStickerId === sticker.id
                        ? activeTab === 'positive' ? '#F0FDF4' : '#FEF2F2'
                        : '#F9FAFB',
                      border: '2px solid',
                      borderColor: selectedStickerId === sticker.id
                        ? activeTab === 'positive' ? '#4CAF50' : '#F44336'
                        : '#E5E7EB',
                      borderRadius: 16,
                      padding: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: selectedStickerId === sticker.id
                        ? `0 4px 12px ${sticker.color}40`
                        : '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <StickerDisplay stickerId={sticker.id} size={48} animated={true} />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#374151',
                        textAlign: 'center'
                      }}
                    >
                      {sticker.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: 16,
                borderTop: '1px solid #E5E7EB',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 12,
                background: '#F9FAFB'
              }}
            >
              <button
                onClick={onClose}
                style={{
                  padding: 12,
                  border: '1px solid #D1D5DB',
                  borderRadius: 10,
                  background: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#6B7280'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: 12,
                  border: 'none',
                  borderRadius: 10,
                  background: activeTab === 'positive' ? '#4CAF50' : '#F44336',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'white'
                }}
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickerPicker;
