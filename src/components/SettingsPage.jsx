import React, { useMemo, useState } from 'react';
import { Edit2, Plus, X, RefreshCw, Trash2, Save, Minus, Volume2, VolumeX, Music, Smile, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import { StickerPicker, StickerDisplay } from './StickerPicker';
import { useToast } from './Toast';

// ─── Audio Clips for Behavior Cards ─────────────────────────────────────────────
// Safe, school-appropriate audio clips under 3 seconds
// Files should be placed in /public/audio/ directory
const AUDIO_CLIPS = [
  // No Sound option
  { id: 'none', name: 'No Sound', category: 'none', file: 'none', emoji: '🔇' },
  // Positive / Reward Sounds
  { id: 'amazing', name: 'Amazing!', category: 'positive', file: 'amazing.mp3', emoji: '🌟' },
  { id: 'awesome', name: 'Awesome!', category: 'positive', file: 'awesome.mp3', emoji: '⚡' },
  { id: 'rockstar', name: 'Rockstar!', category: 'positive', file: 'rockstar.mp3', emoji: '🎸' },
  { id: 'superstar', name: 'Superstar!', category: 'positive', file: 'superstar.mp3', emoji: '👑' },
  { id: 'excellent', name: 'Excellent!', category: 'positive', file: 'excellent.mp3', emoji: '✨' },
  { id: 'bravo', name: 'Bravo!', category: 'positive', file: 'bravo.mp3', emoji: '👏' },
  { id: 'fantastic', name: 'Fantastic!', category: 'positive', file: 'fantastic.mp3', emoji: '🎉' },
  { id: 'goodjob', name: 'Good Job!', category: 'positive', file: 'goodjob.mp3', emoji: '👍' },
  { id: 'wellplayed', name: 'Well Played!', category: 'positive', file: 'wellplayed.mp3', emoji: '🏆' },
  { id: 'winner', name: 'Winner!', category: 'positive', file: 'winner.mp3', emoji: '🥇' },
  { id: 'yes', name: 'Yes!', category: 'positive', file: 'yes.mp3', emoji: '✅' },
  { id: 'ding', name: 'Ding!', category: 'positive', file: 'ding.mp3', emoji: '🔔' },
  { id: 'cheer', name: 'Cheer!', category: 'positive', file: 'cheer.mp3', emoji: '📣' },
  { id: 'woohoo', name: 'Woohoo!', category: 'positive', file: 'woohoo.mp3', emoji: '🙌' },
  { id: 'highfive', name: 'High Five!', category: 'positive', file: 'highfive.mp3', emoji: '✋' },
  { id: 'applause', name: 'Applause', category: 'positive', file: 'applause.mp3', emoji: '👏' },
  { id: 'perfect', name: 'Perfect!', category: 'positive', file: 'perfect.mp3', emoji: '💯' },

  // Correction / Gentle Reminders (Negative)
  { id: 'tryagain', name: 'Try Again', category: 'negative', file: 'try_again.mp3', emoji: '🔄' },
  { id: 'oops', name: 'Oops', category: 'negative', file: 'oops.mp3', emoji: '😅' },
  { id: 'hmm', name: 'Hmm', category: 'negative', file: 'hmm.mp3', emoji: '🤔' },
  { id: 'payattention', name: 'Pay Attention', category: 'negative', file: 'payattention.mp3', emoji: '👀' },
  { id: 'notyet', name: 'Not Yet', category: 'negative', file: 'notyet.mp3', emoji: '⏳' },
  { id: 'frowny', name: 'Frowny', category: 'negative', file: 'cry.mp3', emoji: '😔' },
  { id: 'buzzer', name: 'Buzzer', category: 'negative', file: 'buzzer.mp3', emoji: '🔔' },
  { id: 'uhoh', name: 'Uh-oh', category: 'negative', file: 'uhoh.mp3', emoji: '😬' },
  { id: 'careful', name: 'Be Careful', category: 'negative', file: 'careful.mp3', emoji: '⚠️' },

  // Fun / Funny Sounds
  { id: 'boing', name: 'Boing!', category: 'fun', file: 'boing.mp3', emoji: '🌀' },
  { id: 'pop', name: 'Pop!', category: 'fun', file: 'pop.mp3', emoji: '💥' },
  { id: 'whoosh', name: 'Whoosh!', category: 'fun', file: 'whoosh.mp3', emoji: '💨' },
  { id: 'magic', name: 'Magic!', category: 'fun', file: 'magic.mp3', emoji: '🪄' },
  { id: 'tada', name: 'Tada!', category: 'fun', file: 'tada.mp3', emoji: '🎺' },
  { id: 'laugh', name: 'Laugh!', category: 'fun', file: 'laugh.mp3', emoji: '😄' },
  { id: 'giggle', name: 'Giggle', category: 'fun', file: 'giggle.mp3', emoji: '😊' },
  { id: 'snort', name: 'Snort', category: 'fun', file: 'snort.mp3', emoji: '🤭' },
];

const DEFAULT_BEHAVIORS = [
  { label: 'Helped Friend', pts: 1, type: 'wow' },
  { label: 'Great Work', pts: 2, type: 'wow' },
  { label: 'On Task', pts: 1, type: 'wow' },
  { label: 'Kindness', pts: 1, type: 'wow' },
  { label: 'Noisy', pts: -1, type: 'nono' },
  { label: 'Disruptive', pts: -2, type: 'nono' }
];

const buildDefaultBehaviors = () =>
  DEFAULT_BEHAVIORS.map((b, idx) => ({
    id: `default_${Date.now()}_${idx}`,
    ...b,
    audio: null,
    stickerId: null
  }));

/** UI + picker: unset / none / empty → canonical "no sound" */
function normalizeBehaviorAudio(audio) {
  if (audio == null || audio === '' || audio === 'none') return 'none';
  return audio;
}

/** True when a real clip is chosen (not "No sound") */
function behaviorHasSound(audio) {
  return !!audio && audio !== 'none';
}

// ─── Pure CSS tooltip wrapper ─────────────────────────────────────────────────
// Uses data-tooltip + ::after pseudo-element — zero JS, zero re-renders.
// The CSS is injected once at module level so it is never recreated.
if (typeof document !== 'undefined' && !document.getElementById('abc-tooltip-style')) {
  const s = document.createElement('style');
  s.id = 'abc-tooltip-style';
  s.innerHTML = `
    .abc-tip { position: relative; display: inline-block; }
    .abc-tip::after {
      content: attr(data-tooltip);
      position: absolute;
      left: 50%;
      top: calc(100% + 8px);
      transform: translateX(-50%);
      background: #333;
      color: #fff;
      padding: 5px 10px;
      border-radius: 8px;
      font-size: 13px;
      white-space: nowrap;
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s;
    }
    .abc-tip:hover::after { opacity: 1; }
  `;
  document.head.appendChild(s);
}

// ─── Tooltip — pure CSS version, no state ────────────────────────────────────
function Tooltip({ children, text }) {
  return (
    <span className="abc-tip" data-tooltip={text} style={{ display: 'inline-block' }}>
      {children}
    </span>
  );
}

export default function SettingsPage({ activeClass, behaviors, user, onBack, onUpdateBehaviors }) {
  const { addToast } = useToast();
  const [activeTab] = useState('cards');
  
  // Helper to save behaviors to localStorage for persistence
  const saveBehaviorsToLocalStorage = (behaviorsList) => {
    try {
      localStorage.setItem('classABC_behaviors', JSON.stringify(behaviorsList));
    } catch (e) {
      console.warn('Failed to save behaviors to localStorage:', e);
    }
  };
  
  const [cards, setCards] = useState(() => {
    const behaviorList = Array.isArray(behaviors) ? behaviors : [];
    return behaviorList.map(card => ({
      ...card,
      audio: normalizeBehaviorAudio(card.audio),
      stickerId: card.stickerId || null
    }));
  });
  const [, setSidebarCollapsed] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [editingCard, setEditingCard] = useState({ label: '', pts: 0, type: 'wow', audio: 'none' });
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [addCardModalData, setAddCardModalData] = useState({ label: 'New Card', pts: 1, audio: 'none', stickerId: null });
  const [addCardError, setAddCardError] = useState('');
  const [showAudioPickerFor, setShowAudioPickerFor] = useState(null);
  const [audioFilter, setAudioFilter] = useState('all');
  const [currentPreviewAudio, setCurrentPreviewAudio] = useState(null);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [selectedStickerId, setSelectedStickerId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [cardFilterType, setCardFilterType] = useState('all');
  const [cardQuery, setCardQuery] = useState('');

  const audioPreviewRef = React.useRef(null);
  const [customAudios, setCustomAudios] = useState([]);

  // Load custom audio files from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('customAudioFiles');
      if (stored) {
        setCustomAudios(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load custom audio files:', e);
    }
  }, []);

  // Sync custom audio files from PocketBase on mount (for multi-device sync)
  React.useEffect(() => {
    const syncFromPocketBase = async () => {
      try {
        const behaviors = await api.getBehaviors();
        const customAudioMap = new Map();

        behaviors.forEach(behavior => {
          if (behavior.audio && behavior.audio.startsWith('custom_') && behavior.audioData) {
            customAudioMap.set(behavior.audio, {
              id: behavior.audio,
              name: `${behavior.label.substring(0, 10)}`,
              file: behavior.audio,
              data: behavior.audioData,
              category: 'custom',
              emoji: '🎵'
            });
          }
        });

        if (customAudioMap.size > 0) {
          const syncedAudios = Array.from(customAudioMap.values());
          const existing = JSON.parse(localStorage.getItem('customAudioFiles') || '[]');
          const merged = [...existing];
          
          syncedAudios.forEach(synced => {
            const existingIndex = merged.findIndex(a => a.id === synced.id);
            if (existingIndex >= 0) {
              merged[existingIndex] = synced;
            } else {
              merged.push(synced);
            }
          });
          
          setCustomAudios(merged);
          localStorage.setItem('customAudioFiles', JSON.stringify(merged));
        }
      } catch (e) {
        console.warn('Failed to sync custom audio from PocketBase:', e);
      }
    };

    syncFromPocketBase();
  }, []);

  // Helper function to preview audio
  const playAudioPreview = (audioFile) => {
    if (currentPreviewAudio) {
      currentPreviewAudio.pause();
      currentPreviewAudio.currentTime = 0;
    }

    if (!audioFile || audioFile === 'none') {
      setCurrentPreviewAudio(null);
      return;
    }

    try {
      // Check if it's a custom audio file
      const isCustom = audioFile.startsWith('custom_');
      let audioSource = '';
      let objectURL = null;

      if (isCustom) {
        // Find the custom audio in the list
        const customAudio = customAudios.find(c => c.file === audioFile);
        if (customAudio && customAudio.data) {
          // Convert base64 to Blob and create object URL
          try {
            // Extract MIME type from base64 data URI
            const mimeTypeMatch = customAudio.data.match(/^data:([^;]+);/);
            const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'audio/mpeg';

            const base64Data = customAudio.data.split(',')[1]; // Remove data URI prefix
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: mimeType });
            objectURL = URL.createObjectURL(blob);
            audioSource = objectURL;
          } catch (e) {
            console.warn('[Audio Preview] Failed to create object URL:', e);
            return;
          }
        } else {
          return;
        }
      } else {
        audioSource = `/audio/${audioFile}`;
      }

      const audio = new Audio();
      audio.volume = 0.7;

      // Wait for the audio to be ready before playing
      audio.addEventListener('canplaythrough', () => {
        audio.play().catch(err => console.warn('[Audio Preview] Play failed:', err));
      }, { once: true });

      audio.addEventListener('error', (e) => {
        console.warn('[Audio Preview] Audio load error:', audio.error);
      }, { once: true });

      audio.src = audioSource;
      audio.load();

      setCurrentPreviewAudio(audio);

      // Auto-cleanup after playing
      audio.onended = () => {
        if (objectURL) {
          URL.revokeObjectURL(objectURL);
        }
        setCurrentPreviewAudio(null);
      };
    } catch (err) {
      console.warn('Failed to create audio preview:', err);
    }
  };

  // Handle custom audio file upload
  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid audio file (MP3, WAV, OGG, or WebM)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Audio file must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const audioId = `custom_${Date.now()}`;
        const base64Data = event.target.result;
        const newCustomAudio = {
          id: audioId,
          name: file.name.replace(/\.[^/.]+$/, '').substring(0, 10), // Remove file extension and truncate to 10 chars
          file: audioId,
          data: base64Data, // Store base64 data
          category: 'custom',
          emoji: '🎵'
        };

        const updatedCustomAudios = [...customAudios, newCustomAudio];
        setCustomAudios(updatedCustomAudios);
        localStorage.setItem('customAudioFiles', JSON.stringify(updatedCustomAudios));

        // Auto-select the uploaded audio
        if (showAudioPickerFor === 'modal') {
          setAddCardModalData(prev => ({ ...prev, audio: audioId }));
        } else if (showAudioPickerFor) {
          setEditingCard(prev => ({ ...prev, audio: audioId }));
        }
        setShowAudioPickerFor(null);

        // Save the audio data to a placeholder behavior in PocketBase
        // This ensures the audio persists across devices
        try {
          await api.saveCustomAudio(audioId, newCustomAudio.name, base64Data);
        } catch (err) {
          console.warn('Failed to save audio to PocketBase (will sync on next save):', err);
        }
      } catch (err) {
        console.error('Failed to process audio file:', err);
        alert('Failed to process audio file. Please try again.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Delete custom audio file
  const handleDeleteCustomAudio = async (audioId) => {
    const updatedCustomAudios = customAudios.filter(a => a.id !== audioId);
    setCustomAudios(updatedCustomAudios);
    localStorage.setItem('customAudioFiles', JSON.stringify(updatedCustomAudios));

    // If the deleted audio was selected, clear it
    if (showAudioPickerFor === 'modal' && addCardModalData.audio === audioId) {
      setAddCardModalData(prev => ({ ...prev, audio: 'none' }));
    } else if (showAudioPickerFor && showAudioPickerFor !== 'modal' && editingCard.audio === audioId) {
      setEditingCard(prev => ({ ...prev, audio: 'none' }));
    }

    // Remove audio from PocketBase
    try {
      await api.deleteCustomAudio(audioId);
    } catch (err) {
      console.warn('Failed to delete audio from PocketBase:', err);
    }
  };

  // Force cleanup on unmount
  React.useEffect(() => {
    return () => {
      setEditingCardId(null);
      setEditingCard({ label: '', pts: 0, icon: '⭐', type: 'wow', audio: 'none' });
      setShowAddCardModal(false);
      setShowAudioPickerFor(null);
      if (currentPreviewAudio) {
        currentPreviewAudio.pause();
        currentPreviewAudio.currentTime = 0;
      }
      setCurrentPreviewAudio(null);
    };
  }, []);

  React.useEffect(() => {
    const convertedCards = (Array.isArray(behaviors) ? behaviors : []).map(card => ({
      ...card,
      audio: normalizeBehaviorAudio(card.audio),
      stickerId: card.stickerId || null
    }));
    setCards(convertedCards);
  }, [behaviors]);

  const filteredCards = useMemo(() => {
    const q = cardQuery.trim().toLowerCase();
    return cards.filter((card) => {
      const typeOk =
        cardFilterType === 'all' ||
        (cardFilterType === 'wow' && Number(card.pts) > 0) ||
        (cardFilterType === 'nono' && Number(card.pts) <= 0) ||
        (cardFilterType === 'sound' && behaviorHasSound(card.audio));
      if (!typeOk) return false;
      if (!q) return true;
      const label = String(card.label || '').toLowerCase();
      const sound = String(card.audio || '').toLowerCase();
      return label.includes(q) || sound.includes(q);
    });
  }, [cards, cardFilterType, cardQuery]);

  // Auto-collapse sidebar on small screens
  React.useEffect(() => {
    const handleResize = () => setSidebarCollapsed(window.innerWidth < 720);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBackClick = () => {
    try {
      setEditingCardId(null);
      setEditingCard({ label: '', pts: 0, type: 'wow', audio: 'none' });
      setShowAddCardModal(false);
      setShowAudioPickerFor(null);
      setCurrentPreviewAudio(null);
      if (typeof onBack === 'function') onBack();
      // Don't call api.saveBehaviors here - let App.jsx handle saving via saveClasses
    } catch (err) {
      if (typeof onBack === 'function') onBack();
    }
  };

  const handleSaveCard = async (id) => {
    const previousCards = cards;
    const pts = Number(editingCard.pts);
    const type = pts > 0 ? 'wow' : 'nono';
    const persistedAudio = !editingCard.audio || editingCard.audio === 'none' ? null : editingCard.audio;
    
    // Include audioData for custom audio files
    let audioData = null;
    if (persistedAudio && persistedAudio.startsWith('custom_')) {
      const customAudio = customAudios.find(c => c.file === persistedAudio);
      if (customAudio && customAudio.data) {
        audioData = customAudio.data;
      }
    }
    
    const updated = cards.map(c => c.id === id ? {
      ...c,
      label: editingCard.label,
      pts,
      type,
      audio: persistedAudio,
      audioData: audioData,
      stickerId: editingCard.stickerId || null,
    } : c);

    // Optimistic update for snappy UX.
    setCards(updated);
    setEditingCardId(null);
    if (onUpdateBehaviors) onUpdateBehaviors(updated);
    saveBehaviorsToLocalStorage(updated); // Save to localStorage for persistence
    const cardToSave = updated.find(c => c.id === id);
    if (!cardToSave) return;
    setIsSaving(true);
    try {
      const saved = await api.saveBehaviors([cardToSave], activeClass?.id ?? null, user?.email);
      if (saved?.[0]?.id && String(saved[0].id) !== String(cardToSave.id)) {
        const synced = updated.map(c => (String(c.id) === String(cardToSave.id) ? { ...c, id: saved[0].id } : c));
        setCards(synced);
        if (onUpdateBehaviors) onUpdateBehaviors(synced);
        saveBehaviorsToLocalStorage(synced); // Save to localStorage for persistence
      }
    } catch (e) {
      console.error('Failed to save card to backend:', e);
      setCards(previousCards);
      if (onUpdateBehaviors) onUpdateBehaviors(previousCards);
      saveBehaviorsToLocalStorage(previousCards); // Save to localStorage for persistence
      addToast('Failed to save card. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCard = async (id) => {
    const card = cards.find(c => c.id === id);
    if (!card) return;

    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteCard = async () => {
    const id = deleteTargetId;
    const card = cards.find(c => c.id === id);
    if (!card) return;

    setShowDeleteConfirm(false);
    const previousCards = cards;
    const updated = cards.filter(c => c.id !== id);
    setCards(updated);
    if (onUpdateBehaviors) onUpdateBehaviors(updated);
    saveBehaviorsToLocalStorage(updated); // Save to localStorage for persistence
    setIsSaving(true);

    try {
      // If the card is persisted in PocketBase, delete remotely.
      // Temporary/local IDs (default_/new_) should be removed locally only.
      const isLocalTempId =
        typeof id !== 'string' ||
        id.startsWith('default_') ||
        id.startsWith('new_');
      if (!isLocalTempId) {
        await api.deleteBehavior(id);
      }
      // Show success message
      addToast(`"${card.label}" has been deleted.`, 'success');
    } catch (e) {
      console.error('Failed to delete card:', e);
      setCards(previousCards);
      if (onUpdateBehaviors) onUpdateBehaviors(previousCards);
      saveBehaviorsToLocalStorage(previousCards); // Save to localStorage for persistence
      addToast('Failed to delete card. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCard = async (newCardData) => {
    // Clear any previous errors
    setAddCardError('');

    // Check if card name already exists (case-insensitive)
    const duplicateCard = cards.find(card =>
      card.label.toLowerCase() === newCardData.label.toLowerCase()
    );

    if (duplicateCard) {
      setAddCardError(`A card with the name "${newCardData.label}" already exists. Please choose a different name.`);
      return;
    }

    try {
      const persistedAudio = !newCardData.audio || newCardData.audio === 'none' ? null : newCardData.audio;
      
      // Include audioData for custom audio files
      let audioData = null;
      if (persistedAudio && persistedAudio.startsWith('custom_')) {
        const customAudio = customAudios.find(c => c.file === persistedAudio);
        if (customAudio && customAudio.data) {
          audioData = customAudio.data;
        }
      }
      
      const tempId = `new_${Date.now()}`;
      const newCard = {
        id: tempId,
        ...newCardData,
        type: newCardData.pts > 0 ? 'wow' : 'nono',
        audio: persistedAudio,
        audioData: audioData,
        stickerId: newCardData.stickerId || null,
      };
      const updated = [newCard, ...cards];
      setCards(updated);
      if (onUpdateBehaviors) onUpdateBehaviors(updated);
      saveBehaviorsToLocalStorage(updated); // Save to localStorage for persistence
      setShowAddCardModal(false);
      setIsSaving(true);
      const savedCards = await api.saveBehaviors([newCard], activeClass?.id ?? null, user?.email);
      if (savedCards.length > 0 && savedCards[0]?.id) {
        const withRealId = updated.map(card => (card.id === tempId ? { ...card, id: savedCards[0].id } : card));
        setCards(withRealId);
        if (onUpdateBehaviors) onUpdateBehaviors(withRealId);
        saveBehaviorsToLocalStorage(withRealId); // Save to localStorage for persistence
      }
    } catch (error) {
      console.error('Failed to add card:', error);
      setAddCardError('Failed to create card. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="settings-page-root safe-area-top" style={styles.pageContainer}>
      {/* Top Navigation Bar */}
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }} />
        <div className="settings-header-actions" style={{ ...styles.headerActions, flexDirection: 'row' }}>
          {(isSaving || isResetting) && (
            <span style={styles.syncBadge}>
              {isResetting ? 'Resetting cards...' : 'Saving...'}
            </span>
          )}
          <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
            <Tooltip text="Reset all behavior cards to default">
              <button
                aria-label="Reset behaviors"
                style={styles.headerIconBtn}
                onClick={() => setDeleteConfirm(true)}
                disabled={isSaving || isResetting}
              >
                <RefreshCw size={18} style={{ marginRight: 6 }} />
                <span style={{ ...styles.headerIconLabel, fontSize: 14 }}>Reset</span>
              </button>
            </Tooltip>
            <Tooltip text="Done and close settings">
              <button aria-label="Done" style={styles.headerIconBtn} onClick={handleBackClick}>
                <X size={18} />
              </button>
            </Tooltip>
          </div>
        </div>
      </header>

      <div style={styles.mainLayout}>
        <main style={styles.content}>
          {activeTab === 'cards' && (
            <section>
              <div style={styles.toolsRow}>
                <div style={styles.filterTabsWrap}>
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'wow', label: 'WOW +' },
                    { id: 'nono', label: 'NO NO -' },
                    { id: 'sound', label: 'With Sound' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCardFilterType(tab.id)}
                      style={{
                        ...styles.filterTabBtn,
                        ...(cardFilterType === tab.id ? styles.filterTabBtnActive : {})
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <input
                  value={cardQuery}
                  onChange={(e) => setCardQuery(e.target.value)}
                  placeholder="Search cards..."
                  style={styles.searchInput}
                />
              </div>
              <div style={styles.cardList}>
                {/* ADD CARD */}
                <div
                  className="add-card-hover"
                  title="Add a new behavior card"
                  onClick={() => { setShowAddCardModal(true); setAddCardError(''); setAddCardModalData({ label: 'New Card', pts: 1, audio: 'none', stickerId: null }); }}
                  style={{
                    ...styles.settingItem,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #CBD5E1',
                    backgroundColor: '#F8FAFC',
                    boxShadow: 'none',
                    color: '#64748B',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    minHeight: 120,
                    height: 140,
                    width: '100%',
                    maxWidth: '100%'
                  }}
                >
                  <div style={{ background: 'white', padding: 10, borderRadius: '50%', marginBottom: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <Plus size={28} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '1rem' }}>Add Card</span>
                </div>

                {filteredCards.map(card => (
                  <div key={card.id} style={{
                    ...styles.settingItem,
                    position: 'relative',
                    minHeight: editingCardId === card.id ? 180 : 120,
                    height: editingCardId === card.id ? 190 : 140,
                    padding: '4px 35px 4px 12px',
                    width: '100%',
                    maxWidth: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'height 0.3s ease, minHeight 0.3s ease'
                  }}>
                    {/* Save button - top right (edit mode) */}
                    {editingCardId === card.id && (
                      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                        <Tooltip text="Save changes">
                          <button onClick={() => handleSaveCard(card.id)} style={{
                            background: 'rgba(255,255,255,0.95)',
                            border: '1px solid #4CAF50',
                            borderRadius: 8,
                            padding: '10px 14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#4CAF50',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }} aria-label="Save"><Save size={18} /></button>
                        </Tooltip>
                      </div>
                    )}

                    {/* Edit button - top right */}
                    {editingCardId !== card.id && (
                      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                        <Tooltip text="Edit card">
                          <button onClick={() => { setEditingCardId(card.id); setEditingCard({ label: card.label, pts: card.pts, type: card.pts > 0 ? 'wow' : 'nono', audio: normalizeBehaviorAudio(card.audio), stickerId: card.stickerId || null }); }} style={{
                            background: 'rgba(255,255,255,0.95)',
                            border: '1px solid #E6EEF8',
                            borderRadius: 8,
                            padding: '10px 14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#2563EB',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }} aria-label="Edit"><Edit2 size={18} /></button>
                        </Tooltip>
                      </div>
                    )}

                    {/* Cancel button - bottom right (edit mode) */}
                    {editingCardId === card.id && (
                      <div style={{ position: 'absolute', bottom: 8, right: 8, zIndex: 10 }}>
                        <Tooltip text="Cancel editing">
                          <button onClick={() => setEditingCardId(null)} style={{
                            background: 'rgba(255,255,255,0.95)',
                            border: '1px solid #ffcdd2',
                            borderRadius: 8,
                            padding: '10px 14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FF6B6B',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }} aria-label="Cancel"><X size={18} /></button>
                        </Tooltip>
                      </div>
                    )}

                    {/* Delete button - bottom right */}
                    {editingCardId !== card.id && (
                      <div style={{ position: 'absolute', bottom: 8, right: 8, zIndex: 10 }}>
                        <Tooltip text="Delete card">
                          <button onClick={() => handleDeleteCard(card.id)} style={{
                            background: 'rgba(255,255,255,0.95)',
                            border: '1px solid #ffcdd2',
                            borderRadius: 8,
                            padding: '10px 14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FF6B6B',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }} aria-label="Delete"><Trash2 size={18} /></button>
                        </Tooltip>
                      </div>
                    )}

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0, justifyContent: 'flex-start', height: '100%', padding: '4px 8px', overflow: 'hidden' }}>
                      {editingCardId === card.id ? (
                        <>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center', width: '100%', maxWidth: '100%' }}>
                            <input
                              value={editingCard.label}
                              onChange={(e) => setEditingCard(prev => ({ ...prev, label: e.target.value }))}
                              placeholder="Card label"
                              style={{
                                padding: '6px 8px',
                                borderRadius: 6,
                                border: '2px solid #E6EEF8',
                                fontSize: '13px',
                                fontWeight: 600,
                                width: '100%',
                                maxWidth: '180px',
                                boxSizing: 'border-box',
                                textAlign: 'center',
                                background: '#F8FAFC',
                                color: '#1E293B'
                              }}
                              title="Edit card label"
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Tooltip text="Decrease points">
                                <button onClick={() => { const pts = Number(editingCard.pts) - 1; setEditingCard(prev => ({ ...prev, pts, type: pts > 0 ? 'wow' : 'nono' })); }} style={{ ...styles.smallIconBtn, padding: '4px 8px', fontSize: 14 }} aria-label="Decrease points">-</button>
                              </Tooltip>
                              <div style={{ minWidth: 28, textAlign: 'center', fontWeight: 800, color: editingCard.pts > 0 ? '#4CAF50' : '#F44336', fontSize: '18' }}>{editingCard.pts}</div>
                              <Tooltip text="Increase points">
                                <button onClick={() => { const pts = Number(editingCard.pts) + 1; setEditingCard(prev => ({ ...prev, pts, type: pts > 0 ? 'wow' : 'nono' })); }} style={{ ...styles.smallIconBtn, padding: '4px 8px', fontSize: 14 }} aria-label="Increase points">+</button>
                              </Tooltip>
                            </div>
                            <div style={{ color: editingCard.pts > 0 ? '#4CAF50' : '#F44336', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              {editingCard.pts > 0 ? 'WOW' : 'NO NO'}
                            </div>
                            <Tooltip text="Change sound effect">
                              <button
                                onClick={() => setShowAudioPickerFor(card.id)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: 6,
                                  border: behaviorHasSound(editingCard.audio) ? '2px solid #4CAF50' : '1px solid #E2E8F0',
                                  background: behaviorHasSound(editingCard.audio) ? '#F0FDF4' : 'white',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  fontSize: '11px',
                                  fontWeight: 500,
                                  color: behaviorHasSound(editingCard.audio) ? '#4CAF50' : '#64748B',
                                  width: '100%',
                                  maxWidth: '180px',
                                  justifyContent: 'center'
                                }}
                              >
                                <Music size={12} />
                                {(() => {
                                  if (!behaviorHasSound(editingCard.audio)) return 'No Sound';
                                  if (editingCard.audio.startsWith('custom_')) {
                                    const customAudio = customAudios.find(c => c.file === editingCard.audio);
                                    if (customAudio) {
                                      const name = customAudio.name.replace(/\.[^/.]+$/, '');
                                      return name.length > 8 ? '...' + name.slice(-8) : name;
                                    }
                                    return 'Custom';
                                  }
                                  return AUDIO_CLIPS.find(c => c.file === editingCard.audio)?.name?.substring(0, 8) + '...' || 'Sound';
                                })()}
                              </button>
                            </Tooltip>
                            <Tooltip text="Change 3D sticker">
                              <button
                                onClick={() => { setShowStickerPicker(true); setSelectedStickerId(editingCard.stickerId); }}
                                style={{
                                  padding: editingCard.stickerId ? '6px 10px' : '4px 8px',
                                  borderRadius: 6,
                                  border: editingCard.stickerId ? '2px solid #9C27B0' : '1px solid #E2E8F0',
                                  background: editingCard.stickerId ? '#F3E5F5' : 'white',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  fontSize: editingCard.stickerId ? '10px' : '11px',
                                  fontWeight: 500,
                                  color: editingCard.stickerId ? '#9C27B0' : '#64748B',
                                  width: '100%',
                                  maxWidth: '180px',
                                  justifyContent: 'center',
                                  marginTop: 6,
                                  transition: 'all 0.2s'
                                }}
                              >
                                {editingCard.stickerId ? (
                                  <>
                                    <StickerDisplay stickerId={editingCard.stickerId} size={32} animated={false} />
                                    <span>Change</span>
                                  </>
                                ) : (
                                  <>
                                    <Smile size={10} />
                                    <span>Add Sticker</span>
                                  </>
                                )}
                              </button>
                            </Tooltip>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Card name at top */}
                          <div style={{
                            fontWeight: 700,
                            fontSize: '13px',
                            textAlign: 'center',
                            padding: '8px 12px',
                            background: card.pts > 0
                              ? 'linear-gradient(135deg, #22c55e 0%, #10b981 55%, #14b8a6 100%)'
                              : 'linear-gradient(135deg, #fb7185 0%, #ef4444 55%, #dc2626 100%)',
                            color: 'white',
                            borderRadius: 8,
                            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            width: '100%',
                            maxWidth: '100%',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {card.label}
                          </div>

                          {/* Points in center with WOW/NO NO */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' }}>
                            <div style={{ color: card.pts > 0 ? '#4CAF50' : '#F44336', fontSize: '24px', fontWeight: 900, lineHeight: 1 }}>
                              {card.pts > 0 ? `+${card.pts}` : card.pts}
                            </div>
                            <div style={{ color: card.pts > 0 ? '#4CAF50' : '#F44336', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.9px' }}>
                              {card.pts > 0 ? 'WOW' : 'NO NO'}
                            </div>
                          </div>

                          {/* Sound effect at bottom */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            padding: '6px 8px',
                            borderRadius: 8,
                            background: behaviorHasSound(card.audio) ? '#F0FDF4' : '#F8FAFC',
                            border: behaviorHasSound(card.audio) ? '1px solid #4CAF50' : '1px solid #E2E8F0',
                            color: behaviorHasSound(card.audio) ? '#4CAF50' : '#94A3B8',
                            fontSize: '11px',
                            fontWeight: 600,
                            textAlign: 'center',
                            width: '100%',
                            maxWidth: '100%',
                            boxSizing: 'border-box',
                            overflow: 'hidden'
                          }}>
                            <Music size={10} style={{ flexShrink: 0 }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {(() => {
                                if (!behaviorHasSound(card.audio)) return 'No Sound';
                                if (card.audio.startsWith('custom_')) {
                                  const customAudio = customAudios.find(c => c.file === card.audio);
                                  if (customAudio) {
                                    const name = customAudio.name.replace(/\.[^/.]+$/, '');
                                    return name.length > 8 ? '...' + name.slice(-8) : name;
                                  }
                                  return 'Custom';
                                }
                                return AUDIO_CLIPS.find(c => c.file === card.audio)?.name || 'Sound';
                              })()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {filteredCards.length === 0 && (
                  <div style={styles.emptyStateCard}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', marginBottom: 6 }}>No cards match</div>
                    <div style={{ fontSize: 13, color: '#64748B' }}>
                      Try another filter or search, or add a new card.
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ADD CARD MODAL */}
      {showAddCardModal && (
        <div style={styles.modalOverlay} className="modal-overlay-in">
          <div style={styles.modal} className="animated-modal-content modal-animate-center">
            <div style={styles.modalHeader}>
              <h3>Add New Card</h3>
              <button style={styles.closeBtn} onClick={() => { setShowAddCardModal(false); setAddCardError(''); }}><X size={20} /></button>
            </div>

            {/* Error Message */}
            {addCardError && (
              <div style={{
                padding: '12px 16px',
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: '10px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <span style={{ color: '#DC2626', fontSize: '18px', lineHeight: 1 }}>⚠️</span>
                <span style={{ color: '#991B1B', fontSize: '14px', fontWeight: 600, lineHeight: 1.4 }}>{addCardError}</span>
              </div>
            )}

            <div style={styles.modalSection}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={styles.modalLabel}>Sound Effect</label>
                {behaviorHasSound(addCardModalData.audio) && (
                  <button
                    onClick={() => playAudioPreview(addCardModalData.audio)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#2563EB' }}
                  >
                    {currentPreviewAudio?.src?.includes(addCardModalData.audio) ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    {currentPreviewAudio?.src?.includes(addCardModalData.audio) ? 'Stop' : 'Preview'}
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowAudioPickerFor('modal')}
                style={{
                  width: '100%',
                  height: 60,
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  border: behaviorHasSound(addCardModalData.audio) ? '2px solid #4CAF50' : '2px solid #E6EEF8',
                  background: behaviorHasSound(addCardModalData.audio) ? '#F0FDF4' : 'white',
                  borderRadius: 16,
                  cursor: 'pointer',
                }}
              >
                <Music size={24} style={{ color: behaviorHasSound(addCardModalData.audio) ? '#4CAF50' : '#64748B' }} />
                <span style={{ color: behaviorHasSound(addCardModalData.audio) ? '#4CAF50' : '#64748B' }}>
                  {(() => {
                    if (!behaviorHasSound(addCardModalData.audio)) return 'No Sound';
                    if (addCardModalData.audio.startsWith('custom_')) {
                      const customAudio = customAudios.find(c => c.file === addCardModalData.audio);
                      if (customAudio) {
                        const name = customAudio.name.replace(/\.[^/.]+$/, '');
                        return name.length > 8 ? '...' + name.slice(-8) : name;
                      }
                      return 'Custom Sound';
                    }
                    return AUDIO_CLIPS.find(c => c.file === addCardModalData.audio)?.name || 'Custom Sound';
                  })()}
                </span>
                {behaviorHasSound(addCardModalData.audio) && <X size={20} onClick={(e) => { e.stopPropagation(); setAddCardModalData(prev => ({ ...prev, audio: 'none' })); }} style={{ marginLeft: 'auto', cursor: 'pointer' }} />}
              </button>
            </div>

            <div style={styles.modalSection}>
              <label style={styles.modalLabel}>Card Name</label>
              <input
                type="text"
                placeholder="Enter card name..."
                value={addCardModalData.label}
                onChange={(e) => {
                  setAddCardModalData(prev => ({ ...prev, label: e.target.value }));
                  // Clear error when user starts typing
                  if (addCardError) setAddCardError('');
                }}
                style={{
                  ...styles.modalInput,
                  borderColor: addCardError ? '#FCA5A5' : '#E2E8F0'
                }}
              />
            </div>

            <div style={styles.modalSection}>
              <label style={styles.modalLabel}>Points</label>
              <div style={styles.pointsControl}>
                <button onClick={() => setAddCardModalData(prev => ({ ...prev, pts: prev.pts - 1 }))} style={styles.pointsBtn}>
                  <Minus size={20} />
                </button>
                <div style={styles.pointsValue}>{addCardModalData.pts > 0 ? `+${addCardModalData.pts}` : addCardModalData.pts}</div>
                <button onClick={() => setAddCardModalData(prev => ({ ...prev, pts: prev.pts + 1 }))} style={styles.pointsBtn}>
                  <Plus size={20} />
                </button>
              </div>
              <div style={{
                ...styles.typeBadge,
                background: addCardModalData.pts > 0 ? '#F0FDF4' : '#FEF2F2',
                color: addCardModalData.pts > 0 ? '#16A34A' : '#DC2626'
              }}>
                {addCardModalData.pts > 0 ? 'WOW' : 'NO NO'}
              </div>
            </div>

            <div style={styles.modalSection}>
              <label style={styles.modalLabel}>3D Sticker</label>
              <button
                onClick={() => { setShowStickerPicker(true); setSelectedStickerId(addCardModalData.stickerId); }}
                style={{
                  width: '100%',
                  height: 80,
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  border: addCardModalData.stickerId ? '2px solid #9C27B0' : '2px solid #E6EEF8',
                  background: addCardModalData.stickerId ? '#F3E5F5' : 'white',
                  borderRadius: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: addCardModalData.stickerId ? '0 4px 12px rgba(156, 39, 176, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                <Smile size={28} style={{ color: addCardModalData.stickerId ? '#9C27B0' : '#64748B' }} />
                {addCardModalData.stickerId ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StickerDisplay stickerId={addCardModalData.stickerId} size={48} animated={false} />
                    <span style={{ color: '#9C27B0', fontWeight: 600 }}>Change Sticker</span>
                  </div>
                ) : (
                  <span style={{ color: '#64748B' }}>Choose a 3D Sticker...</span>
                )}
                {addCardModalData.stickerId && <X size={18} onClick={(e) => { e.stopPropagation(); setAddCardModalData(prev => ({ ...prev, stickerId: null })); }} style={{ marginLeft: 'auto', cursor: 'pointer', color: '#64748B' }} />}
              </button>
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.modalCancelBtn} onClick={() => { setShowAddCardModal(false); setAddCardError(''); }}>Cancel</button>
              <button
                style={{
                  ...styles.modalSaveBtn,
                  opacity: addCardModalData.label.trim() ? 1 : 0.6,
                  cursor: addCardModalData.label.trim() ? 'pointer' : 'not-allowed'
                }}
                onClick={() => addCardModalData.label.trim() && handleAddCard(addCardModalData)}
                disabled={!addCardModalData.label.trim()}
              >
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUDIO PICKER MODAL */}
      {showAudioPickerFor && (
        <div style={styles.audioPickerOverlay} className="modal-overlay-in">
          <div style={styles.audioPickerModal} className="animated-modal-content modal-animate-center">
            <div style={styles.modalHeader}>
              <h3>Choose Sound Effect</h3>
              <button style={styles.closeBtn} onClick={() => setShowAudioPickerFor(null)}><X size={20} /></button>
            </div>

            {/* Filter Tabs */}
            <div style={styles.audioFilterTabs}>
              <button
                onClick={() => setAudioFilter('all')}
                style={{
                  ...styles.audioFilterTab,
                  ...(audioFilter === 'all' ? styles.audioFilterTabActive : {})
                }}
              >
                All
              </button>
              <button
                onClick={() => setAudioFilter('none')}
                style={{
                  ...styles.audioFilterTab,
                  ...(audioFilter === 'none' ? styles.audioFilterTabActive : {})
                }}
              >
                No Sound 🔇
              </button>
              <button
                onClick={() => setAudioFilter('positive')}
                style={{
                  ...styles.audioFilterTab,
                  ...(audioFilter === 'positive' ? styles.audioFilterTabActive : {})
                }}
              >
                Positive 🌟
              </button>
              <button
                onClick={() => setAudioFilter('negative')}
                style={{
                  ...styles.audioFilterTab,
                  ...(audioFilter === 'negative' ? styles.audioFilterTabActive : {})
                }}
              >
                Correction 📝
              </button>
              <button
                onClick={() => setAudioFilter('fun')}
                style={{
                  ...styles.audioFilterTab,
                  ...(audioFilter === 'fun' ? styles.audioFilterTabActive : {})
                }}
              >
                Fun 😄
              </button>
              <button
                onClick={() => setAudioFilter('custom')}
                style={{
                  ...styles.audioFilterTab,
                  ...(audioFilter === 'custom' ? styles.audioFilterTabActive : {})
                }}
              >
                Custom 🎵
              </button>
            </div>

            {/* Audio List */}
            <div style={styles.audioList}>
              {/* Predefined Audio Clips */}
              {AUDIO_CLIPS
                .filter(clip => audioFilter === 'all' || clip.category === audioFilter || (audioFilter === 'none' && clip.category === 'none'))
                .map(clip => (
                  <div
                    key={clip.id}
                    style={{
                      ...styles.audioItem,
                      border: showAudioPickerFor === 'modal'
                        ? (clip.file === 'none' ? !behaviorHasSound(addCardModalData.audio) : addCardModalData.audio === clip.file) ? '2px solid #4CAF50' : '1px solid #E2E8F0'
                        : (clip.file === 'none' ? !behaviorHasSound(editingCard.audio) : editingCard.audio === clip.file) ? '2px solid #4CAF50' : '1px solid #E2E8F0',
                      background: showAudioPickerFor === 'modal'
                        ? (clip.file === 'none' ? !behaviorHasSound(addCardModalData.audio) : addCardModalData.audio === clip.file) ? '#F0FDF4' : 'white'
                        : (clip.file === 'none' ? !behaviorHasSound(editingCard.audio) : editingCard.audio === clip.file) ? '#F0FDF4' : 'white',
                    }}
                    onClick={() => {
                      if (showAudioPickerFor === 'modal') {
                        setAddCardModalData(prev => ({ ...prev, audio: clip.file === 'none' ? 'none' : clip.file }));
                      } else {
                        setEditingCard(prev => ({ ...prev, audio: clip.file === 'none' ? 'none' : clip.file }));
                      }
                      setShowAudioPickerFor(null);
                    }}
                  >
                    <div style={{ fontSize: '32px' }}>{clip.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis' }}>{clip.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: 2 }}>{clip.file}</div>
                    </div>
                    {clip.file !== 'none' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudioPreview(clip.file);
                        }}
                        style={{
                          padding: 8,
                          borderRadius: 8,
                          border: '1px solid #E2E8F0',
                          background: 'white',
                          cursor: 'pointer',
                          color: '#2563EB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Volume2 size={18} />
                      </button>
                    )}
                  </div>
                ))}

              {/* Custom Audio Files */}
              {(audioFilter === 'all' || audioFilter === 'custom') && customAudios.length > 0 && (
                <>
                  {audioFilter === 'all' && (
                    <div style={{ padding: '8px 12px', fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Custom Sounds
                    </div>
                  )}
                  {customAudios.map(clip => (
                    <div
                      key={clip.id}
                      style={{
                        ...styles.audioItem,
                        border: showAudioPickerFor === 'modal'
                          ? addCardModalData.audio === clip.file ? '2px solid #4CAF50' : '1px solid #E2E8F0'
                          : editingCard.audio === clip.file ? '2px solid #4CAF50' : '1px solid #E2E8F0',
                        background: showAudioPickerFor === 'modal'
                          ? addCardModalData.audio === clip.file ? '#F0FDF4' : 'white'
                          : editingCard.audio === clip.file ? '#F0FDF4' : 'white',
                      }}
                    >
                      <div style={{ fontSize: '32px' }}>{clip.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis' }}>{clip.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: 2 }}>Custom Upload</div>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playAudioPreview(clip.file);
                          }}
                          style={{
                            padding: 8,
                            borderRadius: 8,
                            border: '1px solid #E2E8F0',
                            background: 'white',
                            cursor: 'pointer',
                            color: '#2563EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Volume2 size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCustomAudio(clip.id);
                          }}
                          style={{
                            padding: 8,
                            borderRadius: 8,
                            border: '1px solid #ffcdd2',
                            background: 'white',
                            cursor: 'pointer',
                            color: '#FF6B6B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Delete custom sound"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Upload Custom Audio Section */}
              {audioFilter === 'custom' && (
                <div style={{
                  ...styles.audioItem,
                  border: '2px dashed #CBD5E1',
                  background: '#F8FAFC',
                  cursor: 'pointer',
                  justifyContent: 'center',
                  gap: 12,
                  padding: '20px',
                }}
                  onClick={() => document.getElementById('custom-audio-upload').click()}
                >
                  <Plus size={24} style={{ color: '#64748B' }} />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#2563EB' }}>Upload Custom Sound</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>MP3, WAV, OGG, WebM (max 5MB)</div>
                  </div>
                  <input
                    id="custom-audio-upload"
                    type="file"
                    accept="audio/*"
                    style={{ display: 'none' }}
                    onChange={handleAudioUpload}
                  />
                </div>
              )}
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.modalCancelBtn} onClick={() => setShowAudioPickerFor(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* STICKER PICKER MODAL */}
      <StickerPicker
        isOpen={showStickerPicker}
        onClose={() => {
          setShowStickerPicker(false);
          setSelectedStickerId(null);
        }}
        onSelectSticker={(stickerId) => {
          setSelectedStickerId(stickerId);
          if (showAddCardModal) {
            setAddCardModalData(prev => ({ ...prev, stickerId }));
          } else if (editingCardId) {
            setEditingCard(prev => ({ ...prev, stickerId }));
          }
        }}
        selectedStickerId={selectedStickerId}
        cardType={editingCardId ? (editingCard?.type || 'wow') : ((addCardModalData?.pts || 0) > 0 ? 'wow' : 'nono')}
      />

      {/* Delete Card Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={styles.confirmOverlay} onClick={() => setShowDeleteConfirm(false)}>
          <div style={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <div style={styles.confirmIconWrapper}>
              <AlertTriangle size={48} color="#DC2626" />
            </div>
            <h3 style={styles.confirmTitle}>Delete Behavior Card?</h3>
            <p style={styles.confirmMessage}>
              Are you sure you want to delete "{cards.find(c => c.id === deleteTargetId)?.label}"?
              <br />This action cannot be undone.
            </p>
            <div style={styles.confirmButtons}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={styles.confirmCancelButton}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCard}
                style={styles.confirmDeleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {deleteConfirm && (
        <div style={styles.confirmOverlay} onClick={() => setDeleteConfirm(false)}>
          <div style={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <div style={styles.confirmIconWrapper}>
              <AlertTriangle size={48} color="#DC2626" />
            </div>
            <h3 style={styles.confirmTitle}>Reset All Cards?</h3>
            <p style={styles.confirmMessage}>
              Are you sure you want to delete all your custom cards and restore the defaults?
              <br />This action <strong>cannot be undone</strong>.
            </p>
            <div style={styles.confirmButtons}>
              <button
                onClick={() => setDeleteConfirm(false)}
                style={styles.confirmCancelButton}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const previousCards = cards;
                  const resetCards = buildDefaultBehaviors();
                  setDeleteConfirm(false);
                  setIsResetting(true);
                  // Optimistic reset first to avoid laggy waiting.
                  setCards(resetCards);
                  onUpdateBehaviors && onUpdateBehaviors(resetCards);
                  try {
                    const saved = await api.replaceBehaviorsForOwner(resetCards, user?.email);
                    if (Array.isArray(saved) && saved.length > 0) {
                      const normalized = saved.map(card => ({
                        ...card,
                        audio: normalizeBehaviorAudio(card.audio),
                        stickerId: card.stickerId || null
                      }));
                      setCards(normalized);
                      onUpdateBehaviors && onUpdateBehaviors(normalized);
                    }
                    setEditingCardId(null);
                    addToast('Cards reset to default!', 'success');
                  } catch (e) {
                    console.warn('Failed to reset cards:', e.message);
                    setCards(previousCards);
                    onUpdateBehaviors && onUpdateBehaviors(previousCards);
                    addToast('Failed to reset cards. Please try again.', 'error');
                  } finally {
                    setIsResetting(false);
                  }
                }}
                style={styles.confirmDeleteButton}
                disabled={isResetting}
              >
                {isResetting ? 'Resetting...' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  pageContainer: { height: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC', position: 'relative' },
  header: {
    background: '#fff',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    minHeight: 48,
    padding: '6px 12px',
    boxSizing: 'border-box',
    position: 'relative'
  },
  headerActions: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    width: '100%',
    position: 'relative',
  },
  syncBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 10px',
    borderRadius: 999,
    background: '#EEF2FF',
    color: '#4338CA',
    fontSize: 12,
    fontWeight: 700,
    marginRight: 8
  },
  headerIconBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 10,
    padding: '8px 12px',
    cursor: 'pointer',
    color: '#2563EB',
    fontWeight: 600,
    fontSize: 14,
    transition: 'background 0.2s',
    minWidth: 0,
    position: 'relative',
  },
  headerIconLabel: {
    fontSize: 14,
    fontWeight: 600,
    display: 'inline-block',
    lineHeight: 1,
    marginLeft: 2,
  },
  mainLayout: { flex: 1, display: 'flex', overflow: 'hidden' },
  sidebar: { width: '260px', background: '#fff', borderRight: '1px solid #E2E8F0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' },
  tab: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: 'none', background: 'transparent', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', color: '#64748B' },
  tabActive: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: 'none', background: '#E8F5E9', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', color: '#2E7D32', fontWeight: 'bold' },
  content: { flex: 1, padding: '20px 18px 28px', overflowY: 'auto' },
  toolsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 14
  },
  filterTabsWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap'
  },
  filterTabBtn: {
    border: '1px solid #CBD5E1',
    background: '#fff',
    color: '#334155',
    borderRadius: 999,
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700
  },
  filterTabBtnActive: {
    border: '1px solid #6366F1',
    background: '#EEF2FF',
    color: '#4338CA'
  },
  searchInput: {
    minWidth: 180,
    maxWidth: 260,
    flex: '1 1 220px',
    border: '1px solid #CBD5E1',
    background: '#fff',
    color: '#0F172A',
    borderRadius: 12,
    padding: '10px 12px',
    fontSize: 13,
    fontWeight: 600,
    outline: 'none'
  },
  cardList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '14px',
    alignItems: 'start',
    justifyItems: 'center',
    width: '100%',
    margin: 0,
    padding: 0,
  },
  settingItem: {
    background: '#fff',
    padding: '10px',
    borderRadius: '16px',
    border: '2px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: 'auto',
    maxWidth: '100%',
    minHeight: 'auto',
    height: 'auto',
    boxSizing: 'border-box',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)',
    transition: 'box-shadow 0.2s, border-color 0.2s',
  },
  emptyStateCard: {
    gridColumn: '1 / -1',
    background: '#fff',
    border: '1px dashed #CBD5E1',
    borderRadius: 16,
    padding: '22px 18px',
    textAlign: 'center'
  },
  itemInfo: { display: 'flex', alignItems: 'center', gap: '20px' },
  itemIcon: { fontSize: '28px' },
  itemLabel: { fontWeight: 'bold', fontSize: '1.1rem' },
  miniAvatar: { width: '45px', height: '45px', borderRadius: '50%', background: '#f5f5f5' },
  itemActions: { display: 'flex', gap: '20px' },
  actionIcon: { cursor: 'pointer', color: '#94A3B8' },
  verticalActionStack: { display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' },
  hoverIcons: { position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8 },
  iconBtn: { background: 'white', border: '1px solid #EEF2FF', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: '#2563EB', fontWeight: 700 },
  compactBtn: { padding: 8, borderRadius: 8, border: '1px solid #E6EEF8', background: 'white', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  compactDelete: { padding: 8, borderRadius: 8, border: '1px solid #ffd6d6', background: 'white', color: '#FF6B6B', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  iconOnlyBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, color: '#2563EB', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  smallIconBtn: { padding: '6px 8px', borderRadius: 8, border: '1px solid #EEF2FF', background: 'white', cursor: 'pointer' },
  saveActionBtn: { padding: '8px 12px', borderRadius: '10px', background: '#2E7D32', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' },
  cancelActionBtn: { padding: '8px 12px', borderRadius: '10px', background: 'transparent', color: '#333', border: '1px solid #E6EEF8', fontWeight: 700, cursor: 'pointer', marginLeft: 8 },
  saveIconBtn: { width: 44, height: 44, padding: 8, borderRadius: 12, background: '#2E7D32', color: 'white', border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  cancelIconBtn: { width: 44, height: 44, padding: 8, borderRadius: 12, background: 'transparent', color: '#333', border: '1px solid #E6EEF8', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: 0 },
  editOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  editModal: { background: 'white', padding: '30px', borderRadius: '24px', width: '450px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  editModalHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' },
  input: { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '20px', fontSize: '14px', boxSizing: 'border-box' },
  saveBtn: { width: '100%', padding: '15px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
  cancelBtn: { padding: '15px', background: '#f0f0f0', color: '#333', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
  deleteConfirmBtn: { padding: '15px', background: '#FF6B6B', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
  modal: { background: 'white', padding: '30px', borderRadius: '24px', width: '450px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', zIndex: 10000 },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4, borderRadius: 8, transition: 'all 0.2s' },
  modalSection: { marginBottom: '20px' },
  modalLabel: { display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' },
  modalInput: { width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '15px', outline: 'none', boxSizing: 'border-box' },
  pointsControl: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' },
  pointsBtn: { width: '48px', height: '48px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', color: '#4CAF50' },
  pointsValue: { fontSize: '24px', fontWeight: 800, minWidth: '60px', textAlign: 'center' },
  typeBadge: { textAlign: 'center', padding: '8px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase' },
  modalFooter: { display: 'flex', gap: '10px', marginTop: '10px' },
  modalSaveBtn: { padding: '12px 20px', borderRadius: '12px', border: 'none', background: '#4CAF50', color: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer', flex: 1 },
  modalCancelBtn: { padding: '12px 20px', borderRadius: '12px', border: 'none', background: '#F1F5F9', color: '#64748B', fontWeight: 600, fontSize: '14px', cursor: 'pointer', flex: 1 },

  // Audio Picker Styles
  audioPickerOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 },
  audioPickerModal: { background: 'white', padding: '30px', borderRadius: '24px', width: '600px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', zIndex: 10001 },
  audioFilterTabs: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  audioFilterTab: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#64748B', transition: 'all 0.2s' },
  audioFilterTabActive: { background: '#4CAF50', color: 'white', borderColor: '#4CAF50', fontWeight: 600 },
  audioList: { display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '400px', overflowY: 'auto', marginBottom: 20, padding: 4 },
  audioItem: { display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' },

  // Delete Confirmation Modal Styles
  confirmOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6000
  },
  confirmModal: {
    background: '#FFFFFF',
    width: '90%',
    maxWidth: '400px',
    borderRadius: '24px',
    padding: '32px 28px',
    textAlign: 'center',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  confirmIconWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: '#FEF2F2',
    marginBottom: '20px'
  },
  confirmTitle: {
    margin: '0 0 12px 0',
    fontSize: '22px',
    fontWeight: 800,
    color: '#1F2937'
  },
  confirmMessage: {
    margin: '0 0 24px 0',
    fontSize: '15px',
    fontWeight: 500,
    color: '#6B7280',
    lineHeight: 1.6
  },
  confirmButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center'
  },
  confirmCancelButton: {
    flex: 1,
    padding: '14px 24px',
    borderRadius: '12px',
    border: '2px solid #E5E7EB',
    background: '#FFFFFF',
    fontSize: '15px',
    fontWeight: 700,
    color: '#374151',
    cursor: 'pointer'
  },
  confirmDeleteButton: {
    flex: 1,
    padding: '14px 24px',
    borderRadius: '12px',
    border: 'none',
    background: '#DC2626',
    fontSize: '15px',
    fontWeight: 700,
    color: '#FFFFFF',
    cursor: 'pointer'
  }
};
