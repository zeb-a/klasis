import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Check, X, Settings, Layout, Clock, Siren, Presentation, Trophy, BarChart3, FileText, MessageSquare, Award, Users } from 'lucide-react';
import { useTranslation } from '../i18n';

// Child component defined outside to prevent re-creation on each render
const ToggleSwitch = ({ enabled, onToggle, disabled, isPremium, label, icon: Icon }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 10px',
    background: enabled ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.5)',
    borderRadius: '16px',
    marginBottom: '10px',
    border: enabled ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(226, 232, 240, 0.5)',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{
        width: '46px',
        height: '46px',
        borderRadius: '12px',
        background: enabled ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : 'rgba(100, 116, 139, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        boxShadow: enabled ? '0 4px 15px rgba(99, 102, 241, 0.25)' : 'none'
      }}>
        <Icon size={18} color={enabled ? 'white' : '#64748B'} />
      </div>
      <div>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>{label}</span>
        {isPremium && (
          <div style={{ marginTop: '3px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: 'white',
              padding: '1px 6px',
              borderRadius: '16px',
              fontSize: '8px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <Crown size={7} /> Premium
            </span>
          </div>
        )}
      </div>
    </div>
    <button
      onClick={() => !disabled && onToggle()}
      disabled={disabled}
      style={{
        width: '56px',
        height: '30px',
        borderRadius: '15px',
        background: enabled ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : '#CBD5E1',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: enabled ? '0 4px 15px rgba(16, 185, 129, 0.25), inset 0 2px 4px rgba(255,255,255,0.2)' : 'none'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '3px',
        left: enabled ? '29px' : '3px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {enabled ? <Check size={12} color="#059669" /> : null}
      </div>
    </button>
  </div>
);

// Child component defined outside to prevent re-creation on each render
const PaymentQRCard = ({ price = 15, onUnlock, showPromoCode, onTogglePromoCode, activeClass, localSettings, setLocalSettings, onUpdateSettings, t }) => (
  <div style={{
    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.05) 100%)',
    borderRadius: '24px',
    padding: '24px',
    marginBottom: '16px',
    position: 'relative',
    overflow: 'visible',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    boxShadow: '0 8px 32px rgba(245, 158, 11, 0.1)'
  }}> 

    <div style={{
      position: 'absolute',
      top: '-30px',
      right: '-30px',
      width: '120px',
      height: '120px',
      background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
      borderRadius: '50%',
      animation: 'pulse 2s infinite'
    }} />
    <style>{`
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 0.8; }
      }
      @keyframes flipIn {
        0% {
          transform: rotateX(-90deg);
          opacity: 0;
        }
        100% {
          transform: rotateX(0deg);
          opacity: 1;
        }
      }
      @keyframes flipOut {
        0% {
          transform: rotateX(0deg);
          opacity: 1;
        }
        100% {
          transform: rotateX(-90deg);
          opacity: 0;
        }
      }
      .promo-code-form {
        animation: flipIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        transform-origin: top center;
      }
      .promo-code-form.closing {
        animation: flipOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        transform-origin: top center;
      }
    `}</style>
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 8px 24px rgba(245, 158, 11, 0.25)'
        }}>
          <Crown size={28} color="white" />
        </div>
        <div>
          <h3 style={{ margin: '0 0 4px 0', color: '#1E293B', fontSize: '20px', fontWeight: 700 }}>
            Unlock Premium
          </h3>
          <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>
            ¥{price} / one-time payment
          </p>
        </div>
      </div>
      

      {/* QR Codes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '16px'
      }}>
        {/* Alipay */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          textAlign: 'center',
          border: '1px solid rgba(226, 232, 240, 0.5)'
        }}>
          <img
            src="/Alipay.png"
            alt="Alipay QR Code"
            style={{
              width: '100%',
              maxWidth: '120px',
              height: 'auto',
              borderRadius: '8px',
              marginBottom: '8px'
            }}
          />
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
            支付宝
          </p>
        </div>

        {/* WeChat */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          textAlign: 'center',
          border: '1px solid rgba(226, 232, 240, 0.5)'
        }}>
          <img
            src="/Wechat.png"
            alt="WeChat Pay QR Code"
            style={{
              width: '100%',
              maxWidth: '120px',
              height: 'auto',
              borderRadius: '8px',
              marginBottom: '8px'
            }}
          />
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
            微信支付
          </p>
        </div>
      </div>

      {/* Flip Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '52px'
      }}>
        {/* Unlock Button - Shows by default */}
        {!showPromoCode ? (
          <button
            onClick={onTogglePromoCode}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              padding: '14px 24px',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
              animation: showPromoCode ? 'flipOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'flipIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              transformOrigin: 'center center'
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} />
              Payment Completed - Unlock
            </span>
          </button>
        ) : (
          <div style={{
            display: 'flex',
            gap: '10px',
            animation: 'flipIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            transformOrigin: 'center center'
          }}>
            <input
              type="text"
              placeholder={t('appSettings.enter_code') || 'Enter promo code'}
              style={{
                flex: 1,
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1px solid #CBD5E1',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s',
                background: 'white'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366F1';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#CBD5E1';
                e.target.style.boxShadow = 'none';
              }}
              id="promo-code-input"
            />
            <button
              onClick={async () => {
                const code = document.getElementById('promo-code-input').value.trim().toUpperCase();
                if (!code) return;
                
                try {
                  const response = await fetch(`/api/collections/promo_codes/records?filter=(code="${code}")`, {
                    headers: {
                      'Authorization': localStorage.getItem('pocketbase_auth') || ''
                    }
                  });
                  const data = await response.json();
                  
                  if (data.items && data.items.length > 0) {
                    const promoCode = data.items[0];
                    
                    if (promoCode.is_used) {
                      alert(t('appSettings.code_already_used') || 'This code has already been used');
                      return;
                    }
                    
                    if (!promoCode.is_used && (!promoCode.used_by || promoCode.used_by !== activeClass?.id)) {
                      const newSettings = { ...localSettings, isPremium: true };
                      setLocalSettings(newSettings);
                      onUpdateSettings(newSettings);
                      
                      await fetch(`/api/collections/promo_codes/records/${promoCode.id}`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': localStorage.getItem('pocketbase_auth') || ''
                        },
                        body: JSON.stringify({
                          is_used: true,
                          used_by: activeClass?.id
                        })
                      });
                      
                      document.getElementById('promo-code-input').value = '';
                      alert(t('appSettings.code_success') || 'Premium unlocked successfully!');
                    }
                  } else {
                    alert(t('appSettings.code_invalid') || 'Invalid promo code');
                  }
                } catch (error) {
                  console.error('Error redeeming promo code:', error);
                  alert(t('appSettings.code_invalid') || 'Invalid promo code');
                }
              }}
              style={{
                padding: '14px 24px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                color: 'white',
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.25)'
              }}
            >
              {t('appSettings.redeem') || 'Redeem'}
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
        
);
void PaymentQRCard;

export default function AppSettings({ activeClass: _activeClass, onBack, onUpdateSettings, settings, isOpen = true, onClose }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('features');
  const [localSettings, setLocalSettings] = useState({
    showNavbar: true,
    showAssignments: true,
    showInbox: true,
    showLuckyDraw: true,
    showEggRoad: true,
    showAttendance: true,
    showReports: true,
    showTimer: true,
    showBuzzer: true,
    showWhiteboard: true,
    showPointsCards: true,
    ...settings
  });

  const handleToggle = (key) => {
    const newSettings = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  const features = [
    { key: 'showNavbar', label: t('appSettings.navbar') || 'Navigation Bar', icon: Layout, premium: false },
    { key: 'showPointsCards', label: t('appSettings.points_cards') || 'Points & Cards', icon: Award, premium: false },
    { key: 'showTimer', label: t('appSettings.timer') || 'Class Timer', icon: Clock, premium: false },
    { key: 'showBuzzer', label: t('appSettings.buzzer') || 'Attention Buzzer', icon: Siren, premium: false },
    { key: 'showAttendance', label: t('appSettings.attendance') || 'Attendance', icon: Users, premium: false },
    { key: 'showInbox', label: t('appSettings.inbox') || 'Messages', icon: MessageSquare, premium: false },
    { key: 'showAssignments', label: t('appSettings.assignments') || 'Assignments', icon: FileText, premium: false },
    { key: 'showLuckyDraw', label: t('appSettings.lucky_draw') || 'Lucky Draw', icon: Zap, premium: false },
    { key: 'showEggRoad', label: t('appSettings.egg_road') || 'Class Journey', icon: Trophy, premium: false },
    { key: 'showReports', label: t('appSettings.reports') || 'Reports', icon: BarChart3, premium: false },
    { key: 'showWhiteboard', label: t('appSettings.whiteboard') || 'Whiteboard', icon: Presentation, premium: false },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose || onBack}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'min(400px, calc(100vw - 20px))',
        background: '#F4F1EA',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)'
      }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        background: 'rgba(244, 241, 234, 0.95)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center', position: 'relative' }}>
          <h1 style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: 800,
            color: '#1E293B',
            letterSpacing: '-0.5px'
          }}>
            {t('appSettings.title') || 'Settings'}
          </h1>
          <button
            onClick={onBack}
            style={{
              position: 'absolute',
              right: '0px',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              background: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={20} color="#64748B" />
          </button>
        </div>
        <p style={{
          marginTop: '8px',
          margin: '8px 0 0 0',
          fontSize: '13px',
          color: '#64748B',
          textAlign: 'center',
          lineHeight: 1.4,
          maxWidth: '320px'
        }}>
          {t('appSettings.description') || 'Customize which features appear in your classroom to match your teaching style'}
        </p>
      </div>

      {/* Futuristic Tabs */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        gap: '10px'
      }}>
        {[
          { id: 'features', label: t('appSettings.tab_features') || 'Features', icon: Settings }
        ].map(({ id, label, icon: Icon }) => (
          <motion.button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 20px',
              borderRadius: '14px',
              border: 'none',
              background: activeTab === id ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : 'rgba(30, 41, 59, 0.6)',
              color: activeTab === id ? 'white' : '#94A3B8',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            whileHover={{ scale: activeTab === id ? 1.02 : 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.div
              animate={{ rotate: activeTab === id ? [0, 360] : 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <Icon size={18} />
            </motion.div>
            {label}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
                >
                  <ToggleSwitch
                    label={feature.label}
                    icon={feature.icon}
                    enabled={localSettings[feature.key]}
                    onToggle={() => handleToggle(feature.key)}
                    isPremium={false}
                    disabled={false}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </>
  );
}
