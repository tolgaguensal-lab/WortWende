/**
 * 🔁 Logo-Konsistenz-Prüfung (Überprüfungsschleife)
 *
 * Scannt ALLE Seiten, Layouts und Komponenten auf:
 *  1. ❌ raw <img src="/logo.png"> – muss SVG-Komponente sein
 *  2. ❌ Auth-Seiten mit eigenem min-h-screen – müssen AuthLayout nutzen
 *  3. ❌ Fehlende/doppelte Logo-Imports
 *  4. ❌ object-cover auf Logo (beschneidet das Logo)
 *  5. ❌ Auth-Layout ohne Logo
 *  6. ⚠️  Seiten ohne jegliches Branding
 *
 * Usage:  npx tsx scripts/check-logo-consistency.ts
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, relative, basename } from "path";

// ─── Konfiguration ───────────────────────────────────────────
const SRC_DIR = join(process.cwd(), "src");
const LOGO_PNG_PATH = "/logo.png";
const REQUIRED_COMPONENTS = ["AppIcon", "LogoMark", "LogoFull"];
const AUTH_GROUP = "(auth)";
const DASHBOARD_GROUP = "(dashboard)";

// ─── Typen ───────────────────────────────────────────────────
interface Violation {
  severity: "error" | "warning";
  file: string;
  line: number;
  message: string;
  fix: string;
}

// ─── Hilfsfunktionen ────────────────────────────────────────
function collectTsxFiles(dir: string): string[] {
  const results: string[] = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
        results.push(...collectTsxFiles(full));
      } else if (entry.isFile() && /\.(tsx|jsx)$/.test(entry.name)) {
        results.push(full);
      }
    }
  } catch { /* skip inaccessible */ }
  return results;
}

function findLineNumber(content: string, needle: string, startFrom: number = 0): number {
  const idx = content.indexOf(needle, startFrom);
  if (idx === -1) return -1;
  return content.slice(0, idx).split("\n").length;
}

// ─── Regel-Checks ───────────────────────────────────────────
const checks: { name: string; check: (file: string, content: string, relPath: string) => Violation[] }[] = [

  // 🔴 Regel 1: Kein raw <img src="/logo.png"> — SVG-Komponente verwenden!
  {
    name: "no-raw-logo-png",
    check(_file, content, relPath) {
      const violations: Violation[] = [];
      const regex = /<img\s+src=["']\/logo\.png["'][^>]*>/gi;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(content)) !== null) {
        const line = findLineNumber(content, match[0]);
        violations.push({
          severity: "error",
          file: relPath,
          line,
          message: `raw <img src="/logo.png"> gefunden – wird auf kleinen Containern beschnitten`,
          fix: `Ersetze mit <AppIcon size={...} /> aus @/components/brand/LogoMark`,
        });
      }
      return violations;
    },
  },

  // 🔴 Regel 2: object-cover auf Logo-Bildern = Beschneidung
  {
    name: "no-object-cover-on-logo",
    check(_file, content, relPath) {
      const violations: Violation[] = [];
      // Finde Zeilen mit logo + object-cover
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (/logo/i.test(lines[i]) && /object-cover/.test(lines[i])) {
          violations.push({
            severity: "error",
            file: relPath,
            line: i + 1,
            message: `object-cover auf Logo – beschneidet das Logo`,
            fix: `Nutze <AppIcon size={...} /> (SVG skaliert verlustfrei)`,
          });
        }
      }
      return violations;
    },
  },

  // 🔴 Regel 3: Auth-Seiten mit eigenem min-h-screen (müssen AuthLayout nutzen)
  {
    name: "auth-pages-no-own-wrapper",
    check(_file, content, relPath) {
      const violations: Violation[] = [];
      // Nur in (auth)-Seiten, aber NICHT in layout.tsx selbst
      if (!relPath.includes(AUTH_GROUP) || relPath.endsWith("layout.tsx")) return violations;

      if (/min-h-screen/.test(content)) {
        const line = findLineNumber(content, "min-h-screen");
        violations.push({
          severity: "error",
          file: relPath,
          line,
          message: `Auth-Seite hat eigenen min-h-screen Wrapper – doppelte Verschachtelung mit AuthLayout`,
          fix: `Entferne den äußeren Wrapper; AuthLayout stellt das Layout bereit`,
        });
      }

      // Prüfe auch auf eigenen Logo-Container in Auth-Seiten
      if (/<img\s+src=["']\/logo\.png["']/.test(content) || /AppIcon|LogoMark|LogoFull/.test(content)) {
        // Nur melden wenn es nicht das Layout selbst ist
        const logoImportLine = content.split("\n").findIndex(l => /AppIcon|LogoMark|LogoFull/.test(l) && l.includes("import"));
        if (logoImportLine >= 0) {
          violations.push({
            severity: "warning",
            file: relPath,
            line: logoImportLine + 1,
            message: `Auth-Seite importiert eigenes Logo – sollte vom AuthLayout kommen`,
            fix: `Entferne Logo-Import und -Verwendung; AuthLayout zeigt das Logo zentral`,
          });
        }
      }
      return violations;
    },
  },

  // 🔴 Regel 4: AuthLayout MUSS ein Logo enthalten
  {
    name: "auth-layout-must-have-logo",
    check(_file, content, relPath) {
      const violations: Violation[] = [];
      if (!relPath.includes(`${AUTH_GROUP}/layout.tsx`)) return violations;

      const hasAppIcon = /AppIcon/.test(content) && /from ["']@\/components\/brand\/LogoMark["']/.test(content);
      const hasLogoMark = /LogoMark/.test(content) && /from ["']@\/components\/brand\/LogoMark["']/.test(content);
      const hasRawLogo = /<img\s+src=["']\/logo\.png["']/.test(content);

      if (!hasAppIcon && !hasLogoMark && !hasRawLogo) {
        violations.push({
          severity: "error",
          file: relPath,
          line: 1,
          message: `AuthLayout hat KEIN Logo – nur Text!`,
          fix: `Füge <AppIcon size={64} /> über dem Titel ein (import { AppIcon } from "@/components/brand/LogoMark")`,
        });
      }
      return violations;
    },
  },

  // 🔴 Regel 5: Dashboard-Layout: Logo nicht als <img>, sondern SVG
  {
    name: "dashboard-layout-svg-logo",
    check(_file, content, relPath) {
      const violations: Violation[] = [];
      if (!relPath.includes(`${DASHBOARD_GROUP}/layout.tsx`)) return violations;

      if (/<img\s+src=["']\/logo\.png["']/.test(content)) {
        const line = findLineNumber(content, "/logo.png");
        violations.push({
          severity: "error",
          file: relPath,
          line,
          message: `Dashboard-Layout verwendet <img> für Logo statt SVG-Komponente`,
          fix: `Ersetze mit <AppIcon size={32} className="shrink-0 rounded-md shadow-sm" />`,
        });
      }
      return violations;
    },
  },

  // 🟡 Regel 6: Warnung bei Seiten OHNE Logo/AppIcon/LogoMark-Import
  // (Nur für Nicht-Layout, Nicht-API Seiten)
  {
    name: "pages-should-have-branding",
    check(_file, content, relPath) {
      const violations: Violation[] = [];
      // Nur page.tsx Dateien, keine layouts, keine API routes
      if (!/page\.tsx$/.test(relPath)) return violations;
      if (relPath.includes("layout.tsx")) return violations;
      if (relPath.includes("\\api\\") || relPath.includes("/api/")) return violations;

      // Seiten die von einem Layout umschlossen werden sind okay
      if (relPath.includes(AUTH_GROUP) || relPath.includes(DASHBOARD_GROUP)) return violations;

      const hasLogoComponent = REQUIRED_COMPONENTS.some(c => content.includes(c));
      const hasRawLogo = /logo\.(png|svg|ico)/i.test(content);
      // Prüfe auch ob die Seite überhaupt sichtbaren Content hat
      const hasVisualContent = /return\s*\(/.test(content);

      if (!hasLogoComponent && !hasRawLogo && hasVisualContent) {
        violations.push({
          severity: "warning",
          file: relPath,
          line: 1,
          message: `Seite ohne Logo/Branding – kein AppIcon, LogoMark oder LogoFull import`,
          fix: `Falls es eine öffentliche Seite ist, füge das Logo hinzu`,
        });
      }
      return violations;
    },
  },

  // 🟡 Regel 7: Prüfe ob importierte Logo-Komponenten auch verwendet werden
  {
    name: "unused-logo-imports",
    check(_file, content, relPath) {
      const violations: Violation[] = [];
      for (const comp of REQUIRED_COMPONENTS) {
        const importRegex = new RegExp(`import\\s+\\{[^}]*\\b${comp}\\b[^}]*\\}\\s+from\\s+["']@/components/brand/LogoMark["']`);
        if (importRegex.test(content)) {
          // Prüfe ob die Komponente auch im JSX verwendet wird (außer im import selbst)
          const afterImport = content.replace(importRegex, "");
          // Suche nach JSX-Verwendung: <AppIcon oder <LogoMark etc.
          const usageRegex = new RegExp(`<${comp}[\\s>/]`);
          if (!usageRegex.test(afterImport)) {
            const line = findLineNumber(content, comp);
            violations.push({
              severity: "warning",
              file: relPath,
              line,
              message: `${comp} importiert aber nicht verwendet`,
              fix: `Entferne ungenutzten Import`,
            });
          }
        }
      }
      return violations;
    },
  },
];

// ─── Hauptlogik ──────────────────────────────────────────────
function main() {
  console.log("🔍 Logo-Konsistenz-Prüfung (Überprüfungsschleife)");
  console.log("═".repeat(62));
  console.log("");

  const allFiles = collectTsxFiles(SRC_DIR);
  const allViolations: Violation[] = [];

  for (const file of allFiles) {
    const relPath = relative(process.cwd(), file);
    let content: string;
    try {
      content = readFileSync(file, "utf-8");
    } catch {
      continue;
    }

    for (const rule of checks) {
      try {
        const violations = rule.check(file, content, relPath);
        allViolations.push(...violations);
      } catch (err) {
        console.error(`⚠️  Fehler in Regel "${rule.name}" bei ${relPath}:`, err);
      }
    }
  }

  // ─── Ausgabe ──────────────────────────────────────────────
  const errors = allViolations.filter(v => v.severity === "error");
  const warnings = allViolations.filter(v => v.severity === "warning");

  if (allViolations.length === 0) {
    console.log("✅ ALLE PRÜFUNGEN BESTANDEN – Logo ist konsistent!\n");
    process.exit(0);
  }

  // Gruppiere nach Datei
  const byFile = new Map<string, Violation[]>();
  for (const v of allViolations) {
    const existing = byFile.get(v.file) || [];
    existing.push(v);
    byFile.set(v.file, existing);
  }

  for (const [file, violations] of byFile) {
    console.log(`📄 ${file}`);
    for (const v of violations) {
      const icon = v.severity === "error" ? "❌" : "⚠️ ";
      console.log(`   ${icon} Zeile ${v.line}: ${v.message}`);
      console.log(`      🔧 Fix: ${v.fix}`);
    }
    console.log("");
  }

  // ─── Zusammenfassung ──────────────────────────────────────
  console.log("═".repeat(62));
  console.log(`📊 ZUSAMMENFASSUNG: ${errors.length} Fehler, ${warnings.length} Warnungen`);
  console.log("═".repeat(62));

  if (errors.length > 0) {
    console.log("\n❌ PRÜFUNG FEHLGESCHLAGEN – Bitte behebe die Fehler oben.\n");
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log("\n⚠️  PRÜFUNG MIT WARNUNGEN – Empfohlen zu beheben.\n");
    process.exit(0);
  }
}

main();
