import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, CheckCircle, XCircle, Volume2 } from 'lucide-react';

const SpellTheWordGame = () => {
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, finished
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef(null);

  const words = [
    { word: 'APPLE', image: '🍎', hint: 'A red or green fruit' },
    { word: 'SCHOOL', image: '🏫', hint: 'Place where you learn' },
    { word: 'RAINBOW', image: '🌈', hint: 'Colorful arc in the sky' },
    { word: 'BUTTERFLY', image: '🦋', hint: 'Colorful flying insect' },
    { word: 'MOUNTAIN', image: '🏔️', hint: 'Very tall landform' },
    { word: 'OCEAN', image: '🌊', hint: 'Large body of water' },
    { word: 'FLOWER', image: '🌸', hint: 'Colorful plant bloom' },
    { word: 'GUITAR', image: '🎸', hint: 'Musical instrument with strings' }
  ];

  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  const startGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord.word);
    setCurrentImage(randomWord.image);
    setUserInput('');
    setFeedback('');
    setShowHint(false);
    setScore(0);
    setGameState('playing');
  };

  const checkSpelling = () => {
    if (userInput.toUpperCase() === currentWord) {
      setFeedback('correct');
      setScore(score + currentWord.length * 5);
      setTimeout(() => {
        nextWord();
      }, 2000);
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback('');
      }, 1500);
    }
  };

  const nextWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord.word);
    setCurrentImage(randomWord.image);
    setUserInput('');
    setFeedback('');
    setShowHint(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkSpelling();
    }
  };

  const playSound = () => {
    // Simulate word pronunciation
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
        {/* Game Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Spell The Word</h2>
                <p className="text-gray-600">Listen, look, and spell correctly!</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-500">Points</div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="p-6">
          {gameState === 'waiting' && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to practice spelling?</h3>
              <p className="text-gray-600 mb-6">Look at the image, listen to the word, and spell it correctly!</p>
              <button
                onClick={startGame}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
              >
                Start Game
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <div>
              {/* Word Display */}
              <div className="text-center mb-8">
                <div className="text-8xl mb-4">{currentImage}</div>
                <button
                  onClick={playSound}
                  className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors mb-4 flex items-center mx-auto"
                >
                  <Volume2 className="w-5 h-5 mr-2" />
                  Hear the Word
                </button>
                
                {/* Hint */}
                {showHint && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-yellow-800">
                      <strong>Hint:</strong> {words.find(w => w.word === currentWord)?.hint}
                    </p>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your spelling here..."
                    className="w-full max-w-md px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                    disabled={feedback !== ''}
                  />
                </div>

                {/* Feedback */}
                {feedback === 'correct' && (
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Correct! Well done!
                    </div>
                  </div>
                )}

                {feedback === 'incorrect' && (
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-lg">
                      <XCircle className="w-5 h-5 mr-2" />
                      Try again!
                    </div>
                    <p className="text-gray-500 mt-2">The correct spelling was: <strong>{currentWord}</strong></p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={checkSpelling}
                    disabled={feedback === 'correct' || userInput.trim() === ''}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Check Spelling
                  </button>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="bg-yellow-100 text-yellow-700 px-6 py-2 rounded-lg hover:bg-yellow-200 transition-colors"
                  >
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
                  <button
                    onClick={nextWord}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Skip Word
                  </button>
                </div>
              </div>
            </div>
          )}

          {gameState === 'finished' && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Great Practice!</h3>
              <p className="text-3xl font-bold text-green-600 mb-6">Final Score: {score}</p>
              <button
                onClick={startGame}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
              >
                Practice Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpellTheWordGame;
