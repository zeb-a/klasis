import { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { X, Download, RefreshCw } from 'lucide-react';

export default function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);

  // Check for PWA updates
  const {
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered() {},
    onRegisterError() {},
    onNeedRefresh() {
      setNeedRefresh(true);
      setShowPrompt(true);
    },
    onOfflineReady() {
      setOfflineReady(true);
      // Only show offline ready briefly, then auto-hide
      setTimeout(() => {
        setOfflineReady(false);
      }, 4000);
    }
  });

  const handleUpdate = async () => {
    setShowPrompt(false);
    setNeedRefresh(false);
    
    // Let the PWA system handle the update properly
    // This will wait for the new service worker to activate
    updateServiceWorker(true);
    
    // The PWA plugin should handle the reload automatically
    // If it doesn't, reload after a longer delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setNeedRefresh(false);
  };

  // Auto-hide update prompt after 30 seconds if not interacted with
  useEffect(() => {
    if (showPrompt && needRefresh) {
      const timer = setTimeout(() => {
        setShowPrompt(false);
        setNeedRefresh(false);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [showPrompt, needRefresh]);

  if (!showPrompt) return null;

  // Offline ready notification (non-invasive, auto-dismiss)
  if (offlineReady && !needRefresh) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          right: 20,
          zIndex: 10000,
          maxWidth: '400px',
          margin: '0 auto',
          pointerEvents: 'none'
        }}
      >
        <div
          style={{
            background: 'rgba(76, 175, 80, 0.95)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          <Download size={18} />
          <span style={{ fontSize: '14px', fontWeight: 500 }}>
            App ready to work offline
          </span>
        </div>
        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // Update available notification
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 10000,
        maxWidth: '420px',
        margin: '0 auto',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div
        style={{
          background: 'white',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <RefreshCw size={20} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: '#111827' }}>
              Update Available
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#6B7280', lineHeight: 1.5 }}>
              A new version of Klasiz.fun is available with improvements and bug fixes.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
              color: '#9CA3AF',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#4B5563'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; }}
          >
            <X size={20} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleUpdate}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.2)';
            }}
          >
            <Download size={18} />
            Update Now
          </button>
          <button
            onClick={handleDismiss}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              color: '#6B7280',
              border: '2px solid #E5E7EB',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F9FAFB';
              e.currentTarget.style.borderColor = '#D1D5DB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = '#E5E7EB';
            }}
          >
            Later
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
