"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";

type Messages = Record<string, string>;
type Locale = "en" | "fr";

const allMessages: Record<Locale, Messages> = { en, fr } as const;

type I18nContextValue = {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const fromStorage = window.localStorage.getItem("locale");
  if (fromStorage === "en" || fromStorage === "fr") return fromStorage;
  const fromNavigator = navigator.language?.startsWith("fr") ? "fr" : "en";
  return fromNavigator;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const l = readInitialLocale();
    setLocaleState(l);
    document.cookie = `locale=${l}; path=/; max-age=31536000`;
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("locale", l);
    }
    document.cookie = `locale=${l}; path=/; max-age=31536000`;
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
