"use client";

import { InstructorCard } from "@/components/course/InstructorCard";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { categories } from "@/lib/data";
import {
  countActiveInstructorFilters,
  defaultInstructorFilters,
  filterInstructors,
  type InstructorFilters,
} from "@/lib/filters/instructors";
import type { InstructorSortKey } from "@/lib/types";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

function serializeInstructorFilters(filters: InstructorFilters) {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.expertise !== "all") params.set("expertise", filters.expertise);
  if (filters.rating !== "all") params.set("rating", filters.rating);
  if (filters.sort !== "recommended") params.set("sort", filters.sort);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function InstructorExplorer({
  initialFilters,
}: {
  initialFilters: InstructorFilters;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [filters, setFilters] = useState(initialFilters);
  const filtersKey = serializeInstructorFilters(initialFilters);
  const [filtersSourceKey, setFiltersSourceKey] = useState(filtersKey);

  if (filtersKey !== filtersSourceKey) {
    setFiltersSourceKey(filtersKey);
    setFilters(initialFilters);
  }

  const pushFilters = (next: InstructorFilters) => {
    setFilters(next);
    startTransition(() => {
      router.replace(`${pathname}${serializeInstructorFilters(next)}`, {
        scroll: false,
      });
    });
  };

  const filtered = useMemo(() => filterInstructors(filters), [filters]);
  const activeCount = countActiveInstructorFilters(filters);

  const clearAll = () => pushFilters(defaultInstructorFilters);

  return (
    <section className="py-12 md:py-16">
      <div className="container-ls">
        <SectionHeader
          title="Our instructors"
          description="Search practitioners by name, expertise, and rating."
        />

        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Search"
            placeholder="Name or title"
            value={filters.q}
            onChange={(e) => pushFilters({ ...filters, q: e.target.value })}
            leftIcon={<Search className="h-4 w-4" />}
          />
          <Select
            label="Expertise"
            value={filters.expertise}
            onChange={(e) =>
              pushFilters({ ...filters, expertise: e.target.value })
            }
            options={[
              { value: "all", label: "All categories" },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
          <Select
            label="Rating"
            value={filters.rating}
            onChange={(e) =>
              pushFilters({
                ...filters,
                rating: e.target.value as InstructorFilters["rating"],
              })
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
              pushFilters({
                ...filters,
                sort: e.target.value as InstructorSortKey,
              })
            }
            options={[
              { value: "recommended", label: "Recommended" },
              { value: "rating", label: "Highest rated" },
              { value: "experience", label: "Most experience" },
            ]}
          />
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            {filtered.length} instructor{filtered.length === 1 ? "" : "s"} found
          </p>
          {activeCount > 0 ? (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear filters
            </Button>
          ) : null}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white py-16 text-center">
            <p className="font-medium text-foreground">
              No instructors match your filters
            </p>
            <p className="mt-2 text-sm text-muted">
              Try another expertise area or clear your search.
            </p>
            <Button className="mt-6" variant="outline" onClick={clearAll}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
