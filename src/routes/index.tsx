import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import churchPhoto from "@/assets/church.jpeg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  return (
    <header className="hero">
      <div className="hero-eyebrow">Freie Evangeliums-Christen-Gemeinde Dresden e.V.</div>
      <h1 className="hero-h1">
        Дом, где звучит<br/><em>живое</em> Слово
      </h1>
      <p className="hero-sub">
        Русскоязычная евангельская община в самом сердце Саксонии.
        Мы собираемся, чтобы молиться, изучать Писание и служить ближнему здесь, в Дрездене.
      </p>

      <div className="hero-photo-wrap">
        <img src={churchPhoto} alt="Freie Evangeliums-Christen-Gemeinde Dresden" />
      </div>

      <div className="sched">
        {[
          ["Среда", "18:00", "Молитвенное служение"],
          ["Пятница", "18:00", "Изучение Библии"],
          ["Воскресенье", "10:00", "Воскресное Богослужение"],
        ].map(([d, t, n]) => (
          <Link to="/schedule" className="sched-card" key={n}>
            <div className="sched-day">{d}</div>
            <div className="sched-time">{t}</div>
            <div className="sched-title">{n}</div>
          </Link>
        ))}
      </div>

      <button className="find-cta" onClick={() => navigate({ to: "/contact" })}>
        Как нас найти
        <span className="arr">→</span>
      </button>
    </header>
  );
}
