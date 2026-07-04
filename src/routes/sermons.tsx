import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";
import { loadContent, type Sermon } from "@/lib/site-content";

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
          <div className="label" style={{ marginBottom: 8 }}>{t("pages.sermons.eyebrow")}</div>
          <h1 className="section-h" style={{ marginBottom: 0 }}>{t("pages.sermons.h1")}</h1>
        </div>
      </section>
      <LocalSermons />
    </div>
  );
}

function LocalSermons() {
  const [items, setItems] = useState<Sermon[]>([]);
  useEffect(() => { loadContent().then((c) => setItems(c.sermons)); }, []);
  if (items.length === 0) return null;
  return (
    <section className="section section-white" style={{ borderTop: "1px solid #eee" }}>
      <div className="container">
        <h2 className="section-h" style={{ marginBottom: 20 }}>Predigten-Archiv</h2>
        <div style={{ display: "grid", gap: 16 }}>
          {items.map((s) => (
            <article key={s.id} style={{ padding: 16, border: "1px solid #e2e2dc", borderRadius: 8, background: "#fff" }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 18 }}>{s.title}</h3>
              <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
                {s.preacher} · {s.date}{s.scripture ? ` · ${s.scripture}` : ""}
              </div>
              <audio controls preload="none" src={s.fileUrl} style={{ width: "100%" }} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
