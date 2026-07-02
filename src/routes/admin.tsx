import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  loadContent,
  saveContent,
  uploadFile,
  deleteItem,
  newId,
  EMPTY_CONTENT,
  type SiteContent,
  type Sermon,
  type Photo,
  type Book,
} from "@/lib/site-content";

// NOTE: this is a client-side convenience gate. The real check happens in
// public/api/config.php (const ADMIN_PASSWORD). Change BOTH to rotate the password.
const ADMIN_PASSWORD = "Dresden2026";
const STORAGE_KEY = "fecg-admin-pw";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin — FECG Dresden" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) setPassword(saved);
  }, []);

  if (!password) return <PasswordGate onUnlock={(pw) => { sessionStorage.setItem(STORAGE_KEY, pw); setPassword(pw); }} />;
  return <Dashboard password={password} onLogout={() => { sessionStorage.removeItem(STORAGE_KEY); setPassword(null); }} />;
}

function PasswordGate({ onUnlock }: { onUnlock: (pw: string) => void }) {
  const [value, setValue] = useState("");
  const [err, setErr] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (value === ADMIN_PASSWORD) onUnlock(value);
    else { setErr(true); setValue(""); }
  }

  return (
    <div style={styles.gateWrap}>
      <form onSubmit={submit} style={styles.gateBox}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Admin</h1>
        <p style={{ color: "#666", margin: "8px 0 20px" }}>Bitte Passwort eingeben.</p>
        <input
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setErr(false); }}
          placeholder="Passwort"
          autoFocus
          style={styles.input}
        />
        {err && <div style={{ color: "#c33", marginTop: 8, fontSize: 14 }}>Falsches Passwort.</div>}
        <button type="submit" style={{ ...styles.btnPrimary, marginTop: 16, width: "100%" }}>Anmelden</button>
      </form>
    </div>
  );
}

type Tab = "sermons" | "photos" | "books";

function Dashboard({ password, onLogout }: { password: string; onLogout: () => void }) {
  const [content, setContent] = useState<SiteContent>(EMPTY_CONTENT);
  const [tab, setTab] = useState<Tab>("sermons");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => { loadContent().then(setContent).finally(() => setLoading(false)); }, []);

  function flash(kind: "ok" | "err", text: string) {
    setMsg({ kind, text });
    window.setTimeout(() => setMsg(null), 4000);
  }

  async function persist(next: SiteContent) {
    setContent(next);
    try { await saveContent(password, next); flash("ok", "Gespeichert."); }
    catch (e) { flash("err", (e as Error).message); }
  }

  async function handleDelete(type: Tab, id: string) {
    if (!confirm("Wirklich löschen?")) return;
    try {
      await deleteItem(password, type, id);
      setContent((c) => ({ ...c, [type]: c[type].filter((it: { id: string }) => it.id !== id) }));
      flash("ok", "Gelöscht.");
    } catch (e) { flash("err", (e as Error).message); }
  }

  return (
    <div style={styles.wrap}>
      <header style={styles.header}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>FECG Dresden — Admin</h1>
          <p style={{ margin: "4px 0 0", color: "#666", fontSize: 13 }}>Lokale Inhalte auf dem Hetzner-Server.</p>
        </div>
        <button onClick={onLogout} style={styles.btnGhost}>Abmelden</button>
      </header>

      <nav style={styles.tabs}>
        {(["sermons", "photos", "books"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}>
            {t === "sermons" ? "Predigten" : t === "photos" ? "Fotos" : "Bücher"}
            <span style={styles.count}>{content[t].length}</span>
          </button>
        ))}
      </nav>

      {msg && (
        <div style={{ ...styles.flash, background: msg.kind === "ok" ? "#e8f5e9" : "#fde7e7", color: msg.kind === "ok" ? "#2e7d32" : "#b71c1c" }}>
          {msg.text}
        </div>
      )}

      {loading ? (
        <p>Lädt…</p>
      ) : tab === "sermons" ? (
        <SermonsTab items={content.sermons} password={password} onSave={(items) => persist({ ...content, sermons: items })} onDelete={(id) => handleDelete("sermons", id)} onError={(m) => flash("err", m)} />
      ) : tab === "photos" ? (
        <PhotosTab items={content.photos} password={password} onSave={(items) => persist({ ...content, photos: items })} onDelete={(id) => handleDelete("photos", id)} onError={(m) => flash("err", m)} />
      ) : (
        <BooksTab items={content.books} password={password} onSave={(items) => persist({ ...content, books: items })} onDelete={(id) => handleDelete("books", id)} onError={(m) => flash("err", m)} />
      )}
    </div>
  );
}

/* ---------------- Tabs ---------------- */

function SermonsTab({ items, password, onSave, onDelete, onError }: {
  items: Sermon[]; password: string; onSave: (i: Sermon[]) => void; onDelete: (id: string) => void; onError: (m: string) => void;
}) {
  const [f, setF] = useState({ preacher: "", date: "", title: "", scripture: "" });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!file) return onError("Bitte eine MP3-Datei auswählen.");
    setBusy(true);
    try {
      const up = await uploadFile(password, "sermons", file);
      const item: Sermon = { id: newId(), ...f, fileUrl: up.url, createdAt: new Date().toISOString() };
      onSave([item, ...items]);
      setF({ preacher: "", date: "", title: "", scripture: "" });
      setFile(null);
      (document.getElementById("sermon-file") as HTMLInputElement | null)?.value && ((document.getElementById("sermon-file") as HTMLInputElement).value = "");
    } catch (err) { onError((err as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <div style={styles.grid}>
      <form onSubmit={submit} style={styles.card}>
        <h2 style={styles.h2}>Neue Predigt</h2>
        <Field label="Prediger"><input required style={styles.input} value={f.preacher} onChange={(e) => setF({ ...f, preacher: e.target.value })} /></Field>
        <Field label="Datum"><input required type="date" style={styles.input} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
        <Field label="Titel"><input required style={styles.input} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
        <Field label="Bibeltext"><input style={styles.input} value={f.scripture} onChange={(e) => setF({ ...f, scripture: e.target.value })} placeholder="z.B. Johannes 3,16" /></Field>
        <Field label="MP3-Datei"><input id="sermon-file" required type="file" accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,.mp3,.m4a,.wav,.ogg" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></Field>
        <button disabled={busy} type="submit" style={styles.btnPrimary}>{busy ? "Lade hoch…" : "Hinzufügen"}</button>
      </form>
      <div style={styles.card}>
        <h2 style={styles.h2}>Alle Predigten ({items.length})</h2>
        {items.length === 0 ? <p style={styles.empty}>Noch keine Predigten.</p> : items.map((s) => (
          <div key={s.id} style={styles.item}>
            <div style={{ flex: 1 }}>
              <div style={styles.itemTitle}>{s.title}</div>
              <div style={styles.itemMeta}>{s.preacher} · {s.date}{s.scripture ? ` · ${s.scripture}` : ""}</div>
              <audio controls src={s.fileUrl} style={{ marginTop: 6, width: "100%" }} />
            </div>
            <button onClick={() => onDelete(s.id)} style={styles.btnDanger}>Löschen</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhotosTab({ items, password, onSave, onDelete, onError }: {
  items: Photo[]; password: string; onSave: (i: Photo[]) => void; onDelete: (id: string) => void; onError: (m: string) => void;
}) {
  const [f, setF] = useState({ album: "", date: "", description: "" });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!file) return onError("Bitte ein Bild auswählen.");
    setBusy(true);
    try {
      const up = await uploadFile(password, "photos", file);
      const item: Photo = { id: newId(), ...f, fileUrl: up.url, createdAt: new Date().toISOString() };
      onSave([item, ...items]);
      setF({ album: "", date: "", description: "" });
      setFile(null);
      (document.getElementById("photo-file") as HTMLInputElement | null) && ((document.getElementById("photo-file") as HTMLInputElement).value = "");
    } catch (err) { onError((err as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <div style={styles.grid}>
      <form onSubmit={submit} style={styles.card}>
        <h2 style={styles.h2}>Neues Foto</h2>
        <Field label="Album / Titel"><input required style={styles.input} value={f.album} onChange={(e) => setF({ ...f, album: e.target.value })} /></Field>
        <Field label="Datum"><input type="date" style={styles.input} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
        <Field label="Beschreibung"><textarea style={{ ...styles.input, minHeight: 70 }} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
        <Field label="Bild"><input id="photo-file" required type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></Field>
        <button disabled={busy} type="submit" style={styles.btnPrimary}>{busy ? "Lade hoch…" : "Hinzufügen"}</button>
      </form>
      <div style={styles.card}>
        <h2 style={styles.h2}>Alle Fotos ({items.length})</h2>
        {items.length === 0 ? <p style={styles.empty}>Noch keine Fotos.</p> : (
          <div style={styles.photoGrid}>
            {items.map((p) => (
              <div key={p.id} style={styles.photoCard}>
                <img src={p.fileUrl} alt={p.album} style={styles.photoImg} loading="lazy" />
                <div style={{ padding: 8 }}>
                  <div style={{ ...styles.itemTitle, fontSize: 14 }}>{p.album}</div>
                  <div style={{ ...styles.itemMeta, fontSize: 12 }}>{p.date}</div>
                  <button onClick={() => onDelete(p.id)} style={{ ...styles.btnDanger, marginTop: 6, width: "100%" }}>Löschen</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BooksTab({ items, password, onSave, onDelete, onError }: {
  items: Book[]; password: string; onSave: (i: Book[]) => void; onDelete: (id: string) => void; onError: (m: string) => void;
}) {
  const [f, setF] = useState({ author: "", title: "", description: "" });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!file) return onError("Bitte eine PDF/EPUB-Datei auswählen.");
    setBusy(true);
    try {
      const up = await uploadFile(password, "books", file);
      const item: Book = { id: newId(), ...f, fileUrl: up.url, createdAt: new Date().toISOString() };
      onSave([item, ...items]);
      setF({ author: "", title: "", description: "" });
      setFile(null);
      (document.getElementById("book-file") as HTMLInputElement | null) && ((document.getElementById("book-file") as HTMLInputElement).value = "");
    } catch (err) { onError((err as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <div style={styles.grid}>
      <form onSubmit={submit} style={styles.card}>
        <h2 style={styles.h2}>Neues Buch</h2>
        <Field label="Autor"><input required style={styles.input} value={f.author} onChange={(e) => setF({ ...f, author: e.target.value })} /></Field>
        <Field label="Titel"><input required style={styles.input} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
        <Field label="Beschreibung"><textarea style={{ ...styles.input, minHeight: 90 }} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
        <Field label="Datei (PDF / EPUB)"><input id="book-file" required type="file" accept=".pdf,.epub,.mobi,application/pdf,application/epub+zip" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></Field>
        <button disabled={busy} type="submit" style={styles.btnPrimary}>{busy ? "Lade hoch…" : "Hinzufügen"}</button>
      </form>
      <div style={styles.card}>
        <h2 style={styles.h2}>Alle Bücher ({items.length})</h2>
        {items.length === 0 ? <p style={styles.empty}>Noch keine Bücher.</p> : items.map((b) => (
          <div key={b.id} style={styles.item}>
            <div style={{ flex: 1 }}>
              <div style={styles.itemTitle}>{b.title}</div>
              <div style={styles.itemMeta}>{b.author}</div>
              {b.description && <p style={{ margin: "6px 0 0", fontSize: 13, color: "#444" }}>{b.description}</p>}
              <a href={b.fileUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#2a5c27" }}>Datei öffnen ↗</a>
            </div>
            <button onClick={() => onDelete(b.id)} style={styles.btnDanger}>Löschen</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", fontSize: 13, color: "#444", marginBottom: 4 }}>{label}</span>
      {children}
    </label>
  );
}

const styles: Record<string, React.CSSProperties> = {
  gateWrap: { minHeight: "100vh", display: "grid", placeItems: "center", background: "#f5f5f2", padding: 20 },
  gateBox: { background: "#fff", padding: 28, borderRadius: 10, width: "100%", maxWidth: 360, boxShadow: "0 4px 20px rgba(0,0,0,.06)" },
  wrap: { maxWidth: 1100, margin: "0 auto", padding: "24px 20px 80px", fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 20 },
  tabs: { display: "flex", gap: 8, borderBottom: "1px solid #e2e2dc", marginBottom: 20, flexWrap: "wrap" },
  tab: { background: "transparent", border: 0, padding: "10px 14px", cursor: "pointer", fontSize: 15, color: "#555", borderBottom: "2px solid transparent", display: "flex", alignItems: "center", gap: 8 },
  tabActive: { color: "#2a5c27", borderBottomColor: "#2a5c27", fontWeight: 600 },
  count: { background: "#eee", borderRadius: 10, padding: "1px 8px", fontSize: 12, color: "#555" },
  flash: { padding: "10px 14px", borderRadius: 6, marginBottom: 16, fontSize: 14 },
  grid: { display: "grid", gridTemplateColumns: "minmax(280px, 380px) 1fr", gap: 20, alignItems: "start" },
  card: { background: "#fff", border: "1px solid #e2e2dc", borderRadius: 10, padding: 20 },
  h2: { margin: "0 0 16px", fontSize: 17 },
  input: { width: "100%", padding: "9px 11px", fontSize: 14, border: "1px solid #d0d0c8", borderRadius: 6, background: "#fff", boxSizing: "border-box", fontFamily: "inherit" },
  btnPrimary: { background: "#2a5c27", color: "#fff", border: 0, padding: "10px 18px", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer" },
  btnGhost: { background: "transparent", border: "1px solid #ccc", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 },
  btnDanger: { background: "#fff", border: "1px solid #d99", color: "#b33", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 13, alignSelf: "flex-start" },
  item: { display: "flex", gap: 12, padding: "12px 0", borderTop: "1px solid #f0f0ea" },
  itemTitle: { fontWeight: 600, fontSize: 15 },
  itemMeta: { fontSize: 13, color: "#666", marginTop: 2 },
  empty: { color: "#888", fontSize: 14, margin: 0 },
  photoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 },
  photoCard: { border: "1px solid #eee", borderRadius: 6, overflow: "hidden", background: "#fafafa" },
  photoImg: { width: "100%", height: 120, objectFit: "cover", display: "block" },
};
