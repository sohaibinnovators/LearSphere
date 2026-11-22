"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CertificateDocument } from "@/components/engagement/CertificateDocument";
import { Button } from "@/components/ui/Button";
import { useEngagementStore } from "@/hooks/useEngagementStore";
import { useLearningStore } from "@/hooks/useLearningStore";
import { currentStudent } from "@/lib/data/student";

export function CertificateDetailClient({ id }: { id: string }) {
  const { ready: learningReady, getEnrollment } = useLearningStore();
  const { ready, store } = useEngagementStore();

  const certificate = store.certificates.find((item) => item.id === id) ?? null;
  const enrollment = certificate
    ? getEnrollment(certificate.courseId)
    : null;
  const available =
    Boolean(certificate) && enrollment?.status === "completed";

  return (
    <>
      <DashboardHeader
        title="Certificate"
        subtitle="Print or save this local demo credential as a PDF from your browser."
        user={{
          name: currentStudent.name,
          avatar: currentStudent.avatar,
          role: currentStudent.role,
        }}
        showNotifications
        actions={
          <Button href="/student/certificates" size="sm" variant="outline">
            All certificates
          </Button>
        }
      />

      <div className="p-4 md:p-6">
        {!ready || !learningReady ? (
          <div className="h-64 animate-pulse rounded-xl border border-border bg-white" />
        ) : !available || !certificate ? (
          <div className="rounded-xl border border-dashed border-border bg-white p-10 text-center">
            <p className="font-medium text-foreground">
              Certificate unavailable
            </p>
            <p className="mt-2 text-sm text-muted">
              This certificate is missing or the course is no longer marked
              complete in this browser.
            </p>
            <Button
              href="/student/certificates"
              className="mt-6"
              variant="outline"
            >
              Back to certificates
            </Button>
          </div>
        ) : (
          <CertificateDocument certificate={certificate} />
        )}
      </div>
    </>
  );
}
