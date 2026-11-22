"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useEngagementStore } from "@/hooks/useEngagementStore";
import { useLearningStore } from "@/hooks/useLearningStore";
import { currentStudent } from "@/lib/data/student";
import { Award, ExternalLink, Printer } from "lucide-react";
import { formatStudentDate } from "../utils";

export default function StudentCertificatesPage() {
  const { ready: learningReady, getEnrollment } = useLearningStore();
  const { ready, store } = useEngagementStore();

  const items = store.certificates.filter((cert) => {
    const enrollment = getEnrollment(cert.courseId);
    return enrollment?.status === "completed";
  });

  return (
    <>
      <DashboardHeader
        title="Certificates"
        subtitle="Local demo credentials earned when you complete enrolled courses in this browser."
        user={{
          name: currentStudent.name,
          avatar: currentStudent.avatar,
          role: currentStudent.role,
        }}
        showNotifications
      />

      <div className="p-4 md:p-6">
        {!ready || !learningReady ? (
          <div className="h-40 animate-pulse rounded-xl border border-border bg-white" />
        ) : items.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {items.map((cert) => (
              <article
                key={cert.id}
                className="overflow-hidden rounded-xl border border-border bg-white shadow-[var(--shadow-sm)]"
              >
                <div className="border-b border-border bg-gradient-to-r from-primary/10 via-white to-secondary/10 px-5 py-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Award className="h-5 w-5" />
                    <span className="text-sm font-semibold">
                      Certificate of completion
                    </span>
                  </div>
                </div>
                <div className="space-y-4 p-5 md:p-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {cert.courseTitle}
                    </h2>
                    <p className="mt-1 text-sm text-muted">{cert.studentName}</p>
                    <p className="mt-1 text-sm text-muted">
                      Instructor · {cert.instructorName}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="muted">ID · {cert.credentialId}</Badge>
                    <Badge tone="success">
                      Issued {formatStudentDate(cert.issuedAt)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted">
                    Portfolio demo only — not an accredited or verified
                    credential.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      href={`/student/certificates/${cert.id}`}
                      size="sm"
                    >
                      <Printer className="h-4 w-4" />
                      View & print
                    </Button>
                    <Button
                      href={`/courses/${cert.courseSlug}`}
                      size="sm"
                      variant="ghost"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View course
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-white p-10 text-center">
            <Award className="mx-auto h-10 w-10 text-muted" />
            <p className="mt-4 font-medium text-foreground">No certificates yet</p>
            <p className="mt-1 text-sm text-muted">
              Complete every lesson in an enrolled course to unlock a local demo
              certificate.
            </p>
            <Button href="/student/progress" className="mt-6" variant="outline">
              View progress
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
