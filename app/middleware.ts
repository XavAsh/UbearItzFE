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
  const segments = pathname.split("/").filter(Boolean);
  const potentialLocale = segments[0];
  const hasLocalePrefix = SUPPORTED_LOCALES.includes(potentialLocale as any);
  const strippedPathname = hasLocalePrefix ? `/${segments.slice(1).join("/")}` || "/" : pathname;

  const shouldBypass =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/assets") ||
    strippedPathname === "/404" ||
    strippedPathname === "/500";

  if (shouldBypass) {
    return NextResponse.next();
  }

  if (hasLocalePrefix) {
    const url = req.nextUrl.clone();
    url.pathname = strippedPathname || "/";
    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", potentialLocale, { path: "/" });
    return response;
  }

  const token = req.cookies.get("auth-token")?.value;

  const protectedPaths = ["/cart", "/orders", "/account"];
  if (protectedPaths.some((p) => strippedPathname === p || strippedPathname.startsWith(`${p}/`)) && !token) {
    const url = new URL(`/login`, req.url);
    return NextResponse.redirect(url);
  }

  if (strippedPathname.startsWith("/admin")) {
    if (!token) {
      const url = new URL(`/login`, req.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!req.cookies.get("NEXT_LOCALE")) {
    const response = NextResponse.next();
    response.cookies.set("NEXT_LOCALE", detectLocale(req), { path: "/" });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next|api|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)).*)",
};
