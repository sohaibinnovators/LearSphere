"use client";

import { CourseCard } from "@/components/course/CourseCard";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import {
  defaultCourseFilters,
  filterCourses,
} from "@/lib/filters/courses";
import { useCourseCatalog } from "@/hooks/useInstructorStore";
import type { Category, Course, CourseFilters, Difficulty } from "@/lib/types";
import { serializeCourseFilters } from "@/lib/url/course-params";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

export function CategoryCoursesExplorer({
  category,
  courses: seedCourses,
  initialFilters,
}: {
  category: Category;
  courses: Course[];
  initialFilters: CourseFilters;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const { ready, published } = useCourseCatalog();
  const lockedInitial = { ...initialFilters, category: category.id };
  const [filters, setFilters] = useState<CourseFilters>(lockedInitial);
  const filtersKey = `${category.id}:${serializeCourseFilters(initialFilters)}`;
  const [filtersSourceKey, setFiltersSourceKey] = useState(filtersKey);

  if (filtersKey !== filtersSourceKey) {
    setFiltersSourceKey(filtersKey);
    setFilters({ ...initialFilters, category: category.id });
  }

  const courses = ready
    ? published.filter((course) => course.categoryId === category.id)
    : seedCourses;

  const pushFilters = (next: CourseFilters) => {
    const locked = { ...next, category: category.id };
    setFilters(locked);
    const query = serializeCourseFilters(locked, { omit: ["category"] });
    startTransition(() => {
      router.replace(`${pathname}${query}`, { scroll: false });
    });
  };

  const filtered = useMemo(
    () => filterCourses({ ...filters, category: category.id }, courses),
    [filters, category.id, courses],
  );

  const clearAll = () => {
    pushFilters({
      ...defaultCourseFilters,
      category: category.id,
      view: filters.view,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Input
          label="Search in category"
          placeholder="Search courses"
          value={filters.q}
          onChange={(e) => pushFilters({ ...filters, q: e.target.value })}
          leftIcon={<Search className="h-4 w-4" />}
        />
        <Select
          label="Subcategory"
          value={filters.subcategory}
          onChange={(e) =>
            pushFilters({ ...filters, subcategory: e.target.value })
          }
          options={[
            { value: "all", label: "All subcategories" },
            ...category.subcategories.map((s) => ({ value: s, label: s })),
          ]}
        />
        <Select
          label="Difficulty"
          value={filters.level}
          onChange={(e) =>
            pushFilters({
              ...filters,
              level: e.target.value as Difficulty | "all",
            })
          }
          options={[
            { value: "all", label: "All levels" },
            { value: "Beginner", label: "Beginner" },
            { value: "Intermediate", label: "Intermediate" },
            { value: "Advanced", label: "Advanced" },
          ]}
        />
        <Select
          label="Price"
          value={filters.priceType}
          onChange={(e) =>
            pushFilters({
              ...filters,
              priceType: e.target.value as CourseFilters["priceType"],
            })
          }
          options={[
            { value: "all", label: "All prices" },
            { value: "free", label: "Free" },
            { value: "paid", label: "Paid" },
          ]}
        />
        <Select
          label="Sort by"
          value={filters.sort}
          onChange={(e) =>
            pushFilters({
              ...filters,
              sort: e.target.value as CourseFilters["sort"],
            })
          }
          options={[
            { value: "recommended", label: "Recommended" },
            { value: "newest", label: "Newest" },
            { value: "rating", label: "Highest rated" },
            { value: "price-low", label: "Price: low to high" },
            { value: "price-high", label: "Price: high to low" },
          ]}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {filtered.length} course{filtered.length === 1 ? "" : "s"} found
        </p>
        <Button variant="ghost" size="sm" onClick={clearAll}>
          Reset filters
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white py-14 text-center">
          <p className="font-medium text-foreground">
            No courses in this category match your filters
          </p>
          <p className="mt-2 text-sm text-muted">
            Try another subcategory, difficulty, or price option.
          </p>
          <Button className="mt-6" variant="outline" onClick={clearAll}>
            Reset filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
