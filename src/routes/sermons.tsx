import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/i18n";
import { loadContent, type Sermon } from "@/lib/site-content";

export const Route = createFileRoute("/sermons")({
  component: Sermons,
  head: () => ({
    meta: [
      { title: "Predigten — FECG Dresden" },
      { name: "description", content: "Audioarchiv der Predigten und Bibelstunden der FECG Dresden." },
    ],
  }),
});

function Sermons() {
  const { t } = useI18n();
  return (
    <div className="page-panel" style={{ background: "#F9FAFB" }}>
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner container">
          <Link to="/">{t("legal.breadcrumbHome")}</Link>
          <span>›</span>
          <span className="crumb-here">{t("pages.sermons.crumb")}</span>
        </div>
      </div>
      <section className="section" style={{ background: "#F9FAFB", paddingBottom: 12 }}>
        <div className="container">
          <div className="label" style={{ marginBottom: 10, color: "#7a8890", letterSpacing: ".14em" }}>
            {t("pages.sermons.eyebrow")}
          </div>
          <h1
            className="section-h"
            style={{ margin: 0, fontSize: "clamp(30px, 4.2vw, 44px)", letterSpacing: "-0.02em", fontWeight: 700, color: "#0f172a" }}
          >
            {t("pages.sermons.h1")}
          </h1>
        </div>
      </section>
      <LocalSermons />
    </div>
  );
}

type SortKey = "title" | "preacher" | "date";

function LocalSermons() {
  const { t } = useI18n();
  const [items, setItems] = useState<Sermon[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => { loadContent().then((c) => setItems(c.sermons)); }, []);

  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items.filter((s) => {
      if (!q) return true;
      return (
        s.title?.toLowerCase().includes(q) ||
        s.preacher?.toLowerCase().includes(q) ||
        s.scripture?.toLowerCase().includes(q)
      );
    });
    return list.sort((a, b) => {
      if (sortBy === "date") return (b.date || "").localeCompare(a.date || "");
      if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
      return (a.preacher || "").localeCompare(b.preacher || "");
    });
  }, [items, sortBy, query]);

  if (items.length === 0) return null;

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "title", label: t("pages.sermons.sortTitle") },
    { key: "preacher", label: t("pages.sermons.sortPreacher") },
    { key: "date", label: t("pages.sermons.sortDate") },
  ];

  return (
    <section className="section" style={{ background: "#F9FAFB", paddingTop: 24 }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
          <input
            type="search"
            placeholder="Suchen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              padding: "12px 20px",
              border: "1px solid #e5e7eb",
              borderRadius: 999,
              background: "#fff",
              fontSize: 14,
              minWidth: 220,
              outline: "none",
              boxShadow: "0 1px 2px rgba(15,23,42,.04)",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
          <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500, marginRight: 4 }}>
            Sortieren nach:
          </span>
          {sortOptions.map((opt) => {
            const active = sortBy === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSortBy(opt.key)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 999,
                  border: `1.5px solid ${active ? "#0f172a" : "#e5e7eb"}`,
                  background: active ? "#0f172a" : "#fff",
                  color: active ? "#fff" : "#334155",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all .2s ease",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          {sorted.map((s) => (
            <SermonCard
              key={s.id}
              sermon={s}
              isActive={activeId === s.id}
              onPlay={() => setActiveId(s.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function formatTime(sec: number) {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function SermonCard({ sermon, isActive, onPlay }: { sermon: Sermon; isActive: boolean; onPlay: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isActive && playing) audioRef.current?.pause();
  }, [isActive, playing]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
    } else {
      onPlay();
      try {
        setLoading(true);
        await a.play();
      } catch { /* autoplay blocked */ }
      finally { setLoading(false); }
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    a.currentTime = Math.max(0, Math.min(duration, ratio * duration));
  };

  const pct = duration ? (current / duration) * 100 : 0;

  return (
    <article
      className="sermon-card"
      style={{
        border: "1px solid rgba(15,23,42,.06)",
        borderRadius: 24,
        background: "#ffffff",
        boxShadow: playing
          ? "0 20px 50px -20px rgba(125, 211, 252, .45), 0 8px 24px -12px rgba(192,132,252,.25)"
          : "0 4px 18px rgba(15,23,42,.05)",
        transition: "box-shadow .35s ease, transform .2s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative", flex: "0 0 auto" }}>
          {/* soft glow */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(125,211,252,.55), rgba(192,132,252,.35) 55%, transparent 72%)",
              filter: "blur(14px)",
              opacity: playing ? 1 : 0.75,
              transition: "opacity .3s ease",
              zIndex: 0,
            }}
          />
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="sermon-play-btn"
            style={{
              position: "relative",
              zIndex: 1,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              padding: 3,
              background: "linear-gradient(135deg, #7DD3FC 0%, #A5B4FC 50%, #C084FC 100%)",
              boxShadow: "0 10px 26px -10px rgba(125,211,252,.7), 0 6px 20px -8px rgba(192,132,252,.55)",
              display: "grid",
              placeItems: "center",
              transition: "transform .15s ease",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "#ffffff",
                display: "grid",
                placeItems: "center",
                color: "#0f172a",
              }}
            >
              {loading ? (
                <span
                  style={{
                    width: 18, height: 18, borderRadius: "50%",
                    border: "2px solid #e2e8f0", borderTopColor: "#0f172a",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              ) : playing ? (
                <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                  <rect x="3.5" y="2.5" width="3" height="11" rx="1" />
                  <rect x="9.5" y="2.5" width="3" height="11" rx="1" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden style={{ marginLeft: 3 }}>
                  <path d="M4 2.5v11a.5.5 0 0 0 .77.42l8.5-5.5a.5.5 0 0 0 0-.84l-8.5-5.5A.5.5 0 0 0 4 2.5z" />
                </svg>
              )}
            </span>
          </button>
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <h3
            style={{
              margin: "0 0 6px",
              fontSize: 19,
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: "-0.01em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {sermon.title}
          </h3>
          <div style={{ fontSize: 14, color: "#94a3b8", fontWeight: 400 }}>
            {sermon.preacher}
            {sermon.scripture ? ` · ${sermon.scripture}` : ""}
            {sermon.date ? ` · ${sermon.date}` : ""}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div
          onClick={seek}
          role="slider"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{
            height: 4,
            background: "#eef2f6",
            borderRadius: 999,
            cursor: duration ? "pointer" : "default",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background: "linear-gradient(90deg, #7DD3FC, #C084FC)",
              borderRadius: 999,
              transition: "width .1s linear",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginTop: 8, fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>
          <span>{formatTime(current)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={sermon.fileUrl}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime || 0)}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </article>
  );
}
