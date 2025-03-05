import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const adminCookie = req.cookies.get("administrateur");

  if (req.nextUrl.pathname.startsWith("/admin") && adminCookie?.value !== "true") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // Protège toutes les routes admin
};
