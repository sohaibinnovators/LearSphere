export type LocalEnrollmentStatus = "in-progress" | "completed";

export interface LocalEnrollment {
  courseId: string;
  enrolledAt: string;
  lastAccessed: string;
  lastLessonId: string | null;
  completedLessonIds: string[];
  progress: number;
  status: LocalEnrollmentStatus;
}

export interface LearningStore {
  version: 1;
  enrollments: LocalEnrollment[];
}

export const LEARNING_STORAGE_KEY = "learnsphere.learning.v1";

export const emptyLearningStore = (): LearningStore => ({
  version: 1,
  enrollments: [],
});
