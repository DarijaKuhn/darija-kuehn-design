# DSGVO i18n + Cookie Consent Implementation

## Scope
Replace the current lightweight in-file `src/i18n.tsx` with a structured, static, file-based i18n system (no external translation APIs, no Google Translate widget — all dictionaries shipped as static JSON in the bundle). Add a blocking cookie consent overlay that gates non-essential scripts/fonts. Generate translated Impressum & Datenschutz for all 12 languages. German remains the legally binding master.

## 1. i18n architecture

Install: `i18next`, `react-i18next`, `i18next-browser-languagedetector`.

New files:
- `src/i18n/index.ts` — initializes i18next with `de` as default + fallback, RTL list `['he','ar']`, resources imported statically.
- `src/i18n/locales/{de,en,ru,he,ar,pt,pl,fr,it,tr,ro,mn}.json` — one file per language. Note: Syriac uses ISO `syr` but has very limited UI support, so we ship as `ar` (Arabic, widely supported RTL) and document that Syriac speakers see Arabic; alternatively keep `syr` key pointing to same dict. I'll ship `ar` and add `syr` alias mapping to `ar`.
- Each JSON contains keys grouped: `nav.*`, `hero.*`, `schedule.*`, `buttons.*`, `footer.*`, `consent.*`, `impressum.*` (long-form blocks), `datenschutz.*` (long-form blocks), `legalDisclaimer`.

Wire-up:
- Replace `src/i18n.tsx` with a thin re-export that exposes `useI18n` (compat shim returning `{ lang, setLang, t, dir }`) backed by `react-i18next`'s `useTranslation`. This keeps all existing call sites working with minimal edits.
- Add `<html lang>` + `dir="rtl|ltr"` toggle on language change inside `__root.tsx`.
- Expand `LANGS` to 12 entries with flags & native names.
- Persist selection in `localStorage` under `lang`.

## 2. Legal pages

- Rewrite `src/routes/impressum.tsx` and `src/routes/datenschutz.tsx` to render content from translation keys (`impressum.title`, `impressum.body` as array of paragraph keys, etc.) so each language renders its translated version on the same route. URL stays `/impressum` and `/datenschutz`.
- Add footer disclaimer (visible on every non-`de` locale only): *"Die deutsche Fassung ist rechtlich allein verbindlich. Translations are provided for user convenience only."*

## 3. Cookie Consent Banner

New: `src/components/CookieConsent.tsx` + styles in `src/styles.css`.

Behavior:
- On mount, read `localStorage.getItem('cookie-consent-v1')`. If absent → render a full-viewport `position: fixed` overlay with `inset:0`, dark scrim, centered modal card, `body { overflow: hidden }` while open (blocks scroll).
- Modal contents:
  - Title + body text in German (with translation), explaining cookie categories.
  - Inline links to `/impressum` and `/datenschutz` (German versions enforced via `?lang=de` query string is unnecessary — links go to the same routes, language stays as currently selected; per requirement we link to the German legal pages so add `hreflang="de"` and force-set lang=de on click).
  - Three category controls:
    - **Notwendig** — checkbox checked + disabled
    - **Analyse** — unchecked
    - **Funktionell** — unchecked
  - Two equal-weight buttons side by side (identical class, same size, same color treatment — both primary-styled per German parity rules):
    1. `Alle akzeptieren`
    2. `Nur notwendige akzeptieren`
  - Optional "Einstellungen speichern" appears only when user toggles a category manually.
- On save: persist `{ essential: true, analytics: bool, functional: bool, ts: ISO }` in `localStorage` and a first-party cookie `cookie-consent-v1` (1-year `Max-Age`, `SameSite=Lax`).
- Mount in `__root.tsx` inside `RootComponent`, after `<Outlet />`. Render only on client (guard with `typeof window`).

### Script/font gating
- The bunny.net font `<link rel="stylesheet">` currently in `__root.tsx` head is first-party-friendly (bunny.net is GDPR-compliant by design and the project already used it deliberately) — keep it. No third-party tracking scripts exist in the codebase today, so there is nothing additional to gate beyond setting the consent flags for future use. Document this in a brief code comment so analytics/marketing scripts added later are wired through the consent flag.

## Technical Details

### Files created
- `src/i18n/index.ts`
- `src/i18n/locales/de.json` (master, full content)
- `src/i18n/locales/en.json`, `ru.json`, `he.json`, `ar.json`, `pt.json`, `pl.json`, `fr.json`, `it.json`, `tr.json`, `ro.json`, `mn.json`
- `src/components/CookieConsent.tsx`

### Files edited
- `src/i18n.tsx` — becomes shim around react-i18next preserving `useI18n`, `LANGS`, `Lang` exports.
- `src/routes/__root.tsx` — wire `<html lang dir>`, mount `<CookieConsent/>`, expand language picker, footer legal disclaimer for non-de.
- `src/routes/impressum.tsx`, `src/routes/datenschutz.tsx` — render via translations.
- `src/styles.css` — consent overlay/modal styles, RTL helper (`[dir="rtl"]` text-align tweaks).
- `package.json` / `bun.lock` — add deps.

### Translation content scope
For brevity & quality, body copy for Impressum/Datenschutz/Hero will be authored in German + English fully, and the other 10 languages will receive accurate native translations for: nav, hero headlines/CTAs, schedule labels, footer, consent banner, legal page titles and section headers. Long-form Impressum/Datenschutz body for non-de/en languages will use a German fallback paragraph with the legally-binding disclaimer above (this is the standard pattern and what the disclaimer is for). This keeps the bundle realistic and accurate rather than shipping machine-quality translations of dense legal text.

### Non-goals
- No URL-prefixed locale routes (`/de/...`). Language stays in localStorage + `<html lang>`. Existing routes keep working.
- No SSR locale negotiation — client-side detection only (project is currently rendering client-side after the i18n provider).

## Approval
After approval I will implement in one pass: install deps, create JSON dictionaries, the i18n setup, the consent component & styles, wire `__root.tsx`, and convert the two legal routes.