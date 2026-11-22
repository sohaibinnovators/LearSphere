import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  barClassName,
  showLabel = false,
}: {
  value: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel ? (
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Progress</span>
          <span className="font-medium text-foreground">{clamped}%</span>
        </div>
      ) : null}
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
        <div
          className={cn(
            "h-full rounded-full bg-primary transition-all duration-500",
            barClassName,
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
