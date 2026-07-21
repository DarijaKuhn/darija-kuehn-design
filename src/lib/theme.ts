// Клиентская загрузка кастомной темы (CSS-переменные) с сервера.
// Тема сохраняется в public/data/theme.json через public/api/theme.php.

export type ThemeMap = Record<string, string>;

const THEME_URL = "/api/theme.php";
const CACHE_KEY = "fecg-theme-cache-v1";

const ALLOWED_KEYS = new Set([
  "--bg", "--ink", "--ink-2", "--muted", "--white",
  "--green", "--green-dark", "--green-light", "--green-soft",
  "--accent-sky", "--accent-lavender", "--gradient-accent",
  "--shadow-soft", "--shadow-float",
  "--radius-card", "--radius-card-lg",
  "--font-sans", "--font-serif",
]);

export function applyTheme(theme: ThemeMap) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  Object.entries(theme).forEach(([k, v]) => {
    if (!ALLOWED_KEYS.has(k) || typeof v !== "string") return;
    root.style.setProperty(k, v);
  });
}

export function clearAppliedTheme() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  ALLOWED_KEYS.forEach((k) => root.style.removeProperty(k));
}

export async function loadAndApplyTheme(): Promise<ThemeMap> {
  // Мгновенно применяем закешированную тему (без FOUC),
  // затем обновляем с сервера.
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) applyTheme(JSON.parse(cached));
    } catch { /* ignore */ }
  }
  try {
    const res = await fetch(THEME_URL, { cache: "no-store" });
    if (!res.ok) return {};
    const data = await res.json();
    const theme = (data?.theme ?? {}) as ThemeMap;
    applyTheme(theme);
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(theme)); } catch { /* ignore */ }
    return theme;
  } catch {
    return {};
  }
}

export async function saveTheme(password: string, theme: ThemeMap): Promise<ThemeMap> {
  const res = await fetch(THEME_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Password": password },
    body: JSON.stringify({ theme }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Ошибка сохранения");
  const data = await res.json();
  const saved = (data?.theme ?? {}) as ThemeMap;
  applyTheme(saved);
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(saved)); } catch { /* ignore */ }
  return saved;
}

export async function resetTheme(password: string): Promise<void> {
  const res = await fetch(THEME_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Password": password },
    body: JSON.stringify({ reset: true }),
  });
  if (!res.ok) throw new Error("Ошибка сброса");
  clearAppliedTheme();
  try { localStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
}

export async function askAiTheme(
  password: string,
  prompt: string,
  currentTheme: ThemeMap,
): Promise<ThemeMap> {
  const res = await fetch("/api/ai-theme.php", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Password": password },
    body: JSON.stringify({ prompt, currentTheme }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Ошибка ИИ");
  return (data?.theme ?? {}) as ThemeMap;
}
