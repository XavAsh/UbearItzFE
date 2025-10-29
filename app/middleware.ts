import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LOCALES = ["en", "fr"] as const;

function detectLocale(req: NextRequest): string {
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value || req.cookies.get("locale")?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as any)) return cookieLocale;
  const header = req.headers.get("accept-language") || "";
  const first = header.split(",")[0]?.trim().slice(0, 2);
  return SUPPORTED_LOCALES.includes(first as any) ? first : "en";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip Next internals and files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/assets")
  ) {
    return NextResponse.next();
  }

  // Allow admin routes to be locale-less
  if (pathname.startsWith("/admin")) {
    // Protect admin routes by auth token
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      const url = new URL(`/login`, req.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const hasLocalePrefix = SUPPORTED_LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (!hasLocalePrefix) {
    const locale = detectLocale(req);
    const url = new URL(`/${locale}${pathname}`, req.url);
    return NextResponse.redirect(url);
  }

  // Auth protect locale-aware paths
  const token = req.cookies.get("auth-token")?.value;
  const locale = pathname.split("/")[1];
  const subpath = pathname.slice(locale.length + 1); // includes leading slash
  const protectedPaths = ["/cart", "/orders", "/account"];
  if (protectedPaths.some((p) => subpath.startsWith(p)) && !token) {
    const url = new URL(`/${locale}/login`, req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher:
    "/((?!_next|api|.*\\.\
(?:png|jpg|jpeg|gif|svg|webp|ico)).*)",
};
