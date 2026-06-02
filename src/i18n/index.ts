import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import de from "./locales/de.json";
import en from "./locales/en.json";
import ru from "./locales/ru.json";
import he from "./locales/he.json";
import ar from "./locales/ar.json";
import pt from "./locales/pt.json";
import pl from "./locales/pl.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";
import tr from "./locales/tr.json";
import ro from "./locales/ro.json";
import mn from "./locales/mn.json";

export type Lang =
  | "de" | "en" | "ru" | "he" | "ar" | "syr"
  | "pt" | "pl" | "fr" | "it" | "tr" | "ro" | "mn";

export const RTL_LANGS: Lang[] = ["he", "ar", "syr"];

export const LANGS: { code: Lang; label: string; flag: string; name: string }[] = [
  { code: "de", label: "DE", flag: "🇩🇪", name: "Deutsch" },
  { code: "en", label: "EN", flag: "🇬🇧", name: "English" },
  { code: "ru", label: "RU", flag: "🇷🇺", name: "Русский" },
  { code: "he", label: "HE", flag: "🇮🇱", name: "עברית" },
  { code: "ar", label: "AR", flag: "🇸🇾", name: "ܣܘܪܝܝܐ / العربية" },
  { code: "pt", label: "PT", flag: "🇵🇹", name: "Português" },
  { code: "pl", label: "PL", flag: "🇵🇱", name: "Polski" },
  { code: "fr", label: "FR", flag: "🇫🇷", name: "Français" },
  { code: "it", label: "IT", flag: "🇮🇹", name: "Italiano" },
  { code: "tr", label: "TR", flag: "🇹🇷", name: "Türkçe" },
  { code: "ro", label: "RO", flag: "🇷🇴", name: "Română" },
  { code: "mn", label: "MN", flag: "🇲🇳", name: "Монгол" },
];

// Syriac (syr) falls back to Arabic resources (closest widely-supported script)
const resources = {
  de: { translation: de },
  en: { translation: en },
  ru: { translation: ru },
  he: { translation: he },
  ar: { translation: ar },
  syr: { translation: ar },
  pt: { translation: pt },
  pl: { translation: pl },
  fr: { translation: fr },
  it: { translation: it },
  tr: { translation: tr },
  ro: { translation: ro },
  mn: { translation: mn },
};

// IMPORTANT: always init with German on both server and first client render
// to avoid SSR/hydration mismatches. We swap to the user-selected language
// in a post-hydration effect (see I18nProvider).
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "de",
    fallbackLng: "de",
    supportedLngs: ["de", "en", "ru", "he", "ar", "syr", "pt", "pl", "fr", "it", "tr", "ro", "mn"],
    interpolation: { escapeValue: false },
    returnNull: false,
  });
}

export default i18n;
