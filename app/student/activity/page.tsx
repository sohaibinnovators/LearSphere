"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useEngagementStore } from "@/hooks/useEngagementStore";
import { useCourseCatalog } from "@/hooks/useInstructorStore";
import { currentStudent } from "@/lib/data/student";
import type { ActivityType } from "@/lib/engagement/types";
import { cn } from "@/lib/utils";
import {
  Award,
  Bookmark,
  BookOpen,
  MessageSquare,
  Star,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { formatStudentDate, formatStudentDateTime } from "../utils";

const activityMeta: Record<
  ActivityType,
  { icon: LucideIcon; tone: "primary" | "secondary" | "success" | "muted" }
> = {
  lesson_complete: { icon: BookOpen, tone: "primary" },
  enrollment: { icon: UserPlus, tone: "muted" },
  course_complete: { icon: Award, tone: "success" },
  certificate: { icon: Award, tone: "success" },
  review: { icon: Star, tone: "secondary" },
  discussion: { icon: MessageSquare, tone: "muted" },
  bookmark: { icon: Bookmark, tone: "primary" },
};

export default function StudentActivityPage() {
  const { ready, store } = useEngagementStore();
  const { catalog } = useCourseCatalog();
  const sorted = [...store.activity].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <>
      <DashboardHeader
        title="Learning activity"
        subtitle="A local timeline of enrollments, lesson completions, and other demo events."
        user={{
          name: currentStudent.name,
          avatar: currentStudent.avatar,
          role: currentStudent.role,
        }}
        showNotifications
      />

      <div className="p-4 md:p-6">
        {!ready ? (
          <div className="h-40 animate-pulse rounded-xl border border-border bg-white" />
        ) : sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white p-10 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted" />
            <p className="mt-4 font-medium text-foreground">No activity yet</p>
            <p className="mt-1 text-sm text-muted">
              Enroll in a course or complete a lesson to start this timeline.
            </p>
            <Button href="/courses" className="mt-6" variant="outline">
              Browse courses
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)] md:p-6">
            <ol className="relative space-y-0">
              {sorted.map((item, index) => {
                const meta = activityMeta[item.type];
                const Icon = meta.icon;
                const course = item.courseId
                  ? catalog.find((entry) => entry.id === item.courseId)
                  : undefined;

                return (
                  <li
                    key={item.id}
                    className="relative flex gap-4 pb-8 last:pb-0"
                  >
                    {index < sorted.length - 1 ? (
                      <span
                        className="absolute left-5 top-10 h-[calc(100%-1.5rem)] w-px bg-border"
                        aria-hidden
                      />
                    ) : null}
                    <span
                      className={cn(
                        "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white",
                        meta.tone === "primary" && "text-primary",
                        meta.tone === "secondary" && "text-secondary-dark",
                        meta.tone === "success" && "text-success",
                        meta.tone === "muted" && "text-muted",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-foreground">
                          {item.title}
                        </p>
                        <Badge tone="muted" className="capitalize">
                          {item.type.replaceAll("_", " ")}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted">
                        {item.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                        <time dateTime={item.createdAt}>
                          {formatStudentDateTime(item.createdAt)}
                        </time>
                        <span>{formatStudentDate(item.date)}</span>
                        {course ? <span>{course.title}</span> : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </>
  );
}
