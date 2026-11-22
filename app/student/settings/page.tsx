import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DemoDataReset } from "@/components/demo/DemoDataReset";
import { currentStudent } from "@/lib/data/student";
import { ProfileSettingsForm } from "./ProfileSettingsForm";

export default function StudentSettingsPage() {
  return (
    <>
      <DashboardHeader
        title="Profile settings"
        subtitle="Update your learner profile and manage local demo data."
        user={{
          name: currentStudent.name,
          avatar: currentStudent.avatar,
          role: currentStudent.role,
        }}
        showNotifications
      />

      <div className="space-y-6 p-4 md:p-6">
        <ProfileSettingsForm />
        <DemoDataReset redirectTo="/student" />
      </div>
    </>
  );
}
