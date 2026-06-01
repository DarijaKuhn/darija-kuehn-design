import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ru" | "de" | "ua" | "en";

export const LANGS: { code: Lang; label: string; flag: string; name: string }[] = [
  { code: "ru", label: "RU", flag: "🇷🇺", name: "Русский" },
  { code: "de", label: "DE", flag: "🇩🇪", name: "Deutsch" },
  { code: "ua", label: "UA", flag: "🇺🇦", name: "Українська" },
  { code: "en", label: "EN", flag: "🇬🇧", name: "English" },
];

type Dict = Record<string, string>;

const translations: Record<Lang, Dict> = {
  ru: {
    "nav.home": "Главная",
    "nav.confession": "Вероисповедание",
    "nav.services": "Богослужения",
    "nav.map": "Как нас найти",
    "nav.gallery": "Фото",
    "nav.sermons": "Проповеди",
    "nav.contact": "Контакт",
    "hero.eyebrow": "Freie Evangeliums-Christen-Gemeinde Dresden e.V.",
    "hero.h1": "Церковь Евангельских Христиан\nБаптистов в Дрездене",
    "hero.h2": "Рады видеть вас в нашей общине.",
    "hero.desc": "Русскоязычная христианская община.",
    "hero.schedule": "Расписание богослужений",
    "hero.wed": "Среда",
    "hero.fri": "Пятница",
    "hero.sat": "Суббота",
    "hero.sun": "Воскресенье",
    "hero.prayer": "Молитвенное служение",
    "hero.bible": "Изучение Библии",
    "hero.youth": "Молодёжное общение",
    "hero.byArr": "по договорённости",
    "hero.sundaySvc": "Воскресное богослужение",
    "hero.mainSvc": "Главное служение",
    "hero.findUs": "Как нас найти →",
    "hero.ourFaith": "Наше вероисповедание",
  },
  de: {
    "nav.home": "Startseite",
    "nav.confession": "Glaubensbekenntnis",
    "nav.services": "Gottesdienste",
    "nav.map": "Anfahrt",
    "nav.gallery": "Fotos",
    "nav.sermons": "Predigten",
    "nav.contact": "Kontakt",
    "hero.eyebrow": "Freie Evangeliums-Christen-Gemeinde Dresden e.V.",
    "hero.h1": "Kirche der Evangeliums-Christen\nBaptisten in Dresden",
    "hero.h2": "Wir freuen uns, Sie in unserer Gemeinde zu sehen.",
    "hero.desc": "Russischsprachige christliche Gemeinde.",
    "hero.schedule": "Gottesdienstplan",
    "hero.wed": "Mittwoch",
    "hero.fri": "Freitag",
    "hero.sat": "Samstag",
    "hero.sun": "Sonntag",
    "hero.prayer": "Gebetsstunde",
    "hero.bible": "Bibelstudium",
    "hero.youth": "Jugendtreffen",
    "hero.byArr": "nach Vereinbarung",
    "hero.sundaySvc": "Sonntagsgottesdienst",
    "hero.mainSvc": "Hauptgottesdienst",
    "hero.findUs": "So finden Sie uns →",
    "hero.ourFaith": "Unser Glaube",
  },
  ua: {
    "nav.home": "Головна",
    "nav.confession": "Віровизнання",
    "nav.services": "Богослужіння",
    "nav.map": "Як нас знайти",
    "nav.gallery": "Фото",
    "nav.sermons": "Проповіді",
    "nav.contact": "Контакт",
    "hero.eyebrow": "Freie Evangeliums-Christen-Gemeinde Dresden e.V.",
    "hero.h1": "Церква Євангельських Християн\nБаптистів у Дрездені",
    "hero.h2": "Раді бачити вас у нашій громаді.",
    "hero.desc": "Російськомовна християнська громада.",
    "hero.schedule": "Розклад богослужінь",
    "hero.wed": "Середа",
    "hero.fri": "П'ятниця",
    "hero.sat": "Субота",
    "hero.sun": "Неділя",
    "hero.prayer": "Молитовне служіння",
    "hero.bible": "Вивчення Біблії",
    "hero.youth": "Молодіжне спілкування",
    "hero.byArr": "за домовленістю",
    "hero.sundaySvc": "Недільне богослужіння",
    "hero.mainSvc": "Головне служіння",
    "hero.findUs": "Як нас знайти →",
    "hero.ourFaith": "Наше віровизнання",
  },
  en: {
    "nav.home": "Home",
    "nav.confession": "Faith",
    "nav.services": "Services",
    "nav.map": "Find Us",
    "nav.gallery": "Photos",
    "nav.sermons": "Sermons",
    "nav.contact": "Contact",
    "hero.eyebrow": "Freie Evangeliums-Christen-Gemeinde Dresden e.V.",
    "hero.h1": "Evangelical Christian Baptist Church in Dresden",
    "hero.h2": "We are glad to welcome you to our community.",
    "hero.desc": "Russian-speaking Christian community.",
    "hero.schedule": "Service schedule",
    "hero.wed": "Wednesday",
    "hero.fri": "Friday",
    "hero.sat": "Saturday",
    "hero.sun": "Sunday",
    "hero.prayer": "Prayer service",
    "hero.bible": "Bible study",
    "hero.youth": "Youth fellowship",
    "hero.byArr": "by arrangement",
    "hero.sundaySvc": "Sunday service",
    "hero.mainSvc": "Main service",
    "hero.findUs": "How to find us →",
    "hero.ourFaith": "Our faith",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const I18nContext = createContext<Ctx>({ lang: "ru", setLang: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved && translations[saved]) setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };
  const t = (key: string) => translations[lang][key] ?? translations.ru[key] ?? key;
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
