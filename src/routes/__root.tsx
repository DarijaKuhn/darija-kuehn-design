import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import { useState, useEffect, useRef } from "react";
import appCss from "../styles.css?url";
import logoAsset from "@/assets/fecg-logo-new.png.asset.json";
import { I18nProvider, useI18n, LANGS, type Lang } from "@/i18n";
import { CookieConsent } from "@/components/CookieConsent";

function NotFoundComponent() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 64, margin: 0 }}>404</h1>
        <p style={{ color: "#7a9076" }}>Страница не найдена</p>
        <Link to="/" className="btn btn-primary" style={{ display: "inline-block", marginTop: 16 }}>На главную</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <h1>Что-то пошло не так</h1>
        <button className="btn btn-primary" onClick={() => { router.invalidate(); reset(); }}>Попробовать снова</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FECG Dresden — Евангельская церковь, богослужения Вс 10:00" },
      { name: "description", content: "Freie Evangeliums-Christen-Gemeinde Dresden e.V. — русскоязычная церковь евангельских христиан-баптистов в Дрездене. Воскресные богослужения в 10:00. Altenberger Str. 87, 01279 Dresden." },
      { name: "robots", content: "index, follow" },
      { name: "geo.region", content: "DE-SN" },
      { name: "geo.placename", content: "Dresden, Sachsen, Deutschland" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "FECG Dresden — Русскоязычная евангельская церковь" },
      { property: "og:description", content: "Богослужения каждое воскресенье в 10:00. Altenberger Str. 87, 01279 Dresden." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: "https://fonts.bunny.net/css?family=inter:400,500,600,700,800|cormorant-garamond:400i,500,600,700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

const NAV_LINKS: ReadonlyArray<{ to: string; key: string; home?: boolean }> = [
  { to: "/", key: "nav.home", home: true },
  { to: "/contact", key: "nav.contact" },
  { to: "/gallery", key: "nav.gallery" },
  { to: "/sermons", key: "nav.sermons" },
  { to: "/books", key: "nav.books" },
  { to: "/confession", key: "nav.confession" },
  { to: "/services", key: "nav.services" },
  { to: "/map", key: "nav.map" },
];

function LanguagePicker() {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];
  return (
    <div className="lang-picker" ref={ref}>
      <button
        type="button"
        className="lang-switch"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Sprache wählen / Choose language"
      >
        <span className="lang-flag" aria-hidden="true">{current.flag}</span>
        <span>{current.label}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>

      </button>
      {open && (
        <ul className="lang-menu" role="listbox">
          {LANGS.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === lang}
                className={`lang-menu-item ${l.code === lang ? "active" : ""}`}
                onClick={() => { setLang(l.code as Lang); setOpen(false); }}
              >
                <span className="lang-flag">{l.flag}</span>
                <span className="lang-name">{l.name}</span>
                <span className="lang-code">{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Header() {
  const { t } = useI18n();
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo" aria-label="FECG Dresden">
          <img src={logoAsset.url} alt="FECG Dresden — Freie Evangeliums-Christen-Gemeinde" className="nav-logo-img" />
        </Link>
        <div className="nav-links-wrap">
          <button
            type="button"
            className="nav-scroll nav-scroll-left"
            aria-label="Scroll left"
            onClick={(e) => {
              const el = e.currentTarget.parentElement?.querySelector(".nav-links") as HTMLElement | null;
              el?.scrollBy({ left: -120, behavior: "smooth" });
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div className="nav-links">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to as "/"}
                className={`nav-btn ${l.home ? "nav-btn-home" : ""}`}
                activeProps={{ className: `nav-btn ${l.home ? "nav-btn-home" : ""} active` }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {t(l.key)}
              </Link>
            ))}
          </div>
          <button
            type="button"
            className="nav-scroll nav-scroll-right"
            aria-label="Scroll right"
            onClick={(e) => {
              const el = e.currentTarget.parentElement?.querySelector(".nav-links") as HTMLElement | null;
              el?.scrollBy({ left: 120, behavior: "smooth" });
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
        <div className="nav-right">
          <LanguagePicker />
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  const { t, lang } = useI18n();
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <img src={logoAsset.url} alt="FECG Dresden" style={{ height: 32, width: "auto" }} />
            </div>
            <a
              href="https://www.instagram.com/youth_dresden?igsh=MTB5Z29tb3duNW05MA=="
              target="_blank"
              rel="noopener noreferrer"
              className="footer-insta"
              aria-label="Instagram Youth Dresden"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>{t("footer.instaText")}</span>
            </a>
            <p style={{ marginTop: 14 }}>{t("footer.about")}</p>
            <p style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,.55)" }}>{t("footer.dsgvo")}</p>
          </div>
          <div>
            <h4>{t("footer.navigation")}</h4>
            {NAV_LINKS.map((l) => <Link key={l.to} to={l.to as "/"}>{t(l.key)}</Link>)}
          </div>
          <div>
            <h4>{t("footer.contact")}</h4>
            <p>Altenberger Strasse 87<br />01279 Dresden, Deutschland</p>
            <a href="tel:+493512530403">+49 351 253 04 03</a>
            <a href="mailto:info@fecg-dresden.de">info@fecg-dresden.de</a>
          </div>
          <div>
            <h4>{t("footer.legal")}</h4>
            <Link to="/impressum">{t("legal.impressumTitle")}</Link>
            <Link to="/datenschutz">{t("legal.datenschutzTitle")}</Link>
            <p style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,.55)", lineHeight: 1.6 }}>
              Vereinsregister: <strong>Amtsgericht Dresden, VR 4186</strong><br />
              Vorstand (§ 26 BGB): <strong>Piotr Iks</strong> (1. Vors.), <strong>Artur Rot</strong> (2. Vors.)<br />
              V.i.S.d.P. (§ 18 Abs. 2 MStV): <strong>Darija Kühn</strong>, Hepkestraße 101, 01277 Dresden
            </p>
          </div>
        </div>
        {lang !== "de" && (
          <p style={{ marginTop: 20, padding: "12px 0", borderTop: "1px solid rgba(255,255,255,.12)", fontSize: 12, color: "rgba(255,255,255,.7)", fontStyle: "italic" }}>
            {t("legalDisclaimer")} <span lang="en" style={{ opacity: .85 }}>The German version is the only legally binding version. Translations are provided for user convenience only.</span>
          </p>
        )}
        <div className="footer-bottom">
          <div>© {year} FREIE EVANGELIUMS-CHRISTEN-GEMEINDE DRESDEN E.V. — {t("footer.rights")}</div>
          <div style={{ display: "flex", gap: 14 }}>
            <Link to="/impressum">Impressum</Link>
            <Link to="/datenschutz">Datenschutz</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <Header />
        <Outlet />
        <Footer />
        <CookieConsent />
      </I18nProvider>
    </QueryClientProvider>
  );
}
