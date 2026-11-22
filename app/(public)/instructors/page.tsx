import { InstructorExplorer } from "@/components/instructors/InstructorExplorer";
import {
  defaultInstructorFilters,
  type InstructorFilters,
} from "@/lib/filters/instructors";
import type { InstructorSortKey } from "@/lib/types";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Instructors",
  description: "Meet expert instructors teaching on LearnSphere.",
};

function parseInstructorFilters(
  searchParams: Record<string, string | string[] | undefined>,
): InstructorFilters {
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] ?? "" : value ?? "";

  const rating = first(searchParams.rating);
  const sort = first(searchParams.sort) as InstructorSortKey;

  return {
    q: first(searchParams.q),
    expertise: first(searchParams.expertise) || "all",
    rating: rating === "4+" || rating === "4.5+" ? rating : "all",
    sort: ["recommended", "rating", "experience"].includes(sort)
      ? sort
      : defaultInstructorFilters.sort,
  };
}

async function InstructorsContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return <InstructorExplorer initialFilters={parseInstructorFilters(params)} />;
}

export default function InstructorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense
      fallback={
        <div className="container-ls py-16 text-sm text-muted">
          Loading instructors…
        </div>
      }
    >
      <InstructorsContent searchParams={searchParams} />
    </Suspense>
  );
}
