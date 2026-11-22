"use client";

import { useClientReady } from "@/hooks/useClientReady";
import {
  createDiscussionPost,
  deleteDiscussionPost,
  deleteNote,
  deleteNotification,
  deleteReview,
  ensureCertificate,
  getCertificateForCourse,
  getCourseRatingStats,
  getDiscussionsForCourse,
  getNoteForLesson,
  getReviewsForCourse,
  getStudentReviewForCourse,
  isLessonBookmarked,
  markAllNotificationsRead,
  markNotificationRead,
  readEngagementStore,
  recordCourseCompleteEvent,
  recordCoursePublishedEvent,
  recordEnrollmentEvent,
  recordLessonCompleteEvent,
  toggleBookmark,
  trackCourseView,
  trackLessonView,
  unreadNotificationCount,
  updateDiscussionPost,
  upsertNote,
  upsertReview,
} from "@/lib/engagement/storage";
import {
  emptyEngagementStore,
  ENGAGEMENT_STORAGE_KEY,
  type EngagementStore,
} from "@/lib/engagement/types";
import type { Course } from "@/lib/types";
import { useCallback, useEffect, useSyncExternalStore } from "react";

const SERVER_SNAPSHOT: EngagementStore = emptyEngagementStore();
let memoryStore: EngagementStore = SERVER_SNAPSHOT;
let didHydrate = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setStore(next: EngagementStore) {
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

export function useEngagementStore() {
  const ready = useClientReady();
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!didHydrate) {
      memoryStore = readEngagementStore();
      didHydrate = true;
      emit();
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === ENGAGEMENT_STORAGE_KEY) {
        setStore(readEngagementStore());
      }
    };
    const onCustom = () => setStore(readEngagementStore());

    window.addEventListener("storage", onStorage);
    window.addEventListener("learnsphere-engagement-updated", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("learnsphere-engagement-updated", onCustom);
    };
  }, []);

  const apply = useCallback((next: EngagementStore) => {
    setStore(next);
  }, []);

  const viewCourse = useCallback((courseId: string) => {
    const next = trackCourseView(courseId, memoryStore);
    if (next !== memoryStore) apply(next);
  }, [apply]);

  const viewLesson = useCallback((courseId: string, lessonId: string) => {
    const next = trackLessonView(courseId, lessonId, memoryStore);
    if (next !== memoryStore) apply(next);
  }, [apply]);

  return {
    ready,
    store,
    unreadCount: unreadNotificationCount(store),
    getReviewsForCourse: (courseId: string) =>
      getReviewsForCourse(courseId, store),
    getStudentReview: (courseId: string) =>
      getStudentReviewForCourse(courseId, undefined, store),
    getRatingStats: (course: Course) => getCourseRatingStats(course, store),
    getCertificate: (courseId: string) =>
      getCertificateForCourse(courseId, undefined, store),
    isBookmarked: (courseId: string, lessonId: string) =>
      isLessonBookmarked(courseId, lessonId, store),
    getNote: (courseId: string, lessonId: string) =>
      getNoteForLesson(courseId, lessonId, store),
    getDiscussions: (courseId: string) =>
      getDiscussionsForCourse(courseId, store),
    submitReview: (input: Parameters<typeof upsertReview>[0]) => {
      apply(upsertReview(input, store));
    },
    removeReview: (reviewId: string) => {
      apply(deleteReview(reviewId, undefined, store));
    },
    toggleLessonBookmark: (input: Parameters<typeof toggleBookmark>[0]) => {
      apply(toggleBookmark(input, store));
    },
    saveNote: (input: Parameters<typeof upsertNote>[0]) => {
      apply(upsertNote(input, store));
    },
    removeNote: (noteId: string) => {
      apply(deleteNote(noteId, store));
    },
    postDiscussion: (input: Parameters<typeof createDiscussionPost>[0]) => {
      apply(createDiscussionPost(input, store));
    },
    editDiscussion: (postId: string, authorId: string, body: string) => {
      apply(updateDiscussionPost(postId, authorId, body, store));
    },
    removeDiscussion: (postId: string, authorId: string) => {
      apply(deleteDiscussionPost(postId, authorId, store));
    },
    markRead: (notificationId: string) => {
      apply(markNotificationRead(notificationId, store));
    },
    markAllRead: () => {
      apply(markAllNotificationsRead(store));
    },
    removeNotification: (notificationId: string) => {
      apply(deleteNotification(notificationId, store));
    },
    viewCourse,
    viewLesson,
    onEnrolled: (course: Course) => {
      apply(recordEnrollmentEvent(course, store));
    },
    onLessonCompleted: (course: Course, lessonId: string, lessonTitle: string) => {
      apply(recordLessonCompleteEvent(course, lessonId, lessonTitle, store));
    },
    onCourseCompleted: (
      course: Course,
      studentName: string,
      instructorName: string,
    ) => {
      apply(
        recordCourseCompleteEvent(
          course,
          studentName,
          instructorName,
          undefined,
          store,
        ),
      );
    },
    onCoursePublished: (course: Course) => {
      apply(recordCoursePublishedEvent(course, store));
    },
    ensureCourseCertificate: (
      course: Course,
      studentName: string,
      instructorName: string,
    ) => {
      apply(
        ensureCertificate(
          {
            course,
            studentId: "stu-1",
            studentName,
            instructorName,
          },
          store,
        ),
      );
    },
  };
}
