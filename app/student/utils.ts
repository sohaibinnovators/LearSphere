import { getCourseById } from "@/lib/data/courses";
import { wishlistCourseIds } from "@/lib/data/student";
import type { LocalEnrollment } from "@/lib/learning/types";
import type { Course } from "@/lib/types";

export type EnrollmentWithCourse = {
  enrollment: LocalEnrollment;
  course: Course;
};

export function getWishlistCourses(): Course[] {
  return wishlistCourseIds.flatMap((id) => {
    const course = getCourseById(id);
    return course ? [course] : [];
  });
}

export function sortByLastAccessed(items: EnrollmentWithCourse[]) {
  return [...items].sort((a, b) =>
    b.enrollment.lastAccessed.localeCompare(a.enrollment.lastAccessed),
  );
}

export function getContinueLearning(
  items: EnrollmentWithCourse[],
): EnrollmentWithCourse | undefined {
  return sortByLastAccessed(
    items.filter((item) => item.enrollment.status !== "completed"),
  )[0];
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatStudentDate(iso: string) {
  const datePart = iso.slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

export function formatStudentDateTime(iso: string) {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return formatStudentDate(iso);
  return parsed.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
