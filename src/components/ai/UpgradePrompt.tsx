"use client";

import { Rocket, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const LEVEL_UPGRADE: Record<string, { nextLevel: string; sessions: number; price: string }> = {
  A1: { nextLevel: "A2", sessions: 100, price: "4,99 €" },
  A2: { nextLevel: "B1", sessions: 200, price: "8,99 €" },
  B1: { nextLevel: "B2", sessions: 300, price: "12,99 €" },
  B2: { nextLevel: "C1", sessions: 500, price: "14,99 €" },
  C1: { nextLevel: "C1", sessions: 500, price: "14,99 €" },
};

interface UpgradePromptProps {
  currentLevel: string;
  sessionsRemaining: number;
  onClose?: () => void;
}

export function UpgradePrompt({ currentLevel, sessionsRemaining, onClose }: UpgradePromptProps) {
  const upgrade = LEVEL_UPGRADE[currentLevel] ?? LEVEL_UPGRADE.A1;
  const isAtLimit = sessionsRemaining <= 0;

  return (
    <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 overflow-hidden">
      <CardContent className="p-5 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            aria-label="Schliessen"
          >
            <X size={14} />
          </button>
        )}

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 shadow-sm">
            <Rocket size={18} className="text-white" />
          </div>
          <div className="space-y-3 flex-1">
            {isAtLimit ? (
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Tageslimit erreicht!
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Mit <strong>{upgrade.nextLevel}</strong> bekommst du <strong>{upgrade.sessions}</strong> Sessions pro Tag.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Bald am Limit – Upgrade?
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Nur noch {sessionsRemaining} Sessions heute. Mit <strong>{upgrade.nextLevel}</strong> bekommst du <strong>{upgrade.sessions}</strong> pro Tag.
                </p>
              </div>
            )}

            <Link href="/pricing">
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-xs shadow-md shadow-primary/20"
              >
                Upgraden &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
