"use client";

import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { useClientReady } from "@/hooks/useClientReady";
import {
  defaultStudentProfile,
  readStudentProfile,
  writeStudentProfile,
  type StudentProfileData,
} from "@/lib/student/profile";
import { Save } from "lucide-react";
import { useCallback, useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ProfileSettingsForm() {
  const ready = useClientReady();
  const stored = ready ? readStudentProfile() : defaultStudentProfile();
  const storedKey = JSON.stringify(stored);
  const [values, setValues] = useState<StudentProfileData>(stored);
  const [sourceKey, setSourceKey] = useState(storedKey);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastOpen, setToastOpen] = useState(false);

  if (storedKey !== sourceKey) {
    setSourceKey(storedKey);
    setValues(stored);
  }

  const validate = useCallback(() => {
    const next: Record<string, string> = {};
    if (!values.name.trim()) {
      next.name = "Name is required.";
    }
    if (!values.email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_PATTERN.test(values.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!values.headline.trim()) {
      next.headline = "Headline is required.";
    }
    if (values.bio.trim().length > 0 && values.bio.trim().length < 20) {
      next.bio = "Bio should be at least 20 characters if provided.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [values]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    const next = {
      name: values.name.trim(),
      email: values.email.trim(),
      headline: values.headline.trim(),
      bio: values.bio.trim(),
      location: values.location.trim(),
    };
    writeStudentProfile(next);
    setValues(next);
    setSourceKey(JSON.stringify(next));
    setToastOpen(true);
  }

  if (!ready) {
    return (
      <div className="h-64 max-w-2xl animate-pulse rounded-xl border border-border bg-white" />
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-5 rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)] md:p-6"
        noValidate
      >
        <p className="text-sm text-muted">
          Profile values are saved in this browser only and do not create a real
          account.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            name="name"
            label="Full name"
            value={values.name}
            onChange={(event) =>
              setValues((current) => ({ ...current, name: event.target.value }))
            }
            error={errors.name}
            autoComplete="name"
          />
          <Input
            name="email"
            type="email"
            label="Email"
            value={values.email}
            onChange={(event) =>
              setValues((current) => ({ ...current, email: event.target.value }))
            }
            error={errors.email}
            autoComplete="email"
          />
        </div>
        <Input
          name="headline"
          label="Headline"
          value={values.headline}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              headline: event.target.value,
            }))
          }
          error={errors.headline}
          hint="Shown on your learner profile."
        />
        <Textarea
          name="bio"
          label="Bio"
          value={values.bio}
          onChange={(event) =>
            setValues((current) => ({ ...current, bio: event.target.value }))
          }
          error={errors.bio}
        />
        <Input
          name="location"
          label="Location"
          value={values.location}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              location: event.target.value,
            }))
          }
        />
        <div className="flex flex-wrap gap-3 border-t border-border pt-5">
          <Button type="submit">
            <Save className="h-4 w-4" />
            Save changes
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setValues(defaultStudentProfile());
              setErrors({});
            }}
          >
            Restore defaults
          </Button>
        </div>
      </form>

      <Toast
        open={toastOpen}
        message="Profile saved in this browser (demo only)."
        tone="success"
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}
