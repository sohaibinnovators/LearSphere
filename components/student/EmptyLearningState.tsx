import { Button } from "@/components/ui/Button";
import { BookOpen } from "lucide-react";

export function EmptyLearningState({
  title = "No enrolled courses yet",
  description = "Browse the catalog and enroll to start tracking progress in this browser.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-white px-6 py-16 text-center">
      <BookOpen className="mx-auto h-8 w-8 text-muted" />
      <h2 className="mt-4 text-lg font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>
      <Button href="/courses" className="mt-6">
        Explore courses
      </Button>
      <p className="mt-4 text-xs text-muted">
        Enrollment and progress are stored locally for this portfolio demo.
      </p>
    </div>
  );
}
