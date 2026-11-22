import type { Course, Review } from "@/lib/types";
import { createCredentialId, createId } from "./ids";
import {
  DEMO_STUDENT_ID,
  emptyEngagementStore,
  ENGAGEMENT_STORAGE_KEY,
  type ActivityEvent,
  type ActivityType,
  type AppNotification,
  type DiscussionPost,
  type EngagementStore,
  type LessonBookmark,
  type LessonNote,
  type LocalCertificate,
  type LocalReview,
  type NotificationType,
} from "./types";

function nowIso() {
  return new Date().toISOString();
}

function todayDate() {
  return nowIso().slice(0, 10);
}

function isBrowser() {
  return typeof window !== "undefined";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asArray<T>(value: unknown, map: (item: unknown) => T | null): T[] {
  if (!Array.isArray(value)) return [];
  return value.map(map).filter((item): item is T => item !== null);
}

function asString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asBoolean(value: unknown) {
  return typeof value === "boolean" ? value : null;
}

function parseReview(item: unknown): LocalReview | null {
  if (!isRecord(item)) return null;
  const id = asString(item.id);
  const courseId = asString(item.courseId);
  const studentId = asString(item.studentId);
  const studentName = asString(item.studentName);
  const studentAvatar = asString(item.studentAvatar) ?? "";
  const rating = asNumber(item.rating);
  const comment = asString(item.comment);
  const createdAt = asString(item.createdAt);
  const updatedAt = asString(item.updatedAt);
  if (
    !id ||
    !courseId ||
    !studentId ||
    !studentName ||
    rating === null ||
    rating < 1 ||
    rating > 5 ||
    !comment ||
    !createdAt ||
    !updatedAt
  ) {
    return null;
  }
  return {
    id,
    courseId,
    studentId,
    studentName,
    studentAvatar,
    rating: Math.round(rating),
    comment,
    createdAt,
    updatedAt,
    isLocalDemo: true,
  };
}

function parseCertificate(item: unknown): LocalCertificate | null {
  if (!isRecord(item)) return null;
  const id = asString(item.id);
  const courseId = asString(item.courseId);
  const courseTitle = asString(item.courseTitle);
  const courseSlug = asString(item.courseSlug);
  const studentId = asString(item.studentId);
  const studentName = asString(item.studentName);
  const instructorName = asString(item.instructorName);
  const issuedAt = asString(item.issuedAt);
  const credentialId = asString(item.credentialId);
  if (
    !id ||
    !courseId ||
    !courseTitle ||
    !courseSlug ||
    !studentId ||
    !studentName ||
    !instructorName ||
    !issuedAt ||
    !credentialId
  ) {
    return null;
  }
  return {
    id,
    courseId,
    courseTitle,
    courseSlug,
    studentId,
    studentName,
    instructorName,
    issuedAt,
    credentialId,
  };
}

function parseBookmark(item: unknown): LessonBookmark | null {
  if (!isRecord(item)) return null;
  const id = asString(item.id);
  const courseId = asString(item.courseId);
  const courseSlug = asString(item.courseSlug);
  const courseTitle = asString(item.courseTitle);
  const lessonId = asString(item.lessonId);
  const lessonTitle = asString(item.lessonTitle);
  const createdAt = asString(item.createdAt);
  if (
    !id ||
    !courseId ||
    !courseSlug ||
    !courseTitle ||
    !lessonId ||
    !lessonTitle ||
    !createdAt
  ) {
    return null;
  }
  return {
    id,
    courseId,
    courseSlug,
    courseTitle,
    lessonId,
    lessonTitle,
    createdAt,
  };
}

function parseNote(item: unknown): LessonNote | null {
  if (!isRecord(item)) return null;
  const id = asString(item.id);
  const courseId = asString(item.courseId);
  const lessonId = asString(item.lessonId);
  const content = asString(item.content);
  const createdAt = asString(item.createdAt);
  const updatedAt = asString(item.updatedAt);
  if (!id || !courseId || !lessonId || content === null || !createdAt || !updatedAt) {
    return null;
  }
  return { id, courseId, lessonId, content, createdAt, updatedAt };
}

function parseDiscussion(item: unknown): DiscussionPost | null {
  if (!isRecord(item)) return null;
  const id = asString(item.id);
  const courseId = asString(item.courseId);
  const authorId = asString(item.authorId);
  const authorName = asString(item.authorName);
  const authorRole = asString(item.authorRole);
  const parentId =
    item.parentId === null ? null : asString(item.parentId);
  const body = asString(item.body);
  const createdAt = asString(item.createdAt);
  const updatedAt = asString(item.updatedAt);
  if (
    !id ||
    !courseId ||
    !authorId ||
    !authorName ||
    (authorRole !== "student" && authorRole !== "instructor") ||
    (parentId === undefined) ||
    !body ||
    !createdAt ||
    !updatedAt
  ) {
    return null;
  }
  return {
    id,
    courseId,
    authorId,
    authorName,
    authorRole,
    parentId,
    body,
    createdAt,
    updatedAt,
  };
}

function parseNotification(item: unknown): AppNotification | null {
  if (!isRecord(item)) return null;
  const id = asString(item.id);
  const type = asString(item.type) as NotificationType | null;
  const title = asString(item.title);
  const message = asString(item.message);
  const href = asString(item.href);
  const read = asBoolean(item.read);
  const createdAt = asString(item.createdAt);
  const dedupeKey = asString(item.dedupeKey);
  if (
    !id ||
    !type ||
    !title ||
    !message ||
    !href ||
    read === null ||
    !createdAt ||
    !dedupeKey
  ) {
    return null;
  }
  return { id, type, title, message, href, read, createdAt, dedupeKey };
}

function parseActivity(item: unknown): ActivityEvent | null {
  if (!isRecord(item)) return null;
  const id = asString(item.id);
  const type = asString(item.type) as ActivityType | null;
  const title = asString(item.title);
  const description = asString(item.description);
  const createdAt = asString(item.createdAt);
  const date = asString(item.date);
  if (!id || !type || !title || !description || !createdAt || !date) return null;
  return {
    id,
    type,
    title,
    description,
    courseId: asString(item.courseId) ?? undefined,
    lessonId: asString(item.lessonId) ?? undefined,
    createdAt,
    date,
  };
}

function sanitizeStore(raw: unknown): EngagementStore {
  if (!isRecord(raw) || raw.version !== 1) return emptyEngagementStore();

  const reviews = asArray(raw.reviews, parseReview);
  const uniqueReviews = new Map<string, LocalReview>();
  for (const review of reviews) {
    uniqueReviews.set(`${review.courseId}:${review.studentId}`, review);
  }

  const certificates = asArray(raw.certificates, parseCertificate);
  const uniqueCerts = new Map<string, LocalCertificate>();
  for (const cert of certificates) {
    uniqueCerts.set(`${cert.courseId}:${cert.studentId}`, cert);
  }

  const bookmarks = asArray(raw.bookmarks, parseBookmark);
  const uniqueBookmarks = new Map<string, LessonBookmark>();
  for (const bookmark of bookmarks) {
    uniqueBookmarks.set(`${bookmark.courseId}:${bookmark.lessonId}`, bookmark);
  }

  const notes = asArray(raw.notes, parseNote);
  const uniqueNotes = new Map<string, LessonNote>();
  for (const note of notes) {
    uniqueNotes.set(`${note.courseId}:${note.lessonId}`, note);
  }

  const notifications = asArray(raw.notifications, parseNotification);
  const seenDedupe = new Set<string>();
  const uniqueNotifications: AppNotification[] = [];
  for (const notification of notifications) {
    if (seenDedupe.has(notification.dedupeKey)) continue;
    seenDedupe.add(notification.dedupeKey);
    uniqueNotifications.push(notification);
  }

  const recentlyViewedCourses = asArray(raw.recentlyViewedCourses, (item) => {
    if (!isRecord(item)) return null;
    const courseId = asString(item.courseId);
    const viewedAt = asString(item.viewedAt);
    if (!courseId || !viewedAt) return null;
    return { courseId, viewedAt };
  });

  const recentlyViewedLessons = asArray(raw.recentlyViewedLessons, (item) => {
    if (!isRecord(item)) return null;
    const courseId = asString(item.courseId);
    const lessonId = asString(item.lessonId);
    const viewedAt = asString(item.viewedAt);
    if (!courseId || !lessonId || !viewedAt) return null;
    return { courseId, lessonId, viewedAt };
  });

  return {
    version: 1,
    reviews: [...uniqueReviews.values()],
    certificates: [...uniqueCerts.values()],
    bookmarks: [...uniqueBookmarks.values()],
    notes: [...uniqueNotes.values()],
    discussions: asArray(raw.discussions, parseDiscussion),
    notifications: uniqueNotifications,
    activity: asArray(raw.activity, parseActivity),
    recentlyViewedCourses,
    recentlyViewedLessons,
  };
}

export function readEngagementStore(): EngagementStore {
  if (!isBrowser()) return emptyEngagementStore();
  try {
    const raw = window.localStorage.getItem(ENGAGEMENT_STORAGE_KEY);
    if (!raw) return emptyEngagementStore();
    return sanitizeStore(JSON.parse(raw) as unknown);
  } catch {
    return emptyEngagementStore();
  }
}

export function writeEngagementStore(store: EngagementStore) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(ENGAGEMENT_STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event("learnsphere-engagement-updated"));
  } catch {
    // Ignore quota / private mode failures in the demo.
  }
}

function pushNotification(
  store: EngagementStore,
  input: {
    type: NotificationType;
    title: string;
    message: string;
    href: string;
    dedupeKey: string;
  },
): EngagementStore {
  if (store.notifications.some((item) => item.dedupeKey === input.dedupeKey)) {
    return store;
  }
  const notification: AppNotification = {
    id: createId("ntf"),
    type: input.type,
    title: input.title,
    message: input.message,
    href: input.href,
    read: false,
    createdAt: nowIso(),
    dedupeKey: input.dedupeKey,
  };
  return {
    ...store,
    notifications: [notification, ...store.notifications].slice(0, 80),
  };
}

function pushActivity(
  store: EngagementStore,
  input: {
    type: ActivityType;
    title: string;
    description: string;
    courseId?: string;
    lessonId?: string;
    dedupeKey?: string;
  },
): EngagementStore {
  if (input.dedupeKey) {
    const exists = store.activity.some(
      (item) =>
        item.type === input.type &&
        item.courseId === input.courseId &&
        item.lessonId === input.lessonId &&
        item.title === input.title,
    );
    if (exists && input.type === "enrollment") return store;
    if (
      exists &&
      (input.type === "course_complete" || input.type === "certificate")
    ) {
      return store;
    }
  }

  const event: ActivityEvent = {
    id: createId("act"),
    type: input.type,
    title: input.title,
    description: input.description,
    courseId: input.courseId,
    lessonId: input.lessonId,
    createdAt: nowIso(),
    date: todayDate(),
  };

  return {
    ...store,
    activity: [event, ...store.activity].slice(0, 100),
  };
}

export function getReviewsForCourse(
  courseId: string,
  store: EngagementStore = readEngagementStore(),
) {
  return store.reviews
    .filter((review) => review.courseId === courseId)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
}

export function getStudentReviewForCourse(
  courseId: string,
  studentId = DEMO_STUDENT_ID,
  store: EngagementStore = readEngagementStore(),
) {
  return (
    store.reviews.find(
      (review) =>
        review.courseId === courseId && review.studentId === studentId,
    ) ?? null
  );
}

export function getCourseRatingStats(
  course: Course,
  store: EngagementStore = readEngagementStore(),
) {
  const local = getReviewsForCourse(course.id, store);
  const seed: Review[] = course.reviews ?? [];
  const allRatings = [
    ...seed.map((review) => review.rating),
    ...local.map((review) => review.rating),
  ];
  const reviewCount = allRatings.length;
  const rating =
    reviewCount === 0
      ? course.rating
      : Math.round(
          (allRatings.reduce((sum, value) => sum + value, 0) / reviewCount) * 10,
        ) / 10;
  return { rating, reviewCount, localReviews: local, seedReviews: seed };
}

export function upsertReview(
  input: {
    courseId: string;
    studentId: string;
    studentName: string;
    studentAvatar: string;
    rating: number;
    comment: string;
  },
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  const rating = Math.min(5, Math.max(1, Math.round(input.rating)));
  const comment = input.comment.trim();
  if (!comment || comment.length < 10) return store;

  const existing = getStudentReviewForCourse(
    input.courseId,
    input.studentId,
    store,
  );
  const stamp = nowIso();
  const review: LocalReview = existing
    ? {
        ...existing,
        rating,
        comment,
        updatedAt: stamp,
        studentName: input.studentName,
        studentAvatar: input.studentAvatar,
        isLocalDemo: true,
      }
    : {
        id: createId("rev"),
        courseId: input.courseId,
        studentId: input.studentId,
        studentName: input.studentName,
        studentAvatar: input.studentAvatar,
        rating,
        comment,
        createdAt: stamp,
        updatedAt: stamp,
        isLocalDemo: true,
      };

  const reviews = existing
    ? store.reviews.map((item) => (item.id === existing.id ? review : item))
    : [review, ...store.reviews];

  let next: EngagementStore = { ...store, reviews };
  if (!existing) {
    next = pushActivity(next, {
      type: "review",
      title: "Course review submitted",
      description: `You left a ${rating}-star review (local demo).`,
      courseId: input.courseId,
      dedupeKey: `review:${input.courseId}:${input.studentId}`,
    });
  }
  writeEngagementStore(next);
  return next;
}

export function deleteReview(
  reviewId: string,
  studentId = DEMO_STUDENT_ID,
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  const review = store.reviews.find((item) => item.id === reviewId);
  if (!review || review.studentId !== studentId) return store;
  const next: EngagementStore = {
    ...store,
    reviews: store.reviews.filter((item) => item.id !== reviewId),
  };
  writeEngagementStore(next);
  return next;
}

export function getCertificateForCourse(
  courseId: string,
  studentId = DEMO_STUDENT_ID,
  store: EngagementStore = readEngagementStore(),
) {
  return (
    store.certificates.find(
      (item) => item.courseId === courseId && item.studentId === studentId,
    ) ?? null
  );
}

export function ensureCertificate(
  input: {
    course: Course;
    studentId: string;
    studentName: string;
    instructorName: string;
  },
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  const existing = getCertificateForCourse(
    input.course.id,
    input.studentId,
    store,
  );
  if (existing) return store;

  const certificate: LocalCertificate = {
    id: createId("cert"),
    courseId: input.course.id,
    courseTitle: input.course.title,
    courseSlug: input.course.slug,
    studentId: input.studentId,
    studentName: input.studentName,
    instructorName: input.instructorName,
    issuedAt: nowIso(),
    credentialId: createCredentialId(input.course.id),
  };

  let next: EngagementStore = {
    ...store,
    certificates: [certificate, ...store.certificates],
  };
  next = pushActivity(next, {
    type: "certificate",
    title: "Certificate available",
    description: `Demo certificate ready for ${input.course.title}.`,
    courseId: input.course.id,
    dedupeKey: `cert:${input.course.id}:${input.studentId}`,
  });
  next = pushNotification(next, {
    type: "certificate",
    title: "Certificate available",
    message: `Your local demo certificate for “${input.course.title}” is ready.`,
    href: `/student/certificates/${certificate.id}`,
    dedupeKey: `ntf:cert:${input.course.id}:${input.studentId}`,
  });
  writeEngagementStore(next);
  return next;
}

export function removeCertificatesForCourse(
  courseId: string,
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  const next: EngagementStore = {
    ...store,
    certificates: store.certificates.filter((item) => item.courseId !== courseId),
  };
  writeEngagementStore(next);
  return next;
}

/** Clears engagement records tied to a deleted or unavailable course. */
export function removeEngagementForCourse(
  courseId: string,
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  const next: EngagementStore = {
    ...store,
    reviews: store.reviews.filter((item) => item.courseId !== courseId),
    certificates: store.certificates.filter((item) => item.courseId !== courseId),
    bookmarks: store.bookmarks.filter((item) => item.courseId !== courseId),
    notes: store.notes.filter((item) => item.courseId !== courseId),
    discussions: store.discussions.filter((item) => item.courseId !== courseId),
    activity: store.activity.filter((item) => item.courseId !== courseId),
    recentlyViewedCourses: store.recentlyViewedCourses.filter(
      (item) => item.courseId !== courseId,
    ),
    recentlyViewedLessons: store.recentlyViewedLessons.filter(
      (item) => item.courseId !== courseId,
    ),
    notifications: store.notifications.filter(
      (item) => !item.dedupeKey.includes(courseId) && !item.href.includes(courseId),
    ),
  };
  writeEngagementStore(next);
  return next;
}

export function toggleBookmark(
  input: {
    courseId: string;
    courseSlug: string;
    courseTitle: string;
    lessonId: string;
    lessonTitle: string;
  },
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  const existing = store.bookmarks.find(
    (item) =>
      item.courseId === input.courseId && item.lessonId === input.lessonId,
  );
  let next: EngagementStore;
  if (existing) {
    next = {
      ...store,
      bookmarks: store.bookmarks.filter((item) => item.id !== existing.id),
    };
  } else {
    const bookmark: LessonBookmark = {
      id: createId("bm"),
      ...input,
      createdAt: nowIso(),
    };
    next = {
      ...store,
      bookmarks: [bookmark, ...store.bookmarks],
    };
    next = pushActivity(next, {
      type: "bookmark",
      title: "Lesson bookmarked",
      description: `Saved “${input.lessonTitle}” for later.`,
      courseId: input.courseId,
      lessonId: input.lessonId,
    });
  }
  writeEngagementStore(next);
  return next;
}

export function isLessonBookmarked(
  courseId: string,
  lessonId: string,
  store: EngagementStore = readEngagementStore(),
) {
  return store.bookmarks.some(
    (item) => item.courseId === courseId && item.lessonId === lessonId,
  );
}

export function getNoteForLesson(
  courseId: string,
  lessonId: string,
  store: EngagementStore = readEngagementStore(),
) {
  return (
    store.notes.find(
      (item) => item.courseId === courseId && item.lessonId === lessonId,
    ) ?? null
  );
}

export function upsertNote(
  input: { courseId: string; lessonId: string; content: string },
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  const content = input.content.trim();
  const existing = getNoteForLesson(input.courseId, input.lessonId, store);
  const stamp = nowIso();

  if (!content) {
    if (!existing) return store;
    const next: EngagementStore = {
      ...store,
      notes: store.notes.filter((item) => item.id !== existing.id),
    };
    writeEngagementStore(next);
    return next;
  }

  const note: LessonNote = existing
    ? { ...existing, content, updatedAt: stamp }
    : {
        id: createId("note"),
        courseId: input.courseId,
        lessonId: input.lessonId,
        content,
        createdAt: stamp,
        updatedAt: stamp,
      };

  const notes = existing
    ? store.notes.map((item) => (item.id === existing.id ? note : item))
    : [note, ...store.notes];
  const next: EngagementStore = { ...store, notes };
  writeEngagementStore(next);
  return next;
}

export function deleteNote(
  noteId: string,
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  const next: EngagementStore = {
    ...store,
    notes: store.notes.filter((item) => item.id !== noteId),
  };
  writeEngagementStore(next);
  return next;
}

export function getDiscussionsForCourse(
  courseId: string,
  store: EngagementStore = readEngagementStore(),
) {
  return store.discussions
    .filter((item) => item.courseId === courseId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
}

export function createDiscussionPost(
  input: {
    courseId: string;
    courseSlug: string;
    authorId: string;
    authorName: string;
    authorRole: "student" | "instructor";
    parentId?: string | null;
    body: string;
  },
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  const body = input.body.trim();
  if (body.length < 3) return store;

  if (input.parentId) {
    const parent = store.discussions.find((item) => item.id === input.parentId);
    if (!parent || parent.courseId !== input.courseId || parent.parentId) {
      return store;
    }
  }

  const stamp = nowIso();
  const post: DiscussionPost = {
    id: createId("disc"),
    courseId: input.courseId,
    authorId: input.authorId,
    authorName: input.authorName,
    authorRole: input.authorRole,
    parentId: input.parentId ?? null,
    body,
    createdAt: stamp,
    updatedAt: stamp,
  };

  let next: EngagementStore = {
    ...store,
    discussions: [...store.discussions, post],
  };

  if (input.authorRole === "student" && !input.parentId) {
    next = pushActivity(next, {
      type: "discussion",
      title: "Question posted",
      description: "You asked a question in the course discussion (local demo).",
      courseId: input.courseId,
    });
  }

  if (input.authorRole === "instructor" && input.parentId) {
    const parent = store.discussions.find((item) => item.id === input.parentId);
    if (parent && parent.authorRole === "student") {
      next = pushNotification(next, {
        type: "instructor_reply",
        title: "Instructor replied",
        message: `${input.authorName} replied to your question (local demo).`,
        href: `/learn/${input.courseSlug}?tab=discussion`,
        dedupeKey: `ntf:reply:${post.id}`,
      });
    }
  }

  writeEngagementStore(next);
  return next;
}

export function updateDiscussionPost(
  postId: string,
  authorId: string,
  body: string,
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  const trimmed = body.trim();
  if (trimmed.length < 3) return store;
  const post = store.discussions.find((item) => item.id === postId);
  if (!post || post.authorId !== authorId) return store;
  const next: EngagementStore = {
    ...store,
    discussions: store.discussions.map((item) =>
      item.id === postId
        ? { ...item, body: trimmed, updatedAt: nowIso() }
        : item,
    ),
  };
  writeEngagementStore(next);
  return next;
}

export function deleteDiscussionPost(
  postId: string,
  authorId: string,
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  const post = store.discussions.find((item) => item.id === postId);
  if (!post || post.authorId !== authorId) return store;
  const next: EngagementStore = {
    ...store,
    discussions: store.discussions.filter(
      (item) => item.id !== postId && item.parentId !== postId,
    ),
  };
  writeEngagementStore(next);
  return next;
}

export function markNotificationRead(
  notificationId: string,
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  const next: EngagementStore = {
    ...store,
    notifications: store.notifications.map((item) =>
      item.id === notificationId ? { ...item, read: true } : item,
    ),
  };
  writeEngagementStore(next);
  return next;
}

export function markAllNotificationsRead(
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  const next: EngagementStore = {
    ...store,
    notifications: store.notifications.map((item) => ({ ...item, read: true })),
  };
  writeEngagementStore(next);
  return next;
}

export function deleteNotification(
  notificationId: string,
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  const next: EngagementStore = {
    ...store,
    notifications: store.notifications.filter(
      (item) => item.id !== notificationId,
    ),
  };
  writeEngagementStore(next);
  return next;
}

export function trackCourseView(
  courseId: string,
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  // Avoid rewrite loops when the same course is already the latest view.
  if (store.recentlyViewedCourses[0]?.courseId === courseId) {
    return store;
  }
  const viewedAt = nowIso();
  const filtered = store.recentlyViewedCourses.filter(
    (item) => item.courseId !== courseId,
  );
  const next: EngagementStore = {
    ...store,
    recentlyViewedCourses: [{ courseId, viewedAt }, ...filtered].slice(0, 8),
  };
  writeEngagementStore(next);
  return next;
}

export function trackLessonView(
  courseId: string,
  lessonId: string,
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  const latest = store.recentlyViewedLessons[0];
  if (latest?.courseId === courseId && latest.lessonId === lessonId) {
    return store;
  }
  const viewedAt = nowIso();
  const filtered = store.recentlyViewedLessons.filter(
    (item) => !(item.courseId === courseId && item.lessonId === lessonId),
  );
  const next: EngagementStore = {
    ...store,
    recentlyViewedLessons: [
      { courseId, lessonId, viewedAt },
      ...filtered,
    ].slice(0, 12),
  };
  writeEngagementStore(next);
  return next;
}

export function recordEnrollmentEvent(
  course: Course,
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  let next = pushActivity(store, {
    type: "enrollment",
    title: "Enrolled in course",
    description: `You enrolled in “${course.title}” (local demo).`,
    courseId: course.id,
    dedupeKey: `enroll:${course.id}`,
  });
  next = pushNotification(next, {
    type: "enrollment",
    title: "Enrollment successful",
    message: `You are enrolled in “${course.title}”. Continue learning anytime.`,
    href: `/learn/${course.slug}`,
    dedupeKey: `ntf:enroll:${course.id}:${DEMO_STUDENT_ID}`,
  });
  writeEngagementStore(next);
  return next;
}

export function recordLessonCompleteEvent(
  course: Course,
  lessonId: string,
  lessonTitle: string,
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  const next = pushActivity(store, {
    type: "lesson_complete",
    title: "Lesson completed",
    description: `Completed “${lessonTitle}” in ${course.title}.`,
    courseId: course.id,
    lessonId,
  });
  writeEngagementStore(next);
  return next;
}

export function recordCourseCompleteEvent(
  course: Course,
  studentName: string,
  instructorName: string,
  studentId = DEMO_STUDENT_ID,
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  let next = pushActivity(store, {
    type: "course_complete",
    title: "Course completed",
    description: `You finished “${course.title}”.`,
    courseId: course.id,
    dedupeKey: `complete:${course.id}`,
  });
  next = pushNotification(next, {
    type: "course_complete",
    title: "Course completed",
    message: `Congratulations — “${course.title}” is complete in this demo.`,
    href: `/student/certificates`,
    dedupeKey: `ntf:complete:${course.id}:${studentId}`,
  });
  writeEngagementStore(next);
  return ensureCertificate(
    {
      course,
      studentId,
      studentName,
      instructorName,
    },
    next,
  );
}

export function recordCoursePublishedEvent(
  course: Course,
  store: EngagementStore = readEngagementStore(),
): EngagementStore {
  const next = pushNotification(store, {
    type: "course_published",
    title: "Course published",
    message: `“${course.title}” is now published in the catalog (local demo).`,
    href: `/courses/${course.slug}`,
    dedupeKey: `ntf:publish:${course.id}:${course.lastUpdated || course.publishedAt}`,
  });
  writeEngagementStore(next);
  return next;
}

export function unreadNotificationCount(
  store: EngagementStore = readEngagementStore(),
) {
  return store.notifications.filter((item) => !item.read).length;
}
