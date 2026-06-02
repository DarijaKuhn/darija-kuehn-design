import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/sermons")({
  component: Sermons,
  head: () => ({
    meta: [
      { title: "Predigten — FECG Dresden" },
      { name: "description", content: "Audioarchiv der Predigten und Bibelstunden der FECG Dresden auf propovednik.my1.ru." },
    ],
  }),
});

function Sermons() {
  const { t } = useI18n();
  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner container">
          <Link to="/">{t("legal.breadcrumbHome")}</Link>
          <span>›</span>
          <span className="crumb-here">{t("pages.sermons.crumb")}</span>
        </div>
      </div>
      <section className="section section-white">
        <div className="container">
          <div className="audio-row">
            <div>
              <div className="label" style={{ marginBottom: 8 }}>{t("pages.sermons.eyebrow")}</div>
              <h1 className="section-h" style={{ marginBottom: 14 }}>{t("pages.sermons.h1")}</h1>
              <p className="body-lg" style={{ maxWidth: 520, marginBottom: 24 }}>
                {t("pages.sermons.intro")}
              </p>
              <a href="https://propovednik.my1.ru/load" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {t("pages.sermons.btn")}
              </a>
            </div>
            <div className="audio-right">
              <div className="audio-play-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M10 8l6 4-6 4V8z" fill="#2a5c27" /></svg>
              </div>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 14 }}>
                {t("pages.sermons.archive")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
