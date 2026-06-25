import { NextRequest, NextResponse } from "next/server";

const API_PREFIX = "/api/v1";
const API_HOST = "api.wortwende.guenlab.de";
const MAIN_HOST = "wortwende.guenlab.de";

/** Security-Header, die auf ALLE Responses angewendet werden */
const SECURITY_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data:; connect-src 'self' https://api.deepseek.com https://languagetool.org; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
};

type ResponseWithHeaders = NextResponse | Response;

function applySecurityHeaders(response: ResponseWithHeaders): ResponseWithHeaders {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

const CSP_NONCE = false; // auf true setzen, wenn Nonce-basiertes CSP nötig ist

export default function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const { pathname } = req.nextUrl;

  // API-Domain → Nicht-API-Routen auf Main-Domain redirecten
  if (host === API_HOST && !pathname.startsWith(API_PREFIX)) {
    return applySecurityHeaders(
      NextResponse.redirect(
        new URL(`https://${MAIN_HOST}${pathname}${req.nextUrl.search}`)
      )
    );
  }

  // CORS + Security für API-Routen
  if (pathname.startsWith(API_PREFIX)) {
    if (req.method === "OPTIONS") {
      return applySecurityHeaders(
        new NextResponse(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":
              "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
              "X-API-Key, Content-Type, Authorization",
            "Access-Control-Max-Age": "86400",
          },
        })
      );
    }

    const response = NextResponse.next();
    const allowedOrigin = process.env.ALLOWED_ORIGIN || "https://wortwende.guenlab.de";
    response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    response.headers.set("Vary", "Origin");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "X-API-Key, Content-Type, Authorization"
    );
    return applySecurityHeaders(response);
  }

  // Security-Header für alle anderen Seiten
  return applySecurityHeaders(NextResponse.next());
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
