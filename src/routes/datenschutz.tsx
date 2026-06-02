import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/datenschutz")({
  component: Datenschutz,
  head: () => ({
    meta: [
      { title: "Datenschutzerklärung — FECG Dresden" },
      { name: "description", content: "Datenschutzerklärung gemäß DSGVO / BDSG der Freien Evangeliums-Christen-Gemeinde Dresden e.V." },
      { name: "robots", content: "index, follow" },
    ],
  }),
});

type Section = { h: string; p: string };

function Datenschutz() {
  const { t, lang } = useI18n();
  const { i18n } = useTranslation();
  const isGerman = lang === "de";
  const sections = (i18n.getResource(lang, "translation", "datenschutz.sections") || []) as Section[];
  const germanSections = (i18n.getResource("de", "translation", "datenschutz.sections") || []) as Section[];

  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner">
          <Link to="/">{t("legal.breadcrumbHome")}</Link> <span>/</span>{" "}
          <span className="crumb-here">{t("legal.datenschutzTitle")}</span>
        </div>
      </div>
      <section className="section section-white">
        <div className="container">
          <p className="label">DSGVO / BDSG</p>
          <h1 className="section-h" style={{ marginTop: 8, marginBottom: 12 }}>
            {t("legal.datenschutzTitle")}
          </h1>
          <p style={{ color: "var(--muted)", marginBottom: 20 }}>{t("datenschutz.intro")}</p>

          {!isGerman && (
            <div className="legal-translation-notice">
              {t("legal.translationNotice")}
            </div>
          )}

          <div className="confession-body" lang={lang}>
            {sections.map((s, i) => (
              <div key={i}>
                <h2>{s.h}</h2>
                <p dangerouslySetInnerHTML={{ __html: s.p }} />
              </div>
            ))}
          </div>

          {!isGerman && (
            <>
              <p className="legal-binding-footer">{t("legalDisclaimer")}</p>
              <details className="legal-original">
                <summary>Rechtlich verbindliche deutsche Originalfassung</summary>
                <div className="confession-body" lang="de" style={{ marginTop: 16 }}>
                  {germanSections.map((s, i) => (
                    <div key={i}>
                      <h2>{s.h}</h2>
                      <p dangerouslySetInnerHTML={{ __html: s.p }} />
                    </div>
                  ))}
                </div>
              </details>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
