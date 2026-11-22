import type { InstructorStats } from "@/lib/types";

export const currentInstructor = {
  id: "ins-1",
  name: "Elena Martinez",
  email: "elena.martinez@example.com",
  avatar:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
  title: "Senior Full-Stack Engineer",
  bio: "Teaching practical web engineering with a focus on clean architecture and shipping real features.",
  location: "San Francisco, CA",
};

export const instructorStats: InstructorStats = {
  totalStudents: 27360,
  totalRevenue: 184500,
  avgRating: 4.9,
  activeCourses: 2,
  monthlyEarnings: [
    { month: "Jun", amount: 12400 },
    { month: "Jul", amount: 14200 },
    { month: "Aug", amount: 13800 },
    { month: "Sep", amount: 16100 },
    { month: "Oct", amount: 17800 },
    { month: "Nov", amount: 15200 },
  ],
};

export const instructorCoursePerformance = [
  {
    courseId: "crs-1",
    students: 18420,
    rating: 4.9,
    revenue: 128400,
    completionRate: 68,
  },
  {
    courseId: "crs-8",
    students: 8940,
    rating: 4.9,
    revenue: 56100,
    completionRate: 61,
  },
];

export const recentStudentActivity = [
  {
    id: "isa-1",
    student: "Priya Nair",
    action: "Completed section · Building Interfaces",
    course: "Complete Next.js Mastery",
    time: "2h ago",
  },
  {
    id: "isa-2",
    student: "Tom Bradley",
    action: "Left a 5-star review",
    course: "Complete Next.js Mastery",
    time: "5h ago",
  },
  {
    id: "isa-3",
    student: "Sam Ortiz",
    action: "Enrolled in course",
    course: "TypeScript Deep Dive",
    time: "Yesterday",
  },
  {
    id: "isa-4",
    student: "Lina Cho",
    action: "Completed lesson · Generics in practice",
    course: "TypeScript Deep Dive",
    time: "Yesterday",
  },
];

export const instructorReviews = [
  {
    id: "ir-1",
    student: "Priya Nair",
    course: "Complete Next.js Mastery",
    rating: 5,
    comment:
      "Demo review — Clearest Next.js course I've taken. Project advice was excellent.",
    date: "2026-09-18",
  },
  {
    id: "ir-2",
    student: "Tom Bradley",
    course: "Complete Next.js Mastery",
    rating: 5,
    comment:
      "Demo review — Practical and current. Great balance of theory and shipping.",
    date: "2026-08-02",
  },
  {
    id: "ir-3",
    student: "Jordan Miles",
    course: "TypeScript Deep Dive",
    rating: 5,
    comment:
      "Demo review — Finally understand generics in real codebases.",
    date: "2026-10-02",
  },
];

export const instructorStudents = [
  {
    id: "is-stu-1",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    course: "Complete Next.js Mastery",
    progress: 78,
    enrolledAt: "2026-08-12",
  },
  {
    id: "is-stu-2",
    name: "Tom Bradley",
    email: "tom.bradley@example.com",
    course: "Complete Next.js Mastery",
    progress: 92,
    enrolledAt: "2026-07-20",
  },
  {
    id: "is-stu-3",
    name: "Sam Ortiz",
    email: "sam.ortiz@example.com",
    course: "TypeScript Deep Dive",
    progress: 24,
    enrolledAt: "2026-11-19",
  },
  {
    id: "is-stu-4",
    name: "Lina Cho",
    email: "lina.cho@example.com",
    course: "TypeScript Deep Dive",
    progress: 45,
    enrolledAt: "2026-10-02",
  },
  {
    id: "is-stu-5",
    name: "Jordan Miles",
    email: "jordan.miles@example.com",
    course: "TypeScript Deep Dive",
    progress: 100,
    enrolledAt: "2026-06-14",
  },
];