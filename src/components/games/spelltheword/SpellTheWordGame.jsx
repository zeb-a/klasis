import { useEffect, useMemo, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

const LEFT_COLOR = 0xff6b9d;
const RIGHT_COLOR = 0x4ecdc4;
const SINGLE_COLOR = 0xffd93d;
const BG_GRADIENT_TOP = 0x667eea;
const BG_GRADIENT_BOTTOM = 0x764ba2;

const MOCK_PLAYERS = [
  { id: 'p1', name: 'Player 1' },
  { id: 'p2', name: 'Player 2' },
];

const MOCK_WORDS = [
  { id: '1', word: 'APPLE', image: null },
  { id: '2', word: 'ORANGE', image: null },
  { id: '3', word: 'BANANA', image: null },
  { id: '4', word: 'CAT', image: null },
  { id: '5', word: 'DOG', image: null },
];

class SoundManager {
  _ctx() {
    if (!this.__ctx) this.__ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.__ctx.state === 'suspended') this.__ctx.resume();
    return this.__ctx;
  }

  _osc(freq, type, dur, vol, when = 0, freqEnd = null) {
    try {
      const ctx = this._ctx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = type;
      o.frequency.setValueAtTime(freq, ctx.currentTime + when);
      if (freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + when + dur);
      g.gain.setValueAtTime(vol, ctx.currentTime + when);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + dur);
      o.start(ctx.currentTime + when);
      o.stop(ctx.currentTime + when + dur);
    } catch (_) {}
  }

  hover() { this._osc(1400, 'sine', 0.04, 0.08); }
  correct() { [523, 659, 784, 1047].forEach((f, i) => this._osc(f, 'sine', 0.2, 0.25, i * 0.06)); }
  wrong() { this._osc(300, 'sawtooth', 0.25, 0.18, 0, 150); }
  win() { [523, 659, 784, 1047, 1319].forEach((f, i) => this._osc(f, 'sine', 0.3, 0.28, i * 0.1)); }
  skip() { this._osc(800, 'sine', 0.1, 0.12); this._osc(600, 'sine', 0.1, 0.1, 0.06); }
}

function drawRoundRect(g, x, y, w, h, r, fill, stroke) {
  g.roundRect(x, y, w, h, r);
  if (fill !== undefined) g.fill(fill);
  if (stroke) g.stroke(stroke);
}

function makeText(text, style, x, y, anchorX = 0.5, anchorY = 0.5) {
  const t = new PIXI.Text({ text, style });
  t.anchor.set(anchorX, anchorY);
  t.x = x;
  t.y = y;
  return t;
}

export default function SpellTheWordGame({
  onBack,
  players = MOCK_PLAYERS,
  autoStart = true,
  words: propWords = MOCK_WORDS,
  classColor = '#4CAF50',
  selectedClass,
  onGivePoints,
}) {
  const wrapRef = useRef(null);
  const appRef = useRef(null);
  const textureCacheRef = useRef(new Map());
  const drawTokenRef = useRef(0);
  const boardHRef = useRef(294);
  const soundRef = useRef(new SoundManager());

  const [words, setWords] = useState(propWords || []);
  const [showPreview, setShowPreview] = useState(true);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guessedLettersLeft, setGuessedLettersLeft] = useState({});
  const [guessedLettersRight, setGuessedLettersRight] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [showResultSide, setShowResultSide] = useState('single');

  const [scoreLeft, setScoreLeft] = useState(0);
  const [scoreRight, setScoreRight] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [wrongLeft, setWrongLeft] = useState(0);
  const [wrongRight, setWrongRight] = useState(0);
  const [playerLeftDisabled, setPlayerLeftDisabled] = useState(false);
  const [playerRightDisabled, setPlayerRightDisabled] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  const [singlePlayerScore, setSinglePlayerScore] = useState(0);
  const [wrongSingle, setWrongSingle] = useState(0);
  const [singlePlayerDisabled, setSinglePlayerDisabled] = useState(false);
  const [pointsToGive, setPointsToGive] = useState(1);
  const [pointsGiven, setPointsGiven] = useState(false);

  const handleGivePoints = () => {
    if (!onGivePoints || pointsGiven) return;
    const winnerPlayer = winner === 'left' ? players[0] : players[1];
    onGivePoints(winnerPlayer?.id, pointsToGive);
    setPointsGiven(true);
  };

  const guessedLeftRef = useRef({});
  const guessedRightRef = useRef({});
  const leftDisabledRef = useRef(false);
  const rightDisabledRef = useRef(false);
  const singleDisabledRef = useRef(false);
  const scoreLeftRef = useRef(0);
  const scoreRightRef = useRef(0);

  useEffect(() => { guessedLeftRef.current = guessedLettersLeft; }, [guessedLettersLeft]);
  useEffect(() => { guessedRightRef.current = guessedLettersRight; }, [guessedLettersRight]);
  useEffect(() => { leftDisabledRef.current = playerLeftDisabled; }, [playerLeftDisabled]);
  useEffect(() => { rightDisabledRef.current = playerRightDisabled; }, [playerRightDisabled]);
  useEffect(() => { singleDisabledRef.current = singlePlayerDisabled; }, [singlePlayerDisabled]);
  useEffect(() => { scoreLeftRef.current = scoreLeft; }, [scoreLeft]);
  useEffect(() => { scoreRightRef.current = scoreRight; }, [scoreRight]);

  useEffect(() => {
    if (propWords && propWords.length > 0) {
      setWords(propWords);
      setShowPreview(true);
      setPlaying(false);
    }
  }, [propWords]);

  const faceOffMode = playing && players.length >= 2;
  const validWords = useMemo(() => (words || []).filter(w => w.word?.trim()), [words]);

  const displayLetters = useMemo(() => {
    const currentWord = validWords[currentIndex];
    if (!currentWord) return [];
    const wordChars = [...new Set(currentWord.word.toLowerCase().replace(/[^a-z]/g, '').split(''))];
    const remaining = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(l => !wordChars.includes(l)).sort(() => Math.random() - 0.5);
    const needed = Math.max(0, 12 - wordChars.length);
    return [...wordChars, ...remaining.slice(0, needed)].sort().slice(0, 12);
  }, [currentIndex, validWords]);

  useEffect(() => {
    if (!wrapRef.current) return;
    let mounted = true;

    (async () => {
      const app = new PIXI.Application();
      await app.init({
        width: wrapRef.current.clientWidth || window.innerWidth,
        height: wrapRef.current.clientHeight || window.innerHeight,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        backgroundColor: BG_GRADIENT_BOTTOM,
      });
      if (!mounted) {
        app.destroy(true, { children: true });
        return;
      }
      wrapRef.current.appendChild(app.canvas);
      appRef.current = app;
    })();

    return () => {
      mounted = false;
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
    };
  }, []);

  const resetRoundState = (nextIndex) => {
    setCurrentIndex(nextIndex);
    setGuessedLettersLeft({});
    setGuessedLettersRight({});
    setWrongLeft(0);
    setWrongRight(0);
    setPlayerLeftDisabled(false);
    setPlayerRightDisabled(false);
    setWrongSingle(0);
    setSinglePlayerDisabled(false);
    setShowResult(false);
  };

  const finishOrAdvance = (nextIndex) => {
    if (nextIndex >= validWords.length) {
      setGameOver(true);
      if (faceOffMode) {
        const l = scoreLeftRef.current;
        const r = scoreRightRef.current;
        setWinner(l > r ? 'left' : r > l ? 'right' : 'tie');
      }
    } else {
      resetRoundState(nextIndex);
    }
  };

  const handleLetterClick = (letter, side) => {
    const currentWord = validWords[currentIndex]?.word?.toUpperCase();
    if (!currentWord || gameOver || showResult) return;

    const isSingle = !faceOffMode;
    const letterUpper = letter.toUpperCase();
    const key = `${currentIndex}-${letterUpper}`;

    const guessedSet = isSingle ? guessedLeftRef.current : (side === 'left' ? guessedLeftRef.current : guessedRightRef.current);
    const setGuessedSet = isSingle ? setGuessedLettersLeft : (side === 'left' ? setGuessedLettersLeft : setGuessedLettersRight);

    if (guessedSet[key] !== undefined) return;

    const isCorrect = currentWord.includes(letterUpper);
    setGuessedSet(prev => ({ ...prev, [key]: isCorrect ? 'correct' : 'wrong' }));

    if (isCorrect) {
      soundRef.current.correct();
    } else {
      soundRef.current.wrong();
      if (isSingle) {
        setWrongSingle(prev => {
          const next = prev + 1;
          if (next >= 3) setSinglePlayerDisabled(true);
          return next;
        });
      } else if (side === 'left') {
        setWrongLeft(prev => {
          const next = prev + 1;
          if (next >= 3) setPlayerLeftDisabled(true);
          return next;
        });
      } else {
        setWrongRight(prev => {
          const next = prev + 1;
          if (next >= 3) setPlayerRightDisabled(true);
          return next;
        });
      }
    }

    setTimeout(() => {
      const letters = [...currentWord].filter(c => c !== ' ');
      const currentGuessed = isSingle ? guessedLeftRef.current : (side === 'left' ? guessedLeftRef.current : guessedRightRef.current);
      const allGuessed = letters.every(l => currentGuessed[`${currentIndex}-${l}`] === 'correct');

      if (allGuessed) {
        setShowResultSide(isSingle ? 'single' : side);
        setShowResult(true);
        soundRef.current.win();
        setTimeout(() => {
          if (isSingle) {
            setSinglePlayerScore(prev => prev + 1);
          } else if (side === 'left') {
            setScoreLeft(prev => {
              const next = prev + 1;
              scoreLeftRef.current = next;
              return next;
            });
          } else {
            setScoreRight(prev => {
              const next = prev + 1;
              scoreRightRef.current = next;
              return next;
            });
          }
          finishOrAdvance(currentIndex + 1);
        }, 1500);
        return;
      }

      const isDisabled = isSingle
        ? singleDisabledRef.current
        : (leftDisabledRef.current && rightDisabledRef.current);

      if (isDisabled) {
        setTimeout(() => finishOrAdvance(currentIndex + 1), 1500);
      }
    }, 50);
  };

  const getTexture = async (src) => {
    if (!src) return null;
    const cache = textureCacheRef.current;
    if (cache.has(src)) return cache.get(src);
    const img = new Image();
    img.src = src;
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
    const tex = PIXI.Texture.from(img);
    cache.set(src, tex);
    return tex;
  };

  useEffect(() => {
    const app = appRef.current;
    if (!app || !playing) return;

    const token = ++drawTokenRef.current;

    const draw = async () => {
      const W = app.screen.width;
      const H = app.screen.height;
      const currentWord = validWords[currentIndex];
      if (!currentWord) return;

      app.stage.removeChildren();

      const bg = new PIXI.Graphics();
      bg.rect(0, 0, W, H);
      bg.fill({ color: BG_GRADIENT_TOP });
      app.stage.addChild(bg);

      const bgBottom = new PIXI.Graphics();
      bgBottom.rect(0, H / 2, W, H / 2);
      bgBottom.fill({ color: BG_GRADIENT_BOTTOM, alpha: 0.7 });
      app.stage.addChild(bgBottom);

      for (let i = 0; i < 30; i++) {
        const star = new PIXI.Graphics();
        star.circle(0, 0, Math.random() * 3 + 1);
        star.fill({ color: 0xffffff, alpha: Math.random() * 0.6 + 0.2 });
        star.x = Math.random() * W;
        star.y = Math.random() * H;
        app.stage.addChild(star);
      }

      const titleBg = new PIXI.Graphics();
      drawRoundRect(titleBg, W / 2 - 150, 15, 300, 50, 25, { color: 0xffffff, alpha: 0.95 }, { color: 0xffd93d, width: 4 });
      app.stage.addChild(titleBg);

      const title = makeText(
        `🌟 Word ${currentIndex + 1} of ${validWords.length} 🌟`,
        { fontFamily: 'Comic Sans MS', fontSize: 24, fontWeight: '900', fill: 0x764ba2 },
        W / 2,
        40,
      );
      app.stage.addChild(title);

      const clamp = (min, val, max) => Math.max(min, Math.min(max, val));
      const cardW = clamp(100, Math.floor(W * 0.17), 200);
      const cardH = clamp(100, Math.floor(cardW * 0.75), 150);
      const leftPanelX = 8;
      const rightPanelX = W - cardW - 8;
      const panelY = Math.max(10, H - 530);
      const cardCx = cardW / 2;
      const nameFontSize = clamp(11, Math.floor(cardW * 0.078), 16);
      const scoreFontSize = clamp(22, Math.floor(cardW * 0.2), 42);

      if (faceOffMode) {
        const leftCard = new PIXI.Graphics();
        drawRoundRect(leftCard, leftPanelX, panelY, cardW, cardH, 16, { color: 0xffffff }, { color: LEFT_COLOR, width: 4 });
        app.stage.addChild(leftCard);
        const leftShadow = new PIXI.Graphics();
        leftShadow.roundRect(leftPanelX + 4, panelY + 4, cardW, cardH, 16);
        leftShadow.fill({ color: 0x000000, alpha: 0.15 });
        app.stage.addChildAt(leftShadow, app.stage.children.indexOf(leftCard));
        app.stage.addChild(makeText('👤', { fontSize: clamp(18, Math.floor(cardW * 0.16), 32) }, leftPanelX + cardCx, panelY + cardH * 0.14));
        app.stage.addChild(makeText(players[0]?.name || 'Player 1', { fontFamily: 'Comic Sans MS', fontSize: nameFontSize, fontWeight: '900', fill: LEFT_COLOR }, leftPanelX + cardCx, panelY + cardH * 0.38));
        app.stage.addChild(makeText(String(scoreLeft), { fontFamily: 'Comic Sans MS', fontSize: scoreFontSize, fontWeight: '900', fill: LEFT_COLOR }, leftPanelX + cardCx, panelY + cardH * 0.65));
        app.stage.addChild(makeText(`❌ ${wrongLeft}/3`, { fontFamily: 'Comic Sans MS', fontSize: clamp(10, nameFontSize - 1, 13), fontWeight: '800', fill: 0xff4757 }, leftPanelX + cardCx, panelY + cardH * 0.9));

        const rightCard = new PIXI.Graphics();
        drawRoundRect(rightCard, rightPanelX, panelY, cardW, cardH, 16, { color: 0xffffff }, { color: RIGHT_COLOR, width: 4 });
        app.stage.addChild(rightCard);
        const rightShadow = new PIXI.Graphics();
        rightShadow.roundRect(rightPanelX + 4, panelY + 4, cardW, cardH, 16);
        rightShadow.fill({ color: 0x000000, alpha: 0.15 });
        app.stage.addChildAt(rightShadow, app.stage.children.indexOf(rightCard));
        app.stage.addChild(makeText('👤', { fontSize: clamp(18, Math.floor(cardW * 0.16), 32) }, rightPanelX + cardCx, panelY + cardH * 0.14));
        app.stage.addChild(makeText(players[1]?.name || 'Player 2', { fontFamily: 'Comic Sans MS', fontSize: nameFontSize, fontWeight: '900', fill: RIGHT_COLOR }, rightPanelX + cardCx, panelY + cardH * 0.38));
        app.stage.addChild(makeText(String(scoreRight), { fontFamily: 'Comic Sans MS', fontSize: scoreFontSize, fontWeight: '900', fill: RIGHT_COLOR }, rightPanelX + cardCx, panelY + cardH * 0.65));
        app.stage.addChild(makeText(`❌ ${wrongRight}/3`, { fontFamily: 'Comic Sans MS', fontSize: clamp(10, nameFontSize - 1, 13), fontWeight: '800', fill: 0xff4757 }, rightPanelX + cardCx, panelY + cardH * 0.9));
      } else {
        const singleW = 220;
        const singleX = W / 2 - singleW / 2;
        const card = new PIXI.Graphics();
        drawRoundRect(card, singleX, panelY, singleW, 150, 20, { color: 0xffffff }, { color: SINGLE_COLOR, width: 5 });
        app.stage.addChild(card);
        const shadow = new PIXI.Graphics();
        shadow.roundRect(singleX + 4, panelY + 4, singleW, 150, 20);
        shadow.fill({ color: 0x000000, alpha: 0.15 });
        app.stage.addChildAt(shadow, app.stage.children.indexOf(card));
        app.stage.addChild(makeText('⭐', { fontSize: 32 }, W / 2, panelY + 20));
        app.stage.addChild(makeText(players[0]?.name || 'Player', { fontFamily: 'Comic Sans MS', fontSize: 16, fontWeight: '900', fill: 0xf39c12 }, W / 2, panelY + 50));
        app.stage.addChild(makeText(String(singlePlayerScore), { fontFamily: 'Comic Sans MS', fontSize: 42, fontWeight: '900', fill: SINGLE_COLOR }, W / 2, panelY + 90));
        app.stage.addChild(makeText(`❌ ${wrongSingle}/3`, { fontFamily: 'Comic Sans MS', fontSize: 13, fontWeight: '800', fill: 0xff4757 }, W / 2, panelY + 130));
      }

      const imageCardW = clamp(200, W - 40, 440);
      const imageCardH = clamp(120, Math.round(imageCardW * 0.52), 230);
      const imageCardX = W / 2 - imageCardW / 2;
      const imageCardY = 75;

      const imageShadow = new PIXI.Graphics();
      imageShadow.roundRect(imageCardX + 6, imageCardY + 6, imageCardW, imageCardH, 25);
      imageShadow.fill({ color: 0x000000, alpha: 0.2 });
      app.stage.addChild(imageShadow);

      const imageCard = new PIXI.Graphics();
      drawRoundRect(imageCard, imageCardX, imageCardY, imageCardW, imageCardH, 25, { color: 0xffffff }, { color: 0xffd93d, width: 6 });
      app.stage.addChild(imageCard);

      if (currentWord.image) {
        try {
          const tex = await getTexture(currentWord.image);
          if (drawTokenRef.current !== token || !tex) return;
          const spr = new PIXI.Sprite(tex);
          const maxW = imageCardW - 40;
          const maxH = imageCardH - 40;
          const ratio = Math.min(maxW / spr.texture.width, maxH / spr.texture.height, 1);
          spr.width = spr.texture.width * ratio;
          spr.height = spr.texture.height * ratio;
          spr.anchor.set(0.5);
          spr.x = W / 2;
          spr.y = imageCardY + imageCardH / 2;
          app.stage.addChild(spr);
        } catch (err) {
          app.stage.addChild(makeText('🖼️', { fontSize: 72 }, W / 2, imageCardY + imageCardH / 2));
        }
      } else {
        app.stage.addChild(makeText('📝', { fontSize: 72 }, W / 2, imageCardY + imageCardH / 2));
      }

      // Responsive keyboard layout
      const kbCols = 4;
      const kbRows = Math.ceil(displayLetters.length / kbCols);
      const kbGap = clamp(10, Math.floor(W * 0.05), 100);
      const panelAvailW = faceOffMode
        ? Math.floor(W / 2 - kbGap / 2 - 16)
        : Math.floor(W * 0.5);
      const btnSize = clamp(30, Math.floor((panelAvailW - 32 - (kbCols - 1) * 8) / kbCols), 70);
      const boardW = kbCols * btnSize + (kbCols - 1) * 8 + 32;
      const boardH = 48 + 3 * (btnSize + 8) + 12;
      boardHRef.current = boardH;
      const boardBottomY = H - boardH - 10;
      const leftBoardX = Math.max(5, W / 2 - kbGap / 2 - boardW);
      const rightBoardX = Math.min(W - boardW - 5, W / 2 + kbGap / 2);

      const drawBoard = (boardX, boardY, boardW, boardColor, guessedMap, disabledFlag, side) => {
        const boardShadow = new PIXI.Graphics();
        boardShadow.roundRect(boardX + 5, boardY + 5, boardW, boardH, 18);
        boardShadow.fill({ color: 0x000000, alpha: 0.2 });
        app.stage.addChild(boardShadow);

        const board = new PIXI.Graphics();
        drawRoundRect(board, boardX, boardY, boardW, boardH, 18, { color: 0xffffff, alpha: disabledFlag ? 0.5 : 1 }, { color: boardColor, width: 5 });
        app.stage.addChild(board);

        const wordLetters = currentWord.word.toLowerCase().split('');
        const slotY = boardY + 22;
        const slotWidth = Math.max(20, Math.min(28, (boardW - 50) / Math.max(wordLetters.length, 1) - 6));
        const totalSlotsW = wordLetters.length * (slotWidth + 6) - 6;
        let sx = boardX + (boardW - totalSlotsW) / 2;

        wordLetters.forEach((letter, i) => {
          const key = `${currentIndex}-${letter.toUpperCase()}`;
          const isGuessed = guessedMap[key] === 'correct';
          if (letter === ' ') {
            sx += slotWidth + 6;
            return;
          }
          const slotBg = new PIXI.Graphics();
          slotBg.roundRect(sx, slotY - 14, slotWidth, 28, 6);
          slotBg.fill({ color: isGuessed ? 0xd4edda : 0xf8f9fa });
          slotBg.stroke({ color: isGuessed ? 0x28a745 : 0xdee2e6, width: 2 });
          app.stage.addChild(slotBg);
          if (isGuessed) {
            const lt = new PIXI.Text({ text: letter, style: {
              fontFamily: 'Comic Sans MS',
              fontSize: 16,
              fontWeight: '900',
              fill: 0x155724
            }});
            lt.anchor.set(0.5);
            lt.x = sx + slotWidth / 2;
            lt.y = slotY;
            app.stage.addChild(lt);
          }
          sx += slotWidth + 6;
        });

        const cols = kbCols;
        const btnW = btnSize;
        const btnH = btnSize;
        const startX = boardX + 16;
        const startY = boardY + 50;

        displayLetters.forEach((letter, idx) => {
          const row = Math.floor(idx / cols);
          const col = idx % cols;
          const x = startX + col * (btnW + 8);
          const y = startY + row * (btnH + 8);
          const key = `${currentIndex}-${letter.toUpperCase()}`;
          const status = guessedMap[key];
          const locked = status !== undefined || disabledFlag || showResult;

          const btnShadow = new PIXI.Graphics();
          btnShadow.roundRect(x + 2, y + 2, btnW, btnH, 8);
          btnShadow.fill({ color: 0x000000, alpha: 0.15 });
          app.stage.addChild(btnShadow);

          const b = new PIXI.Graphics();
          let fill = 0xffffff;
          let border = boardColor;
          let textColor = boardColor;
          if (status === 'correct') {
            fill = 0xc3f9d2;
            border = 0x28a745;
            textColor = 0x155724;
          }
          if (status === 'wrong') {
            fill = 0xffc9c9;
            border = 0xff4757;
            textColor = 0xc0392b;
          }
          drawRoundRect(b, x, y, btnW, btnH, 8, { color: fill }, { color: border, width: 2 });
          b.alpha = locked && status === undefined ? 0.4 : 1;
          app.stage.addChild(b);

          const t = makeText(letter, { fontFamily: 'Comic Sans MS', fontSize: clamp(14, Math.floor(btnSize * 0.4), 28), fontWeight: '900', fill: textColor }, x + btnW / 2, y + btnH / 2);
          app.stage.addChild(t);

          if (status === 'wrong') {
            const xMark = makeText('✕', { fontFamily: 'Arial', fontSize: clamp(12, Math.floor(btnSize * 0.3), 22), fontWeight: '900', fill: 0xff0000 }, x + btnW - 8, y + 8);
            app.stage.addChild(xMark);
          }

          if (!locked) {
            b.eventMode = 'static';
            b.cursor = 'pointer';
            b.on('pointerover', () => {
              soundRef.current.hover();
            });
            b.on('pointerdown', () => handleLetterClick(letter, side));
          }
        });
      };

      if (faceOffMode) {
        drawBoard(leftBoardX, boardBottomY, boardW, LEFT_COLOR, guessedLettersLeft, playerLeftDisabled, 'left');
        drawBoard(rightBoardX, boardBottomY, boardW, RIGHT_COLOR, guessedLettersRight, playerRightDisabled, 'right');
      } else {
        drawBoard(W / 2 - boardW / 2, boardBottomY, boardW, SINGLE_COLOR, guessedLettersLeft, singlePlayerDisabled, 'single');
      }
    };

    draw();
  }, [
    playing,
    faceOffMode,
    validWords,
    currentIndex,
    guessedLettersLeft,
    guessedLettersRight,
    playerLeftDisabled,
    playerRightDisabled,
    singlePlayerDisabled,
    scoreLeft,
    scoreRight,
    singlePlayerScore,
    wrongLeft,
    wrongRight,
    wrongSingle,
    showResult,
    classColor,
    gameOver,
  ]);

  if (!playing && !showPreview) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: 'linear-gradient(160deg, #667eea 0%, #764ba2 100%)' }}>
      {showPreview && validWords.length > 0 && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5000,
          padding: '40px',
        }}>
          <div style={{
            maxWidth: '700px',
            width: '100%',
            background: 'white',
            borderRadius: '30px',
            padding: '50px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
            textAlign: 'center',
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0 0 10px 0',
                fontFamily: 'Comic Sans MS, cursive',
              }}>🌟 Words Preview 🌟</h2>
              <p style={{ fontSize: '18px', color: '#6b7280', margin: 0, fontWeight: '600' }}>
                Word {previewIndex + 1} of {validWords.length}
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
              borderRadius: '20px',
              padding: '30px',
              border: '4px solid #dee2e6',
              marginBottom: '30px',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {validWords[previewIndex].image ? (
                <div style={{
                  width: '100%',
                  maxWidth: '400px',
                  height: '280px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  marginBottom: '24px',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                }}>
                  <img
                    src={validWords[previewIndex].image}
                    alt={validWords[previewIndex].word}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div style="font-size: 80px;">🖼️</div>';
                    }}
                  />
                </div>
              ) : (
                <div style={{
                  width: '100%',
                  maxWidth: '400px',
                  height: '280px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #ffd93d, #f39c12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  fontSize: '100px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                }}>📝</div>
              )}
              <div style={{
                fontSize: '48px',
                fontWeight: '900',
                color: '#374151',
                fontFamily: 'Comic Sans MS, cursive',
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}>
                {validWords[previewIndex].word}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px' }}>
              <button
                onClick={() => setPreviewIndex(prev => Math.max(0, prev - 1))}
                disabled={previewIndex === 0}
                style={{
                  padding: '14px 28px',
                  fontSize: '18px',
                  fontWeight: '800',
                  background: previewIndex === 0 ? '#e5e7eb' : 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: previewIndex === 0 ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '14px',
                  cursor: previewIndex === 0 ? 'not-allowed' : 'pointer',
                  boxShadow: previewIndex === 0 ? 'none' : '0 6px 20px rgba(102,126,234,0.4)',
                  fontFamily: 'Comic Sans MS, cursive',
                }}
              >
                ← Previous
              </button>
              <button
                onClick={() => setPreviewIndex(prev => Math.min(validWords.length - 1, prev + 1))}
                disabled={previewIndex === validWords.length - 1}
                style={{
                  padding: '14px 28px',
                  fontSize: '18px',
                  fontWeight: '800',
                  background: previewIndex === validWords.length - 1 ? '#e5e7eb' : 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: previewIndex === validWords.length - 1 ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '14px',
                  cursor: previewIndex === validWords.length - 1 ? 'not-allowed' : 'pointer',
                  boxShadow: previewIndex === validWords.length - 1 ? 'none' : '0 6px 20px rgba(102,126,234,0.4)',
                  fontFamily: 'Comic Sans MS, cursive',
                }}
              >
                Next →
              </button>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={() => onBack && onBack()}
                style={{
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(255,107,107,0.4)',
                  fontFamily: 'Comic Sans MS, cursive',
                }}
              >
                ← Back to Setup
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setPlaying(true);
                  soundRef.current.win();
                }}
                style={{
                  padding: '16px 48px',
                  fontSize: '20px',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(16,185,129,0.5)',
                  fontFamily: 'Comic Sans MS, cursive',
                }}
              >
                🎮 Start Game!
              </button>
            </div>
          </div>
        </div>
      )}

      <div ref={wrapRef} style={{ width: '100%', height: '100%' }} />

      <button
        onClick={() => onBack && onBack()}
        style={{
          position: 'fixed',
          top: 7,
          left: 20,
          padding: '10px 20px',
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: 10,
          cursor: 'pointer',
          zIndex: 1000,
          fontSize: 14,
          fontWeight: 700,
          color: '#374151',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        }}
      >
        ← Back
      </button>

      <button
        onClick={() => setShowSkipConfirm(true)}
        style={{
          position: 'fixed',
          top: 12,
          right: 20,
          padding: '12px 20px',
          fontSize: 12,
          fontWeight: 800,
          fontFamily: 'Comic Sans MS, cursive',
          background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)',
          color: '#92400e',
          border: '3px solid #f59e0b',
          borderRadius: 12,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
          zIndex: 1000,
        }}
      >
        ⏭️ Skip
      </button>

      {showResult && (
        <div style={{
          position: 'fixed',
          bottom: boardHRef.current + 20,
          left: showResultSide === 'left' ? '25%' : showResultSide === 'right' ? '75%' : '50%',
          transform: 'translateX(-50%)',
          padding: '14px 28px',
          borderRadius: 16,
          background: 'rgba(16,185,129,0.95)',
          color: '#fff',
          fontWeight: 900,
          fontSize: 20,
          zIndex: 9999,
          boxShadow: '0 8px 24px rgba(16,185,129,0.5)',
          whiteSpace: 'nowrap',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}>
          <span>✅ Correct!</span>
          <span style={{ fontSize: 28, fontFamily: 'Comic Sans MS, cursive', letterSpacing: 2 }}>
            {validWords[currentIndex]?.word?.toLowerCase()}
          </span>
        </div>
      )}

      {showSkipConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
          <div style={{ padding: 30, background: 'white', borderRadius: 20, textAlign: 'center', maxWidth: 320, boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: 48, marginBottom: 15 }}>⏭️</div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#374151', margin: '0 0 10px 0' }}>Skip This Word?</h3>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>
              {faceOffMode ? 'Both players will lose 1 point and move to the next word.' : 'You will lose 1 point and move to the next word.'}
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setShowSkipConfirm(false)} style={{ padding: '12px 24px', fontSize: 14, fontWeight: 700, background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Cancel</button>
              <button
                onClick={() => {
                  soundRef.current.skip();
                  setShowSkipConfirm(false);
                  if (faceOffMode) {
                    setScoreLeft(prev => {
                      const next = prev - 1;
                      scoreLeftRef.current = next;
                      return next;
                    });
                    setScoreRight(prev => {
                      const next = prev - 1;
                      scoreRightRef.current = next;
                      return next;
                    });
                  } else {
                    setSinglePlayerScore(prev => prev - 1);
                  }
                  finishOrAdvance(currentIndex + 1);
                }}
                style={{ padding: '12px 24px', fontSize: 14, fontWeight: 700, background: '#f59e0b', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer' }}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {gameOver && (() => {
        const isFaceOff = players.length >= 2;
        const winnerName = winner === 'left' ? (players[0]?.name || 'Player 1')
          : winner === 'right' ? (players[1]?.name || 'Player 2') : null;
        const winnerScore = winner === 'left' ? scoreLeft : winner === 'right' ? scoreRight : 0;
        const winnerColorHex = winner === 'left' ? '#ff6b9d' : '#4ecdc4';
        const allScores = isFaceOff
          ? [{ name: players[0]?.name || 'Player 1', score: scoreLeft }, { name: players[1]?.name || 'Player 2', score: scoreRight }]
          : [{ name: players[0]?.name || 'Player', score: singlePlayerScore }];
        const totalWords = validWords.length;
        const pct = totalWords > 0 ? Math.round((singlePlayerScore / totalWords) * 100) : 0;
        const mood = pct === 100 ? { emoji: '🌟', title: 'Amazing!' } : pct >= 80 ? { emoji: '🎉', title: 'Excellent!' } : pct >= 50 ? { emoji: '👍', title: 'Good Job!' } : { emoji: '💪', title: 'Keep Trying!' };
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 24, animation: 'pixiFadeIn 0.3s ease-out' }}>
            <div style={{ maxWidth: 480, width: '100%', maxHeight: '90vh', overflowY: 'auto', background: 'linear-gradient(135deg, #1e1b4b, #312e81)', borderRadius: 28, padding: '40px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, boxShadow: `0 0 0 4px ${isFaceOff ? winnerColorHex : '#ffd93d'}, 0 30px 80px rgba(0,0,0,0.7)`, animation: 'pixiBounceIn 0.45s ease-out' }}>
              <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(255,215,0,0.15)', border: '3px solid #ffd700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52 }}>
                {isFaceOff ? (winner === 'tie' ? '🤝' : '🏆') : mood.emoji}
              </div>
              <div style={{ textAlign: 'center' }}>
                {isFaceOff ? (
                  <>
                    <div style={{ fontSize: 36, fontWeight: 900, color: '#ffd700', letterSpacing: 2 }}>{winner === 'tie' ? "IT'S A TIE!" : 'WINNER!'}</div>
                    {winner !== 'tie' && <div style={{ fontSize: 44, fontWeight: 900, color: winnerColorHex, marginTop: 4 }}>{winnerName}</div>}
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', marginTop: 6 }}>⭐ {winnerScore} points</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 36, fontWeight: 900, color: '#ffd700', letterSpacing: 2 }}>{mood.title}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#e2e8f0', marginTop: 6 }}>{singlePlayerScore} / {totalWords} words ({pct}%)</div>
                  </>
                )}
              </div>
              <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '12px 16px' }}>
                {[...allScores].sort((a, b) => b.score - a.score).map((p, i) => (
                  <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 15, fontWeight: 600, color: p.name === winnerName ? '#ffd700' : '#94a3b8', borderBottom: i < allScores.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                    <span>{i + 1}. {p.name}</span><span>{p.score} pts</span>
                  </div>
                ))}
              </div>
              {isFaceOff && winner !== 'tie' && selectedClass && onGivePoints && !pointsGiven && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>Give class points to winner:</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[1, 2, 3, 5].map(val => (
                      <button key={val} onClick={() => setPointsToGive(val)} style={{ padding: '10px 18px', fontSize: 18, fontWeight: 800, borderRadius: 12, border: 'none', cursor: 'pointer', background: pointsToGive === val ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(255,255,255,0.1)', color: pointsToGive === val ? '#fff' : '#94a3b8', boxShadow: pointsToGive === val ? '0 4px 14px rgba(16,185,129,0.4)' : 'none', transition: 'all 0.15s' }}>+{val}</button>
                    ))}
                  </div>
                  <button onClick={handleGivePoints} style={{ padding: '12px 32px', fontSize: 16, fontWeight: 800, background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', border: 'none', borderRadius: 14, cursor: 'pointer', boxShadow: '0 6px 24px rgba(245,158,11,0.45)', width: '100%' }}>
                    🎁 Give {pointsToGive} Point{pointsToGive !== 1 ? 's' : ''} to {winnerName}
                  </button>
                </div>
              )}
              {pointsGiven && (
                <div style={{ fontSize: 16, fontWeight: 700, color: '#10b981', textAlign: 'center', padding: '10px 20px', background: 'rgba(16,185,129,0.12)', borderRadius: 12, border: '2px solid #10b981', width: '100%' }}>
                  ✅ {pointsToGive} point{pointsToGive !== 1 ? 's' : ''} given to {winnerName}!
                </div>
              )}
              <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                <button onClick={() => { setGameOver(false); setPlaying(false); setShowPreview(true); setCurrentIndex(0); setScoreLeft(0); setScoreRight(0); setSinglePlayerScore(0); setGuessedLettersLeft({}); setGuessedLettersRight({}); setWrongLeft(0); setWrongRight(0); setPointsGiven(false); }} style={{ padding: '14px 24px', fontSize: 16, fontWeight: 800, background: 'linear-gradient(135deg,#4ecdc4,#44a08d)', color: '#fff', border: 'none', borderRadius: 16, cursor: 'pointer', boxShadow: '0 6px 24px rgba(78,205,196,0.45)', flex: 1 }}>🎮 Play Again</button>
                <button onClick={() => { setGameOver(false); onBack && onBack(); }} style={{ padding: '14px 24px', fontSize: 16, fontWeight: 800, background: 'linear-gradient(135deg,#6b7280,#4b5563)', color: '#fff', border: 'none', borderRadius: 16, cursor: 'pointer', boxShadow: '0 6px 24px rgba(107,114,128,0.45)', flex: 1 }}>← Back to Menu</button>
              </div>
            </div>
            <style>{`@keyframes pixiFadeIn { from { opacity:0 } to { opacity:1 } } @keyframes pixiBounceIn { 0% { transform: scale(0.7); opacity:0 } 60% { transform: scale(1.05) } 100% { transform: scale(1); opacity:1 } }`}</style>
          </div>
        );
      })()}
    </div>
  );
}
