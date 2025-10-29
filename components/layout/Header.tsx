"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

export default function Header() {
  const { t } = useI18n();
  return (
    <header className="border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">
          UbearItz
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/login" className="underline">
            {t("nav.login")}
          </Link>
          <Link href="/register" className="underline">
            {t("nav.register")}
          </Link>
          <Link href="/orders" className="underline">
            {t("nav.orders")}
          </Link>
          <Link href="/cart" className="underline">
            {t("nav.cart")}
          </Link>
          <Link href="/account" className="underline">
            {t("nav.account")}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
