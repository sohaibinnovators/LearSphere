import { currentStudent } from "@/lib/data/student";

export const STUDENT_PROFILE_STORAGE_KEY = "learnsphere.student-profile.v1";

export interface StudentProfileData {
  name: string;
  email: string;
  headline: string;
  bio: string;
  location: string;
}

export function defaultStudentProfile(): StudentProfileData {
  return {
    name: currentStudent.name,
    email: currentStudent.email,
    headline: currentStudent.headline,
    bio: currentStudent.bio,
    location: currentStudent.location,
  };
}

function isProfile(value: unknown): value is StudentProfileData {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return (
    typeof data.name === "string" &&
    typeof data.email === "string" &&
    typeof data.headline === "string" &&
    typeof data.bio === "string" &&
    typeof data.location === "string"
  );
}

export function readStudentProfile(): StudentProfileData {
  if (typeof window === "undefined") return defaultStudentProfile();
  try {
    const raw = window.localStorage.getItem(STUDENT_PROFILE_STORAGE_KEY);
    if (!raw) return defaultStudentProfile();
    const parsed = JSON.parse(raw) as unknown;
    if (!isProfile(parsed)) return defaultStudentProfile();
    return {
      name: parsed.name.trim() || defaultStudentProfile().name,
      email: parsed.email.trim() || defaultStudentProfile().email,
      headline: parsed.headline.trim() || defaultStudentProfile().headline,
      bio: parsed.bio,
      location: parsed.location,
    };
  } catch {
    return defaultStudentProfile();
  }
}

export function writeStudentProfile(profile: StudentProfileData) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STUDENT_PROFILE_STORAGE_KEY,
      JSON.stringify(profile),
    );
    window.dispatchEvent(new Event("learnsphere-student-profile-updated"));
  } catch {
    // Ignore quota / private mode failures.
  }
}

export function clearStudentProfile() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STUDENT_PROFILE_STORAGE_KEY);
  } catch {
    // Ignore.
  }
}
