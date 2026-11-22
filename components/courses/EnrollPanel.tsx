"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import { useLearningStore } from "@/hooks/useLearningStore";
import type { Course } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, PlayCircle, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";

export function EnrollPanel({ course }: { course: Course }) {
  const { ready, isEnrolled, getEnrollment, enroll, getContinueHref } =
    useLearningStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [justEnrolled, setJustEnrolled] = useState(false);

  const enrolled = ready && isEnrolled(course.id);
  const enrollment = getEnrollment(course.id);
  const continueHref = useMemo(() => {
    if (!enrollment) return `/learn/${course.slug}`;
    return getContinueHref(course, enrollment);
  }, [course, enrollment, getContinueHref]);

  const isFree = course.price === 0;

  const confirmEnroll = () => {
    const result = enroll(course);
    setModalOpen(false);
    setJustEnrolled(true);
    setToastMessage(
      result.created
        ? isFree
          ? "You're enrolled. Progress is saved in this browser (demo)."
          : "Simulated enrollment complete — no payment was processed."
        : "You're already enrolled in this course.",
    );
    setToastOpen(true);
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-white p-6 shadow-[var(--shadow-md)] lg:sticky lg:top-24">
        <p className="text-3xl font-semibold text-foreground">
          {formatPrice(course.price)}
        </p>
        {course.originalPrice ? (
          <p className="text-sm text-muted line-through">
            {formatPrice(course.originalPrice)}
          </p>
        ) : null}
        <p className="mt-2 text-sm text-muted">
          Full lifetime access · {course.lessonCount} lessons · Demo pricing only
        </p>

        {!ready ? (
          <div className="mt-6 h-12 animate-pulse rounded-lg bg-surface" />
        ) : enrolled ? (
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {justEnrolled ? "Enrollment confirmed" : "Already enrolled"}
            </div>
            {enrollment ? (
              <p className="text-sm text-muted">
                Progress {enrollment.progress}% · Enrolled{" "}
                {enrollment.enrolledAt}
              </p>
            ) : null}
            <Button size="lg" className="w-full" href={continueHref}>
              <PlayCircle className="h-4 w-4" />
              {justEnrolled ? "Start learning" : "Continue learning"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              href="/student/learning"
            >
              View in My Learning
            </Button>
          </div>
        ) : (
          <>
            <Button
              size="lg"
              className="mt-6 w-full"
              onClick={() => setModalOpen(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              {isFree ? "Enroll for free" : "Enroll now"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="mt-3 w-full"
              href="/student"
            >
              Go to student dashboard
            </Button>
          </>
        )}

        <p className="mt-4 text-center text-xs text-muted">
          Demo enrollment is stored in your browser with localStorage — not a
          real account or payment.
        </p>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isFree ? "Confirm free enrollment" : "Confirm demo enrollment"}
      >
        <p className="text-sm text-muted">
          You are enrolling in{" "}
          <strong className="text-foreground">{course.title}</strong>.
          {isFree
            ? " This free enrollment is saved locally in your browser."
            : ` Price shown: ${formatPrice(course.price)}. This is a simulated paid enrollment — no card details are collected and no payment is processed.`}
        </p>
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </Button>
          <Button className="flex-1" onClick={confirmEnroll}>
            {isFree ? "Enroll free" : "Complete demo enrollment"}
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
