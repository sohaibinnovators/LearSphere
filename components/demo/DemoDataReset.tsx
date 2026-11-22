"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import { listDemoStorageKeys, resetAllDemoData } from "@/lib/demo/reset";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DemoDataReset({
  redirectTo = "/student",
}: {
  redirectTo?: string;
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const handleReset = () => {
    resetAllDemoData();
    setConfirmOpen(false);
    setToastOpen(true);
    router.refresh();
    window.setTimeout(() => {
      window.location.assign(redirectTo);
    }, 600);
  };

  return (
    <>
      <section className="max-w-2xl rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)] md:p-6">
        <h2 className="text-base font-semibold text-foreground">
          Reset demo data
        </h2>
        <p className="mt-2 text-sm text-muted">
          Clears enrollments, progress, reviews, certificates, bookmarks, notes,
          discussions, notifications, and instructor course edits stored in this
          browser. Seed catalog courses remain available.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-muted">
          {listDemoStorageKeys().map((key) => (
            <li key={key}>
              <code>{key}</code>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={() => setConfirmOpen(true)}
        >
          <RotateCcw className="h-4 w-4" />
          Reset local demo data
        </Button>
      </section>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Reset all local demo data?"
      >
        <p className="text-sm text-muted">
          This cannot be undone. Your browser will reload demo defaults for
          student learning and instructor course management.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setConfirmOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            className="flex-1"
            onClick={handleReset}
          >
            Reset data
          </Button>
        </div>
      </Modal>

      <Toast
        open={toastOpen}
        message="Local demo data cleared."
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}
