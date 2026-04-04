// Fun, playful avatars for kids' classrooms

const FUN_CLASSROOM_AVATARS = [
  // Space & Adventure Theme
  { name: 'rocket-ship', label: '🚀 Rocket Ship', color: '#FF6B6B', accentColor: '#FFD93D', pattern: 'rocket' },
  { name: 'planet-earth', label: '🌍 Planet Earth', color: '#4ECDC4', accentColor: '#95E1D3', pattern: 'planet' },
  { name: 'flying-saucer', label: '🛸 Flying Saucer', color: '#A8E6CF', accentColor: '#FFD3B6', pattern: 'ufo' },
  { name: 'moon-star', label: '🌙 Moon & Star', color: '#6C5CE7', accentColor: '#FDCB6E', pattern: 'moon' },
  
  // Animals & Nature Theme  
  { name: 'happy-dinosaur', label: '🦕 Happy Dino', color: '#55A3FF', accentColor: '#FF6B9D', pattern: 'dino' },
  { name: 'rainbow-unicorn', label: '🦄 Rainbow Unicorn', color: '#FF6EC7', accentColor: '#FFE66D', pattern: 'unicorn' },
  { name: 'super-bear', label: '🐻 Super Bear', color: '#8B4513', accentColor: '#FFD700', pattern: 'bear' },
  { name: 'magic-dragon', label: '🐉 Magic Dragon', color: '#FF4757', accentColor: '#FFA502', pattern: 'dragon' },
  { name: 'wise-owl', label: '🦉 Wise Owl', color: '#9B59B6', accentColor: '#F39C12', pattern: 'owl' },
  { name: 'jumping-frog', label: '🐸 Jumping Frog', color: '#27AE60', accentColor: '#F1C40F', pattern: 'frog' },
  
  // Magic & Fantasy Theme
  { name: 'magic-wand', label: '✨ Magic Wand', color: '#9B59B6', accentColor: '#F8C471', pattern: 'wand' },
  { name: 'crystal-ball', label: '🔮 Crystal Ball', color: '#5DADE2', accentColor: '#A569BD', pattern: 'crystal' },
  { name: 'wizard-hat', label: '🎩 Wizard Hat', color: '#3498DB', accentColor: '#9B59B6', pattern: 'wizard' },
  { name: 'fairy-wings', label: '🧚 Fairy Wings', color: '#FF69B4', accentColor: '#FFD700', pattern: 'fairy' },
  
  // Sports & Activity Theme
  { name: 'soccer-ball', label: '⚽ Soccer Ball', color: '#2ECC71', accentColor: '#FFFFFF', pattern: 'soccer' },
  { name: 'basketball', label: '🏀 Basketball', color: '#E67E22', accentColor: '#000000', pattern: 'basketball' },
  { name: 'rainbow-pencils', label: '📚 Rainbow Pencils', color: '#E74C3C', accentColor: '#F39C12', pattern: 'pencils' },
  { name: 'music-notes', label: '🎵 Music Notes', color: '#FF69B4', accentColor: '#87CEEB', pattern: 'music' },
  { name: 'paint-palette', label: '🎨 Paint Palette', color: '#FF6347', accentColor: '#4169E1', pattern: 'palette' },
  
  // Food & Treats Theme
  { name: 'ice-cream', label: '🍦 Ice Cream', color: '#FF69B4', accentColor: '#FFE4B5', pattern: 'icecream' },
  { name: 'cupcake', label: '🧁 Cupcake', color: '#FFB6C1', accentColor: '#8B4513', pattern: 'cupcake' },
  { name: 'pizza-slice', label: '🍕 Pizza Slice', color: '#FF6347', accentColor: '#FFD700', pattern: 'pizza' },
  { name: 'rainbow-candy', label: '🍭 Rainbow Candy', color: '#FF69B4', accentColor: '#00CED1', pattern: 'candy' },
  
  // Transportation Theme
  { name: 'choo-choo', label: '🚂 Choo Choo', color: '#FF6B6B', accentColor: '#4ECDC4', pattern: 'train' },
  { name: 'sail-boat', label: '⛵ Sail Boat', color: '#3498DB', accentColor: '#FFFFFF', pattern: 'boat' },
  { name: 'race-car', label: '🏎️ Race Car', color: '#E74C3C', accentColor: '#F39C12', pattern: 'car' },
];

// Export for use in components
export const AVATAR_OPTIONS = FUN_CLASSROOM_AVATARS;

function getCharacterForName(name = 'user') {
  const charCode = (name || '').charCodeAt(0) || 0;
  return FUN_CLASSROOM_AVATARS[charCode % FUN_CLASSROOM_AVATARS.length];
}

export function getCharacterByName(characterName) {
  const found = FUN_CLASSROOM_AVATARS.find(c => c.name === characterName);
  if (!found) {
    console.warn('Character not found:', characterName, 'Available:', FUN_CLASSROOM_AVATARS.map(a => a.name));
  }
  return found || FUN_CLASSROOM_AVATARS[0];
}

// Fun classroom avatar generators
function generateRocketAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Rocket body -->
    <ellipse cx="100" cy="120" rx="25" ry="60" fill="${color}"/>
    <!-- Rocket tip -->
    <polygon points="100,40 85,80 115,80" fill="${accentColor}"/>
    <!-- Rocket fins -->
    <polygon points="75,140 60,160 85,150" fill="${accentColor}"/>
    <polygon points="125,140 140,160 115,150" fill="${accentColor}"/>
    <!-- Window -->
    <circle cx="100" cy="90" r="12" fill="${accentColor}"/>
    <circle cx="100" cy="90" r="8" fill="#87CEEB"/>
    <!-- Flames -->
    <polygon points="85,180 100,190 115,180" fill="#FF6B6B"/>
    <polygon points="90,180 100,185 110,180" fill="#FFD93D"/>
  </svg>`;
}

function generatePlanetAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Planet -->
    <circle cx="100" cy="100" r="60" fill="${color}"/>
    <!-- Continent shapes -->
    <ellipse cx="85" cy="90" rx="20" ry="15" fill="${accentColor}" opacity="0.8"/>
    <ellipse cx="115" cy="110" rx="25" ry="18" fill="${accentColor}" opacity="0.8"/>
    <ellipse cx="100" cy="130" rx="18" ry="12" fill="${accentColor}" opacity="0.8"/>
    <!-- Ring around planet -->
    <ellipse cx="100" cy="100" rx="80" ry="20" fill="none" stroke="${accentColor}" stroke-width="3" opacity="0.6"/>
    <!-- Stars -->
    <circle cx="40" cy="40" r="2" fill="#FFD700"/>
    <circle cx="160" cy="50" r="2" fill="#FFD700"/>
    <circle cx="50" cy="160" r="2" fill="#FFD700"/>
    <circle cx="150" cy="150" r="2" fill="#FFD700"/>
  </svg>`;
}

function generateDinosaurAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Dino body -->
    <ellipse cx="100" cy="120" rx="40" ry="30" fill="${color}"/>
    <!-- Dino head -->
    <circle cx="60" cy="100" r="25" fill="${color}"/>
    <!-- Spikes -->
    <polygon points="80,90 75,75 85,85" fill="${accentColor}"/>
    <polygon points="95,85 90,70 100,80" fill="${accentColor}"/>
    <polygon points="110,90 105,75 115,85" fill="${accentColor}"/>
    <!-- Legs -->
    <rect x="75" y="140" width="12" height="25" fill="${color}" rx="6"/>
    <rect x="113" y="140" width="12" height="25" fill="${color}" rx="6"/>
    <!-- Eye -->
    <circle cx="50" cy="95" r="5" fill="#000"/>
    <circle cx="52" cy="93" r="2" fill="#FFF"/>
    <!-- Smile -->
    <path d="M 45 105 Q 55 115 65 110" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/>
  </svg>`;
}

function generateUnicornAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Unicorn body -->
    <ellipse cx="100" cy="130" rx="35" ry="40" fill="${color}"/>
    <!-- Unicorn head -->
    <circle cx="100" cy="80" r="30" fill="${color}"/>
    <!-- Rainbow mane -->
    <rect x="125" y="60" width="8" height="40" fill="#FF6B6B" rx="4"/>
    <rect x="133" y="60" width="8" height="40" fill="#FFD93D" rx="4"/>
    <rect x="141" y="60" width="8" height="40" fill="#6BCF7F" rx="4"/>
    <rect x="149" y="60" width="8" height="40" fill="#4ECDC4" rx="4"/>
    <!-- Horn -->
    <polygon points="100,40 95,60 105,60" fill="${accentColor}"/>
    <polygon points="100,40 98,70 102,70" fill="#FFD700"/>
    <!-- Legs -->
    <rect x="80" y="150" width="10" height="30" fill="${color}" rx="5"/>
    <rect x="110" y="150" width="10" height="30" fill="${color}" rx="5"/>
    <!-- Eye -->
    <circle cx="85" cy="75" r="5" fill="#000"/>
    <circle cx="87" cy="73" r="2" fill="#FFF"/>
    <!-- Rainbow tail -->
    <rect x="60" y="120" width="30" height="6" fill="#FF6B6B" rx="3"/>
    <rect x="60" y="126" width="30" height="6" fill="#FFD93D" rx="3"/>
    <rect x="60" y="132" width="30" height="6" fill="#6BCF7F" rx="3"/>
  </svg>`;
}

function generateOwlAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Owl body -->
    <ellipse cx="100" cy="130" rx="35" ry="45" fill="${color}"/>
    <!-- Owl head -->
    <circle cx="100" cy="70" r="40" fill="${color}"/>
    <!-- Ear tufts -->
    <polygon points="70,40 60,20 75,45" fill="${color}"/>
    <polygon points="130,40 140,20 125,45" fill="${color}"/>
    <!-- Face -->
    <circle cx="100" cy="75" r="30" fill="${accentColor}"/>
    <!-- Big eyes -->
    <circle cx="80" cy="70" r="15" fill="#FFF"/>
    <circle cx="120" cy="70" r="15" fill="#FFF"/>
    <circle cx="80" cy="70" r="10" fill="#8B4513"/>
    <circle cx="120" cy="70" r="10" fill="#8B4513"/>
    <circle cx="82" cy="68" r="3" fill="#000"/>
    <circle cx="122" cy="68" r="3" fill="#000"/>
    <!-- Beak -->
    <polygon points="100,85 90,95 110,95" fill="${accentColor}"/>
    <!-- Wings -->
    <ellipse cx="60" cy="130" rx="15" ry="30" fill="${color}" opacity="0.8"/>
    <ellipse cx="140" cy="130" rx="15" ry="30" fill="${color}" opacity="0.8"/>
    <!-- Belly pattern -->
    <ellipse cx="100" cy="140" rx="20" ry="25" fill="${accentColor}" opacity="0.5"/>
  </svg>`;
}

function generateDragonAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Dragon body -->
    <ellipse cx="100" cy="120" rx="45" ry="35" fill="${color}"/>
    <!-- Dragon head -->
    <circle cx="60" cy="80" r="30" fill="${color}"/>
    <!-- Wings -->
    <ellipse cx="80" cy="90" rx="25" ry="40" fill="${accentColor}" opacity="0.7" transform="rotate(-30 80 90)"/>
    <ellipse cx="120" cy="90" rx="25" ry="40" fill="${accentColor}" opacity="0.7" transform="rotate(30 120 90)"/>
    <!-- Spikes -->
    <polygon points="90,85 85,65 95,80" fill="${accentColor}"/>
    <polygon points="110,85 105,65 115,80" fill="${accentColor}"/>
    <!-- Fire breath -->
    <path d="M 30 75 Q 20 80 25 85 Q 15 90 20 95" fill="#FF6B6B" opacity="0.8"/>
    <path d="M 25 80 Q 15 85 20 90" fill="#FFD93D" opacity="0.8"/>
    <!-- Eye -->
    <circle cx="50" cy="75" r="6" fill="#FF0000"/>
    <circle cx="52" cy="73" r="2" fill="#FFF"/>
    <!-- Legs -->
    <rect x="70" y="145" width="12" height="20" fill="${color}" rx="6"/>
    <rect x="118" y="145" width="12" height="20" fill="${color}" rx="6"/>
  </svg>`;
}

// Additional fun avatar generators
function generateUFOAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- UFO dome -->
    <ellipse cx="100" cy="90" rx="50" ry="30" fill="${accentColor}" opacity="0.8"/>
    <ellipse cx="100" cy="85" rx="40" ry="25" fill="${accentColor}"/>
    <!-- UFO body -->
    <ellipse cx="100" cy="120" rx="60" ry="20" fill="${color}"/>
    <!-- Lights -->
    <circle cx="70" cy="120" r="5" fill="#FFD700"/>
    <circle cx="85" cy="120" r="5" fill="#FF6B6B"/>
    <circle cx="100" cy="120" r="5" fill="#6BCF7F"/>
    <circle cx="115" cy="120" r="5" fill="#4ECDC4"/>
    <circle cx="130" cy="120" r="5" fill="#FF69B4"/>
    <!-- Alien window -->
    <ellipse cx="100" cy="85" rx="15" ry="10" fill="#87CEEB"/>
    <!-- Stars -->
    <circle cx="30" cy="30" r="2" fill="#FFD700"/>
    <circle cx="170" cy="40" r="2" fill="#FFD700"/>
    <circle cx="40" cy="170" r="2" fill="#FFD700"/>
  </svg>`;
}

function generateMoonAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Moon -->
    <circle cx="100" cy="100" r="50" fill="${color}"/>
    <!-- Moon craters -->
    <circle cx="85" cy="90" r="8" fill="${accentColor}" opacity="0.5"/>
    <circle cx="115" cy="110" r="6" fill="${accentColor}" opacity="0.5"/>
    <circle cx="100" cy="130" r="4" fill="${accentColor}" opacity="0.5"/>
    <!-- Star -->
    <polygon points="150,50 155,60 165,60 157,67 160,77 150,70 140,77 143,67 153,60 145,60" fill="#FFD700"/>
    <!-- Small stars -->
    <circle cx="40" cy="40" r="2" fill="#FFD700"/>
    <circle cx="160" cy="150" r="2" fill="#FFD700"/>
    <circle cx="50" cy="160" r="1.5" fill="#FFD700"/>
  </svg>`;
}

function generateBearAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Bear body -->
    <ellipse cx="100" cy="130" rx="40" ry="45" fill="${color}"/>
    <!-- Bear head -->
    <circle cx="100" cy="70" r="35" fill="${color}"/>
    <!-- Ears -->
    <circle cx="70" cy="40" r="15" fill="${color}"/>
    <circle cx="130" cy="40" r="15" fill="${color}"/>
    <!-- Eyes -->
    <circle cx="85" cy="65" r="5" fill="#000"/>
    <circle cx="115" cy="65" r="5" fill="#000"/>
    <circle cx="87" cy="63" r="2" fill="#FFF"/>
    <circle cx="117" cy="63" r="2" fill="#FFF"/>
    <!-- Nose -->
    <circle cx="100" cy="85" r="4" fill="#000"/>
    <!-- Mouth -->
    <path d="M 100 90 Q 90 100 80 98" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M 100 90 Q 110 100 120 98" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Belly -->
    <ellipse cx="100" cy="140" rx="25" ry="30" fill="${accentColor}" opacity="0.3"/>
  </svg>`;
}

function generateFrogAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Frog body -->
    <ellipse cx="100" cy="120" rx="45" ry="35" fill="${color}"/>
    <!-- Frog head -->
    <ellipse cx="100" cy="80" rx="50" ry="30" fill="${color}"/>
    <!-- Big eyes -->
    <circle cx="70" cy="70" r="15" fill="#FFF"/>
    <circle cx="130" cy="70" r="15" fill="#FFF"/>
    <circle cx="70" cy="70" r="10" fill="#4CAF50"/>
    <circle cx="130" cy="70" r="10" fill="#4CAF50"/>
    <circle cx="72" cy="68" r="3" fill="#000"/>
    <circle cx="132" cy="68" r="3" fill="#000"/>
    <!-- Legs -->
    <ellipse cx="70" cy="140" rx="15" ry="25" fill="${color}"/>
    <ellipse cx="130" cy="140" rx="15" ry="25" fill="${color}"/>
    <!-- Mouth -->
    <path d="M 70 90 Q 100 110 130 90" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Belly spots -->
    <circle cx="90" cy="125" r="4" fill="${accentColor}" opacity="0.5"/>
    <circle cx="110" cy="130" r="4" fill="${accentColor}" opacity="0.5"/>
  </svg>`;
}

function generateMagicWandAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Wand -->
    <rect x="90" y="80" width="8" height="80" fill="${color}" rx="4"/>
    <!-- Star tip -->
    <polygon points="94,60 90,80 98,80" fill="${accentColor}"/>
    <!-- Sparkles -->
    <polygon points="94,50 92,55 96,55" fill="#FFD700"/>
    <polygon points="80,70 78,75 82,75" fill="#FF69B4"/>
    <polygon points="108,70 106,75 110,75" fill="#6BCF7F"/>
    <polygon points="85,85 83,90 87,90" fill="#4ECDC4"/>
    <polygon points="103,85 101,90 105,90" fill="#FF6B6B"/>
    <!-- Magic trail -->
    <circle cx="94" cy="40" r="2" fill="#FFD700" opacity="0.8"/>
    <circle cx="94" cy="30" r="1.5" fill="#FF69B4" opacity="0.6"/>
    <circle cx="94" cy="20" r="1" fill="#6BCF7F" opacity="0.4"/>
  </svg>`;
}

function generateCrystalBallAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Crystal ball -->
    <circle cx="100" cy="100" r="50" fill="${color}" opacity="0.8"/>
    <circle cx="100" cy="100" r="45" fill="${accentColor}" opacity="0.3"/>
    <!-- Crystal stand -->
    <rect x="85" y="145" width="30" height="15" fill="${color}" rx="5"/>
    <rect x="80" y="155" width="40" height="8" fill="${color}" rx="4"/>
    <!-- Magic symbols inside -->
    <polygon points="100,80 95,90 105,90" fill="${accentColor}" opacity="0.8"/>
    <circle cx="85" cy="100" r="3" fill="${accentColor}" opacity="0.6"/>
    <circle cx="115" cy="100" r="3" fill="${accentColor}" opacity="0.6"/>
    <circle cx="100" cy="115" r="3" fill="${accentColor}" opacity="0.6"/>
    <!-- Sparkles around -->
    <circle cx="60" cy="60" r="2" fill="#FFD700"/>
    <circle cx="140" cy="60" r="2" fill="#FFD700"/>
    <circle cx="60" cy="140" r="2" fill="#FFD700"/>
    <circle cx="140" cy="140" r="2" fill="#FFD700"/>
  </svg>`;
}

function generateWizardHatAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Hat cone -->
    <polygon points="100,40 70,120 130,120" fill="${color}"/>
    <!-- Hat brim -->
    <ellipse cx="100" cy="120" rx="60" ry="15" fill="${color}"/>
    <!-- Stars and moons on hat -->
    <polygon points="100,60 98,65 102,65" fill="${accentColor}"/>
    <circle cx="85" cy="80" r="3" fill="${accentColor}"/>
    <circle cx="115" cy="90" r="3" fill="${accentColor}"/>
    <polygon points="90,100 88,103 92,103" fill="${accentColor}"/>
    <!-- Band around hat -->
    <rect x="70" y="105" width="60" height="8" fill="${accentColor}" opacity="0.7"/>
  </svg>`;
}

function generateFairyWingsAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Fairy body -->
    <ellipse cx="100" cy="120" rx="20" ry="30" fill="${color}"/>
    <!-- Left wing -->
    <ellipse cx="60" cy="100" rx="30" ry="45" fill="${accentColor}" opacity="0.7" transform="rotate(-20 60 100)"/>
    <!-- Right wing -->
    <ellipse cx="140" cy="100" rx="30" ry="45" fill="${accentColor}" opacity="0.7" transform="rotate(20 140 100)"/>
    <!-- Wing patterns -->
    <circle cx="55" cy="90" r="5" fill="${color}" opacity="0.5"/>
    <circle cx="145" cy="90" r="5" fill="${color}" opacity="0.5"/>
    <circle cx="60" cy="110" r="4" fill="${color}" opacity="0.5"/>
    <circle cx="140" cy="110" r="4" fill="${color}" opacity="0.5"/>
    <!-- Fairy head -->
    <circle cx="100" cy="80" r="15" fill="${color}"/>
    <!-- Sparkles -->
    <circle cx="40" cy="60" r="2" fill="#FFD700"/>
    <circle cx="160" cy="60" r="2" fill="#FFD700"/>
    <circle cx="100" cy="50" r="2" fill="#FF69B4"/>
  </svg>`;
}

function generateSoccerBallAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Soccer ball -->
    <circle cx="100" cy="100" r="50" fill="${color}"/>
    <!-- Pentagon pattern -->
    <polygon points="100,60 80,75 80,95 100,110 120,95 120,75" fill="${accentColor}"/>
    <polygon points="70,80 55,90 55,110 70,120 85,110 85,90" fill="${accentColor}"/>
    <polygon points="130,80 115,90 115,110 130,120 145,110 145,90" fill="${accentColor}"/>
    <polygon points="85,125 70,135 70,145 85,155 100,145 100,135" fill="${accentColor}"/>
    <polygon points="115,125 100,135 100,145 115,155 130,145 130,135" fill="${accentColor}"/>
  </svg>`;
}

function generateBasketballAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Basketball -->
    <circle cx="100" cy="100" r="50" fill="${color}"/>
    <!-- Basketball lines -->
    <path d="M 100 50 Q 100 100 100 150" stroke="${accentColor}" stroke-width="3" fill="none"/>
    <path d="M 50 100 Q 100 100 150 100" stroke="${accentColor}" stroke-width="3" fill="none"/>
    <path d="M 65 65 Q 100 100 135 135" stroke="${accentColor}" stroke-width="2" fill="none"/>
    <path d="M 135 65 Q 100 100 65 135" stroke="${accentColor}" stroke-width="2" fill="none"/>
  </svg>`;
}

function generatePencilsAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Pencil 1 -->
    <rect x="40" y="60" width="12" height="80" fill="#FF6B6B" rx="2"/>
    <polygon points="40,140 46,155 52,140" fill="#8B4513"/>
    <!-- Pencil 2 -->
    <rect x="70" y="50" width="12" height="80" fill="#FFD93D" rx="2"/>
    <polygon points="70,130 76,145 82,130" fill="#8B4513"/>
    <!-- Pencil 3 -->
    <rect x="100" y="55" width="12" height="80" fill="#6BCF7F" rx="2"/>
    <polygon points="100,135 106,150 112,135" fill="#8B4513"/>
    <!-- Pencil 4 -->
    <rect x="130" y="65" width="12" height="80" fill="#4ECDC4" rx="2"/>
    <polygon points="130,145 136,160 142,145" fill="#8B4513"/>
    <!-- Erasers -->
    <rect x="40" y="55" width="12" height="8" fill="#FFB6C1" rx="2"/>
    <rect x="70" y="45" width="12" height="8" fill="#FFB6C1" rx="2"/>
    <rect x="100" y="50" width="12" height="8" fill="#FFB6C1" rx="2"/>
    <rect x="130" y="60" width="12" height="8" fill="#FFB6C1" rx="2"/>
  </svg>`;
}

function generateMusicNotesAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Music note 1 -->
    <ellipse cx="60" cy="130" rx="8" ry="6" fill="${color}"/>
    <rect x="67" y="80" width="3" height="50" fill="${color}"/>
    <rect x="67" y="80" width="20" height="4" fill="${color}"/>
    <!-- Music note 2 -->
    <ellipse cx="100" cy="120" rx="8" ry="6" fill="${accentColor}"/>
    <rect x="107" y="70" width="3" height="50" fill="${accentColor}"/>
    <rect x="107" y="70" width="20" height="4" fill="${accentColor}"/>
    <!-- Music note 3 -->
    <ellipse cx="140" cy="125" rx="8" ry="6" fill="${color}"/>
    <rect x="147" y="75" width="3" height="50" fill="${color}"/>
    <rect x="147" y="75" width="20" height="4" fill="${color}"/>
    <!-- Eighth note flag -->
    <path d="M 127 70 Q 135 75 130 85" fill="${accentColor}"/>
    <!-- Sparkles -->
    <circle cx="50" cy="50" r="2" fill="#FFD700"/>
    <circle cx="150" cy="60" r="2" fill="#FFD700"/>
    <circle cx="100" cy="40" r="2" fill="#FF69B4"/>
  </svg>`;
}

function generatePaintPaletteAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Palette -->
    <ellipse cx="100" cy="100" rx="60" ry="50" fill="${color}"/>
    <ellipse cx="100" cy="100" rx="50" ry="40" fill="${accentColor}" opacity="0.3"/>
    <!-- Paint circles -->
    <circle cx="85" cy="85" r="8" fill="#FF6B6B"/>
    <circle cx="115" cy="85" r="8" fill="#FFD93D"/>
    <circle cx="85" cy="115" r="8" fill="#6BCF7F"/>
    <circle cx="115" cy="115" r="8" fill="#4ECDC4"/>
    <circle cx="100" cy="100" r="8" fill="#FF69B4"/>
    <!-- Brush -->
    <rect x="140" y="80" width="6" height="40" fill="#8B4513" rx="3"/>
    <polygon points="140,120 143,130 146,120" fill="#8B4513"/>
    <!-- Paint on brush -->
    <circle cx="143" cy="75" r="4" fill="#FF6B6B"/>
  </svg>`;
}

function generateIceCreamAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Ice cream cone -->
    <polygon points="100,120 80,160 120,160" fill="${accentColor}"/>
    <!-- Ice cream scoops -->
    <circle cx="100" cy="90" r="25" fill="#FFB6C1"/>
    <circle cx="100" cy="65" r="22" fill="#FFD700"/>
    <circle cx="100" cy="42" r="20" fill="#6BCF7F"/>
    <!-- Sprinkles -->
    <rect x="90" y="85" width="2" height="8" fill="#FF6B6B" rx="1"/>
    <rect x="108" y="85" width="2" height="8" fill="#4ECDC4" rx="1"/>
    <rect x="95" y="60" width="2" height="8" fill="#FF69B4" rx="1"/>
    <rect x="103" y="60" width="2" height="8" fill="#FFD93D" rx="1"/>
    <!-- Cherry on top -->
    <circle cx="100" cy="25" r="4" fill="#FF0000"/>
    <rect x="99" y="20" width="2" height="8" fill="#8B4513"/>
  </svg>`;
}

function generateCupcakeAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Cupcake liner -->
    <polygon points="70,120 80,150 120,150 130,120" fill="${accentColor}"/>
    <!-- Frosting -->
    <ellipse cx="100" cy="100" rx="35" ry="25" fill="#FFB6C1"/>
    <ellipse cx="100" cy="95" rx="30" ry="20" fill="#FFD700"/>
    <!-- Sprinkles -->
    <rect x="85" y="95" width="3" height="10" fill="#FF6B6B" rx="1" transform="rotate(15 85 95)"/>
    <rect x="110" y="95" width="3" height="10" fill="#4ECDC4" rx="1" transform="rotate(-15 110 95)"/>
    <rect x="95" y="85" width="3" height="10" fill="#FF69B4" rx="1" transform="rotate(45 95 85)"/>
    <rect x="102" y="85" width="3" height="10" fill="#6BCF7F" rx="1" transform="rotate(-45 102 85)"/>
    <!-- Cherry -->
    <circle cx="100" cy="75" r="4" fill="#FF0000"/>
    <rect x="99" y="70" width="2" height="8" fill="#8B4513"/>
  </svg>`;
}

function generatePizzaAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Pizza slice -->
    <polygon points="100,50 150,150 50,150" fill="${color}"/>
    <!-- Crust -->
    <polygon points="100,50 150,150 145,155 55,155 50,150" fill="${accentColor}"/>
    <!-- Pepperoni -->
    <circle cx="90" cy="100" r="8" fill="#FF6B6B"/>
    <circle cx="110" cy="120" r="8" fill="#FF6B6B"/>
    <circle cx="85" cy="130" r="6" fill="#FF6B6B"/>
    <!-- Cheese -->
    <ellipse cx="100" cy="110" rx="15" ry="10" fill="#FFD700" opacity="0.8"/>
    <!-- Basil leaves -->
    <ellipse cx="105" cy="85" rx="4" ry="8" fill="#6BCF7F" transform="rotate(30 105 85)"/>
  </svg>`;
}

function generateCandyAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Candy swirl -->
    <circle cx="100" cy="100" r="40" fill="${color}"/>
    <path d="M 100 60 Q 140 100 100 140 Q 60 100 100 60" fill="${accentColor}" opacity="0.7"/>
    <path d="M 100 70 Q 130 100 100 130 Q 70 100 100 70" fill="${color}" opacity="0.8"/>
    <!-- Wrapper ends -->
    <rect x="95" y="55" width="10" height="15" fill="#FFB6C1" rx="2"/>
    <rect x="95" y="130" width="10" height="15" fill="#6BCF7F" rx="2"/>
    <!-- Sparkles -->
    <circle cx="60" cy="60" r="2" fill="#FFD700"/>
    <circle cx="140" cy="60" r="2" fill="#FFD700"/>
    <circle cx="60" cy="140" r="2" fill="#FFD700"/>
    <circle cx="140" cy="140" r="2" fill="#FFD700"/>
  </svg>`;
}

function generateTrainAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Train engine -->
    <rect x="40" y="100" width="60" height="40" fill="${color}" rx="8"/>
    <!-- Train cabin -->
    <rect x="100" y="105" width="50" height="35" fill="${accentColor}" rx="6"/>
    <!-- Wheels -->
    <circle cx="55" cy="145" r="8" fill="#333"/>
    <circle cx="85" cy="145" r="8" fill="#333"/>
    <circle cx="115" cy="145" r="8" fill="#333"/>
    <circle cx="135" cy="145" r="8" fill="#333"/>
    <!-- Chimney -->
    <rect x="70" y="85" width="12" height="20" fill="${accentColor}" rx="2"/>
    <!-- Smoke -->
    <circle cx="76" cy="80" r="4" fill="#999" opacity="0.6"/>
    <circle cx="76" cy="70" r="3" fill="#999" opacity="0.4"/>
    <circle cx="76" cy="60" r="2" fill="#999" opacity="0.3"/>
    <!-- Windows -->
    <rect x="50" y="110" width="12" height="12" fill="#87CEEB" rx="2"/>
    <rect x="70" y="110" width="12" height="12" fill="#87CEEB" rx="2"/>
    <rect x="110" y="115" width="10" height="10" fill="#87CEEB" rx="2"/>
  </svg>`;
}

function generateBoatAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Boat hull -->
    <polygon points="50,120 150,120 140,150 60,150" fill="${color}"/>
    <!-- Sail -->
    <polygon points="100,50 100,110 60,110" fill="${accentColor}"/>
    <!-- Mast -->
    <rect x="98" y="40" width="4" height="80" fill="#8B4513"/>
    <!-- Flag -->
    <polygon points="102,40 120,45 102,50" fill="#FF6B6B"/>
    <!-- Waves -->
    <path d="M 40 155 Q 60 160 80 155" stroke="#4ECDC4" stroke-width="2" fill="none"/>
    <path d="M 120 155 Q 140 160 160 155" stroke="#4ECDC4" stroke-width="2" fill="none"/>
    <!-- Windows -->
    <rect x="70" y="125" width="8" height="8" fill="#87CEEB" rx="1"/>
    <rect x="85" y="125" width="8" height="8" fill="#87CEEB" rx="1"/>
    <rect x="100" y="125" width="8" height="8" fill="#87CEEB" rx="1"/>
    <rect x="115" y="125" width="8" height="8" fill="#87CEEB" rx="1"/>
  </svg>`;
}

function generateCarAvatar(color, accentColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Car body -->
    <rect x="40" y="110" width="120" height="30" fill="${color}" rx="15"/>
    <!-- Car roof -->
    <rect x="60" y="85" width="80" height="30" fill="${color}" rx="10"/>
    <!-- Wheels -->
    <circle cx="70" cy="145" r="12" fill="#333"/>
    <circle cx="130" cy="145" r="12" fill="#333"/>
    <circle cx="70" cy="145" r="6" fill="#999"/>
    <circle cx="130" cy="145" r="6" fill="#999"/>
    <!-- Racing stripe -->
    <rect x="95" y="85" width="10" height="55" fill="${accentColor}" opacity="0.8"/>
    <!-- Windows -->
    <rect x="65" y="90" width="25" height="15" fill="#87CEEB" rx="3" opacity="0.7"/>
    <rect x="110" y="90" width="25" height="15" fill="#87CEEB" rx="3" opacity="0.7"/>
    <!-- Headlights -->
    <circle cx="35" cy="120" r="5" fill="#FFD700"/>
    <circle cx="165" cy="120" r="5" fill="#FF6B6B"/>
    <!-- Speed lines -->
    <path d="M 20 100 L 10 100" stroke="#FFD700" stroke-width="2"/>
    <path d="M 20 110 L 5 110" stroke="#FFD700" stroke-width="2"/>
    <path d="M 20 120 L 10 120" stroke="#FFD700" stroke-width="2"/>
  </svg>`;
}

export function boringAvatar(name = 'user', gender = 'boy', backgroundColor = null) {
  try {
    const character = getCharacterForName(name);
    const svg = generateCharacter(
      character.name,
      // Allow callers (e.g., class background picker) to override the avatar background color
      backgroundColor || character.color,
      character.accentColor
    );
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  } catch (e) {
    console.warn('Avatar generation failed:', e);
    return fallbackInitialsDataUrl(name);
  }
}

export function avatarByCharacter(characterName = 'rocket-ship') {
  try {
    const character = getCharacterByName(characterName);
    const svg = generateCharacter(character.pattern, character.color, character.accentColor);
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  } catch (e) {
    console.warn('Avatar generation failed for', characterName, ':', e);
    const fallback = FUN_CLASSROOM_AVATARS[0];
    const svg = generateCharacter(fallback.pattern, fallback.color, fallback.accentColor);
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }
}

function generateCharacter(charType, color, accentColor) {
  // Extract pattern from character type (e.g., "rocket-ship" -> "rocket")
  const pattern = charType.split('-')[0] || 'rocket';
  
  switch (pattern) {
    case 'rocket':
      return generateRocketAvatar(color, accentColor);
    case 'planet':
      return generatePlanetAvatar(color, accentColor);
    case 'ufo':
      return generateUFOAvatar(color, accentColor);
    case 'moon':
      return generateMoonAvatar(color, accentColor);
    case 'dino':
      return generateDinosaurAvatar(color, accentColor);
    case 'unicorn':
      return generateUnicornAvatar(color, accentColor);
    case 'bear':
      return generateBearAvatar(color, accentColor);
    case 'dragon':
      return generateDragonAvatar(color, accentColor);
    case 'owl':
      return generateOwlAvatar(color, accentColor);
    case 'frog':
      return generateFrogAvatar(color, accentColor);
    case 'wand':
      return generateMagicWandAvatar(color, accentColor);
    case 'crystal':
      return generateCrystalBallAvatar(color, accentColor);
    case 'wizard':
      return generateWizardHatAvatar(color, accentColor);
    case 'fairy':
      return generateFairyWingsAvatar(color, accentColor);
    case 'soccer':
      return generateSoccerBallAvatar(color, accentColor);
    case 'basketball':
      return generateBasketballAvatar(color, accentColor);
    case 'pencils':
      return generatePencilsAvatar(color, accentColor);
    case 'music':
      return generateMusicNotesAvatar(color, accentColor);
    case 'palette':
      return generatePaintPaletteAvatar(color, accentColor);
    case 'icecream':
      return generateIceCreamAvatar(color, accentColor);
    case 'cupcake':
      return generateCupcakeAvatar(color, accentColor);
    case 'pizza':
      return generatePizzaAvatar(color, accentColor);
    case 'candy':
      return generateCandyAvatar(color, accentColor);
    case 'train':
      return generateTrainAvatar(color, accentColor);
    case 'boat':
      return generateBoatAvatar(color, accentColor);
    case 'car':
      return generateCarAvatar(color, accentColor);
    default:
      return generateRocketAvatar(color, accentColor);
  }
}

export function fallbackInitialsDataUrl(name = '') {
  const initials = (name || '').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || '??';
  const character = getCharacterForName(name);

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='100%' height='100%' fill='${character.color}' rx='12'/><text x='50%' y='50%' dy='0.35em' text-anchor='middle' font-family='system-ui, -apple-system, Roboto, "Helvetica Neue", Arial' font-size='72' fill='white' font-weight='700'>${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Solid-color initials avatars for class icons (no cartoon animals). */
export function professionalInitialsAvatarDataUrl(displayName = 'Class', backgroundColor = '#334155', textColor = '#ffffff') {
  const initials = (displayName || '')
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'CL';
  const bg = backgroundColor || '#334155';
  const fg = textColor || '#ffffff';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="${bg}" rx="36"/><text x="100" y="100" dy="0.35em" text-anchor="middle" font-family="system-ui,-apple-system,Segoe UI,Roboto,Helvetica Neue,Arial" font-size="72" fill="${fg}" font-weight="700">${initials.replace(/</g, '')}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Modern preset palettes for class picker (professional, geometric patterns). */
export const PROFESSIONAL_CLASS_AVATAR_PRESETS = [
  { id: 'ocean', label: 'Ocean', backgroundColor: '#3B82F6', textColor: '#ffffff' },
  { id: 'forest', label: 'Forest', backgroundColor: '#10B981', textColor: '#ffffff' },
  { id: 'royal', label: 'Royal', backgroundColor: '#8B5CF6', textColor: '#ffffff' },
  { id: 'sunset', label: 'Sunset', backgroundColor: '#F97316', textColor: '#ffffff' },
  { id: 'coral', label: 'Coral', backgroundColor: '#EC4899', textColor: '#ffffff' },
  { id: 'teal', label: 'Teal', backgroundColor: '#14B8A6', textColor: '#ffffff' },
  { id: 'navy', label: 'Navy', backgroundColor: '#1E3A8A', textColor: '#ffffff' },
  { id: 'emerald', label: 'Emerald', backgroundColor: '#059669', textColor: '#ffffff' },
  { id: 'indigo', label: 'Indigo', backgroundColor: '#4F46E5', textColor: '#ffffff' },
  { id: 'rose', label: 'Rose', backgroundColor: '#BE123C', textColor: '#ffffff' },
  { id: 'amber', label: 'Amber', backgroundColor: '#B45309', textColor: '#ffffff' },
  { id: 'slate', label: 'Slate', backgroundColor: '#475569', textColor: '#ffffff' },
  { id: 'violet', label: 'Violet', backgroundColor: '#6D28D9', textColor: '#ffffff' },
  { id: 'cyan', label: 'Cyan', backgroundColor: '#0891B2', textColor: '#ffffff' },
  { id: 'ruby', label: 'Ruby', backgroundColor: '#DC2626', textColor: '#ffffff' },
  { id: 'mint', label: 'Mint', backgroundColor: '#047857', textColor: '#ffffff' },
  { id: 'gold', label: 'Gold', backgroundColor: '#CA8A04', textColor: '#ffffff' },
  { id: 'sky', label: 'Sky', backgroundColor: '#0284C7', textColor: '#ffffff' }
];

// Generate a random seed string
export function generateRandomSeed() {
  const adjectives = ['Happy', 'Lucky', 'Brave', 'Swift', 'Clever', 'Bright', 'Sunny', 'Bouncy', 'Jolly', 'Cheerful', 'Sparky', 'Zippy', 'Merry', 'Peachy', 'Silly', 'Wacky', 'Fuzzy', 'Cosmic', 'Snazzy', 'Groovy'];
  const nouns = ['Bunny', 'Puppy', 'Kitty', 'Bear', 'Fox', 'Owl', 'Duck', 'Tiger', 'Lion', 'Panda', 'Koala', 'Whale', 'Dolphin', 'Penguin', 'Parrot', 'Dragon', 'Unicorn', 'Fairy', 'Star', 'Moon'];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective}${randomNoun}`;
}

// Generate a modern background color (light, UI-friendly)
export function generateRandomBackgroundColor() {
  const colors = [
    // Emerald / Teal
    '#DCFCE7', '#CCFBF1', '#A7F3D0',
    // Sky / Blue
    '#DBEAFE', '#BFDBFE', '#BAE6FD',
    // Violet / Purple
    '#E9D5FF', '#DDD6FE', '#F5D0FE',
    // Rose / Pink
    '#FFE4E6', '#FECDD3', '#FCE7F3',
    // Amber / Orange
    '#FEF3C7', '#FFE4D6', '#FFEDD5',
    // Modern accents
    '#ECFDF5', '#F0FDFA', '#EEF2FF', '#E0F2FE'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Generate class avatar from seed and background color
export function generateClassAvatar(seed = null, backgroundColor = null) {
  const finalSeed = seed || generateRandomSeed();
  return boringAvatar(finalSeed, 'boy', backgroundColor);
}
