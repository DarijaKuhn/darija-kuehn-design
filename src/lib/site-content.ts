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
const WEB_IMAGE_MAX_EDGE = 2400;

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
        events:  Array.isArray(raw.events)  ? raw.events  : [],
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

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg", "image/jpg": "jpg", "image/png": "png",
  "image/webp": "webp", "image/gif": "gif", "image/avif": "avif",
  "image/heic": "heic", "image/heif": "heif", "image/svg+xml": "svg",
  "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov",
  "video/x-quicktime": "mov", "video/mov": "mov", "video/x-m4v": "m4v",
  "video/ogg": "ogv", "video/3gpp": "3gp", "video/3gpp2": "3gpp",
  "audio/mpeg": "mp3", "audio/mp3": "mp3", "audio/mp4": "m4a",
  "audio/x-m4a": "m4a", "audio/wav": "wav", "audio/ogg": "ogg",
  "application/pdf": "pdf", "application/epub+zip": "epub",
};

function fileExt(file: File): string {
  const dot = file.name.lastIndexOf(".");
  return dot > 0 ? file.name.slice(dot + 1).toLowerCase() : "";
}

function normalizeFile(file: File): File {
  const ext = fileExt(file);
  const mimeExt = MIME_TO_EXT[file.type?.toLowerCase() ?? ""] ?? "";
  // If no extension, or extension doesn't match a known type but MIME does — fix it.
  if ((!ext || ["blob", "tmp", "file", "download"].includes(ext)) && mimeExt) {
    const base = file.name && file.name !== ext ? file.name.replace(/\.[^.]*$/, "") : "file";
    return new File([file], `${base}.${mimeExt}`, { type: file.type });
  }
  return file;
}

async function convertHeicToJpeg(file: File): Promise<File> {
  if (typeof window === "undefined" || typeof document === "undefined") return file;
  const ext = fileExt(file);
  if (ext !== "heic" && ext !== "heif" && file.type !== "image/heic" && file.type !== "image/heif") return file;

  const source = await (async () => {
    if ("createImageBitmap" in window) {
      try { return await createImageBitmap(file); } catch { /* fallback below */ }
    }
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("HEIC decode failed")); };
      img.src = url;
    });
  })();

  const width = "width" in source ? source.width : source.naturalWidth;
  const height = "height" in source ? source.height : source.naturalHeight;
  const scale = Math.min(1, WEB_IMAGE_MAX_EDGE / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  if ("close" in source && typeof source.close === "function") source.close();
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => b ? resolve(b) : reject(new Error("JPEG conversion failed")), "image/jpeg", 0.9);
  });
  const base = (file.name || "iphone-photo").replace(/\.[^.]*$/, "");
  return new File([blob], `${base}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
}

async function prepareFileForUpload(file: File): Promise<File> {
  const normalized = normalizeFile(file);
  try {
    return normalizeFile(await convertHeicToJpeg(normalized));
  } catch {
    throw new Error("Фото HEIC с iPhone не удалось автоматически преобразовать в JPG. В настройках камеры выберите “Most Compatible / Наиболее совместимый” или отправьте фото как JPEG.");
  }
}

export async function uploadFile(
  password: string,
  type: "sermons" | "photos" | "books" | "assets",
  input: File,
  onProgress?: (progress: { loaded: number; total: number; percent: number }) => void,
): Promise<{ url: string; filename: string; size: number }> {
  const file = await prepareFileForUpload(input);
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
      mime: file.type,
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
  mime: string;
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
    fd.append("mime", args.mime);
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
  type: "sermons" | "photos" | "books" | "assets" | "verses" | "events",
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
