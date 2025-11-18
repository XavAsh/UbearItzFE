import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/globals.css";
import Header from "@/components/layout/Header";
import ServiceWorkerRegistrar from "@/components/pwa/ServiceWorkerRegistrar";
import { I18nProvider, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { cookies } from "next/headers";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...buildMetadata({
    title: "UbearItz | Order from local restaurants",
    description: "UbearItz helps you discover and order from the best restaurants near you.",
    path: "/",
  }),
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const initialLocale = (cookieStore.get("NEXT_LOCALE")?.value as Locale | undefined) ?? (cookieStore.get("locale")?.value as Locale | undefined) ?? "en";

  const skipLabel = initialLocale === "fr" ? "Aller au contenu" : "Skip to content";

  return (
    <html lang={initialLocale}>
      <body className={`${inter.variable} antialiased`}>
        <I18nProvider initialLocale={initialLocale}>
          <a href="#main-content" className="skip-link">
            {skipLabel}
          </a>
          <Header />
          <div id="main-content" className="main-content">
            {children}
          </div>
          <ServiceWorkerRegistrar />
        </I18nProvider>
        <footer className="border-t">
          <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-gray-500">© {new Date().getFullYear()} ubearitz</div>
        </footer>
      </body>
    </html>
  );
}
