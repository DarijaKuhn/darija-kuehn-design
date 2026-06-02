import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/gallery")({
  component: Gallery,
  head: () => ({
    meta: [
      { title: "Fotos — FECG Dresden" },
      { name: "description", content: "Fotos aus dem Gemeindeleben der FECG Dresden." },
    ],
  }),
});

const photoSrcs = [
  "https://propovednik.my1.ru/_ph/2/929144416.jpg",
  "https://propovednik.my1.ru/_ph/2/265012383.jpg",
  "https://propovednik.my1.ru/_ph/2/938507766.jpg",
  "https://propovednik.my1.ru/_ph/2/156270282.jpg",
  "https://propovednik.my1.ru/_ph/1/828782037.jpg",
  "https://propovednik.my1.ru/_ph/2/279078373.jpg",
];

function Gallery() {
  const { t } = useI18n();
  const { i18n } = useTranslation();
  const captions = (i18n.t("pages.gallery.captions", { returnObjects: true }) as string[]) || [];
  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner container">
          <Link to="/">{t("legal.breadcrumbHome")}</Link>
          <span>›</span>
          <span className="crumb-here">{t("pages.gallery.crumb")}</span>
        </div>
      </div>
      <section className="section section-bg">
        <div className="container">
          <div className="label" style={{ marginBottom: 8 }}>{t("pages.gallery.eyebrow")}</div>
          <h1 className="section-h">{t("pages.gallery.h1")}</h1>
          <div className="gallery-grid">
            {photoSrcs.map((src, i) => (
              <div className="gallery-item" key={src}>
                <img src={src} alt={`${captions[i] ?? ""} — FECG Dresden`} loading="lazy" />
                <div className="gallery-caption">{captions[i]}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <a href="https://propovednik.my1.ru/photo" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              {t("pages.gallery.btnAll")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
