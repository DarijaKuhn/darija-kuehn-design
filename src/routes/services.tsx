import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/services")({
  component: Services,
  head: () => ({
    meta: [
      { title: "Gottesdienste — FECG Dresden" },
      { name: "description", content: "Gottesdienstplan und Veranstaltungen der FECG Dresden. Sonntag 10:00, Mittwoch 18:00, Freitag 18:00." },
    ],
  }),
});

function Services() {
  const { t } = useI18n();
  const { i18n } = useTranslation();
  const events = (i18n.t("pages.services.events", { returnObjects: true }) as [string, string, string, string][]) || [];
  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner container">
          <Link to="/">{t("legal.breadcrumbHome")}</Link>
          <span>›</span>
          <span className="crumb-here">{t("pages.services.crumb")}</span>
        </div>
      </div>

      <section className="section section-bg">
        <div className="container">
          <div className="label" style={{ marginBottom: 8 }}>{t("pages.services.eyebrow")}</div>
          <h1 className="section-h">{t("pages.services.h1")}</h1>
          <p className="body-lg" style={{ marginTop: 12, maxWidth: 680 }}>
            {t("pages.services.intro")}
          </p>

          <div className="events-grid">
            {events.map(([day, mon, title, time], i) => (
              <div key={i} className="event-card">
                <div className="event-badge">
                  <div className="event-badge-day">{day}</div>
                  <div className="event-badge-mon">{mon}</div>
                </div>
                <div>
                  <div className="event-title">{title}</div>
                  <div className="event-time">{time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="quote-block">
        <p className="quote-text">{t("pages.services.quote")}</p>
        <p className="quote-ref">{t("pages.services.quoteRef")}</p>
      </div>
    </div>
  );
}
