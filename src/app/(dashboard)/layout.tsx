import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, BookA, LogOut, ChevronRight, Bot, Zap } from "lucide-react";
import { LangSelectorWrapper } from "@/components/shared/LangSelectorWrapper";
import { AppIcon } from "@/components/brand/LogoMark";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/tutor", label: "KI-Tutor", icon: Bot, highlight: true },
  { href: "/vocabulary", label: "Vokabeln", icon: BookA },
  { href: "/pricing", label: "Preise", icon: Zap },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col z-30 bg-card border-r border-border/60">
        {/* Brand */}
        <div className="p-5 border-b border-border/40">
          <div className="flex items-center gap-3">
            <AppIcon size={32} className="shrink-0 rounded-md shadow-sm" />
            <div>
              <h1 className="text-base font-display font-bold text-foreground tracking-tight">Wortwende</h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Deutsch lernen</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-premium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                item.highlight
                  ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              <item.icon size={17} className={`shrink-0 transition-colors ${item.highlight ? "text-primary" : "group-hover:text-foreground"}`} />
              <span>{item.label}</span>
              <ChevronRight size={14} className={`ml-auto opacity-0 group-hover:opacity-30 transition-opacity ${item.highlight ? "opacity-40" : ""}`} />
            </Link>
          ))}
        </nav>

        {/* Language Selector */}
        <div className="px-3 pb-2">
          <LangSelectorWrapper />
        </div>

        {/* User footer */}
        <div className="p-3 border-t border-border/40">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer group">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
              {(session.user?.name?.[0] ?? "U").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{session.user?.name ?? "Benutzer"}</p>
              <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
            </div>
            <Link href="/settings" aria-label="Einstellungen">
              <LogOut size={14} className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/60 flex justify-around py-2 px-2 z-30 safe-bottom">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 text-xs transition-colors py-1.5 px-2 rounded-lg min-w-[48px] min-h-[48px] ${
              item.highlight
                ? "text-primary bg-primary/10 -mt-2 h-16 rounded-xl shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            <item.icon size={item.highlight ? 22 : 18} />
            <span className="font-medium leading-none">{item.label.split(" ")[0]}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
