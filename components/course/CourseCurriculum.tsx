"use client";

import { LessonItem } from "@/components/course/LessonItem";
import type { CurriculumSection } from "@/lib/types";
import { cn, formatDuration } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function CourseCurriculum({
  sections,
  courseSlug,
  activeLessonId,
  completedLessonIds = [],
  defaultOpen = true,
}: {
  sections: CurriculumSection[];
  courseSlug?: string;
  activeLessonId?: string;
  completedLessonIds?: string[];
  defaultOpen?: boolean;
}) {
  const [openIds, setOpenIds] = useState<string[]>(
    defaultOpen ? sections.map((section) => section.id) : [sections[0]?.id].filter(Boolean),
  );

  const toggle = (id: string) => {
    setOpenIds((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  };

  return (
    <div className="space-y-3">
      {sections.map((section) => {
        const open = openIds.includes(section.id);
        const sectionDuration = section.lessons.reduce(
          (sum, lesson) => sum + lesson.duration,
          0,
        );

        return (
          <div
            key={section.id}
            className="overflow-hidden rounded-xl border border-border bg-white"
          >
            <button
              type="button"
              onClick={() => toggle(section.id)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-surface/70"
              aria-expanded={open}
            >
              <div>
                <p className="font-medium text-foreground">{section.title}</p>
                <p className="text-xs text-muted">
                  {section.lessons.length} lessons · {formatDuration(sectionDuration)}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted transition",
                  open && "rotate-180",
                )}
              />
            </button>
            {open ? (
              <div className="space-y-1 border-t border-border px-2 py-2">
                {section.lessons.map((lesson) => (
                  <LessonItem
                    key={lesson.id}
                    lesson={lesson}
                    href={
                      courseSlug
                        ? `/learn/${courseSlug}/${lesson.id}`
                        : undefined
                    }
                    active={activeLessonId === lesson.id}
                    completed={completedLessonIds.includes(lesson.id)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
