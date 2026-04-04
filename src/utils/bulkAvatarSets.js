import { createAvatar } from '@dicebear/core';
import { adventurer, funEmoji, bottts, lorelei, micah, notionists } from '@dicebear/collection';

// Avatar set definitions with consistent themes
export const AVATAR_SETS = [
  {
    id: 'dicebear-adventurers',
    name: 'Adventurers',
    icon: '🗺️',
    description: 'Fun adventure characters',
    theme: 'adventurer',
    count: 50
  },
  {
    id: 'dicebear-emoji',
    name: 'Fun Emoji',
    icon: '😊',
    description: 'Expressive emoji faces',
    theme: 'funEmoji',
    count: 30
  },
  {
    id: 'dicebear-bots',
    name: 'Cute Bots',
    icon: '🤖',
    description: 'Friendly robot characters',
    theme: 'bottts',
    count: 30
  },
  {
    id: 'dicebear-nature',
    name: 'Nature Lovers',
    icon: '🌿',
    description: 'Nature-inspired avatars',
    theme: 'lorelei',
    count: 30
  },
  {
    id: 'dicebear-artistic',
    name: 'Artistic',
    icon: '🎨',
    description: 'Artistic portrait style',
    theme: 'micah',
    count: 30
  },
  {
    id: 'dicebear-personas',
    name: 'Personas',
    icon: '👤',
    description: 'Modern character portraits',
    theme: 'personas',
    count: 30
  },
  {
    id: 'dicebear-simple',
    name: 'Minimalist',
    icon: '✨',
    description: 'Clean minimal design',
    theme: 'notionists',
    count: 30
  },
  {
    id: 'dicebear-shapes',
    name: 'Geometric',
    icon: '🔷',
    description: 'Fun geometric shapes',
    theme: 'shapes',
    count: 30
  },
  {
    id: 'dicebear-funky',
    name: 'Funky',
    icon: '🎭',
    description: 'Funky abstract avatars',
    theme: 'funky',
    count: 30
  },
  {
    id: 'dicebear-bottts-alt',
    name: 'Robots',
    icon: '🤖',
    description: 'Unique robot characters',
    theme: 'bottts-alt',
    count: 30
  },
  {
    id: 'dicebear-big-ears',
    name: 'Big Ears',
    icon: '🐰',
    description: 'Cute avatars with big ears',
    theme: 'big-ears',
    count: 30
  },
  {
    id: 'dicebear-avataaars',
    name: 'Avataaars',
    icon: '👹',
    description: 'Cartoonish avatars',
    theme: 'avataaars',
    count: 30
  }
];

// Cache for pre-generated avatars
const avatarCache = new Map();

// Get avatar URL for a specific set and index
export function getAvatarFromSet(setId, index, seed = '') {
  const cacheKey = `${setId}-${index}-${seed}`;
  
  if (avatarCache.has(cacheKey)) {
    return avatarCache.get(cacheKey);
  }

  const avatarSet = AVATAR_SETS.find(set => set.id === setId);
  if (!avatarSet) return null;

  let avatarUrl;

  // Generate based on the set type
  switch (avatarSet.theme) {
    case 'adventurer':
      avatarUrl = createAvatar(adventurer, {
        seed: seed || `adv-${index}`,
        backgroundColor: [getBackgroundColor(index)],
        radius: 10
      }).toDataUri();
      break;
    case 'funEmoji':
      avatarUrl = createAvatar(funEmoji, {
        seed: seed || `emoji-${index}`,
        backgroundColor: [getBackgroundColor(index)]
      }).toDataUri();
      break;
    case 'bottts':
      avatarUrl = createAvatar(bottts, {
        seed: seed || `bot-${index}`,
        backgroundColor: [getBackgroundColor(index)],
        scale: 90
      }).toDataUri();
      break;
    case 'bottts-alt':
      // Alternative robot style with different colors
      avatarUrl = createAvatar(bottts, {
        seed: seed || `bottts-alt-${index}`,
        backgroundColor: [getRobotColor(index)],
        scale: 85,
        baseColor: ['#7c3aed', '#0891b2', '#dc2626', '#16a34a', '#eab308'][index % 5]
      }).toDataUri();
      break;
    case 'lorelei':
      avatarUrl = createAvatar(lorelei, {
        seed: seed || `lorelei-${index}`,
        backgroundColor: [getBackgroundColor(index)]
      }).toDataUri();
      break;
    case 'micah':
      avatarUrl = createAvatar(micah, {
        seed: seed || `micah-${index}`,
        backgroundColor: [getBackgroundColor(index)]
      }).toDataUri();
      break;
    case 'personas':
      // Map to notionists to keep a similar modern look without extra heavy sprite packs.
      avatarUrl = createAvatar(notionists, {
        seed: seed || `persona-${index}`,
        backgroundColor: [getBackgroundColor(index)]
      }).toDataUri();
      break;
    case 'notionists':
      avatarUrl = createAvatar(notionists, {
        seed: seed || `notion-${index}`,
        backgroundColor: [getBackgroundColor(index)]
      }).toDataUri();
      break;
    case 'funky':
      // Funky abstract avatars using notionists style
      avatarUrl = createAvatar(notionists, {
        seed: seed || `funky-${index}`,
        backgroundColor: [getFunkyColor(index)],
        mouth: ['a', 'b', 'c', 'd', 'e'][index % 5],
        eyes: ['a', 'b', 'c', 'd'][index % 4]
      }).toDataUri();
      break;
    case 'big-ears':
      // Keep kid-friendly style while avoiding additional heavy collection bundles.
      avatarUrl = createAvatar(notionists, {
        seed: seed || `bigears-${index}`,
        backgroundColor: [getKidsAIColor(index)],
        hair: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05'][index % 5],
        eyes: ['a', 'b', 'c', 'd'][index % 4],
        mouth: ['a', 'b', 'c', 'd'][index % 4]
      }).toDataUri();
      break;
    case 'avataaars':
      // Keep the "cartoon" set id for compatibility, map to existing lightweight style.
      avatarUrl = createAvatar(adventurer, {
        seed: seed || `avataaars-${index}`,
        backgroundColor: [getBackgroundColor(index)],
        radius: 10
      }).toDataUri();
      break;
    case 'shapes':
      // Geometric fallback using notionists to avoid extra package weight.
      avatarUrl = createAvatar(notionists, {
        seed: seed || `shape-${index}`,
        backgroundColor: [getBackgroundColor(index)]
      }).toDataUri();
      break;
    default:
      avatarUrl = createAvatar(adventurer, {
        seed: seed || `default-${index}`,
        backgroundColor: [getBackgroundColor(index)]
      }).toDataUri();
  }

  avatarCache.set(cacheKey, avatarUrl);
  return avatarUrl;
}

// Generate a list of avatars for a set
export function generateAvatarSetList(setId, count = 30) {
  const avatarSet = AVATAR_SETS.find(set => set.id === setId);
  if (!avatarSet) return [];

  const avatars = [];
  const actualCount = count || avatarSet.count;

  for (let i = 0; i < actualCount; i++) {
    avatars.push({
      id: `${setId}-${i}`,
      index: i,
      url: getAvatarFromSet(setId, i),
      setName: avatarSet.name
    });
  }

  return avatars;
}

// Generate avatar based on name and set
export function generateAvatarForName(name, setId, gender = 'boy') {
  const seed = `${name}-${gender}`;
  const index = Math.abs(hashCode(seed)) % 1000;
  return getAvatarFromSet(setId, index, seed);
}

// Helper function to get consistent background colors
function getBackgroundColor(index) {
  const colors = [
    'b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf',
    '92A1C6', 'F5D0B9', 'E0B1CB', 'C7CEEA', 'FFDFC4',
    'D1E4C4', 'F4E1D2', 'E8D4E8', 'CCE4F5', 'FFE4B5'
  ];
  return colors[index % colors.length];
}

// Helper for funky-themed colors
function getFunkyColor(index) {
  const colors = [
    'FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7',
    'DDA0DD', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E9',
    '74b9ff', 'fd79a8', 'fdcb6e', '55efc4', 'a29bfe',
    'e17055', '00b894', 'e84393', '6c5ce7', 'fd79a8',
    'a55eea', '45aaf2', '26de81', 'fed330', 'eb3b5a'
  ];
  return colors[index % colors.length];
}

// Helper for robot-themed colors
function getRobotColor(index) {
  const colors = [
    '6366f1', '8b5cf6', 'ec4899', 'f43f5e', 'f97316',
    'eab308', '84cc16', '22c55e', '14b8a6', '06b6d4',
    '0ea5e9', '3b82f6', '6366f1', '8b5cf6', 'd946ef',
    'f43f5e', 'f97316', 'fbbf24', 'a3e635', '4ade80',
    '2dd4bf', '22d3ee', '38bdf8', '60a5fa', '818cf8'
  ];
  return colors[index % colors.length];
}

// Helper for AI Kids-themed colors (bright, kid-friendly colors)
function getKidsAIColor(index) {
  const colors = [
    'FFB6C1', 'FFC0CB', 'FF69B4', 'FFD700', 'FFA500',
    '87CEEB', '98FB98', 'DDA0DD', 'F0E68C', 'B0E0E6',
    'FFB347', 'FFCC33', '99FF99', '66B2FF', 'FF99CC',
    'B19CD9', '77DD77', 'FFB7B2', 'FFDAC1', 'E2F0CB',
    'B5EAD7', 'C7CEEA', 'F8D7DA', 'FFF3CD', 'D1ECF1'
  ];
  return colors[index % colors.length];
}

// Simple hash function for consistent seeds
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

// Get default avatar set
export function getDefaultAvatarSet() {
  return AVATAR_SETS[0];
}

// Clear cache (useful for testing or reset)
export function clearAvatarCache() {
  avatarCache.clear();
}
