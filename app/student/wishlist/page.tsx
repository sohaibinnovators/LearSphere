import { CourseCard } from "@/components/course/CourseCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { currentStudent, wishlistCourseIds } from "@/lib/data/student";
import { Heart } from "lucide-react";
import { getWishlistCourses } from "../utils";

export default function StudentWishlistPage() {
  const courses = getWishlistCourses();

  return (
    <>
      <DashboardHeader
        title="Wishlist"
        subtitle="Courses you saved for later — enroll when you're ready."
        user={{
          name: currentStudent.name,
          avatar: currentStudent.avatar,
          role: currentStudent.role,
        }}
        showNotifications
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm text-muted">
            <Heart className="h-4 w-4 text-danger" />
            {wishlistCourseIds.length} saved
          </span>
        }
      />

      <div className="p-4 md:p-6">
        {courses.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-white p-10 text-center">
            <Heart className="mx-auto h-10 w-10 text-muted" />
            <p className="mt-4 font-medium text-foreground">
              Your wishlist is empty
            </p>
            <p className="mt-1 text-sm text-muted">
              Explore the catalog and heart courses you want to take next.
            </p>
            <Button href="/courses" className="mt-6">
              Browse courses
            </Button>
          </div>
        )}
      </div>
    </>
  );
}