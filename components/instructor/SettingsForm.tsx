"use client";

import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { useInstructorStore } from "@/hooks/useInstructorStore";
import { useState } from "react";

export function SettingsForm() {
  const { ready, settings, saveSettings } = useInstructorStore();
  const [values, setValues] = useState(settings);
  const [toastOpen, setToastOpen] = useState(false);
  const [settingsSource, setSettingsSource] = useState(settings);

  if (settings !== settingsSource) {
    setSettingsSource(settings);
    setValues(settings);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    saveSettings(values);
    setToastOpen(true);
  };

  if (!ready) {
    return <div className="h-40 animate-pulse rounded-xl border border-border bg-white" />;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
        <label className="flex items-start gap-3 rounded-xl border border-border bg-white p-4">
          <input
            type="checkbox"
            className="mt-1 accent-primary"
            checked={values.emailNotifications}
            onChange={(e) =>
              setValues({ ...values, emailNotifications: e.target.checked })
            }
          />
          <span className="text-sm text-foreground">
            Email notifications for enrollments and course activity (demo preference).
          </span>
        </label>
        <label className="flex items-start gap-3 rounded-xl border border-border bg-white p-4">
          <input
            type="checkbox"
            className="mt-1 accent-primary"
            checked={values.marketingEmails}
            onChange={(e) =>
              setValues({ ...values, marketingEmails: e.target.checked })
            }
          />
          <span className="text-sm text-foreground">
            Product tips and marketing emails (demo preference).
          </span>
        </label>
        <label className="flex items-start gap-3 rounded-xl border border-border bg-white p-4">
          <input
            type="checkbox"
            className="mt-1 accent-primary"
            checked={values.showProfilePublicly}
            onChange={(e) =>
              setValues({ ...values, showProfilePublicly: e.target.checked })
            }
          />
          <span className="text-sm text-foreground">
            Show my instructor profile publicly when linked from courses.
          </span>
        </label>
        <Select
          name="defaultCourseVisibility"
          label="Default visibility for new courses"
          value={values.defaultCourseVisibility}
          onChange={(e) =>
            setValues({
              ...values,
              defaultCourseVisibility: e.target.value as "draft" | "published",
            })
          }
          options={[
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
          ]}
        />
        <Button type="submit">Save settings</Button>
        <p className="text-xs text-muted">
          Preferences are stored in localStorage for this portfolio demo only.
        </p>
      </form>
      <Toast
        open={toastOpen}
        message="Settings saved in this browser."
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}
