import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/i18n";
import { poems, type Poem } from "@/data/poems";
import { loadContent } from "@/lib/site-content";

export const Route = createFileRoute("/verses")({
  component: VersesPage,
  head: () => ({
    meta: [
      { title: "Стихи — Христианская поэзия · FECG Dresden" },
      {
        name: "description",
        content:
          "Собрание христианских стихов: покаяние и спасение, благодарение, Голгофа, размышления о вере. Авторы — Алина Роот, Артур Роот и другие.",
      },
      { property: "og:title", content: "Стихи — Христианская поэзия · FECG Dresden" },
      {
        property: "og:description",
        content: "Христианские стихи о вере, покаянии, любви, Голгофе и небесной жизни.",
      },
    ],
  }),
});

type SortKey = "title" | "author" | "category";

function VersesPage() {
  const { t } = useI18n();
  const [sortBy, setSortBy] = useState<SortKey>("category");
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [extra, setExtra] = useState<Poem[]>([]);

  useEffect(() => {
    loadContent()
      .then((c) => setExtra(c.verses.map((v) => ({ title: v.title, author: v.author, category: v.category || "Разное", text: v.text }))))
      .catch(() => {});
  }, []);

  const allPoems = useMemo<Poem[]>(() => [...extra, ...poems], [extra]);

  const categories = useMemo(() => {
    const s = new Set<string>();
    allPoems.forEach((p) => p.category && s.add(p.category));
    return Array.from(s).sort((a, b) => a.localeCompare(b, "ru"));
  }, [allPoems]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = allPoems.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.text.toLowerCase().includes(q)
      );
    });
    list = [...list].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title, "ru");
      if (sortBy === "author") return a.author.localeCompare(b.author, "ru");
      return (
        a.category.localeCompare(b.category, "ru") ||
        a.title.localeCompare(b.title, "ru")
      );
    });
    return list;
  }, [sortBy, category, query, allPoems]);

  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner container">
          <Link to="/">{t("legal.breadcrumbHome")}</Link>
          <span>›</span>
          <span className="crumb-here">Стихи</span>
        </div>
      </div>

      <section className="section section-white">
        <div className="container">
          <div className="label" style={{ marginBottom: 8 }}>Христианская поэзия</div>
          <h1 className="section-h" style={{ marginBottom: 8 }}>Стихи</h1>
          <p style={{ maxWidth: 720, color: "#556" }}>
            Собрание христианских стихов о вере, покаянии, любви к Богу и ближнему,
            Голгофе, небесной жизни и повседневных размышлениях верующего сердца.
          </p>
        </div>
      </section>

      <section className="section section-white" style={{ borderTop: "1px solid #eee", paddingTop: 20 }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <input
              type="search"
              placeholder="Поиск по названию, автору, тексту…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: "1 1 240px",
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: 6,
                fontSize: 14,
                background: "#fff",
              }}
            />
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14 }}>
              <span>Категория:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: 6, background: "#fff", fontSize: 14 }}
              >
                <option value="all">Все ({allPoems.length})</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c} ({allPoems.filter((p) => p.category === c).length})
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14 }}>
              <span>Сортировка:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: 6, background: "#fff", fontSize: 14 }}
              >
                <option value="category">По категории</option>
                <option value="title">По названию</option>
                <option value="author">По автору</option>
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <p style={{ color: "#666" }}>Ничего не найдено.</p>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {filtered.map((p, i) => {
                const open = openIdx === i;
                return (
                  <article
                    key={`${p.title}-${i}`}
                    style={{
                      padding: 18,
                      border: "1px solid #e2e2dc",
                      borderRadius: 8,
                      background: "#fff",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIdx(open ? null : i)}
                      style={{
                        appearance: "none",
                        background: "none",
                        border: 0,
                        padding: 0,
                        cursor: "pointer",
                        textAlign: "left",
                        width: "100%",
                        color: "inherit",
                      }}
                    >
                      <h3 style={{ margin: "0 0 4px", fontSize: 20, fontFamily: "'Cormorant Garamond', serif" }}>
                        {p.title}
                      </h3>
                      <div style={{ fontSize: 13, color: "#666" }}>
                        {p.author && <>{p.author} · </>}
                        <span style={{ fontStyle: "italic" }}>{p.category}</span>
                        <span style={{ marginLeft: 10, color: "#8a9c86" }}>
                          {open ? "Скрыть ▲" : "Читать ▼"}
                        </span>
                      </div>
                    </button>
                    {open && (
                      <pre
                        style={{
                          marginTop: 14,
                          whiteSpace: "pre-wrap",
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: 17,
                          lineHeight: 1.65,
                          color: "#2a2a24",
                          background: "transparent",
                          padding: 0,
                          border: 0,
                        }}
                      >
                        {p.text}
                      </pre>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          <p style={{ marginTop: 30, fontSize: 12, color: "#888" }}>
            Стихи собраны с сайта{" "}
            <a
              href="https://propovednik.my1.ru/board/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#556" }}
            >
              propovednik.my1.ru
            </a>
            . Всего: {poems.length}.
          </p>
        </div>
      </section>
    </div>
  );
}
