import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  const protectedPaths = ["/cart", "/orders", "/account"];
  const path = req.nextUrl.pathname;
  if (protectedPaths.some((p) => path.startsWith(p)) && !token) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/orders/:path*", "/account/:path*"],
};
