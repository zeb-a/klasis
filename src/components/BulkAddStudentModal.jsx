import { memo, useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Users, Sparkles, Check } from 'lucide-react';
import { AVATAR_SETS, getAvatarFromSet, generateAvatarSetList } from '../utils/bulkAvatarSets';
import SafeAvatar from './SafeAvatar';
import { detectGender } from '../utils/gender';
import { useToast } from './Toast';

const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
};

const StudentRow = memo(function StudentRow({
  student,
  idx,
  activeTab,
  selectedAvatarSet,
  avatarList,
  displayAvatar,
  onCycleAvatar,
  onPhotoUpload,
  onNameChange,
  onRemove
}) {
  return (
    <div style={styles.studentItem}>
      <div style={styles.studentAvatarSection}>
        <div
          style={styles.studentAvatarWrapper}
          onClick={() => {
            if (!student.customPhoto && activeTab === 'avatar-sets' && selectedAvatarSet) {
              const currentIdx = student.avatarIndex ?? idx;
              const nextIdx = (currentIdx + 1) % Math.max(avatarList.length, 1);
              onCycleAvatar(student.id, avatarList[nextIdx]);
            }
          }}
        >
          <SafeAvatar
            src={displayAvatar}
            name={student.name}
            alt={student.name}
            style={styles.studentAvatar}
          />
          {!student.customPhoto && activeTab === 'avatar-sets' && (
            <div style={styles.avatarHint}>Tap to change</div>
          )}
        </div>
        <button
          style={styles.uploadSmallBtn}
          onClick={() => onPhotoUpload(student.id)}
          title={student.customPhoto ? 'Change photo' : 'Upload photo'}
        >
          <Upload size={14} />
        </button>
      </div>

      <div style={styles.studentInputSection}>
        <input
          type="text"
          placeholder="Student name"
          value={student.name}
          onChange={(e) => onNameChange(student.id, e.target.value)}
          style={styles.studentInput}
        />
      </div>

      <button
        style={styles.removeStudentBtn}
        onClick={() => onRemove(student.id)}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
});

export default function BulkAddStudentModal({ onClose, onSave }) {
  const { addToast } = useToast();

  // Avatar set selection
  const [selectedAvatarSet, setSelectedAvatarSet] = useState(AVATAR_SETS[0]?.id);

  // Students data
  const [students, setStudents] = useState([]);

  // UI state - Tab navigation instead of steps
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'avatar-sets'
  const [showAddSlotMenu, setShowAddSlotMenu] = useState(false); // Show slot count menu
  const [slotsToAdd, setSlotsToAdd] = useState(1); // Number of slots to add
  const [isDropActive, setIsDropActive] = useState(false);

  const fileInputRef = useRef(null);
  const addSlotMenuRef = useRef(null);

  const avatarList = useMemo(() => {
    try {
      const avatarSet = AVATAR_SETS.find(set => set.id === selectedAvatarSet);
      return generateAvatarSetList(selectedAvatarSet, avatarSet?.count || 30) || [];
    } catch (error) {
      console.error('Error generating avatar list:', error);
      return [];
    }
  }, [selectedAvatarSet]);

  // Close add slot menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (addSlotMenuRef.current && !addSlotMenuRef.current.contains(e.target)) {
        setShowAddSlotMenu(false);
      }
    };
    if (showAddSlotMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showAddSlotMenu]);

  // Add empty student slot with auto-assigned avatar based on random gender
  const addStudentSlot = useCallback((count = 1) => {
    const newStudents = [];

    for (let i = 0; i < count; i++) {
      // For upload tab, no avatar set selected initially
      // For avatar-sets tab, use selected set
      let avatarUrl, avatarIndex;

      if (activeTab === 'avatar-sets' && selectedAvatarSet && avatarList.length > 0) {
        // Use a random seed for consistent avatar generation
        const randomSeed = `slot-${Date.now()}-${Math.random()}-${i}`;
        avatarIndex = Math.abs(hashCode(randomSeed)) % avatarList.length;
        avatarUrl = getAvatarFromSet(selectedAvatarSet, avatarIndex);
      }

      const randomGender = Math.random() > 0.5 ? 'boy' : 'girl';

      newStudents.push({
        id: `temp-${Date.now()}-${Math.random()}-${i}`,
        name: '',
        gender: randomGender,
        avatar: avatarUrl || null,
        avatarIndex: avatarIndex || null,
        avatarSetId: selectedAvatarSet || null,
        customPhoto: null
      });
    }

    setStudents((prev) => [...prev, ...newStudents]);
    setShowAddSlotMenu(false);
  }, [activeTab, avatarList.length, selectedAvatarSet]);

  // Handle add slot with custom count
  const handleAddSlots = () => {
    if (slotsToAdd >= 1 && slotsToAdd <= 50) {
      addStudentSlot(slotsToAdd);
    }
  };

  // Remove student
  const removeStudent = useCallback((studentId) => {
    setStudents((prev) => prev.filter(s => s.id !== studentId));
  }, []);

  // Update student name
  const updateStudentName = useCallback((studentId, name) => {
    setStudents((prev) => prev.map(s => {
      if (s.id === studentId) {
        const detectedGender = name.trim() ? detectGender(name) : s.gender;
        return { ...s, name, gender: detectedGender };
      }
      return s;
    }));
  }, []);

  // Update student avatar
  const updateStudentAvatar = useCallback((studentId, avatarData) => {
    if (!avatarData) return;
    setStudents((prev) => prev.map(s => 
      s.id === studentId 
        ? { ...s, avatar: avatarData.url, avatarIndex: avatarData.index, avatarSetId: selectedAvatarSet, customPhoto: null }
        : s
    ));
  }, [selectedAvatarSet]);

  // Handle file upload for a specific student
  const handlePhotoUpload = useCallback((studentId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      addToast('Image too large. Max 2MB.', 'error');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setStudents((prev) => prev.map(s => 
        s.id === studentId 
          ? { ...s, customPhoto: reader.result, avatar: null, avatarIndex: null }
          : s
      ));
    };
    reader.readAsDataURL(file);
  }, [addToast]);

  // Handle drag and drop for multiple photos
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropActive(false);

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));

    if (files.length === 0) return;

    processFiles(files);
  }, [processFiles]);

  // Handle file input selection
  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));

    if (files.length === 0) return;

    processFiles(files);
    e.target.value = '';
  }, [processFiles]);

  // Process files and create student entries
  async function processFiles(files) {
    const validFiles = files.filter((file) => {
      if (file.size > 2 * 1024 * 1024) {
        addToast(`Skipping ${file.name} - too large`, 'warning');
        return false;
      }
      return true;
    });

    const readAsDataUrl = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const compressImage = async (dataUrl, maxWidth = 300) => (
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
      })
    );

    const createdStudents = await Promise.all(validFiles.map(async (file, idx) => {
      try {
        const dataUrl = await readAsDataUrl(file);
        // Extract name from filename
        const filename = file.name;
        // Remove file extension
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
        // Remove common patterns like numbers, underscores, hyphens
        let extractedName = nameWithoutExt
          .replace(/[-_]/g, ' ')  // Replace underscores/hyphens with spaces
          .replace(/\d+/g, '')     // Remove numbers
          .replace(/\s+/g, ' ')   // Collapse multiple spaces
          .trim();

        // Capitalize first letter of each word
        if (extractedName) {
          extractedName = extractedName.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        }

        // Fallback to default if extraction failed
        const displayName = extractedName || `Student ${Date.now()}-${idx + 1}`;
        let photo = dataUrl;
        if (photo.length > 200 * 1024) {
          photo = await compressImage(photo);
        }
        return {
          id: `temp-${Date.now()}-${Math.random()}-${idx}`,
          name: displayName,
          gender: 'boy',
          avatar: null,
          avatarIndex: null,
          customPhoto: photo
        };
      } catch (err) {
        console.warn('Failed to process image:', file.name, err);
        return null;
      }
    }));

    const finalized = createdStudents.filter(Boolean);
    if (finalized.length > 0) {
      setStudents((prev) => [...prev, ...finalized]);
      addToast(`Added ${finalized.length} photo${finalized.length > 1 ? 's' : ''}`, 'success');
    }
  }

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropActive(false);
  }, []);

  // Save all students
  const handleSave = () => {
    const validStudents = students.filter(s => s.name.trim());

    if (validStudents.length === 0) {
      addToast('Please add at least one student with a name', 'error');
      return;
    }

    const studentsToSave = validStudents.map(s => ({
      name: s.name,
      gender: s.gender,
      avatar: s.customPhoto || s.avatar,
      avatarSetId: s.customPhoto ? null : (s.avatarSetId || selectedAvatarSet),
      avatarIndex: s.customPhoto ? null : s.avatarIndex
    }));

    onSave(studentsToSave);
    addToast(`${studentsToSave.length} student(s) added!`, 'success');
    onClose();
  };

  // Get student display avatar
  const getStudentAvatar = useCallback((student) => {
    if (student.customPhoto) return student.customPhoto;
    if (student.avatar) return student.avatar;
    // Generate avatar from selected set based on student name
    if (student.name && selectedAvatarSet && avatarList.length > 0) {
      const seed = `${student.name}-${student.gender}`;
      const index = Math.abs(hashCode(seed)) % avatarList.length;
      return avatarList[index]?.url || getAvatarFromSet(selectedAvatarSet, 0);
    }
    return null;
  }, [avatarList, selectedAvatarSet]);

  const displayAvatarByStudentId = useMemo(() => {
    const map = new Map();
    students.forEach((student) => {
      map.set(student.id, getStudentAvatar(student));
    });
    return map;
  }, [students, getStudentAvatar]);

  // Generate sample avatars for hover preview (only 6 avatars)
  const getSampleAvatars = useCallback((setId) => {
    const avatarSet = AVATAR_SETS.find(set => set.id === setId);
    if (!avatarSet) return [];
    const sampleCount = Math.min(6, avatarSet.count || 6);
    return generateAvatarSetList(setId, sampleCount);
  }, []);

  const canSave = students.some(s => s.name.trim());
  const studentCount = students.filter(s => s.name.trim()).length;
  const sampleAvatarsBySet = useMemo(() => {
    const map = new Map();
    AVATAR_SETS.forEach((set) => map.set(set.id, getSampleAvatars(set.id)));
    return map;
  }, [getSampleAvatars]);

  const applyAvatarSetToStudents = useCallback((setId) => {
    if (!setId) return;
    setSelectedAvatarSet(setId);
    const selectedSet = AVATAR_SETS.find((set) => set.id === setId);
    const nextAvatars = generateAvatarSetList(setId, selectedSet?.count || 30) || [];
    if (!nextAvatars.length) return;
    setStudents((prev) => prev.map((student, idx) => {
      if (student.customPhoto) return student;
      const seed = `${student.name || student.id}-${student.gender || 'boy'}-${idx}`;
      const nextIndex = Math.abs(hashCode(seed)) % nextAvatars.length;
      return {
        ...student,
        avatar: nextAvatars[nextIndex]?.url || null,
        avatarIndex: nextIndex,
        avatarSetId: setId
      };
    }));
    if (students.length > 0) {
      addToast(`Applied ${selectedSet?.name || 'avatar set'} to current students`, 'success');
    }
  }, [addToast, students.length]);

  const pickStudentPhoto = useCallback((studentId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handlePhotoUpload(studentId, e);
    input.click();
  }, [handlePhotoUpload]);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <Users size={24} style={{ color: '#4CAF50', marginRight: 10 }} />
            <h3 style={styles.title}>Add Students</h3>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'upload' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('upload')}
          >
            <Upload size={18} style={{ marginRight: 8 }} />
            Upload
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'avatar-sets' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('avatar-sets')}
          >
            <Sparkles size={18} style={{ marginRight: 8 }} />
            Avatar Sets
          </button>
        </div>

        {/* Tab Content */}
        <div style={styles.content}>
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div style={styles.tabContent}>
              {/* Drag & Drop Zone */}
              <div
                style={{
                  ...styles.dropZone,
                  ...(isDropActive ? styles.dropZoneActive : {})
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={48} style={{ color: '#6366F1', marginBottom: 16 }} />
                <div style={styles.dropZoneTitle}>Drag & Drop Student Photos Here</div>
                <div style={styles.dropZoneSubtitle}>or click to browse</div>
                <div style={styles.dropZoneHint}>Supports multiple files • Max 2MB each</div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
              </div>

              {/* Student Slots */}
              {students.length > 0 && (
                <div style={styles.studentSlotsContainer}>
                  <div style={styles.studentSlotsHeader}>
                    <Users size={18} style={{ marginRight: 8, color: '#64748B' }} />
                    <span style={styles.studentSlotsLabel}>Students ({studentCount})</span>
                  </div>
                  <div style={styles.studentsList}>
                    {students.map((student, idx) => (
                      <StudentRow
                        key={student.id}
                        student={student}
                        idx={idx}
                        activeTab={activeTab}
                        selectedAvatarSet={selectedAvatarSet}
                        avatarList={avatarList}
                        displayAvatar={displayAvatarByStudentId.get(student.id)}
                        onCycleAvatar={updateStudentAvatar}
                        onPhotoUpload={pickStudentPhoto}
                        onNameChange={updateStudentName}
                        onRemove={removeStudent}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Avatar Sets Tab */}
          {activeTab === 'avatar-sets' && (
            <div style={styles.tabContent}>
              <div style={styles.avatarSetsHeader}>
                <div style={styles.sectionTitle}>
                  <Sparkles size={20} style={{ marginRight: 8 }} />
                  Choose an Avatar Set
                </div>
                {selectedAvatarSet && (
                  <div style={styles.selectedSetInfo}>
                    Selected: <strong>{AVATAR_SETS.find(s => s.id === selectedAvatarSet)?.name}</strong>
                  </div>
                )}
              </div>
              <div style={styles.avatarOnboardingTip}>
                Pick a set to auto-apply avatars to students without custom photos. Then tap a student avatar to cycle variants.
              </div>

              <div style={styles.avatarSetsGrid}>
                {AVATAR_SETS.map(set => (
                  <div
                    key={set.id}
                    style={{ position: 'relative' }}
                  >
                    <button
                      data-avatar-set-card
                      onClick={() => applyAvatarSetToStudents(set.id)}
                      style={{
                        ...styles.avatarSetCard,
                        ...(selectedAvatarSet === set.id ? styles.avatarSetCardSelected : {})
                      }}
                    >
                      <div style={styles.avatarSetIcon}>{set.icon}</div>
                      <div style={styles.avatarSetName}>{set.name}</div>
                      <div style={styles.avatarSetDesc}>{set.description}</div>
                      <div style={styles.avatarSetPreviewRow}>
                        {(sampleAvatarsBySet.get(set.id) || []).slice(0, 4).map((avatar, idx) => (
                          <img
                            key={`${set.id}-${idx}`}
                            src={avatar.url}
                            alt={`${set.name} preview ${idx + 1}`}
                            style={styles.avatarSetPreviewThumb}
                          />
                        ))}
                      </div>
                      <div style={styles.avatarSetSelectHint}>
                        {selectedAvatarSet === set.id ? 'Selected' : 'Click to use this set'}
                      </div>
                      {selectedAvatarSet === set.id && (
                        <div style={styles.selectedBadge}>
                          <Check size={16} />
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Student Slots - only show if there are students */}
              {students.length > 0 && (
                <div style={styles.studentSlotsContainer}>
                  <div style={styles.studentSlotsHeader}>
                    <Users size={18} style={{ marginRight: 8, color: '#64748B' }} />
                    <span style={styles.studentSlotsLabel}>Students ({studentCount})</span>
                  </div>
                  <div style={styles.studentsList}>
                    {students.map((student, idx) => (
                      <StudentRow
                        key={student.id}
                        student={student}
                        idx={idx}
                        activeTab={activeTab}
                        selectedAvatarSet={selectedAvatarSet}
                        avatarList={avatarList}
                        displayAvatar={displayAvatarByStudentId.get(student.id)}
                        onCycleAvatar={updateStudentAvatar}
                        onPhotoUpload={pickStudentPhoto}
                        onNameChange={updateStudentName}
                        onRemove={removeStudent}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom Actions - shown under all tabs */}
          <div style={styles.bottomActions}>
            <div style={styles.addSlotContainer} ref={addSlotMenuRef}>
              <button
                style={styles.addEmptySlotBtn}
                onClick={() => setShowAddSlotMenu(!showAddSlotMenu)}
              >
                <Plus size={16} style={{ marginRight: 8 }} />
                Add Empty Slot
              </button>
              {showAddSlotMenu && (
                <div style={styles.addSlotMenu}>
                  <div style={styles.addSlotMenuHeader}>
                    <span style={styles.addSlotMenuTitle}>How many slots?</span>
                  </div>
                  <div style={styles.addSlotMenuContent}>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={slotsToAdd}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(50, parseInt(e.target.value) || 1));
                        setSlotsToAdd(val);
                      }}
                      style={styles.addSlotMenuInput}
                    />
                    <button
                      style={styles.addSlotMenuButton}
                      onClick={handleAddSlots}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div style={styles.addSlotMenuFooter}>
                    {[1, 2, 3, 5, 10].map(num => (
                      <button
                        key={num}
                        style={styles.quickAddButton}
                        onClick={() => setSlotsToAdd(num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              style={{
                ...styles.saveBtn,
                ...styles.actionButton,
                opacity: canSave ? 1 : 0.5
              }}
              onClick={handleSave}
              disabled={!canSave}
            >
              <Users size={18} style={{ marginRight: 8 }} />
              Add {studentCount} Student{studentCount !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  },
  modal: {
    background: 'white',
    borderRadius: '24px',
    width: '90%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflow: 'visible',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    position: 'relative'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 28px',
    borderBottom: '1px solid #E2E8F0'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 700,
    color: '#1E293B'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#94A3B8',
    padding: '8px',
    borderRadius: '8px',
    transition: 'all 0.2s'
  },
  // Tabs
  tabs: {
    display: 'flex',
    padding: '0 28px',
    gap: '8px',
    borderBottom: '1px solid #E2E8F0'
  },
  tab: {
    flex: 1,
    padding: '16px 20px',
    borderRadius: '12px 12px 0 0',
    border: 'none',
    background: 'transparent',
    color: '#64748B',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    borderBottom: '3px solid transparent'
  },
  tabActive: {
    color: '#4CAF50',
    borderBottom: '3px solid #4CAF50',
    background: '#F0FDF4'
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '20px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  tabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: 600,
    color: '#1E293B'
  },
  avatarSetsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  selectedSetInfo: {
    fontSize: '14px',
    color: '#4CAF50',
    background: '#F0FDF4',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: 500
  },
  avatarOnboardingTip: {
    fontSize: '12px',
    color: '#334155',
    background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(16,185,129,0.12))',
    border: '1px solid rgba(99,102,241,0.22)',
    borderRadius: 12,
    padding: '10px 12px',
    marginBottom: 8,
    lineHeight: 1.4,
    fontWeight: 600
  },
  avatarSetsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '16px'
  },
  avatarSetCard: {
    position: 'relative',
    padding: '20px',
    borderRadius: '16px',
    border: '2px solid #E2E8F0',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  avatarSetCardSelected: {
    borderColor: '#4CAF50',
    background: '#F0FDF4',
    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)'
  },
  avatarSetIcon: {
    fontSize: '40px'
  },
  avatarSetName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1E293B'
  },
  avatarSetDesc: {
    fontSize: '12px',
    color: '#64748B',
    textAlign: 'center'
  },
  avatarSetPreviewRow: {
    marginTop: 6,
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 6,
    width: '100%'
  },
  avatarSetPreviewThumb: {
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: 8,
    border: '1px solid rgba(15,23,42,0.08)',
    objectFit: 'cover',
    background: '#F8FAFC'
  },
  avatarSetSelectHint: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: 700,
    color: '#475569',
    background: 'rgba(99,102,241,0.08)',
    borderRadius: 999,
    padding: '4px 10px'
  },
  selectedBadge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: '#4CAF50',
    color: 'white',
    borderRadius: '50%',
    padding: '4px'
  },
  // Students Step
  studentsStep: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  dropZone: {
    border: '2px dashed #6366F1',
    borderRadius: '16px',
    padding: '48px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: '#F8FAFC'
  },
  dropZoneActive: {
    borderColor: '#4CAF50',
    background: '#E8F5E9'
  },
  dropZoneTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1E293B',
    marginBottom: '4px'
  },
  dropZoneSubtitle: {
    fontSize: '14px',
    color: '#64748B',
    marginBottom: '8px'
  },
  dropZoneHint: {
    fontSize: '12px',
    color: '#94A3B8'
  },
  quickActions: {
    display: 'flex',
    gap: '12px'
  },
  studentSlotsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  studentSlotsHeader: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '15px',
    fontWeight: 600,
    color: '#64748B'
  },
  studentSlotsLabel: {
    color: '#64748B'
  },
  studentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '300px',
    overflow: 'auto'
  },
  studentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    background: '#F8FAFC',
    borderRadius: '12px',
    border: '1px solid #E2E8F0'
  },
  studentAvatarSection: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  studentAvatarWrapper: {
    position: 'relative',
    cursor: 'pointer'
  },
  studentAvatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  avatarHint: {
    position: 'absolute',
    bottom: '-4px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    fontSize: '9px',
    padding: '2px 6px',
    borderRadius: '4px',
    whiteSpace: 'nowrap'
  },
  uploadSmallBtn: {
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    background: 'white',
    cursor: 'pointer',
    color: '#64748B',
    transition: 'all 0.2s'
  },
  studentInputSection: {
    flex: 1
  },
  studentInput: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  removeStudentBtn: {
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    background: '#FEF2F2',
    color: '#EF4444',
    cursor: 'pointer',
    transition: 'all 0.2s',
    flexShrink: 0
  },
  // Preview Step
  previewStep: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  previewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '16px',
    padding: '20px',
    background: '#F8FAFC',
    borderRadius: '16px'
  },
  previewCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s'
  },
  previewCardInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  previewCardAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  previewCardName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1E293B',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%'
  },
  previewInfo: {
    display: 'flex',
    gap: '32px',
    padding: '20px',
    background: '#F0FDF4',
    borderRadius: '12px',
    justifyContent: 'center'
  },
  previewStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#4CAF50'
  },
  statLabel: {
    fontSize: '12px',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  // Bottom Actions
  bottomActions: {
    display: 'flex',
    gap: '12px',
    padding: '20px 28px',
    borderTop: '1px solid #E2E8F0',
    background: '#F8FAFC',
    borderRadius: '0 0 24px 24px',
    position: 'relative',
    zIndex: 10
  },
  addSlotContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
    position: 'relative'
  },
  addEmptySlotBtn: {
    padding: '16px 24px',
    borderRadius: '12px',
    border: '2px solid #E2E8F0',
    background: 'white',
    color: '#64748B',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  addSlotMenu: {
    position: 'absolute',
    bottom: 'calc(100% + 8px)',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    padding: '16px',
    zIndex: 10000,
    minWidth: '200px',
    animation: 'fadeInTop 0.2s ease'
  },
  addSlotMenuHeader: {
    marginBottom: '12px'
  },
  addSlotMenuTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1E293B'
  },
  addSlotMenuContent: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px'
  },
  addSlotMenuInput: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '10px',
    border: '2px solid #E2E8F0',
    fontSize: '16px',
    fontWeight: 600,
    color: '#1E293B',
    outline: 'none',
    textAlign: 'center'
  },
  addSlotMenuButton: {
    padding: '10px 16px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  addSlotMenuFooter: {
    display: 'flex',
    gap: '6px',
    justifyContent: 'center'
  },
  quickAddButton: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    background: '#F8FAFC',
    color: '#64748B',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  actionButton: {
    flex: 1,
    padding: '16px 24px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    border: 'none'
  },
  saveBtn: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    color: 'white'
  }
};

// Add keyframes to document head
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateX(-50%) translateY(8px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  @keyframes fadeInTop {
    from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;
if (!document.querySelector('style[data-bulk-add-student-anim]')) {
  styleTag.setAttribute('data-bulk-add-student-anim', 'true');
  document.head.appendChild(styleTag);
}

