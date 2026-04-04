import { useState, useEffect } from 'react';

/** Same sources as index.html / PWA — crisp icon for splash, favicon as fallback */
export const APP_BRAND_ICON = '/icons/icon-192.webp';
export const APP_BRAND_ICON_FALLBACK = '/icons/favicon.ico';

/**
 * Spring-animated app mark (Cloudflare-style) for Suspense and light inline use.
 * @param {{ variant?: 'inline' | 'suspense'; delayMs?: number }} props
 */
export default function BrandedAppLoader({ variant = 'suspense', delayMs = 120 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  if (!visible) {
    const h = variant === 'inline' ? 24 : 'min(48vh, 320px)';
    return <div style={{ minHeight: h }} aria-hidden="true" />;
  }

  const wrapClass =
    variant === 'inline'
      ? 'branded-loader branded-loader--inline'
      : 'branded-loader branded-loader--suspense';

  return (
    <div className={wrapClass} role="status" aria-live="polite" aria-label="Loading">
      <img
        className="branded-loader__logo"
        src={APP_BRAND_ICON}
        alt=""
        width={variant === 'inline' ? 48 : 72}
        height={variant === 'inline' ? 48 : 72}
        decoding="async"
        onError={(e) => {
          e.currentTarget.src = APP_BRAND_ICON_FALLBACK;
        }}
      />
    </div>
  );
}
