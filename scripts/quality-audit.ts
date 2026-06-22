/**
 * 🔁 UMFASSENDE QUALITÄTS-ÜBERPRÜFUNGSSCHLEIFE
 * =============================================
 * Prüft ALLE Aspekte für Produktionsreife:
 *
 *   📋 RECHTLICHES     – Impressum, Datenschutz, AGB vorhanden & verlinkt
 *   🏷️  BRANDING        – Logo-Konsistenz (SVG, kein raw PNG)
 *   ♿ ACCESSIBILITY    – Alt-Texte, Labels, Heading-Hierarchie
 *   🔒 SICHERHEIT      – Keine Secrets, env-Schutz
 *   🧹 CODE-QUALITÄT   – Kein console.log, TODO/FIXME, @ts-ignore
 *   📄 CONTENT         – Kein Lorem Ipsum, keine leeren Seiten
 *   🔗 LINKS           – Keine Broken Links (interne Prüfung)
 *   🏗️  STRUKTUR        – Layout-Verschachtelung, Metadaten
 *
 * Usage:  npx tsx scripts/quality-audit.ts
 *         npm run audit
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, relative, basename } from "path";

// ─── Konfiguration ───────────────────────────────────────────
const SRC_DIR = join(process.cwd(), "src");
const AUTH_GROUP = "(auth)";
const DASHBOARD_GROUP = "(dashboard)";
const LEGAL_PAGES = [
  { path: "/impressum", name: "Impressum", required: true },
  { path: "/datenschutz", name: "Datenschutz", required: true },
  { path: "/agb", name: "AGB", required: true },
];

// ─── Typen ───────────────────────────────────────────────────
interface Violation {
  category: string;
  severity: "error" | "warning";
  file: string;
  line: number;
  message: string;
}

// ─── Hilfsfunktionen ────────────────────────────────────────
function collectTsxFiles(dir: string): string[] {
  const results: string[] = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
        results.push(...collectTsxFiles(full));
      } else if (entry.isFile() && /\.(tsx|jsx|ts)$/.test(entry.name)) {
        results.push(full);
      }
    }
  } catch { /* skip */ }
  return results;
}

function findLine(content: string, needle: string | RegExp, startFrom: number = 0): number {
  const idx = typeof needle === "string" ? content.indexOf(needle, startFrom) : content.slice(startFrom).search(needle);
  if (idx === -1) return -1;
  const absIdx = typeof needle === "string" ? idx : startFrom + idx;
  return content.slice(0, absIdx).split("\n").length;
}

function linesOf(content: string): string[] {
  return content.split("\n");
}

function rel(path: string): string {
  return relative(process.cwd(), path);
}

// ─── KATEGORIE 1: RECHTLICHES ────────────────────────────────
function checkLegal(): Violation[] {
  const violations: Violation[] = [];

  // Prüfe ob jede Pflichtseite existiert
  for (const page of LEGAL_PAGES) {
    const pageDir = join(process.cwd(), "src", "app", page.path.slice(1));
    const pageFile = join(pageDir, "page.tsx");
    if (!existsSync(pageFile)) {
      violations.push({
        category: "RECHTLICHES",
        severity: "error",
        file: `src/app${page.path}/page.tsx`,
        line: 0,
        message: `Pflichtseite "${page.name}" fehlt! (${page.path}) – in DE/AT/CH rechtlich erforderlich`,
      });
    }
  }

  // Prüfe ob Footer auf Landing Page alle Pflichtseiten verlinkt
  const landingPage = join(process.cwd(), "src", "app", "page.tsx");
  if (existsSync(landingPage)) {
    const content = readFileSync(landingPage, "utf-8");
    for (const page of LEGAL_PAGES) {
      if (!content.includes(`href="${page.path}"`) && !content.includes(`href={\"${page.path}\"}`)) {
        violations.push({
          category: "RECHTLICHES",
          severity: "error",
          file: "src/app/page.tsx",
          line: findLine(content, "footer") || 1,
          message: `Footer verlinkt nicht auf "${page.name}" (${page.path})`,
        });
      }
    }
  }

  return violations;
}

// ─── KATEGORIE 2: BRANDING & LOGO ───────────────────────────
function checkBranding(): Violation[] {
  const violations: Violation[] = [];
  const allFiles = collectTsxFiles(SRC_DIR);

  for (const file of allFiles) {
    const rp = rel(file);
    let content: string;
    try { content = readFileSync(file, "utf-8"); } catch { continue; }

    // 2a: Kein raw <img src="/logo.png">
    const imgLogoRegex = /<img\s+src=["']\/logo\.(png|svg|ico)["'][^>]*>/gi;
    let match: RegExpExecArray | null;
    while ((match = imgLogoRegex.exec(content)) !== null) {
      violations.push({
        category: "BRANDING",
        severity: "error",
        file: rp, line: findLine(content, match[0]),
        message: `raw <img> für Logo – wird auf kleinen Containern beschnitten. Nutze <AppIcon /> SVG-Komponente`,
      });
    }

    // 2b: object-cover auf Logo
    if (/logo/i.test(content) && /object-cover/.test(content)) {
      violations.push({
        category: "BRANDING",
        severity: "error",
        file: rp, line: findLine(content, "object-cover"),
        message: "object-cover auf Logo beschneidet das Bild",
      });
    }

    // 2c: Auth-Seiten ohne eigenen min-h-screen (müssen AuthLayout nutzen)
    if (rp.includes(AUTH_GROUP) && !rp.endsWith("layout.tsx") && /min-h-screen/.test(content)) {
      violations.push({
        category: "BRANDING",
        severity: "error",
        file: rp, line: findLine(content, "min-h-screen"),
        message: "Auth-Seite hat eigenen min-h-screen Wrapper – doppelte Verschachtelung mit AuthLayout",
      });
    }

    // 2d: AuthLayout muss Logo enthalten
    if (rp.includes(`${AUTH_GROUP}/layout.tsx`)) {
      const hasLogo = /AppIcon|LogoMark/.test(content) || /<img\s+src=["']\/logo\./.test(content);
      if (!hasLogo) {
        violations.push({
          category: "BRANDING",
          severity: "error",
          file: rp, line: 1,
          message: "AuthLayout hat KEIN Logo! Füge <AppIcon size={64} /> hinzu",
        });
      }
    }
  }
  return violations;
}

// ─── KATEGORIE 3: ACCESSIBILITY (WCAG 2.2 AA Basics) ────────
function checkAccessibility(): Violation[] {
  const violations: Violation[] = [];
  const allFiles = collectTsxFiles(SRC_DIR);

  for (const file of allFiles) {
    const rp = rel(file);
    let content: string;
    try { content = readFileSync(file, "utf-8"); } catch { continue; }

    // 3a: <img> ohne alt-Attribut
    const imgRegex = /<img\s+(?![^>]*\balt=)[^>]*>/gi;
    let m: RegExpExecArray | null;
    while ((m = imgRegex.exec(content)) !== null) {
      // Skip if it's a decorative SVG or inside a comment
      if (m[0].includes("aria-hidden")) continue;
      violations.push({
        category: "ACCESSIBILITY",
        severity: "error",
        file: rp, line: findLine(content, m[0]),
        message: "<img> ohne alt-Attribut – Screenreader können das Bild nicht beschreiben",
      });
    }

    // 3b: <button> ohne Text/Label/aria-label (nur Icon-Buttons)
    const btnRegex = /<button\s+(?![^>]*>[\s\S]*?[a-zA-Z\u00C0-\u024F])[^>]*>/gi;
    // Better: Find buttons with only an icon and no aria-label
    const lines = linesOf(content);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Button that contains only an SVG/Icon but no aria-label
      if (/<button[^>]*>/.test(line) && !/aria-label/.test(line) && !/aria-labelledby/.test(line)) {
        // Check if the next line has text content
        const nextFew = lines.slice(i, i + 3).join(" ");
        const hasTextContent = />[^<]*[a-zA-Z\u00C0-\u024F]{2,}/.test(nextFew);
        if (!hasTextContent && /<button[^>]*>$/.test(line.trim())) {
          violations.push({
            category: "ACCESSIBILITY",
            severity: "warning",
            file: rp, line: i + 1,
            message: "<button> ohne aria-label und ohne Text – Icon-Button ist für Screenreader unsichtbar",
          });
        }
      }
    }

    // 3c: outline:none ohne :focus-visible Ersatz
    if (/outline\s*:\s*none/.test(content) && !/:focus-visible/.test(content)) {
      violations.push({
        category: "ACCESSIBILITY",
        severity: "warning",
        file: rp, line: findLine(content, "outline"),
        message: "outline: none ohne :focus-visible-Ersatz – Tastaturnutzer sehen keinen Fokus-Indikator",
      });
    }

    // 3d: Fehlende h1 auf pages (nur page.tsx, nicht layout)
    if (/\/page\.tsx$/.test(rp) && !rp.includes("layout.tsx")) {
      if (!/<h1[\s>]/.test(content) && /return\s*\(/.test(content)) {
        violations.push({
          category: "ACCESSIBILITY",
          severity: "warning",
          file: rp, line: 1,
          message: "Seite hat keine <h1> – Screenreader-Nutzer finden die Hauptüberschrift nicht",
        });
      }
    }
  }
  return violations;
}

// ─── KATEGORIE 4: SICHERHEIT ─────────────────────────────────
function checkSecurity(): Violation[] {
  const violations: Violation[] = [];
  const allFiles = collectTsxFiles(SRC_DIR);

  // 4a: Hardcoded secrets/keywords
  const secretPatterns = [
    { regex: /(api[_-]?key|apikey|secret|password|token)\s*[:=]\s*["'][a-zA-Z0-9_-]{20,}["']/gi, label: "Hardcoded API-Key/Secret" },
    { regex: /(API_KEY|SECRET|TOKEN|PASSWORD)\s*=\s*["'][a-zA-Z0-9_-]{10,}["']/g, label: "Hardcoded Konstante (KEY/SECRET)" },
  ];

  for (const file of allFiles) {
    // Skip node_modules, .next, etc.
    const rp = rel(file);
    if (rp.includes("node_modules") || rp.includes(".next")) continue;

    let content: string;
    try { content = readFileSync(file, "utf-8"); } catch { continue; }

    for (const { regex, label } of secretPatterns) {
      let m: RegExpExecArray | null;
      while ((m = regex.exec(content)) !== null) {
        // Skip if it's in a comment or test file
        const line = findLine(content, m[0]);
        const lineContent = linesOf(content)[line - 1] || "";
        if (/^\s*\/\/|^\s*\/\*|^\s*\*/.test(lineContent.trim())) continue;
        if (rp.includes("__tests__") || rp.includes(".test.") || rp.includes(".spec.")) continue;

        violations.push({
          category: "SICHERHEIT",
          severity: "error",
          file: rp, line,
          message: `${label}: "${m[0].substring(0, 60)}..." – in Umgebungsvariable auslagern!`,
        });
      }
    }
  }

  // 4b: Prüfe ob .env.example existiert
  const envExample = join(process.cwd(), ".env.example");
  const envFile = join(process.cwd(), ".env");
  const deployEnv = join(process.cwd(), "deploy", "zimaos.env.example");

  if (!existsSync(envExample) && !existsSync(deployEnv)) {
    violations.push({
      category: "SICHERHEIT",
      severity: "warning",
      file: ".env.example",
      line: 0,
      message: "Keine .env.example vorhanden – Entwickler wissen nicht, welche Variablen nötig sind",
    });
  }

  // 4c: .gitignore muss .env enthalten
  const gitignore = join(process.cwd(), ".gitignore");
  if (existsSync(gitignore)) {
    const gi = readFileSync(gitignore, "utf-8");
    if (!/^\.env$/m.test(gi)) {
      violations.push({
        category: "SICHERHEIT",
        severity: "error",
        file: ".gitignore",
        line: 0,
        message: ".env ist nicht in .gitignore – Gefahr, Secrets zu committen!",
      });
    }
  }

  return violations;
}

// ─── KATEGORIE 5: CODE-QUALITÄT ──────────────────────────────
function checkCodeQuality(): Violation[] {
  const violations: Violation[] = [];
  const allFiles = collectTsxFiles(SRC_DIR);

  for (const file of allFiles) {
    const rp = rel(file);
    if (rp.includes("node_modules") || rp.includes(".next")) continue;

    let content: string;
    try { content = readFileSync(file, "utf-8"); } catch { continue; }

    // 5a: console.log in Produktionscode (nicht in scripts/)
    if (!rp.startsWith("scripts") && /console\.(log|warn|error|debug)\s*\(/.test(content)) {
      const lines = linesOf(content);
      for (let i = 0; i < lines.length; i++) {
        if (/console\.(log|warn|debug)\s*\(/.test(lines[i]) && !/^\s*\/\//.test(lines[i])) {
          violations.push({
            category: "CODE-QUALITÄT",
            severity: "warning",
            file: rp, line: i + 1,
            message: `console.${/(log|warn|debug)/.exec(lines[i])?.[1] || "log"} im Produktionscode – entfernen oder durch Logger ersetzen`,
          });
        }
      }
    }

    // 5b: TODO/FIXME/HACK ohne Issue-Referenz
    const todoRegex = /\/\/\s*(TODO|FIXME|HACK|XXX)(?!.*#\d+)(?!.*issue)/gi;
    let m: RegExpExecArray | null;
    while ((m = todoRegex.exec(content)) !== null) {
      violations.push({
        category: "CODE-QUALITÄT",
        severity: "warning",
        file: rp, line: findLine(content, m[0]),
        message: `${m[1]} ohne Issue-Referenz – wird sonst nie behoben`,
      });
    }

    // 5c: @ts-ignore ohne Begründung
    const tsIgnoreRegex = /\/\/\s*@ts-ignore(?!.*(because|reason|TODO|FIXME|begründ|erklär))/gi;
    let tsm: RegExpExecArray | null;
    while ((tsm = tsIgnoreRegex.exec(content)) !== null) {
      violations.push({
        category: "CODE-QUALITÄT",
        severity: "warning",
        file: rp, line: findLine(content, tsm[0]),
        message: "@ts-ignore ohne Begründung – dokumentiere warum",
      });
    }

    // 5d: @ts-expect-error ohne Beschreibung
    const expectErrorRegex = /\/\/\s*@ts-expect-error\s*$/gm;
    let em: RegExpExecArray | null;
    while ((em = expectErrorRegex.exec(content)) !== null) {
      const line = linesOf(content)[findLine(content, em[0]) - 1] || "";
      if (!/because|TODO|FIXME|reason|begründ|erklär/i.test(line)) {
        violations.push({
          category: "CODE-QUALITÄT",
          severity: "warning",
          file: rp, line: findLine(content, em[0]),
          message: "@ts-expect-error ohne Beschreibung – dokumentiere warum der Fehler erwartet wird",
        });
      }
    }
  }
  return violations;
}

// ─── KATEGORIE 6: CONTENT-QUALITÄT ───────────────────────────
function checkContent(): Violation[] {
  const violations: Violation[] = [];
  const allFiles = collectTsxFiles(SRC_DIR);

  for (const file of allFiles) {
    const rp = rel(file);
    // Nur page.tsx und Komponenten
    if (!/\.(tsx|jsx)$/.test(rp)) continue;

    let content: string;
    try { content = readFileSync(file, "utf-8"); } catch { continue; }

    // 6a: Lorem Ipsum / Platzhaltertext
    if (/lorem\s+ipsum/i.test(content)) {
      violations.push({
        category: "CONTENT",
        severity: "error",
        file: rp, line: findLine(content, /lorem\s+ipsum/i),
        message: "Lorem Ipsum Platzhaltertext gefunden – durch echten Content ersetzen",
      });
    }

    // 6b: "TODO" als sichtbarer Text (nicht als Kommentar)
    const visibleTodoRegex = />[^<]*\bTODO\b[^<]*</gi;
    let m: RegExpExecArray | null;
    while ((m = visibleTodoRegex.exec(content)) !== null) {
      violations.push({
        category: "CONTENT",
        severity: "error",
        file: rp, line: findLine(content, m[0]),
        message: `"TODO" als sichtbarer Text – User sehen unfertigen Content`,
      });
    }
  }

  // 6c: Leere pages (page.tsx mit return null oder leer)
  const pageFiles = allFiles.filter(f => /\/page\.tsx$/.test(rel(f)) || /\/page\.jsx$/.test(rel(f)));
  for (const file of pageFiles) {
    const rp = rel(file);
    let content: string;
    try { content = readFileSync(file, "utf-8"); } catch { continue; }

    // Check if the page actually renders something
    const hasReturn = /return\s*\(/.test(content);
    const hasNullReturn = /return\s+(null|undefined)\s*;?\s*$/.test(content);
    const hasRedirect = /redirect\(/.test(content) || /notFound\(\)/.test(content);

    if (hasNullReturn && !hasRedirect) {
      violations.push({
        category: "CONTENT",
        severity: "warning",
        file: rp, line: findLine(content, "return null"),
        message: "Seite returned null – keine Inhalte für Besucher",
      });
    }

    if (!hasReturn && !hasRedirect && content.length > 50) {
      violations.push({
        category: "CONTENT",
        severity: "warning",
        file: rp, line: 1,
        message: "Seite hat keinen return()-Block – möglicherweise keine sichtbaren Inhalte",
      });
    }
  }

  return violations;
}

// ─── KATEGORIE 7: INTERNE LINKS ──────────────────────────────
function checkLinks(): Violation[] {
  const violations: Violation[] = [];
  const allFiles = collectTsxFiles(SRC_DIR);

  // Sammle alle existierenden Routen
  const existingRoutes = new Set<string>();
  const routeDir = join(process.cwd(), "src", "app");
  function collectRoutes(dir: string, prefix: string = "") {
    try {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
        if (entry.name.startsWith("(")) {
          // Route groups don't affect the URL
          collectRoutes(join(dir, entry.name), prefix);
        } else if (entry.isDirectory()) {
          const routePath = prefix + "/" + entry.name;
          existingRoutes.add(routePath);
          collectRoutes(join(dir, entry.name), routePath);
        } else if (entry.name === "page.tsx" || entry.name === "page.jsx") {
          existingRoutes.add(prefix || "/");
        }
      }
    } catch { /* skip */ }
  }
  collectRoutes(routeDir);

  for (const file of allFiles) {
    const rp = rel(file);
    let content: string;
    try { content = readFileSync(file, "utf-8"); } catch { continue; }

    // Finde interne Links: href="/..."
    const linkRegex = /href=["'](\/[a-zA-Z0-9_\-\/]*)["']/g;
    let m: RegExpExecArray | null;
    while ((m = linkRegex.exec(content)) !== null) {
      const href = m[1];
      // Skip API routes, external links, dynamic segments
      if (href.startsWith("/api/")) continue;
      if (href.includes("http")) continue;
      if (href === "/") continue;
      // Remove dynamic segments like [id], [...slug]
      const normalized = href.replace(/\/\[[^\]]+\]/g, "");
      if (!existingRoutes.has(normalized) && !href.includes("[") && !href.includes("]")) {
        // Check if it's a redirect or conditional
        const line = findLine(content, m[0]);
        const lineContent = linesOf(content)[line - 1] || "";
        if (!/redirect|notFound|catch/i.test(lineContent)) {
          violations.push({
            category: "LINKS",
            severity: "warning",
            file: rp, line,
            message: `Interner Link "${href}" zeigt auf nicht existierende Route`,
          });
        }
      }
    }
  }

  return violations;
}

// ─── KATEGORIE 8: HEADING-HIERARCHIE ────────────────────────
function checkHeadingHierarchy(): Violation[] {
  const violations: Violation[] = [];
  const allFiles = collectTsxFiles(SRC_DIR);

  for (const file of allFiles) {
    const rp = rel(file);
    let content: string;
    try { content = readFileSync(file, "utf-8"); } catch { continue; }

    // Finde alle headings in der Reihenfolge
    const headingRegex = /<h([1-6])[\s>]/g;
    const headings: { level: number; line: number }[] = [];
    let m: RegExpExecArray | null;
    while ((m = headingRegex.exec(content)) !== null) {
      headings.push({ level: parseInt(m[1]), line: findLine(content, m[0]) });
    }

    // Prüfe auf Sprünge (z.B. h2 -> h4 ohne h3)
    for (let i = 1; i < headings.length; i++) {
      const prev = headings[i - 1];
      const curr = headings[i];
      if (curr.level - prev.level > 1) {
        violations.push({
          category: "ACCESSIBILITY",
          severity: "warning",
          file: rp, line: curr.line,
          message: `Heading-Sprung von h${prev.level} zu h${curr.level} – h${prev.level + 1} fehlt (WCAG 2.2)`,
        });
      }
    }
  }
  return violations;
}

// ─── KATEGORIE 9: MOBILE LAYOUT ──────────────────────────────
function checkMobileLayout(): Violation[] {
  const violations: Violation[] = [];
  const allFiles = collectTsxFiles(SRC_DIR);

  for (const file of allFiles) {
    const rp = rel(file);
    if (!/\/page\.tsx$/.test(rp) && !/\/layout\.tsx$/.test(rp)) continue;

    let content: string;
    try { content = readFileSync(file, "utf-8"); } catch { continue; }

    // Prüfe ob Tailwind responsive prefixes verwendet werden
    const hasResponsive = /(sm|md|lg|xl):/.test(content);
    const hasReturn = /return\s*\(/.test(content);

    if (hasReturn && !hasResponsive && !rp.includes("layout.tsx") && content.length > 200) {
      violations.push({
        category: "MOBILE",
        severity: "warning",
        file: rp, line: 1,
        message: "Keine responsiven Breakpoints (sm:/md:/lg:) gefunden – Seite möglicherweise nicht mobil-optimiert",
      });
    }
  }
  return violations;
}

// ─── HAUPTLOGIK ──────────────────────────────────────────────
function main() {
  console.log("═".repeat(66));
  console.log("🔍 QUALITÄTS-ÜBERPRÜFUNGSSCHLEIFE — Produktions-Check");
  console.log("═".repeat(66));
  console.log("");

  const allChecks = [
    { name: "RECHTLICHES (Impressum, DSGVO, AGB)", fn: checkLegal },
    { name: "BRANDING (Logo-Konsistenz)", fn: checkBranding },
    { name: "ACCESSIBILITY (WCAG 2.2 AA Basics)", fn: checkAccessibility },
    { name: "SICHERHEIT (Secrets, .env)", fn: checkSecurity },
    { name: "CODE-QUALITÄT (console.log, TODO, @ts-ignore)", fn: checkCodeQuality },
    { name: "CONTENT (Lorem Ipsum, leere Seiten)", fn: checkContent },
    { name: "LINKS (Broken Internal Links)", fn: checkLinks },
    { name: "HEADING-HIERARCHIE", fn: checkHeadingHierarchy },
    { name: "MOBILE LAYOUT (Responsive)", fn: checkMobileLayout },
  ];

  let totalErrors = 0;
  let totalWarnings = 0;
  const allViolations: Violation[] = [];

  for (const { name, fn } of allChecks) {
    const violations = fn();
    const errs = violations.filter(v => v.severity === "error");
    const warns = violations.filter(v => v.severity === "warning");

    const icon = errs.length > 0 ? "❌" : warns.length > 0 ? "⚠️ " : "✅";
    console.log(`${icon} ${name}: ${errs.length} Fehler, ${warns.length} Warnungen`);

    allViolations.push(...violations);
    totalErrors += errs.length;
    totalWarnings += warns.length;
  }

  console.log("");
  console.log("═".repeat(66));

  // Detail-Ausgabe nur bei Fehlern
  if (allViolations.length > 0) {
    console.log("");
    console.log("📋 DETAILS:");
    console.log("");

    // Gruppiere nach Kategorie
    const byCategory = new Map<string, Violation[]>();
    for (const v of allViolations) {
      const arr = byCategory.get(v.category) || [];
      arr.push(v);
      byCategory.set(v.category, arr);
    }

    for (const [cat, viols] of byCategory) {
      const catErrors = viols.filter(v => v.severity === "error");
      const catWarns = viols.filter(v => v.severity === "warning");

      if (catErrors.length === 0 && catWarns.length === 0) continue;

      console.log(`─── ${cat} ───`);
      for (const v of viols) {
        const icon = v.severity === "error" ? "❌" : "⚠️ ";
        if (v.line > 0) {
          console.log(`   ${icon} ${v.file}:${v.line}`);
        } else {
          console.log(`   ${icon} ${v.file}`);
        }
        console.log(`      ${v.message}`);
      }
      console.log("");
    }
  }

  console.log("═".repeat(66));
  console.log(`📊 GESAMT: ${totalErrors} Fehler, ${totalWarnings} Warnungen`);
  console.log("═".repeat(66));

  if (totalErrors > 0) {
    console.log("");
    console.log("❌ QUALITY GATE FEHLGESCHLAGEN – Fehler müssen behoben werden.");
    console.log("   Fehler = Blocker für Produktion.");
    console.log("");
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log("");
    console.log("⚠️  QUALITY GATE BESTANDEN (mit Warnungen) – Empfohlen zu beheben.");
    console.log("");
    process.exit(0);
  } else {
    console.log("");
    console.log("✅ ALLE PRÜFUNGEN BESTANDEN – Ready für Produktion!");
    console.log("");
    process.exit(0);
  }
}

main();
