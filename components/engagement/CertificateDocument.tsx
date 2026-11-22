"use client";

import { Button } from "@/components/ui/Button";
import type { LocalCertificate } from "@/lib/engagement/types";
import { Award, Printer } from "lucide-react";
import { formatStudentDate } from "@/app/student/utils";

export function CertificateDocument({
  certificate,
}: {
  certificate: LocalCertificate;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 print:hidden">
        <Button size="sm" type="button" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          Print / Save as PDF
        </Button>
        <Button
          size="sm"
          variant="outline"
          href={`/courses/${certificate.courseSlug}`}
        >
          View course
        </Button>
      </div>

      <article
        id="certificate-print-root"
        className="mx-auto max-w-3xl overflow-hidden rounded-xl border-2 border-primary/30 bg-white shadow-[var(--shadow-md)]"
        aria-label="Course completion certificate"
      >
        <div className="border-b border-primary/20 bg-gradient-to-r from-primary/10 via-white to-secondary/10 px-8 py-6 text-center">
          <div className="inline-flex items-center gap-2 text-primary">
            <Award className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">
              LearnSphere
            </span>
          </div>
          <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Certificate of Completion
          </h1>
          <p className="mt-2 text-sm text-muted">
            Local portfolio demo credential — not an accredited certificate
          </p>
        </div>

        <div className="space-y-6 px-8 py-10 text-center md:px-12">
          <p className="text-sm uppercase tracking-wide text-muted">
            This certifies that
          </p>
          <p className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            {certificate.studentName}
          </p>
          <p className="text-sm text-muted">has completed the course</p>
          <p className="text-xl font-semibold text-foreground md:text-2xl">
            {certificate.courseTitle}
          </p>
          <div className="mx-auto grid max-w-lg gap-6 pt-4 text-left sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">
                Instructor
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {certificate.instructorName}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">
                Completion date
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {formatStudentDate(certificate.issuedAt)}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs uppercase tracking-wide text-muted">
                Certificate reference
              </p>
              <p className="mt-1 font-mono text-sm font-medium text-foreground">
                {certificate.credentialId}
              </p>
            </div>
          </div>
        </div>
      </article>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #certificate-print-root, #certificate-print-root * { visibility: visible; }
          #certificate-print-root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
