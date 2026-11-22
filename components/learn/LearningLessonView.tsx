"use client";

import { CourseCurriculum } from "@/components/course/CourseCurriculum";
import {
  CourseDiscussionPanel,
  LessonBookmarkButton,
  LessonNotesPanel,
} from "@/components/learn/LessonStudyTools";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Toast } from "@/components/ui/Toast";
import { useLearningStore } from "@/hooks/useLearningStore";
import type { Course, Lesson } from "@/lib/types";
import { cn, formatDuration } from "@/lib/utils";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  List,
  Lock,
  Play,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "notes", label: "Notes" },
  { id: "discussion", label: "Discussion" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function isTabId(value: string | null): value is TabId {
  return value === "overview" || value === "notes" || value === "discussion";
}

export function LearningLessonView({
  course,
  lesson,
  lessons,
  prevLesson,
  nextLesson,
}: {
  course: Course;
  lesson: Lesson;
  lessons: Lesson[];
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
}) {
  const { ready, isEnrolled, getEnrollment, enroll, markLesson, viewLesson } =
    useLearningStore();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const urlTab: TabId = isTabId(initialTab) ? initialTab : "overview";
  const [manualTab, setManualTab] = useState<TabId | null>(null);
  const [tabSource, setTabSource] = useState(urlTab);
  const activeTab = manualTab ?? urlTab;
  const setActiveTab = (tab: TabId) => setManualTab(tab);

  if (urlTab !== tabSource) {
    setTabSource(urlTab);
    setManualTab(null);
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const enrolled = ready && isEnrolled(course.id);
  const enrollment = getEnrollment(course.id);
  const completedLessonIds = enrollment?.completedLessonIds ?? [];
  const progress = enrollment?.progress ?? 0;
  const lessonComplete = completedLessonIds.includes(lesson.id);
  const lessonIndex = lessons.findIndex((item) => item.id === lesson.id) + 1;

  useEffect(() => {
    if (!ready || !enrolled) return;
    viewLesson(course, lesson.id);
  }, [ready, enrolled, course, lesson.id, viewLesson]);

  const statusLabel = useMemo(() => {
    if (!ready) return "Loading progress…";
    if (!enrolled) return "Not enrolled";
    if (progress >= 100) return "Course completed";
    return `${progress}% complete`;
  }, [ready, enrolled, progress]);

  const handleToggleComplete = () => {
    if (!enrolled) return;
    const next = markLesson(course, lesson.id, !lessonComplete);
    const updated = next.enrollments.find((item) => item.courseId === course.id);
    setToastMessage(
      updated?.status === "completed"
        ? "Course completed — certificate available in your dashboard (local demo)."
        : lessonComplete
          ? "Lesson marked incomplete."
          : "Lesson marked complete.",
    );
    setToastOpen(true);
  };

  const handleEnrollToLearn = () => {
    enroll(course);
    viewLesson(course, lesson.id);
    setToastMessage(
      "Demo enrollment saved locally. You can now track lesson progress.",
    );
    setToastOpen(true);
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border bg-white px-4 py-3 md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Course details
          </Link>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <LessonHeaderTitle
            title={course.title}
            lessonTitle={lesson.title}
            lessonIndex={lessonIndex}
            total={lessons.length}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <List className="h-4 w-4" />
            Curriculum
          </button>
          <div className="hidden w-44 md:block">
            <ProgressBar value={progress} showLabel />
          </div>
        </div>
      </header>

      {!ready ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted">
          Loading learning progress…
        </div>
      ) : !enrolled ? (
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="max-w-md rounded-xl border border-border bg-white p-8 text-center shadow-[var(--shadow-sm)]">
            <Lock className="mx-auto h-8 w-8 text-muted" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              Enroll to track progress
            </h2>
            <p className="mt-2 text-sm text-muted">
              Preview the curriculum freely. Enroll with a local demo record to
              mark lessons complete and sync progress to My Learning.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={handleEnrollToLearn}>Enroll to continue</Button>
              <Button href={`/courses/${course.slug}`} variant="outline">
                Back to course
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted">
              Demo only — stored in localStorage, not a real student account.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-80 shrink-0 overflow-y-auto border-r border-border bg-white p-4 lg:block">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">
              Course curriculum
            </p>
            <p className="mb-3 text-sm text-muted">{statusLabel}</p>
            <CourseCurriculum
              sections={course.curriculum}
              courseSlug={course.slug}
              activeLessonId={lesson.id}
              completedLessonIds={completedLessonIds}
              defaultOpen
            />
          </aside>

          <main className="min-w-0 flex-1 overflow-y-auto">
            <div className="border-b border-border bg-foreground">
              <div className="relative mx-auto flex aspect-video max-w-5xl items-center justify-center bg-gradient-to-br from-primary/30 via-foreground to-primary-dark/40">
                <VideoPlaceholder lesson={lesson} />
              </div>
            </div>

            <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 md:px-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <LessonMeta lesson={lesson} active />
                <div className="flex flex-wrap gap-2">
                  <LessonBookmarkButton course={course} lesson={lesson} />
                  <Button
                    variant={lessonComplete ? "outline" : "primary"}
                    size="sm"
                    onClick={handleToggleComplete}
                  >
                    {lessonComplete ? (
                      <>
                        <Circle className="h-4 w-4" />
                        Mark incomplete
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Mark complete
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {progress >= 100 ? (
                <div className="rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
                  You completed every lesson in this course. A local demo
                  certificate is available in your student dashboard.
                </div>
              ) : null}

              <LessonNav
                courseSlug={course.slug}
                prevLesson={prevLesson}
                nextLesson={nextLesson}
                courseComplete={progress >= 100}
              />
              <nav className="flex gap-1 border-b border-border">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition",
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted hover:text-foreground",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
              <LessonTabPanel
                activeTab={activeTab}
                course={course}
                lesson={lesson}
              />
            </div>
          </main>
        </div>
      )}

      {sidebarOpen && enrolled ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/40"
            aria-label="Close curriculum"
            onClick={() => setSidebarOpen(false)}
          />
          <h2 className="sr-only">Curriculum</h2>
          <MobileCurriculumSidebar
            course={course}
            lessonId={lesson.id}
            completedLessonIds={completedLessonIds}
            progress={progress}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      ) : null}

      <Toast
        open={toastOpen}
        message={toastMessage}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
}

function LessonHeaderTitle({
  title,
  lessonTitle,
  lessonIndex,
  total,
}: {
  title: string;
  lessonTitle: string;
  lessonIndex: number;
  total: number;
}) {
  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-medium text-foreground">{title}</p>
      <p className="truncate text-xs text-muted">
        Lesson {lessonIndex} of {total} · {lessonTitle}
      </p>
    </div>
  );
}

function VideoPlaceholder({ lesson }: { lesson: Lesson }) {
  return (
    <div className="text-center text-white">
      <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur">
        <Play className="h-7 w-7 fill-white text-white" />
      </span>
      <p className="text-sm font-medium">Video placeholder</p>
      <p className="mt-1 text-xs text-white/70">
        {lesson.title} · {formatDuration(lesson.duration)}
      </p>
      <p className="mt-2 text-xs text-white/55">
        No external video source in this demo
      </p>
    </div>
  );
}

function LessonMeta({
  lesson,
  active = false,
}: {
  lesson: Lesson;
  active?: boolean;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {active ? <Badge tone="primary">Current lesson</Badge> : null}
        <Badge tone="muted">{lesson.type}</Badge>
        {lesson.isPreview ? <Badge tone="secondary">Preview</Badge> : null}
      </div>
      <h1 className="mt-2 text-xl font-semibold text-foreground">
        {lesson.title}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {formatDuration(lesson.duration)}
      </p>
    </div>
  );
}

function LessonNav({
  courseSlug,
  prevLesson,
  nextLesson,
  courseComplete,
}: {
  courseSlug: string;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
  courseComplete: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {prevLesson ? (
        <Button
          href={`/learn/${courseSlug}/${prevLesson.id}`}
          variant="outline"
          size="sm"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
      ) : (
        <span />
      )}
      {nextLesson ? (
        <Button href={`/learn/${courseSlug}/${nextLesson.id}`} size="sm">
          Next lesson
          <ChevronRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          href={courseComplete ? "/student/learning" : `/courses/${courseSlug}`}
          variant="secondary"
          size="sm"
        >
          {courseComplete ? "Back to My Learning" : "Course overview"}
        </Button>
      )}
    </div>
  );
}

function LessonTabPanel({
  activeTab,
  course,
  lesson,
}: {
  activeTab: TabId;
  course: Course;
  lesson: Lesson;
}) {
  if (activeTab === "overview") {
    return (
      <div className="space-y-6">
        <section className="rounded-xl border border-border bg-white p-5">
          <h2 className="text-sm font-semibold text-foreground">
            About this lesson
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Lesson content for{" "}
            <strong className="font-medium text-foreground">{lesson.title}</strong>{" "}
            in {course.title}. This portfolio demo uses the course curriculum
            data for titles, duration, and type. A hosted video player would
            appear above when a source is available.
          </p>
        </section>
        <section className="rounded-xl border border-border bg-white p-5">
          <h2 className="text-sm font-semibold text-foreground">Resources</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Lesson slides — placeholder (no download in demo)</li>
            <li>Starter files — placeholder (no external link)</li>
            <li>Cheat sheet — placeholder (no external link)</li>
          </ul>
        </section>
      </div>
    );
  }

  if (activeTab === "notes") {
    return <LessonNotesPanel course={course} lesson={lesson} />;
  }

  return <CourseDiscussionPanel course={course} mode="student" />;
}

function MobileCurriculumSidebar({
  course,
  lessonId,
  completedLessonIds,
  progress,
  onClose,
}: {
  course: Course;
  lessonId: string;
  completedLessonIds: string[];
  progress: number;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col bg-white shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">Curriculum</p>
        <button type="button" onClick={onClose} aria-label="Close">
          <X className="h-5 w-5 text-muted" />
        </button>
      </div>
      <div className="border-b border-border px-4 py-3">
        <ProgressBar value={progress} showLabel />
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <CourseCurriculum
          sections={course.curriculum}
          courseSlug={course.slug}
          activeLessonId={lessonId}
          completedLessonIds={completedLessonIds}
          defaultOpen
        />
      </div>
    </div>
  );
}
