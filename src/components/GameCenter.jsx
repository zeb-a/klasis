import { useState, useEffect, Suspense, lazy } from 'react';
import useIsMobile from '../hooks/useIsMobile';

// Lazy load all game components for better performance
const TornadoGame = lazy(() => import('./games/tornado/TornadoGame'));
const TornadoSetup = lazy(() => import('./games/tornado/TornadoSetup'));
const FaceOffGame = lazy(() => import('./games/faceoff/FaceOffGame'));
const FaceOffGameMobile = lazy(() => import('./games/faceoff/FaceOffGameMobile'));
const FaceOffSetup = lazy(() => import('./games/faceoff/FaceOffSetup'));
const MemoryMatchGame = lazy(() => import('./games/memorymatch/MemoryMatchGame'));
const MemoryMatchSetup = lazy(() => import('./games/memorymatch/MemoryMatchSetup'));
const QuizGame = lazy(() => import('./games/quiz/QuizGame'));
const QuizGameMobile = lazy(() => import('./games/quiz/QuizGameMobile'));
const QuizSetup = lazy(() => import('./games/quiz/QuizSetup'));
const MotoRaceGame = lazy(() => import('./games/motorace/MotoRaceGame'));
const MotoRaceSetup = lazy(() => import('./games/motorace/MotoRaceSetup'));
const HorseRaceGame = lazy(() => import('./games/horserace/HorseRaceGame'));
const HorseRaceSetup = lazy(() => import('./games/horserace/HorseRaceSetup'));
const SpellTheWordGame = lazy(() => import('./games/spelltheword/SpellTheWordGame'));
const SpellTheWordSetup = lazy(() => import('./games/spelltheword/SpellTheWordSetup'));

import api from '../services/api';
import { useTranslation } from '../i18n';

import { usePageHelp } from '../PageHelpContext';

// Loading component for lazy-loaded games
const GameLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading game...</p>
    </div>
  </div>
);

const GameCenter = ({ onBack, classes: externalClasses, isReplay: externalIsReplay }) => {
  const { t } = useTranslation();
  const { setPageId } = usePageHelp();
  const isMobile = useIsMobile();
  
  // Check if this is a replay (coming back from game) or fresh start (from portal)
  // We use localStorage to track this state
  const checkIsReplay = () => {
    const storedIsReplay = localStorage.getItem('torenado_is_replay');
    if (storedIsReplay === 'true') {
      // Clear it so next fresh load goes to config
      localStorage.removeItem('torenado_is_replay');
      return true;
    }
    // Check if we're coming from ClassDashboard by checking for selected_class_id
    const selectedClassId = localStorage.getItem('selected_class_id');
    if (selectedClassId) {
      // Coming from ClassDashboard, treat as fresh start
      return false;
    }
    // Check if we're coming from TeacherPortal by checking localStorage
    const hasStoredConfig = localStorage.getItem('torenado_config');
    return !hasStoredConfig; // If no stored config, it's a replay/back-from-game scenario
  };

  const isReplay = externalIsReplay !== undefined ? externalIsReplay : checkIsReplay();
  const initialGameState = 'config';
  
  // Game type: 'tornado', 'faceoff', or 'memorymatch'
  const [gameType, setGameType] = useState(localStorage.getItem('selected_game_type') || 'tornado');
  
  const [gameState, setGameState] = useState(initialGameState); // select-game, select-class, select-students, config, playing, finished
  const [classes, setClasses] = useState(externalClasses || []);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [user, setUser] = useState(null);
  const [classesLoaded, setClassesLoaded] = useState(false);
  const [config, setConfig] = useState({
    playerCount: 2,
    squareCount: 20,
    numberedSquares: true,
    tornadoCount: 'random',
    decorativeElements: [],
  });

  const [faceOffConfig, setFaceOffConfig] = useState({
    rounds: 5,
    mode: 'words', // 'words' (show word, pick image) or 'pictures' (show picture, pick word)
    wordImagePairs: []
  });
  const [memoryMatchConfig, setMemoryMatchConfig] = useState({
    rounds: 5,
    contentItems: []
  });
  const [memoryMatchBulkUploadImages, setMemoryMatchBulkUploadImages] = useState([]);
  const [isDraggingHorseRace, setIsDraggingHorseRace] = useState(false);
  const [quizConfig, setQuizConfig] = useState({
    questions: [] // { id, question, image?, options: [a,b,c,d], correct: 0-3 }
  });
  const [invalidQuestions, setInvalidQuestions] = useState({}); // { questionId: { emptyQuestion: boolean, notEnoughOptions: boolean } }
  const [playerSelectionError, setPlayerSelectionError] = useState(false);

  // Load stored quiz questions on mount
  useEffect(() => {
    const storedQuestions = localStorage.getItem('stored_quiz_questions');
    const gameType = localStorage.getItem('selected_game_type');
    if (storedQuestions && gameType === 'quiz') {
      try {
        const parsed = JSON.parse(storedQuestions);
        setQuizConfig({ questions: parsed });
        localStorage.removeItem('stored_quiz_questions');
      } catch (e) {
      }
    }
  }, []);
  const [motoRaceConfig, setMotoRaceConfig] = useState({
    contentType: 'text', // 'text' | 'images'
    items: [], // strings (words) or image data URLs
    playerCount: 2
  });
  const [horseRaceConfig, setHorseRaceConfig] = useState({
    contentType: 'text', // 'text' | 'images'
    items: [], // unified array for both words and images
    playerCount: 2
  });
  const [spellTheWordConfig, setSpellTheWordConfig] = useState({
    words: [], // { id, word, image }
    playerCount: 2
  });
  const [players, setPlayers] = useState([]);
  const [pixiContainer, setPixiContainer] = useState(null);
  const [prefilled, setPrefilled] = useState(false);
  const [isTeamMode, setIsTeamMode] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);

  const addFaceOffWordImagePair = (word, image) => {
    setFaceOffConfig(prev => ({
      ...prev,
      wordImagePairs: [...prev.wordImagePairs, { word, image }]
    }));
  };

  // Handle giving points to game winners
  const handleGivePoints = async (studentsArray, points = 1) => {
    if (!selectedClass || !selectedClass.students) return;

    const userEmail = user?.email || JSON.parse(localStorage.getItem('classABC_logged_in') || '{}')?.email || 'anonymous';

    // Find the student objects in the class - use string comparison for IDs to handle type mismatches
    const studentsToUpdate = studentsArray.map(playerData => {
      // Try to find by ID first (compare as strings to handle type mismatch)
      const foundById = selectedClass.students.find(s =>
        String(s.id) === String(playerData.id)
      );

      // Fallback: try to find by name if ID doesn't match
      if (!foundById && playerData.name) {
        const foundByName = selectedClass.students.find(s =>
          s.name === playerData.name
        );
        return foundByName;
      }

      return foundById;
    }).filter(s => s !== null);

    if (studentsToUpdate.length === 0) {
      return;
    }
    // Update each student's score and history
    const updatedStudents = selectedClass.students.map(student => {
      const shouldUpdate = studentsToUpdate.find(s => String(s.id) === String(student.id));
      if (!shouldUpdate) return student;

      const historyEntry = {
        label: 'Game Winner',
        pts: points,
        type: 'wow',
        timestamp: new Date().toISOString()
      };

      return {
        ...student,
        score: (student.score || 0) + points,
        history: [...(student.history || []), historyEntry]
      };
    });

    // Update the class
    const updatedClass = {
      ...selectedClass,
      students: updatedStudents
    };

    // Update local state
    setSelectedClass(updatedClass);
    setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));

    // Save to backend
    try {
      await api.saveClasses(userEmail, [updatedClass]);

    } catch (error) {
    }
  };

  // Set pageId for help context based on game state
  useEffect(() => {
    if (gameState === 'config') {
      const pageIdMap = {
        'tornado': 'tornado-config',
        'faceoff': 'faceoff-config',
        'memorymatch': 'memorymatch-config',
        'quiz': 'quiz-config',
        'motorace': 'motorace-config',
        'horserace': 'horserace-config',
        'spelltheword': 'spelltheword-config'
      };
      setPageId(pageIdMap[gameType] || 'games-config');
      // Update URL hash for config state without triggering popstate
      const targetHash = `#${gameType}`;
      if (window.location.hash !== targetHash) {
        window.history.replaceState(null, '', targetHash);
      }
    } else if (gameState === 'playing') {
      const pageIdMap = {
        'tornado': 'tornado-game',
        'faceoff': 'faceoff-game',
        'memorymatch': 'memorymatch-game',
        'quiz': 'quiz-game',
        'motorace': 'motorace-game',
        'horserace': 'horserace-game',
        'spelltheword': 'spelltheword-game'
      };
      setPageId(pageIdMap[gameType] || 'games');
      // Update URL hash for playing state without triggering popstate
      const targetHash = `#${gameType}-play`;
      if (window.location.hash !== targetHash) {
        window.history.replaceState(null, '', targetHash);
      }
    } else {
      setPageId('games');
      // Reset hash when not in config or playing state
      if (window.location.hash !== '#torenado') {
        window.history.replaceState(null, '', '#torenado');
      }
    }
  }, [gameState, gameType, setPageId]);

  // Load user and classes
  useEffect(() => {
    const storedUser = localStorage.getItem('classABC_logged_in');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const loadClasses = async () => {
      try {
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const userEmail = parsedUser?.email || 'anonymous';
        const token = localStorage.getItem('classABC_pb_token') || localStorage.getItem('classABC_token');
        if (token) api.setToken(token);

        let remote = await api.getClasses(userEmail);

        if (Array.isArray(remote) && remote.length > 0) {
          setClasses(remote);
        } else {
          // Fallback to localStorage if remote is empty
          const key = `classABC_data_${userEmail}`;
          const localClasses = JSON.parse(localStorage.getItem(key)) || [];

          setClasses(localClasses);
        }
      } catch (e) {

        // Fallback to localStorage
        try {
          const storedUser = localStorage.getItem('classABC_logged_in');
          const parsedUser = storedUser ? JSON.parse(storedUser) : null;
          const userEmail = parsedUser?.email || 'anonymous';
          const key = `classABC_data_${userEmail}`;
          const localClasses = JSON.parse(localStorage.getItem(key)) || [];

          setClasses(localClasses);
        } catch (fallbackError) {
          setClasses([]);
        }
      }
      setClassesLoaded(true);
    };

    loadClasses();
  }, []);

  // Pre-fill selections from localStorage if available
  useEffect(() => {
    if (classesLoaded && !prefilled && !isReplay) {
      // Check if TeacherPortal saved selections
      const savedPlayers = localStorage.getItem('torenado_players');
      const savedConfig = localStorage.getItem('torenado_config');
      const savedGameType = localStorage.getItem('selected_game_type');
      const savedClassId = localStorage.getItem('selected_class_id');

      // If we have selected_class_id (from ClassDashboard), use it directly
      if (savedClassId && classes.length > 0) {
        const targetClass = classes.find(c => c.id === savedClassId || String(c.id) === savedClassId);
        if (targetClass) {
          setSelectedClass(targetClass);
          setPrefilled(true);
          setGameState('config');
        }
      }
      // Otherwise, check for TeacherPortal saved selections
      else if (savedPlayers && savedConfig) {
        try {
          const players = JSON.parse(savedPlayers);
          const configData = JSON.parse(savedConfig);

          // Don't set hash here - let hashchange listener handle it
          if (savedGameType) {
            setGameType(savedGameType);
          }

          // Find the class
          const targetClass = classes.find(c => c.id === configData.classId);
          if (targetClass) {

            setSelectedClass(targetClass);

            // Set team mode if applicable
            if (configData.isTeamMode) {
              setIsTeamMode(true);
              setPlayerCount(configData.playerCount || 2);
            }

            // Convert players back to student objects (only for individual mode)
            const students = players.map(player => {
              const student = targetClass.students.find(s => s.id === player.id);
              return student || {
                id: player.id,
                name: player.name,
                // Use a default gender if not found
                gender: 'boy'
              };
            }).filter(s => s !== null);

            setSelectedStudents(students);
            setPrefilled(true);

            // Clean up localStorage to avoid re-using on reload
            localStorage.removeItem('torenado_players');
            localStorage.removeItem('torenado_config');
          }
        } catch (e) {
        }
      }
    }
  }, [classesLoaded, classes, prefilled]);

  // When classes are passed externally, use them directly
  useEffect(() => {
    if (externalClasses && externalClasses.length > 0) {
      setClasses(externalClasses);
      setClassesLoaded(true);
    }
  }, [externalClasses]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      {/* Game Selection Screen */}
      {gameState === 'select-game' && (
        <div style={{
          width: '100%',
          maxWidth: '600px',
          padding: '40px',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '30px',
          border: '5px solid #4ECDC4',
          boxShadow: '0 20px 60px rgba(78, 205, 196, 0.3)',
          marginTop: '100px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              fontFamily: 'Comic Sans MS, cursive, sans-serif'
            }}>
              🎮 {t('games.choose')}
            </h2>
            <button
              onClick={onBack}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)'
              }}
            >
              ← {t('games.back')}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setGameType('tornado');
                localStorage.setItem('selected_game_type', 'tornado');
                setGameState('config');
              }}
              style={{
                flex: 1,
                minWidth: '140px',
                padding: '40px 20px',
                fontSize: '24px',
                fontWeight: 'bold',
                border: '4px solid',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, #4ECDC4, #95E1D3)',
                color: '#fff',
                borderColor: '#4ECDC4',
                boxShadow: '0 6px 25px rgba(78, 205, 196, 0.4)',
                transform: 'scale(1.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 8px 30px rgba(78, 205, 196, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 6px 25px rgba(78, 205, 196, 0.4)';
              }}
            >
              <div style={{ fontSize: '48px' }}>🌪️</div>
              <div>{t('games.tornado')}</div>
            </button>

            <button
              onClick={() => {
                setGameType('faceoff');
                localStorage.setItem('selected_game_type', 'faceoff');
                setGameState('config');
              }}
              style={{
                flex: 1,
                minWidth: '140px',
                padding: '40px 20px',
                fontSize: '24px',
                fontWeight: 'bold',
                border: '4px solid',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
                color: '#fff',
                borderColor: '#FF6B6B',
                boxShadow: '0 6px 25px rgba(255, 107, 107, 0.4)',
                transform: 'scale(1.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 8px 30px rgba(255, 107, 107, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 6px 25px rgba(255, 107, 107, 0.4)';
              }}
            >
              <div style={{ fontSize: '48px' }}>⚡</div>
              <div>{t('games.faceoff')}</div>
            </button>

            <button
              onClick={() => {
                setGameType('memorymatch');
                localStorage.setItem('selected_game_type', 'memorymatch');
                setGameState('config');
              }}
              style={{
                flex: 1,
                minWidth: '140px',
                padding: '40px 20px',
                fontSize: '24px',
                fontWeight: 'bold',
                border: '4px solid',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
                color: '#fff',
                borderColor: '#8B5CF6',
                boxShadow: '0 6px 25px rgba(139, 92, 246, 0.4)',
                transform: 'scale(1.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 8px 30px rgba(139, 92, 246, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 6px 25px rgba(139, 92, 246, 0.4)';
              }}
            >
              <div style={{ fontSize: '48px' }}>🧠</div>
              <div>{t('games.memorymatch')}</div>
            </button>

            <button
              onClick={() => {
                setGameType('quiz');
                localStorage.setItem('selected_game_type', 'quiz');
                setGameState('config');
              }}
              style={{
                flex: 1,
                minWidth: '140px',
                padding: '40px 20px',
                fontSize: '24px',
                fontWeight: 'bold',
                border: '4px solid',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: gameType === 'quiz' ? 'linear-gradient(135deg, #0EA5E9, #06B6D4)' : 'rgba(255,255,255,0.3)',
                color: gameType === 'quiz' ? '#fff' : '#1E293B',
                borderColor: gameType === 'quiz' ? '#0EA5E9' : 'rgba(255,255,255,0.5)',
                boxShadow: gameType === 'quiz' ? '0 6px 25px rgba(14, 165, 233, 0.4)' : 'none',
                transform: 'scale(1.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #0EA5E9, #06B6D4)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#0EA5E9';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(14, 165, 233, 0.6)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                if (gameType !== 'quiz') {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.color = '#1E293B';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                  e.currentTarget.style.boxShadow = 'none';
                } else {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #0EA5E9, #06B6D4)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = '#0EA5E9';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(14, 165, 233, 0.4)';
                }
              }}
            >
              <div style={{ fontSize: '48px' }}>🎯</div>
              <div>{t('games.quiz')}</div>
            </button>

            <button
              onClick={() => {
                setGameType('motorace');
                localStorage.setItem('selected_game_type', 'motorace');
                setGameState('config');
              }}
              style={{
                flex: 1,
                minWidth: '140px',
                padding: '40px 20px',
                fontSize: '24px',
                fontWeight: 'bold',
                border: '4px solid',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: gameType === 'motorace' ? 'linear-gradient(135deg, #F97316, #EA580C)' : 'rgba(255,255,255,0.3)',
                color: gameType === 'motorace' ? '#fff' : '#1E293B',
                borderColor: gameType === 'motorace' ? '#F97316' : 'rgba(255,255,255,0.5)',
                boxShadow: gameType === 'motorace' ? '0 6px 25px rgba(249, 115, 22, 0.4)' : 'none',
                transform: 'scale(1.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #F97316, #EA580C)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#F97316';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(249, 115, 22, 0.6)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                if (gameType !== 'motorace') {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.color = '#1E293B';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                  e.currentTarget.style.boxShadow = 'none';
                } else {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #F97316, #EA580C)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = '#F97316';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(249, 115, 22, 0.4)';
                }
              }}
            >
              <div style={{ fontSize: '48px' }}>🏍️</div>
              <div>{t('games.motorace')}</div>
            </button>

            <button
              onClick={() => {
                setGameType('horserace');
                localStorage.setItem('selected_game_type', 'horserace');
                setGameState('config');
              }}
              style={{
                flex: 1,
                minWidth: '140px',
                padding: '40px 20px',
                fontSize: '24px',
                fontWeight: 'bold',
                border: '4px solid',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: gameType === 'horserace' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'rgba(255,255,255,0.3)',
                color: gameType === 'horserace' ? '#fff' : '#1E293B',
                borderColor: gameType === 'horserace' ? '#F59E0B' : 'rgba(255,255,255,0.5)',
                boxShadow: gameType === 'horserace' ? '0 6px 25px rgba(245, 158, 11, 0.4)' : 'none',
                transform: 'scale(1.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #F59E0B, #D97706)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#F59E0B';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(245, 158, 11, 0.6)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                if (gameType !== 'horserace') {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.color = '#1E293B';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                  e.currentTarget.style.boxShadow = 'none';
                } else {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #F59E0B, #D97706)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = '#F59E0B';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(245, 158, 11, 0.4)';
                }
              }}
            >
              <div style={{ fontSize: '48px' }}>🐎</div>
              <div>{t('games.horserace')}</div>
            </button>

            <button
              onClick={() => {
                setGameType('spelltheword');
                localStorage.setItem('selected_game_type', 'spelltheword');
                setGameState('config');
              }}
              style={{
                padding: '20px',
                fontSize: '16px',
                fontWeight: '700',
                border: '3px solid',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: gameType === 'spelltheword' ? 'linear-gradient(135deg, #EC4899, #BE185D)' : 'rgba(255,255,255,0.3)',
                color: gameType === 'spelltheword' ? '#fff' : '#1E293B',
                borderColor: gameType === 'spelltheword' ? '#EC4899' : 'rgba(255,255,255,0.5)',
                boxShadow: gameType === 'spelltheword' ? '0 6px 25px rgba(236, 72, 153, 0.4)' : 'none',
                transform: 'scale(1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                if (gameType !== 'spelltheword') {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #EC4899, #BE185D)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = '#EC4899';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(236, 72, 153, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                if (gameType !== 'spelltheword') {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.color = '#1E293B';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                }
              }}
            >
              <div style={{ fontSize: '48px' }}>🔤</div>
              <div>Spell the Word</div>
            </button>

          </div>
        </div>
      )}

      {/* Game Configuration Screen - Tornado */}
      {gameState === 'config' && gameType === 'tornado' && (
        <TornadoSetup
          config={config}
          setConfig={setConfig}
          selectedClass={selectedClass}
          onBack={onBack}
          onGameStart={(players) => {
            setPlayers(players);
            setGameState('playing');
          }}
          selectedStudents={selectedStudents}
          setSelectedStudents={setSelectedStudents}
          isTeamMode={isTeamMode}
          setIsTeamMode={setIsTeamMode}
          playerCount={playerCount}
          setPlayerCount={setPlayerCount}
          isReplay={isReplay}
        />
      )}

      {/* FaceOff Configuration Screen */}
      {gameState === 'config' && gameType === 'faceoff' && (
        <FaceOffSetup
          faceOffConfig={faceOffConfig}
          setFaceOffConfig={setFaceOffConfig}
          selectedClass={selectedClass}
          onBack={onBack}
          onGameStart={(players) => {
            setPlayers(players);
            setGameState('playing');
          }}
          selectedStudents={selectedStudents}
          setSelectedStudents={setSelectedStudents}
          addWordImagePair={addFaceOffWordImagePair}
        />
      )}

      {/* MemoryMatch Configuration Screen */}
      {gameState === 'config' && gameType === 'memorymatch' && (
        <MemoryMatchSetup
          memoryMatchConfig={memoryMatchConfig}
          setMemoryMatchConfig={setMemoryMatchConfig}
          memoryMatchBulkUploadImages={memoryMatchBulkUploadImages}
          setMemoryMatchBulkUploadImages={setMemoryMatchBulkUploadImages}
          selectedClass={selectedClass}
          onBack={onBack}
          onGameStart={(players) => {
            setPlayers(players);
            setGameState('playing');
          }}
          selectedStudents={selectedStudents}
          setSelectedStudents={setSelectedStudents}
        />
      )}

      {/* Quiz Configuration Screen */}
      {gameState === 'config' && gameType === 'quiz' && (
        <QuizSetup
          quizConfig={quizConfig}
          setQuizConfig={setQuizConfig}
          selectedClass={selectedClass}
          onBack={onBack}
          onGameStart={(players) => {
            setPlayers(players);
            setGameState('playing');
          }}
          selectedStudents={selectedStudents}
          setSelectedStudents={setSelectedStudents}
          playerSelectionError={playerSelectionError}
          setPlayerSelectionError={setPlayerSelectionError}
          invalidQuestions={invalidQuestions}
          setInvalidQuestions={setInvalidQuestions}
        />
      )}

      {/* MotoRace Configuration Screen */}
      {gameState === 'config' && gameType === 'motorace' && (
        <MotoRaceSetup
          motoRaceConfig={motoRaceConfig}
          setMotoRaceConfig={setMotoRaceConfig}
          selectedClass={selectedClass}
          onBack={onBack}
          onGameStart={(players) => {
            setPlayers(players);
            setGameState('playing');
          }}
          selectedStudents={selectedStudents}
          setSelectedStudents={setSelectedStudents}
        />
      )}

      {/* Spell The Word Configuration Screen */}
      {gameState === 'config' && gameType === 'spelltheword' && (
        <SpellTheWordSetup
          spellTheWordConfig={spellTheWordConfig}
          setSpellTheWordConfig={setSpellTheWordConfig}
          selectedClass={selectedClass}
          onBack={onBack}
          onGameStart={(players) => {
            setPlayers(players);
            setGameState('playing');
          }}
          selectedStudents={selectedStudents}
          setSelectedStudents={setSelectedStudents}
        />
      )}

      {/* Horse Race Configuration Screen */}
      {gameState === 'config' && gameType === 'horserace' && (
        <HorseRaceSetup
          horseRaceConfig={horseRaceConfig}
          setHorseRaceConfig={setHorseRaceConfig}
          selectedClass={selectedClass}
          onBack={onBack}
          onGameStart={(players) => {
            setPlayers(players);
            setGameState('playing');
          }}
          selectedStudents={selectedStudents}
          setSelectedStudents={setSelectedStudents}
        />
      )}

      {gameState === 'playing' && gameType === 'tornado' && (
        <Suspense fallback={<GameLoader />}>
          <TornadoGame
            config={config}
            players={players.map((p, i) => ({
              id: typeof p === 'string' ? i : (p?.id || i),
              name: typeof p === 'string' ? (p || `Player ${i + 1}`) : (p?.name || `Player ${i + 1}`),
              score: typeof p === 'string' ? 0 : (p?.score || 0),
              position: typeof p === 'string' ? 0 : (p?.position || 0),
              color: typeof p === 'string' ? ['#00d9ff', '#ff00ff', '#00ff88', '#ffcc00'][i] : (p?.color || ['#00d9ff', '#ff00ff', '#00ff88', '#ffcc00'][i])
            }))}
            onGameEnd={() => setGameState('finished')}
            onBackToSetup={() => {
              setGameState('config');
            }}
            onBack={onBack}
            onExitToPortal={onBack}
            selectedClass={selectedClass}
            onGivePoints={handleGivePoints}
          />
        </Suspense>
      )}

      {gameState === 'playing' && gameType === 'faceoff' && (
        <Suspense fallback={<GameLoader />}>
          {isMobile && players.length >= 2 ? (
            <FaceOffGameMobile
              key="faceoff-mobile"
              config={faceOffConfig}
              players={players.map((p, i) => ({
                id: typeof p === 'string' ? i : (p?.id || i),
                name: typeof p === 'string' ? (p || `Player ${i + 1}`) : (p?.name || `Player ${i + 1}`),
                score: 0,
                color: typeof p === 'string' ? ['#00d9ff', '#ff00ff', '#00ff88', '#ffcc00'][i] : (p?.color || ['#00d9ff', '#ff00ff', '#00ff88', '#ffcc00'][i])
              }))}
              onGameEnd={() => setGameState('finished')}
              onBackToSetup={() => {
                localStorage.setItem('faceoff_is_replay', 'true');
                setGameState('config');
              }}
              onExitToPortal={onBack}
              selectedClass={selectedClass}
              onGivePoints={handleGivePoints}
            />
          ) : (
            <FaceOffGame
              key="faceoff-desktop"
              config={faceOffConfig}
              players={players.map((p, i) => ({
                id: typeof p === 'string' ? i : (p?.id || i),
                name: typeof p === 'string' ? (p || `Player ${i + 1}`) : (p?.name || `Player ${i + 1}`),
                score: 0,
                color: typeof p === 'string' ? ['#00d9ff', '#ff00ff', '#00ff88', '#ffcc00'][i] : (p?.color || ['#00d9ff', '#ff00ff', '#00ff88', '#ffcc00'][i])
              }))}
              onGameEnd={() => setGameState('finished')}
              onBackToSetup={() => {
                localStorage.setItem('faceoff_is_replay', 'true');
                setGameState('config');
              }}
              onExitToPortal={onBack}
              selectedClass={selectedClass}
              onGivePoints={handleGivePoints}
            />
          )}
        </Suspense>
      )}

      {gameState === 'playing' && gameType === 'memorymatch' && (
        <Suspense fallback={<GameLoader />}>
          <MemoryMatchGame
            contentItems={memoryMatchConfig.contentItems}
            onBack={onBack}
            onReset={() => setGameState('config')}
            classColor="#8B5CF6"
            players={players}
            selectedClass={selectedClass}
            onGivePoints={handleGivePoints}
          />
        </Suspense>
      )}

      {gameState === 'playing' && gameType === 'quiz' && (
        <Suspense fallback={<GameLoader />}>
          {isMobile && players.length >= 2 ? (
            <QuizGameMobile
              config={quizConfig}
              players={players}
              onGameEnd={() => setGameState('finished')}
              onBackToSetup={() => {
                localStorage.setItem('quiz_is_replay', 'true');
                setGameState('config');
              }}
              onExitToPortal={onBack}
              selectedClass={selectedClass}
              onGivePoints={handleGivePoints}
            />
          ) : (
            <QuizGame
              questions={quizConfig.questions.filter(q => q.question?.trim() && (q.options || []).filter(o => o?.trim()).length >= 2 && (q.options || [])[q.correct]?.trim())}
              onBack={() => setGameState('config')}
              classColor="#0EA5E9"
              players={players}
              autoStart={true}
              selectedClass={selectedClass}
              onGivePoints={handleGivePoints}
            />
          )}
        </Suspense>
      )}

      {gameState === 'playing' && gameType === 'motorace' && (
        <Suspense fallback={<GameLoader />}>
          <MotoRaceGame
            items={motoRaceConfig.items}
            contentType={motoRaceConfig.contentType}
            players={players}
            onBack={() => setGameState('config')}
            selectedClass={selectedClass}
            onGivePoints={handleGivePoints}
          />
        </Suspense>
      )}

      {gameState === 'playing' && gameType === 'horserace' && (
        <Suspense fallback={<GameLoader />}>
          <HorseRaceGame
            items={horseRaceConfig.items || []}
            contentType={horseRaceConfig.contentType}
            players={players}
            onBack={() => setGameState('config')}
            onGivePoints={handleGivePoints}
          />
        </Suspense>
      )}

      {gameState === 'playing' && gameType === 'spelltheword' && (
        <Suspense fallback={<GameLoader />}>
          <SpellTheWordGame
            words={spellTheWordConfig.words}
            players={players}
            onBack={() => setGameState('config')}
            selectedClass={selectedClass}
            onGivePoints={handleGivePoints}
            autoStart={true}
          />
        </Suspense>
      )}

      {gameState === 'finished' && (
        <div style={{
          width: '100%',
          maxWidth: '800px',
          padding: '40px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '30px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          marginTop: '50px'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #ffcc00, #ff6600)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            marginBottom: '30px',
            animation: 'pulse 1s ease-in-out infinite'
          }}>
            🏆 {t('games.game_over')}! 🏆
          </h1>

          <div style={{ marginBottom: '40px' }}>
            {players
              .map((p, i) => {
                const playerName = typeof p === 'string' ? p : p?.name;
                return { name: playerName || `Player ${i + 1}`, color: ['#00d9ff', '#ff00ff', '#00ff88', '#ffcc00'][i] };
              })
              .sort((a, b) => (b.score || 0) - (a.score || 0))
              .map((player, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    marginBottom: '15px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '15px',
                    border: `2px solid ${player.color}`,
                    boxShadow: `0 0 20px ${player.color}50`
                  }}
                >
                  <div style={{
                    fontSize: `${24 - index * 4}px`,
                    fontWeight: 'bold',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    {index === 0 && '🥇 '}
                    {index === 1 && '🥈 '}
                    {index === 2 && '🥉 '}
                    {player.name}
                  </div>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: '900',
                    color: player.color
                  }}>
                    {player.score} pts
                  </div>
                </div>
              ))}
          </div>

          <button
            onClick={() => {
              // Set replay flag so we show compact menus on next load
              localStorage.setItem('torenado_is_replay', 'true');
              setSelectedStudents([]);
              setSelectedClass(null);
              setIsTeamMode(false);
              setPlayerCount(2);
              setGameState('select-class');
            }}
            style={{
              width: '100%',
              padding: '25px',
              fontSize: '24px',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: 'linear-gradient(135deg, #00d9ff, #00ff88)',
              color: '#000',
              boxShadow: '0 10px 40px rgba(0, 217, 255, 0.5)'
            }}
          >
            🔄 {t('games.play_again')}
          </button>

          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default GameCenter;
