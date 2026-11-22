"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Info, X } from "lucide-react";
import { useEffect } from "react";

export function Toast({
  open,
  message,
  tone = "success",
  onClose,
}: {
  open: boolean;
  message: string;
  tone?: "success" | "info";
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(onClose, 3200);
    return () => window.clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] w-[min(90vw,22rem)] animate-fade-up">
      <div
        className={cn(
          "flex items-start gap-3 rounded-xl border bg-white p-4 shadow-[var(--shadow-md)]",
          tone === "success" ? "border-success/20" : "border-primary/20",
        )}
      >
        {tone === "success" ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
        ) : (
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        )}
        <p className="flex-1 text-sm text-foreground">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-muted hover:bg-surface"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
