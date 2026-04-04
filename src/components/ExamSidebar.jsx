import { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';

export default function ExamSidebar({ isOpen, onClose, activeClass, onSave }) {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  
  // Form state
  const [examName, setExamName] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mode, setMode] = useState('brief');
  const [sections, setSections] = useState([]);
  const [studentScores, setStudentScores] = useState({});
  const [benchmark, setBenchmark] = useState('');
  const [existingSubjects, setExistingSubjects] = useState([]);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  
  // Load existing subjects from exams
  useEffect(() => {
    if (isOpen && activeClass?.id) {
      loadExistingSubjects();
      initializeStudentScores();
    }
  }, [isOpen, activeClass]);

  const loadExistingSubjects = async () => {
    try {
      const res = await api.pbRequest('/collections/exams/records?perPage=500');
      const classExams = (res.items || []).filter(e => e.class_id === activeClass.id);
      const subjects = [...new Set(classExams.map(e => e.subject))];
      setExistingSubjects(subjects);
    } catch (error) {
      console.error('Failed to load existing subjects:', error);
    }
  };

  const initializeStudentScores = () => {
    if (activeClass?.students) {
      const initialScores = {};
      activeClass.students.forEach(student => {
        initialScores[student.id] = {
          totalScore: '',
          maxScore: '',
          sections: {}
        };
      });
      setStudentScores(initialScores);
    }
  };

  const handleSubjectChange = (value) => {
    setSubject(value);
    setShowSubjectDropdown(false);
    
    // Auto-load sections if they exist for this subject
    loadSectionsForSubject(value);
  };

  const loadSectionsForSubject = async (subjectName) => {
    try {
      const res = await api.pbRequest('/collections/exams/records?perPage=500');
      const classExams = (res.items || []).filter(
        e => e.class_id === activeClass.id && e.subject === subjectName && e.mode === 'detailed'
      );
      
      if (classExams.length > 0 && classExams[0].sections) {
        setSections(classExams[0].sections);
      }
    } catch (error) {
      console.error('Failed to load sections:', error);
    }
  };

  const addSection = () => {
    setSections([...sections, { name: '', maxScore: '' }]);
  };

  const updateSection = (index, field, value) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const removeSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleStudentScoreChange = (studentId, field, value) => {
    setStudentScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSectionScoreChange = (studentId, sectionName, value) => {
    setStudentScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        sections: {
          ...prev[studentId].sections,
          [sectionName]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    if (!examName.trim() || !subject.trim() || !date) {
      alert('Please fill in exam name, subject, and date.');
      return;
    }

    // Validate benchmark
    if (!benchmark || Number(benchmark) <= 0) {
      alert('Please enter a benchmark score.');
      return;
    }

    // Validate scores
    for (const student of activeClass.students) {
      const score = studentScores[student.id];
      if (mode === 'brief' && (!score.totalScore || Number(score.totalScore) === 0)) {
        alert(`Please enter score for ${student.name}`);
        return;
      }
      if (mode === 'detailed' && sections.length > 0) {
        let hasScore = false;
        sections.forEach(section => {
          if (score.sections?.[section.name] && Number(score.sections[section.name]) > 0) {
            hasScore = true;
          }
        });
        if (!hasScore) {
          alert(`Please enter scores for ${student.name}`);
          return;
        }
      }
    }

    // Calculate percentages based on benchmark
    const scores = {};
    const benchmarkValue = Number(benchmark);
    for (const student of activeClass.students) {
      const score = studentScores[student.id];
      const totalScore = mode === 'detailed' && sections.length > 0
        ? sections.reduce((sum, section) => sum + (Number(score.sections?.[section.name]) || 0), 0)
        : Number(score.totalScore);
      scores[student.id] = {
        total_score: totalScore,
        benchmark: benchmarkValue,
        percentage: benchmarkValue > 0 ? Math.round((totalScore / benchmarkValue) * 100) : 0,
        sections: mode === 'detailed' ? score.sections : undefined
      };
    }

    // Build sections object for detailed mode
    const sectionsObj = {};
    if (mode === 'detailed') {
      sections.forEach(section => {
        if (section.name && section.maxScore) {
          sectionsObj[section.name] = Number(section.maxScore);
        }
      });
    }

    // Get current user ID from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('classABC_logged_in') || '{}');
    const userId = loggedInUser.id || '';

    const examData = {
      class_id: activeClass.id,
      exam_name: examName,
      subject: subject,
      exam_date: date,
      mode: mode,
      sections: mode === 'detailed' ? sectionsObj : undefined,
      scores: scores,
      created_by: userId
    };

    try {
      await api.pbRequest('/collections/exams/records', {
        method: 'POST',
        body: JSON.stringify(examData)
      });

      onSave();
      handleClose();
    } catch (error) {
      console.error('Failed to save exam:', error);
      alert('Failed to save exam. Please try again.');
    }
  };

  const handleClose = () => {
    setExamName('');
    setSubject('');
    setDate(new Date().toISOString().split('T')[0]);
    setMode('brief');
    setSections([]);
    setStudentScores({});
    setBenchmark('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          onClick: handleClose
        }}
      />
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: isMobile ? '100%' : '450px',
        height: '100vh',
        background: '#fff',
        zIndex: 10000,
        boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s ease'
      }}>
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .exam-sidebar input, .exam-sidebar select {
            transition: all 0.2s ease;
          }
          .exam-sidebar input:focus, .exam-sidebar select:focus {
            outline: none;
            border-color: #4CAF50;
            box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
          }
          .student-row:hover {
            background: #f8f9fa;
          }
        `}</style>

        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
        }}>
          <div>
            <h2 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
              Add Exam Scores
            </h2>
            <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.9)', fontSize: '13px' }}>
              Enter exam details and student scores
            </p>
          </div>
          <button 
            onClick={handleClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px' }} className="exam-sidebar">
          {/* Exam Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: 'bold', 
              color: '#555', 
              marginBottom: '8px' 
            }}>
              Exam Name *
            </label>
            <input
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="e.g., Midterm Exam, Quiz 1"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Subject */}
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: 'bold', 
              color: '#555', 
              marginBottom: '8px' 
            }}>
              Subject *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setShowSubjectDropdown(true);
                }}
                onFocus={() => setShowSubjectDropdown(true)}
                placeholder="e.g., Math, English, Science"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  paddingRight: '40px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              <button
                onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#888'
                }}
              >
                {showSubjectDropdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              {/* Autocomplete Dropdown */}
              {showSubjectDropdown && existingSubjects.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#fff',
                  border: '2px solid #e0e0e0',
                  borderTop: 'none',
                  borderRadius: '0 0 10px 10px',
                  maxHeight: '200px',
                  overflow: 'auto',
                  zIndex: 10
                }}>
                  {existingSubjects
                    .filter(s => s.toLowerCase().includes(subject.toLowerCase()))
                    .map((sub, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSubjectChange(sub)}
                        style={{
                          padding: '10px 14px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f0f0f0'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                        onMouseLeave={(e) => e.target.style.background = '#fff'}
                      >
                        {sub}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Date */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: 'bold', 
              color: '#555', 
              marginBottom: '8px' 
            }}>
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Mode */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: 'bold', 
              color: '#555', 
              marginBottom: '8px' 
            }}>
              Scoring Mode
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setMode('brief')}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: mode === 'brief' ? '2px solid #4CAF50' : '2px solid #e0e0e0',
                  borderRadius: '8px',
                  background: mode === 'brief' ? '#E8F5E9' : '#fff',
                  color: mode === 'brief' ? '#2E7D32' : '#666',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Brief
              </button>
              <button
                onClick={() => setMode('detailed')}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: mode === 'detailed' ? '2px solid #4CAF50' : '2px solid #e0e0e0',
                  borderRadius: '8px',
                  background: mode === 'detailed' ? '#E8F5E9' : '#fff',
                  color: mode === 'detailed' ? '#2E7D32' : '#666',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Detailed
              </button>
            </div>
            <p style={{ 
              fontSize: '12px', 
              color: '#888', 
              marginTop: '6px',
              lineHeight: 1.4 
            }}>
              {mode === 'brief' 
                ? 'Enter total score only for each student' 
                : 'Break down scores by sections (e.g., Reading, Writing)'}
            </p>
          </div>

          {/* Sections (only for detailed mode) */}
          {mode === 'detailed' && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '12px' 
              }}>
                <label style={{ 
                  fontSize: '13px', 
                  fontWeight: 'bold', 
                  color: '#555' 
                }}>
                  Sections *
                </label>
                <button
                  onClick={addSection}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    background: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#45a049'}
                  onMouseLeave={(e) => e.target.style.background = '#4CAF50'}
                >
                  <Plus size={14} /> Add Section
                </button>
              </div>
              
              {sections.map((section, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  marginBottom: '10px',
                  alignItems: 'center'
                }}>
                  <input
                    type="text"
                    value={section.name}
                    onChange={(e) => updateSection(index, 'name', e.target.value)}
                    placeholder="example: Reading, Writing, Speaking, Listening, Grammar, Vocabulary"
                    style={{
                      flex: 2,
                      padding: '10px 12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <input
                    type="number"
                    value={section.maxScore}
                    onChange={(e) => updateSection(index, 'maxScore', e.target.value)}
                    placeholder="High score"
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    onClick={() => removeSection(index)}
                    style={{
                      padding: '8px',
                      background: '#ffebee',
                      color: '#d32f2f',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#ffcdd2'}
                    onMouseLeave={(e) => e.target.style.background = '#ffebee'}
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}

              {sections.length === 0 && (
                <div style={{
                  padding: '20px',
                  textAlign: 'center',
                  background: '#f5f5f5',
                  borderRadius: '8px',
                  border: '2px dashed #ddd',
                  color: '#888',
                  fontSize: '13px'
                }}>
                  No sections added yet. Click "Add Section" to create one.
                </div>
              )}
            </div>
          )}

          {/* Student Scores */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: '2px solid #e0e0e0'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#555',
                margin: 0
              }}>
                Student Scores *
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#888', fontWeight: 'normal' }}>
                  Benchmark:
                </span>
                <input
                  type="number"
                  value={benchmark || ''}
                  onChange={(e) => setBenchmark(e.target.value)}
                  placeholder="Benchmark"
                  style={{
                    width: '80px',
                    padding: '6px 10px',
                    border: '2px solid #4CAF50',
                    borderRadius: '6px',
                    fontSize: '12px',
                    boxSizing: 'border-box',
                    background: '#E8F5E9'
                  }}
                />
              </div>
            </div>

            {activeClass?.students?.map((student) => (
              <div key={student.id} style={{
                padding: '10px 14px',
                marginBottom: '8px',
                background: '#fafafa',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }} className="student-row">
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#333',
                  flex: '0 0 auto'
                }}>
                  {student.name}
                </div>

                {/* Brief mode: total score only */}
                {mode === 'brief' && (
                  <input
                    type="number"
                    value={studentScores[student.id]?.totalScore || ''}
                    onChange={(e) => handleStudentScoreChange(student.id, 'totalScore', e.target.value)}
                    placeholder="Score"
                    style={{
                      width: '100px',
                      padding: '8px 12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      flex: '0 0 auto'
                    }}
                  />
                )}

                {/* Detailed mode: sections inline */}
                {mode === 'detailed' && sections.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                    {sections.map((section) => (
                      <input
                        key={section.name}
                        type="number"
                        value={studentScores[student.id]?.sections?.[section.name] || ''}
                        onChange={(e) => handleSectionScoreChange(student.id, section.name, e.target.value)}
                        placeholder={section.name}
                        max={section.maxScore}
                        style={{
                          width: '90px',
                          padding: '6px 10px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '6px',
                          fontSize: '12px',
                          boxSizing: 'border-box'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          gap: '12px',
          background: '#fafafa'
        }}>
          <button
            onClick={handleClose}
            style={{
              flex: 1,
              padding: '12px',
              border: '2px solid #e0e0e0',
              background: '#fff',
              color: '#666',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
            onMouseLeave={(e) => e.target.style.background = '#fff'}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: '#4CAF50',
              color: '#fff',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#45a049'}
            onMouseLeave={(e) => e.target.style.background = '#4CAF50'}
          >
            <Check size={18} /> Save Exam
          </button>
        </div>
      </div>
    </>
  );
}
