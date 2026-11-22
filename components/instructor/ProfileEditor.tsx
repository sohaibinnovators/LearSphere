"use client";

import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { useInstructorStore } from "@/hooks/useInstructorStore";
import type { InstructorProfileData } from "@/lib/instructor/types";
import Image from "next/image";
import { useState } from "react";

export function ProfileEditor() {
  const { ready, profile, saveProfile } = useInstructorStore();
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<InstructorProfileData>(profile);
  const [toastOpen, setToastOpen] = useState(false);
  const [error, setError] = useState("");
  const [profileSource, setProfileSource] = useState(profile);

  if (!editing && profile !== profileSource) {
    setProfileSource(profile);
    setValues(profile);
  }

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    if (!values.name.trim() || !values.title.trim()) {
      setError("Name and professional title are required.");
      return;
    }
    setError("");
    saveProfile({
      ...values,
      name: values.name.trim(),
      title: values.title.trim(),
      bio: values.bio.trim(),
      specialties: values.specialties,
    });
    setEditing(false);
    setToastOpen(true);
  };

  if (!ready) {
    return <div className="h-48 animate-pulse rounded-xl border border-border bg-white" />;
  }

  if (!editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border border-border">
            <Image
              src={values.avatar}
              alt={values.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{values.name}</p>
            <p className="text-sm text-muted">{values.title}</p>
          </div>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          <ProfileField label="Email" value={values.email} />
          <ProfileField label="Location" value={values.location} />
          <ProfileField label="Bio" value={values.bio} className="sm:col-span-2" />
          <ProfileField
            label="Expertise"
            value={values.specialties.join(", ")}
            className="sm:col-span-2"
          />
          <ProfileField label="Website" value={values.website || "—"} />
          <ProfileField label="LinkedIn" value={values.linkedin || "—"} />
          <ProfileField label="Twitter / X" value={values.twitter || "—"} />
        </dl>
        <Button type="button" onClick={() => setEditing(true)}>
          Edit profile
        </Button>
        <Toast
          open={toastOpen}
          message="Profile saved in this browser."
          onClose={() => setToastOpen(false)}
        />
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSave} className="max-w-2xl space-y-5">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border">
            <Image
              src={values.avatar || profile.avatar}
              alt="Profile preview"
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <p className="text-sm text-muted">Avatar preview</p>
        </div>
        <Input
          label="Name"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        />
        <Input
          label="Professional title"
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
        />
        <Input
          label="Location"
          value={values.location}
          onChange={(e) => setValues({ ...values, location: e.target.value })}
        />
        <Input
          label="Profile image URL"
          value={values.avatar}
          onChange={(e) => setValues({ ...values, avatar: e.target.value })}
        />
        <Textarea
          label="Bio"
          value={values.bio}
          onChange={(e) => setValues({ ...values, bio: e.target.value })}
          rows={5}
        />
        <Input
          label="Expertise / skills"
          value={values.specialties.join(", ")}
          onChange={(e) =>
            setValues({
              ...values,
              specialties: e.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
          hint="Comma-separated skills"
        />
        <Input
          label="Website"
          value={values.website}
          onChange={(e) => setValues({ ...values, website: e.target.value })}
        />
        <Input
          label="LinkedIn"
          value={values.linkedin}
          onChange={(e) => setValues({ ...values, linkedin: e.target.value })}
        />
        <Input
          label="Twitter / X"
          value={values.twitter}
          onChange={(e) => setValues({ ...values, twitter: e.target.value })}
        />
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <div className="flex gap-3">
          <Button type="submit">Save profile</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setValues(profile);
              setEditing(false);
              setError("");
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
      <Toast
        open={toastOpen}
        message="Profile saved in this browser."
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}

function ProfileField({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}
