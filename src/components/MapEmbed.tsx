import { useEffect, useState } from "react";

const CONSENT_KEY = "cookie-consent-v1";
const MAP_CONSENT_KEY = "map-consent-osm-v1";

const MAP_SRC =
  "https://www.openstreetmap.org/export/embed.html?bbox=13.825%2C50.998%2C13.855%2C51.018&layer=mapnik&marker=51.008%2C13.840";

function hasAnalyticsConsent(): boolean {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return false;
    const c = JSON.parse(raw);
    return c?.analytics === true || c?.functional === true;
  } catch {
    return false;
  }
}

function hasMapConsent(): boolean {
  try {
    return localStorage.getItem(MAP_CONSENT_KEY) === "1";
  } catch {
    return false;
  }
}

export function MapEmbed() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (hasAnalyticsConsent() || hasMapConsent()) setActive(true);
  }, []);

  const activate = () => {
    try {
      localStorage.setItem(MAP_CONSENT_KEY, "1");
    } catch {
      /* ignore */
    }
    setActive(true);
  };

  if (active) {
    return (
      <iframe
        className="map-iframe"
        title="Karte: Altenberger Str. 87, Dresden"
        src={MAP_SRC}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div className="map-consent" role="region" aria-label="Datenschutz-Hinweis OpenStreetMap">
      <div className="map-consent-bg" aria-hidden="true" />
      <div className="map-consent-card">
        <h3 className="map-consent-title">Datenschutz-Hinweis</h3>
        <p className="map-consent-text">
          Um die interaktive Karte zu sehen und Ihre Route zu planen, aktivieren Sie diese bitte mit einem Klick.
          Dabei werden Daten (u.a. Ihre IP-Adresse) an OpenStreetMap übertragen.
          Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO.
        </p>
        <button type="button" className="map-consent-btn" onClick={activate}>
          Karte aktivieren
        </button>
      </div>
    </div>
  );
}
