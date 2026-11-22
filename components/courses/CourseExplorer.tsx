"use client";

import { CourseCard } from "@/components/course/CourseCard";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { categories, instructors } from "@/lib/data";
import {
  countActiveCourseFilters,
  defaultCourseFilters,
  filterCourses,
} from "@/lib/filters/courses";
import { useCourseCatalog } from "@/hooks/useInstructorStore";
import type { CourseFilters, Difficulty } from "@/lib/types";
import { serializeCourseFilters } from "@/lib/url/course-params";
import { cn } from "@/lib/utils";
import {
  Filter,
  Grid3x3,
  LayoutList,
  Search,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

const PAGE_SIZE = 9;

function ActiveChips({
  filters,
  onClearKey,
}: {
  filters: CourseFilters;
  onClearKey: (key: keyof CourseFilters) => void;
}) {
  const chips: { key: keyof CourseFilters; label: string }[] = [];
  if (filters.q.trim()) chips.push({ key: "q", label: `Search: ${filters.q}` });
  if (filters.category !== "all") {
    const cat = categories.find((c) => c.id === filters.category);
    chips.push({ key: "category", label: cat?.name ?? "Category" });
  }
  if (filters.subcategory !== "all") {
    chips.push({ key: "subcategory", label: filters.subcategory });
  }
  if (filters.instructor !== "all") {
    const ins = instructors.find((i) => i.id === filters.instructor);
    chips.push({ key: "instructor", label: ins?.name ?? "Instructor" });
  }
  if (filters.level !== "all") chips.push({ key: "level", label: filters.level });
  if (filters.minPrice) chips.push({ key: "minPrice", label: `Min $${filters.minPrice}` });
  if (filters.maxPrice) chips.push({ key: "maxPrice", label: `Max $${filters.maxPrice}` });
  if (filters.rating !== "all") chips.push({ key: "rating", label: filters.rating });
  if (filters.priceType !== "all") {
    chips.push({
      key: "priceType",
      label: filters.priceType === "free" ? "Free" : "Paid",
    });
  }
  if (filters.featured) chips.push({ key: "featured", label: "Featured" });
  if (filters.trending) chips.push({ key: "trending", label: "Trending" });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={`${chip.key}-${chip.label}`}
          type="button"
          onClick={() => onClearKey(chip.key)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-foreground transition hover:border-primary/40"
        >
          {chip.label}
          <X className="h-3 w-3 text-muted" />
        </button>
      ))}
    </div>
  );
}

function FilterFields({
  filters,
  subcategories,
  onChange,
}: {
  filters: CourseFilters;
  subcategories: string[];
  onChange: <K extends keyof CourseFilters>(key: K, value: CourseFilters[K]) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input
        label="Search"
        placeholder="Title or description"
        value={filters.q}
        onChange={(e) => onChange("q", e.target.value)}
        leftIcon={<Search className="h-4 w-4" />}
      />
      <Select
        label="Category"
        value={filters.category}
        onChange={(e) => {
          onChange("category", e.target.value);
          onChange("subcategory", "all");
        }}
        options={[
          { value: "all", label: "All categories" },
          ...categories.map((c) => ({ value: c.id, label: c.name })),
        ]}
      />
      <Select
        label="Subcategory"
        value={filters.subcategory}
        onChange={(e) => onChange("subcategory", e.target.value)}
        options={[
          { value: "all", label: "All subcategories" },
          ...subcategories.map((s) => ({ value: s, label: s })),
        ]}
      />
      <Select
        label="Instructor"
        value={filters.instructor}
        onChange={(e) => onChange("instructor", e.target.value)}
        options={[
          { value: "all", label: "All instructors" },
          ...instructors.map((i) => ({ value: i.id, label: i.name })),
        ]}
      />
      <Select
        label="Difficulty"
        value={filters.level}
        onChange={(e) => onChange("level", e.target.value as Difficulty | "all")}
        options={[
          { value: "all", label: "All levels" },
          { value: "Beginner", label: "Beginner" },
          { value: "Intermediate", label: "Intermediate" },
          { value: "Advanced", label: "Advanced" },
        ]}
      />
      <Select
        label="Price type"
        value={filters.priceType}
        onChange={(e) =>
          onChange("priceType", e.target.value as CourseFilters["priceType"])
        }
        options={[
          { value: "all", label: "All prices" },
          { value: "free", label: "Free" },
          { value: "paid", label: "Paid" },
        ]}
      />
      <Input
        label="Min price"
        type="number"
        min={0}
        placeholder="0"
        value={filters.minPrice}
        onChange={(e) => onChange("minPrice", e.target.value)}
      />
      <Input
        label="Max price"
        type="number"
        min={0}
        placeholder="200"
        value={filters.maxPrice}
        onChange={(e) => onChange("maxPrice", e.target.value)}
      />
      <Select
        label="Rating"
        value={filters.rating}
        onChange={(e) =>
          onChange("rating", e.target.value as CourseFilters["rating"])
        }
        options={[
          { value: "all", label: "All ratings" },
          { value: "4+", label: "4+ stars" },
          { value: "4.5+", label: "4.5+ stars" },
        ]}
      />
      <Select
        label="Sort by"
        value={filters.sort}
        onChange={(e) =>
          onChange("sort", e.target.value as CourseFilters["sort"])
        }
        options={[
          { value: "recommended", label: "Recommended" },
          { value: "newest", label: "Newest" },
          { value: "rating", label: "Highest rated" },
          { value: "price-low", label: "Price: low to high" },
          { value: "price-high", label: "Price: high to low" },
        ]}
      />
      <label className="flex items-center gap-2 self-end rounded-lg border border-border bg-white px-3 py-3 text-sm">
        <input
          type="checkbox"
          checked={filters.featured}
          onChange={(e) => onChange("featured", e.target.checked)}
          className="accent-primary"
        />
        Featured only
      </label>
      <label className="flex items-center gap-2 self-end rounded-lg border border-border bg-white px-3 py-3 text-sm">
        <input
          type="checkbox"
          checked={filters.trending}
          onChange={(e) => onChange("trending", e.target.checked)}
          className="accent-primary"
        />
        Trending only
      </label>
    </div>
  );
}

export function CourseExplorer({
  initialFilters,
}: {
  initialFilters: CourseFilters;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const { ready: catalogReady, published } = useCourseCatalog();
  const [filters, setFilters] = useState<CourseFilters>(initialFilters);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const filtersKey = serializeCourseFilters(initialFilters);
  const [filtersSourceKey, setFiltersSourceKey] = useState(filtersKey);

  if (filtersKey !== filtersSourceKey) {
    setFiltersSourceKey(filtersKey);
    setFilters(initialFilters);
    setVisible(PAGE_SIZE);
  }

  const pushFilters = (next: CourseFilters) => {
    setFilters(next);
    setVisible(PAGE_SIZE);
    const query = serializeCourseFilters(next);
    startTransition(() => {
      router.replace(`${pathname}${query}`, { scroll: false });
    });
  };

  const update = <K extends keyof CourseFilters>(
    key: K,
    value: CourseFilters[K],
  ) => {
    pushFilters({ ...filters, [key]: value });
  };

  const clearKey = (key: keyof CourseFilters) => {
    pushFilters({ ...filters, [key]: defaultCourseFilters[key] });
  };

  const clearAll = () => {
    pushFilters({ ...defaultCourseFilters, view: filters.view });
    setDrawerOpen(false);
  };

  const selectedCategory = categories.find((c) => c.id === filters.category);
  const subcategories = selectedCategory?.subcategories ?? [];

  const filtered = useMemo(
    () => filterCourses(filters, published),
    [filters, published],
  );
  const shown = filtered.slice(0, visible);
  const activeCount = countActiveCourseFilters(filters);

  return (
    <div className="pb-16">
      <section className="border-b border-border bg-white py-10">
        <div className="container-ls">
          <SectionHeader
            title="Explore courses"
            description="Search and filter the LearnSphere catalog with live URL-backed controls."
          />

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setDrawerOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Filters{activeCount ? ` (${activeCount})` : ""}
            </Button>
            {activeCount > 0 ? (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear all filters
              </Button>
            ) : null}
          </div>

          <ActiveChips filters={filters} onClearKey={clearKey} />

          <div className="mt-6 hidden lg:block">
            <FilterFields
              filters={filters}
              subcategories={subcategories}
              onChange={update}
            />
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container-ls">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted">
              Showing {shown.length} of {filtered.length} courses
            </p>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-white p-1">
              <button
                type="button"
                onClick={() => update("view", "grid")}
                className={cn(
                  "rounded-md p-2 transition",
                  filters.view === "grid"
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:text-foreground",
                )}
                aria-label="Grid view"
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => update("view", "list")}
                className={cn(
                  "rounded-md p-2 transition",
                  filters.view === "list"
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:text-foreground",
                )}
                aria-label="List view"
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!catalogReady ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-xl border border-border bg-white"
                />
              ))}
            </div>
          ) : shown.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-white px-6 py-16 text-center">
              <p className="font-medium text-foreground">
                No courses match your filters
              </p>
              <p className="mt-2 text-sm text-muted">
                Try clearing filters or broadening your search.
              </p>
              <Button className="mt-6" variant="outline" onClick={clearAll}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                filters.view === "grid"
                  ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col gap-6",
              )}
            >
              {shown.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  layout={filters.view}
                />
              ))}
            </div>
          )}

          {visible < filtered.length ? (
            <div className="mt-10 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
              >
                Load more courses
              </Button>
            </div>
          ) : null}
        </div>
      </section>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/40"
            aria-label="Close filters"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-[var(--shadow-md)]">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <h2 className="font-semibold text-foreground">Filters</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-md p-2 hover:bg-surface"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FilterFields
                filters={filters}
                subcategories={subcategories}
                onChange={update}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-border p-4">
              <Button variant="outline" onClick={clearAll}>
                Clear all
              </Button>
              <Button onClick={() => setDrawerOpen(false)}>Show results</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
