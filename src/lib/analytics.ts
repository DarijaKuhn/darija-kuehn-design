// Anonymous page-view tracker for FECG Dresden.
// Sends beacons to /api/stats.php. Server strips IP, respects DNT, dedupes by daily hash.

const API = "/api/stats.php";

export function trackView(path: string, item?: string): void {
  if (typeof window === "undefined") return;
  try {
    if ((navigator as unknown as { doNotTrack?: string }).doNotTrack === "1") return;
    const body = JSON.stringify({ path, item });
    const blob = new Blob([body], { type: "application/json" });
    if ("sendBeacon" in navigator) {
      navigator.sendBeacon(API, blob);
      return;
    }
    void fetch(API, { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
  } catch {
    // silent
  }
}

export type StatsResponse = {
  ok: boolean;
  stats: {
    total: number;
    unique_total: number;
    paths: Record<string, number>;
    items: Record<string, number>;
    daily: Record<string, { views: number; unique: number }>;
    since: string;
  };
};

export async function fetchStats(password: string): Promise<StatsResponse["stats"]> {
  const res = await fetch(API, { headers: { "X-Admin-Password": password }, cache: "no-store" });
  if (!res.ok) throw new Error("Не удалось загрузить статистику (" + res.status + ")");
  const json = (await res.json()) as StatsResponse;
  return json.stats;
}
