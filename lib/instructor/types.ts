import type { Course } from "@/lib/types";

export interface InstructorProfileData {
  name: string;
  email: string;
  title: string;
  bio: string;
  location: string;
  avatar: string;
  specialties: string[];
  website: string;
  linkedin: string;
  twitter: string;
}

export interface InstructorSettingsData {
  emailNotifications: boolean;
  marketingEmails: boolean;
  showProfilePublicly: boolean;
  defaultCourseVisibility: "draft" | "published";
}

export interface InstructorStore {
  version: 1;
  profile: InstructorProfileData;
  settings: InstructorSettingsData;
  customCourses: Course[];
  overrides: Record<string, Course>;
  deletedCourseIds: string[];
}

export const INSTRUCTOR_STORAGE_KEY = "learnsphere.instructor.v1";
export const DEMO_INSTRUCTOR_ID = "ins-1";
