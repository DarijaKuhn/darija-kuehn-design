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

  return (
    <section className="section section-white" style={{ borderTop: "1px solid #eee" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <h2 className="section-h" style={{ margin: 0 }}>Predigten-Archiv</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              type="search"
              placeholder="Поиск…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ padding: "10px 18px", border: "1px solid #d9d9d3", borderRadius: 999, background: "#fff", fontSize: 14, minWidth: 200 }}
            />
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14 }}>
              <span>{t("pages.sermons.sortBy")}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                style={{ padding: "10px 16px", border: "1px solid #d9d9d3", borderRadius: 999, background: "#fff", fontSize: 14 }}
              >
                <option value="title">{t("pages.sermons.sortTitle")}</option>
                <option value="preacher">{t("pages.sermons.sortPreacher")}</option>
                <option value="date">{t("pages.sermons.sortDate")}</option>
              </select>
            </label>
          </div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
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

  // Pause this player when another card starts playing
  useEffect(() => {
    if (!isActive && playing) {
      audioRef.current?.pause();
    }
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
      style={{
        padding: 18,
        border: "1px solid #e6e6df",
        borderRadius: 22,
        background: "linear-gradient(180deg, #ffffff 0%, #fbfaf6 100%)",
        boxShadow: playing ? "0 10px 30px -12px rgba(46,76,86,.25)" : "0 2px 10px rgba(0,0,0,.04)",
        transition: "box-shadow .3s ease, transform .2s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          style={{
            flex: "0 0 auto",
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            background: "conic-gradient(from 210deg at 50% 50%, #b7e4ff, #8ab6ff, #a99bff, #d7c1ff, #b7e4ff)",
            boxShadow: "0 10px 24px -8px rgba(90, 110, 180, .55), inset 0 -2px 6px rgba(0,0,0,.08)",
            display: "grid",
            placeItems: "center",
            position: "relative",
            transition: "transform .15s ease",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <span
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "#fff",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,.15)",
              color: "#2e4c56",
            }}
          >
            {loading ? (
              <span
                style={{
                  width: 16, height: 16, borderRadius: "50%",
                  border: "2px solid #cfd6d9", borderTopColor: "#2e4c56",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            ) : playing ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <rect x="3" y="2.5" width="3.5" height="11" rx="1" />
                <rect x="9.5" y="2.5" width="3.5" height="11" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M4 2.5v11a.5.5 0 0 0 .77.42l8.5-5.5a.5.5 0 0 0 0-.84l-8.5-5.5A.5.5 0 0 0 4 2.5z" />
              </svg>
            )}
          </span>
        </button>

        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 600, color: "#1f2a2f", overflow: "hidden", textOverflow: "ellipsis" }}>
            {sermon.title}
          </h3>
          <div style={{ fontSize: 13, color: "#6b7a80" }}>
            {sermon.preacher}
            {sermon.date ? ` · ${sermon.date}` : ""}
            {sermon.scripture ? ` · ${sermon.scripture}` : ""}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div
          onClick={seek}
          role="slider"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{
            height: 6,
            background: "#eceae2",
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
              background: "linear-gradient(90deg, #3f6470, #2e4c56)",
              borderRadius: 999,
              transition: "width .1s linear",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#8a949a", marginTop: 6, fontVariantNumeric: "tabular-nums" }}>
          <span>{formatTime(current)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={sermon.fileUrl}
        preload="none"
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
