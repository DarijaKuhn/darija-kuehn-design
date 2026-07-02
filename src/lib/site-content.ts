// Local content API — talks to PHP endpoints in public/api/*.php.
// On Hetzner shared hosting the built site lives at the domain root,
// so relative URLs like "/api/save.php" resolve correctly in production.
// In local Vite dev the PHP endpoints don't run — the admin UI will show
// an error banner; that's expected.

export type Sermon = {
  id: string;
  preacher: string;
  date: string;      // ISO yyyy-mm-dd
  title: string;
  scripture: string;
  fileUrl: string;   // /uploads/sermons/xxx.mp3
  createdAt: string;
};

export type Photo = {
  id: string;
  album: string;
  date: string;
  description: string;
  fileUrl: string;   // /uploads/photos/xxx.jpg
  createdAt: string;
};

export type Book = {
  id: string;
  author: string;
  title: string;
  description: string;
  fileUrl: string;   // /uploads/books/xxx.pdf
  createdAt: string;
};

export type SiteContent = {
  sermons: Sermon[];
  photos: Photo[];
  books: Book[];
};

export const EMPTY_CONTENT: SiteContent = { sermons: [], photos: [], books: [] };

const JSON_URL = "/data/site-content.json";
const API_LOAD = "/api/save.php";
const API_SAVE = "/api/save.php";
const API_UPLOAD = "/api/upload.php";
const API_DELETE = "/api/delete.php";

export async function loadContent(): Promise<SiteContent> {
  // Prefer the static JSON (cache-busted) — fast, no PHP needed for public pages.
  try {
    const res = await fetch(`${JSON_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (res.ok) {
      const raw = (await res.json()) as Partial<SiteContent>;
      return {
        sermons: Array.isArray(raw.sermons) ? raw.sermons : [],
        photos:  Array.isArray(raw.photos)  ? raw.photos  : [],
        books:   Array.isArray(raw.books)   ? raw.books   : [],
      };
    }
  } catch {
    /* fall through */
  }
  // Fallback: PHP endpoint (works even if the JSON file was moved)
  try {
    const res = await fetch(API_LOAD, { cache: "no-store" });
    if (res.ok) return (await res.json()) as SiteContent;
  } catch {
    /* ignore */
  }
  return { ...EMPTY_CONTENT };
}

export async function saveContent(password: string, content: SiteContent): Promise<void> {
  const res = await fetch(API_SAVE, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Password": password },
    body: JSON.stringify(content),
  });
  if (!res.ok) throw new Error((await res.text()) || `Save failed (${res.status})`);
}

export async function uploadFile(
  password: string,
  type: "sermons" | "photos" | "books",
  file: File,
): Promise<{ url: string; filename: string; size: number }> {
  const fd = new FormData();
  fd.append("type", type);
  fd.append("file", file);
  const res = await fetch(API_UPLOAD, {
    method: "POST",
    headers: { "X-Admin-Password": password },
    body: fd,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.ok) throw new Error(json.error || `Upload failed (${res.status})`);
  return { url: json.url, filename: json.filename, size: json.size };
}

export async function deleteItem(
  password: string,
  type: "sermons" | "photos" | "books",
  id: string,
): Promise<void> {
  const res = await fetch(API_DELETE, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Password": password },
    body: JSON.stringify({ type, id }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.ok) throw new Error(json.error || `Delete failed (${res.status})`);
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
