"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import { useInstructorStore } from "@/hooks/useInstructorStore";
import { formatNumber, formatPrice } from "@/lib/utils";
import type { Course } from "@/lib/types";
import {
  Eye,
  EyeOff,
  Pencil,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { useMemo, useState } from "react";

type StatusFilter = "all" | "published" | "draft";
type SortKey = "newest" | "oldest" | "title";

export default function InstructorCoursesPage() {
  const { ready, myCourses, profile, setStatus, removeCourse } =
    useInstructorStore();
  const [query, setQuery] = useState("");
  const [status, setStatusFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [pendingDelete, setPendingDelete] = useState<Course | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const filtered = useMemo(() => {
    let list = [...myCourses];
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((course) => course.title.toLowerCase().includes(q));
    if (status !== "all") list = list.filter((course) => course.status === status);
    list.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "oldest") return a.publishedAt.localeCompare(b.publishedAt);
      return b.lastUpdated.localeCompare(a.lastUpdated);
    });
    return list;
  }, [myCourses, query, status, sort]);

  const confirmDelete = () => {
    if (!pendingDelete) return;
    removeCourse(pendingDelete.id);
    setToastMessage(
      `"${pendingDelete.title}" deleted. Local enrollments for this course were also removed.`,
    );
    setPendingDelete(null);
    setToastOpen(true);
  };

  return (
    <>
      <DashboardHeader
        title="My courses"
        subtitle={
          ready
            ? `${myCourses.length} course${myCourses.length === 1 ? "" : "s"} in your local catalog`
            : "Loading courses…"
        }
        user={{
          name: profile.name,
          avatar: profile.avatar,
          role: "Instructor",
        }}
        actions={
          <Button href="/instructor/courses/create" size="sm">
            <PlusCircle className="h-4 w-4" />
            Create course
          </Button>
        }
      />

      <div className="space-y-6 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="Search"
            placeholder="Search by title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            options={[
              { value: "all", label: "All statuses" },
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
            ]}
          />
          <Select
            label="Sort by"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            options={[
              { value: "newest", label: "Newest updated" },
              { value: "oldest", label: "Oldest published" },
              { value: "title", label: "Title A–Z" },
            ]}
          />
        </div>

        {!ready ? (
          <div className="h-40 animate-pulse rounded-xl border border-border bg-white" />
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white py-16 text-center">
            <p className="font-medium text-foreground">No courses found</p>
            <p className="mt-2 text-sm text-muted">
              Create a course or clear your filters to see your catalog.
            </p>
            <Button href="/instructor/courses/create" className="mt-6">
              Create course
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((course) => (
              <article
                key={course.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-white p-4 shadow-[var(--shadow-sm)] lg:flex-row lg:items-center"
              >
                <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-lg bg-surface sm:h-28 lg:w-44">
                  <SafeImage
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="176px"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">
                      {course.title}
                    </h2>
                    <Badge
                      tone={course.status === "published" ? "success" : "warning"}
                    >
                      {course.status}
                    </Badge>
                    <Badge tone="muted">{course.level}</Badge>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted">
                    {course.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted">
                    <span>{course.lessonCount} lessons</span>
                    <span>{formatNumber(course.studentCount)} catalog students</span>
                    <span>{formatPrice(course.price)}</span>
                    <span>Updated {course.lastUpdated}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 lg:w-56 lg:flex-col">
                  <Button
                    href={`/instructor/courses/${course.slug}/edit`}
                    variant="outline"
                    size="sm"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  {course.status === "published" ? (
                    <Button
                      href={`/courses/${course.slug}`}
                      variant="ghost"
                      size="sm"
                    >
                      Preview
                    </Button>
                  ) : (
                    <Button href={`/courses/${course.slug}`} variant="ghost" size="sm">
                      Preview draft
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const nextStatus =
                        course.status === "published" ? "draft" : "published";
                      setStatus(course.id, nextStatus);
                      setToastMessage(
                        nextStatus === "published"
                          ? "Course published to public discovery (this browser)."
                          : "Course unpublished and hidden from public discovery.",
                      );
                      setToastOpen(true);
                    }}
                  >
                    {course.status === "published" ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Publish
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-danger"
                    onClick={() => setPendingDelete(course)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete course?"
      >
        <p className="text-sm text-muted">
          Delete <strong className="text-foreground">{pendingDelete?.title}</strong>?
          This removes it from your local instructor catalog. Any local student
          enrollments for this course will also be cleared so learning data stays
          consistent.
        </p>
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setPendingDelete(null)}
          >
            Cancel
          </Button>
          <Button className="flex-1" variant="danger" onClick={confirmDelete}>
            Delete course
          </Button>
        </div>
      </Modal>

      <Toast
        open={toastOpen}
        message={toastMessage}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}
