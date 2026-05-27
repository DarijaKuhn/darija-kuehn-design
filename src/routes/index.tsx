import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import churchPhoto from "@/assets/church.jpeg";

export const Route = createFileRoute("/")({
  component: Index,
});

const TOP_LINKS = [
  { to: "/about", label: "О нас" },
  { to: "/schedule", label: "Расписание" },
  { to: "/ministries", label: "Служения" },
  { to: "/contact", label: "Контакт" },
  { to: "/contact", label: "Как нас найти", accent: true },
] as const;

function Index() {
  const navigate = useNavigate();
  return (
    <header className="hero">
      <div className="hero-top-nav">
        {TOP_LINKS.map((l, i) => (
          <Link
            key={l.label}
            to={l.to}
            className={`circle-btn ${l.accent ? "accent" : ""}`}
            style={{ animationDelay: `${0.05 * i}s` }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className="hero-stage">
        <div className="hero-photo-circle">
          <div className="ring r1" />
          <div className="ring r2" />
          <img src={churchPhoto} alt="Freie Evangeliums-Christen-Gemeinde Dresden" />
        </div>

        <div className="hero-copy">
          <div className="hero-kicker">
            <span>Дрезден</span>
            <i />
            <span>Богослужения</span>
          </div>
          <h1 className="hero-h1">
            <span className="rise" style={{ animationDelay: ".05s" }}>Дом, где</span>{" "}
            <span className="rise script" style={{ animationDelay: ".25s" }}>звучит&nbsp;живое</span>{" "}
            <span className="rise" style={{ animationDelay: ".45s" }}>Слово</span>
          </h1>
          <p className="hero-sub rise" style={{ animationDelay: ".7s" }}>
            Русскоязычная евангельская община в самом сердце Саксонии — молитва, Писание и служение ближнему.
          </p>
        </div>
      </div>

      <div className="sched mini">
        {[
          ["Среда", "18:00", "Молитва"],
          ["Пятница", "18:00", "Изучение Библии"],
          ["Воскресенье", "10:00", "Богослужение"],
        ].map(([d, t, n], i) => (
          <Link to="/schedule" className="sched-card" key={n} style={{ animationDelay: `${0.9 + i * 0.12}s` }}>
            <div className="sched-day">{d}</div>
            <div className="sched-time">{t}</div>
            <div className="sched-title">{n}</div>
          </Link>
        ))}
      </div>

      <button className="find-cta rise" style={{ animationDelay: "1.4s" }} onClick={() => navigate({ to: "/contact" })}>
        Как нас найти
        <span className="arr">→</span>
      </button>
    </header>
  );
}
