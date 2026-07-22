import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";
import { loadContent, type Asset } from "@/lib/site-content";

const DEFAULT_HERO_IMAGE = "/assets/hero-bg.jpg";
const DEFAULT_HERO_VIDEO = "/assets/sky-clouds.mov";

function isVideoAsset(url: string): boolean {
  return /\.(mp4|webm|mov|m4v|ogv|3gp|3gpp)(\?|$)/i.test(url);
}

function latestAsset(assets: Asset[], category: string, wantVideo: boolean): Asset | undefined {
  return assets
    .filter((asset) => asset.category === category && isVideoAsset(asset.fileUrl) === wantVideo)
    .sort((a, b) => Date.parse(b.createdAt || "") - Date.parse(a.createdAt || ""))[0];
}

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
  const [heroMedia, setHeroMedia] = useState({ image: DEFAULT_HERO_IMAGE, video: DEFAULT_HERO_VIDEO });

  useEffect(() => {
    let alive = true;
    loadContent().then((content) => {
      if (!alive) return;
      const banner = latestAsset(content.assets, "banner", false);
      const bannerVideo = latestAsset(content.assets, "banner-video", true);
      setHeroMedia({
        image: banner?.fileUrl || DEFAULT_HERO_IMAGE,
        video: bannerVideo?.fileUrl || (banner ? "" : DEFAULT_HERO_VIDEO),
      });
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  return (
    <header
      className="hero"
      id="start"
      role="banner"
      aria-label={t("hero.imgAlt")}
      style={{ backgroundImage: `url(${heroMedia.image})` }}
    >
      {heroMedia.video && (
        <video
          key={heroMedia.video}
          className="hero-video"
          src={heroMedia.video}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          ref={(el) => { if (el) el.playbackRate = 0.35; }}
        />
      )}
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
