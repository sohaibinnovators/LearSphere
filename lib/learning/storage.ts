import { getAllLessons } from "@/lib/data/courses";
import { resolveCourseById } from "@/lib/instructor/storage";
import type { Course } from "@/lib/types";
import {
  emptyLearningStore,
  LEARNING_STORAGE_KEY,
  type LearningStore,
  type LocalEnrollment,
} from "@/lib/learning/types";

function todayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isEnrollment(value: unknown): value is LocalEnrollment {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.courseId === "string" &&
    typeof item.enrolledAt === "string" &&
    typeof item.lastAccessed === "string" &&
    (item.lastLessonId === null || typeof item.lastLessonId === "string") &&
    Array.isArray(item.completedLessonIds) &&
    item.completedLessonIds.every((id) => typeof id === "string") &&
    typeof item.progress === "number" &&
    (item.status === "in-progress" || item.status === "completed")
  );
}

function sanitizeStore(raw: unknown): LearningStore {
  if (!raw || typeof raw !== "object") return emptyLearningStore();
  const data = raw as Record<string, unknown>;
  if (data.version !== 1 || !Array.isArray(data.enrollments)) {
    return emptyLearningStore();
  }

  const enrollments = data.enrollments
    .filter(isEnrollment)
    .filter((item, index, list) =>
      list.findIndex((entry) => entry.courseId === item.courseId) === index,
    )
    .filter((item) => Boolean(resolveCourseById(item.courseId)))
    .map((item) => {
      const course = resolveCourseById(item.courseId)!;
      const lessonIds = new Set(getAllLessons(course).map((lesson) => lesson.id));
      const completedLessonIds = item.completedLessonIds.filter((id) =>
        lessonIds.has(id),
      );
      const lastLessonId =
        item.lastLessonId && lessonIds.has(item.lastLessonId)
          ? item.lastLessonId
          : null;
      const progress = calculateProgress(completedLessonIds.length, lessonIds.size);
      return {
        ...item,
        completedLessonIds,
        lastLessonId,
        progress,
        status: progress >= 100 ? ("completed" as const) : ("in-progress" as const),
      };
    });

  return { version: 1, enrollments };
}

export function calculateProgress(completedCount: number, totalLessons: number) {
  if (totalLessons <= 0) return 0;
  return Math.min(100, Math.round((completedCount / totalLessons) * 100));
}

export function readLearningStore(): LearningStore {
  if (typeof window === "undefined") return emptyLearningStore();
  try {
    const raw = window.localStorage.getItem(LEARNING_STORAGE_KEY);
    if (!raw) return emptyLearningStore();
    return sanitizeStore(JSON.parse(raw));
  } catch {
    return emptyLearningStore();
  }
}

export function writeLearningStore(store: LearningStore) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      LEARNING_STORAGE_KEY,
      JSON.stringify(sanitizeStore(store)),
    );
    window.dispatchEvent(new Event("learnsphere-learning-updated"));
  } catch {
    // Ignore quota / private mode failures in demo mode.
  }
}

export function getEnrollment(
  courseId: string,
  store: LearningStore = readLearningStore(),
) {
  return store.enrollments.find((item) => item.courseId === courseId) ?? null;
}

export function isEnrolled(
  courseId: string,
  store: LearningStore = readLearningStore(),
) {
  return Boolean(getEnrollment(courseId, store));
}

export function enrollInCourse(
  course: Course,
  store: LearningStore = readLearningStore(),
): { store: LearningStore; enrollment: LocalEnrollment; created: boolean } {
  const existing = getEnrollment(course.id, store);
  if (existing) {
    return { store, enrollment: existing, created: false };
  }

  const firstLesson = getAllLessons(course)[0] ?? null;
  const enrollment: LocalEnrollment = {
    courseId: course.id,
    enrolledAt: todayIso(),
    lastAccessed: todayIso(),
    lastLessonId: firstLesson?.id ?? null,
    completedLessonIds: [],
    progress: 0,
    status: "in-progress",
  };

  const next: LearningStore = {
    version: 1,
    enrollments: [enrollment, ...store.enrollments],
  };
  writeLearningStore(next);
  return { store: next, enrollment, created: true };
}

export function setLastViewedLesson(
  course: Course,
  lessonId: string,
  store: LearningStore = readLearningStore(),
): LearningStore {
  const enrollment = getEnrollment(course.id, store);
  if (!enrollment) return store;

  const lessonIds = new Set(getAllLessons(course).map((lesson) => lesson.id));
  if (!lessonIds.has(lessonId)) return store;

  const today = todayIso();
  if (
    enrollment.lastLessonId === lessonId &&
    enrollment.lastAccessed === today
  ) {
    return store;
  }

  const next: LearningStore = {
    version: 1,
    enrollments: store.enrollments.map((item) =>
      item.courseId === course.id
        ? {
            ...item,
            lastLessonId: lessonId,
            lastAccessed: today,
          }
        : item,
    ),
  };
  writeLearningStore(next);
  return next;
}

export function setLessonCompletion(
  course: Course,
  lessonId: string,
  completed: boolean,
  store: LearningStore = readLearningStore(),
): LearningStore {
  const enrollment = getEnrollment(course.id, store);
  if (!enrollment) return store;

  const lessons = getAllLessons(course);
  const lessonIds = new Set(lessons.map((lesson) => lesson.id));
  if (!lessonIds.has(lessonId)) return store;

  const completedSet = new Set(enrollment.completedLessonIds);
  if (completed) completedSet.add(lessonId);
  else completedSet.delete(lessonId);

  const completedLessonIds = lessons
    .map((lesson) => lesson.id)
    .filter((id) => completedSet.has(id));
  const progress = calculateProgress(completedLessonIds.length, lessons.length);

  const next: LearningStore = {
    version: 1,
    enrollments: store.enrollments.map((item) =>
      item.courseId === course.id
        ? {
            ...item,
            completedLessonIds,
            progress,
            status: progress >= 100 ? "completed" : "in-progress",
            lastLessonId: lessonId,
            lastAccessed: todayIso(),
          }
        : item,
    ),
  };
  writeLearningStore(next);
  return next;
}

export function getContinueLearningHref(course: Course, enrollment: LocalEnrollment) {
  const lessons = getAllLessons(course);
  const lessonId =
    (enrollment.lastLessonId &&
      lessons.some((lesson) => lesson.id === enrollment.lastLessonId) &&
      enrollment.lastLessonId) ||
    lessons.find((lesson) => !enrollment.completedLessonIds.includes(lesson.id))
      ?.id ||
    lessons[0]?.id;

  if (!lessonId) return `/courses/${course.slug}`;
  return `/learn/${course.slug}/${lessonId}`;
}

export function getEnrollmentsWithCourses(
  store: LearningStore = readLearningStore(),
) {
  return store.enrollments.flatMap((enrollment) => {
    const course = resolveCourseById(enrollment.courseId);
    return course ? [{ enrollment, course }] : [];
  });
}

export function removeEnrollmentsForCourse(courseId: string) {
  const store = readLearningStore();
  const next: LearningStore = {
    version: 1,
    enrollments: store.enrollments.filter((item) => item.courseId !== courseId),
  };
  writeLearningStore(next);
  return next;
}

export function computeLearningStats(
  store: LearningStore = readLearningStore(),
) {
  const items = getEnrollmentsWithCourses(store);
  const enrolledCount = items.length;
  const completedCount = items.filter(
    (item) => item.enrollment.status === "completed",
  ).length;
  const avgProgress =
    enrolledCount === 0
      ? 0
      : Math.round(
          items.reduce((sum, item) => sum + item.enrollment.progress, 0) /
            enrolledCount,
        );
  const lessonsCompleted = items.reduce(
    (sum, item) => sum + item.enrollment.completedLessonIds.length,
    0,
  );

  return {
    enrolledCount,
    completedCount,
    avgProgress,
    lessonsCompleted,
  };
}
