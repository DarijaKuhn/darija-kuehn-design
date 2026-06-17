import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/i18n";

import alinaArtur1 from "@/assets/gallery/Alina_und_Artur.jpg.asset.json";
import alinaArtur2 from "@/assets/gallery/Alina_und_Artur_2.jpg.asset.json";
import arturAlina from "@/assets/gallery/Artur_und_Alina.jpg.asset.json";
import angelinaAnton1 from "@/assets/gallery/Angelina_und_Anton.jpg.asset.json";
import angelinaAnton2 from "@/assets/gallery/AngelinaundAnton.jpg.asset.json";
import andreasMarina1 from "@/assets/gallery/Andreas_und_Marina.jpg.asset.json";
import andreasMarina2 from "@/assets/gallery/Andreas_und_MarinaIks.jpg.asset.json";
import andreasMarina3 from "@/assets/gallery/AndreasundMarinaIks2.jpg.asset.json";
import andreasMarina4 from "@/assets/gallery/AndreajundMarina.jpg.asset.json";
import andrejMarina from "@/assets/gallery/AndrejMarina.jpg.asset.json";

export const Route = createFileRoute("/gallery")({
  component: Gallery,
  head: () => ({
    meta: [
      { title: "Fotos — FECG Dresden" },
      { name: "description", content: "Fotos aus dem Gemeindeleben der FECG Dresden: Hochzeiten und Gemeindeveranstaltungen." },
    ],
  }),
});

type Photo = { src: string; caption: string; alt: string };
type Group = { title: string; subtitle?: string; photos: Photo[] };

const groups: Group[] = [
  {
    title: "Andreas und Marina",
    photos: [
      { src: andreasMarina3.url, caption: "Studio-Aufnahme", alt: "Andreas und Marina – Hochzeit, Studio-Porträt" },
      { src: andreasMarina4.url, caption: "Mit Trauzeugen", alt: "Andreas und Marina mit Trauzeugen in der Gemeinde" },
      { src: andrejMarina.url, caption: "Mit einer Rose", alt: "Andreas und Marina – Hochzeit, fröhlicher Moment mit Rose" },
      { src: andreasMarina1.url, caption: "Hochzeitsfeier", alt: "Andreas und Marina an der Hochzeitstafel" },
      { src: andreasMarina2.url, caption: "Brautpaar an der Tafel", alt: "Andreas und Marina an der Hochzeitstafel, Porträt" },
    ],
  },
  {
    title: "Alina und Artur",
    photos: [
      { src: alinaArtur1.url, caption: "Vor der Trauung", alt: "Alina und Artur vor dem Hochzeitsauto" },
      { src: arturAlina.url, caption: "Mit Familie", alt: "Alina und Artur mit Familienangehörigen" },
      { src: alinaArtur2.url, caption: "Über den Elbwiesen", alt: "Alina und Artur mit Blick über Dresden" },
    ],
  },
  {
    title: "Angelina und Anton",
    photos: [
      { src: angelinaAnton1.url, caption: "Im Park", alt: "Angelina und Anton – Hochzeit, Händchen haltend im Park" },
      { src: angelinaAnton2.url, caption: "Auf Händen getragen", alt: "Angelina und Anton – Hochzeit, fröhlicher Moment" },
    ],
  },
];

function Gallery() {
  const { t } = useI18n();
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner container">
          <Link to="/">{t("legal.breadcrumbHome")}</Link>
          <span>›</span>
          <span className="crumb-here">Fotos</span>
        </div>
      </div>

      <section className="section section-bg">
        <div className="container">
          <div className="label" style={{ marginBottom: 8 }}>Galerie</div>
          <h1 className="section-h">Fotos aus dem Gemeindeleben</h1>
          <p style={{ maxWidth: 720, color: "var(--muted-fg, #555)", marginBottom: 8 }}>
            Momente aus Hochzeiten und Festen unserer Gemeinde. Bilder von der Renovierung des Kirchengebäudes folgen in Kürze.
          </p>

          {groups.map((g) => (
            <div key={g.title} style={{ marginTop: 40 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>{g.title}</h2>
              {g.subtitle && <div style={{ color: "#777", fontSize: 14, marginBottom: 10 }}>{g.subtitle}</div>}
              <div className="gallery-grid">
                {g.photos.map((p) => (
                  <button
                    key={p.src}
                    type="button"
                    className="gallery-item"
                    onClick={() => setLightbox(p)}
                    style={{ border: "none", padding: 0, cursor: "zoom-in" }}
                    aria-label={p.alt}
                  >
                    <img src={p.src} alt={p.alt} loading="lazy" />
                    <div className="gallery-caption">{p.caption}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.88)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20, cursor: "zoom-out",
          }}
        >
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            style={{ maxWidth: "95vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 8, boxShadow: "0 20px 60px rgba(0,0,0,.5)" }}
          />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
            aria-label="Schließen"
            style={{
              position: "absolute", top: 16, right: 20, background: "rgba(255,255,255,.15)",
              color: "#fff", border: "1px solid rgba(255,255,255,.3)", borderRadius: 999,
              width: 40, height: 40, fontSize: 22, cursor: "pointer",
            }}
          >×</button>
        </div>
      )}
    </div>
  );
}
