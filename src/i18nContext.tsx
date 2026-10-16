import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { translations } from "./i18n";

export type Locale = "en" | "fa";

interface I18nContextValue {
  locale: Locale;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  t: (key) => translations.en[key] ?? key,
});

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = (key: string) => translations[locale]?.[key] ?? translations.en[key] ?? key;
  return <I18nContext.Provider value={{ locale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
