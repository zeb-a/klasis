
import { useTranslation } from '@/i18n';

const OPTIONS = ['A', 'B', 'C', 'D'];

const QuizSetup = ({
  quizConfig,
  setQuizConfig,
  selectedClass,
  onBack,
  onGameStart,
  selectedStudents,
  setSelectedStudents,
  playerSelectionError,
  setPlayerSelectionError,
  invalidQuestions,
  setInvalidQuestions
}) => {
  const { t } = useTranslation();

  const addQuizQuestion = () => {
    setQuizConfig(prev => ({
      ...prev,
      questions: [...prev.questions, { id: Date.now(), question: '', image: null, options: ['', ''], correct: 0 }]
    }));
  };

  const addQuizOption = (questionId) => {
    setQuizConfig(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id !== questionId) return q;
        const currentOptions = q.options || [];
        if (currentOptions.length >= 4) return q;
        return { ...q, options: [...currentOptions, ''] };
      })
    }));
  };

  const updateQuizQuestion = (id, updates) => {
    setQuizConfig(prev => ({
      ...prev,
      questions: prev.questions.map(q => q.id === id ? { ...q, ...updates } : q)
    }));
  };

  const removeQuizQuestion = (id) => {
    setQuizConfig(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  const clearQuestionError = (questionId, errorType) => {
    setInvalidQuestions(prev => {
      const questionErrors = prev[questionId] || {};
      if (errorType) {
        delete questionErrors[errorType];
      }
      if (Object.keys(questionErrors).length === 0) {
        delete prev[questionId];
      }
      return { ...prev };
    });
  };

  const clearPlayerError = () => {
    setPlayerSelectionError(false);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '720px',
      padding: '28px',
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(20px)',
      borderRadius: '28px',
      border: '4px solid #0EA5E9',
      boxShadow: '0 24px 56px rgba(14, 165, 233, 0.25), 0 0 0 1px rgba(14, 165, 233, 0.08)',
      marginTop: '44px',
      marginBottom: '44px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={onBack}
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 3px 12px rgba(255, 107, 107, 0.3)'
          }}
        >
          ← {t('games.back')}
        </button>
        <div style={{ textAlign: 'center', flex: 1, minWidth: '160px' }}>
          <div style={{
            fontSize: '20px',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            fontFamily: 'Comic Sans MS, cursive, sans-serif'
          }}>
            🎯 {t('games.quiz_config')}
          </div>
          {selectedClass && (
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>{t('games.select_class')}: {selectedClass.name}</div>
          )}
        </div>
        <div style={{ width: '80px' }} />
      </div>

      {/* Questions count & add */}
      <div style={{ marginBottom: '18px', padding: '14px 18px', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', borderRadius: '16px', border: '2px solid #0EA5E940' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#0C4A6E' }}>
            📝 {t('games.questions_count').replace('{count}', quizConfig.questions.length)}
          </span>
          <button
            onClick={addQuizQuestion}
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: '700',
              border: '2px solid #0EA5E9',
              borderRadius: '12px',
              background: '#fff',
              color: '#0EA5E9',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            + {t('games.add_question')}
          </button>
        </div>
      </div>

      {/* Question list - scrollable */}
      <div style={{ maxHeight: '42vh', overflowY: 'auto', marginBottom: '18px', paddingRight: '6px' }}>
        {quizConfig.questions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px', color: '#94A3B8', fontSize: '14px' }}>
            {t('games.no_questions')}
          </div>
        )}
        {quizConfig.questions.map((q, idx) => {
          const questionErrors = invalidQuestions[q.id] || {};
          const hasEmptyQuestion = questionErrors.emptyQuestion;
          const hasNotEnoughOptions = questionErrors.notEnoughOptions;
          const isInvalid = hasEmptyQuestion || hasNotEnoughOptions;

          return (
            <div
              key={q.id}
              id={`question-${q.id}`}
              style={{
                marginBottom: '14px',
                padding: '14px 16px',
                background: '#fff',
                borderRadius: '14px',
                border: `2px solid ${isInvalid ? '#EF4444' : '#E2E8F0'}`,
                boxShadow: isInvalid ? '0 2px 12px rgba(239, 68, 68, 0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#0EA5E9' }}>Q{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeQuizQuestion(q.id)}
                  style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  placeholder="Question text"
                  value={q.question}
                  onChange={e => {
                    updateQuizQuestion(q.id, { question: e.target.value });
                    clearQuestionError(q.id, 'emptyQuestion');
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: hasEmptyQuestion ? '2px solid #EF4444' : '1px solid #E2E8F0',
                    fontSize: '14px',
                    marginBottom: '10px',
                    boxSizing: 'border-box',
                    background: hasEmptyQuestion ? '#FEF2F2' : '#fff'
                  }}
                />
                {hasEmptyQuestion && (
                  <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: '600', marginTop: '-6px', display: 'block', marginBottom: '10px' }}>
                    ⚠️ Question is empty
                  </span>
                )}
              </div>
              <div style={{ marginBottom: '10px' }}>
                {q.image ? (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={q.image} alt="" style={{ maxWidth: '120px', maxHeight: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                    <button
                      type="button"
                      onClick={() => updateQuizQuestion(q.id, { image: null })}
                      style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 6, background: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px' }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', border: '2px dashed #CBD5E1', cursor: 'pointer', fontSize: '12px', color: '#64748B' }}>
                    📷 Image
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => updateQuizQuestion(q.id, { image: reader.result });
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {hasNotEnoughOptions && (
                  <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: '600', marginBottom: '4px' }}>
                    ⚠️ Not enough options (need at least 2 filled options)
                  </span>
                )}
                {(q.options || ['', '']).map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => {
                        updateQuizQuestion(q.id, { correct: i });
                        clearQuestionError(q.id, 'notEnoughOptions');
                      }}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        border: '2px solid',
                        borderColor: q.correct === i ? '#0EA5E9' : '#E2E8F0',
                        background: q.correct === i ? '#0EA5E9' : '#F8FAFC',
                        color: q.correct === i ? '#fff' : '#64748B',
                        fontWeight: '800',
                        fontSize: '13px',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                      title="Correct answer"
                    >
                      {OPTIONS[i]}
                    </button>
                    <input
                      placeholder={`Option ${OPTIONS[i]}`}
                      value={q.options[i] ?? ''}
                      onChange={e => {
                        const opts = [...(q.options || ['', ''])];
                        opts[i] = e.target.value;
                        updateQuizQuestion(q.id, { options: opts });
                        clearQuestionError(q.id, 'notEnoughOptions');
                      }}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        fontSize: '13px',
                        fontWeight: q.correct === i ? '700' : '400',
                        background: q.correct === i ? '#F0F9FF' : '#fff',
                        outline: q.correct === i ? '2px solid #0EA5E9' : 'none'
                      }}
                    />
                  </div>
                ))}
                {(q.options || []).length < 4 && (
                  <button
                    type="button"
                    onClick={() => addQuizOption(q.id)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#0EA5E9',
                      background: 'none',
                      border: '1px dashed #0EA5E9',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      alignSelf: 'flex-start'
                    }}
                  >
                    + {t('games.add_option')}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Select 2 players */}
      {selectedClass && (
        <div style={{ marginBottom: '18px', padding: '14px 18px', background: playerSelectionError ? '#FEF2F2' : '#f8fafc', borderRadius: '16px', border: `2px solid ${playerSelectionError ? '#EF4444' : '#0EA5E940'}` }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#0C4A6E', display: 'block', marginBottom: '10px' }}>
            👤 Select 2 players
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px', maxHeight: '140px', overflowY: 'auto' }}>
            {(selectedClass.students || []).map(student => {
              const isSelected = selectedStudents.some(p => p.id === student.id);
              const isFull = selectedStudents.length >= 2;
              return (
                <button
                  key={student.id}
                  onClick={() => {
                    clearPlayerError();
                    if (isSelected) setSelectedStudents(prev => prev.filter(p => p.id !== student.id));
                    else if (!isFull) setSelectedStudents(prev => [...prev, { id: student.id, name: student.name, color: ['#00d9ff', '#ff00ff'][prev.length] }]);
                  }}
                  disabled={!isSelected && isFull}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '2px solid',
                    borderColor: isSelected ? '#0EA5E9' : '#E2E8F0',
                    background: isSelected ? 'linear-gradient(135deg, #0EA5E9, #06B6D4)' : '#fff',
                    color: isSelected ? '#fff' : '#475569',
                    cursor: !isSelected && isFull ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    opacity: !isSelected && isFull ? 0.5 : 1,
                    textAlign: 'left'
                  }}
                >
                  {isSelected ? '✓ ' : ''}{student.name}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: '8px', fontSize: '13px', color: playerSelectionError ? '#EF4444' : (selectedStudents.length === 2 ? '#0EA5E9' : '#64748B'), fontWeight: '600' }}>
            {playerSelectionError
              ? 'Please select 2 players'
              : (
                <>
                  {t('games.selected_n_of_n')
                    .replace('{selected}', selectedStudents.length)
                    .replace('{count}', 2)}{' '}
                  {selectedStudents.length === 2
                    ? t('games.selected_ready')
                    : t('games.select_exactly_n').replace('{count}', 2)}
                </>
              )
            }
          </div>
        </div>
      )}

      {/* Start Game Button - combines checking and launching */}
      <button
        onClick={() => {
          // Check player selection
          const playersSelected = selectedStudents.length === 2;
          setPlayerSelectionError(!playersSelected);

          // Validate all questions and find specific errors
          const newInvalidQuestions = {};
          let hasInvalidQuestions = false;
          let firstInvalidQuestionId = null;

          quizConfig.questions.forEach((q, idx) => {
            const hasQuestion = q.question?.trim();
            const hasTwoOptions = (q.options || []).filter(o => o?.trim()).length >= 2;
            const hasCorrectAnswer = (q.options || [])[q.correct]?.trim();

            const errors = {};

            if (!hasQuestion) {
              errors.emptyQuestion = true;
              hasInvalidQuestions = true;
              if (!firstInvalidQuestionId) firstInvalidQuestionId = q.id;
            }

            if (!hasTwoOptions) {
              errors.notEnoughOptions = true;
              hasInvalidQuestions = true;
              if (!firstInvalidQuestionId) firstInvalidQuestionId = q.id;
            }

            if (!hasCorrectAnswer) {
              errors.notEnoughOptions = true; // Treat missing correct answer as options error
              hasInvalidQuestions = true;
              if (!firstInvalidQuestionId) firstInvalidQuestionId = q.id;
            }

            if (Object.keys(errors).length > 0) {
              newInvalidQuestions[q.id] = errors;
            }
          });

          setInvalidQuestions(newInvalidQuestions);

          if (hasInvalidQuestions && firstInvalidQuestionId) {
            // Scroll to first invalid question
            setTimeout(() => {
              const firstInvalidElement = document.getElementById(`question-${firstInvalidQuestionId}`);
              if (firstInvalidElement) {
                firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          } else if (playersSelected) {
            // All valid - start the game
            onGameStart(selectedStudents.map((p, i) => ({ ...p, color: ['#00d9ff', '#ff00ff'][i] })));
          }
        }}
        disabled={quizConfig.questions.length === 0}
        style={{
          width: '100%',
          padding: '16px',
          fontSize: '18px',
          fontWeight: '900',
          border: 'none',
          borderRadius: '14px',
          cursor: quizConfig.questions.length === 0 ? 'not-allowed' : 'pointer',
          background: quizConfig.questions.length === 0 ? '#ccc' : 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
          color: '#fff',
          boxShadow: quizConfig.questions.length === 0 ? 'none' : '0 6px 24px rgba(14, 165, 233, 0.4)',
          transition: 'all 0.2s',
          opacity: quizConfig.questions.length === 0 ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (quizConfig.questions.length > 0) {
            e.currentTarget.style.transform = 'scale(1.02)';
          }
        }}
        onMouseLeave={(e) => {
          if (quizConfig.questions.length > 0) {
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
      >
        🎮 Start Game
      </button>
    </div>
  );
};

export default QuizSetup;
