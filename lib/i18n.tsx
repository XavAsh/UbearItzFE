"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";

type Messages = Record<string, string>;
export type Locale = "en" | "fr";

const allMessages: Record<Locale, Messages> = { en, fr } as const;

type I18nContextValue = {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readInitialLocale(fallback: Locale): Locale {
  if (typeof window === "undefined") return fallback;
  const fromDocument = document.documentElement.lang;
  if (fromDocument === "en" || fromDocument === "fr") return fromDocument;
  const fromStorage = window.localStorage.getItem("locale");
  if (fromStorage === "en" || fromStorage === "fr") return fromStorage;
  const fromNavigator = navigator.language?.startsWith("fr") ? "fr" : "en";
  return fromNavigator;
}

function persistLocale(locale: Locale) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("locale", locale);
    document.documentElement.lang = locale;
  }
  if (typeof document !== "undefined") {
    document.cookie = `locale=${locale}; path=/; max-age=31536000`;
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
  }
}

export function I18nProvider({ children, initialLocale = "en" }: { children: React.ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const resolved = readInitialLocale(initialLocale);
    setLocaleState(resolved);
    persistLocale(resolved);
  }, [initialLocale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    persistLocale(l);
  };

  const messages = allMessages[locale] ?? allMessages.en;
  const t = useMemo(() => (key: string) => messages[key] ?? key, [messages]);

  const value = useMemo(() => ({ locale, t, setLocale }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
