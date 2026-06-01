import { createFileRoute, Link } from "@tanstack/react-router";
import churchAsset from "@/assets/church.jpg.asset.json";
import fieldAsset from "@/assets/field.jpg.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "FECG Dresden — Евангельская церковь, богослужения Вс 10:00" },
      { name: "description", content: "Русскоязычная евангельская церковь в Дрездене. Воскресные богослужения в 10:00. Altenberger Str. 87, 01279 Dresden." },
    ],
  }),
});

function Index() {
  return (
    <header className="hero" id="start" role="banner">
      {/* Left — field, clouds, tree */}
      <div className="hero-photo hero-photo-fade-r" aria-hidden="true">
        <img
          src={fieldAsset.url}
          alt="Поле, дерево и облака — окрестности Дрездена"
          loading="eager"
        />
      </div>

      {/* Center */}
      <div className="hero-center">
        <p className="hero-eyebrow">Freie Evangeliums-Christen-Gemeinde Dresden e.V.</p>
        <h1 className="hero-title">Рады видеть вас в нашей общине</h1>
        <p className="hero-subtitle">Церковь Евангельских Христиан-Баптистов в Дрездене</p>
        <p className="hero-desc">Русскоязычная христианская община.</p>

        <div className="hero-schedule" aria-label="Расписание богослужений">
          <div className="hs-card">
            <div className="hs-day">Среда</div>
            <div className="hs-time">18:00</div>
            <div className="hs-name">Молитвенное служение</div>
          </div>
          <div className="hs-card">
            <div className="hs-day">Пятница</div>
            <div className="hs-time">18:00</div>
            <div className="hs-name">Изучение Библии</div>
          </div>
          <div className="hs-card">
            <div className="hs-day">Суббота</div>
            <div className="hs-time">13:30</div>
            <div className="hs-name">Молодёжное общение</div>
            <span className="hs-badge-gray">по договорённости</span>
          </div>
          <div className="hs-card hs-card-accent">
            <div className="hs-day">Воскресенье</div>
            <div className="hs-time">10:00</div>
            <div className="hs-name">Воскресное богослужение</div>
            <span className="hs-badge">Главное служение</span>
          </div>
        </div>

        <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/map" className="btn btn-primary">Как нас найти →</Link>
          <Link to="/confession" className="btn btn-outline">Наше вероисповедание</Link>
        </div>
      </div>

      {/* Right — church building */}
      <div className="hero-photo hero-photo-fade-l church-building-photo" aria-hidden="true">
        <img
          src={churchAsset.url}
          alt="Здание Freie Evangeliums-Christen-Gemeinde Dresden e.V."
          loading="eager"
        />
      </div>
    </header>
  );
}
