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

export type Verse = {
  id: string;
  title: string;
  author: string;
  category: string;
  text: string;
  createdAt: string;
};

export type EventItem = {
  id: string;
  date: string;         // ISO yyyy-mm-dd
  time?: string;        // "HH:mm" or free-form
  title: string;
  note?: string;
  cancel?: boolean;     // true = hide the recurring service on this date
  createdAt: string;
};

export type SiteContent = {
  sermons: Sermon[];
  photos: Photo[];
  books: Book[];
  assets: Asset[];
  verses: Verse[];
  events: EventItem[];
};

export const EMPTY_CONTENT: SiteContent = { sermons: [], photos: [], books: [], assets: [], verses: [], events: [] };

const JSON_URL = "/data/site-content.json";
const API_LOAD = "/api/save.php";
const API_SAVE = "/api/save.php";
const API_UPLOAD = "/api/upload.php";
const API_UPLOAD_CHUNK = "/api/upload-chunk.php";
const API_DELETE = "/api/delete.php";
// Hetzner shared hosting can keep a low post_max_size despite .user.ini/.htaccess.
// Keep every chunk safely below the default 2 MB PHP limit and always chunk sermons.
const LARGE_UPLOAD_THRESHOLD = 1 * 1024 * 1024;
const CHUNK_SIZE = 768 * 1024;

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
        verses:  Array.isArray(raw.verses)  ? raw.verses  : [],
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
  if (type === "sermons" || file.size > LARGE_UPLOAD_THRESHOLD) {
    return uploadFileChunked(password, type, file, onProgress);
  }

  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("type", type);
    fd.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", API_UPLOAD);
    xhr.setRequestHeader("X-Admin-Password", password);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress({
        loaded: event.loaded,
        total: event.total,
        percent: Math.round((event.loaded / event.total) * 100),
      });
    };

    xhr.onload = () => {
      const json = (() => {
        try { return JSON.parse(xhr.responseText); }
        catch { return {}; }
      })();
      if (xhr.status < 200 || xhr.status >= 300 || !json.ok) {
        const errorMessage = json.error || `Upload failed (${xhr.status})`;
        if (xhr.status === 413 || errorMessage.includes("обычной загрузки") || errorMessage.includes("post_max_size")) {
          uploadFileChunked(password, type, file, onProgress).then(resolve).catch(reject);
          return;
        }
        reject(new Error(errorMessage));
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

async function uploadFileChunked(
  password: string,
  type: "sermons" | "photos" | "books" | "assets",
  file: File,
  onProgress?: (progress: { loaded: number; total: number; percent: number }) => void,
): Promise<{ url: string; filename: string; size: number }> {
  const uploadId = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  let uploadedBeforeChunk = 0;

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex += 1) {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);
    const result = await uploadChunk({
      password,
      type,
      fileName: file.name,
      uploadId,
      chunk,
      chunkIndex,
      totalChunks,
      totalSize: file.size,
      uploadedBeforeChunk,
      onProgress,
    });
    uploadedBeforeChunk += chunk.size;

    if (result?.done) {
      onProgress?.({ loaded: file.size, total: file.size, percent: 100 });
      return { url: result.url, filename: result.filename, size: result.size };
    }
  }

  throw new Error("Загрузка не завершилась. Попробуйте ещё раз.");
}

function uploadChunk(args: {
  password: string;
  type: "sermons" | "photos" | "books" | "assets";
  fileName: string;
  uploadId: string;
  chunk: Blob;
  chunkIndex: number;
  totalChunks: number;
  totalSize: number;
  uploadedBeforeChunk: number;
  onProgress?: (progress: { loaded: number; total: number; percent: number }) => void;
}): Promise<{ done: false } | { done: true; url: string; filename: string; size: number }> {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("type", args.type);
    fd.append("uploadId", args.uploadId);
    fd.append("filename", args.fileName);
    fd.append("chunkIndex", String(args.chunkIndex));
    fd.append("totalChunks", String(args.totalChunks));
    fd.append("totalSize", String(args.totalSize));
    fd.append("file", args.chunk, args.fileName);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", API_UPLOAD_CHUNK);
    xhr.setRequestHeader("X-Admin-Password", args.password);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !args.onProgress) return;
      const loaded = Math.min(args.totalSize, args.uploadedBeforeChunk + event.loaded);
      args.onProgress({
        loaded,
        total: args.totalSize,
        percent: Math.min(99, Math.round((loaded / args.totalSize) * 100)),
      });
    };

    xhr.onload = () => {
      const json = (() => {
        try { return JSON.parse(xhr.responseText); }
        catch { return {}; }
      })();
      if (xhr.status < 200 || xhr.status >= 300 || !json.ok) {
        reject(new Error(json.error || `Upload failed (${xhr.status})`));
        return;
      }
      resolve(json.done
        ? { done: true, url: json.url, filename: json.filename, size: json.size }
        : { done: false });
    };

    xhr.onerror = () => reject(new Error("Соединение прервано во время загрузки. Попробуйте ещё раз или проверьте интернет."));
    xhr.ontimeout = () => reject(new Error("Загрузка заняла слишком много времени. Попробуйте ещё раз."));
    xhr.timeout = 10 * 60 * 1000;
    xhr.send(fd);
  });
}

export async function deleteItem(
  password: string,
  type: "sermons" | "photos" | "books" | "assets" | "verses",
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
