import { CourseCard } from "@/components/course/CourseCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Rating } from "@/components/ui/Rating";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  getCategoryById,
  getCoursesByInstructor,
  getInstructorBySlug,
  getInstructorPublishedCourseCount,
  instructors,
} from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { BookOpen, Globe, Link2, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return instructors.map((instructor) => ({ slug: instructor.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const instructor = getInstructorBySlug(slug);
  if (!instructor) return { title: "Instructor not found" };
  return {
    title: instructor.name,
    description: instructor.bio,
  };
}

export default async function InstructorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const instructor = getInstructorBySlug(slug);
  if (!instructor) notFound();

  const instructorCourses = getCoursesByInstructor(instructor.id);
  const courseCount = getInstructorPublishedCourseCount(instructor.id);
  const totalStudents = instructorCourses.reduce(
    (sum, course) => sum + course.studentCount,
    0,
  );
  const avgCourseRating =
    instructorCourses.length > 0
      ? instructorCourses.reduce((sum, course) => sum + course.rating, 0) /
        instructorCourses.length
      : instructor.rating;

  return (
    <div className="pb-16">
      <section className="border-b border-border bg-white py-12">
        <div className="container-ls">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Instructors", href: "/instructors" },
              { label: instructor.name },
            ]}
          />
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border border-border">
              <Image
                src={instructor.avatar}
                alt={instructor.name}
                fill
                className="object-cover"
                sizes="128px"
                priority
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-foreground">
                {instructor.name}
              </h1>
              <p className="mt-1 text-lg text-muted">{instructor.title}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
                <Rating
                  value={instructor.rating}
                  count={instructor.reviewCount}
                  size="md"
                />
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {formatNumber(instructor.studentCount)} students
                </span>
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {courseCount} published courses
                </span>
                <span>{instructor.yearsExperience}+ years experience</span>
              </div>
              <p className="mt-6 max-w-3xl leading-relaxed text-muted">
                {instructor.bio}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {instructor.specialties.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {instructor.expertiseCategoryIds.map((categoryId) => {
                  const category = getCategoryById(categoryId);
                  if (!category) return null;
                  return (
                    <Link
                      key={categoryId}
                      href={`/categories/${category.slug}`}
                      className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/5"
                    >
                      {category.name}
                    </Link>
                  );
                })}
              </div>
              {instructor.social ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  {instructor.social.website ? (
                    <Link
                      href={instructor.social.website}
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-dark"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </Link>
                  ) : null}
                  {instructor.social.linkedin ? (
                    <Link
                      href={instructor.social.linkedin}
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-dark"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Link2 className="h-4 w-4" />
                      LinkedIn
                    </Link>
                  ) : null}
                  {instructor.social.twitter ? (
                    <Link
                      href={instructor.social.twitter}
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-dark"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Link2 className="h-4 w-4" />
                      Twitter
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface/40 p-4">
              <p className="text-sm text-muted">Published courses</p>
              <p className="mt-1 text-2xl font-semibold">{courseCount}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface/40 p-4">
              <p className="text-sm text-muted">Course enrollments (demo)</p>
              <p className="mt-1 text-2xl font-semibold">
                {formatNumber(totalStudents)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface/40 p-4">
              <p className="text-sm text-muted">Avg. course rating</p>
              <p className="mt-1 text-2xl font-semibold">
                {avgCourseRating.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-ls">
          <SectionHeader
            title="Courses by this instructor"
            description={`${instructorCourses.length} published courses in the catalog.`}
          />
          {instructorCourses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-white py-14 text-center">
              <p className="font-medium text-foreground">
                No published courses yet
              </p>
              <p className="mt-2 text-sm text-muted">
                Check back soon for new releases from this instructor.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {instructorCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
