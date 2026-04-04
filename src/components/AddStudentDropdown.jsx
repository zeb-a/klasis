import { useRef, useEffect, useState } from 'react';
import { UserPlus, Users } from 'lucide-react';

export default function AddStudentDropdown({ onClose, onOpenSingle, onOpenBulk, buttonRef }) {
  const dropdownRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2
      });
    }
  }, [buttonRef]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !buttonRef.current?.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, buttonRef]);

  return (
    <>
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
      <div
        ref={dropdownRef}
        style={{ ...styles.dropdown, top: `${position.top}px`, left: `${position.left}px` }}
      >
      <div style={styles.arrow} />
      <button
        style={styles.option}
        onClick={() => {
          onOpenSingle();
          onClose();
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#F8FAFC';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <UserPlus size={18} style={styles.optionIcon} />
        <span>Add A Student</span>
      </button>
      <div style={styles.divider} />
      <button
        style={styles.option}
        onClick={() => {
          onOpenBulk();
          onClose();
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#F8FAFC';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <Users size={18} style={styles.optionIcon} />
        <span>Add Multiple Students</span>
      </button>
      </div>
    </>
  );
}

const styles = {
  dropdown: {
    position: 'fixed',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    border: '1px solid #E2E8F0',
    padding: '8px',
    minWidth: '200px',
    zIndex: 10000,
    animation: 'fadeInDown 0.2s ease-out',
    transform: 'translateX(-50%)'
  },
  arrow: {
    position: 'absolute',
    bottom: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0',
    height: '0',
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderTop: '8px solid white',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
  },
  option: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#1E293B',
    transition: 'all 0.15s',
    textAlign: 'left'
  },
  optionIcon: {
    color: '#6366F1'
  },
  divider: {
    height: '1px',
    background: '#E2E8F0',
    margin: '4px 0'
  }
};
