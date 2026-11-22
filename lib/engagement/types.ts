export const ENGAGEMENT_STORAGE_KEY = "learnsphere.engagement.v1";
export const DEMO_STUDENT_ID = "stu-1";

export type NotificationType =
  | "enrollment"
  | "course_complete"
  | "certificate"
  | "instructor_reply"
  | "course_published"
  | "review";

export type ActivityType =
  | "enrollment"
  | "lesson_complete"
  | "course_complete"
  | "certificate"
  | "review"
  | "discussion"
  | "bookmark";

export interface LocalReview {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  isLocalDemo: true;
}

export interface LocalCertificate {
  id: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  studentId: string;
  studentName: string;
  instructorName: string;
  issuedAt: string;
  credentialId: string;
}

export interface LessonBookmark {
  id: string;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  createdAt: string;
}

export interface LessonNote {
  id: string;
  courseId: string;
  lessonId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionPost {
  id: string;
  courseId: string;
  authorId: string;
  authorName: string;
  authorRole: "student" | "instructor";
  parentId: string | null;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  href: string;
  read: boolean;
  createdAt: string;
  dedupeKey: string;
}

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  courseId?: string;
  lessonId?: string;
  createdAt: string;
  date: string;
}

export interface RecentCourseView {
  courseId: string;
  viewedAt: string;
}

export interface RecentLessonView {
  courseId: string;
  lessonId: string;
  viewedAt: string;
}

export interface EngagementStore {
  version: 1;
  reviews: LocalReview[];
  certificates: LocalCertificate[];
  bookmarks: LessonBookmark[];
  notes: LessonNote[];
  discussions: DiscussionPost[];
  notifications: AppNotification[];
  activity: ActivityEvent[];
  recentlyViewedCourses: RecentCourseView[];
  recentlyViewedLessons: RecentLessonView[];
}

export function emptyEngagementStore(): EngagementStore {
  return {
    version: 1,
    reviews: [],
    certificates: [],
    bookmarks: [],
    notes: [],
    discussions: [],
    notifications: [],
    activity: [],
    recentlyViewedCourses: [],
    recentlyViewedLessons: [],
  };
}
