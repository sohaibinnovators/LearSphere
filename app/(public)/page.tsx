import { CategoryCard } from "@/components/course/CategoryCard";
import { CourseCard } from "@/components/course/CourseCard";
import { InstructorCard } from "@/components/course/InstructorCard";
import { HeroSearch } from "@/components/home/HeroSearch";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatsCard } from "@/components/ui/StatsCard";
import {
  benefits,
  categories,
  getCategoryCourseCount,
  getFeaturedCourses,
  getPopularCourses,
  getTopInstructors,
  getTrendingCourses,
  howItWorks,
  platformStats,
  testimonials,
  whyChoose,
} from "@/lib/data";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import Image from "next/image";
const whyIcons = [GraduationCap, Target, BookOpen, Sparkles] as const;
const benefitIcons = [BookOpen, Users, Sparkles] as const;

export default function HomePage() {
  const featured = getFeaturedCourses(4);
  const trending = getTrendingCourses(4);
  const popular = getPopularCourses(3);
  const topInstructors = getTopInstructors(4);
  const popularCategories = [...categories]
    .sort(
      (a, b) =>
        getCategoryCourseCount(b.id) - getCategoryCourseCount(a.id),
    )
    .slice(0, 6);

  return (
    <>
      <section className="relative min-h-[78vh] overflow-hidden border-b border-border">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1800&h=1200&fit=crop"
          alt="Students collaborating in a modern learning space"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(248,250,252,0.96)_0%,rgba(248,250,252,0.88)_42%,rgba(248,250,252,0.45)_70%,rgba(23,32,51,0.25)_100%)]" />
        <div className="container-ls relative flex min-h-[78vh] items-center py-16 md:py-24">
          <div className="max-w-2xl animate-fade-up">
            <p className="font-display text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              LearnSphere
            </p>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Learn Today. Lead Tomorrow.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Expert-led courses, structured paths, and a calm interface built
              for serious learning.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/courses" size="lg">
                Explore courses
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/instructor" variant="outline" size="lg">
                Become instructor
              </Button>
            </div>
            <div className="mt-10 max-w-xl animate-fade-up-delay">
              <HeroSearch />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="container-ls">
          <SectionHeader
            eyebrow="Categories"
            title="Popular categories"
            description="Explore in-demand skills across technology, design, and business."
            action={
              <Button variant="ghost" href="/categories">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popularCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-14 md:py-16">
        <div className="container-ls">
          <SectionHeader
            eyebrow="Featured"
            title="Featured courses"
            description="Hand-picked programs with portfolio-ready outcomes."
            action={
              <Button variant="ghost" href="/courses">
                Browse catalog
              </Button>
            }
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="container-ls">
          <SectionHeader
            eyebrow="Trending"
            title="Trending now"
            description="What learners are enrolling in this week (demo data)."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trending.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-14 md:py-16">
        <div className="container-ls">
          <SectionHeader
            eyebrow="Popular"
            title="Most enrolled courses"
            description="Structured paths trusted by thousands of demo learners."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {popular.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="container-ls">
          <SectionHeader
            eyebrow="Instructors"
            title="Top instructors"
            description="Learn from practitioners who ship products and lead teams."
            action={
              <Button variant="ghost" href="/instructors">
                Meet all instructors
              </Button>
            }
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topInstructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface/50 py-14 md:py-16">
        <div className="container-ls">
          <SectionHeader
            align="center"
            eyebrow="Why LearnSphere"
            title="Why learners choose us"
            description="Purpose-built for clarity, depth, and career momentum."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map((item, index) => {
              const Icon = whyIcons[index] ?? Sparkles;
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-border bg-white p-6 shadow-[var(--shadow-sm)]"
                >
                  <span className="inline-flex rounded-lg bg-primary/10 p-2.5 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="container-ls">
          <SectionHeader
            align="center"
            eyebrow="Process"
            title="How it works"
            description="Four steps from discovery to measurable growth."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step) => (
              <div
                key={step.step}
                className="relative rounded-xl border border-border bg-white p-6"
              >
                <span className="text-sm font-semibold text-secondary-dark">
                  {step.step}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-14 md:py-16">
        <div className="container-ls">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                eyebrow="Benefits"
                title="Built for serious learners"
                description="Premium UI with mock progress today — real enrollment flows in later phases."
              />
              <div className="space-y-4">
                {benefits.map((item, index) => {
                  const Icon = benefitIcons[index] ?? Sparkles;
                  return (
                    <div key={item.title} className="flex gap-4">
                      <span className="mt-0.5 rounded-lg bg-secondary/10 p-2 text-secondary-dark">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <h3 className="font-medium text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {platformStats.map((stat) => (
                <StatsCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  hint={stat.note}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="container-ls">
          <SectionHeader
            align="center"
            eyebrow="Testimonials"
            title="Learner stories"
            description="Illustrative quotes for this portfolio demo — marked as demo content."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote
                key={item.id}
                className="flex h-full flex-col rounded-xl border border-border bg-white p-6 shadow-[var(--shadow-sm)]"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Demo testimonial
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <span className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted">
                      {item.role} · {item.course}
                    </p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-primary py-16 text-white">
        <div className="container-ls text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Start learning on LearnSphere today
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Join a focused platform designed for discovery, depth, and career-ready skills.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/courses" variant="secondary" size="lg">
              Explore courses
            </Button>
            <Button
              href="/signup"
              size="lg"
              className="border border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              Create free account
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}