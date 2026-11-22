import type {
  ActivityItem,
  Certificate,
  StudentEnrollment,
} from "@/lib/types";

export const currentStudent = {
  id: "stu-1",
  name: "Alex Rivera",
  email: "alex.rivera@example.com",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
  role: "Student",
  joinedAt: "2026-01-14",
  headline: "Aspiring full-stack engineer",
  bio: "Learning modern web development and data fundamentals to transition into product engineering.",
  location: "Austin, TX",
  timezone: "CST",
};

export const enrollments: StudentEnrollment[] = [
  {
    courseId: "crs-1",
    progress: 62,
    lastAccessed: "2026-11-20",
    completedLessons: [
      "crs-1-s1-l1",
      "crs-1-s1-l2",
      "crs-1-s1-l3",
      "crs-1-s2-l1",
      "crs-1-s2-l2",
    ],
    status: "in-progress",
  },
  {
    courseId: "crs-2",
    progress: 34,
    lastAccessed: "2026-11-18",
    completedLessons: ["crs-2-s1-l1", "crs-2-s1-l2"],
    status: "in-progress",
  },
  {
    courseId: "crs-9",
    progress: 100,
    lastAccessed: "2026-10-30",
    completedLessons: [
      "crs-9-s1-l1",
      "crs-9-s1-l2",
      "crs-9-s1-l3",
      "crs-9-s2-l1",
      "crs-9-s2-l2",
      "crs-9-s2-l3",
    ],
    status: "completed",
  },
  {
    courseId: "crs-7",
    progress: 18,
    lastAccessed: "2026-11-10",
    completedLessons: ["crs-7-s1-l1"],
    status: "in-progress",
  },
];

export const wishlistCourseIds = ["crs-3", "crs-8", "crs-11"];

export const certificates: Certificate[] = [
  {
    id: "cert-1",
    courseId: "crs-9",
    issuedAt: "2026-10-30",
    credentialId: "LS-SQL-9F2A",
  },
];

export const activities: ActivityItem[] = [
  {
    id: "act-1",
    type: "lesson",
    title: "Completed lesson",
    description: "Building Interfaces — Layouts and nested routes",
    date: "2026-11-20",
    courseId: "crs-1",
  },
  {
    id: "act-2",
    type: "quiz",
    title: "Quiz scored 90%",
    description: "Python Essentials checkpoint",
    date: "2026-11-18",
    courseId: "crs-2",
  },
  {
    id: "act-3",
    type: "certificate",
    title: "Certificate earned",
    description: "SQL Analytics Bootcamp",
    date: "2026-10-30",
    courseId: "crs-9",
  },
  {
    id: "act-4",
    type: "enrollment",
    title: "Enrolled in course",
    description: "Leadership Essentials",
    date: "2026-11-10",
    courseId: "crs-7",
  },
];

export const upcomingActivities = [
  {
    id: "up-1",
    title: "Continue Next.js Mastery",
    when: "Today · 30 min",
    courseId: "crs-1",
  },
  {
    id: "up-2",
    title: "Python Data Wrangling module",
    when: "Tomorrow · 45 min",
    courseId: "crs-2",
  },
  {
    id: "up-3",
    title: "Leadership feedback practice",
    when: "Fri · 25 min",
    courseId: "crs-7",
  },
];

export const studentStats = [
  { label: "Courses enrolled", value: "4" },
  { label: "Hours learned", value: "48" },
  { label: "Certificates", value: "1" },
  { label: "Avg. progress", value: "54%" },
];
