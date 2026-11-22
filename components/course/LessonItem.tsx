import type { Lesson } from "@/lib/types";
import { cn, formatDuration } from "@/lib/utils";
import { CheckCircle2, Circle, FileText, HelpCircle, Play } from "lucide-react";
import Link from "next/link";

const typeIcon = {
  video: Play,
  article: FileText,
  quiz: HelpCircle,
};

export function LessonItem({
  lesson,
  href,
  active = false,
  completed = false,
  showDuration = true,
}: {
  lesson: Lesson;
  href?: string;
  active?: boolean;
  completed?: boolean;
  showDuration?: boolean;
}) {
  const Icon = typeIcon[lesson.type];
  const content = (
    <>
      <span className="mt-0.5 shrink-0">
        {completed ? (
          <CheckCircle2 className="h-4 w-4 text-success" />
        ) : (
          <Circle className={cn("h-4 w-4", active ? "text-primary" : "text-border")} />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 shrink-0 text-muted" />
          <span className="truncate text-sm font-medium">{lesson.title}</span>
        </span>
        {lesson.isPreview ? (
          <span className="mt-0.5 block text-xs text-secondary-dark">Preview</span>
        ) : null}
      </span>
      {showDuration ? (
        <span className="shrink-0 text-xs text-muted">
          {formatDuration(lesson.duration)}
        </span>
      ) : null}
    </>
  );

  const classes = cn(
    "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition",
    active
      ? "bg-primary/10 text-primary"
      : "text-foreground hover:bg-surface",
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
