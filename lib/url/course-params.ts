import {
  defaultCourseFilters,
} from "@/lib/filters/courses";
import type { CourseFilters, CourseSortKey, Difficulty } from "@/lib/types";

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function parseCourseFilters(searchParams: SearchParams): CourseFilters {
  const level = first(searchParams.level);
  const sort = first(searchParams.sort) as CourseSortKey;
  const view = first(searchParams.view);
  const rating = first(searchParams.rating);
  const priceType = first(searchParams.price);

  return {
    q: first(searchParams.q),
    category: first(searchParams.category) || "all",
    subcategory: first(searchParams.subcategory) || "all",
    instructor: first(searchParams.instructor) || "all",
    level:
      level === "Beginner" || level === "Intermediate" || level === "Advanced"
        ? (level as Difficulty)
        : "all",
    minPrice: first(searchParams.minPrice),
    maxPrice: first(searchParams.maxPrice),
    rating:
      rating === "4+" || rating === "4.5+" ? rating : "all",
    priceType:
      priceType === "free" || priceType === "paid" ? priceType : "all",
    featured: first(searchParams.featured) === "1",
    trending: first(searchParams.trending) === "1",
    sort: ["recommended", "newest", "price-low", "price-high", "rating"].includes(
      sort,
    )
      ? sort
      : "recommended",
    view: view === "list" ? "list" : "grid",
  };
}

export function serializeCourseFilters(
  filters: CourseFilters,
  options?: { omit?: (keyof CourseFilters)[] },
): string {
  const params = new URLSearchParams();
  const omit = new Set(options?.omit ?? []);

  const set = (key: string, value: string) => {
    if (value) params.set(key, value);
  };

  if (!omit.has("q") && filters.q.trim()) set("q", filters.q.trim());
  if (!omit.has("category") && filters.category !== "all") {
    set("category", filters.category);
  }
  if (!omit.has("subcategory") && filters.subcategory !== "all") {
    set("subcategory", filters.subcategory);
  }
  if (!omit.has("instructor") && filters.instructor !== "all") {
    set("instructor", filters.instructor);
  }
  if (!omit.has("level") && filters.level !== "all") set("level", filters.level);
  if (!omit.has("minPrice") && filters.minPrice) set("minPrice", filters.minPrice);
  if (!omit.has("maxPrice") && filters.maxPrice) set("maxPrice", filters.maxPrice);
  if (!omit.has("rating") && filters.rating !== "all") set("rating", filters.rating);
  if (!omit.has("priceType") && filters.priceType !== "all") {
    set("price", filters.priceType);
  }
  if (!omit.has("featured") && filters.featured) set("featured", "1");
  if (!omit.has("trending") && filters.trending) set("trending", "1");
  if (!omit.has("sort") && filters.sort !== defaultCourseFilters.sort) {
    set("sort", filters.sort);
  }
  if (!omit.has("view") && filters.view !== "grid") set("view", filters.view);

  const query = params.toString();
  return query ? `?${query}` : "";
}
