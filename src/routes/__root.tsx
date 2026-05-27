import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 64, margin: 0 }}>404</h1>
        <p style={{ color: "#6b716b" }}>Страница не найдена</p>
        <Link to="/" className="pill" style={{ display: "inline-block", marginTop: 16 }}>На главную</Link>
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
        <button className="pill" onClick={() => { router.invalidate(); reset(); }}>Попробовать снова</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Евангельские Христиане Дрезден — Freie Evangeliums-Christen-Gemeinde Dresden e.V." },
      { name: "description", content: "Русскоязычная евангельская община в Дрездене. Altenberger Strasse 87, 01279 Dresden." },
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

const NAV_LINKS = [
  { to: "/", label: "Главная" },
  { to: "/about", label: "О нас" },
  { to: "/schedule", label: "Расписание" },
  { to: "/ministries", label: "Служения" },
  { to: "/contact", label: "Контакт" },
] as const;

function Header() {
  return (
    <nav className="nav">
      <Link to="/" className="brand">
        <div className="brand-mark">✝</div>
        <div className="brand-name">EChG<small>Dresden</small></div>
      </Link>

      <div className="nav-pills">
        {NAV_LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="pill"
            activeProps={{ className: "pill active" }}
            activeOptions={{ exact: l.to === "/" }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}


function Footer() {
  return (
    <footer>
      <div className="foot-inner">
        <div className="foot-col">
          <div className="brand" style={{ marginBottom: 14 }}>
            <div className="brand-mark">✝</div>
            <div className="brand-name">Евангельские Христиане<small>Dresden · Germany</small></div>
          </div>
          <p style={{ color: "#6b716b" }}>Freie Evangeliums-Christen-Gemeinde Dresden e.V. — русскоязычная евангельская община в Саксонии.</p>
        </div>
        <div className="foot-col">
          <h4>Навигация</h4>
          {NAV_LINKS.map((l) => <Link key={l.to} to={l.to}>{l.label}</Link>)}
        </div>
        <div className="foot-col">
          <h4>Контакт</h4>
          <p>Altenberger Strasse 87<br/>01279 Dresden, Deutschland</p>
          <a href="tel:+4903512530403">+49 (0) 351 253 04 03</a>
          <a href="https://propovednik.my1.ru" target="_blank" rel="noreferrer">propovednik.my1.ru</a>
        </div>
      </div>
      <div className="foot-bottom">
        <div>© {new Date().getFullYear()} Freie Evangeliums-Christen-Gemeinde Dresden e.V.</div>
        <div>DSGVO-konform · Keine externen Fonts</div>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <Outlet />
      <Footer />
    </QueryClientProvider>
  );
}
