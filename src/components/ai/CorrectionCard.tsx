"use client";

import { X, Check, Lightbulb } from "lucide-react";

interface CorrectionCardProps {
  original: string;
  corrected: string;
  explanation: string;
}

/** Visuelles Korrektur-Feedback – Praktika-/Univerbal-Style */
export function CorrectionCard({ original, corrected, explanation }: CorrectionCardProps) {
  return (
    <div className="mt-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-sm">
      {/* Falscher Text – durchgestrichen */}
      <div className="flex items-start gap-2 mb-2">
        <X size={14} className="text-red-500 mt-0.5 shrink-0" />
        <div>
          <span className="text-xs text-red-500 font-medium uppercase tracking-wider">Falsch</span>
          <p className="text-foreground line-through decoration-red-400 decoration-2">
            {original}
          </p>
        </div>
      </div>

      {/* Korrigierter Text – grün */}
      <div className="flex items-start gap-2 mb-2">
        <Check size={14} className="text-green-500 mt-0.5 shrink-0" />
        <div>
          <span className="text-xs text-green-500 font-medium uppercase tracking-wider">Richtig</span>
          <p className="text-foreground font-semibold text-green-700 dark:text-green-400">
            {corrected}
          </p>
        </div>
      </div>

      {/* Erklärung */}
      {explanation && (
        <div className="flex items-start gap-2">
          <Lightbulb size={14} className="text-amber-500 mt-0.5 shrink-0" />
          <div>
            <span className="text-xs text-amber-500 font-medium uppercase tracking-wider">Erklärung</span>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
