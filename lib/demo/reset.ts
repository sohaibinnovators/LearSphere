import { ENGAGEMENT_STORAGE_KEY } from "@/lib/engagement/types";
import { INSTRUCTOR_STORAGE_KEY } from "@/lib/instructor/types";
import { LEARNING_STORAGE_KEY } from "@/lib/learning/types";
import { STUDENT_PROFILE_STORAGE_KEY } from "@/lib/student/profile";

const DEMO_KEYS = [
  LEARNING_STORAGE_KEY,
  INSTRUCTOR_STORAGE_KEY,
  ENGAGEMENT_STORAGE_KEY,
  STUDENT_PROFILE_STORAGE_KEY,
] as const;

/** Clears all LearnSphere localStorage demo data in this browser. */
export function resetAllDemoData() {
  if (typeof window === "undefined") return;

  for (const key of DEMO_KEYS) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore private-mode / quota failures.
    }
  }

  window.dispatchEvent(new Event("learnsphere-learning-updated"));
  window.dispatchEvent(new Event("learnsphere-instructor-updated"));
  window.dispatchEvent(new Event("learnsphere-engagement-updated"));
  window.dispatchEvent(new Event("learnsphere-student-profile-updated"));
}

export function listDemoStorageKeys() {
  return [...DEMO_KEYS];
}
