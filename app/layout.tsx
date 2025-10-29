import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/globals.css";
import Header from "@/components/layout/Header";
import { I18nProvider } from "@/lib/i18n";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UbearItz",
  description: "UbearItz is a platform for finding and ordering food from restaurants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <I18nProvider>
          <Header />
          <div className="main-content">{children}</div>
        </I18nProvider>
        <footer className="border-t">
          <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-gray-500">© {new Date().getFullYear()} ubearitz</div>
        </footer>
      </body>
    </html>
  );
}
