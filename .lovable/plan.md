# Impressum & Datenschutz – Rechtskonform mit echten Daten

## Eingetragene Daten

**Verein:**
- Freie Evangeliums-Christen-Gemeinde Dresden e.V.
- Altenberger Str. 87, 01279 Dresden
- Tel.: +49 351 2530403
- E-Mail: info@fecg-dresden.de (bestehend – falls anders, bitte korrigieren)
- Vereinsregister: Amtsgericht Dresden, **VR 4186**
- Satzung: 05.12.2002, geändert 16.02.2003 & 27.04.2003

**Vorstand (§ 26 BGB), gemeinsame Vertretung:**
- 1. Vorsitzender: **Piotr Iks**
- 2. Vorsitzender: **Artur Rot**

**Inhaltlich verantwortlich (§ 18 Abs. 2 MStV):**
- **Darija Kühn**, Hepkestr. 101, 01277 Dresden

## Was umgesetzt wird

### 1. `src/i18n/locales/de.json` – Impressum komplett befüllen
- Vereinsdaten, Kontakt, Vertretung, Registereintrag
- § 18 Abs. 2 MStV mit Darija Kühn + Hepkestr. 101, 01277 Dresden
- EU-ODR-Hinweis (https://ec.europa.eu/consumers/odr) + keine Verbraucherschlichtung
- Haftungs- & Urheberrechtsklauseln (Standard)

### 2. `src/i18n/locales/de.json` – Datenschutzerklärung vervollständigen
- Verantwortlicher = Verein, vertreten durch Piotr Iks & Artur Rot
- Hosting: Hetzner Online GmbH, Gunzenhausen – Server-Logs (IP, UA, Zeit, Art. 6 Abs. 1 lit. f)
- Cookies/Consent (bereits via Banner), Kontaktformular (Art. 6 Abs. 1 lit. a/b)
- OpenStreetMap-Einbindung (mit Consent geladen)
- Betroffenenrechte: Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Datenübertragbarkeit, Beschwerde
- Aufsichtsbehörde: Sächsischer Datenschutzbeauftragter, Devrientstr. 1, 01067 Dresden
- TLS-Verschlüsselung, Speicherdauer
- Datenschutz-Kontakt: info@fecg-dresden.de (z. Hd. Vorstand)

### 3. Übersetzung in alle 12 Sprachen
Synchron in `en, ru, ar, fr, he, it, mn, pl, pt, ro, tr`. Eigennamen (Piotr Iks, Artur Rot, Darija Kühn) und Adressen bleiben unverändert; Adress-Schema landesüblich nicht angepasst (DE-Format bleibt rechtlich bindend).

Die bestehenden Routen `impressum.tsx` und `datenschutz.tsx` zeigen bei `lang !== "de"` bereits zusätzlich die deutsche Originalfassung als rechtlich bindend an – das bleibt unverändert.

### 4. Footer / Links
Keine Änderung nötig – Impressum & Datenschutz sind bereits in `__root.tsx` verlinkt.

## Nicht enthalten
- Keine Änderung an Routen-Komponenten, Cookie-Consent, Layout oder Design.
- Keine neuen Abhängigkeiten.

Nach Freigabe trage ich die o. g. Daten in alle 12 Sprachdateien ein.
