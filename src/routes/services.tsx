import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useI18n } from "@/i18n";
import { loadContent, type EventItem } from "@/lib/site-content";

export const Route = createFileRoute("/services")({
  component: Services,
  head: () => ({
    meta: [
      { title: "Gottesdienste — FECG Dresden" },
      { name: "description", content: "Aktueller Gottesdienstplan und Veranstaltungen der FECG Dresden. Sonntag 10:00, Mittwoch 18:00, Freitag 18:00." },
    ],
  }),
});

// Titles for recurring services per language (fallback: de)
const RECURRING_TITLES: Record<string, { sun: string; sunNote: string; wed: string; fri: string }> = {
  de: { sun: "Sonntagsgottesdienst", sunNote: "Gesamtversammlung", wed: "Gebetsstunde", fri: "Bibelstudium" },
  ru: { sun: "Воскресное богослужение", sunNote: "Общее собрание", wed: "Молитвенное собрание", fri: "Изучение Библии" },
  en: { sun: "Sunday Service", sunNote: "Main gathering", wed: "Prayer Meeting", fri: "Bible Study" },
  uk: { sun: "Недільне богослужіння", sunNote: "Спільне зібрання", wed: "Молитовне зібрання", fri: "Вивчення Біблії" },
  pl: { sun: "Nabożeństwo niedzielne", sunNote: "Zgromadzenie ogólne", wed: "Modlitwa", fri: "Studium Biblii" },
  ro: { sun: "Serviciu duminical", sunNote: "Adunare generală", wed: "Rugăciune", fri: "Studiu biblic" },
  fr: { sun: "Culte du dimanche", sunNote: "Assemblée générale", wed: "Réunion de prière", fri: "Étude biblique" },
  it: { sun: "Culto domenicale", sunNote: "Assemblea generale", wed: "Preghiera", fri: "Studio biblico" },
  pt: { sun: "Culto dominical", sunNote: "Assembleia geral", wed: "Oração", fri: "Estudo bíblico" },
  tr: { sun: "Pazar ibadeti", sunNote: "Genel toplantı", wed: "Dua toplantısı", fri: "Kutsal Kitap çalışması" },
  ar: { sun: "خدمة الأحد", sunNote: "الاجتماع العام", wed: "اجتماع صلاة", fri: "دراسة الكتاب المقدس" },
  he: { sun: "תפילת יום ראשון", sunNote: "אסיפה כללית", wed: "תפילה", fri: "לימוד תנ״ך" },
  mn: { sun: "Ням гаригийн мөргөл", sunNote: "Ерөнхий цуглаан", wed: "Залбирал", fri: "Библи судлал" },
};

type DisplayEvent = {
  key: string;
  date: Date;
  isoDate: string;
  title: string;
  time: string;
  note?: string;
  recurring?: boolean;
};

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function Services() {
  const { t } = useI18n();
  const { i18n } = useTranslation();
  const lang = (i18n.language || "de").split("-")[0];
  const titles = RECURRING_TITLES[lang] || RECURRING_TITLES.de;

  const [customEvents, setCustomEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    loadContent().then((c) => setCustomEvents(c.events || [])).catch(() => {});
  }, []);

  const events = useMemo<(DisplayEvent & { custom?: boolean })[]>(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // ~2 months ahead
    const end = new Date(start);
    end.setMonth(end.getMonth() + 2);
    const horizonDays = Math.round((end.getTime() - start.getTime()) / 86400000);

    const cancelSet = new Set(
      customEvents.filter((e) => e.cancel).map((e) => e.date),
    );
    // Any custom (non-cancel) event on a date replaces the recurring one for that date
    const customDateSet = new Set(
      customEvents.filter((e) => !e.cancel).map((e) => e.date),
    );

    const list: (DisplayEvent & { custom?: boolean })[] = [];

    // Generate recurring services
    for (let i = 0; i < horizonDays; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const iso = toISODate(d);
      const wd = d.getDay();
      if (cancelSet.has(iso)) continue;
      if (customDateSet.has(iso)) continue; // custom event overrides recurring
      if (wd === 0) {
        list.push({ key: `r-sun-${iso}`, date: d, isoDate: iso, title: titles.sun, time: "10:00", note: titles.sunNote, recurring: true });
      } else if (wd === 3) {
        list.push({ key: `r-wed-${iso}`, date: d, isoDate: iso, title: titles.wed, time: "18:00", recurring: true });
      } else if (wd === 5) {
        list.push({ key: `r-fri-${iso}`, date: d, isoDate: iso, title: titles.fri, time: "18:00", recurring: true });
      }
    }

    // Add custom events (non-cancel) — only future/today, within horizon
    for (const ev of customEvents) {
      if (ev.cancel) continue;
      const [y, m, dd] = ev.date.split("-").map((n) => parseInt(n, 10));
      if (!y || !m || !dd) continue;
      const d = new Date(y, m - 1, dd);
      if (d < start || d > end) continue;
      list.push({
        key: `c-${ev.id}`,
        date: d,
        isoDate: ev.date,
        title: ev.title,
        time: ev.time || "",
        note: ev.note,
        custom: true,
      });
    }

    list.sort((a, b) => a.date.getTime() - b.date.getTime());
    return list;
  }, [customEvents, titles]);


  const dayFmt = useMemo(() => new Intl.DateTimeFormat(lang, { day: "2-digit" }), [lang]);
  const monFmt = useMemo(() => new Intl.DateTimeFormat(lang, { month: "short" }), [lang]);
  const wdFmt = useMemo(() => new Intl.DateTimeFormat(lang, { weekday: "short" }), [lang]);

  return (
    <div className="page-panel">
      <div className="page-breadcrumb">
        <div className="page-breadcrumb-inner container">
          <Link to="/">{t("legal.breadcrumbHome")}</Link>
          <span>›</span>
          <span className="crumb-here">{t("pages.services.crumb")}</span>
        </div>
      </div>

      <section className="section section-bg">
        <div className="container">
          <div className="label" style={{ marginBottom: 8 }}>{t("pages.services.eyebrow")}</div>
          <h1 className="section-h">{t("pages.services.h1")}</h1>
          <p className="body-lg" style={{ marginTop: 12, maxWidth: 680 }}>
            {t("pages.services.intro")}
          </p>

          <div className="events-grid">
            {events.map((ev) => {
              const day = dayFmt.format(ev.date);
              const mon = monFmt.format(ev.date).replace(/\.$/, "").toUpperCase();
              const wd = wdFmt.format(ev.date).replace(/\.$/, "");
              const meta = [wd, ev.time, ev.note].filter(Boolean).join(" · ");
              return (
                <div key={ev.key} className={`event-card${ev.custom ? " event-card-custom" : ""}`}>
                  <div className="event-badge">
                    <div className="event-badge-day">{day}</div>
                    <div className="event-badge-mon">{mon}</div>
                  </div>
                  <div>
                    <div className="event-title">{ev.title}</div>
                    <div className="event-time">{meta}</div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      <div className="quote-block">
        <p className="quote-text">{t("pages.services.quote")}</p>
        <p className="quote-ref">{t("pages.services.quoteRef")}</p>
      </div>
    </div>
  );
}
