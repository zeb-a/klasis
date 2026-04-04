/**
 * TornadoPixiMockup.jsx  — PixiJS v8
 * Features:
 *   • Click any player panel to manually switch the active turn
 *   • Decorative flashcard strip (images + words from config.decorativeElements)
 *   • Configurable tornado count (config.tornadoCount = 'random' | 1-5)
 *   • Accepts real players/config from TornadoSetup; falls back to MOCK data
 */
import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

/* ─── Fallback data (used when no props are passed) ───────────────────────── */
const MOCK_PLAYERS = [
  { id: 'p1', name: 'Alice', score: 0 },
  { id: 'p2', name: 'Bob',   score: 0 },
];
const MOCK_CONFIG = {
  squareCount:        12,
  numberedSquares:    true,
  tornadoCount:       'random',
  decorativeElements: [],
};

/* ─── Palette ──────────────────────────────────────────────────────────────── */
const C = {
  bg:         0x0a0e1a,
  bgGlow:     0x1a1040,
  cardBack:   0x1c2a6b,
  cardHover:  0x2e40a0,
  cardBorder: 0x4a5fc4,
  single:     0xf59e0b,
  double:     0xec4899,
  triple:     0xa855f7,
  tornado:    0x06d6e0,
  players:    [0x10b981, 0x3b82f6, 0xf59e0b, 0xec4899],
  panelBg:    0x111c4a,
};

/* ─── Tiny tween helpers (Promise-based, PixiJS ticker) ───────────────────── */
function lerp(a, b, t) { return a + (b - a) * t; }

function easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

function easeOutBack(t) {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function animate(app, durationMs, onTick, ease = easeInOutQuad) {
  return new Promise(resolve => {
    let elapsed = 0;
    const tick = ticker => {
      elapsed += ticker.deltaMS;
      const t = Math.min(elapsed / durationMs, 1);
      onTick(ease(t), t);
      if (t >= 1) { app.ticker.remove(tick); resolve(); }
    };
    app.ticker.add(tick);
  });
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ─── Procedural Sound Manager (Web Audio API — zero external files) ─────── */
class SoundManager {
  _ctx() {
    if (!this.__ctx) this.__ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.__ctx.state === 'suspended') this.__ctx.resume();
    return this.__ctx;
  }

  _osc(freq, type, dur, vol, when = 0, freqEnd = null) {
    try {
      const ctx = this._ctx();
      const o   = ctx.createOscillator();
      const g   = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = type;
      o.frequency.setValueAtTime(freq, ctx.currentTime + when);
      if (freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + when + dur);
      g.gain.setValueAtTime(vol, ctx.currentTime + when);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + dur);
      o.start(ctx.currentTime + when);
      o.stop(ctx.currentTime + when + dur);
    } catch (_) {}
  }

  _noise(dur, vol, when = 0) {
    try {
      const ctx    = this._ctx();
      const buf    = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
      const data   = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
      const src    = ctx.createBufferSource();
      const filt   = ctx.createBiquadFilter();
      const g      = ctx.createGain();
      src.buffer   = buf;
      filt.type    = 'bandpass'; filt.frequency.value = 400; filt.Q.value = 0.5;
      src.connect(filt); filt.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(vol, ctx.currentTime + when);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + dur);
      src.start(ctx.currentTime + when);
      src.stop(ctx.currentTime + when + dur);
    } catch (_) {}
  }

  flip() {
    this._osc(900, 'sine',   0.06, 0.18, 0,    260);
    this._osc(300, 'sine',   0.14, 0.10, 0.04, 120);
  }

  score() {
    [523, 659, 784].forEach((f, i) => this._osc(f, 'sine', 0.18, 0.22, i * 0.09));
  }

  double() {
    [440, 659, 880].forEach((f, i) => this._osc(f, 'triangle', 0.2, 0.28, i * 0.08));
  }

  triple() {
    [440, 587, 784, 1047].forEach((f, i) => this._osc(f, 'sine', 0.22, 0.32, i * 0.07));
    this._osc(220, 'sine', 0.35, 0.18, 0);
  }

  tornado() {
    // Low rumble sweep down
    this._osc(380, 'sawtooth', 1.1, 0.28, 0, 38);
    // Mid wind sweep
    this._osc(900, 'sine',     0.9, 0.14, 0.05, 60);
    // High shriek
    this._osc(2400, 'sine',    0.45, 0.08, 0, 500);
    // White noise burst
    this._noise(1.2, 0.18, 0);
  }

  switchTurn() {
    this._osc(680, 'sine', 0.06, 0.10);
    this._osc(480, 'sine', 0.06, 0.07, 0.05);
  }

  win() {
    [523, 659, 784, 1047, 1319].forEach((f, i) => this._osc(f, 'sine', 0.28, 0.28, i * 0.1));
    this._osc(130, 'sine', 0.55, 0.35, 0);
    [1047, 1319, 1568].forEach((f, i) => this._osc(f, 'triangle', 0.2, 0.18, 0.55 + i * 0.1));
  }

  hover() {
    this._osc(900, 'sine', 0.04, 0.06);
  }
}

/* ─── Helper: draw rounded rect (fill + optional stroke) ─────────────────── */
function rrect(g, x, y, w, h, r, fill, stroke) {
  if (fill !== undefined) {
    g.roundRect(x, y, w, h, r);
    g.fill(fill);
  }
  if (stroke !== undefined) {
    g.roundRect(x, y, w, h, r);
    g.stroke(stroke);
  }
}

/* ═══════════════════════  PIXI GAME CLASS  ══════════════════════════════════ */
class TornadoPixiGame {
  constructor(app, players, config, onGameOver) {
    this.app        = app;
    this.W          = app.screen.width;
    this.H          = app.screen.height;
    this.players    = players.map(p => ({ ...p, score: 0 }));
    this.config     = config;
    this.onGameOver = onGameOver;

    this.cards              = [];
    this.flippedCount       = 0;
    this.currentPlayerIndex = 0;
    this.isAnimating        = false;
    this.playerPanels       = [];
    this._decoH             = 0; // reserved height for flashcard strip
    this.sound              = new SoundManager();
  }

  /* ── Entry point ────────────────────────────────────────────────────────── */
  build() {
    const elems = this.config.decorativeElements || [];
    this._decoH = elems.length > 0 ? 80 : 0;
    this._buildBackground();
    this._buildPlayerPanels();
    this._buildCardGrid();
    if (elems.length > 0) this._buildDecorativeStrip(elems);
    this._highlightCurrentPlayer();
  }

  /* ── Background ─────────────────────────────────────────────────────────── */
  _buildBackground() {
    const { app, W, H } = this;

    const bg = new PIXI.Graphics();
    bg.rect(0, 0, W, H);
    bg.fill(C.bg);
    app.stage.addChild(bg);

    // Radial center glow
    for (let i = 6; i >= 1; i--) {
      const g = new PIXI.Graphics();
      g.circle(W / 2, H / 2, (Math.min(W, H) * 0.55) * (i / 6));
      g.fill({ color: C.bgGlow, alpha: 0.06 });
      app.stage.addChild(g);
    }

    // Drifting ambient orbs
    const orbColors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0xa855f7, 0x3b82f6, 0x10b981];
    this._orbs = [];
    for (let i = 0; i < 10; i++) {
      const r = 18 + Math.random() * 36;
      const orb = new PIXI.Graphics();
      orb.circle(0, 0, r);
      orb.fill({ color: orbColors[i % orbColors.length], alpha: 0.12 });
      orb.x = Math.random() * W;
      orb.y = Math.random() * H;
      orb._vx = (Math.random() - 0.5) * 0.5;
      orb._vy = (Math.random() - 0.5) * 0.5;
      app.stage.addChild(orb);
      this._orbs.push(orb);
    }

    // Star field
    for (let i = 0; i < 50; i++) {
      const s = new PIXI.Graphics();
      s.circle(0, 0, Math.random() < 0.2 ? 1.5 : 1);
      s.fill({ color: 0xffffff, alpha: 0.15 + Math.random() * 0.35 });
      s.x = Math.random() * W;
      s.y = Math.random() * H;
      app.stage.addChild(s);
    }

    // Animate orbs
    app.ticker.add(() => {
      for (const orb of this._orbs) {
        orb.x += orb._vx;
        orb.y += orb._vy;
        if (orb.x < -60)  orb.x = W + 60;
        if (orb.x > W+60) orb.x = -60;
        if (orb.y < -60)  orb.y = H + 60;
        if (orb.y > H+60) orb.y = -60;
      }
    });

    // Tornado watermark title
    const title = new PIXI.Text({ text: '🌪️  TORNADO', style: {
      fontFamily: 'system-ui, sans-serif', fontSize: 17, fontWeight: '900',
      fill: '#ffffff', alpha: 0.3, letterSpacing: 5,
    }});
    title.anchor.set(0.5, 0);
    title.x = W / 2; title.y = 8;
    app.stage.addChild(title);
  }

  /* ── Player panels ───────────────────────────────────────────────────────── */
  _buildPlayerPanels() {
    const { app, players, W, H } = this;
    const PW = 155, PH = 210;
    const n  = players.length;

    for (let i = 0; i < n; i++) {
      const isLeft   = i < Math.ceil(n / 2);
      const sideIdx  = isLeft ? i : i - Math.ceil(n / 2);
      const sideCnt  = isLeft ? Math.ceil(n / 2) : Math.floor(n / 2);
      const x        = isLeft ? 10 : W - PW - 10;
      const totalH   = sideCnt * PH + (sideCnt - 1) * 10;
      const y        = (H - totalH) / 2 + sideIdx * (PH + 10);

      const panel = this._createPlayerPanel(i, x, y, PW, PH);
      app.stage.addChild(panel);
      this.playerPanels.push(panel);
    }
  }

  _createPlayerPanel(idx, x, y, w, h) {
    const player = this.players[idx];
    const color  = C.players[idx % C.players.length];
    const ct     = new PIXI.Container();
    ct.x = x; ct.y = y;
    ct._w = w; ct._h = h; ct._color = color;

    // ── Whole panel is clickable to switch turn ──
    ct.eventMode = 'static';
    ct.cursor    = 'pointer';
    ct.on('pointerdown', () => {
      if (!this.isAnimating && idx !== this.currentPlayerIndex) {
        this.sound.switchTurn();
        this.currentPlayerIndex = idx;
        this._highlightCurrentPlayer();
      }
    });

    const bg = new PIXI.Graphics();
    rrect(bg, 0, 0, w, h, 14,
      { color: C.panelBg, alpha: 0.92 },
      { color, width: 2, alpha: 0.6 });
    ct.addChild(bg);
    ct._bg = bg;

    // Avatar circle
    const av = new PIXI.Graphics();
    av.circle(w / 2, 44, 28); av.fill({ color, alpha: 0.25 });
    av.circle(w / 2, 44, 28); av.stroke({ color, width: 2 });
    ct.addChild(av);

    const init = new PIXI.Text({ text: (player.name || 'P')[0].toUpperCase(), style: {
      fontFamily: 'system-ui', fontSize: 26, fontWeight: '900', fill: color,
    }});
    init.anchor.set(0.5); init.x = w / 2; init.y = 44;
    ct.addChild(init);

    const nameT = new PIXI.Text({ text: player.name, style: {
      fontFamily: 'system-ui', fontSize: 12, fontWeight: '700', fill: '#ffffff',
    }});
    nameT.anchor.set(0.5); nameT.x = w / 2; nameT.y = 83;
    ct.addChild(nameT);

    const div = new PIXI.Graphics();
    div.moveTo(14, 100); div.lineTo(w - 14, 100);
    div.stroke({ color, width: 1, alpha: 0.3 });
    ct.addChild(div);

    const lbl = new PIXI.Text({ text: 'SCORE', style: {
      fontFamily: 'system-ui', fontSize: 9, fontWeight: '700',
      fill: '#94a3b8', letterSpacing: 3,
    }});
    lbl.anchor.set(0.5); lbl.x = w / 2; lbl.y = 114;
    ct.addChild(lbl);

    const scoreT = new PIXI.Text({ text: '0', style: {
      fontFamily: 'system-ui', fontSize: 38, fontWeight: '900', fill: color,
    }});
    scoreT.anchor.set(0.5); scoreT.x = w / 2; scoreT.y = 148;
    ct.addChild(scoreT);
    ct._scoreText = scoreT;

    // ── "Your turn" badge (active player) ──
    const badgeBg = new PIXI.Graphics();
    rrect(badgeBg, 8, h - 26, w - 16, 18, 6, { color, alpha: 0.22 });
    ct.addChild(badgeBg);
    ct._badgeBg = badgeBg;

    const badgeT = new PIXI.Text({ text: '🎯 YOUR TURN', style: {
      fontFamily: 'system-ui', fontSize: 10, fontWeight: '800', fill: color,
    }});
    badgeT.anchor.set(0.5); badgeT.x = w / 2; badgeT.y = h - 17;
    ct.addChild(badgeT);
    ct._badgeT = badgeT;

    // ── "Tap to play" hint (inactive players) ──
    const hintT = new PIXI.Text({ text: '👆 TAP TO PLAY', style: {
      fontFamily: 'system-ui', fontSize: 9, fontWeight: '700', fill: '#64748b',
    }});
    hintT.anchor.set(0.5); hintT.x = w / 2; hintT.y = h - 17;
    ct.addChild(hintT);
    ct._hintT = hintT;

    badgeBg.visible = false;
    badgeT.visible  = false;
    hintT.visible   = false;

    return ct;
  }

  updateScore(playerIndex) {
    const panel = this.playerPanels[playerIndex];
    if (!panel) return;
    panel._scoreText.text = String(this.players[playerIndex].score);
    animate(this.app, 120, t => { panel._scoreText.scale.set(lerp(1, 1.45, t)); })
      .then(() => animate(this.app, 120, t => { panel._scoreText.scale.set(lerp(1.45, 1, t)); }));
  }

  _highlightCurrentPlayer() {
    this.playerPanels.forEach((panel, i) => {
      const active = i === this.currentPlayerIndex;
      panel._badgeBg.visible = active;
      panel._badgeT.visible  = active;
      panel._hintT.visible   = !active;

      panel._bg.clear();
      rrect(panel._bg, 0, 0, panel._w, panel._h, 14,
        { color: C.panelBg, alpha: 0.92 },
        { color: panel._color, width: active ? 3 : 1.5, alpha: active ? 1 : 0.45 });
    });
  }

  /* ── Decorative flashcard strip ─────────────────────────────────────────── */
  async _buildDecorativeStrip(elements) {
    const { app, W, H } = this;
    const SIDE_W = 175;
    const CW = 76, CH = 62, GAP = 8;
    const availW = W - SIDE_W * 2 - 16;
    const stripY = H - this._decoH + 4;

    // Strip background
    const stripBg = new PIXI.Graphics();
    rrect(stripBg, SIDE_W + 8, stripY, availW, this._decoH - 8, 12,
      { color: 0x0d1533, alpha: 0.85 });
    app.stage.addChild(stripBg);

    // Label
    const lbl = new PIXI.Text({ text: '📚 FLASHCARDS', style: {
      fontFamily: 'system-ui', fontSize: 9, fontWeight: '800',
      fill: '#475569', letterSpacing: 2,
    }});
    lbl.x = SIDE_W + 16; lbl.y = stripY + 4;
    app.stage.addChild(lbl);

    // Scroll container + mask
    const scroll = new PIXI.Container();
    scroll.x = SIDE_W + 12;
    scroll.y = stripY + 14;
    app.stage.addChild(scroll);

    const maskG = new PIXI.Graphics();
    maskG.rect(SIDE_W + 12, stripY + 14, availW - 8, CH);
    maskG.fill(0xffffff);
    app.stage.addChild(maskG);
    scroll.mask = maskG;

    // Build cards (async for images)
    let xOff = 0;
    for (const el of elements) {
      const isImg = el.startsWith('data:') || el.startsWith('blob:') || el.startsWith('http');
      const card  = new PIXI.Container();
      card.x = xOff;

      const bg = new PIXI.Graphics();
      rrect(bg, 0, 0, CW, CH, 8,
        { color: 0x1c2a6b },
        { color: 0x4a5fc4, width: 1 });
      card.addChild(bg);

      if (isImg) {
        try {
          // blob:/data: URLs have no extension so PIXI.Assets.load can't infer type;
          // load via HTML Image then create texture from the element.
          const img = new Image();
          img.src = el;
          await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
          const tex = PIXI.Texture.from(img);
          const spr = new PIXI.Sprite(tex);
          spr.width = CW - 6; spr.height = CH - 6;
          spr.x = 3; spr.y = 3;
          card.addChild(spr);
        } catch (_) {
          const ph = new PIXI.Text({ text: '🖼️', style: { fontSize: 22 } });
          ph.anchor.set(0.5); ph.x = CW / 2; ph.y = CH / 2;
          card.addChild(ph);
        }
      } else {
        const maxLen = 10;
        const display = el.length > maxLen ? el.slice(0, maxLen) + '…' : el;
        const txt = new PIXI.Text({ text: display, style: {
          fontFamily: 'system-ui', fontSize: 13, fontWeight: '700',
          fill: '#ffffff', wordWrap: true, wordWrapWidth: CW - 8, align: 'center',
        }});
        txt.anchor.set(0.5); txt.x = CW / 2; txt.y = CH / 2;
        card.addChild(txt);
      }

      scroll.addChild(card);
      xOff += CW + GAP;
    }

    // Auto-scroll if cards overflow
    const totalW = xOff;
    if (totalW > availW - 8) {
      let ox = 0, dir = -1;
      app.ticker.add(() => {
        ox += dir * 0.5;
        const limit = -(totalW - (availW - 8));
        if (ox <= limit) { ox = limit; dir = 1; }
        if (ox >= 0)     { ox = 0;     dir = -1; }
        scroll.x = SIDE_W + 12 + ox;
      });
    }
  }

  /* ── Card grid ───────────────────────────────────────────────────────────── */
  _buildCardGrid() {
    const { app, W, H, config } = this;
    const SIDE_W = 175, PAD = 12;

    const availW = W - SIDE_W * 2 - PAD * 2;
    const availH = H - 52 - this._decoH;

    const total = Math.min(Math.max(config.squareCount || 12, 9), 40);
    let cols, rows;
    if      (total <= 9)  { cols = 3; rows = 3; }
    else if (total <= 12) { cols = 4; rows = 3; }
    else if (total <= 16) { cols = 4; rows = 4; }
    else if (total <= 20) { cols = 5; rows = 4; }
    else if (total <= 25) { cols = 5; rows = 5; }
    else if (total <= 30) { cols = 6; rows = 5; }
    else                  { cols = 6; rows = 6; }

    const GAP   = 10;
    const cardW = (availW - GAP * (cols - 1)) / cols;
    const cardH = (availH - GAP * (rows - 1)) / rows;

    const gridW  = cols * cardW + GAP * (cols - 1);
    const gridH  = rows * cardH + GAP * (rows - 1);
    const startX = SIDE_W + PAD + (availW - gridW) / 2;
    const startY = 46 + (availH - gridH) / 2;

    // Tornado count from config
    let nTornado;
    if (!config.tornadoCount || config.tornadoCount === 'random') {
      nTornado = Math.max(1, Math.floor(total * 0.12));
    } else {
      nTornado = Math.min(Number(config.tornadoCount), total - 3);
    }
    const nDouble = Math.max(1, Math.floor(total * 0.1));
    const nTriple = Math.max(1, Math.floor(total * 0.08));
    const nSingle = Math.max(0, total - nTornado - nDouble - nTriple);

    const types = [
      ...Array(nTornado).fill(null).map(() => ({ type: 'tornado', points: 0 })),
      ...Array(nDouble).fill(null).map(() => ({ type: 'double',  points: 0 })),
      ...Array(nTriple).fill(null).map(() => ({ type: 'triple',  points: 0 })),
      ...Array(nSingle).fill(null).map(() => ({ type: 'single',  points: 1 + Math.floor(Math.random() * 10) })),
    ];
    for (let i = types.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [types[i], types[j]] = [types[j], types[i]];
    }

    const grid = new PIXI.Container();
    this.cards = [];

    for (let i = 0; i < total; i++) {
      const col  = i % cols;
      const row  = Math.floor(i / cols);
      const cx   = col * (cardW + GAP) + cardW / 2;
      const cy   = row * (cardH + GAP) + cardH / 2;
      const card = this._createCard(cx, cy, cardW, cardH, types[i], i);
      this.cards.push(card);
      grid.addChild(card);
    }

    grid.x = startX; grid.y = startY;
    app.stage.addChild(grid);

    // Staggered pop-in entrance
    this.cards.forEach((card, i) => {
      card.scale.set(0);
      setTimeout(() => {
        animate(this.app, 380, t => card.scale.set(easeOutBack(t)));
      }, i * 45);
    });
  }

  _createCard(cx, cy, w, h, data, index) {
    const ct = new PIXI.Container();
    ct.x = cx; ct.y = cy;
    ct._data     = data;
    ct._revealed = false;
    ct._w = w; ct._h = h;

    // ── Back face ──
    const back   = new PIXI.Container();
    const backBg = new PIXI.Graphics();
    rrect(backBg, -w/2, -h/2, w, h, 11,
      { color: C.cardBack },
      { color: C.cardBorder, width: 1.5 });

    // Inner glow line
    const inner = new PIXI.Graphics();
    rrect(inner, -w/2+4, -h/2+4, w-8, h-8, 7,
      undefined, { color: C.cardBorder, width: 1, alpha: 0.25 });

    const backLabel = new PIXI.Text({
      text: this.config.numberedSquares ? String(index + 1) : '✦',
      style: { fontFamily: 'system-ui', fontSize: Math.min(w, h) * 0.28, fontWeight: '900', fill: '#6b7fcf' },
    });
    backLabel.anchor.set(0.5);

    back.addChild(backBg); back.addChild(inner); back.addChild(backLabel);
    ct.addChild(back);
    ct._back   = back;
    ct._backBg = backBg;

    // ── Front face ──
    let faceColor, faceEmoji, faceText;
    switch (data.type) {
      case 'tornado': faceColor = C.tornado; faceEmoji = '🌪️'; faceText = null;    break;
      case 'double':  faceColor = C.double;  faceEmoji = null;  faceText = '×2';   break;
      case 'triple':  faceColor = C.triple;  faceEmoji = null;  faceText = '×3';   break;
      default:        faceColor = C.single;  faceEmoji = null;  faceText = `+${data.points}`; break;
    }

    const front   = new PIXI.Container();
    front.visible = false;

    const frontBg = new PIXI.Graphics();
    rrect(frontBg, -w/2, -h/2, w, h, 11,
      { color: faceColor },
      { color: 0xffffff, width: 2, alpha: 0.35 });

    // Sheen stripe
    const sheen = new PIXI.Graphics();
    sheen.roundRect(-w/2+4, -h/2+4, w-8, (h-8)*0.45, 8);
    sheen.fill({ color: 0xffffff, alpha: 0.08 });

    const displayStr = faceEmoji ?? faceText;
    const fontSize   = faceEmoji
      ? Math.min(w, h) * 0.48
      : Math.min(w, h) * (data.type === 'single' && data.points >= 10 ? 0.3 : 0.36);

    const frontLbl = new PIXI.Text({ text: displayStr, style: {
      fontFamily: 'system-ui', fontSize, fontWeight: '900', fill: '#ffffff',
    }});
    frontLbl.anchor.set(0.5);

    // Sub-label for multipliers
    if (data.type === 'double' || data.type === 'triple') {
      const sub = new PIXI.Text({ text: 'multiply', style: {
        fontFamily: 'system-ui', fontSize: Math.min(w, h) * 0.13,
        fontWeight: '600', fill: '#ffffff', alpha: 0.7,
      }});
      sub.anchor.set(0.5); sub.y = Math.min(w, h) * 0.3;
      front.addChild(sub);
    }

    front.addChild(frontBg); front.addChild(sheen); front.addChild(frontLbl);
    ct.addChild(front);
    ct._front = front;

    // ── Interactivity on back face ──
    back.eventMode = 'static';
    back.cursor    = 'pointer';

    back.on('pointerover', () => {
      if (ct._revealed) return;
      this.sound.hover();
      backBg.clear();
      rrect(backBg, -w/2, -h/2, w, h, 11,
        { color: C.cardHover },
        { color: 0x8b9fd4, width: 2 });
      animate(this.app, 100, t => ct.scale.set(lerp(1, 1.06, t)));
    });

    back.on('pointerout', () => {
      if (ct._revealed) return;
      backBg.clear();
      rrect(backBg, -w/2, -h/2, w, h, 11,
        { color: C.cardBack },
        { color: C.cardBorder, width: 1.5 });
      animate(this.app, 100, t => ct.scale.set(lerp(1.06, 1, t)));
    });

    back.on('pointerdown', () => {
      if (!ct._revealed && !this.isAnimating) this.onCardClick(ct);
    });

    return ct;
  }

  /* ── Core game logic ─────────────────────────────────────────────────────── */
  async onCardClick(card) {
    this.isAnimating   = true;
    card._revealed     = true;
    card._back.eventMode = 'none';

    this.sound.flip();
    await this._flipCard(card);

    const pi   = this.currentPlayerIndex;
    const type = card._data.type;

    if (type === 'tornado') {
      await this._handleTornado(pi, card);
    } else if (type === 'double') {
      this.sound.double();
      await this._handlePoints(pi, this.players[pi].score, card);
    } else if (type === 'triple') {
      this.sound.triple();
      await this._handlePoints(pi, this.players[pi].score * 2, card);
    } else {
      this.sound.score();
      await this._handlePoints(pi, card._data.points, card);
    }

    this.flippedCount++;

    if (this.flippedCount >= this.cards.length) {
      await this._showGameOver();
      return;
    }

    this._nextTurn();
    this.isAnimating = false;
  }

  _flipCard(card) {
    return new Promise(resolve => {
      // Squish to 0
      animate(this.app, 220, t => { card.scale.x = 1 - t; }, easeInOutQuad)
        .then(() => {
          card.scale.x    = 0;
          card._back.visible  = false;
          card._front.visible = true;
          // Expand from 0
          return animate(this.app, 240, t => { card.scale.x = easeOutBack(t); });
        })
        .then(() => { card.scale.x = 1; resolve(); });
    });
  }

  async _handlePoints(pi, pts, card) {
    this.players[pi].score += pts;
    this.updateScore(pi);
    await this._floatText(card, pts > 0 ? `+${pts}` : `${pts}`, pts >= 0 ? 0x34d399 : 0xf87171);
    await wait(300);
  }

  async _handleTornado(pi, card) {
    this.sound.tornado();
    await this._animateTornadoTravel(card, pi);
    this.players[pi].score = 0;
    this.updateScore(pi);
    await this._floatText(card, '🌪️ RESET!', C.tornado);
    await this._shakePanel(pi);
    await wait(300);
  }

  async _animateTornadoTravel(card, playerIdx) {
    const panel  = this.playerPanels[playerIdx];
    const startX = (card.parent?.x ?? 0) + card.x;
    const startY = (card.parent?.y ?? 0) + card.y;
    const endX   = panel.x + panel._w / 2;
    const endY   = panel.y + panel._h / 2;
    const peakY  = Math.min(startY, endY) - 110;
    const ctrlX  = (startX + endX) / 2;

    const icon = new PIXI.Text({ text: '🌪️', style: { fontSize: 52 } });
    icon.anchor.set(0.5);
    icon.x = startX; icon.y = startY;
    this.app.stage.addChild(icon);

    await animate(this.app, 750, (_, t) => {
      const mt    = 1 - t;
      icon.x      = mt * mt * startX + 2 * mt * t * ctrlX  + t * t * endX;
      icon.y      = mt * mt * startY + 2 * mt * t * peakY  + t * t * endY;
      icon.rotation += 0.22;
      icon.scale.set(lerp(0.8, 1.8, Math.sin(t * Math.PI)));
    }, t => t);

    this.app.stage.removeChild(icon);
    icon.destroy();
  }

  _floatText(card, txt, color) {
    return new Promise(resolve => {
      const wx = (card.parent?.x ?? 0) + card.x;
      const wy = (card.parent?.y ?? 0) + card.y;

      const ft = new PIXI.Text({ text: txt, style: {
        fontFamily: 'system-ui', fontSize: 26, fontWeight: '900', fill: color,
      }});
      ft.anchor.set(0.5); ft.x = wx; ft.y = wy;
      this.app.stage.addChild(ft);

      animate(this.app, 900, (et, t) => {
        ft.y     = wy - t * 65;
        ft.alpha = 1 - t;
        ft.scale.set(lerp(1, 1.3, Math.sin(t * Math.PI)));
      }).then(() => {
        this.app.stage.removeChild(ft);
        ft.destroy();
        resolve();
      });
    });
  }

  async _shakePanel(pi) {
    const panel = this.playerPanels[pi];
    const ox    = panel.x;
    for (let i = 0; i < 6; i++) {
      await animate(this.app, 45, t => {
        panel.x = ox + lerp(0, i % 2 === 0 ? 9 : -9, t);
      });
    }
    panel.x = ox;
  }

  _nextTurn() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this._highlightCurrentPlayer();
    this.sound.switchTurn();
  }

  /* ── Game over ───────────────────────────────────────────────────────────── */
  async _showGameOver() {
    this.sound.win();
    this._spawnConfetti();
    await wait(500);
    // React modal handles the winner UI; just fire the callback
    let winIdx = 0;
    this.players.forEach((p, i) => { if (p.score > this.players[winIdx].score) winIdx = i; });
    if (this.onGameOver) this.onGameOver(this.players[winIdx], this.players);
  }

  _spawnConfetti() {
    const { app, W, H } = this;
    const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0xa855f7, 0x10b981, 0xf59e0b, 0x3b82f6];

    for (let i = 0; i < 70; i++) {
      const g = new PIXI.Graphics();
      const isRect = Math.random() > 0.5;
      if (isRect) {
        g.rect(-4, -4, 8, 8);
      } else {
        g.circle(0, 0, 4);
      }
      g.fill({ color: colors[Math.floor(Math.random() * colors.length)] });
      g.x   = W / 2 + (Math.random() - 0.5) * 180;
      g.y   = H / 2;
      g._vx = (Math.random() - 0.5) * 14;
      g._vy = -7 - Math.random() * 9;
      g._g  = 0.28 + Math.random() * 0.18;
      g._life = 1;
      app.stage.addChild(g);

      const tick = ticker => {
        g._vx  *= 0.99;
        g._vy  += g._g;
        g.x    += g._vx;
        g.y    += g._vy;
        g._life -= 0.011;
        g.alpha  = g._life;
        g.rotation += 0.08;
        if (g._life <= 0) {
          app.ticker.remove(tick);
          app.stage.removeChild(g);
          g.destroy();
        }
      };
      app.ticker.add(tick);
    }
  }
}

/* ═══════════════════════  REACT WRAPPER  ════════════════════════════════════ */
export default function TornadoGame({
  players     = MOCK_PLAYERS,
  config      = MOCK_CONFIG,
  onGameOver,
  onBack,
  onGivePoints,
  selectedClass,
}) {
  const wrapRef  = useRef(null);
  const appRef   = useRef(null);

  const [winnerData,     setWinnerData]     = useState(null);
  const [showModal,      setShowModal]      = useState(false);
  const [pointsToGive,   setPointsToGive]   = useState(1);
  const [pointsGiven,    setPointsGiven]    = useState(false);
  const [allScores,      setAllScores]      = useState([]);

  useEffect(() => {
    if (!wrapRef.current) return;

    (async () => {
      const w = wrapRef.current.clientWidth  || window.innerWidth  || 900;
      const h = wrapRef.current.clientHeight || window.innerHeight || 560;

      const app = new PIXI.Application();
      await app.init({
        width: w, height: h, background: C.bg,
        antialias: true, resolution: window.devicePixelRatio || 1, autoDensity: true,
      });

      wrapRef.current.appendChild(app.canvas);
      appRef.current = app;

      const game = new TornadoPixiGame(app, players, config, (winner, scores) => {
        setWinnerData(winner);
        setAllScores(scores);
        setShowModal(true);
        if (onGameOver) onGameOver(winner, scores);
      });
      game.build();
    })();

    return () => {
      if (appRef.current) {
        appRef.current.ticker.stop();
        appRef.current.destroy(true, { children: true, texture: true, baseTexture: true });
        appRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGivePoints = () => {
    if (winnerData && onGivePoints) {
      onGivePoints([winnerData], pointsToGive);
      setPointsGiven(true);
    }
  };

  const handleClose = () => {
    // Play Again - reload the page to restart
    window.location.reload();
  };

  const winnerColor = winnerData
    ? ['#10b981','#3b82f6','#f59e0b','#ec4899'][players.indexOf(
        players.find(p => p.name === winnerData.name)) % 4] || '#ffd700'
    : '#ffd700';

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0a0e1a', zIndex: 100 }}>
      <div ref={wrapRef} style={{ width: '100%', height: '100%' }} />

      {/* ← Back button */}
      {onBack && !showModal && (
        <button onClick={onBack} style={{
          position: 'absolute', top: 10, left: 10, zIndex: 20,
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)',
          color: '#fff', borderRadius: 9, padding: '5px 13px',
          fontSize: 12, fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(6px)',
        }}>← Back</button>
      )}

      {/* Card type legend */}
      <div style={{
        position: 'absolute', top: 10, right: 10, zIndex: 20,
        display: 'flex', gap: 6, fontSize: 10, fontWeight: 700,
        color: '#fff', fontFamily: 'system-ui',
      }}>
        {[
          { label: '+pts', color: '#f59e0b' },
          { label: '×2',  color: '#ec4899' },
          { label: '×3',  color: '#a855f7' },
          { label: '🌪️', color: '#06d6e0' },
        ].map(({ label, color }) => (
          <span key={label} style={{
            background: 'rgba(0,0,0,0.45)', border: `1px solid ${color}44`,
            borderRadius: 6, padding: '3px 7px', color, backdropFilter: 'blur(4px)',
          }}>{label}</span>
        ))}
      </div>

      {/* ══ Winner Modal ══ */}
      {showModal && winnerData && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.88)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', zIndex: 100, padding: 24,
          animation: 'pixiFadeIn 0.3s ease-out',
        }}>
          <div style={{
            maxWidth: 480, width: '100%', maxHeight: '90vh', overflowY: 'auto',
            background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
            borderRadius: 28, padding: '40px 36px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
            boxShadow: `0 0 0 4px ${winnerColor}, 0 30px 80px rgba(0,0,0,0.7)`,
            animation: 'pixiBounceIn 0.45s ease-out',
          }}>
            {/* Trophy */}
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: 'rgba(255,215,0,0.15)', border: '3px solid #ffd700',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52,
            }}>🏆</div>

            {/* Winner text */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#ffd700', letterSpacing: 2 }}>WINNER!</div>
              <div style={{ fontSize: 44, fontWeight: 900, color: winnerColor, marginTop: 4 }}>{winnerData.name}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', marginTop: 6 }}>
                ⭐ {winnerData.score} game points
              </div>
            </div>

            {/* All scores */}
            <div style={{
              width: '100%', background: 'rgba(255,255,255,0.05)',
              borderRadius: 14, padding: '12px 16px',
            }}>
              {[...allScores].sort((a, b) => b.score - a.score).map((p, i) => (
                <div key={p.name} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '4px 0', fontSize: 15, fontWeight: 600,
                  color: p.name === winnerData.name ? '#ffd700' : '#94a3b8',
                  borderBottom: i < allScores.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <span>{i + 1}. {p.name}</span>
                  <span>{p.score} pts</span>
                </div>
              ))}
            </div>

            {/* Give points section */}
            {selectedClass && onGivePoints && !pointsGiven && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>Give class points to winner:</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[1, 2, 3, 5].map(val => (
                    <button key={val} onClick={() => setPointsToGive(val)} style={{
                      padding: '10px 18px', fontSize: 18, fontWeight: 800, borderRadius: 12,
                      border: 'none', cursor: 'pointer',
                      background: pointsToGive === val
                        ? 'linear-gradient(135deg,#10b981,#059669)'
                        : 'rgba(255,255,255,0.1)',
                      color: pointsToGive === val ? '#fff' : '#94a3b8',
                      boxShadow: pointsToGive === val ? '0 4px 14px rgba(16,185,129,0.4)' : 'none',
                      transition: 'all 0.15s',
                    }}>+{val}</button>
                  ))}
                </div>
                <button onClick={handleGivePoints} style={{
                  padding: '12px 32px', fontSize: 16, fontWeight: 800,
                  background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                  color: '#fff', border: 'none', borderRadius: 14, cursor: 'pointer',
                  boxShadow: '0 6px 24px rgba(245,158,11,0.45)', width: '100%',
                  transition: 'transform 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  🎁 Give {pointsToGive} Point{pointsToGive !== 1 ? 's' : ''} to {winnerData.name}
                </button>
              </div>
            )}

            {pointsGiven && (
              <div style={{
                fontSize: 16, fontWeight: 700, color: '#10b981', textAlign: 'center',
                padding: '10px 20px', background: 'rgba(16,185,129,0.12)',
                borderRadius: 12, border: '2px solid #10b981', width: '100%',
              }}>
                ✅ {pointsToGive} point{pointsToGive !== 1 ? 's' : ''} given to {winnerData.name}!
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              <button onClick={handleClose} style={{
                padding: '14px 24px', fontSize: 16, fontWeight: 800,
                background: 'linear-gradient(135deg,#4ecdc4,#44a08d)',
                color: '#fff', border: 'none', borderRadius: 16, cursor: 'pointer',
                boxShadow: '0 6px 24px rgba(78,205,196,0.45)', flex: 1,
                transition: 'transform 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                🎮 Play Again
              </button>
              <button onClick={onBack} style={{
                padding: '14px 24px', fontSize: 16, fontWeight: 800,
                background: 'linear-gradient(135deg,#6b7280,#4b5563)',
                color: '#fff', border: 'none', borderRadius: 16, cursor: 'pointer',
                boxShadow: '0 6px 24px rgba(107,114,128,0.45)', flex: 1,
                transition: 'transform 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                ← Back to Menu
              </button>
            </div>
          </div>

          <style>{`
            @keyframes pixiFadeIn   { from { opacity:0 } to { opacity:1 } }
            @keyframes pixiBounceIn {
              0%   { transform: scale(0.3); opacity:0 }
              55%  { transform: scale(1.06) }
              80%  { transform: scale(0.96) }
              100% { transform: scale(1);   opacity:1 }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
