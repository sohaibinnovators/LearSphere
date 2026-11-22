import { getCategoryCourseCount } from "@/lib/data/courses";
import type { Category } from "@/lib/types";
import {
  Brain,
  Briefcase,
  Camera,
  Code2,
  LineChart,
  Megaphone,
  Palette,
  PenTool,
  Smartphone,
  Sparkles,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";

const icons: Record<string, LucideIcon> = {
  code: Code2,
  chart: LineChart,
  palette: Palette,
  briefcase: Briefcase,
  megaphone: Megaphone,
  smartphone: Smartphone,
  sparkles: Sparkles,
  terminal: Terminal,
  pen: PenTool,
  brain: Brain,
  camera: Camera,
};

export function CategoryCard({
  category,
  variant = "default",
}: {
  category: Category;
  variant?: "default" | "compact";
}) {
  const Icon = icons[category.icon] || Sparkles;
  const courseCount = getCategoryCourseCount(category.id);

  if (variant === "compact") {
    return (
      <Link
        href={`/categories/${category.slug}`}
        className="group flex items-center gap-3 rounded-xl border border-border bg-white p-4 transition hover:border-primary/30 hover:shadow-[var(--shadow-sm)]"
      >
        <span
          className="rounded-lg p-2.5 text-white"
          style={{ backgroundColor: category.color }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="font-medium text-foreground group-hover:text-primary">
            {category.name}
          </p>
          <p className="text-xs text-muted">{courseCount} courses</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block overflow-hidden rounded-xl border border-border bg-white shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)]"
    >
      <div className="relative aspect-[4/3]">
        <SafeImage
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width:768px) 100vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <div className="mb-2 inline-flex rounded-md bg-white/15 p-2 backdrop-blur-sm">
            <Icon className="h-4 w-4" />
          </div>
          <h3 className="font-semibold">{category.name}</h3>
          <p className="mt-1 text-sm text-white/80">{courseCount} courses</p>
        </div>
      </div>
    </Link>
  );
}
