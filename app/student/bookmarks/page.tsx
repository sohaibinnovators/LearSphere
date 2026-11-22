"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { useEngagementStore } from "@/hooks/useEngagementStore";
import { currentStudent } from "@/lib/data/student";
import { Bookmark, ExternalLink } from "lucide-react";
import { formatStudentDateTime } from "../utils";

export default function StudentBookmarksPage() {
  const { ready, store, toggleLessonBookmark } = useEngagementStore();
  const bookmarks = [...store.bookmarks].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <>
      <DashboardHeader
        title="Bookmarked lessons"
        subtitle="Jump back to lessons you saved in this browser."
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
        ) : bookmarks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white p-10 text-center">
            <Bookmark className="mx-auto h-10 w-10 text-muted" />
            <p className="mt-4 font-medium text-foreground">No bookmarks yet</p>
            <p className="mt-1 text-sm text-muted">
              Open a lesson and use Bookmark to save it here.
            </p>
            <Button href="/student/learning" className="mt-6" variant="outline">
              Go to My Learning
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {bookmarks.map((bookmark) => (
              <li
                key={bookmark.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-white p-4 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">
                    {bookmark.lessonTitle}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {bookmark.courseTitle}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Saved {formatStudentDateTime(bookmark.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    href={`/learn/${bookmark.courseSlug}/${bookmark.lessonId}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open lesson
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    type="button"
                    onClick={() =>
                      toggleLessonBookmark({
                        courseId: bookmark.courseId,
                        courseSlug: bookmark.courseSlug,
                        courseTitle: bookmark.courseTitle,
                        lessonId: bookmark.lessonId,
                        lessonTitle: bookmark.lessonTitle,
                      })
                    }
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
