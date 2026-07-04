import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";
import { loadContent, type Photo as LocalPhoto } from "@/lib/site-content";

export const Route = createFileRoute("/gallery")({
  component: Gallery,
  head: () => ({
    meta: [
      { title: "Fotos — FECG Dresden" },
      { name: "description", content: "Fotos aus dem Gemeindeleben der FECG Dresden." },
    ],
  }),
});

function Gallery() {
  const { t } = useI18n();
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; caption: string } | null>(null);

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
          <LocalPhotos onOpen={(src, alt) => setLightbox({ src, alt, caption: alt })} />
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

function LocalPhotos({ onOpen }: { onOpen: (src: string, alt: string) => void }) {
  const [items, setItems] = useState<LocalPhoto[]>([]);
  useEffect(() => { loadContent().then((c) => setItems(c.photos)); }, []);
  if (items.length === 0) return <p style={{ color: "var(--muted-fg, #555)", marginTop: 12 }}>Noch keine Fotos hochgeladen.</p>;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginTop: 24 }}>
      {items.map((p) => (
        <button key={p.id} type="button" onClick={() => onOpen(p.fileUrl, p.album)} style={{ padding: 0, border: "1px solid #e2e2dc", borderRadius: 8, overflow: "hidden", background: "#fff", cursor: "zoom-in" }}>
          <img src={p.fileUrl} alt={p.album} loading="lazy" style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
          <div style={{ padding: "8px 10px", textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{p.album}</div>
            {p.date && <div style={{ fontSize: 12, color: "#666" }}>{p.date}</div>}
          </div>
        </button>
      ))}
    </div>
  );
}
