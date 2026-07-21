import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/i18n";
import { loadContent, type Photo as LocalPhoto, type PhotoCategory } from "@/lib/site-content";
import { trackView } from "@/lib/analytics";

const CATEGORY_KEYS: PhotoCategory[] = [
  "harvest", "christmas", "easter", "children",
  "women", "construction", "trips", "other",
];

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
  const { t } = useI18n();
  const [items, setItems] = useState<LocalPhoto[]>([]);
  const [category, setCategory] = useState<"all" | PhotoCategory>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  useEffect(() => { loadContent().then((c) => setItems(c.photos)); }, []);

  const filtered = useMemo(() => {
    const list = category === "all" ? items : items.filter((p) => (p.category ?? "other") === category);
    return [...list].sort((a, b) => {
      const cmp = (a.date || "").localeCompare(b.date || "");
      return sortOrder === "newest" ? -cmp : cmp;
    });
  }, [items, category, sortOrder]);

  if (items.length === 0) return <p style={{ color: "var(--muted-fg, #555)", marginTop: 12 }}>Noch keine Fotos hochgeladen.</p>;

  const selectStyle: React.CSSProperties = { padding: "8px 16px", border: "1px solid #ccc", borderRadius: 999, background: "#fff", fontSize: 14 };

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginTop: 20 }}>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14 }}>
          <span>{t("pages.gallery.filterByCategory")}:</span>
          <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} style={selectStyle}>
            <option value="all">{t("pages.gallery.filterAll")}</option>
            {CATEGORY_KEYS.map((k) => (
              <option key={k} value={k}>{t(`pages.gallery.categories.${k}`)}</option>
            ))}
          </select>
        </label>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14 }}>
          <span>{t("pages.gallery.sortBy")}:</span>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)} style={selectStyle}>
            <option value="newest">{t("pages.gallery.sortDateNewest")}</option>
            <option value="oldest">{t("pages.gallery.sortDateOldest")}</option>
          </select>
        </label>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginTop: 20 }}>
        {filtered.map((p) => {
          const catLabel = p.category ? t(`pages.gallery.categories.${p.category}`) : p.album;
          return (
            <button key={p.id} type="button" onClick={() => { trackView("/gallery", `photo:${catLabel || p.album}`); onOpen(p.fileUrl, catLabel || p.album); }} style={{ padding: 0, border: "1px solid #e2e2dc", borderRadius: 18, overflow: "hidden", background: "#fff", cursor: "zoom-in", boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
              <img src={p.fileUrl} alt={catLabel || p.album} loading="lazy" style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
              <div style={{ padding: "8px 10px", textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{catLabel || p.album}</div>
                {p.date && <div style={{ fontSize: 12, color: "#666" }}>{p.date}</div>}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
