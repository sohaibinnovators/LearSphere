import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-sm font-medium text-secondary-dark">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-muted">
        The course, category, or instructor you requested is unavailable or the
        link is invalid.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/courses">Browse courses</Button>
        <Button href="/" variant="outline">
          Back home
        </Button>
      </div>
      <p className="mt-6 text-sm text-muted">
        Or explore{" "}
        <Link href="/categories" className="text-primary hover:underline">
          categories
        </Link>{" "}
        and{" "}
        <Link href="/instructors" className="text-primary hover:underline">
          instructors
        </Link>
        .
      </p>
    </div>
  );
}
