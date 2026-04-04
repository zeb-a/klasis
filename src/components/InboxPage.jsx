import { useState } from 'react';
import { CheckCircle, X, MessageSquare, Check, Users, AlertCircle } from 'lucide-react';
import AssignmentGradingModal from './AssignmentGradingModal';

const InboxPage = ({ submissions, onGradeSubmit, onBack }) => {
  const [selectedSub, setSelectedSub] = useState(null);
  const [grade, setGrade] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [alert, setAlert] = useState(null);
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  const pending = submissions.filter(s => s.status === 'submitted');
  const graded = submissions.filter(s => s.status === 'graded');

  const handleSelect = (sub) => {
    setSelectedSub(sub);
    setGrade(sub.grade || '');
  };

  const submit = async () => {
    await onGradeSubmit(selectedSub.id, grade);
    setSelectedSub(null);
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleDetailedGrade = async (gradedData) => {
    try {
      await onGradeSubmit(selectedSub.id, gradedData.finalScore, gradedData);
      if (selectedSub?.student_id && typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('studentPointsUpdated', {
          detail: { studentId: selectedSub.student_id, points: Number(gradedData.finalScore) }
        }));
      }
      showAlert(`Grade saved! ${selectedSub.student_name} received ${gradedData.finalScore} point${gradedData.finalScore !== 1 ? 's' : ''}.`, 'success');
      setTimeout(() => setSelectedSub(null), 500);
    } catch (error) {
      showAlert('Failed to save grade. Please try again.', 'error');
    }
  };

  return (
    <div className="inbox-page safe-area-top" style={{ ...pageStyles.container, paddingTop: 'calc(12px + var(--safe-top, 0px))' }}>
      {alert && (
        <div style={{
          ...pageStyles.alert,
          background: alert.type === 'success' ? '#10B981' : '#EF4444',
          position: 'fixed',
          zIndex: 100001
        }}>
          {alert.type === 'success' ? <Check size={20} color="white" /> : <AlertCircle size={20} color="white" />}
          <span>{alert.message}</span>
        </div>
      )}
      <style>{`
        .inbox-page { 
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
          background: transparent;
        }
        .inbox-page .sidebar { display: none !important; }
        .inbox-page .badge { font-size: 11px !important; padding: 6px 10px !important; }
        
        /* Card Hover Effects */
        .submission-card {
          transition: all 0.3s ease !important;
          cursor: pointer !important;
        }
        .submission-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 8px 25px rgba(225, 225, 232, 0.15) !important;
        }
        
        @media (max-width: 768px) {
          .inbox-page .closeBtn button { width: 40px; height: 40px; }
        }
      `}</style>

      {/* Header 2026 Style */}
      <div style={pageStyles.modernHeader}>
        <div style={pageStyles.headerLeft}>
          <div style={pageStyles.headerContent}>
            <div style={pageStyles.headerIcon}>
              <MessageSquare size={24} color="#fff" />
            </div>
            <div>
              <h1 style={pageStyles.headerTitle}>Grading Center</h1>
              <p style={pageStyles.headerSubtitle}>
                {pending.length} pending • {graded.length} graded
              </p>
            </div>
          </div>
        </div>
        
        <button onClick={onBack} style={pageStyles.closeBtn}>
          <X size={20} color="#475569" />
        </button>
      </div>

      {/* Tabs */}
      <div style={pageStyles.tabsContainer}>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            ...pageStyles.tab,
            ...(activeTab === 'pending' ? pageStyles.activeTab : pageStyles.inactiveTab)
          }}
        >
          <CheckCircle size={16} />
          <span>Pending ({pending.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('graded')}
          style={{
            ...pageStyles.tab,
            ...(activeTab === 'graded' ? pageStyles.activeTab : pageStyles.inactiveTab)
          }}
        >
          <Check size={16} />
          <span>Graded ({graded.length})</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div style={pageStyles.mainContent}>
        {selectedSub ? (
          <>
            <AssignmentGradingModal
              submission={selectedSub}
              studentName={selectedSub.student_name}
              assignmentTitle={selectedSub.assignment_title}
              onClose={() => setSelectedSub(null)}
              onSaveGrade={handleDetailedGrade}
            />
          </>
        ) : (
          <div style={pageStyles.content}>
            {activeTab === 'pending' && (
              <div style={pageStyles.submissionsGrid}>
                {pending.map(sub => (
                  <SubmissionCard
                    key={sub.id}
                    sub={sub}
                    onClick={() => handleSelect(sub)}
                    isPending
                  />
                ))}
              </div>
            )}
            
            {activeTab === 'graded' && (
              <div style={pageStyles.submissionsGrid}>
                {graded.map(sub => (
                  <SubmissionCard
                    key={sub.id}
                    sub={sub}
                    onClick={() => {}}
                    isGraded
                  />
                ))}
              </div>
            )}

            {activeTab === 'pending' && pending.length === 0 && (
              <div style={pageStyles.emptyState}>
                <CheckCircle size={48} color="#4CAF50" />
                <h3>No Pending Submissions</h3>
                <p>All caught up! 🎉</p>
              </div>
            )}

            {activeTab === 'graded' && graded.length === 0 && (
              <div style={pageStyles.emptyState}>
                <Users size={48} color="#666" />
                <h3>No Graded Work Yet</h3>
                <p>Start grading pending submissions</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const SubmissionCard = ({ sub, active, onClick, isGraded, isPending }) => (
  <div
    className="submission-card"
    onClick={onClick}
    style={{
      ...pageStyles.card,
      borderLeft: active ? '4px solidrgb(191, 189, 233)' : '4px solid transparent',
      background: active ? '#F8F9FF' : 'white',
      opacity: isGraded ? 0.7 : 1,
      cursor: isGraded ? 'not-allowed' : 'pointer'
    }}
  >
    <div style={pageStyles.cardHeader}>
      <div style={{ fontWeight: 600, fontSize: '16px', color: '#111027' }}>{sub.student_name}</div>
      <div style={{ 
        fontSize: '12px', 
        color: isPending ? '#FFD93D' : isGraded ? '#4CAF50' : '#666', 
        backgroundColor: isPending ? 'rgba(255, 217, 61, 0.1)' : isGraded ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        padding: '4px 8px',
        borderRadius: '12px',
        display: 'inline-block'
      }}>
        {isPending && '⏳ Pending'}
        {isGraded && '✓ Graded'}
      </div>
    </div>
    <div style={{ fontSize: '14px', color: '#174151', marginTop: '8px', opacity: 0.9 }}>{sub.assignment_title}</div>
    {isGraded && <div style={{ fontSize: '13px', color: '#4CAF50', marginTop: '8px', fontWeight: '500' }}>Score: {sub.grade}</div>}
  </div>
);

const pageStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
    width: '100%',
    background: 'transparent',
    position: 'relative',
    zIndex: 1
  },

  modernHeader: {
    background: 'rgba(255, 255, 255, 0.92)',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
    borderRadius: '0 0 18px 18px',
    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
    margin: '0 12px',
    marginTop: 4
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  headerIcon: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    padding: '10px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
  },
  headerTitle: {
    margin: '0 0 4px 0',
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.3px'
  },
  headerSubtitle: {
    margin: 0,
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '600'
  },
  closeBtn: {
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    transition: 'all 0.2s ease',
    color: '#475569'
  },

  tabsContainer: {
    display: 'flex',
    padding: '12px 20px 0',
    gap: '8px',
    background: 'transparent'
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    borderRadius: '12px 12px 0 0',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  activeTab: {
    background: '#fff',
    color: '#4f46e5',
    borderBottom: '2px solid #4f46e5',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)'
  },
  inactiveTab: {
    background: 'rgba(255, 255, 255, 0.55)',
    color: '#64748b',
    borderBottom: '2px solid transparent'
  },

  // Content Area
  mainContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px 32px'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  submissionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    padding: '24px 0'
  },

  // Card Styles  
  card: { 
    backgroundColor: '#FAFBFF', 
    border: '1px solid #E0E7FF', 
    borderRadius: '16px', 
    padding: '20px', 
    cursor: 'pointer', 
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.08)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },

  // Empty States
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    padding: '48px 20px',
    textAlign: 'center'
  },
  
  alert: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 100000,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 20px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    animation: 'slideIn 0.3s ease'
  }
};

export default InboxPage;