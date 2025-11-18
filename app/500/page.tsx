import Link from "next/link";
import { cookies } from "next/headers";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

export const metadata = buildMetadata({
  title: "Server Error | UbearItz",
  description: "An unexpected error occurred.",
  path: "/500",
});

const FALLBACK_COPY = {
  en: {
    title: "Something went wrong",
    description: "An unexpected error occurred. Please try again later.",
    cta: "Back to safety",
  },
  fr: {
    title: "Un problème est survenu",
    description: "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
    cta: "Retour à l'accueil",
  },
} as const;

export default async function GlobalServerError() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale | undefined) ?? (cookieStore.get("locale")?.value as Locale | undefined) ?? "en";
  const dict = getDictionary(locale);

  const copy = {
    title: dict["error.title"] ?? FALLBACK_COPY.en.title,
    description: dict["error.description"] ?? FALLBACK_COPY.en.description,
    cta: dict["error.cta"] ?? FALLBACK_COPY.en.cta,
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-sm tracking-widest text-gray-500">500</p>
      <h1 className="text-4xl font-semibold">{copy.title}</h1>
      <p className="max-w-md text-base text-gray-600">{copy.description}</p>
      <Link
        href={`/${locale}`}
        className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        {copy.cta}
      </Link>
    </main>
  );
}

