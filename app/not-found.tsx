import Link from "next/link";
import { cookies } from "next/headers";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

export const metadata = buildMetadata({
  title: "Page Not Found | UbearItz",
  description: "The page you are looking for could not be found.",
  path: "/404",
});

const FALLBACK_COPY = {
  en: {
    title: "Page not found",
    description: "We couldn't find the page you're searching for.",
    cta: "Go back home",
  },
  fr: {
    title: "Page introuvable",
    description: "Nous n'avons pas trouvé la page recherchée.",
    cta: "Retour à l'accueil",
  },
} as const;

export default async function NotFound() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale | undefined) ?? (cookieStore.get("locale")?.value as Locale | undefined) ?? "en";
  const dict = getDictionary(locale);

  const copy = {
    title: dict["notFound.title"] ?? FALLBACK_COPY.en.title,
    description: dict["notFound.description"] ?? FALLBACK_COPY.en.description,
    cta: dict["notFound.cta"] ?? FALLBACK_COPY.en.cta,
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-sm tracking-widest text-gray-500">404</p>
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


