import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef, useMemo, type FormEvent, type DragEvent } from "react";
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
  type Asset,
  type Verse,
  type EventItem,
} from "@/lib/site-content";
import { fetchStats } from "@/lib/analytics";

// The password is verified server-side (public/api/verify.php).
// Nothing about the secret ships in the client bundle.
const STORAGE_KEY = "fecg-admin-pw";
const VERIFY_URL = "/api/verify.php";

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
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy || !value) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(VERIFY_URL, {
        method: "POST",
        headers: { "X-Admin-Password": value },
      });
      if (res.ok) { onUnlock(value); return; }
      if (res.status === 429) {
        const data = await res.json().catch(() => ({} as { error?: string }));
        setErr(data.error || "Zu viele Fehlversuche. Bitte später versuchen.");
      } else {
        setErr("Falsches Passwort / Неверный пароль.");
      }
      setValue("");
    } catch {
      setErr("Verbindungsfehler / Ошибка соединения.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={styles.gateWrap}>
      <form onSubmit={submit} style={styles.gateBox}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Admin</h1>
        <p style={{ color: "#666", margin: "8px 0 20px" }}>Passwort eingeben / Введите пароль.</p>
        <input
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setErr(null); }}
          placeholder="Passwort"
          autoFocus
          autoComplete="current-password"
          style={styles.input}
          disabled={busy}
        />
        {err && <div style={{ color: "#c33", marginTop: 8, fontSize: 14 }}>{err}</div>}
        <button type="submit" disabled={busy} style={{ ...styles.btnPrimary, marginTop: 16, width: "100%", opacity: busy ? 0.6 : 1 }}>
          {busy ? "…" : "Anmelden / Войти"}
        </button>
      </form>
    </div>
  );
}

type Tab = "sermons" | "photos" | "books" | "assets" | "verses" | "events" | "stats" | "design";

function Dashboard({ password, onLogout }: { password: string; onLogout: () => void }) {
  const [content, setContent] = useState<SiteContent>(EMPTY_CONTENT);
  const [tab, setTab] = useState<Tab>("sermons");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => { loadContent().then(setContent).finally(() => setLoading(false)); }, []);

  function flash(kind: "ok" | "err", text: string) {
    setMsg({ kind, text });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.setTimeout(() => setMsg(null), 6000);
    }
  }

  async function persist(next: SiteContent) {
    setContent(next);
    try { await saveContent(password, next); flash("ok", "Gespeichert / Сохранено ✓"); }
    catch (e) { flash("err", (e as Error).message); }
  }

  type ContentTab = Exclude<Tab, "stats" | "design">;
  async function handleDelete(type: ContentTab, id: string) {
    if (!confirm("Wirklich löschen? / Точно удалить?")) return;
    try {
      await deleteItem(password, type, id);
      setContent((c) => ({ ...c, [type]: c[type].filter((it: { id: string }) => it.id !== id) }));
      flash("ok", "Gelöscht / Удалено ✓");
    } catch (e) { flash("err", (e as Error).message); }
  }


  return (
    <div style={styles.wrap} className="admin-root">
      <style>{`
        @media (max-width: 720px) {
          .admin-root { padding: 14px 12px 60px !important; }
          .admin-root h1 { font-size: 18px !important; }
          .admin-root [data-admin-grid] { grid-template-columns: 1fr !important; gap: 14px !important; }
          .admin-root [data-admin-card] { padding: 14px !important; border-radius: 12px !important; }
          .admin-root [data-admin-tabs] {
            flex-wrap: nowrap !important;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            gap: 4px !important;
            margin: 0 -12px 16px !important;
            padding: 0 12px 2px !important;
          }
          .admin-root [data-admin-tabs]::-webkit-scrollbar { display: none; }
          .admin-root [data-admin-tabs] button { flex: 0 0 auto; padding: 10px 12px !important; font-size: 14px !important; white-space: nowrap; }
          .admin-root [data-admin-header] { flex-direction: row; align-items: center; }
          .admin-root [data-admin-photogrid] { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)) !important; gap: 10px !important; }
          .admin-root input, .admin-root select, .admin-root textarea { font-size: 16px !important; }
          .admin-root button { min-height: 40px; }
        }
      `}</style>
      <header style={styles.header} data-admin-header>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>FECG Dresden — Admin</h1>
          <p style={{ margin: "4px 0 0", color: "#666", fontSize: 13 }}>Загрузка файлов с компьютера · Hetzner-Server</p>
        </div>
        <button onClick={onLogout} style={styles.btnGhost}>Abmelden / Выйти</button>
      </header>

      <nav style={styles.tabs} data-admin-tabs>
        {(["sermons", "photos", "books", "assets", "verses", "events", "design", "stats"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}>
            {t === "sermons" ? "Проповеди" : t === "photos" ? "Фото" : t === "books" ? "Книги" : t === "assets" ? "Баннер и лого" : t === "verses" ? "Стихи" : t === "events" ? "📅 События" : t === "design" ? "🎨 ИИ дизайн" : "📊 Статистика"}
            {t !== "stats" && t !== "design" && <span style={styles.count}>{content[t as ContentTab].length}</span>}
          </button>
        ))}
      </nav>

      {msg && (
        <div
          role="status"
          aria-live="polite"
          onClick={() => setMsg(null)}
          style={{
            position: "fixed",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            maxWidth: "calc(100vw - 24px)",
            padding: "12px 18px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 14,
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            cursor: "pointer",
            background: msg.kind === "ok" ? "#e8f5e9" : "#fde7e7",
            color: msg.kind === "ok" ? "#2e7d32" : "#b71c1c",
            border: `1px solid ${msg.kind === "ok" ? "#a5d6a7" : "#f5b3b3"}`,
          }}
        >
          {msg.text}
        </div>
      )}

      {loading ? (
        <p>Lädt… / Загрузка…</p>
      ) : tab === "sermons" ? (
        <SermonsTab items={content.sermons} password={password} onSave={(items) => persist({ ...content, sermons: items })} onDelete={(id) => handleDelete("sermons", id)} onError={(m) => flash("err", m)} />
      ) : tab === "photos" ? (
        <PhotosTab items={content.photos} password={password} onSave={(items) => persist({ ...content, photos: items })} onDelete={(id) => handleDelete("photos", id)} onError={(m) => flash("err", m)} onOk={(m) => flash("ok", m)} />
      ) : tab === "books" ? (
        <BooksTab items={content.books} password={password} onSave={(items) => persist({ ...content, books: items })} onDelete={(id) => handleDelete("books", id)} onError={(m) => flash("err", m)} />
      ) : tab === "assets" ? (
        <AssetsTab items={content.assets} password={password} onSave={(items) => persist({ ...content, assets: items })} onDelete={(id) => handleDelete("assets", id)} onError={(m) => flash("err", m)} onOk={(m) => flash("ok", m)} />
      ) : tab === "verses" ? (
        <VersesTab items={content.verses} onSave={(items) => persist({ ...content, verses: items })} onDelete={(id) => handleDelete("verses", id)} onError={(m) => flash("err", m)} />
      ) : tab === "events" ? (
        <EventsTab items={content.events} onSave={(items) => persist({ ...content, events: items })} onDelete={(id) => handleDelete("events", id)} onError={(m) => flash("err", m)} />
      ) : tab === "design" ? (
        <DesignTab password={password} onError={(m) => flash("err", m)} onOk={(m) => flash("ok", m)} />
      ) : (
        <StatsTab password={password} onError={(m) => flash("err", m)} />
      )}
    </div>
  );
}

/* ---------------- FileDrop (drag & drop + click to select) ---------------- */

function FileDrop({
  accept,
  multiple = false,
  hint,
  files,
  onFiles,
}: {
  accept: string;
  multiple?: boolean;
  hint: string;
  files: File[];
  onFiles: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDrag(false);
    const list = Array.from(e.dataTransfer.files ?? []);
    if (list.length) onFiles(multiple ? list : [list[0]]);
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        style={{
          ...styles.dropzone,
          background: drag ? "#eef7ee" : "#fafaf7",
          borderColor: drag ? "#2a5c27" : "#c8ccc0",
        }}
      >
        <div style={{ fontSize: 32, lineHeight: 1 }}>📁</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#2a5c27", marginTop: 8 }}>
          Файл выбрать / Datei auswählen
        </div>
        <div style={{ fontSize: 12, color: "#777", marginTop: 4 }}>
          нажмите или перетащите сюда · {hint}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          style={{ display: "none" }}
          onChange={(e) => {
            const list = Array.from(e.target.files ?? []);
            if (list.length) onFiles(multiple ? list : [list[0]]);
          }}
        />
      </div>
      {files.length > 0 && (
        <ul style={styles.fileList}>
          {files.map((f, i) => (
            <li key={i} style={styles.fileRow}>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                📄 {f.name}
              </span>
              <span style={{ color: "#777", fontSize: 12 }}>{(f.size / 1024 / 1024).toFixed(1)} MB</span>
              <button
                type="button"
                onClick={() => onFiles(files.filter((_, j) => j !== i))}
                style={styles.fileRemove}
                aria-label="Удалить"
              >×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- Tabs ---------------- */

function SermonsTab({ items, password, onSave, onDelete, onError }: {
  items: Sermon[]; password: string; onSave: (i: Sermon[]) => void; onDelete: (id: string) => void; onError: (m: string) => void;
}) {
  const [f, setF] = useState({ preacher: "", date: "", title: "", scripture: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (files.length === 0) return onError("Выберите MP3-файл / MP3-Datei auswählen.");
    setBusy(true);
    setUploadProgress(0);
    try {
      const up = await uploadFile(password, "sermons", files[0], ({ percent }) => setUploadProgress(percent));
      const item: Sermon = { id: newId(), ...f, fileUrl: up.url, createdAt: new Date().toISOString() };
      onSave([item, ...items]);
      setF({ preacher: "", date: "", title: "", scripture: "" });
      setFiles([]);
    } catch (err) { onError((err as Error).message); }
    finally { setBusy(false); setUploadProgress(null); }
  }

  return (
    <div style={styles.grid} data-admin-grid>
      <form onSubmit={submit} style={styles.card} data-admin-card>
        <h2 style={styles.h2}>➕ Новая проповедь / Neue Predigt</h2>
        <Field label="Prediger / Проповедник"><input required style={styles.input} value={f.preacher} onChange={(e) => setF({ ...f, preacher: e.target.value })} /></Field>
        <Field label="Jahr / Год"><input type="number" min="1900" max="2100" step="1" style={styles.input} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} placeholder="напр. 2025" /></Field>
        <Field label="Titel / Название"><input required style={styles.input} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
        <Field label="Bibeltext / Библейский текст"><input style={styles.input} value={f.scripture} onChange={(e) => setF({ ...f, scripture: e.target.value })} placeholder="напр. Johannes 3,16" /></Field>
        <Field label="Аудио-файл / MP3">
          <FileDrop
            accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,.mp3,.m4a,.wav,.ogg"
            hint="MP3, M4A, WAV, OGG · проповеди 1–2 часа · до 2 GB"
            files={files}
            onFiles={setFiles}
          />
        </Field>
        {uploadProgress !== null && (
          <div style={{ fontSize: 13, color: "#2a5c27", marginBottom: 8 }}>
            Загрузка проповеди: {uploadProgress}% — не закрывайте страницу
          </div>
        )}
        <button disabled={busy} type="submit" style={styles.btnPrimary}>{busy ? "Загрузка…" : "Добавить / Hinzufügen"}</button>
      </form>
      <div style={styles.card} data-admin-card>
        <h2 style={styles.h2}>Все проповеди ({items.length})</h2>
        {items.length === 0 ? <p style={styles.empty}>Пока нет проповедей.</p> : items.map((s) => (
          <div key={s.id} style={styles.item}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={styles.itemTitle}>{s.title}</div>
              <div style={styles.itemMeta}>{s.preacher} · {s.date}{s.scripture ? ` · ${s.scripture}` : ""}</div>
              <audio controls src={s.fileUrl} style={{ marginTop: 6, width: "100%" }} />
            </div>
            <button onClick={() => onDelete(s.id)} style={styles.btnDanger}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const PHOTO_CATEGORIES: { key: NonNullable<Photo["category"]>; label: string }[] = [
  { key: "harvest",      label: "Жатва / Erntedankfest" },
  { key: "christmas",    label: "Рождество / Weihnachten" },
  { key: "easter",       label: "Пасха / Ostern" },
  { key: "children",     label: "Детское служение / Kinderdienst" },
  { key: "women",        label: "Женский завтрак / Frauenfrühstück" },
  { key: "construction", label: "Строительство церкви / Kirchenbau" },
  { key: "trips",        label: "Поездки / Reisen" },
  { key: "other",        label: "Разное / Sonstiges" },
];

function PhotosTab({ items, password, onSave, onDelete, onError, onOk }: {
  items: Photo[]; password: string; onSave: (i: Photo[]) => void; onDelete: (id: string) => void; onError: (m: string) => void; onOk: (m: string) => void;
}) {
  const [f, setF] = useState<{ category: NonNullable<Photo["category"]>; date: string; description: string }>({
    category: "other", date: "", description: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (files.length === 0) return onError("Выберите фото / Bilder auswählen.");
    setBusy(true);
    setProgress({ done: 0, total: files.length });
    const uploaded: Photo[] = [];
    const albumLabel = PHOTO_CATEGORIES.find((c) => c.key === f.category)?.label ?? f.category;
    try {
      for (let i = 0; i < files.length; i++) {
        const up = await uploadFile(password, "photos", files[i]);
        uploaded.push({
          id: newId(),
          album: albumLabel,
          category: f.category,
          date: f.date,
          description: f.description,
          fileUrl: up.url,
          createdAt: new Date().toISOString(),
        });
        setProgress({ done: i + 1, total: files.length });
      }
      onSave([...uploaded, ...items]);
      onOk(`Загружено ${uploaded.length} фото ✓`);
      setF({ category: f.category, date: "", description: "" });
      setFiles([]);
    } catch (err) {
      if (uploaded.length > 0) onSave([...uploaded, ...items]);
      onError((err as Error).message);
    }
    finally { setBusy(false); setProgress(null); }
  }

  const grouped: Record<string, Photo[]> = {};
  for (const p of items) {
    const k = p.category || "other";
    (grouped[k] ||= []).push(p);
  }
  const catLabel = (k: string) => PHOTO_CATEGORIES.find((c) => c.key === k)?.label ?? k;

  return (
    <div style={styles.grid} data-admin-grid>
      <form onSubmit={submit} style={styles.card} data-admin-card>
        <h2 style={styles.h2}>➕ Новые фото / Neue Fotos</h2>
        <Field label="Категория / Kategorie">
          <select
            style={styles.input}
            value={f.category}
            onChange={(e) => setF({ ...f, category: e.target.value as NonNullable<Photo["category"]> })}
          >
            {PHOTO_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Jahr / Год"><input type="number" min="1900" max="2100" step="1" style={styles.input} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} placeholder="напр. 2025" /></Field>
        <Field label="Beschreibung / Описание"><textarea style={{ ...styles.input, minHeight: 70 }} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
        <Field label="Изображения / Bilder (можно несколько)">
          <FileDrop
            accept="image/*"
            multiple
            hint="JPG, PNG, WEBP · выберите сразу несколько"
            files={files}
            onFiles={setFiles}
          />
        </Field>
        {progress && (
          <div style={{ fontSize: 13, color: "#2a5c27", marginBottom: 8 }}>
            Загрузка {progress.done} / {progress.total}…
          </div>
        )}
        <button disabled={busy} type="submit" style={styles.btnPrimary}>
          {busy ? "Загрузка…" : `Добавить ${files.length > 0 ? `(${files.length})` : ""}`.trim()}
        </button>
      </form>
      <div style={styles.card} data-admin-card>
        <h2 style={styles.h2}>Все фото ({items.length})</h2>
        {items.length === 0 ? <p style={styles.empty}>Пока нет фото.</p> : (
          Object.keys(grouped).map((cat) => (
            <div key={cat} style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#2a5c27", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {catLabel(cat)}
                <span style={{ ...styles.count, marginLeft: 8 }}>{grouped[cat].length}</span>
              </div>
              <div style={styles.photoGrid} data-admin-photogrid>
                {grouped[cat].map((p) => (
                  <div key={p.id} style={styles.photoCard}>
                    <img src={p.fileUrl} alt={p.album} style={styles.photoImg} loading="lazy" />
                    <div style={{ padding: 8 }}>
                      <div style={{ ...styles.itemTitle, fontSize: 13 }}>{p.album}</div>
                      <div style={{ ...styles.itemMeta, fontSize: 12 }}>{p.date}</div>
                      <button onClick={() => onDelete(p.id)} style={{ ...styles.btnDanger, marginTop: 6, width: "100%" }}>Удалить</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function BooksTab({ items, password, onSave, onDelete, onError }: {
  items: Book[]; password: string; onSave: (i: Book[]) => void; onDelete: (id: string) => void; onError: (m: string) => void;
}) {
  const [f, setF] = useState({ author: "", title: "", description: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (files.length === 0) return onError("Выберите файл PDF/EPUB.");
    setBusy(true);
    try {
      const up = await uploadFile(password, "books", files[0]);
      const item: Book = { id: newId(), ...f, fileUrl: up.url, createdAt: new Date().toISOString() };
      onSave([item, ...items]);
      setF({ author: "", title: "", description: "" });
      setFiles([]);
    } catch (err) { onError((err as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <div style={styles.grid} data-admin-grid>
      <form onSubmit={submit} style={styles.card} data-admin-card>
        <h2 style={styles.h2}>➕ Новая книга / Neues Buch</h2>
        <Field label="Autor / Автор"><input required style={styles.input} value={f.author} onChange={(e) => setF({ ...f, author: e.target.value })} /></Field>
        <Field label="Titel / Название"><input required style={styles.input} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
        <Field label="Beschreibung / Описание"><textarea style={{ ...styles.input, minHeight: 90 }} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
        <Field label="Файл / Datei (PDF, EPUB, MOBI)">
          <FileDrop
            accept=".pdf,.epub,.mobi,application/pdf,application/epub+zip"
            hint="PDF, EPUB, MOBI (до 200 MB)"
            files={files}
            onFiles={setFiles}
          />
        </Field>
        <button disabled={busy} type="submit" style={styles.btnPrimary}>{busy ? "Загрузка…" : "Добавить / Hinzufügen"}</button>
      </form>
      <div style={styles.card} data-admin-card>
        <h2 style={styles.h2}>Все книги ({items.length})</h2>
        {items.length === 0 ? <p style={styles.empty}>Пока нет книг.</p> : items.map((b) => (
          <div key={b.id} style={styles.item}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={styles.itemTitle}>{b.title}</div>
              <div style={styles.itemMeta}>{b.author}</div>
              {b.description && <p style={{ margin: "6px 0 0", fontSize: 13, color: "#444" }}>{b.description}</p>}
              <a href={b.fileUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#2a5c27" }}>Открыть файл ↗</a>
            </div>
            <button onClick={() => onDelete(b.id)} style={styles.btnDanger}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssetsTab({ items, password, onSave, onDelete, onError, onOk }: {
  items: Asset[]; password: string; onSave: (i: Asset[]) => void; onDelete: (id: string) => void; onError: (m: string) => void; onOk: (m: string) => void;
}) {
  const [f, setF] = useState({ category: "banner", name: "", description: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  function categoryForFile(file: File): string {
    const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|mov|m4v|ogv|3gp|3gpp)$/i.test(file.name);
    if (isVideo && f.category === "banner") return "banner-video";
    if (!isVideo && f.category === "banner-video") return "banner";
    return f.category;
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (files.length === 0) return onError("Выберите файл / Datei auswählen.");
    setBusy(true);
    setProgress({ done: 0, total: files.length });
    const uploaded: Asset[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const up = await uploadFile(password, "assets", files[i]);
        const category = categoryForFile(files[i]);
        uploaded.push({
          id: newId(),
          category,
          name: f.name || files[i].name,
          description: f.description,
          fileUrl: up.url,
          createdAt: new Date().toISOString(),
        });
        setProgress({ done: i + 1, total: files.length });
      }
      onSave([...uploaded, ...items]);
      onOk(`Загружено ${uploaded.length} файлов ✓`);
      setF({ category: f.category, name: "", description: "" });
      setFiles([]);
    } catch (err) {
      if (uploaded.length > 0) onSave([...uploaded, ...items]);
      onError((err as Error).message);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  const grouped: Record<string, Asset[]> = {};
  for (const a of items) {
    const k = a.category || "other";
    (grouped[k] ||= []).push(a);
  }

  async function copyUrl(url: string) {
    const full = window.location.origin + url;
    try {
      await navigator.clipboard.writeText(full);
      onOk("URL скопирован ✓");
    } catch {
      onError("Не удалось скопировать");
    }
  }

  return (
    <div style={styles.grid} data-admin-grid>
      <form onSubmit={submit} style={styles.card} data-admin-card>
        <h2 style={styles.h2}>➕ Баннер, видео или лого / Banner, Video oder Logo</h2>
        <Field label="Kategorie / Категория">
          <select
            style={styles.input}
            value={f.category}
            onChange={(e) => setF({ ...f, category: e.target.value })}
          >
            <option value="banner">Баннер / Banner</option>
            <option value="banner-video">Видео для баннера / Banner-Video</option>
            <option value="logo">Логотип / Logo</option>
            <option value="other">Другое / Sonstige</option>
          </select>
        </Field>
        <Field label="Name / Название (необязательно)">
          <input style={styles.input} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="напр. Hauptbanner Startseite" />
        </Field>
        <Field label="Beschreibung / Описание">
          <textarea style={{ ...styles.input, minHeight: 60 }} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
        </Field>
        <Field label="Файлы / Dateien (изображения или видео, можно несколько)">
          <FileDrop
            accept="image/*,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif,.svg,video/*,video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v,.ogv,.3gp,.3gpp"
            multiple
            hint="iPhone фото/видео, JPG, PNG, WEBP, SVG, MP4, WEBM, MOV · до 2 GB"
            files={files}
            onFiles={setFiles}
          />
        </Field>
        {progress && (
          <div style={{ fontSize: 13, color: "#2a5c27", marginBottom: 8 }}>
            Загрузка {progress.done} / {progress.total}…
          </div>
        )}
        <button disabled={busy} type="submit" style={styles.btnPrimary}>
          {busy ? "Загрузка…" : `Добавить ${files.length > 0 ? `(${files.length})` : ""}`.trim()}
        </button>
      </form>
      <div style={styles.card} data-admin-card>
        <h2 style={styles.h2}>Все изображения ({items.length})</h2>
        {items.length === 0 ? (
          <p style={styles.empty}>Пока нет изображений.</p>
        ) : (
          Object.keys(grouped).map((cat) => (
            <div key={cat} style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#2a5c27", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {cat === "banner" ? "Баннеры" : cat === "banner-video" ? "Видео-баннеры" : cat === "logo" ? "Логотипы" : cat}
                <span style={{ ...styles.count, marginLeft: 8 }}>{grouped[cat].length}</span>
              </div>
              <div style={styles.photoGrid} data-admin-photogrid>
                {grouped[cat].map((a) => {
                  const isVideo = /\.(mp4|webm|mov|m4v|ogv|3gp|3gpp)$/i.test(a.fileUrl);
                  return (
                  <div key={a.id} style={styles.photoCard}>
                    {isVideo ? (
                      <video src={a.fileUrl} style={styles.photoImg} controls preload="metadata" muted playsInline />
                    ) : (
                      <img src={a.fileUrl} alt={a.name} style={styles.photoImg} loading="lazy" />
                    )}
                    <div style={{ padding: 8 }}>
                      <div style={{ ...styles.itemTitle, fontSize: 13 }}>{a.name}</div>
                      {a.description && <div style={{ ...styles.itemMeta, fontSize: 12 }}>{a.description}</div>}
                      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                        <button type="button" onClick={() => copyUrl(a.fileUrl)} style={{ ...styles.btnGhost, flex: 1, fontSize: 12, padding: "6px 8px" }}>URL</button>
                        <button onClick={() => onDelete(a.id)} style={{ ...styles.btnDanger, flex: 1, fontSize: 12, padding: "6px 8px" }}>Удалить</button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function VersesTab({ items, onSave, onDelete, onError }: {
  items: Verse[]; onSave: (i: Verse[]) => void; onDelete: (id: string) => void; onError: (m: string) => void;
}) {
  const [f, setF] = useState({ title: "", author: "", category: "", text: "" });
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!f.title.trim() || !f.text.trim()) return onError("Введите название и текст стиха.");
    setBusy(true);
    try {
      const item: Verse = {
        id: newId(),
        title: f.title.trim(),
        author: f.author.trim(),
        category: f.category.trim() || "Разное",
        text: f.text,
        createdAt: new Date().toISOString(),
      };
      onSave([item, ...items]);
      setF({ title: "", author: "", category: "", text: "" });
    } finally { setBusy(false); }
  }

  const filtered = items.filter((v) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return v.title.toLowerCase().includes(q) || v.author.toLowerCase().includes(q) || v.category.toLowerCase().includes(q);
  });

  return (
    <div style={styles.grid} data-admin-grid>
      <form onSubmit={submit} style={styles.card} data-admin-card>
        <h2 style={styles.h2}>➕ Новый стих / Neues Gedicht</h2>
        <Field label="Titel / Название">
          <input required style={styles.input} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        </Field>
        <Field label="Autor / Автор">
          <input style={styles.input} value={f.author} onChange={(e) => setF({ ...f, author: e.target.value })} placeholder="напр. Алина Роот" />
        </Field>
        <Field label="Kategorie / Категория">
          <input style={styles.input} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} placeholder="напр. Покаяние и спасение" list="verse-cats" />
          <datalist id="verse-cats">
            <option value="Покаяние и спасение" />
            <option value="Благодарение" />
            <option value="Голгофа" />
            <option value="Кто такой Христос" />
            <option value="Христианину на заметку" />
            <option value="Небесная жизнь" />
            <option value="Размышления о вере" />
            <option value="Разное" />
          </datalist>
        </Field>
        <Field label="Текст стиха / Text">
          <textarea
            required
            style={{ ...styles.input, minHeight: 220, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, lineHeight: 1.5 }}
            value={f.text}
            onChange={(e) => setF({ ...f, text: e.target.value })}
            placeholder="Каждая строка с новой строки. Пустая строка — новая строфа."
          />
        </Field>
        <button disabled={busy} type="submit" style={styles.btnPrimary}>
          {busy ? "Сохранение…" : "Добавить / Hinzufügen"}
        </button>
      </form>
      <div style={styles.card} data-admin-card>
        <h2 style={styles.h2}>Все стихи ({items.length})</h2>
        <input
          type="search"
          placeholder="Поиск по названию, автору, категории…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ ...styles.input, marginBottom: 12 }}
        />
        {filtered.length === 0 ? (
          <p style={styles.empty}>{items.length === 0 ? "Пока нет стихов." : "Ничего не найдено."}</p>
        ) : filtered.map((v) => (
          <div key={v.id} style={styles.item}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={styles.itemTitle}>{v.title}</div>
              <div style={styles.itemMeta}>
                {v.author && <>{v.author} · </>}
                <span style={{ fontStyle: "italic" }}>{v.category}</span>
              </div>
              <details style={{ marginTop: 6 }}>
                <summary style={{ cursor: "pointer", fontSize: 13, color: "#2a5c27" }}>Показать текст</summary>
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, lineHeight: 1.5, marginTop: 8, background: "#fafaf7", padding: 10, borderRadius: 6 }}>{v.text}</pre>
              </details>
            </div>
            <button onClick={() => onDelete(v.id)} style={styles.btnDanger}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- EventsTab (календарь событий) ---------------- */

function EventsTab({ items, onSave, onDelete, onError }: {
  items: EventItem[]; onSave: (i: EventItem[]) => void; onDelete: (id: string) => void; onError: (m: string) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({ date: today, time: "", title: "", note: "", cancel: false });
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!f.date) return onError("Укажите дату / Datum angeben.");
    if (!f.cancel && !f.title.trim()) return onError("Введите название события / Titel angeben.");
    setBusy(true);
    try {
      const item: EventItem = {
        id: newId(),
        date: f.date,
        time: f.time.trim() || undefined,
        title: f.cancel ? (f.title.trim() || "— отменено —") : f.title.trim(),
        note: f.note.trim() || undefined,
        cancel: f.cancel || undefined,
        createdAt: new Date().toISOString(),
      };
      onSave([item, ...items]);
      setF({ date: today, time: "", title: "", note: "", cancel: false });
    } finally { setBusy(false); }
  }

  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div style={styles.grid} data-admin-grid>
      <form onSubmit={submit} style={styles.card} data-admin-card>
        <h2 style={styles.h2}>➕ Новое событие / Neuer Termin</h2>
        <p style={{ fontSize: 13, color: "#666", marginTop: -6, marginBottom: 12 }}>
          Регулярные служения (Вс 10:00, Ср 18:00, Пт 18:00) добавляются автоматически. Здесь можно добавить особые даты (праздники, поездки), пометки или отменить регулярное служение на конкретный день.
        </p>
        <Field label="Datum / Дата">
          <input required type="date" style={styles.input} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
        </Field>
        <Field label="Uhrzeit / Время (напр. 18:00)">
          <input style={styles.input} value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} placeholder="18:00" />
        </Field>
        <Field label="Titel / Название">
          <input style={styles.input} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="напр. Weihnachten — Festgottesdienst" />
        </Field>
        <Field label="Anmerkung / Пометка">
          <input style={styles.input} value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="напр. с общим обедом" />
        </Field>
        <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, fontSize: 14 }}>
          <input type="checkbox" checked={f.cancel} onChange={(e) => setF({ ...f, cancel: e.target.checked })} />
          Отменить регулярное служение на эту дату / Regelmäßigen Gottesdienst absagen
        </label>
        <button disabled={busy} type="submit" style={styles.btnPrimary}>
          {busy ? "Сохранение…" : "Добавить / Hinzufügen"}
        </button>
      </form>

      <div style={styles.card} data-admin-card>
        <h2 style={styles.h2}>Все записи ({items.length})</h2>
        {sorted.length === 0 ? (
          <p style={styles.empty}>Пока нет записей. Регулярные служения показываются автоматически.</p>
        ) : sorted.map((ev) => (
          <div key={ev.id} style={styles.item}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={styles.itemTitle}>
                {ev.cancel ? "❌ " : "📌 "}{ev.date}{ev.time ? ` · ${ev.time}` : ""} — {ev.title}
              </div>
              {ev.note && <div style={styles.itemMeta}>{ev.note}</div>}
              {ev.cancel && <div style={{ ...styles.itemMeta, color: "#b71c1c" }}>Отмена регулярного служения</div>}
            </div>
            <button onClick={() => onDelete(ev.id)} style={styles.btnDanger}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}


function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", fontSize: 13, color: "#444", marginBottom: 4, fontWeight: 500 }}>{label}</span>
      {children}
    </label>
  );
}

/* ---------------- StatsTab (anonyme Reichweitenmessung) ---------------- */

const PATH_LABELS: Record<string, string> = {
  "/": "Главная / Startseite",
  "/contact": "Контакты / Kontakt",
  "/gallery": "Фото / Fotos",
  "/sermons": "Проповеди / Predigten",
  "/books": "Книги / Bücher",
  "/verses": "Стихи / Gedichte",
  "/confession": "Вероисповедание / Glaubensbekenntnis",
  "/services": "Богослужения / Gottesdienste",
  "/map": "Карта / Anfahrt",
  "/impressum": "Impressum",
  "/datenschutz": "Datenschutz",
};

function StatsTab({ password, onError }: { password: string; onError: (m: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof fetchStats>> | null>(null);

  async function reload() {
    setLoading(true);
    try { setStats(await fetchStats(password)); }
    catch (e) { onError((e as Error).message); }
    finally { setLoading(false); }
  }
  useEffect(() => { reload(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const topPaths = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.paths).sort((a, b) => b[1] - a[1]);
  }, [stats]);
  const topPhotos = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.items).filter(([k]) => k.startsWith("photo:")).sort((a, b) => b[1] - a[1]).slice(0, 20);
  }, [stats]);
  const topVerses = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.items).filter(([k]) => k.startsWith("verse:")).sort((a, b) => b[1] - a[1]).slice(0, 20);
  }, [stats]);
  const last30 = useMemo(() => {
    if (!stats) return [] as [string, { views: number; unique: number }][];
    return Object.entries(stats.daily).sort((a, b) => a[0].localeCompare(b[0])).slice(-30);
  }, [stats]);
  const maxDaily = Math.max(1, ...last30.map(([, v]) => v.views));

  if (loading) return <p>Загрузка статистики…</p>;
  if (!stats) return <p>Нет данных.</p>;

  const KpiCard = ({ label, value }: { label: string; value: number | string }) => (
    <div style={{ background: "#fff", border: "1px solid #e2e2dc", borderRadius: 10, padding: 18, flex: "1 1 180px" }}>
      <div style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: .5 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6, color: "#2a5c27" }}>{value}</div>
    </div>
  );

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <p style={{ margin: 0, color: "#666", fontSize: 13 }}>
          Анонимная статистика · без IP, без cookies · с {stats.since}
        </p>
        <button onClick={reload} style={styles.btnGhost}>↻ Обновить</button>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <KpiCard label="Всего посещений" value={stats.total.toLocaleString("ru")} />
        <KpiCard label="Уникальных посещений" value={stats.unique_total.toLocaleString("ru")} />
        <KpiCard label="Сегодня" value={(last30[last30.length - 1]?.[1].views ?? 0).toLocaleString("ru")} />
        <KpiCard label="Дней с данными" value={Object.keys(stats.daily).length} />
      </div>

      <div style={styles.card} data-admin-card>
        <h2 style={styles.h2}>📈 Посещения — последние 30 дней</h2>
        {last30.length === 0 ? (
          <p style={styles.empty}>Пока нет данных.</p>
        ) : (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 140, marginTop: 8 }}>
            {last30.map(([day, v]) => (
              <div key={day} title={`${day}: ${v.views} посещений (${v.unique} уникальных)`}
                   style={{ flex: 1, background: "#2a5c27", opacity: .35 + .65 * (v.views / maxDaily), minHeight: 2, height: `${(v.views / maxDaily) * 100}%`, borderRadius: "3px 3px 0 0" }} />
            ))}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "#888" }}>
          <span>{last30[0]?.[0]}</span>
          <span>{last30[last30.length - 1]?.[0]}</span>
        </div>
      </div>

      <div style={styles.card} data-admin-card>
        <h2 style={styles.h2}>📄 Самые посещаемые страницы</h2>
        {topPaths.length === 0 ? <p style={styles.empty}>Пока нет данных.</p> : (
          <StatBars rows={topPaths} labelFor={(k) => PATH_LABELS[k] || k} />
        )}
      </div>

      <div style={styles.card} data-admin-card>
        <h2 style={styles.h2}>🖼️ Самые просматриваемые фото</h2>
        {topPhotos.length === 0 ? <p style={styles.empty}>Пока нет данных.</p> : (
          <StatBars rows={topPhotos} labelFor={(k) => k.replace(/^photo:/, "")} />
        )}
      </div>

      <div style={styles.card} data-admin-card>
        <h2 style={styles.h2}>📜 Самые читаемые стихи</h2>
        {topVerses.length === 0 ? <p style={styles.empty}>Пока нет данных.</p> : (
          <StatBars rows={topVerses} labelFor={(k) => k.replace(/^verse:/, "")} />
        )}
      </div>

      <p style={{ fontSize: 12, color: "#888", margin: 0 }}>
        Данные полностью анонимны: не сохраняются IP-адреса, cookies или личные идентификаторы.
        Уникальные посещения считаются через ежедневный ротируемый хэш (удаляется через 48 ч).
        Учитываются только посетители-люди (боты и Do-Not-Track исключаются).
      </p>
    </div>
  );
}

function StatBars({ rows, labelFor }: { rows: [string, number][]; labelFor: (k: string) => string }) {
  const max = Math.max(1, ...rows.map(([, v]) => v));
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: "grid", gridTemplateColumns: "minmax(140px, 1fr) 3fr 60px", gap: 10, alignItems: "center" }}>
          <div style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={labelFor(k)}>{labelFor(k)}</div>
          <div style={{ background: "#f0f0ea", borderRadius: 4, overflow: "hidden", height: 18 }}>
            <div style={{ width: `${(v / max) * 100}%`, background: "#2a5c27", height: "100%" }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, textAlign: "right" }}>{v.toLocaleString("ru")}</div>
        </div>
      ))}
    </div>
  );
}


const styles: Record<string, React.CSSProperties> = {
  gateWrap: { minHeight: "100vh", display: "grid", placeItems: "center", background: "#f5f5f2", padding: 20 },
  gateBox: { background: "#fff", padding: 28, borderRadius: 10, width: "100%", maxWidth: 360, boxShadow: "0 4px 20px rgba(0,0,0,.06)" },
  wrap: { maxWidth: 1100, margin: "0 auto", padding: "24px 20px 80px", fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 20, flexWrap: "wrap" },
  tabs: { display: "flex", gap: 8, borderBottom: "1px solid #e2e2dc", marginBottom: 20, flexWrap: "wrap" },
  tab: { background: "transparent", border: 0, padding: "10px 14px", cursor: "pointer", fontSize: 15, color: "#555", borderBottom: "2px solid transparent", display: "flex", alignItems: "center", gap: 8 },
  tabActive: { color: "#2a5c27", borderBottomColor: "#2a5c27", fontWeight: 600 },
  count: { background: "#eee", borderRadius: 10, padding: "1px 8px", fontSize: 12, color: "#555" },
  flash: { padding: "10px 14px", borderRadius: 6, marginBottom: 16, fontSize: 14 },
  grid: { display: "grid", gridTemplateColumns: "minmax(280px, 400px) 1fr", gap: 20, alignItems: "start" },
  card: { background: "#fff", border: "1px solid #e2e2dc", borderRadius: 10, padding: 20 },
  h2: { margin: "0 0 16px", fontSize: 17 },
  input: { width: "100%", padding: "9px 11px", fontSize: 14, border: "1px solid #d0d0c8", borderRadius: 6, background: "#fff", boxSizing: "border-box", fontFamily: "inherit" },
  btnPrimary: { background: "#2a5c27", color: "#fff", border: 0, padding: "12px 18px", borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%" },
  btnGhost: { background: "transparent", border: "1px solid #ccc", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 },
  btnDanger: { background: "#fff", border: "1px solid #d99", color: "#b33", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 13, alignSelf: "flex-start" },
  item: { display: "flex", gap: 12, padding: "12px 0", borderTop: "1px solid #f0f0ea" },
  itemTitle: { fontWeight: 600, fontSize: 15 },
  itemMeta: { fontSize: 13, color: "#666", marginTop: 2 },
  empty: { color: "#888", fontSize: 14, margin: 0 },
  photoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 },
  photoCard: { border: "1px solid #eee", borderRadius: 6, overflow: "hidden", background: "#fafafa" },
  photoImg: { width: "100%", height: 120, objectFit: "cover", display: "block" },
  dropzone: {
    border: "2px dashed #c8ccc0",
    borderRadius: 10,
    padding: "22px 16px",
    textAlign: "center",
    cursor: "pointer",
    transition: "background .15s, border-color .15s",
    userSelect: "none",
  },
  fileList: { listStyle: "none", padding: 0, margin: "10px 0 0", display: "flex", flexDirection: "column", gap: 6 },
  fileRow: { display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "#f5f7f3", border: "1px solid #e2e6dc", borderRadius: 6, fontSize: 13 },
  fileRemove: { border: 0, background: "transparent", color: "#b33", fontSize: 20, lineHeight: 1, cursor: "pointer", padding: "0 4px" },
};

/* ---------------- DesignTab (AI design assistant) ---------------- */

const THEME_KEY_LABELS: Array<[string, string, string]> = [
  ["--bg", "Фон страниц", "color"],
  ["--ink", "Основной текст", "color"],
  ["--ink-2", "Вторичный текст", "color"],
  ["--muted", "Приглушённый текст", "color"],
  ["--accent-sky", "Градиент — начало", "color"],
  ["--accent-lavender", "Градиент — конец", "color"],
  ["--gradient-accent", "Полный градиент (CSS)", "text"],
  ["--green-dark", "Тёмный акцент (футер)", "color"],
  ["--green-soft", "Мягкий акцент (фон)", "color"],
  ["--radius-card", "Скругление карточек", "text"],
  ["--radius-card-lg", "Крупное скругление", "text"],
  ["--shadow-soft", "Мягкая тень", "text"],
];

function DesignTab({ password, onError, onOk }: { password: string; onError: (m: string) => void; onOk: (m: string) => void }) {
  const [theme, setTheme] = useState<Record<string, string>>({});
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [aiResult, setAiResult] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    fetch("/api/theme.php").then((r) => r.json()).then((d) => setTheme(d.theme || {})).catch(() => {});
  }, []);

  async function ask() {
    if (!prompt.trim() || busy) return;
    setBusy(true);
    setAiResult(null);
    try {
      const { askAiTheme, applyTheme } = await import("@/lib/theme");
      const result = await askAiTheme(password, prompt.trim(), theme);
      if (!Object.keys(result).length) throw new Error("ИИ не вернул изменений. Уточните запрос.");
      setAiResult(result);
      // Показать предпросмотр сразу
      applyTheme(result);
    } catch (e) { onError((e as Error).message); }
    finally { setBusy(false); }
  }

  async function save() {
    if (!aiResult) return;
    setBusy(true);
    try {
      const { saveTheme } = await import("@/lib/theme");
      const merged = { ...theme, ...aiResult };
      const saved = await saveTheme(password, merged);
      setTheme(saved);
      setAiResult(null);
      setPrompt("");
      onOk("Тема сохранена ✓");
    } catch (e) { onError((e as Error).message); }
    finally { setBusy(false); }
  }

  async function cancelPreview() {
    setAiResult(null);
    const { applyTheme, clearAppliedTheme } = await import("@/lib/theme");
    clearAppliedTheme();
    applyTheme(theme);
  }

  async function resetAll() {
    if (!confirm("Сбросить всю тему к дефолтной?")) return;
    setBusy(true);
    try {
      const { resetTheme } = await import("@/lib/theme");
      await resetTheme(password);
      setTheme({});
      setAiResult(null);
      onOk("Тема сброшена ✓");
    } catch (e) { onError((e as Error).message); }
    finally { setBusy(false); }
  }

  function updateField(k: string, v: string) {
    setTheme((t) => ({ ...t, [k]: v }));
  }

  async function saveManual() {
    setBusy(true);
    try {
      const { saveTheme } = await import("@/lib/theme");
      const saved = await saveTheme(password, theme);
      setTheme(saved);
      onOk("Тема сохранена ✓");
    } catch (e) { onError((e as Error).message); }
    finally { setBusy(false); }
  }

  const examples = [
    "Сделай фон светло-бежевым, а текст тёмно-коричневым",
    "Кнопки — оранжевый градиент от #FFB86B до #FF7A00",
    "Увеличь скругления карточек до 32px",
    "Строгая классическая тема: тёмно-синий и белый",
    "Тёплая осенняя палитра",
  ];

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ background: "#fff", border: "1px solid #e2e6dc", borderRadius: 12, padding: 20 }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 17 }}>🤖 Опишите, что изменить</h3>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "#666" }}>
          ИИ подберёт цвета, градиенты и скругления. Меняется только оформление — тексты и структура сайта остаются.
        </p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Например: сделай кнопки зелёными, а фон футера тёмно-серым"
          rows={3}
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #d5d9cc", fontSize: 14, fontFamily: "inherit", resize: "vertical" }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "10px 0" }}>
          {examples.map((ex) => (
            <button key={ex} onClick={() => setPrompt(ex)} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 999, border: "1px solid #d5d9cc", background: "#f7f8f4", cursor: "pointer" }}>
              {ex}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={ask} disabled={busy || !prompt.trim()} style={{ ...styles.btnPrimary, opacity: busy || !prompt.trim() ? 0.6 : 1 }}>
            {busy ? "…" : "✨ Сгенерировать"}
          </button>
          {aiResult && (
            <>
              <button onClick={save} disabled={busy} style={{ ...styles.btnPrimary, background: "#2e7d32" }}>💾 Применить и сохранить</button>
              <button onClick={cancelPreview} disabled={busy} style={styles.btnGhost}>Отменить предпросмотр</button>
            </>
          )}
        </div>
        {aiResult && (
          <div style={{ marginTop: 14, padding: 12, background: "#f5f7f3", borderRadius: 8, fontSize: 13 }}>
            <b>Предпросмотр применён.</b> ИИ предлагает изменить:
            <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
              {Object.entries(aiResult).map(([k, v]) => (
                <li key={k}><code>{k}</code> → <code>{v}</code></li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e6dc", borderRadius: 12, padding: 20 }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 17 }}>🎨 Тонкая настройка вручную</h3>
        <div style={{ display: "grid", gap: 10 }}>
          {THEME_KEY_LABELS.map(([key, label, kind]) => (
            <label key={key} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center", fontSize: 13 }}>
              <span>{label} <code style={{ color: "#888" }}>{key}</code></span>
              {kind === "color" ? (
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input
                    type="color"
                    value={/^#([0-9a-f]{6})$/i.test(theme[key] || "") ? (theme[key] as string) : "#000000"}
                    onChange={(e) => updateField(key, e.target.value)}
                    style={{ width: 40, height: 32, border: "1px solid #d5d9cc", borderRadius: 6, padding: 0, cursor: "pointer" }}
                  />
                  <input
                    type="text"
                    value={theme[key] || ""}
                    placeholder="#RRGGBB"
                    onChange={(e) => updateField(key, e.target.value)}
                    style={{ width: 130, padding: "6px 8px", border: "1px solid #d5d9cc", borderRadius: 6, fontSize: 13, fontFamily: "monospace" }}
                  />
                </span>
              ) : (
                <input
                  type="text"
                  value={theme[key] || ""}
                  onChange={(e) => updateField(key, e.target.value)}
                  style={{ width: 260, padding: "6px 8px", border: "1px solid #d5d9cc", borderRadius: 6, fontSize: 13, fontFamily: "monospace" }}
                />
              )}
            </label>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button onClick={saveManual} disabled={busy} style={styles.btnPrimary}>💾 Сохранить</button>
          <button onClick={resetAll} disabled={busy} style={{ ...styles.btnGhost, color: "#b33", borderColor: "#f5b3b3" }}>♻️ Сбросить всё</button>
        </div>
      </div>
    </div>
  );
}
