import { createFileRoute, Link } from "@tanstack/react-router";
import churchAsset from "@/assets/church.jpg.asset.json";
import fieldAsset from "@/assets/field-new.jpg.asset.json";
import fieldGrassAsset from "@/assets/field-grass.jpg.asset.json";
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
    <>
      <header className="hero" id="start" role="banner">
        {/* Left — field, clouds, tree (no building) */}
        <div className="hero-photo hero-photo-fade-r hero-photo-left" aria-hidden="true">
          <img src={fieldAsset.url} alt="" loading="eager" />
        </div>

        {/* Center */}
        <div className="hero-center">
          <p className="hero-eyebrow">{t("hero.eyebrow")}</p>
          <h1 className="hero-title">{t("hero.h1")}</h1>
          <h2 className="hero-subtitle">{t("hero.h2")}</h2>
          <p className="hero-desc">{t("hero.desc")}</p>

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

          <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link to="/map" className="btn btn-primary">{t("hero.findUs")}</Link>
            <Link to="/confession" className="btn btn-outline">{t("hero.ourFaith")}</Link>
          </div>
        </div>

        {/* Right — church building, fills the column edge-to-edge */}
        <div className="hero-photo church-building-photo" aria-hidden="true">
          <img
            src={churchAsset.url}
            alt="Здание Freie Evangeliums-Christen-Gemeinde Dresden e.V."
            loading="eager"
          />
        </div>
      </header>

      {/* Field band — fills space between hero and footer */}
      <section className="field-band" style={{ backgroundImage: `url(${fieldAsset.url})` }} aria-label="">
        <div className="field-band-inner">
          <p className="field-band-eyebrow">Псалом 23:1</p>
          <p className="field-band-text">«Господь — Пастырь мой; я ни в чём не буду нуждаться. Он покоит меня на злачных пажитях и водит меня к водам тихим».</p>
        </div>
      </section>
    </>
  );
}
