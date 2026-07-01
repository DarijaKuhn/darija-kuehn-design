import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/confession")({
  component: Confession,
  head: () => ({
    meta: [
      { title: "Glaubensbekenntnis — FECG Dresden" },
      { name: "description", content: "Grundlagen unseres Glaubens: Heilige Schrift, Dreieiniger Gott, Erlösung aus Gnade, Gläubigentaufe, Abendmahl, Wiederkunft Christi." },
    ],
  }),
});

function Confession() {
  const { t } = useI18n();
  const { i18n } = useTranslation();
  const items = (i18n.t("pages.confession.items", { returnObjects: true }) as [string, string][]) || [];
  const solaItems = (i18n.t("pages.confession.solaItems", { returnObjects: true }) as [string, string][]) || [];
  const baptistenItems = (i18n.t("pages.confession.baptistenItems", { returnObjects: true }) as string[]) || [];
  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner container">
          <Link to="/">{t("legal.breadcrumbHome")}</Link>
          <span>›</span>
          <span className="crumb-here">{t("pages.confession.crumb")}</span>
        </div>
      </div>
      <section className="section section-white">
        <div className="container">
          <div className="label" style={{ marginBottom: 12 }}>{t("pages.confession.eyebrow")}</div>
          <h1 className="section-h" style={{ marginBottom: 20 }}>{t("pages.confession.h1")}</h1>
          <div className="confession-body">
            <p>{t("pages.confession.intro")}</p>
            <h2>{t("pages.confession.h2")}</h2>
            <ul className="confession-list">
              {items.map(([title, body], i) => (
                <li key={i}><span className="mark">✦</span><span><strong>{title}</strong> — {body}</span></li>
              ))}
            </ul>

            {Array.isArray(solaItems) && solaItems.length > 0 && (
              <>
                <h2>{t("pages.confession.solaTitle")}</h2>
                <ul className="confession-list">
                  {solaItems.map(([title, body], i) => (
                    <li key={`s-${i}`}><span className="mark">✦</span><span><strong>{title}:</strong> {body}</span></li>
                  ))}
                </ul>
              </>
            )}


            {Array.isArray(baptistenItems) && baptistenItems.length > 0 && (
              <>
                <h2>{t("pages.confession.baptistenTitle")}</h2>
                <ul className="confession-list">
                  {baptistenItems.map((body, i) => (
                    <li key={`b-${i}`}><span className="mark">✦</span><span>{body}</span></li>
                  ))}
                </ul>
                <p style={{ opacity: 0.7, fontSize: "0.9em", fontStyle: "italic" }}>{t("pages.confession.principlesNote")}</p>
              </>
            )}

            <div className="quote-box">
              <p className="q">{t("pages.confession.quote")}</p>
              <p className="r">{t("pages.confession.quoteRef")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
