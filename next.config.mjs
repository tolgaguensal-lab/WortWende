// Startup-Check: Fehlende Environment-Vars warnen (nicht throwen!)
// Docker-Builds haben keine ENV-Vars, daher nur warnen
try {
  const REQUIRED = ["DATABASE_URL", "NEXTAUTH_URL", "NEXTAUTH_SECRET"];
  const missing = REQUIRED.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.warn(
      `[ENV] Missing required variables (will use defaults):\n  ${missing.join("\n  ")}`
    );
  }
  const secret = process.env.NEXTAUTH_SECRET || "";
  if (secret.length < 32) {
    console.warn(
      "[ENV] NEXTAUTH_SECRET should be at least 32 characters. Generate one with: openssl rand -base64 32"
    );
  }
} catch (e) {
  console.warn("[ENV] Validation warning:", e instanceof Error ? e.message : e);
}

/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.deepseek.com https://languagetool.org;" },
];

const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "wortwende.guenlab.de",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  outputFileTracingIncludes: {
    "/*": ["./node_modules/bcryptjs/**/*", "./node_modules/@auth/**/*", "./node_modules/next-auth/**/*", "./node_modules/@prisma/**/*", "./node_modules/.prisma/**/*", "./node_modules/prisma/**/*"],
  },
  serverExternalPackages: ["bcryptjs", "@auth/prisma-adapter"],
  async headers() {
    return [
      {
        // Statische Assets (JS, CSS, Bilder, Fonts)
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
