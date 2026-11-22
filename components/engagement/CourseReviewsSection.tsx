"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { useEngagementStore } from "@/hooks/useEngagementStore";
import { useLearningStore } from "@/hooks/useLearningStore";
import { currentStudent } from "@/lib/data/student";
import type { Course, Review } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MessageSquareQuote, Star } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { formatStudentDate } from "@/app/student/utils";

type SortKey = "newest" | "highest" | "lowest";

export function CourseReviewsSection({ course }: { course: Course }) {
  const { ready: learningReady, getEnrollment } = useLearningStore();
  const {
    ready: engagementReady,
    getRatingStats,
    getStudentReview,
    submitReview,
    removeReview,
  } = useEngagementStore();

  const enrollment = getEnrollment(course.id);
  const canReview =
    learningReady &&
    engagementReady &&
    enrollment?.status === "completed";
  const ownReview = getStudentReview(course.id);
  const stats = getRatingStats(course);

  const [sort, setSort] = useState<SortKey>("newest");
  const [rating, setRating] = useState(ownReview?.rating ?? 5);
  const [comment, setComment] = useState(ownReview?.comment ?? "");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(!ownReview);

  const displayReviews = useMemo(() => {
    const seedItems = stats.seedReviews.map((review) => ({
      key: `seed-${review.id}`,
      kind: "seed" as const,
      review,
      sortDate: review.date,
      sortRating: review.rating,
    }));
    const localItems = stats.localReviews.map((review) => ({
      key: review.id,
      kind: "local" as const,
      review: {
        id: review.id,
        studentName: review.studentName,
        studentAvatar: review.studentAvatar,
        rating: review.rating,
        date: review.updatedAt.slice(0, 10),
        comment: review.comment,
        isDemo: true as const,
      } satisfies Review,
      sortDate: review.updatedAt,
      sortRating: review.rating,
      localId: review.id,
      studentId: review.studentId,
    }));

    const merged = [...localItems, ...seedItems];
    merged.sort((a, b) => {
      if (sort === "highest") return b.sortRating - a.sortRating;
      if (sort === "lowest") return a.sortRating - b.sortRating;
      return b.sortDate.localeCompare(a.sortDate);
    });
    return merged;
  }, [stats.localReviews, stats.seedReviews, sort]);

  const handleSubmit = () => {
    setError("");
    if (comment.trim().length < 10) {
      setError("Please write at least 10 characters of feedback.");
      return;
    }
    submitReview({
      courseId: course.id,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentAvatar: currentStudent.avatar,
      rating,
      comment,
    });
    setEditing(false);
  };

  return (
    <section className="py-12">
      <div className="container-ls space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Reviews & ratings
            </h2>
            <p className="mt-1 text-sm text-muted">
              Catalog sample reviews plus your local demo feedback. Not verified
              student testimonials.
            </p>
          </div>
          <Rating value={stats.rating} count={stats.reviewCount} size="md" />
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)]">
          {!canReview ? (
            <p className="text-sm text-muted">
              {enrollment
                ? "Finish every lesson in this enrolled course to leave a local demo review."
                : "Enroll and complete this course to leave a review in this browser demo."}
            </p>
          ) : ownReview && !editing ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-foreground">Your review</p>
                <Badge tone="muted">Local demo</Badge>
              </div>
              <Rating value={ownReview.rating} showValue size="md" />
              <p className="text-sm leading-relaxed text-foreground">
                {ownReview.comment}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setRating(ownReview.rating);
                    setComment(ownReview.comment);
                    setEditing(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  type="button"
                  onClick={() => removeReview(ownReview.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium text-foreground">
                {ownReview ? "Edit your review" : "Leave a review"}
              </p>
              <div className="flex gap-1" role="group" aria-label="Star rating">
                {Array.from({ length: 5 }).map((_, index) => {
                  const value = index + 1;
                  return (
                    <button
                      key={value}
                      type="button"
                      className="rounded p-1 hover:bg-surface"
                      aria-label={`${value} star${value === 1 ? "" : "s"}`}
                      aria-pressed={rating === value}
                      onClick={() => setRating(value)}
                    >
                      <Star
                        className={cn(
                          "h-5 w-5",
                          value <= rating
                            ? "fill-warning text-warning"
                            : "text-border",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={4}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Share what you learned (local demo only)…"
              />
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              <div className="flex flex-wrap gap-2">
                <Button size="sm" type="button" onClick={handleSubmit}>
                  {ownReview ? "Save changes" : "Submit review"}
                </Button>
                {ownReview ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    type="button"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            {displayReviews.length} review
            {displayReviews.length === 1 ? "" : "s"} shown
          </p>
          <label className="flex items-center gap-2 text-sm text-muted">
            Sort
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="rounded-lg border border-border bg-white px-2 py-1.5 text-sm text-foreground"
            >
              <option value="newest">Newest</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          </label>
        </div>

        {displayReviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white p-10 text-center">
            <MessageSquareQuote className="mx-auto h-8 w-8 text-muted" />
            <p className="mt-3 font-medium text-foreground">No reviews yet</p>
            <p className="mt-1 text-sm text-muted">
              Complete the course to add the first local demo review.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {displayReviews.map((item) => (
              <li
                key={item.key}
                className="rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="relative h-10 w-10 overflow-hidden rounded-full bg-surface">
                      <Image
                        src={item.review.studentAvatar}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </span>
                    <div>
                      <p className="font-medium text-foreground">
                        {item.review.studentName}
                      </p>
                      <p className="text-xs text-muted">
                        {formatStudentDate(item.review.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Rating value={item.review.rating} showValue />
                    <Badge tone="muted">
                      {item.kind === "local" ? "Your local demo" : "Sample demo"}
                    </Badge>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground">
                  {item.review.comment}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
