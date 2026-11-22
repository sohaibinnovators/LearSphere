"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProfileEditor } from "@/components/instructor/ProfileEditor";
import { useInstructorStore } from "@/hooks/useInstructorStore";

export default function InstructorProfilePage() {
  const { profile } = useInstructorStore();

  return (
    <>
      <DashboardHeader
        title="Profile"
        subtitle="Edit how you appear as an instructor in this demo."
        user={{
          name: profile.name,
          avatar: profile.avatar,
          role: "Instructor",
        }}
      />
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)] md:p-6">
          <ProfileEditor />
        </div>
      </div>
    </>
  );
}
