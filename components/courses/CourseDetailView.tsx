"use client";

import { CourseCard } from "@/components/course/CourseCard";
import { CourseCurriculum } from "@/components/course/CourseCurriculum";
import { EnrollPanel } from "@/components/courses/EnrollPanel";
import { CourseReviewsSection } from "@/components/engagement/CourseReviewsSection";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Rating } from "@/components/ui/Rating";
import { SafeImage } from "@/components/ui/SafeImage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useEngagementStore } from "@/hooks/useEngagementStore";
import { useCourseCatalog } from "@/hooks/useInstructorStore";
import { getCategoryById, getInstructorById } from "@/lib/data";
import type { Course } from "@/lib/types";
import { formatDuration, formatNumber } from "@/lib/utils";
import { BookOpen, Clock3, Globe, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";

export function CourseDetailView({
  slug,
  seedCourse,
}: {
  slug: string;
  seedCourse?: Course | null;
}) {
  const { ready, catalog } = useCourseCatalog();
  const { ready: engagementReady, getRatingStats, viewCourse } =
    useEngagementStore();
  const course = useMemo(() => {
    if (!ready) return seedCourse ?? null;
    return catalog.find((item) => item.slug === slug) ?? null;
  }, [ready, catalog, slug, seedCourse]);

  const courseId = course?.id;
  useEffect(() => {
    if (!engagementReady || !courseId) return;
    viewCourse(courseId);
  }, [engagementReady, courseId, viewCourse]);

  if (!ready && !seedCourse) {
    return (
      <div className="container-ls py-20 text-sm text-muted">
        Loading course…
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container-ls py-20 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          Course not found
        </h1>
        <p className="mt-2 text-sm text-muted">
          This course is unavailable, deleted, or not published in this browser
          catalog.
        </p>
        <Link href="/courses" className="mt-6 inline-block text-primary">
          Back to courses
        </Link>
      </div>
    );
  }

  const instructor = getInstructorById(course.instructorId);
  const category = getCategoryById(course.categoryId);
  const ratingStats = engagementReady
    ? getRatingStats(course)
    : { rating: course.rating, reviewCount: course.reviewCount };
  const related = catalog
    .filter(
      (item) =>
        item.status === "published" &&
        item.id !== course.id &&
        (item.categoryId === course.categoryId ||
          item.instructorId === course.instructorId),
    )
    .slice(0, 3);

  return (
    <div className="pb-16">
      <section className="border-b border-border bg-white py-10">
        <div className="container-ls">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Courses", href: "/courses" },
              ...(category
                ? [
                    {
                      label: category.name,
                      href: `/categories/${category.slug}`,
                    },
                  ]
                : []),
              { label: course.title },
            ]}
          />
          {course.status === "draft" ? (
            <div className="mb-4 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
              Draft course — visible for instructor preview in this browser, not
              listed in public discovery.
            </div>
          ) : null}
          <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
            <div>
              <div className="flex flex-wrap gap-2">
                {category ? (
                  <Link href={`/categories/${category.slug}`}>
                    <Badge tone="secondary">{category.name}</Badge>
                  </Link>
                ) : null}
                <Badge tone="muted">{course.subcategory}</Badge>
                <Badge tone="muted">{course.level}</Badge>
                <Badge
                  tone={course.status === "published" ? "success" : "warning"}
                >
                  {course.status}
                </Badge>
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {course.title}
              </h1>
              <p className="mt-3 text-lg text-muted">{course.subtitle}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
                <Rating
                  value={ratingStats.rating}
                  count={ratingStats.reviewCount}
                  size="md"
                />
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {formatNumber(course.studentCount)} students
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-4 w-4" />
                  {formatDuration(course.duration)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {course.lessonCount} lessons
                </span>
                <span className="inline-flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {course.language}
                </span>
              </div>
              {instructor ? (
                <Link
                  href={`/instructors/${instructor.slug}`}
                  className="mt-6 inline-flex items-center gap-3 rounded-xl border border-border bg-surface/40 px-4 py-3 transition hover:border-primary/30"
                >
                  <span className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={instructor.avatar}
                      alt={instructor.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </span>
                  <span>
                    <p className="text-sm text-muted">Instructor</p>
                    <p className="font-medium text-foreground">
                      {instructor.name}
                    </p>
                  </span>
                </Link>
              ) : null}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="relative aspect-video overflow-hidden rounded-xl border border-border">
                  <SafeImage
                    src={course.thumbnail}
                    alt={`${course.title} thumbnail`}
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 100vw, 30vw"
                    priority
                  />
                </div>
                <div className="relative aspect-video overflow-hidden rounded-xl border border-border">
                  <SafeImage
                    src={course.previewImage}
                    alt={`${course.title} preview`}
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 100vw, 30vw"
                  />
                </div>
              </div>
              <div className="prose-ls mt-8 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    About this course
                  </h2>
                  <p className="mt-2">{course.description}</p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    What you&apos;ll learn
                  </h2>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {course.learningOutcomes.map((outcome) => (
                      <li
                        key={outcome}
                        className="flex gap-2 text-sm text-muted before:mt-1.5 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-primary"
                      >
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Requirements
                  </h2>
                  <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted">
                    {course.requirements.map((req) => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {course.status === "published" ? (
              <EnrollPanel course={course} />
            ) : (
              <div className="rounded-xl border border-border bg-white p-6 text-sm text-muted shadow-[var(--shadow-md)]">
                Enrollment is unavailable while this course is a draft. Publish
                it from the instructor dashboard to accept demo enrollments.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-ls">
          <SectionHeader
            title="Course curriculum"
            description="Expand sections to preview lesson titles."
          />
          <CourseCurriculum
            sections={course.curriculum}
            courseSlug={course.status === "published" ? course.slug : undefined}
            defaultOpen={false}
          />
        </div>
      </section>

      <CourseReviewsSection course={course} />

      {related.length > 0 ? (
        <section className="py-12">
          <div className="container-ls">
            <SectionHeader title="Related courses" />
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <CourseCard key={item.id} course={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
