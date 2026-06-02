// Compatibility shim: existing call sites import { useI18n, LANGS, Lang } from "@/i18n".
// All translation data is now defined statically under src/i18n/locales/*.json and wired
// via react-i18next in src/i18n/index.ts. German remains the master / legally binding language.
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import i18n, { LANGS, RTL_LANGS, type Lang } from "./i18n/index";

export { LANGS, RTL_LANGS };
export type { Lang };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
};

const I18nContext = createContext<Ctx>({
  lang: "de",
  setLang: () => {},
  t: (k) => k,
  dir: "ltr",
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const { t, i18n: i18nInstance } = useTranslation();
  const [lang, setLangState] = useState<Lang>((i18nInstance.language as Lang) || "de");

  useEffect(() => {
    const onChange = (lng: string) => setLangState(lng as Lang);
    i18nInstance.on("languageChanged", onChange);
    return () => {
      i18nInstance.off("languageChanged", onChange);
    };
  }, [i18nInstance]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    i18n.changeLanguage(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const dir: "ltr" | "rtl" = RTL_LANGS.includes(lang) ? "rtl" : "ltr";
  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir }}>{children}</I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
