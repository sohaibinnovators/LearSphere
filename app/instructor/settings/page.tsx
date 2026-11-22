"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DemoDataReset } from "@/components/demo/DemoDataReset";
import { SettingsForm } from "@/components/instructor/SettingsForm";
import { useInstructorStore } from "@/hooks/useInstructorStore";

export default function InstructorSettingsPage() {
  const { profile } = useInstructorStore();

  return (
    <>
      <DashboardHeader
        title="Settings"
        subtitle="Instructor preferences and local demo data controls."
        user={{
          name: profile.name,
          avatar: profile.avatar,
          role: "Instructor",
        }}
      />
      <div className="space-y-6 p-4 md:p-6">
        <div className="rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)] md:p-6">
          <SettingsForm />
        </div>
        <DemoDataReset redirectTo="/instructor" />
      </div>
    </>
  );
}
