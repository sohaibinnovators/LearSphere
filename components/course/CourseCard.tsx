"use client";

import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { SafeImage } from "@/components/ui/SafeImage";
import { getInstructorById } from "@/lib/data";
import type { Course } from "@/lib/types";
import { cn, formatDuration, formatPrice } from "@/lib/utils";
import { Clock3, Heart, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function CourseCard({
  course,
  layout = "grid",
  className,
}: {
  course: Course;
  layout?: "grid" | "list";
  className?: string;
}) {
  const instructor = getInstructorById(course.instructorId);
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-xl border border-border bg-white shadow-[var(--shadow-sm)] transition hover:border-primary/25 hover:shadow-[var(--shadow-md)]",
        layout === "list" && "md:flex",
        className,
      )}
    >
      <Link
        href={`/courses/${course.slug}`}
        className={cn(
          "relative block overflow-hidden bg-surface",
          layout === "list" ? "md:w-64 md:shrink-0" : "aspect-[16/10]",
        )}
      >
        <SafeImage
          src={course.thumbnail}
          alt={course.title}
          fill
          className={cn(
            "object-cover transition duration-500 group-hover:scale-[1.03]",
            layout === "list" && "md:min-h-40",
          )}
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {course.featured ? <Badge tone="primary">Featured</Badge> : null}
          {course.trending ? <Badge tone="secondary">Trending</Badge> : null}
          {course.bestseller ? <Badge tone="warning">Bestseller</Badge> : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <Badge tone="muted">{course.level}</Badge>
          <button
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={() => setWishlisted((value) => !value)}
            className={cn(
              "rounded-md p-1.5 transition",
              wishlisted
                ? "bg-danger/10 text-danger"
                : "text-muted hover:bg-surface hover:text-danger",
            )}
          >
            <Heart
              className={cn("h-4 w-4", wishlisted && "fill-current")}
            />
          </button>
        </div>

        <Link href={`/courses/${course.slug}`} className="space-y-1">
          <h3 className="text-base font-semibold leading-snug text-foreground transition group-hover:text-primary md:text-lg">
            {course.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted">{course.subtitle}</p>
        </Link>

        {instructor ? (
          <Link
            href={`/instructors/${instructor.slug}`}
            className="mt-3 flex items-center gap-2 text-sm text-muted hover:text-primary"
          >
            <span className="relative h-6 w-6 overflow-hidden rounded-full">
              <Image
                src={instructor.avatar}
                alt={instructor.name}
                fill
                className="object-cover"
                sizes="24px"
              />
            </span>
            {instructor.name}
          </Link>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <Rating value={course.rating} count={course.reviewCount} />
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {formatDuration(course.duration)}
          </span>
          <span className="inline-flex items-center gap-1">
            <PlayCircle className="h-3.5 w-3.5" />
            {course.lessonCount} lessons
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
          <div>
            <p className="text-lg font-semibold text-foreground">
              {formatPrice(course.price)}
            </p>
            {course.originalPrice ? (
              <p className="text-xs text-muted line-through">
                {formatPrice(course.originalPrice)}
              </p>
            ) : null}
          </div>
          <Link
            href={`/courses/${course.slug}`}
            className="text-sm font-medium text-primary hover:text-primary-dark"
          >
            View course
          </Link>
        </div>
      </div>
    </article>
  );
}
