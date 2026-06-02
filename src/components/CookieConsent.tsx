import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n";

// Storage key includes a version so we can re-prompt if the policy materially changes.
const STORAGE_KEY = "cookie-consent-v1";

type Consent = {
  essential: true;
  analytics: boolean;
  functional: boolean;
  ts: string;
};

function writeConsent(c: Consent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    // 1-year first-party cookie. Used so other tabs / SSR can read consent state.
    document.cookie =
      `${STORAGE_KEY}=${encodeURIComponent(JSON.stringify(c))};` +
      `path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
  } catch {
    /* storage may be unavailable (private mode) — banner will reappear next visit */
  }
}

export function CookieConsent() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [functional, setFunctional] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  // Block background scroll while the modal is open (DSGVO "must interact before reading").
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!open) return null;

  const save = (c: Consent) => {
    writeConsent(c);
    setOpen(false);
    // NOTE for future maintainers: load analytics / marketing scripts only when
    // c.analytics === true. No such scripts are present today, so nothing to gate.
  };

  const acceptAll = () =>
    save({ essential: true, analytics: true, functional: true, ts: new Date().toISOString() });

  const acceptEssential = () =>
    save({ essential: true, analytics: false, functional: false, ts: new Date().toISOString() });

  const saveSelection = () =>
    save({ essential: true, analytics, functional, ts: new Date().toISOString() });

  return (
    <div
      className="cc-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cc-title"
      aria-describedby="cc-body"
    >
      <div className="cc-modal">
        <h2 id="cc-title" className="cc-title">{t("consent.title")}</h2>
        <p id="cc-body" className="cc-body">
          {t("consent.body")}
          {" "}
          {t("consent.linksIntro")}{" "}
          <Link to="/datenschutz" hrefLang="de" className="cc-link">{t("consent.linkDatenschutz")}</Link>
          {" "}{t("consent.and")}{" "}
          <Link to="/impressum" hrefLang="de" className="cc-link">{t("consent.linkImpressum")}</Link>.
        </p>

        <div className="cc-categories">
          <label className="cc-cat cc-cat-locked">
            <input type="checkbox" checked disabled readOnly />
            <span>
              <strong>{t("consent.essential")}</strong>
              <em>{t("consent.essentialDesc")}</em>
            </span>
          </label>
          <label className="cc-cat">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => { setAnalytics(e.target.checked); setTouched(true); }}
            />
            <span>
              <strong>{t("consent.analytics")}</strong>
              <em>{t("consent.analyticsDesc")}</em>
            </span>
          </label>
          <label className="cc-cat">
            <input
              type="checkbox"
              checked={functional}
              onChange={(e) => { setFunctional(e.target.checked); setTouched(true); }}
            />
            <span>
              <strong>{t("consent.functional")}</strong>
              <em>{t("consent.functionalDesc")}</em>
            </span>
          </label>
        </div>

        {/* Equal-weight buttons per German parity rule (TTDSG / EuGH "Planet49") */}
        <div className="cc-actions">
          <button type="button" className="cc-btn" onClick={acceptEssential}>
            {t("consent.acceptEssential")}
          </button>
          <button type="button" className="cc-btn" onClick={acceptAll}>
            {t("consent.acceptAll")}
          </button>
        </div>
        {touched && (
          <button type="button" className="cc-btn cc-btn-secondary" onClick={saveSelection}>
            {t("consent.saveSettings")}
          </button>
        )}
      </div>
    </div>
  );
}
