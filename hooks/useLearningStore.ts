"use client";

import { useClientReady } from "@/hooks/useClientReady";
import { getAllLessons } from "@/lib/data/courses";
import { getInstructorById } from "@/lib/data/instructors";
import { currentStudent } from "@/lib/data/student";
import {
  recordCourseCompleteEvent,
  recordEnrollmentEvent,
  recordLessonCompleteEvent,
  removeCertificatesForCourse,
  trackCourseView,
  trackLessonView,
} from "@/lib/engagement/storage";
import {
  emptyLearningStore,
  LEARNING_STORAGE_KEY,
  type LearningStore,
  type LocalEnrollment,
} from "@/lib/learning/types";
import {
  computeLearningStats,
  enrollInCourse,
  getContinueLearningHref,
  getEnrollment,
  getEnrollmentsWithCourses,
  isEnrolled,
  readLearningStore,
  setLastViewedLesson,
  setLessonCompletion,
} from "@/lib/learning/storage";
import type { Course } from "@/lib/types";
import { useCallback, useEffect, useSyncExternalStore } from "react";

const SERVER_SNAPSHOT: LearningStore = emptyLearningStore();
let memoryStore: LearningStore = SERVER_SNAPSHOT;
let didHydrate = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setStore(next: LearningStore) {
  memoryStore = next;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return memoryStore;
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function useLearningStore() {
  const ready = useClientReady();
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!didHydrate) {
      memoryStore = readLearningStore();
      didHydrate = true;
      emit();
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === LEARNING_STORAGE_KEY) {
        setStore(readLearningStore());
      }
    };
    const onCustom = () => setStore(readLearningStore());

    window.addEventListener("storage", onStorage);
    window.addEventListener("learnsphere-learning-updated", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("learnsphere-learning-updated", onCustom);
    };
  }, []);

  const enroll = useCallback((course: Course) => {
    const result = enrollInCourse(course);
    setStore(result.store);
    if (result.created) {
      recordEnrollmentEvent(course);
      trackCourseView(course.id);
    }
    return result;
  }, []);

  const markLesson = useCallback(
    (course: Course, lessonId: string, completed: boolean) => {
      const previous = getEnrollment(course.id, memoryStore);
      const wasCompleted = previous?.status === "completed";
      const next = setLessonCompletion(course, lessonId, completed);
      setStore(next);

      const enrollment = getEnrollment(course.id, next);
      const lesson = getAllLessons(course).find((item) => item.id === lessonId);

      if (completed && lesson) {
        recordLessonCompleteEvent(course, lessonId, lesson.title);
      }

      if (!wasCompleted && enrollment?.status === "completed") {
        const instructor = getInstructorById(course.instructorId);
        recordCourseCompleteEvent(
          course,
          currentStudent.name,
          instructor?.name ?? "Instructor",
        );
      }

      if (wasCompleted && enrollment?.status !== "completed") {
        removeCertificatesForCourse(course.id);
      }

      return next;
    },
    [],
  );

  const viewLesson = useCallback((course: Course, lessonId: string) => {
    const next = setLastViewedLesson(course, lessonId);
    if (next !== memoryStore) setStore(next);
    const engagement = trackLessonView(course.id, lessonId);
    trackCourseView(course.id, engagement);
    return next;
  }, []);

  return {
    ready,
    store,
    enrollments: getEnrollmentsWithCourses(store),
    stats: computeLearningStats(store),
    isEnrolled: (courseId: string) => isEnrolled(courseId, store),
    getEnrollment: (courseId: string) => getEnrollment(courseId, store),
    enroll,
    markLesson,
    viewLesson,
    getContinueHref: (course: Course, enrollment: LocalEnrollment) =>
      getContinueLearningHref(course, enrollment),
    refresh: () => setStore(readLearningStore()),
  };
}
