import { createFileRoute, useNavigate } from "@tanstack/react-router";
import churchPhoto from "@/assets/church.jpeg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  return (
    <header className="hero">
      <div className="hero-stage">
        <div className="hero-photo-circle">
          <div className="ring r1" />
          <div className="ring r2" />
          <img src={churchPhoto} alt="Freie Evangeliums-Christen-Gemeinde Dresden" />
          <div className="play">▶</div>
        </div>

        <div className="hero-kicker">СЛУШАТЬ&nbsp;&nbsp;СЛОВО</div>
      </div>

      <h1 className="hero-h1">
        <span className="rise" style={{ animationDelay: ".05s" }}>Дом,</span>{" "}
        <span className="rise script" style={{ animationDelay: ".25s" }}>где&nbsp;звучит&nbsp;живое</span>{" "}
        <span className="rise" style={{ animationDelay: ".45s" }}>Слово</span>
      </h1>

      <p className="hero-sub rise" style={{ animationDelay: ".7s" }}>
        РУССКОЯЗЫЧНАЯ <b>ЕВАНГЕЛЬСКАЯ ОБЩИНА</b> В САМОМ СЕРДЦЕ САКСОНИИ — МОЛИТВА, ПИСАНИЕ И СЛУЖЕНИЕ БЛИЖНЕМУ.
      </p>

      <div className="hero-bottom">
        <div className="sched mini">
          {[
            ["Среда", "18:00", "Молитва"],
            ["Пятница", "18:00", "Изучение Библии"],
            ["Воскресенье", "10:00", "Богослужение"],
          ].map(([d, t, n], i) => (
            <div className="sched-card" key={n} style={{ animationDelay: `${0.9 + i * 0.12}s` }}>
              <div className="sched-day">{d}</div>
              <div className="sched-time">{t}</div>
              <div className="sched-title">{n}</div>
            </div>
          ))}
        </div>

        <button className="find-cta rise" style={{ animationDelay: "1.4s" }} onClick={() => navigate({ to: "/contact" })}>
          Как нас найти
          <span className="arr">▷</span>
        </button>
      </div>
    </header>
  );
}
