# Cloudflare Performance Configuration

## 1. Speed Optimization
- Go to: Speed → Optimization
- Auto Minify: HTML, CSS, JS → ALL ON
- Brotli: ON
- Early Hints: ON

## 2. Caching Configuration
- Go to: Caching → Configuration
- Caching Level: Standard
- Browser Cache TTL: 4 hours
- Edge Cache TTL: 2 hours
- Development Mode: OFF (production)

## 3. Network Settings
- Go to: Network
- HTTP/3 (with QUIC): ON
- 0-RTT Connection Resumption: ON
- gRPC: ON
- WebSockets: ON
- Onion Routing: OFF
- Pseudo IPv4: OFF

## 4. Security Settings (keep these)
- Go to: Security → WAF
- Enable Basic DDoS Protection
- Rate Limiting: 100 requests/minute per IP

## 5. Page Rules for API
Create these Page Rules:

### Rule 1: API Optimization
- URL: klasiz.fun/api/*
- Settings:
  - Cache Level: Bypass
  - Browser Cache TTL: Respect Existing Headers

### Rule 2: Static Assets
- URL: klasiz.fun/assets/*
- Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 month

### Rule 3: HTML Pages
- URL: klasiz.fun/*
- Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 2 hours
  - Browser Cache TTL: 4 hours
