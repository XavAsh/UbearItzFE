import type { Locale } from "@/lib/i18n";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";

const dictionaries: Record<Locale, Record<string, string>> = { en, fr } as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.en;
}

