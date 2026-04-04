# Klasiz.fun SEO + SSO Checklist

This project now auto-generates:
- `public/sitemap.xml`
- `public/robots.txt`

using:

```bash
npm run seo:generate
```

`npm run build` already runs this automatically.

## 1) Verify Core URLs

- `https://klasiz.fun/robots.txt`
- `https://klasiz.fun/sitemap.xml`
- `https://klasiz.fun/about`
- `https://klasiz.fun/faq`
- `https://klasiz.fun/privacy`
- `https://klasiz.fun/terms`

Confirm status is `200` and content matches current routes.

## 2) Google Search Console

1. Add property: `https://klasiz.fun`
2. Verify ownership (DNS TXT preferred).
3. Submit sitemap: `https://klasiz.fun/sitemap.xml`
4. Use URL Inspection on:
   - `/`
   - `/about`
   - `/faq`
5. Request indexing for key public pages.
6. Check Coverage report weekly for crawl/index issues.

## 3) Bing Webmaster Tools

1. Add site `https://klasiz.fun`
2. Verify ownership (DNS preferred)
3. Submit sitemap
4. Use URL submission for homepage and marketing pages

## 4) Social / Rich Preview

Validate:
- Open Graph (`og:title`, `og:description`, `og:image`, `og:url`)
- Twitter tags
- Canonical tags

Recommended tools:
- Facebook Sharing Debugger
- Twitter Card Validator alternatives / preview tools
- Rich Results Test

## 5) SPA Hosting Rewrites

Ensure your host rewrites unknown paths to `index.html`:
- `public/_redirects` helps on Netlify-style hosts
- `vercel.json` helps on Vercel

If using another host/provider, add equivalent SPA rewrite rules there.

## 6) SSO/Auth Link Health

Supported auth callback/token patterns now include both legacy hash and clean path:
- `#/auth/reset-password/:token`
- `/auth/reset-password/:token`
- `#/auth/confirm-verification/:token`
- `/auth/confirm-verification/:token`

Test each end-to-end from email links on production.

## 7) Public vs Private Indexing Policy

Public pages: indexable.

Private app surfaces (dashboard, portal, internal tools): set to `noindex` and disallowed in `robots.txt`.

Re-check after major routing changes.

## 8) Monthly Maintenance

- Run `npm run seo:generate` after route changes.
- Update `PUBLIC_ROUTES` in `scripts/generate-seo-files.js` when public pages are added/removed.
- Re-submit sitemap if major changes are made.
