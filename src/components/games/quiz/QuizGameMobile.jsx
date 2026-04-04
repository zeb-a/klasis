import { useState, useEffect, useCallback, useRef } from 'react';
import { SoundManager } from '../shared/TornadoSoundManager';
import { useTranslation } from '@/i18n';

// Kid-friendly colors matching FaceOff
const KID_COLORS = {
  players: ['#32CD32', '#00BFFF', '#FF69B4', '#FFD700'],
  correct: '#4CAF50',
  wrong: '#FF6B6B',
  neutral: '#E0E0E0',
  primary: '#4ECDC4',
  accent: '#FFD700'
};

const QuizGameMobile = ({ config, players, onGameEnd, onBackToSetup, onExitToPortal, selectedClass, onGivePoints }) => {
  const { t } = useTranslation();
  const soundManagerRef = useRef(null);

  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(config?.questions?.length || 5);
  const [questions] = useState(config?.questions || []);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [displayOptions, setDisplayOptions] = useState([]);
  const [clickedItems, setClickedItems] = useState(new Set());
  const [roundComplete, setRoundComplete] = useState(false);
  const [scores, setScores] = useState([0, 0]);
  const [usedQuestions, setUsedQuestions] = useState([]);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winnerData, setWinnerData] = useState(null);
  const [pointsToGive, setPointsToGive] = useState(1);
  const [pointsGiven, setPointsGiven] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize sound manager
  useEffect(() => {
    const initSound = async () => {
      soundManagerRef.current = new SoundManager();
      await soundManagerRef.current.init();
      soundManagerRef.current.playMusic('background');
      setLoading(false);
    };
    initSound();

    return () => {
      soundManagerRef.current?.cleanup?.();
    };
  }, []);

  // 1. Defined endGame with useCallback to ensure it works inside the transition effect
  const endGame = useCallback(() => {
    const p1Score = scores[0] || 0;
    const p2Score = scores[1] || 0;
    const isTie = p1Score === p2Score;

    if (!isTie) {
      const winnerIndex = p1Score > p2Score ? 0 : 1;
      setWinnerData({ ...players[winnerIndex], index: winnerIndex, score: scores[winnerIndex] });
    } else {
      setWinnerData(null); // It's a tie
    }

    setShowWinnerModal(true);
    soundManagerRef.current?.playSound('win');
  }, [scores, players]);

  // Load new round
  const loadRound = useCallback(async () => {
    // Check if we should end instead of loading
    if (currentRound >= totalRounds) {
      endGame();
      return;
    }

    const allUniqueQuestionsUsed = usedQuestions.length >= questions.length;
    const isCustomRounds = totalRounds === 10 || totalRounds === 20 || totalRounds === 30;

    if (allUniqueQuestionsUsed && !isCustomRounds) {
      endGame();
      return;
    }

    let availableQuestions = questions.filter((_, index) => !usedQuestions.includes(index));

    if (availableQuestions.length === 0 && !isCustomRounds) {
      endGame();
      return;
    } else if (availableQuestions.length === 0 && isCustomRounds) {
      availableQuestions = [...questions];
    }

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    const question = availableQuestions[questionIndex];
    const actualIndex = questions.indexOf(question);

    if (!(isCustomRounds && usedQuestions.length >= questions.length)) {
      setUsedQuestions(prev => [...prev, actualIndex]);
    }

    setCurrentQuestion(question);
    setClickedItems(new Set());
    setRoundComplete(false);

    // Prepare options
    const optionLetters = ['A', 'B', 'C', 'D'];
    const visibleOptions = (question.options || []).map((o, i) => ({
      letter: optionLetters[i],
      text: o,
      index: i
    })).filter(x => x.text?.trim());

    setDisplayOptions(visibleOptions);
  }, [currentRound, totalRounds, questions, usedQuestions, endGame]);

  const handleItemClick = async (playerIndex, optionIndex, isCorrect) => {
    if (roundComplete || clickedItems.has(`${playerIndex}-${optionIndex}`)) return;

    const clickedKey = `${playerIndex}-${optionIndex}`;
    setClickedItems(prev => new Set([...prev, clickedKey]));

    if (isCorrect) {
      soundManagerRef.current?.playSound('points');
      setScores(prev => {
        const newScores = [...prev];
        newScores[playerIndex] = (newScores[playerIndex] || 0) + 1;
        return newScores;
      });
      setRoundComplete(true);
      // Round increment is now handled by the useEffect for cleaner synchronization
    } else {
      soundManagerRef.current?.playSound('hover');
    }
  };

  const handleGivePointsToWinner = () => {
    if (winnerData && onGivePoints) {
      onGivePoints([winnerData], pointsToGive);
      setPointsGiven(true);
    }
  };

  const handleWinnerModalClose = () => {
    setShowWinnerModal(false);
    setWinnerData(null);
    setPointsGiven(false);
    setPointsToGive(1);
    onBackToSetup();
  };

  const handleExit = () => {
    if (showExitConfirmation) {
      setShowExitConfirmation(false);
      onExitToPortal?.();
    } else {
      setShowExitConfirmation(true);
    }
  };

  useEffect(() => {
    if (!loading && currentRound === 0 && !currentQuestion) {
      loadRound();
    }
  }, [loading, currentRound, currentQuestion, loadRound]);

  // 2. Optimized Effect: Manages the transition delay, round increment, and triggers endGame
  useEffect(() => {
    if (roundComplete) {
      const timer = setTimeout(() => {
        if (currentRound + 1 < totalRounds) {
          setCurrentRound(prev => prev + 1);
          loadRound();
        } else {
          endGame();
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [roundComplete, currentRound, totalRounds, loadRound, endGame]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}>🎮</div>
        <div style={styles.loadingText}>Loading Quiz...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* Floating Vertical Round Counter */}
      <div style={styles.verticalRoundCounter}>
        Q {currentRound + 1}/{totalRounds}
      </div>

      {/* Player 2 Section (Top - Rotated 180°) */}
      <div style={{ ...styles.playerSection, transform: 'rotate(180deg)' }}>
        <div style={styles.optionsGrid}>
          {displayOptions.map((item, idx) => {
            const isClicked = clickedItems.has(`1-${idx}`);
            const isCorrect = item.index === currentQuestion?.correct;

            return (
              <button
                key={`bottom-${idx}`}
                onClick={() => handleItemClick(1, idx, isCorrect)}
                style={{
                  ...styles.optionButton,
                  opacity: isClicked ? 0.3 : 1,
                  transform: isClicked ? 'scale(0.95)' : 'scale(1)',
                  borderColor: isClicked && isCorrect ? KID_COLORS.correct : '#E0E0E0',
                  backgroundColor: isClicked && isCorrect ? KID_COLORS.correct + '20' : '#FFFFFF',
                  cursor: isClicked ? 'default' : 'pointer'
                }}
                disabled={isClicked}
              >
                <span style={{
                  ...styles.optionLetter,
                  background: isClicked && isCorrect ? KID_COLORS.correct : '#F3F4F6',
                  color: isClicked && isCorrect ? '#fff' : '#6B7280'
                }}>
                  {item.letter}
                </span>
                <span style={styles.optionText}>{item.text}</span>
              </button>
            );
          })}
        </div>

        <div style={styles.scorePanel}>
          <div style={{ ...styles.playerName, color: KID_COLORS.players[1] }}>
            {players[1]?.name || 'Player 2'}
          </div>
          <div style={{ ...styles.scoreValue, color: KID_COLORS.players[1] }}>
            {scores[1]}
          </div>
        </div>
      </div>

      {/* Central Question Display */}
      <div style={styles.centralContainer}>
        <div style={styles.questionBox}>
          {currentQuestion?.image && (
            <img src={currentQuestion.image} alt="" style={styles.questionImage} />
          )}
          <div style={styles.questionText}>{currentQuestion?.question || ''}</div>
        </div>
      </div>

      {/* Player 1 Section (Bottom - Normal) */}
      <div style={styles.playerSection}>
        <div style={styles.optionsGrid}>
          {displayOptions.map((item, idx) => {
            const isClicked = clickedItems.has(`0-${idx}`);
            const isCorrect = item.index === currentQuestion?.correct;

            return (
              <button
                key={`top-${idx}`}
                onClick={() => handleItemClick(0, idx, isCorrect)}
                style={{
                  ...styles.optionButton,
                  opacity: isClicked ? 0.3 : 1,
                  transform: isClicked ? 'scale(0.95)' : 'scale(1)',
                  borderColor: isClicked && isCorrect ? KID_COLORS.correct : '#E0E0E0',
                  backgroundColor: isClicked && isCorrect ? KID_COLORS.correct + '20' : '#FFFFFF',
                  cursor: isClicked ? 'default' : 'pointer'
                }}
                disabled={isClicked}
              >
                <span style={{
                  ...styles.optionLetter,
                  background: isClicked && isCorrect ? KID_COLORS.correct : '#F3F4F6',
                  color: isClicked && isCorrect ? '#fff' : '#6B7280'
                }}>
                  {item.letter}
                </span>
                <span style={styles.optionText}>{item.text}</span>
              </button>
            );
          })}
        </div>

        <div style={styles.scorePanel}>
          <div style={{ ...styles.playerName, color: KID_COLORS.players[0] }}>
            {players[0]?.name || 'Player 1'}
          </div>
          <div style={{ ...styles.scoreValue, color: KID_COLORS.players[0] }}>
            {scores[0]}
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      {showWinnerModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.trophyIcon}>🏆</div>
            <div style={styles.winnerTitle}>
              {winnerData ? '🎉 WINNER! 🎉' : "IT'S A TIE!"}
            </div>
            {winnerData && (
              <>
                <div style={{ ...styles.winnerName, color: KID_COLORS.players[winnerData.index] }}>
                  {winnerData.name}
                </div>
                <div style={styles.winnerScore}>
                  ⭐ {winnerData.score} points ⭐
                </div>
              </>
            )}
            {!winnerData && (
              <div style={styles.tieScores}>
                <div style={{ color: KID_COLORS.players[0] }}>
                  {players[0]?.name || 'Player 1'}: {scores[0]}
                </div>
                <div style={{ color: KID_COLORS.players[1] }}>
                  {players[1]?.name || 'Player 2'}: {scores[1]}
                </div>
              </div>
            )}

            {selectedClass && onGivePoints && winnerData && !pointsGiven && (
              <div style={styles.pointsSection}>
                <div style={styles.pointsLabel}>Give points to winner:</div>
                <div style={styles.pointsButtons}>
                  {[1, 2, 3, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => setPointsToGive(val)}
                      style={{
                        ...styles.pointButton,
                        background: pointsToGive === val
                          ? 'linear-gradient(135deg, #10B981, #059669)'
                          : '#E5E7EB',
                        color: pointsToGive === val ? '#fff' : '#374151'
                      }}
                    >
                      +{val}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleGivePointsToWinner}
                  style={styles.givePointsButton}
                >
                  🎁 Give {pointsToGive} Point{pointsToGive !== 1 ? 's' : ''} to {winnerData.name}
                </button>
              </div>
            )}

            {pointsGiven && (
              <div style={styles.pointsGivenMessage}>
                ✅ {pointsToGive} point{pointsToGive !== 1 ? 's' : ''} given to {winnerData?.name}!
              </div>
            )}

            <div style={styles.modalActionButtons}>
              <button
                onClick={handleWinnerModalClose}
                style={styles.playAgainButton}
              >
                🎮 Play Again
              </button>

              <button
                onClick={onExitToPortal}
                style={styles.exitPortalButton}
              >
                🚪 Exit to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirmation && (
        <div style={styles.modalOverlay}>
          <div style={styles.confirmModal}>
            <div style={styles.warningIcon}>⚠️</div>
            <div style={styles.confirmTitle}>Exit Game?</div>
            <div style={styles.confirmButtons}>
              <button onClick={handleExit} style={styles.confirmExitButton}>OK</button>
              <button onClick={() => setShowExitConfirmation(false)} style={styles.confirmStayButton}>Stay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(180deg, #FFF5E6 0%, #FFB6C1 50%, #87CEEB 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
    fontFamily: '"Comic Sans MS", "Comic Sans", cursive'
  },
  loadingContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #FFF5E6, #FFB6C1)',
    gap: 20,
    fontFamily: '"Comic Sans MS", "Comic Sans", cursive'
  },
  spinner: { fontSize: '64px', animation: 'spin 1s linear infinite' },
  loadingText: { fontSize: '20px', fontWeight: 'bold', color: '#333' },
  verticalRoundCounter: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: 'translateY(-50%) rotate(180deg)',
    writingMode: 'vertical-rl',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    background: '#fff',
    padding: '16px 8px',
    borderRadius: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    zIndex: 50,
    letterSpacing: '2px'
  },
  playerSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 15px',
    gap: 15
  },
  optionsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    width: '100%',
    maxWidth: 350,
    padding: 5
  },
  optionButton: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 14,
    border: '3px solid #E0E0E0',
    background: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },
  optionLetter: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: 14,
    flexShrink: 0
  },
  optionText: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#333'
  },
  scorePanel: {
    background: '#FFFFFF',
    padding: '8px 24px',
    borderRadius: 16,
    border: '3px solid #E0E0E0',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  playerName: { fontSize: '16px', fontWeight: 'bold' },
  scoreValue: { fontSize: '28px', fontWeight: 'bold' },
  centralContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    padding: '10px 0',
    width: '100%'
  },
  questionBox: {
    background: '#FFFFFF',
    padding: '15px 20px',
    borderRadius: 16,
    border: '4px solid #FFD700',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '90%',
    maxWidth: 400
  },
  questionText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    wordWrap: 'break-word'
  },
  questionImage: {
    width: '100%',
    height: 'auto',
    maxHeight: 150,
    objectFit: 'contain',
    borderRadius: 8
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 1000
  },
  modalContent: {
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    borderRadius: 24,
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
    border: '4px solid #fff',
    maxWidth: '90vw',
    maxHeight: '85vh',
    overflowY: 'auto'
  },
  trophyIcon: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
  },
  winnerTitle: { fontSize: '32px', fontWeight: 900, color: '#1f2937' },
  winnerName: { fontSize: '28px', fontWeight: 700 },
  winnerScore: { fontSize: '18px', fontWeight: 600, color: '#374151' },
  tieScores: { display: 'flex', flexDirection: 'column', gap: 10, fontSize: '18px', fontWeight: 600 },
  pointsSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' },
  pointsLabel: { fontSize: '14px', fontWeight: 600, color: '#374151' },
  pointsButtons: { display: 'flex', gap: 8 },
  pointButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    fontSize: 18,
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer'
  },
  givePointsButton: {
    padding: '10px 24px',
    fontSize: 14,
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer'
  },
  pointsGivenMessage: {
    fontSize: 14,
    fontWeight: 700,
    color: '#10B981',
    textAlign: 'center',
    padding: '10px 16px',
    background: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 10,
    border: '2px solid #10B981'
  },
  modalActionButtons: { display: 'flex', gap: '16px', marginTop: '10px', width: '100%', justifyContent: 'center' },
  playAgainButton: {
    padding: '12px 32px',
    fontSize: 16,
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
    color: '#fff',
    border: 'none',
    borderRadius: 14,
    cursor: 'pointer'
  },
  exitPortalButton: {
    padding: '12px 32px',
    fontSize: 16,
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #FF6B6B, #EE5253)',
    color: '#fff',
    border: 'none',
    borderRadius: 14,
    cursor: 'pointer'
  },
  confirmModal: {
    background: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    border: '4px solid #FF6B6B'
  },
  warningIcon: { fontSize: '48px' },
  confirmTitle: { fontSize: '24px', fontWeight: 'bold', color: '#FF6B6B' },
  confirmButtons: { display: 'flex', gap: 16 },
  confirmExitButton: { padding: '10px 32px', background: '#FF6B6B', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer' },
  confirmStayButton: { padding: '10px 32px', background: '#4ECDC4', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer' }
};

export default QuizGameMobile;
