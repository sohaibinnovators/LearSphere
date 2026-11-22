import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const tones = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary-dark",
  muted: "bg-surface text-muted",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

export function Badge({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
