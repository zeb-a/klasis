#!/bin/bash
# China-specific Cloudflare Page Rules

echo "Create these Page Rules in Cloudflare Dashboard:"

echo "
Rule 1: China API Optimization
URL: klasiz.fun/api/*
Settings:
- Cache Level: Bypass
- Browser Cache TTL: 4 hours
- Edge Cache TTL: 2 hours
- Security Level: Medium
- Rocket Loader: Off

Rule 2: China Static Assets
URL: klasiz.fun/assets/*
Settings:
- Cache Level: Cache Everything
- Browser Cache TTL: 1 month
- Edge Cache TTL: 1 month
- Minify: HTML, CSS, JS
- Polish: On

Rule 3: China HTML Pages
URL: klasiz.fun/*
Settings:
- Cache Level: Cache Everything
- Browser Cache TTL: 4 hours
- Edge Cache TTL: 2 hours
- Always Online: On
- Security Level: Medium

Rule 4: China Mobile Optimization
URL: klasiz.fun/*
Settings:
- Mobile Redirect: Off
- Resolution: High
- Browser Cache TTL: 2 hours
"
