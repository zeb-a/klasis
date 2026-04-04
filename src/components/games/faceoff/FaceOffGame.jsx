import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { SoundManager } from '../shared/TornadoSoundManager';

// Kid-friendly colors (same as Tornado)
const KID_COLORS = {
  backgrounds: [
    0x87CEEB, // Sky blue
    0x98FB98, // Pale green
    0xFFB6C1, // Light pink
    0xFFE4B5, // Moccasin
  ],
  players: [
    0x32CD32, // Lime green
    0x00BFFF, // Deep sky blue
    0xFF69B4, // Hot pink
    0xFFD700, // Gold
  ],
  cards: {
    correct: 0x4CAF50,
    wrong: 0xFF6B6B,
    neutral: 0xE0E0E0
  }
};

class FaceOffScene extends Phaser.Scene {
  constructor(gameConfig, players, onGameEnd, onBackToSetup, onExitToPortal, onWinner) {
    super({ key: 'FaceOffScene' });
    this.gameConfig = gameConfig;
    this.players = players;
    this.onGameEnd = onGameEnd;
    this.onBackToSetup = onBackToSetup;
    this.onExitToPortal = onExitToPortal;
    this.onWinner = onWinner;
    this.soundManager = null;
    this.currentRound = 0;
    this.totalRounds = gameConfig.rounds || 5;
    this.gameMode = gameConfig.mode || 'words'; // 'words' or 'pictures'
    this.wordImagePairs = gameConfig.wordImagePairs || [];
    this.currentPairIndex = 0;
    this.scoreContainer = null;
    this.wordText = null;
    this.displayImage = null; // Image to display at top for pictures mode
    this.leftImageContainers = []; // For pictures mode, these hold word containers
    this.rightImageContainers = []; // For pictures mode, these hold word containers
    this.roundComplete = false;
    this.usedPairs = []; // Track used words to ensure word uniqueness
    this.allowImageReuse = true; // Allow images to be reused
  }

  async create() {
    const { width, height } = this.scale;

    // Kid-friendly gradient background
    this.createKidFriendlyBackground();

    // Create UI buttons
    this.createUIButtons();

    // Create player score panels (compact)
    this.createScorePanels();

    // Create round counter
    this.createRoundCounter();

    // Create display area based on game mode
    if (this.gameMode === 'words') {
      // Words mode: show word at top, images below
      this.createWordDisplay();
      this.createImageGrids();
    } else {
      // Pictures mode: show image at top, words below
      this.createImageDisplay();
      this.createWordGrids();
    }

    // Load and display first round
    this.loadRound();

    this.soundManager = new SoundManager();
    await this.soundManager.init();
    this.soundManager.playMusic('background');
  }

  createKidFriendlyBackground() {
    const { width, height } = this.scale;

    // Light, colorful gradient background
    const bg = this.add.graphics();
    bg.fillStyle(0xFFF5E6, 1);
    bg.fillRect(0, 0, width, height);

    // Add colorful gradient overlay
    const gradientOverlay = this.add.graphics();
    gradientOverlay.fillGradientStyle(0xFFB6C1, 0x87CEEB, 0x87CEEB, 0xFFB6C1, 0.3);
    gradientOverlay.fillRect(0, 0, width, height);

    // Animated floating shapes
    this.orbs = [];
    const orbColors = [0xFF6B6B, 0x4ECDC4, 0xFFE66D, 0x95E1D3];
    for (let i = 0; i < 6; i++) {
      const orb = this.add.circle(
        Phaser.Math.Between(100, width - 100),
        Phaser.Math.Between(100, height - 100),
        Phaser.Math.Between(30, 80),
        orbColors[i % 4],
        0.2
      );
      orb.vx = Phaser.Math.FloatBetween(-0.3, 0.3);
      orb.vy = Phaser.Math.Between(-0.3, 0.3);
      orb.originalAlpha = 0.2;
      this.orbs.push(orb);
    }
  }

  createUIButtons() {
    const { width } = this.scale;
    const buttonPadding = 10;
    const buttonSize = 45;

    // Back Button (Top Left)
    const backButton = this.add.container(buttonPadding, buttonPadding);
    const backBg = this.add.graphics();
    backBg.fillStyle(0x4ECDC4, 1);
    backBg.fillRoundedRect(0, 0, buttonSize, buttonSize, 10);
    backBg.lineStyle(3, 0xFFFFFF, 1);
    backBg.strokeRoundedRect(0, 0, buttonSize, buttonSize, 10);
    backButton.add(backBg);

    const backText = this.add.text(buttonSize / 2, buttonSize / 2, '←', {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontStyle: 'bold'
    });
    backText.setOrigin(0.5);
    backButton.add(backText);

    // Set up interactivity on BACKGROUND GRAPHICS for reliable hit detection
    backBg.setInteractive({
      useHandCursor: true,
      hitArea: new Phaser.Geom.Rectangle(0, 0, buttonSize, buttonSize),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains
    })
      .on('pointerdown', () => this.onBackToSetup())
      .on('pointerover', () => {
        backBg.setScale(1.1);
        backBg.clear();
        backBg.fillStyle(0x3DB8B0, 1);
        backBg.fillRoundedRect(0, 0, buttonSize, buttonSize, 10);
        backBg.lineStyle(3, 0xFFFFFF, 1);
        backBg.strokeRoundedRect(0, 0, buttonSize, buttonSize, 10);
        // Re-enable interactive after clearing
        backBg.setInteractive({
          useHandCursor: true,
          hitArea: new Phaser.Geom.Rectangle(0, 0, buttonSize, buttonSize),
          hitAreaCallback: Phaser.Geom.Rectangle.Contains
        });
      })
      .on('pointerout', () => {
        backBg.setScale(1);
        backBg.clear();
        backBg.fillStyle(0x4ECDC4, 1);
        backBg.fillRoundedRect(0, 0, buttonSize, buttonSize, 10);
        backBg.lineStyle(3, 0xFFFFFF, 1);
        backBg.strokeRoundedRect(0, 0, buttonSize, buttonSize, 10);
        // Re-enable interactive after clearing
        backBg.setInteractive({
          useHandCursor: true,
          hitArea: new Phaser.Geom.Rectangle(0, 0, buttonSize, buttonSize),
          hitAreaCallback: Phaser.Geom.Rectangle.Contains
        });
      });

    // Exit Button (Top Right)
    const exitButton = this.add.container(width - buttonSize - buttonPadding, buttonPadding);
    const exitBg = this.add.graphics();
    exitBg.fillStyle(0xFF6B6B, 1);
    exitBg.fillRoundedRect(0, 0, buttonSize, buttonSize, 10);
    exitBg.lineStyle(3, 0xFFFFFF, 1);
    exitBg.strokeRoundedRect(0, 0, buttonSize, buttonSize, 10);
    exitButton.add(exitBg);

    const exitText = this.add.text(buttonSize / 2, buttonSize / 2, '✕', {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontStyle: 'bold'
    });
    exitText.setOrigin(0.5);
    exitButton.add(exitText);

    // Set up interactivity on BACKGROUND GRAPHICS for reliable hit detection
    exitBg.setInteractive({
      useHandCursor: true,
      hitArea: new Phaser.Geom.Rectangle(0, 0, buttonSize, buttonSize),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains
    })
      .on('pointerdown', () => this.showExitConfirmation())
      .on('pointerover', () => {
        exitBg.setScale(1.1);
        exitBg.clear();
        exitBg.fillStyle(0xE85555, 1);
        exitBg.fillRoundedRect(0, 0, buttonSize, buttonSize, 10);
        exitBg.lineStyle(3, 0xFFFFFF, 1);
        exitBg.strokeRoundedRect(0, 0, buttonSize, buttonSize, 10);
        // Re-enable interactive after clearing
        exitBg.setInteractive({
          useHandCursor: true,
          hitArea: new Phaser.Geom.Rectangle(0, 0, buttonSize, buttonSize),
          hitAreaCallback: Phaser.Geom.Rectangle.Contains
        });
      })
      .on('pointerout', () => {
        exitBg.setScale(1);
        exitBg.clear();
        exitBg.fillStyle(0xFF6B6B, 1);
        exitBg.fillRoundedRect(0, 0, buttonSize, buttonSize, 10);
        exitBg.lineStyle(3, 0xFFFFFF, 1);
        exitBg.strokeRoundedRect(0, 0, buttonSize, buttonSize, 10);
        // Re-enable interactive after clearing
        exitBg.setInteractive({
          useHandCursor: true,
          hitArea: new Phaser.Geom.Rectangle(0, 0, buttonSize, buttonSize),
          hitAreaCallback: Phaser.Geom.Rectangle.Contains
        });
      });

    this.exitButton = exitButton;
    this.exitDialogVisible = false;
  }

  createScorePanels() {
    const { width } = this.scale;
    const panelWidth = 120;
    const panelHeight = 80;
    const padding = 20;

    // Left player score (Player 1)
    const leftPanel = this.add.container(padding, 100);
    const leftBg = this.add.graphics();
    const leftColor = KID_COLORS.players[0];
    leftBg.fillStyle(0xFFFFFF, 0.95);
    leftBg.fillRoundedRect(0, 0, panelWidth, panelHeight, 15);
    leftBg.lineStyle(3, leftColor, 1);
    leftBg.strokeRoundedRect(0, 0, panelWidth, panelHeight, 15);
    leftPanel.add(leftBg);

    const leftName = this.add.text(panelWidth / 2, 20, this.players[0]?.name || 'Player 1', {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#' + leftColor.toString(16).padStart(6, '0'),
      fontStyle: 'bold',
      fontFamily: 'Comic Sans MS, cursive, sans-serif'
    });
    leftName.setOrigin(0.5);
    leftPanel.add(leftName);

    const leftScore = this.add.text(panelWidth / 2, 55, '0', {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#' + leftColor.toString(16).padStart(6, '0'),
      fontStyle: 'bold',
      fontFamily: 'Comic Sans MS, cursive, sans-serif'
    });
    leftScore.setOrigin(0.5);
    leftPanel.add(leftScore);
    this.leftScoreText = leftScore;

    // Right player score (Player 2)
    const rightX = this.scale.width - panelWidth - padding;
    const rightPanel = this.add.container(rightX, 100);
    const rightBg = this.add.graphics();
    const rightColor = KID_COLORS.players[1];
    rightBg.fillStyle(0xFFFFFF, 0.95);
    rightBg.fillRoundedRect(0, 0, panelWidth, panelHeight, 15);
    rightBg.lineStyle(3, rightColor, 1);
    rightBg.strokeRoundedRect(0, 0, panelWidth, panelHeight, 15);
    rightPanel.add(rightBg);

    const rightName = this.add.text(panelWidth / 2, 20, this.players[1]?.name || 'Player 2', {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#' + rightColor.toString(16).padStart(6, '0'),
      fontStyle: 'bold',
      fontFamily: 'Comic Sans MS, cursive, sans-serif'
    });
    rightName.setOrigin(0.5);
    rightPanel.add(rightName);

    const rightScore = this.add.text(panelWidth / 2, 55, '0', {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#' + rightColor.toString(16).padStart(6, '0'),
      fontStyle: 'bold',
      fontFamily: 'Comic Sans MS, cursive, sans-serif'
    });
    rightScore.setOrigin(0.5);
    rightPanel.add(rightScore);
    this.rightScoreText = rightScore;
  }

  createRoundCounter() {
    const { width, height } = this.scale;

    const counterBg = this.add.graphics();
    counterBg.fillStyle(0x4ECDC4, 1);
    counterBg.fillRoundedRect(width / 2 - 80, height - 50, 160, 40, 20);
    counterBg.lineStyle(3, 0xFFFFFF, 1);
    counterBg.strokeRoundedRect(width / 2 - 80, height - 50, 160, 40, 20);

    this.roundText = this.add.text(width / 2, height - 30, `Round ${this.currentRound + 1}/${this.totalRounds}`, {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontStyle: 'bold',
      fontFamily: 'Comic Sans MS, cursive, sans-serif'
    });
    this.roundText.setOrigin(0.5);
  }

  createWordDisplay() {
    const { width, height } = this.scale;

    const wordBg = this.add.graphics();
    wordBg.fillStyle(0xFFFFFF, 0.98);
    wordBg.fillRoundedRect(width / 2 - 200, 120, 400, 80, 20);
    wordBg.lineStyle(4, 0xFFD700, 1);
    wordBg.strokeRoundedRect(width / 2 - 200, 120, 400, 80, 20);
    wordBg.lineStyle(8, 0xFFD700, 0.3);
    wordBg.strokeRoundedRect(width / 2 - 204, 116, 408, 88, 24);

    this.wordText = this.add.text(width / 2, 160, '', {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#333333',
      fontStyle: 'bold',
      fontFamily: 'Comic Sans MS, cursive, sans-serif',
      wordWrap: { width: 380 }
    });
    this.wordText.setOrigin(0.5);
  }

  createImageDisplay() {
    const { width, height } = this.scale;

    // Create a container for the display image (moved down a bit)
    this.imageContainer = this.add.container(width / 2, 200);

    // Background for the image (bigger size)
    const imageBg = this.add.graphics();
    imageBg.fillStyle(0xFFFFFF, 0.98);
    imageBg.fillRoundedRect(-200, -150, 400, 300, 20);
    imageBg.lineStyle(4, 0xFFD700, 1);
    imageBg.strokeRoundedRect(-200, -150, 400, 300, 20);
    imageBg.lineStyle(8, 0xFFD700, 0.3);
    imageBg.strokeRoundedRect(-204, -154, 408, 308, 24);
    this.imageContainer.add(imageBg);

    // Placeholder text (will be replaced by actual image)
    this.displayPlaceholder = this.add.text(0, 0, '🖼️', {
      fontSize: '80px'
    });
    this.displayPlaceholder.setOrigin(0.5);
    this.imageContainer.add(this.displayPlaceholder);
  }

  createImageGrids() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const startY = 320;
    const imageGridSize = 120;
    const gap = 15;

    // Calculate positions for two separate sections
    const sectionGap = 80; // Gap between left and right sections
    const sidePadding = 12; // Padding around each section


    // Grid dimensions
    const cols = 3;
    const rows = 2;
    const gridWidth = cols * imageGridSize + (cols - 1) * gap;
    const gridHeight = rows * imageGridSize + (rows - 1) * gap;
    const bgPadding = 25; // Extra padding inside the background rectangles

    // Calculate total width needed for both sections with gap and padding
    const totalContentWidth = 2 * (gridWidth + bgPadding) + sectionGap;

    // Calculate starting X to center everything
    const startLeftX = (width - totalContentWidth) / 2;

    // Left section (Player 1)
    const leftSectionX = startLeftX;
    const leftSectionWidth = gridWidth + bgPadding;


    const leftSectionBg = this.add.graphics();
    leftSectionBg.fillStyle(0xF0FFF4, 0.3);
    leftSectionBg.fillRoundedRect(leftSectionX, startY - 30, leftSectionWidth, 2 * (imageGridSize + gap) + 60, 15);
    leftSectionBg.lineStyle(3, KID_COLORS.players[0], 0.4);
    leftSectionBg.strokeRoundedRect(leftSectionX, startY - 30, leftSectionWidth, 2 * (imageGridSize + gap) + 60, 15);

    // Right section (Player 2)
    const rightSectionX = leftSectionX + leftSectionWidth + sectionGap;
    const rightSectionWidth = gridWidth + bgPadding;


    const rightSectionBg = this.add.graphics();
    rightSectionBg.fillStyle(0xFFF5F5, 0.3);
    rightSectionBg.fillRoundedRect(rightSectionX, startY - 30, rightSectionWidth, 2 * (imageGridSize + gap) + 60, 15);
    rightSectionBg.lineStyle(3, KID_COLORS.players[1], 0.4);
    rightSectionBg.strokeRoundedRect(rightSectionX, startY - 30, rightSectionWidth, 2 * (imageGridSize + gap) + 60, 15);

    // Create 3x2 grid for left section (Player 1)
    const leftSectionCenter = leftSectionX + leftSectionWidth / 2;
    const startYLeft = startY + 60;


    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Position each slot from center outward
        const offsetFromCenter = (col - (cols - 1) / 2) * (imageGridSize + gap);
        const x = leftSectionCenter + offsetFromCenter;
        const y = startYLeft + row * (imageGridSize + gap);
        this.createImageSlot(x, y, imageGridSize, 'left');
      }
    }

    // Create 3x2 grid for right section (Player 2)
    const rightSectionCenter = rightSectionX + rightSectionWidth / 2;
    const startYRight = startY + 60;


    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Position each slot from center outward
        const offsetFromCenter = (col - (cols - 1) / 2) * (imageGridSize + gap);
        const x = rightSectionCenter + offsetFromCenter;
        const y = startYRight + row * (imageGridSize + gap);
        this.createImageSlot(x, y, imageGridSize, 'right');
      }
    }
  }

  createImageSlot(x, y, size, side) {
    const container = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(0xF5F5F5, 1);
    bg.fillRoundedRect(-size / 2, -size / 2, size, size, 15);
    bg.lineStyle(3, 0xCCCCCC, 1);
    bg.strokeRoundedRect(-size / 2, -size / 2, size, size, 15);
    container.add(bg);

    container.size = size;
    container.side = side;
    container.bg = bg;
    container.content = null;
    container.index = side === 'left' ? this.leftImageContainers.length : this.rightImageContainers.length;
    container.isCorrect = false;
    container.originalX = x;
    container.wrongClicked = false;

    if (side === 'left') {
      this.leftImageContainers.push(container);
    } else {
      this.rightImageContainers.push(container);
    }

    return container;
  }

  createWordGrids() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const startY = 400; // Pushed down for bigger image display
    const slotSize = 150;
    const slotHeight = 50;
    const gap = 25; // Increased gap by 15px (was 10)

    // Calculate positions for two separate sections - increased gap between sections
    const sectionGap = 30; // Additional gap between left and right sections (actual gap = 2 * sectionGap = 60px)


    // Make both sections equal width and symmetrical
    const halfWidth = (centerX - sectionGap) - 20;
    const leftSectionWidth = halfWidth;
    const rightSectionWidth = halfWidth;
    const leftSectionEnd = 20 + leftSectionWidth;
    const rightSectionStart = centerX + sectionGap;


    // Left section container (Player 1) - positioned at 20
    const leftSectionBg = this.add.graphics();
    leftSectionBg.fillStyle(0xF0FFF4, 0.3);
    leftSectionBg.fillRoundedRect(20, startY - 30, leftSectionWidth, 2 * (slotHeight + gap) + 60, 15);
    leftSectionBg.lineStyle(3, KID_COLORS.players[0], 0.4);
    leftSectionBg.strokeRoundedRect(20, startY - 30, leftSectionWidth, 2 * (slotHeight + gap) + 60, 15);

    // Right section container (Player 2) - positioned at centerX + sectionGap
    const rightSectionBg = this.add.graphics();
    rightSectionBg.fillStyle(0xFFF5F5, 0.3);
    rightSectionBg.fillRoundedRect(centerX + sectionGap, startY - 30, rightSectionWidth, 2 * (slotHeight + gap) + 60, 15);
    rightSectionBg.lineStyle(3, KID_COLORS.players[1], 0.4);
    rightSectionBg.strokeRoundedRect(centerX + sectionGap, startY - 30, rightSectionWidth, 2 * (slotHeight + gap) + 60, 15);

    // Create 3x2 grid for left section (Player 1)
    const colsLeft = 3;
    const rowsLeft = 2;
    const gridWidthLeft = colsLeft * slotSize + (colsLeft - 1) * gap;
    // Center the grid in the left section
    const leftSectionCenter = 20 + leftSectionWidth / 2;
    const startYLeft = startY + 60;

    for (let row = 0; row < rowsLeft; row++) {
      for (let col = 0; col < colsLeft; col++) {
        // Position each slot from center outward
        const offsetFromCenter = (col - (colsLeft - 1) / 2) * (slotSize + gap);
        const x = leftSectionCenter + offsetFromCenter;
        const y = startYLeft + row * (slotHeight + gap);
        this.createWordSlot(x, y, slotSize, slotHeight, 'left');
      }
    }

    // Create 3x2 grid for right section (Player 2)
    const colsRight = 3;
    const rowsRight = 2;
    const gridWidthRight = colsRight * slotSize + (colsRight - 1) * gap;
    // Center the grid in the right section
    const rightSectionCenter = centerX + sectionGap + rightSectionWidth / 2;
    const startYRight = startY + 60;

    for (let row = 0; row < rowsRight; row++) {
      for (let col = 0; col < colsRight; col++) {
        // Position each slot from center outward
        const offsetFromCenter = (col - (colsRight - 1) / 2) * (slotSize + gap);
        const x = rightSectionCenter + offsetFromCenter;
        const y = startYRight + row * (slotHeight + gap);
        this.createWordSlot(x, y, slotSize, slotHeight, 'right');
      }
    }
  }

  createWordSlot(x, y, width, height, side) {
    const container = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(0xF5F5F5, 1);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, 12);
    bg.lineStyle(3, 0xCCCCCC, 1);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 12);
    container.add(bg);

    container.size = { width, height };
    container.side = side;
    container.bg = bg;
    container.content = null;
    container.index = side === 'left' ? this.leftImageContainers.length : this.rightImageContainers.length;
    container.isCorrect = false;
    container.originalX = x;
    container.originalY = y;
    container.wrongClicked = false;

    if (side === 'left') {
      this.leftImageContainers.push(container);
    } else {
      this.rightImageContainers.push(container);
    }

    return container;
  }

  async loadRound() {
    // Check if we've reached configured number of rounds
    if (this.currentRound >= this.totalRounds) {
      await this.showGameOver();
      return;
    }

    // Check if we've used all unique words and this is standard round count (not custom 10/20/30)
    const allUniqueWordsUsed = this.usedPairs.length >= this.wordImagePairs.length;
    const isCustomRounds = this.totalRounds === 10 || this.totalRounds === 20 || this.totalRounds === 30;

    if (allUniqueWordsUsed && !isCustomRounds) {
      // All unique words used, end game
      await this.showGameOver();
      return;
    }

    // Get current word-image pair - ensure word uniqueness
    let availablePairs = this.wordImagePairs.filter((_, index) => !this.usedPairs.includes(index));

    if (availablePairs.length === 0 && !isCustomRounds) {
      // All unique words used, end game
      await this.showGameOver();
      return;
    } else if (availablePairs.length === 0 && isCustomRounds) {
      // Custom rounds with insufficient unique words - allow word reuse
      availablePairs = [...this.wordImagePairs];
    }

    // Pick random available pair (ensures word uniqueness unless custom rounds)
    const pairIndex = Phaser.Math.Between(0, availablePairs.length - 1);
    const pair = availablePairs[pairIndex];
    const actualIndex = this.wordImagePairs.indexOf(pair);

    // Only track used words for standard game (not custom rounds with insufficient words)
    if (!(isCustomRounds && this.usedPairs.length >= this.wordImagePairs.length)) {
      this.usedPairs.push(actualIndex);
    }

    this.currentPair = pair;

    // Update round counter
    this.roundText.setText(`Round ${this.currentRound + 1}/${this.totalRounds}`);

    // Display content based on game mode
    if (this.gameMode === 'words') {
      // Words mode: show word at top, load images below
      this.wordText.setText(pair.word);
      await this.loadImagesForRound(pair);
    } else {
      // Pictures mode: show image at top, load words below
      // Clear previous display image
      if (this.displayImage) {
        this.displayImage.destroy();
        this.displayImage = null;
      }
      if (this.displayPlaceholder) {
        this.displayPlaceholder.setVisible(true);
      }
      await this.loadWordsForRound(pair);
    }
  }

  async loadImagesForRound(pair) {
    return new Promise((resolve) => {
      // FIX: Get UNIQUE images only first (deduplicate)
      const allUniqueImages = [...new Set(this.wordImagePairs.map(p => p.image))];

      // Filter out the correct image and get unique distractors
      const uniqueDistractors = allUniqueImages.filter(img => img !== pair.image);

      // Create array with correct image and 5 distractors
      const images = [pair.image];

      // If we have enough unique distractors, use them without repetition
      if (uniqueDistractors.length >= 5) {
        // Shuffle distractors and pick 5 unique ones
        const shuffledDistractors = Phaser.Utils.Array.Shuffle([...uniqueDistractors]);
        for (let i = 0; i < 5; i++) {
          images.push(shuffledDistractors[i]);
        }
      } else if (uniqueDistractors.length > 0) {
        // Not enough unique distractors - shuffle all available and add them first
        const shuffledUnique = Phaser.Utils.Array.Shuffle([...uniqueDistractors]);
        for (let i = 0; i < shuffledUnique.length; i++) {
          images.push(shuffledUnique[i]);
        }
        // Fill remaining slots with shuffledUnique (allowing reuse only after all unique are used)
        const needed = 6 - images.length;
        for (let i = 0; i < needed; i++) {
          const randomDistractor = shuffledUnique[Phaser.Math.Between(0, shuffledUnique.length - 1)];
          images.push(randomDistractor);
        }
      } else {
        // Only one unique image available, fill with it
        for (let i = 0; i < 5; i++) {
          images.push(pair.image);
        }
      }

      // Shuffle final array
      Phaser.Utils.Array.Shuffle(images);

      // Load and display images on both sides (separately)
      let loadedCount = 0;
      const totalImages = 12; // 6 on left, 6 on right

      // Load left side images
      images.forEach((imageSrc, imgIndex) => {
        const textureKey = `round${this.currentRound}_left_${imgIndex}`;

        this.load.image(textureKey, imageSrc);

        this.load.once(`filecomplete-image-${textureKey}`, () => {
          const container = this.leftImageContainers[imgIndex];
          if (container) {
            this.displayImageInSlot(container, textureKey);
            container.isCorrect = (images[imgIndex] === pair.image);
            loadedCount++;

            if (loadedCount >= totalImages) {
              this.enableImageClicks();
              resolve();
            }
          }
        });
      });

      // Load right side images (same shuffled order)
      images.forEach((imageSrc, imgIndex) => {
        const textureKey = `round${this.currentRound}_right_${imgIndex}`;

        this.load.image(textureKey, imageSrc);

        this.load.once(`filecomplete-image-${textureKey}`, () => {
          const container = this.rightImageContainers[imgIndex];
          if (container) {
            this.displayImageInSlot(container, textureKey);
            container.isCorrect = (images[imgIndex] === pair.image);
            loadedCount++;

            if (loadedCount >= totalImages) {
              this.enableImageClicks();
              resolve();
            }
          }
        });
      });

      this.load.start();
    });
  }

  displayImageInSlot(container, textureKey) {
    const size = container.size;
    const sprite = this.add.sprite(0, 0, textureKey);
    sprite.setDisplaySize(size - 8, size - 8);
    sprite.setOrigin(0.5, 0.5);
    
    // Create a mask graphics to constrain image to the slot
    const maskGraphics = this.make.graphics();
    maskGraphics.fillStyle(0xFFFFFF, 1);
    maskGraphics.fillRoundedRect(-container.size / 2, -container.size / 2, container.size, container.size, 15);
    maskGraphics.setDepth(0);
    
    // Create the mask
    const mask = maskGraphics.createGeometryMask();
    sprite.setMask(mask);
    
    // Add sprite to container
    container.add(sprite);
    
    // Add mask graphics to the scene at the same position as container
    maskGraphics.setPosition(container.x, container.y);
    maskGraphics.setVisible(false);
    
    container.content = sprite;
    container.textureKey = textureKey;
    container.maskGraphics = maskGraphics;
  }

  async loadWordsForRound(pair) {
    return new Promise((resolve) => {
      // FIX: Get UNIQUE words only first (deduplicate)
      const allUniqueWords = [...new Set(this.wordImagePairs.map(p => p.word))];

      // Filter out the correct word and get unique distractors
      const uniqueDistractors = allUniqueWords.filter(word => word !== pair.word);

      // Create array with correct word and 5 distractors
      const words = [pair.word];

      // If we have enough unique distractors, use them without repetition
      if (uniqueDistractors.length >= 5) {
        // Shuffle distractors and pick 5 unique ones
        const shuffledDistractors = Phaser.Utils.Array.Shuffle([...uniqueDistractors]);
        for (let i = 0; i < 5; i++) {
          words.push(shuffledDistractors[i]);
        }
      } else if (uniqueDistractors.length > 0) {
        // Not enough unique distractors - shuffle all available and add them first
        const shuffledUnique = Phaser.Utils.Array.Shuffle([...uniqueDistractors]);
        for (let i = 0; i < shuffledUnique.length; i++) {
          words.push(shuffledUnique[i]);
        }
        // Fill remaining slots with shuffledUnique (allowing reuse only after all unique are used)
        const needed = 6 - words.length;
        for (let i = 0; i < needed; i++) {
          const randomDistractor = shuffledUnique[Phaser.Math.Between(0, shuffledUnique.length - 1)];
          words.push(randomDistractor);
        }
      } else {
        // Only one unique word available, fill with it
        for (let i = 0; i < 5; i++) {
          words.push(pair.word);
        }
      }

      // Shuffle final array
      Phaser.Utils.Array.Shuffle(words);

      // Load and display the image at top - use unique texture key for each round
      const textureKey = `display-image-${this.currentRound}`;
      this.load.image(textureKey, pair.image);

      // Set up load completion handler BEFORE starting the load
      this.load.once(`filecomplete-image-${textureKey}`, () => {
        // Clear previous image
        if (this.displayImage) {
          this.displayImage.destroy();
        }
        if (this.displayPlaceholder) {
          this.displayPlaceholder.setVisible(false);
        }

        // Create new image (bigger size)
        this.displayImage = this.add.sprite(0, 0, textureKey);
        this.displayImage.setDisplaySize(380, 280);
        this.displayImage.setOrigin(0.5);
        // Add after the background (which is at index 0), before any other elements
        this.imageContainer.addAt(this.displayImage, 1);

        // Image is loaded, now display words and enable clicks
        this.displayWordsInSlots(words, pair.word);
        this.enableWordClicks();
        resolve();
      });

      // Start loading the image AFTER setting up the listener
      this.load.start();
    });
  }

  displayWordsInSlots(words, correctWord) {
    // Display words in slots (instant, no loading needed)
    // Load left side words
    words.forEach((word, wordIndex) => {
      const container = this.leftImageContainers[wordIndex];
      if (container) {
        this.displayWordInSlot(container, word);
        container.isCorrect = (word === correctWord);
      }
    });

    // Load right side words (same shuffled order)
    words.forEach((word, wordIndex) => {
      const container = this.rightImageContainers[wordIndex];
      if (container) {
        this.displayWordInSlot(container, word);
        container.isCorrect = (word === correctWord);
      }
    });
  }

  displayWordInSlot(container, word) {
    const { width, height } = container.size;

    // Create text - position at (0, 0) which is center of container
    const text = this.add.text(0, 0, word, {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333333',
      fontStyle: 'bold',
      fontFamily: 'Comic Sans MS, cursive, sans-serif'
    });
    // Set origin to center - text will be centered at (0, 0)
    text.setOrigin(0.5, 0.5);
    // Set word wrap width to fit within the slot with padding
    text.setWordWrapWidth(width - 20);
    container.add(text);
    container.content = text;
  }

  enableImageClicks() {
    // Enable clicks for both sides - use background graphics for hit detection
    [...this.leftImageContainers, ...this.rightImageContainers].forEach(container => {
      if (container.content && container.bg) {
        const size = typeof container.size === 'object' ? container.size.width : container.size;

        // Remove any existing interactive
        if (container.input) {
          container.disableInteractive();
        }
        if (container.bg.input) {
          container.bg.disableInteractive();
        }

        // Set up interactivity on BACKGROUND GRAPHICS
        container.bg.setInteractive({
          useHandCursor: true,
          hitArea: new Phaser.Geom.Rectangle(-size / 2, -size / 2, size, size),
          hitAreaCallback: Phaser.Geom.Rectangle.Contains
        })
          .setDepth(101)
          .on('pointerdown', (pointer) => {
            this.handleImageClick(container);
          })
          .on('pointerover', () => {
            // Add subtle hover effect for better feedback
            if (container.bg) {
              container.bg.clear();
              container.bg.fillStyle(0xE8F4F8, 1);
              container.bg.fillRoundedRect(-size / 2, -size / 2, size, size, 15);
              container.bg.lineStyle(3, 0x4ECDC4, 1);
              container.bg.strokeRoundedRect(-size / 2, -size / 2, size, size, 15);
              // Re-enable interactive after clearing
              container.bg.setInteractive({
                useHandCursor: true,
                hitArea: new Phaser.Geom.Rectangle(-size / 2, -size / 2, size, size),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains
              }).setDepth(101);
            }
          })
          .on('pointerout', () => {
            // Remove hover effect
            if (container.bg && !container.wrongClicked) {
              container.bg.clear();
              container.bg.fillStyle(0xF5F5F5, 1);
              container.bg.fillRoundedRect(-size / 2, -size / 2, size, size, 15);
              container.bg.lineStyle(3, 0xCCCCCC, 1);
              container.bg.strokeRoundedRect(-size / 2, -size / 2, size, size, 15);
              // Re-enable interactive after clearing
              container.bg.setInteractive({
                useHandCursor: true,
                hitArea: new Phaser.Geom.Rectangle(-size / 2, -size / 2, size, size),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains
              }).setDepth(101);
            }
          });
      }
    });
  }

  enableWordClicks() {
    // Enable clicks for word slots using background graphics for hit detection
    [...this.leftImageContainers, ...this.rightImageContainers].forEach((container, index) => {
      if (container.content && container.bg) {
        // Remove any existing interactive on the container
        if (container.input) {
          container.disableInteractive();
        }

        // Remove any existing interactive on the background
        if (container.bg.input) {
          container.bg.disableInteractive();
        }

        // Set up interactivity on the BACKGROUND GRAPHICS instead of the container
        // This is more reliable because the background is the visible element
        container.bg.setInteractive({
          useHandCursor: true,
          hitArea: new Phaser.Geom.Rectangle(-container.size.width / 2, -container.size.height / 2, container.size.width, container.size.height),
          hitAreaCallback: Phaser.Geom.Rectangle.Contains
        })
          .setDepth(101)
          .on('pointerdown', (pointer) => {
            this.handleImageClick(container);
          })
          .on('pointerover', () => {
            if (container.bg) {
              const { width, height } = container.size;
              container.bg.clear();
              container.bg.fillStyle(0xE8F4F8, 1);
              container.bg.fillRoundedRect(-width / 2, -height / 2, width, height, 12);
              container.bg.lineStyle(3, 0x4ECDC4, 1);
              container.bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 12);
              // Re-enable interactive after clearing (clear removes interactivity)
              container.bg.setInteractive({
                useHandCursor: true,
                hitArea: new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains
              }).setDepth(101);
            }
          })
          .on('pointerout', () => {
            if (container.bg && !container.wrongClicked) {
              const { width, height } = container.size;
              container.bg.clear();
              container.bg.fillStyle(0xF5F5F5, 1);
              container.bg.fillRoundedRect(-width / 2, -height / 2, width, height, 12);
              container.bg.lineStyle(3, 0xCCCCCC, 1);
              container.bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 12);
              // Re-enable interactive after clearing
              container.bg.setInteractive({
                useHandCursor: true,
                hitArea: new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains
              }).setDepth(101);
            }
          });
      }
    });
  }

  async handleImageClick(container) {
    if (this.roundComplete) return;

    // Check if this is the first click of the round
    if (this.firstClickSide) {
      // Someone already clicked, ignore
      return;
    }

    this.firstClickSide = container.side;
    const playerIndex = container.side === 'left' ? 0 : 1;
    const isCorrect = container.isCorrect;

    if (isCorrect) {
      // Correct answer - play sound
      this.soundManager?.playSound('points');

      // Visual feedback on correct slot - kid-friendly bounce animation
      container.bg.clear();
      container.bg.fillStyle(KID_COLORS.cards.correct, 1);

      const { width, height } = typeof container.size === 'object' ? container.size : { width: container.size, height: container.size };
      const radius = this.gameMode === 'words' ? 15 : 12;
      container.bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
      container.bg.lineStyle(4, 0xFFFFFF, 1);
      container.bg.strokeRoundedRect(-width / 2, -height / 2, width, height, radius);

      // Playful bounce animation for correct slot
      this.tweens.add({
        targets: container,
        scaleX: 1.4,
        scaleY: 1.4,
        duration: 200,
        ease: 'Elastic.easeOut',
        yoyo: true,
        repeat: 1,
        onRepeat: () => {
          container.setScale(1.2);
        }
      });

      // Spawn fun colorful particles
      this.spawnCelebrationParticles(container.x, container.y);

      // Gentle fade for other slots
      [...this.leftImageContainers, ...this.rightImageContainers].forEach(otherContainer => {
        if (otherContainer !== container && otherContainer.content) {
          this.tweens.add({
            targets: otherContainer,
            alpha: 0.3,
            scaleX: 0.9,
            scaleY: 0.9,
            duration: 500,
            ease: 'Sine.easeOut'
          });
        }
      });

      // Update score with playful animation
      await new Promise(resolve => setTimeout(resolve, 400));
      this.players[playerIndex].score = (this.players[playerIndex].score || 0) + 1;
      const scoreText = playerIndex === 0 ? this.leftScoreText : this.rightScoreText;

      // Score text bounce
      this.tweens.add({
        targets: scoreText,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 200,
        ease: 'Back.easeOut',
        yoyo: true,
        repeat: 1,
        onRepeat: () => {
          scoreText.setText(this.players[playerIndex].score);
          scoreText.setScale(1);
        }
      });

      // Fun star popup
      const stars = ['⭐', '✨', '🌟'];
      const randomStar = stars[Math.floor(Math.random() * stars.length)];
      const starPopup = this.add.text(container.x, container.y - 60, randomStar, {
        fontSize: '64px',
        fontStyle: 'bold',
        fontFamily: 'Comic Sans MS, cursive, sans-serif'
      });
      starPopup.setOrigin(0.5);
      starPopup.setAlpha(0);
      this.tweens.add({
        targets: starPopup,
        alpha: 1,
        y: starPopup.y - 30,
        duration: 300,
        ease: 'Power2.easeOut',
        yoyo: true,
        repeat: 1,
        onComplete: () => starPopup.destroy()
      });

      // Disable all interactions
      this.disableAllImages();

      this.roundComplete = true;

      // Wait and then next round
      await new Promise(resolve => setTimeout(resolve, 1800));
      this.nextRound();
    } else {
      // Wrong answer - playful shake animation
      this.soundManager?.playSound('hover');

      // Mark container as wrong clicked to restore correct hover state
      container.wrongClicked = true;

      // Shake animation
      this.tweens.add({
        targets: container,
        x: container.x + 10,
        duration: 50,
        ease: 'Linear.easeNone',
        yoyo: true,
        repeat: 3,
        onComplete: () => {
          container.x = container.originalX || container.x;
        }
      });

      // Gentle fade out with wiggle
      this.tweens.add({
        targets: container,
        alpha: 0,
        rotation: 0.2,
        scaleX: 0.7,
        scaleY: 0.7,
        duration: 400,
        ease: 'Sine.easeOut',
        delay: 150,
        onComplete: () => {
          container.content?.destroy();
          container.bg.clear();
          container.bg.fillStyle(KID_COLORS.cards.wrong, 0.7);

          const { width, height } = typeof container.size === 'object' ? container.size : { width: container.size, height: container.size };
          const radius = this.gameMode === 'words' ? 15 : 12;
          container.bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
          container.bg.lineStyle(2, 0xFF9999, 1);
          container.bg.strokeRoundedRect(-width / 2, -height / 2, width, height, radius);
        }
      });

      // Remove from interactive
      container.disableInteractive();

      // Other player gets a chance
      this.firstClickSide = null;
    }
  }

  disableAllImages() {
    [...this.leftImageContainers, ...this.rightImageContainers].forEach(container => {
      container.disableInteractive();
    });
  }

  nextRound() {
    // Clear display image for pictures mode BEFORE incrementing round
    if (this.gameMode === 'pictures') {
      if (this.displayImage) {
        this.displayImage.destroy();
        this.displayImage = null;
      }
      if (this.displayPlaceholder) {
        this.displayPlaceholder.setVisible(true);
      }
      // Remove old texture from cache (use currentRound BEFORE incrementing)
      const oldTextureKey = `display-image-${this.currentRound}`;
      if (this.textures.exists(oldTextureKey)) {
        this.textures.remove(oldTextureKey);
      }
    }

    this.currentRound++;
    this.roundComplete = false;
    this.firstClickSide = null;

    // Clear all containers from both sides
    [...this.leftImageContainers, ...this.rightImageContainers].forEach(container => {
      if (container.content) {
        // For image mode, clear mask
        if (this.gameMode === 'words' && container.content.clearMask) {
          container.content.clearMask();
        }
        container.content.destroy();
        container.content = null;
      }
      if (container.maskGraphics) {
        container.maskGraphics.destroy();
        container.maskGraphics = null;
      }
      container.bg.clear();

      // Reset based on game mode
      if (this.gameMode === 'words') {
        const size = container.size;
        container.bg.fillStyle(0xF5F5F5, 1);
        container.bg.fillRoundedRect(-size / 2, -size / 2, size, size, 15);
        container.bg.lineStyle(3, 0xCCCCCC, 1);
        container.bg.strokeRoundedRect(-size / 2, -size / 2, size, size, 15);
        container.textureKey = null;
      } else {
        const { width, height } = container.size;
        container.bg.fillStyle(0xF5F5F5, 1);
        container.bg.fillRoundedRect(-width / 2, -height / 2, width, height, 12);
        container.bg.lineStyle(3, 0xCCCCCC, 1);
        container.bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 12);
      }

      container.isCorrect = false;
      container.wrongClicked = false;
      container.alpha = 1;
      container.scaleX = 1;
      container.scaleY = 1;
      container.rotation = 0;
      container.x = container.originalX;
    });

    this.loadRound();
  }

  async showGameOver() {
    // Find winner
    const p1Score = this.players[0].score || 0;
    const p2Score = this.players[1].score || 0;
    const winnerIndex = p1Score >= p2Score ? 0 : 1;
    const isTie = p1Score === p2Score;

    // Call the winner callback to notify React component (only if not a tie)
    if (this.onWinner && !isTie) {
      const winner = this.players[winnerIndex];
      this.onWinner(winner, winnerIndex);
    }

    // Create confetti
    this.createConfetti();

    // Create game over screen
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(0, 0, this.scale.width, this.scale.height);
    overlay.setDepth(2000);

    const container = this.add.container(this.scale.width / 2, this.scale.height / 2);
    container.setDepth(2001);

    // Game over panel
    const panel = this.add.graphics();
    panel.fillStyle(0xFFFFFF, 0.98);
    panel.fillRoundedRect(-300, -250, 600, 500, 30);
    panel.lineStyle(5, 0x4ECDC4, 1);
    panel.strokeRoundedRect(-300, -250, 600, 500, 30);
    container.add(panel);

    // Title
    const titleText = isTie ? "IT'S A TIE!" : '🏆 WINNER! 🏆';
    const title = this.add.text(0, -180, titleText, {
      fontSize: '48px',
      fontWeight: 'bold',
      color: isTie ? '#4ECDC4' : '#FFD700',
      fontStyle: 'bold',
      fontFamily: 'Comic Sans MS, cursive, sans-serif',
      stroke: '#000000',
      strokeThickness: 3
    });
    title.setOrigin(0.5);
    container.add(title);

    // Winner name
    if (!isTie) {
      const winner = this.players[winnerIndex];
      const winnerName = this.add.text(0, -100, winner?.name || `Player ${winnerIndex + 1}`, {
        fontSize: '56px',
        fontWeight: 'bold',
        color: '#' + (KID_COLORS.players[winnerIndex] || 0x32CD32).toString(16).padStart(6, '0'),
        fontStyle: 'bold',
        fontFamily: 'Comic Sans MS, cursive, sans-serif'
      });
      winnerName.setOrigin(0.5);
      container.add(winnerName);
    }

    // Scores
    let scoreY = isTie ? -50 : -30;
    this.players.forEach((player, index) => {
      const scoreText = this.add.text(0, scoreY, `${player?.name || 'P' + (index + 1)}: ${player?.score || 0} points`, {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#' + (KID_COLORS.players[index] || 0x32CD32).toString(16).padStart(6, '0'),
        fontStyle: 'bold',
        fontFamily: 'Comic Sans MS, cursive, sans-serif'
      });
      scoreText.setOrigin(0.5);
      container.add(scoreText);
      scoreY += 50;
    });

    // Play again button
    const playAgainBtn = this.add.container(0, 180);
    const playAgainBg = this.add.graphics();
    playAgainBg.fillStyle(0x4ECDC4, 1);
    playAgainBg.fillRoundedRect(-100, -30, 200, 60, 15);
    playAgainBg.lineStyle(3, 0xFFFFFF, 1);
    playAgainBg.strokeRoundedRect(-100, -30, 200, 60, 15);
    playAgainBtn.add(playAgainBg);

    const playAgainText = this.add.text(0, 0, '🔄 PLAY AGAIN', {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontStyle: 'bold',
      fontFamily: 'Comic Sans MS, cursive, sans-serif'
    });
    playAgainText.setOrigin(0.5);
    playAgainBtn.add(playAgainText);

    playAgainBtn.setSize(200, 60);
    playAgainBtn.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.onBackToSetup())
      .on('pointerover', () => playAgainBg.setScale(1.05))
      .on('pointerout', () => playAgainBg.setScale(1));

    container.add(playAgainBtn);

    // Animate in
    container.setScale(0);
    this.tweens.add({
      targets: container,
      scale: 1,
      duration: 500,
      ease: 'Back.easeOut'
    });

    this.soundManager?.playSound('win');
  }

  createConfetti() {
    const colors = [0xFF6B6B, 0x4ECDC4, 0xFFD700, 0x95E1D3, 0xFF69B4];
    
    for (let i = 0; i < 100; i++) {
      const confetti = this.add.rectangle(
        Phaser.Math.Between(0, this.scale.width),
        -20,
        Phaser.Math.Between(5, 15),
        Phaser.Math.Between(5, 15),
        colors[Phaser.Math.Between(0, colors.length - 1)],
        1
      );
      confetti.setDepth(1999);
      
      this.tweens.add({
        targets: confetti,
        y: this.scale.height + 50,
        x: confetti.x + Phaser.Math.Between(-100, 100),
        rotation: Phaser.Math.Between(0, Math.PI * 4),
        duration: Phaser.Math.Between(3000, 5000),
        ease: 'Linear',
        onComplete: () => confetti.destroy()
      });
    }
  }

  showExitConfirmation() {
    if (this.exitDialogVisible) return;
    this.exitDialogVisible = true;

    const { width, height } = this.scale;
    const dialogWidth = 400;
    const dialogHeight = 260;

    // Create overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, width, height);
    overlay.setDepth(3000);

    // Create dialog container
    const dialogContainer = this.add.container(width / 2, height / 2);
    dialogContainer.setDepth(3001);

    // Dialog background
    const dialogBg = this.add.graphics();
    dialogBg.fillStyle(0xFFFFFF, 0.98);
    dialogBg.fillRoundedRect(-dialogWidth / 2, -dialogHeight / 2, dialogWidth, dialogHeight, 25);
    dialogBg.lineStyle(4, 0xFF6B6B, 1);
    dialogBg.strokeRoundedRect(-dialogWidth / 2, -dialogHeight / 2, dialogWidth, dialogHeight, 25);
    dialogContainer.add(dialogBg);

    // Warning icon
    const warningText = this.add.text(0, -dialogHeight / 2 + 70, '⚠️', {
      fontSize: '48px'
    });
    warningText.setOrigin(0.5);
    dialogContainer.add(warningText);

    // Dialog title
    const titleText = this.add.text(0, -dialogHeight / 2 + 120, 'Exit Game?', {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#FF6B6B',
      fontStyle: 'bold',
      fontFamily: 'Comic Sans MS, cursive, sans-serif'
    });
    titleText.setOrigin(0.5);
    dialogContainer.add(titleText);

    // Buttons container
    const buttonsContainer = this.add.container(0, 50);
    dialogContainer.add(buttonsContainer);

    // OK Button (Exit)
    const okBtn = this.add.container(-90, 0);
    const okBg = this.add.graphics();
    okBg.fillStyle(0xFF6B6B, 1);
    okBg.fillRoundedRect(-70, -20, 140, 40, 12);
    okBg.lineStyle(2, 0xFFFFFF, 1);
    okBg.strokeRoundedRect(-70, -20, 140, 40, 12);
    okBtn.add(okBg);

    const okText = this.add.text(0, 0, 'OK', {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontStyle: 'bold',
      fontFamily: 'Comic Sans MS, cursive, sans-serif'
    });
    okText.setOrigin(0.5);
    okBtn.add(okText);

    okBtn.setSize(140, 40);
    okBtn.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.hideExitConfirmation();
        this.onExitToPortal && this.onExitToPortal();
      })
      .on('pointerover', () => {
        okBg.clear();
        okBg.fillStyle(0xE85555, 1);
        okBg.fillRoundedRect(-70, -20, 140, 40, 12);
        okBg.lineStyle(2, 0xFFFFFF, 1);
        okBg.strokeRoundedRect(-70, -20, 140, 40, 12);
      })
      .on('pointerout', () => {
        okBg.clear();
        okBg.fillStyle(0xFF6B6B, 1);
        okBg.fillRoundedRect(-70, -20, 140, 40, 12);
        okBg.lineStyle(2, 0xFFFFFF, 1);
        okBg.strokeRoundedRect(-70, -20, 140, 40, 12);
      });

    buttonsContainer.add(okBtn);

    // Stay Button
    const stayBtn = this.add.container(90, 0);
    const stayBg = this.add.graphics();
    stayBg.fillStyle(0x4ECDC4, 1);
    stayBg.fillRoundedRect(-70, -20, 140, 40, 12);
    stayBg.lineStyle(2, 0xFFFFFF, 1);
    stayBg.strokeRoundedRect(-70, -20, 140, 40, 12);
    stayBtn.add(stayBg);

    const stayText = this.add.text(0, 0, 'Stay', {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontStyle: 'bold',
      fontFamily: 'Comic Sans MS, cursive, sans-serif'
    });
    stayText.setOrigin(0.5);
    stayBtn.add(stayText);

    stayBtn.setSize(140, 40);
    stayBtn.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.hideExitConfirmation();
      })
      .on('pointerover', () => {
        stayBg.clear();
        stayBg.fillStyle(0x3DB8B0, 1);
        stayBg.fillRoundedRect(-70, -20, 140, 40, 12);
        stayBg.lineStyle(2, 0xFFFFFF, 1);
        stayBg.strokeRoundedRect(-70, -20, 140, 40, 12);
      })
      .on('pointerout', () => {
        stayBg.clear();
        stayBg.fillStyle(0x4ECDC4, 1);
        stayBg.fillRoundedRect(-70, -20, 140, 40, 12);
        stayBg.lineStyle(2, 0xFFFFFF, 1);
        stayBg.strokeRoundedRect(-70, -20, 140, 40, 12);
      });

    buttonsContainer.add(stayBtn);

    // Animate in
    dialogContainer.setScale(0);
    this.tweens.add({
      targets: dialogContainer,
      scale: 1,
      duration: 300,
      ease: 'Back.easeOut'
    });

    this.exitOverlay = overlay;
    this.exitDialog = dialogContainer;
  }

  hideExitConfirmation() {
    if (!this.exitDialogVisible) return;

    // Animate out
    this.tweens.add({
      targets: this.exitDialog,
      scale: 0,
      duration: 200,
      ease: 'Back.easeIn',
      onComplete: () => {
        if (this.exitOverlay) {
          this.exitOverlay.destroy();
          this.exitOverlay = null;
        }
        if (this.exitDialog) {
          this.exitDialog.destroy();
          this.exitDialog = null;
        }
        this.exitDialogVisible = false;
      }
    });
  }

  createDividerFeedback(x, y) {
    // Create a visual ripple effect on the divider
    const ripple = this.add.ellipse(x, y, 16, 30, 0x4ECDC4, 0.6);
    ripple.setDepth(1000);

    this.tweens.add({
      targets: ripple,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 500,
      ease: 'Power2.easeOut',
      onComplete: () => ripple.destroy()
    });
  }

  spawnParticles(x, y, color, count = 20) {
    for (let i = 0; i < count; i++) {
      const particle = this.add.circle(x, y, Phaser.Math.Between(3, 8), color, 1);
      particle.setDepth(999);

      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const speed = Phaser.Math.Between(80, 250);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      this.tweens.add({
        targets: particle,
        x: particle.x + vx,
        y: particle.y + vy,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        duration: 1000,
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy()
      });
    }
  }

  spawnCelebrationParticles(x, y) {
    const colors = [0xFF6B6B, 0x4ECDC4, 0xFFD700, 0x95E1D3, 0xFF69B4, 0x98FB98];
    const shapes = ['circle', 'star', 'heart'];
    
    for (let i = 0; i < 40; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
      let particle;
      
      if (shapeType === 'star') {
        // Create star shape
        particle = this.add.star(0, 0, Phaser.Math.Between(4, 10), 5, 0.5, 2, color, 1);
      } else if (shapeType === 'heart') {
        // Create heart shape using circle
        particle = this.add.circle(0, 0, Phaser.Math.Between(4, 8), color, 1);
      } else {
        // Default circle
        particle = this.add.circle(0, 0, Phaser.Math.Between(4, 10), color, 1);
      }
      
      particle.setPosition(x, y);
      particle.setDepth(999);
      
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const speed = Phaser.Math.Between(100, 300);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 50; // Upward bias
      
      // Playful bouncy animation
      this.tweens.add({
        targets: particle,
        x: particle.x + vx,
        y: particle.y + vy,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        rotation: Phaser.Math.FloatBetween(0, Math.PI * 2),
        duration: Phaser.Math.Between(800, 1500),
        ease: 'Elastic.easeOut',
        onComplete: () => particle.destroy()
      });
    }
  }

  update() {
    // Animate floating orbs
    if (this.orbs && this.orbs.length > 0) {
      this.orbs.forEach(orb => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < 0) orb.x = this.scale.width;
        if (orb.x > this.scale.width) orb.x = 0;
        if (orb.y < 0) orb.y = this.scale.height;
        if (orb.y > this.scale.height) orb.y = 0;

        orb.alpha = orb.originalAlpha + Math.sin(Date.now() / 1000 + orb.x) * 0.05;
      });
    }
  }
}

const FaceOffGame = ({ config, players, onGameEnd, onBackToSetup, onExitToPortal, selectedClass, onGivePoints }) => {
  const gameContainerRef = useRef(null);
  const gameRef = useRef(null);
  const [pointsToGive, setPointsToGive] = useState(1);
  const [pointsGiven, setPointsGiven] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winnerData, setWinnerData] = useState(null);

  useEffect(() => {
    if (!gameContainerRef.current) return;

    const handleWinner = (winner, winnerIndex) => {
      setWinnerData({ ...winner, index: winnerIndex });
      setShowWinnerModal(true);
    };

    const phaserConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: gameContainerRef.current,
      backgroundColor: '#FFF5E6',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: new FaceOffScene(
        config,
        players,
        onGameEnd,
        onBackToSetup,
        onExitToPortal,
        handleWinner
      )
    };

    const game = new Phaser.Game(phaserConfig);
    gameRef.current = game;

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

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

  return (
    <>
      <div
        ref={gameContainerRef}
        style={{
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #FFF5E6 0%, #FFB6C1 50%, #E6E6FA 100%)'
        }}
      />

      {/* Winner Modal */}
      {showWinnerModal && winnerData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10003,
            padding: 24,
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              borderRadius: 32,
              padding: 48,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 28,
              boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
              border: '6px solid #fff',
              animation: 'bounceIn 0.5s ease-out',
              overflowY: 'auto'
            }}
          >
            {/* Trophy Icon */}
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                animation: 'pulse 1.5s infinite'
              }}
            >
              <span style={{ fontSize: 60 }}>🏆</span>
            </div>

            {/* Winner Text */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, color: '#1f2937', textShadow: '2px 2px 4px rgba(255,255,255,0.5)', marginBottom: 8 }}>
                🎉 WINNER! 🎉
              </div>
              <div style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: '#1f2937' }}>
                {winnerData.name}
              </div>
              <div style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 600, color: '#374151', marginTop: 8 }}>
                ⭐ {winnerData.score || 0} points ⭐
              </div>
            </div>

            {/* Give Points Section */}
            {selectedClass && onGivePoints && !pointsGiven && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 'clamp(14px, 2vw, 18px)', fontWeight: 600, color: '#374151' }}>
                  Give points to winner:
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[1, 2, 3, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => setPointsToGive(val)}
                      style={{
                        padding: '12px 20px',
                        fontSize: 18,
                        fontWeight: '800',
                        background: pointsToGive === val
                          ? 'linear-gradient(135deg, #10B981, #059669)'
                          : 'linear-gradient(135deg, #E5E7EB, #D1D5DB)',
                        color: pointsToGive === val ? '#fff' : '#374151',
                        border: 'none',
                        borderRadius: 12,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        minWidth: '50px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        if (pointsToGive !== val) {
                          e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        if (pointsToGive !== val) {
                          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        }
                      }}
                    >
                      +{val}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleGivePointsToWinner}
                  style={{
                    padding: '12px 32px',
                    fontSize: 16,
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12,
                    cursor: 'pointer',
                    boxShadow: '0 6px 24px rgba(245,158,11,0.4)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 8px 32px rgba(245,158,11,0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 6px 24px rgba(245,158,11,0.4)';
                  }}
                >
                  🎁 Give {pointsToGive} Point{pointsToGive !== 1 ? 's' : ''} to {winnerData.name}
                </button>
              </div>
            )}

            {pointsGiven && (
              <div style={{
                fontSize: 'clamp(16px, 2vw, 20px)',
                fontWeight: 700,
                color: '#10B981',
                textAlign: 'center',
                padding: '12px 24px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: 12,
                border: '2px solid #10B981'
              }}>
                ✅ {pointsToGive} point{pointsToGive !== 1 ? 's' : ''} given to {winnerData.name}!
              </div>
            )}

            {/* Exit Button */}
            <button
              onClick={handleWinnerModalClose}
              style={{
                padding: '16px 40px',
                fontSize: 20,
                fontWeight: '800',
                background: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
                color: '#fff',
                border: 'none',
                borderRadius: 16,
                cursor: 'pointer',
                boxShadow: '0 6px 24px rgba(78,205,196,0.5)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 8px 32px rgba(78,205,196,0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 6px 24px rgba(78,205,196,0.5)';
              }}
            >
              🎮 Play Again
            </button>
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes bounceIn {
              0% { transform: scale(0.3); opacity: 0; }
              50% { transform: scale(1.05); }
              70% { transform: scale(0.9); }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default FaceOffGame;
