import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Zap, Clock, Users } from 'lucide-react';

const TornadoGame = () => {
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentWord, setCurrentWord] = useState('');
  const [scatteredLetters, setScatteredLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const timerRef = useRef(null);

  const words = ['TORNADO', 'THUNDER', 'LIGHTNING', 'STORM', 'RAINBOW', 'CLOUD', 'WIND', 'WEATHER'];
  
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setGameState('finished');
    }
    return () => clearTimeout(timerRef.current);
  }, [gameState, timeLeft]);

  const startGame = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(word);
    setScatteredLetters(word.split('').sort(() => Math.random() - 0.5));
    setSelectedLetters([]);
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
  };

  const selectLetter = (index, letter) => {
    if (gameState !== 'playing') return;
    
    const newSelected = [...selectedLetters, { index, letter }];
    setSelectedLetters(newSelected);
    
    const formedWord = newSelected.map(item => item.letter).join('');
    if (formedWord === currentWord) {
      setScore(score + currentWord.length * 10);
      setTimeout(() => {
        const word = words[Math.floor(Math.random() * words.length)];
        setCurrentWord(word);
        setScatteredLetters(word.split('').sort(() => Math.random() - 0.5));
        setSelectedLetters([]);
      }, 1000);
    }
  };

  const clearSelection = () => {
    setSelectedLetters([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
        {/* Game Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Tornado Challenge</h2>
                <p className="text-gray-600">Form words before time runs out!</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center text-yellow-600">
                  <Trophy className="w-5 h-5 mr-1" />
                  <span className="text-2xl font-bold">{score}</span>
                </div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
              <div className="text-center">
                <div className="flex items-center text-red-600">
                  <Clock className="w-5 h-5 mr-1" />
                  <span className="text-2xl font-bold">{timeLeft}</span>
                </div>
                <div className="text-sm text-gray-500">Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="p-6">
          {gameState === 'waiting' && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to play Tornado Challenge?</h3>
              <p className="text-gray-600 mb-6">Rearrange the scattered letters to form the correct word before time runs out!</p>
              <button
                onClick={startGame}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold"
              >
                Start Game
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <div>
              {/* Target Word Display */}
              <div className="mb-8 text-center">
                <p className="text-sm text-gray-500 mb-2">Form this word:</p>
                <div className="text-3xl font-bold text-gray-900 tracking-wider">
                  {currentWord.split('').map((letter, index) => (
                    <span key={index} className="inline-block w-8 h-10 mx-1 border-b-2 border-gray-300 text-center">
                      {selectedLetters[index]?.letter || ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* Scattered Letters */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-4 text-center">Click letters in order:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {scatteredLetters.map((letter, index) => (
                    <button
                      key={index}
                      onClick={() => selectLetter(index, letter)}
                      disabled={selectedLetters.some(item => item.index === index)}
                      className={`w-14 h-14 rounded-lg font-bold text-xl transition-all transform hover:scale-110 ${
                        selectedLetters.some(item => item.index === index)
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg'
                      }`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Button */}
              <div className="text-center">
                <button
                  onClick={clearSelection}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {gameState === 'finished' && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Game Over!</h3>
              <p className="text-3xl font-bold text-yellow-600 mb-6">Final Score: {score}</p>
              <button
                onClick={startGame}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TornadoGame;
