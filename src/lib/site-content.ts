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

export type PhotoCategory =
  | "harvest" | "christmas" | "easter" | "children"
  | "women" | "construction" | "trips" | "other";

export type Photo = {
  id: string;
  album: string;
  category?: PhotoCategory;
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

export type Asset = {
  id: string;
  category: string;   // "banner" | "logo" | "other" | свободный текст
  name: string;
  description: string;
  fileUrl: string;    // /uploads/assets/xxx.png
  createdAt: string;
};

export type SiteContent = {
  sermons: Sermon[];
  photos: Photo[];
  books: Book[];
  assets: Asset[];
};

export const EMPTY_CONTENT: SiteContent = { sermons: [], photos: [], books: [], assets: [] };

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
        assets:  Array.isArray(raw.assets)  ? raw.assets  : [],
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
  type: "sermons" | "photos" | "books" | "assets",
  file: File,
  onProgress?: (progress: { loaded: number; total: number; percent: number }) => void,
): Promise<{ url: string; filename: string; size: number }> {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("type", type);
    fd.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", API_UPLOAD);
    xhr.setRequestHeader("X-Admin-Password", password);
    xhr.responseType = "json";

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress({
        loaded: event.loaded,
        total: event.total,
        percent: Math.round((event.loaded / event.total) * 100),
      });
    };

    xhr.onload = () => {
      const json = xhr.response || (() => {
        try { return JSON.parse(xhr.responseText); }
        catch { return {}; }
      })();
      if (xhr.status < 200 || xhr.status >= 300 || !json.ok) {
        reject(new Error(json.error || `Upload failed (${xhr.status})`));
        return;
      }
      resolve({ url: json.url, filename: json.filename, size: json.size });
    };

    xhr.onerror = () => reject(new Error("Соединение прервано во время загрузки. Попробуйте ещё раз или проверьте интернет."));
    xhr.ontimeout = () => reject(new Error("Загрузка заняла слишком много времени. Попробуйте ещё раз."));
    xhr.timeout = 30 * 60 * 1000;
    xhr.send(fd);
  });
}

export async function deleteItem(
  password: string,
  type: "sermons" | "photos" | "books" | "assets",
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
