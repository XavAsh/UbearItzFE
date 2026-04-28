import { buildMetadata } from "@/lib/seo";
import RegisterPageClient from "./RegisterPageClient";
import { cookies } from "next/headers";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";

export const metadata = buildMetadata({
  title: "Create account | UbearItz",
  description: "Create your UbearItz account to start ordering from local restaurants.",
  path: "/register",
});

export default async function CreateAccountPage() {
  const cookieStore = await cookies();
  const locale =
    (cookieStore.get("NEXT_LOCALE")?.value as Locale | undefined) ??
    (cookieStore.get("locale")?.value as Locale | undefined) ??
    "en";
  const dict = getDictionary(locale);

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full flex flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold">{dict["auth.register.title"]}</h1>
        <RegisterPageClient />
      </div>
    </main>
  );
}
