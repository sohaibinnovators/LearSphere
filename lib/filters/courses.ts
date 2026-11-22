import { getPublishedCourses } from "@/lib/data/courses";
import type { Course, CourseFilters, CourseSortKey } from "@/lib/types";

export const defaultCourseFilters: CourseFilters = {
  q: "",
  category: "all",
  subcategory: "all",
  instructor: "all",
  level: "all",
  minPrice: "",
  maxPrice: "",
  rating: "all",
  priceType: "all",
  featured: false,
  trending: false,
  sort: "recommended",
  view: "grid",
};

export function filterCourses(
  filters: CourseFilters,
  source: Course[] = getPublishedCourses(),
): Course[] {
  let list = [...source];
  const q = filters.q.trim().toLowerCase();

  if (q) {
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)) ||
        c.subcategory.toLowerCase().includes(q),
    );
  }

  if (filters.category !== "all") {
    list = list.filter((c) => c.categoryId === filters.category);
  }

  if (filters.subcategory !== "all") {
    list = list.filter((c) => c.subcategory === filters.subcategory);
  }

  if (filters.instructor !== "all") {
    list = list.filter((c) => c.instructorId === filters.instructor);
  }

  if (filters.level !== "all") {
    list = list.filter((c) => c.level === filters.level);
  }

  if (filters.priceType === "free") {
    list = list.filter((c) => c.price === 0);
  }
  if (filters.priceType === "paid") {
    list = list.filter((c) => c.price > 0);
  }

  const min = filters.minPrice === "" ? null : Number(filters.minPrice);
  const max = filters.maxPrice === "" ? null : Number(filters.maxPrice);
  if (min !== null && !Number.isNaN(min)) {
    list = list.filter((c) => c.price >= min);
  }
  if (max !== null && !Number.isNaN(max)) {
    list = list.filter((c) => c.price <= max);
  }

  if (filters.rating === "4+") {
    list = list.filter((c) => c.rating >= 4);
  }
  if (filters.rating === "4.5+") {
    list = list.filter((c) => c.rating >= 4.5);
  }

  if (filters.featured) {
    list = list.filter((c) => c.featured);
  }
  if (filters.trending) {
    list = list.filter((c) => c.trending);
  }

  return sortCourses(list, filters.sort);
}

export function sortCourses(list: Course[], sort: CourseSortKey): Course[] {
  const sorted = [...list];
  sorted.sort((a, b) => {
    switch (sort) {
      case "rating":
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
      case "newest":
        return b.publishedAt.localeCompare(a.publishedAt);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "recommended":
      default:
        return (
          Number(!!b.featured) - Number(!!a.featured) ||
          Number(!!b.bestseller) - Number(!!a.bestseller) ||
          b.studentCount - a.studentCount
        );
    }
  });
  return sorted;
}

export function countActiveCourseFilters(filters: CourseFilters): number {
  let count = 0;
  if (filters.q.trim()) count += 1;
  if (filters.category !== "all") count += 1;
  if (filters.subcategory !== "all") count += 1;
  if (filters.instructor !== "all") count += 1;
  if (filters.level !== "all") count += 1;
  if (filters.minPrice !== "") count += 1;
  if (filters.maxPrice !== "") count += 1;
  if (filters.rating !== "all") count += 1;
  if (filters.priceType !== "all") count += 1;
  if (filters.featured) count += 1;
  if (filters.trending) count += 1;
  return count;
}
