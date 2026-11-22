import { CertificateDetailClient } from "@/app/student/certificates/[id]/CertificateDetailClient";
import { Suspense } from "react";

async function CertificateDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CertificateDetailClient id={id} />;
}

export default function StudentCertificateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-muted">Loading certificate…</div>
      }
    >
      <CertificateDetailContent params={params} />
    </Suspense>
  );
}
