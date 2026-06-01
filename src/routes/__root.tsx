import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import { useState, useEffect } from "react";
import appCss from "../styles.css?url";
import logoAsset from "@/assets/fecg-logo.jpg.asset.json";

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
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

const NAV_LINKS: ReadonlyArray<{ to: string; label: string; home?: boolean }> = [
  { to: "/", label: "Главная", home: true },
  { to: "/confession", label: "Вероисповедание" },
  { to: "/services", label: "Богослужения" },
  { to: "/map", label: "Как нас найти" },
  { to: "/gallery", label: "Фото" },
  { to: "/sermons", label: "Проповеди" },
  { to: "/contact", label: "Контакт" },
];

function Header() {
  const [lang, setLang] = useState<"ru" | "de">("ru");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("lang") as "ru" | "de")) || "ru";
    setLang(saved);
  }, []);
  const toggleLang = () => {
    const next = lang === "ru" ? "de" : "ru";
    setLang(next);
    if (typeof window !== "undefined") localStorage.setItem("lang", next);
  };
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo" aria-label="FECG Dresden">
          <img src={logoAsset.url} alt="FECG Dresden — Freie Evangeliums-Christen-Gemeinde" className="nav-logo-img" />
        </Link>
        <div className="nav-links">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to as "/"}
              className={`nav-btn ${l.home ? "nav-btn-home" : ""}`}
              activeProps={{ className: `nav-btn ${l.home ? "nav-btn-home" : ""} active` }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={toggleLang}
            className="lang-switch"
            aria-label={lang === "ru" ? "Sprache wechseln zu Deutsch" : "Сменить язык на русский"}
            title={lang === "ru" ? "Deutsch" : "Русский"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>{lang === "ru" ? "RU" : "DE"}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <div className="nav-logo-mark">✝</div>
              FECG Dresden
            </div>
            <p>Freie Evangeliums-Christen-Gemeinde Dresden e.V. — русскоязычная евангельская церковь в Саксонии. Воскресные богослужения в 10:00.</p>
          </div>
          <div>
            <h4>Навигация</h4>
            {NAV_LINKS.map((l) => <Link key={l.to} to={l.to as "/"}>{l.label}</Link>)}
          </div>
          <div>
            <h4>Контакт</h4>
            <p>Altenberger Strasse 87<br />01279 Dresden, Deutschland</p>
            <a href="tel:+493512530403">+49 351 253 04 03</a>
            <a href="mailto:info@fecg-dresden.de">info@fecg-dresden.de</a>
            <a href="https://propovednik.my1.ru" target="_blank" rel="noreferrer">propovednik.my1.ru</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} Freie Evangeliums-Christen-Gemeinde Dresden e.V.</div>
          <div>DSGVO-konform</div>
        </div>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <Outlet />
      {!isHome && <Footer />}
    </QueryClientProvider>
  );
}
