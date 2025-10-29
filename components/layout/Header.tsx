"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { useAuthStore } from "@/stores/authStore";

export default function Header() {
  const { t } = useI18n();
  const { currentUser, logout } = useAuthStore();
  const handleLogout = () => {
    logout();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };
  return (
    <header className="border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">
          UbearItz
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {!currentUser && (
            <>
              <Link href="/login" className="underline">
                {t("nav.login")}
              </Link>
              <Link href="/register" className="underline">
                {t("nav.register")}
              </Link>
            </>
          )}

          {currentUser?.role === "admin" && (
            <>
              <Link href="/admin" className="underline">
                {t("nav.admin")}
              </Link>
              <button onClick={handleLogout} className="underline">
                {t("nav.logout") || "Logout"}
              </button>
            </>
          )}

          {currentUser?.role === "restaurant" && (
            <>
              <Link href="/restaurant" className="underline">
                {t("nav.restaurant")}
              </Link>
              <Link href="/restaurant/dishes" className="underline">
                {t("nav.dishes") || "Dishes"}
              </Link>
              <Link href="/restaurant/orders" className="underline">
                {t("nav.orders") || "Orders"}
              </Link>
              <button onClick={handleLogout} className="underline">
                {t("nav.logout") || "Logout"}
              </button>
            </>
          )}

          {currentUser && currentUser.role === "customer" && (
            <>
              <Link href="/orders" className="underline">
                {t("nav.history")}
              </Link>
              <Link href="/cart" className="underline">
                {t("nav.cart")}
              </Link>
              <Link href="/account" className="underline">
                {t("nav.account")}
              </Link>
              <button onClick={handleLogout} className="underline">
                {t("nav.logout") || "Logout"}
              </button>
            </>
          )}

          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
