import ClientLogin from "@/app/login/ClientLogin";
import { buildMetadata } from "@/lib/seo";
import { cookies } from "next/headers";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";

export const metadata = buildMetadata({
  title: "Login | UbearItz",
  description: "Access your UbearItz account to manage orders and cart.",
  path: "/login",
});

export default async function LoginPage() {
  const cookieStore = await cookies();
  const locale =
    (cookieStore.get("NEXT_LOCALE")?.value as Locale | undefined) ??
    (cookieStore.get("locale")?.value as Locale | undefined) ??
    "en";
  const dict = getDictionary(locale);

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full flex flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold">{dict["auth.login.title"]}</h1>
        <ClientLogin />
      </div>
    </main>
  );
}
