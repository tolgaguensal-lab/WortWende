import { NextRequest, NextResponse } from "next/server";

const API_PREFIX = "/api/v1";
const API_HOST = "api.orthheld.guenlab.de";
const MAIN_HOST = "orthheld.guenlab.de";

export default function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const { pathname } = req.nextUrl;

  if (host === API_HOST && !pathname.startsWith(API_PREFIX)) {
    return NextResponse.redirect(
      new URL(`https://${MAIN_HOST}${pathname}${req.nextUrl.search}`)
    );
  }

  // CORS für API-Routen
  if (pathname.startsWith(API_PREFIX)) {
    // Preflight (OPTIONS)
    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "X-API-Key, Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Response mit CORS-Headern
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "X-API-Key, Content-Type, Authorization");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/onboarding",
    "/placement-test",
    "/dashboard/:path*",
    "/learn/:path*",
    "/exercise/:path*",
    "/review/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/api/:path*",
  ],
};
