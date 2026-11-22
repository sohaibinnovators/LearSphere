import { cn } from "@/lib/utils";
import Link from "next/link";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label="LearnSphere home"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
        <span className="text-sm font-bold tracking-tight">LS</span>
      </span>
      {!compact ? (
        <span className="leading-none">
          <span className="block font-display text-lg font-semibold tracking-tight text-foreground">
            LearnSphere
          </span>
          <span className="mt-0.5 block text-[11px] text-muted">
            Learn Today. Lead Tomorrow.
          </span>
        </span>
      ) : null}
    </Link>
  );
}
