import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n";

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
  const { t } = useI18n();
  return (
    <header
      className="hero"
      id="start"
      role="banner"
      aria-label={t("hero.imgAlt")}
      style={{ backgroundImage: `url(/assets/hero-bg.jpg)` }}
    >
      <video
        className="hero-video"
        src="/assets/sky-clouds.mov"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        ref={(el) => { if (el) el.playbackRate = 0.35; }}
      />
      <div className="hero-card">
        <p className="hero-eyebrow">{t("hero.eyebrow")}</p>
        <h1 className="hero-title">{t("hero.h1")}</h1>
        <h2 className="hero-subtitle">{t("hero.h2")}</h2>
        <p className="hero-desc">{t("hero.desc")}</p>
        <p className="hero-address">{t("hero.address")}</p>

        <div className="hero-schedule" aria-label={t("hero.schedule")}>
          <div className="hs-card">
            <div className="hs-day">{t("hero.wed")}</div>
            <div className="hs-time">18:00</div>
            <div className="hs-name">{t("hero.prayer")}</div>
          </div>
          <div className="hs-card">
            <div className="hs-day">{t("hero.fri")}</div>
            <div className="hs-time">18:00</div>
            <div className="hs-name">{t("hero.bible")}</div>
          </div>
          <div className="hs-card">
            <div className="hs-day">{t("hero.sat")}</div>
            <div className="hs-time">13:30</div>
            <div className="hs-name">{t("hero.youth")}</div>
            <span className="hs-badge-gray">{t("hero.byArr")}</span>
          </div>
          <div className="hs-card hs-card-accent">
            <div className="hs-day">{t("hero.sun")}</div>
            <div className="hs-time">10:00</div>
            <div className="hs-name">{t("hero.sundaySvc")}</div>
            <span className="hs-badge">{t("hero.mainSvc")}</span>
          </div>
        </div>

        <div style={{ marginTop: 20, display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/map" className="btn btn-primary">{t("hero.findUs")}</Link>
          <Link to="/confession" className="btn btn-outline">{t("hero.ourFaith")}</Link>
        </div>
      </div>
    </header>
  );
}
