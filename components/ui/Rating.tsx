import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export function Rating({
  value,
  count,
  size = "sm",
  showValue = true,
  className,
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
}) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = index + 1 <= Math.round(value);
          return (
            <Star
              key={index}
              className={cn(
                iconSize,
                filled ? "fill-warning text-warning" : "text-border",
              )}
            />
          );
        })}
      </div>
      {showValue ? (
        <span className="text-sm font-medium text-foreground">
          {value.toFixed(1)}
        </span>
      ) : null}
      {typeof count === "number" ? (
        <span className="text-sm text-muted">({count.toLocaleString()})</span>
      ) : null}
    </div>
  );
}
