import { Rating } from "@/components/ui/Rating";
import { getInstructorPublishedCourseCount } from "@/lib/data/courses";
import type { Instructor } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { BookOpen, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function InstructorCard({ instructor }: { instructor: Instructor }) {
  const courseCount = getInstructorPublishedCourseCount(instructor.id);

  return (
    <Link
      href={`/instructors/${instructor.slug}`}
      className="group block overflow-hidden rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)] transition hover:border-primary/25 hover:shadow-[var(--shadow-md)]"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full">
          <Image
            src={instructor.avatar}
            alt={instructor.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div>
          <h3 className="font-semibold text-foreground transition group-hover:text-primary">
            {instructor.name}
          </h3>
          <p className="text-sm text-muted">{instructor.title}</p>
        </div>
      </div>
      <p className="mt-4 line-clamp-2 text-sm text-muted">{instructor.bio}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
        <Rating value={instructor.rating} count={instructor.reviewCount} />
        <span className="inline-flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {formatNumber(instructor.studentCount)} students
        </span>
        <span className="inline-flex items-center gap-1">
          <BookOpen className="h-3.5 w-3.5" />
          {courseCount} courses
        </span>
      </div>
    </Link>
  );
}
