import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef, type FormEvent, type DragEvent } from "react";
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
        <p style={{ color: "#666", margin: "8px 0 20px" }}>Passwort eingeben / Введите пароль.</p>
        <input
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setErr(false); }}
          placeholder="Passwort"
          autoFocus
          style={styles.input}
        />
        {err && <div style={{ color: "#c33", marginTop: 8, fontSize: 14 }}>Falsches Passwort / Неверный пароль.</div>}
        <button type="submit" style={{ ...styles.btnPrimary, marginTop: 16, width: "100%" }}>Anmelden / Войти</button>
      </form>
    </div>
  );
}

type Tab = "sermons" | "photos" | "books" | "assets" | "verses";

function Dashboard({ password, onLogout }: { password: string; onLogout: () => void }) {
  const [content, setContent] = useState<SiteContent>(EMPTY_CONTENT);
  const [tab, setTab] = useState<Tab>("sermons");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => { loadContent().then(setContent).finally(() => setLoading(false)); }, []);

  function flash(kind: "ok" | "err", text: string) {
    setMsg({ kind, text });
    window.setTimeout(() => setMsg(null), 5000);
  }

  async function persist(next: SiteContent) {
    setContent(next);
    try { await saveContent(password, next); flash("ok", "Gespeichert / Сохранено ✓"); }
    catch (e) { flash("err", (e as Error).message); }
  }

  async function handleDelete(type: Tab, id: string) {
    if (!confirm("Wirklich löschen? / Точно удалить?")) return;
    try {
      await deleteItem(password, type, id);
      setContent((c) => ({ ...c, [type]: c[type].filter((it: { id: string }) => it.id !== id) }));
      flash("ok", "Gelöscht / Удалено ✓");
    } catch (e) { flash("err", (e as Error).message); }
  }

  return (
    <div style={styles.wrap}>
      <header style={styles.header}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>FECG Dresden — Admin</h1>
          <p style={{ margin: "4px 0 0", color: "#666", fontSize: 13 }}>Загрузка файлов с компьютера · Hetzner-Server</p>
        </div>
        <button onClick={onLogout} style={styles.btnGhost}>Abmelden / Выйти</button>
      </header>

      <nav style={styles.tabs}>
        {(["sermons", "photos", "books", "assets", "verses"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}>
            {t === "sermons" ? "Проповеди" : t === "photos" ? "Фото" : t === "books" ? "Книги" : t === "assets" ? "Баннер и лого" : "Стихи"}
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
        <p>Lädt… / Загрузка…</p>
      ) : tab === "sermons" ? (
        <SermonsTab items={content.sermons} password={password} onSave={(items) => persist({ ...content, sermons: items })} onDelete={(id) => handleDelete("sermons", id)} onError={(m) => flash("err", m)} />
      ) : tab === "photos" ? (
        <PhotosTab items={content.photos} password={password} onSave={(items) => persist({ ...content, photos: items })} onDelete={(id) => handleDelete("photos", id)} onError={(m) => flash("err", m)} onOk={(m) => flash("ok", m)} />
      ) : tab === "books" ? (
        <BooksTab items={content.books} password={password} onSave={(items) => persist({ ...content, books: items })} onDelete={(id) => handleDelete("books", id)} onError={(m) => flash("err", m)} />
      ) : (
        <AssetsTab items={content.assets} password={password} onSave={(items) => persist({ ...content, assets: items })} onDelete={(id) => handleDelete("assets", id)} onError={(m) => flash("err", m)} onOk={(m) => flash("ok", m)} />
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
    <div style={styles.grid}>
      <form onSubmit={submit} style={styles.card}>
        <h2 style={styles.h2}>➕ Новая проповедь / Neue Predigt</h2>
        <Field label="Prediger / Проповедник"><input required style={styles.input} value={f.preacher} onChange={(e) => setF({ ...f, preacher: e.target.value })} /></Field>
        <Field label="Datum / Дата"><input required type="date" style={styles.input} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
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
      <div style={styles.card}>
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
    <div style={styles.grid}>
      <form onSubmit={submit} style={styles.card}>
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
        <Field label="Datum / Дата"><input type="date" style={styles.input} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
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
      <div style={styles.card}>
        <h2 style={styles.h2}>Все фото ({items.length})</h2>
        {items.length === 0 ? <p style={styles.empty}>Пока нет фото.</p> : (
          Object.keys(grouped).map((cat) => (
            <div key={cat} style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#2a5c27", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {catLabel(cat)}
                <span style={{ ...styles.count, marginLeft: 8 }}>{grouped[cat].length}</span>
              </div>
              <div style={styles.photoGrid}>
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
    <div style={styles.grid}>
      <form onSubmit={submit} style={styles.card}>
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
      <div style={styles.card}>
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

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (files.length === 0) return onError("Выберите файл / Datei auswählen.");
    setBusy(true);
    setProgress({ done: 0, total: files.length });
    const uploaded: Asset[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const up = await uploadFile(password, "assets", files[i]);
        uploaded.push({
          id: newId(),
          category: f.category,
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
    <div style={styles.grid}>
      <form onSubmit={submit} style={styles.card}>
        <h2 style={styles.h2}>➕ Новое изображение / Neues Bild</h2>
        <Field label="Kategorie / Категория">
          <select
            style={styles.input}
            value={f.category}
            onChange={(e) => setF({ ...f, category: e.target.value })}
          >
            <option value="banner">Баннер / Banner</option>
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
        <Field label="Изображения / Bilder (можно несколько)">
          <FileDrop
            accept="image/*,.svg"
            multiple
            hint="JPG, PNG, WEBP, SVG · до 200 MB"
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
      <div style={styles.card}>
        <h2 style={styles.h2}>Все изображения ({items.length})</h2>
        {items.length === 0 ? (
          <p style={styles.empty}>Пока нет изображений.</p>
        ) : (
          Object.keys(grouped).map((cat) => (
            <div key={cat} style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#2a5c27", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {cat === "banner" ? "Баннеры" : cat === "logo" ? "Логотипы" : cat}
                <span style={{ ...styles.count, marginLeft: 8 }}>{grouped[cat].length}</span>
              </div>
              <div style={styles.photoGrid}>
                {grouped[cat].map((a) => (
                  <div key={a.id} style={styles.photoCard}>
                    <img src={a.fileUrl} alt={a.name} style={styles.photoImg} loading="lazy" />
                    <div style={{ padding: 8 }}>
                      <div style={{ ...styles.itemTitle, fontSize: 13 }}>{a.name}</div>
                      {a.description && <div style={{ ...styles.itemMeta, fontSize: 12 }}>{a.description}</div>}
                      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                        <button type="button" onClick={() => copyUrl(a.fileUrl)} style={{ ...styles.btnGhost, flex: 1, fontSize: 12, padding: "6px 8px" }}>URL</button>
                        <button onClick={() => onDelete(a.id)} style={{ ...styles.btnDanger, flex: 1, fontSize: 12, padding: "6px 8px" }}>Удалить</button>
                      </div>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", fontSize: 13, color: "#444", marginBottom: 4, fontWeight: 500 }}>{label}</span>
      {children}
    </label>
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
