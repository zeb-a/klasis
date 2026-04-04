
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../i18n';
import { useTheme } from '../ThemeContext';

export default function GamesSidebar({ isOpen, onClose, activeClass, onGameSelect }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const sidebarVariants = {
    hidden: { x: '100%' },
    visible: { x: 0 }
  };

  const gameButtonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        type: 'spring',
        stiffness: 400,
        damping: 25
      }
    })
  };

  const games = [
    { id: 'tornado', emoji: '🌪️', color: '#10B981', bgGradientLight: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', bgGradientDark: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)', textColor: '#065F46' },
    { id: 'faceoff', emoji: '⚡', color: '#FF6B6B', bgGradientLight: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)', bgGradientDark: 'linear-gradient(135deg, #7F1D1D 0%, #991B1B 100%)', textColor: '#991B1B' },
    { id: 'memorymatch', emoji: '🧠', color: '#8B5CF6', bgGradientLight: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)', bgGradientDark: 'linear-gradient(135deg, #4C1D95 0%, #5B21B6 100%)', textColor: '#5B21B6' },
    { id: 'quiz', emoji: '🎯', color: '#0EA5E9', bgGradientLight: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', bgGradientDark: 'linear-gradient(135deg, #0C4A6E 0%, #075985 100%)', textColor: '#0369A1' },
    { id: 'motorace', emoji: '🏍️', color: '#F97316', bgGradientLight: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', bgGradientDark: 'linear-gradient(135deg, #7C2D12 0%, #9A3412 100%)', textColor: '#9A3412' },
    { id: 'horserace', emoji: '🐴', color: '#A855F7', bgGradientLight: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)', bgGradientDark: 'linear-gradient(135deg, #581C87 0%, #6B21A8 100%)', textColor: '#7E22CE' },
    { id: 'spelltheword', emoji: '🔤', color: '#EC4899', bgGradientLight: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', bgGradientDark: 'linear-gradient(135deg, #831843 0%, #9D174D 100%)', textColor: '#9D174D' },
  ];

  const handleGameClick = (gameId) => {
    localStorage.setItem('selected_game_type', gameId);
    localStorage.setItem('selected_class_id', activeClass.id);
    onClose();
    if (onGameSelect) {
      onGameSelect(gameId, activeClass);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '380px',
              height: '100vh',
              background: 'var(--card-bg)',
              boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
              zIndex: 3001,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--text-dark)',
              margin: 0
            }}>{t('games.title')}</h2>
            <p style={{
              fontSize: '13px',
              color: 'var(--muted)',
              margin: '4px 0 0 0'
            }}>{t('games.choose')}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto',
              background: 'var(--bg-gray)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-gray)'}
          >
            <X size={20} color="var(--muted)" />
          </button>
        </div>

        {/* Games Grid */}
        <div style={{
          flex: 1,
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {games.map((game, index) => (
              <motion.button
                key={game.id}
                custom={index}
                variants={gameButtonVariants}
                initial="hidden"
                animate="visible"
                onClick={() => handleGameClick(game.id)}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  border: `2px solid ${game.color}`,
                  background: 'var(--glass-bg)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--card-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  boxShadow: `0 4px 12px ${game.color}33`
                }}>{game.emoji}</div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-dark)'
                }}>{t(`games.${game.id}`) === `games.${game.id}` ? (game.id === 'spelltheword' ? 'Spell the Word' : game.id) : t(`games.${game.id}`)}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </>
      )}
    </AnimatePresence>
  );
}
