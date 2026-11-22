import { getInstructorPublishedCourseCount } from "@/lib/data/courses";
import { instructors } from "@/lib/data/instructors";
import type { Instructor, InstructorSortKey } from "@/lib/types";

export interface InstructorFilters {
  q: string;
  expertise: string;
  rating: "all" | "4+" | "4.5+";
  sort: InstructorSortKey;
}

export const defaultInstructorFilters: InstructorFilters = {
  q: "",
  expertise: "all",
  rating: "all",
  sort: "recommended",
};

export function filterInstructors(
  filters: InstructorFilters,
  source: Instructor[] = instructors,
): Instructor[] {
  let list = [...source];
  const q = filters.q.trim().toLowerCase();

  if (q) {
    list = list.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.title.toLowerCase().includes(q) ||
        i.specialties.some((s) => s.toLowerCase().includes(q)),
    );
  }

  if (filters.expertise !== "all") {
    list = list.filter((i) =>
      i.expertiseCategoryIds.includes(filters.expertise),
    );
  }

  if (filters.rating === "4+") {
    list = list.filter((i) => i.rating >= 4);
  }
  if (filters.rating === "4.5+") {
    list = list.filter((i) => i.rating >= 4.5);
  }

  list.sort((a, b) => {
    switch (filters.sort) {
      case "rating":
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
      case "experience":
        return b.yearsExperience - a.yearsExperience;
      case "recommended":
      default:
        return (
          getInstructorPublishedCourseCount(b.id) -
            getInstructorPublishedCourseCount(a.id) ||
          b.studentCount - a.studentCount
        );
    }
  });

  return list;
}

export function countActiveInstructorFilters(filters: InstructorFilters) {
  let count = 0;
  if (filters.q.trim()) count += 1;
  if (filters.expertise !== "all") count += 1;
  if (filters.rating !== "all") count += 1;
  return count;
}
