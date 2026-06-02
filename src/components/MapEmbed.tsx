import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";

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
  const { t } = useI18n();
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
    <div className="map-consent" role="region" aria-label={t("pages.mapConsent.aria")}>
      <div className="map-consent-bg" aria-hidden="true" />
      <div className="map-consent-card">
        <h3 className="map-consent-title">{t("pages.mapConsent.title")}</h3>
        <p className="map-consent-text">{t("pages.mapConsent.text")}</p>
        <button type="button" className="map-consent-btn" onClick={activate}>
          {t("pages.mapConsent.btn")}
        </button>
      </div>
    </div>
  );
}
