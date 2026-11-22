"use client";

import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { useInstructorStore } from "@/hooks/useInstructorStore";
import { categories } from "@/lib/data/categories";
import {
  buildCourseFromInput,
  createEmptyCurriculum,
} from "@/lib/instructor/storage";
import type { Course, CurriculumSection, Difficulty } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type CourseFormValues = {
  title: string;
  subtitle: string;
  description: string;
  categoryId: string;
  subcategory: string;
  thumbnail: string;
  level: Difficulty;
  price: string;
  duration: string;
  learningOutcomes: string;
  requirements: string;
  status: "draft" | "published";
  curriculum: CurriculumSection[];
};

const levels: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

function courseToValues(course?: Course): CourseFormValues {
  if (!course) {
    const categoryId = categories[0]?.id ?? "cat-1";
    const tempId = `crs-local-draft`;
    return {
      title: "",
      subtitle: "",
      description: "",
      categoryId,
      subcategory: categories[0]?.subcategories[0] ?? "",
      thumbnail: "",
      level: "Intermediate",
      price: "0",
      duration: "60",
      learningOutcomes: "",
      requirements: "",
      status: "draft",
      curriculum: createEmptyCurriculum(tempId),
    };
  }

  return {
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    categoryId: course.categoryId,
    subcategory: course.subcategory,
    thumbnail: course.thumbnail,
    level: course.level,
    price: String(course.price),
    duration: String(course.duration),
    learningOutcomes: course.learningOutcomes.join("\n"),
    requirements: course.requirements.join("\n"),
    status: course.status,
    curriculum: course.curriculum,
  };
}

export function CourseForm({
  mode,
  course,
}: {
  mode: "create" | "edit";
  course?: Course;
}) {
  const router = useRouter();
  const { ready, store, saveCourse: persistCourse, settings } =
    useInstructorStore();
  const [values, setValues] = useState<CourseFormValues>(() =>
    courseToValues(course),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [appliedDefaultVisibility, setAppliedDefaultVisibility] = useState(
    mode !== "create" || Boolean(course),
  );
  if (
    ready &&
    mode === "create" &&
    !course &&
    !appliedDefaultVisibility
  ) {
    setAppliedDefaultVisibility(true);
    setValues((current) => ({
      ...current,
      status: settings.defaultCourseVisibility,
    }));
  }

  const selectedCategory = useMemo(
    () => categories.find((item) => item.id === values.categoryId),
    [values.categoryId],
  );

  const updateSection = (sectionIndex: number, patch: Partial<CurriculumSection>) => {
    setValues((current) => ({
      ...current,
      curriculum: current.curriculum.map((section, index) =>
        index === sectionIndex ? { ...section, ...patch } : section,
      ),
    }));
  };

  const updateLesson = (
    sectionIndex: number,
    lessonIndex: number,
    patch: Partial<CurriculumSection["lessons"][number]>,
  ) => {
    setValues((current) => ({
      ...current,
      curriculum: current.curriculum.map((section, sIdx) => {
        if (sIdx !== sectionIndex) return section;
        return {
          ...section,
          lessons: section.lessons.map((lesson, lIdx) =>
            lIdx === lessonIndex ? { ...lesson, ...patch } : lesson,
          ),
        };
      }),
    }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!values.title.trim()) next.title = "Title is required";
    if (!values.subtitle.trim()) next.subtitle = "Short description is required";
    if (values.description.trim().length < 40) {
      next.description = "Add a full description of at least 40 characters";
    }
    if (!values.categoryId) next.categoryId = "Choose a category";
    if (!values.subcategory) next.subcategory = "Choose a subcategory";
    const priceNum = Number(values.price);
    if (values.price === "" || Number.isNaN(priceNum) || priceNum < 0) {
      next.price = "Enter a valid price (0 for free)";
    }
    const durationNum = Number(values.duration);
    if (values.duration === "" || Number.isNaN(durationNum) || durationNum < 0) {
      next.duration = "Enter duration in minutes";
    }
    if (!values.learningOutcomes.trim()) {
      next.learningOutcomes = "Add at least one learning outcome";
    }
    if (values.curriculum.length === 0) {
      next.curriculum = "Add at least one section";
    }
    values.curriculum.forEach((section, index) => {
      if (!section.title.trim()) {
        next[`section-${index}`] = "Section title is required";
      }
      if (section.lessons.length === 0) {
        next[`section-lessons-${index}`] = "Add at least one lesson";
      }
      section.lessons.forEach((lesson, lessonIndex) => {
        if (!lesson.title.trim()) {
          next[`lesson-${index}-${lessonIndex}`] = "Lesson title is required";
        }
      });
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    const built = buildCourseFromInput(
      {
        title: values.title,
        subtitle: values.subtitle,
        description: values.description,
        categoryId: values.categoryId,
        subcategory: values.subcategory,
        thumbnail: values.thumbnail,
        level: values.level,
        price: Number(values.price),
        duration: Number(values.duration),
        learningOutcomes: values.learningOutcomes.split("\n"),
        requirements: values.requirements.split("\n"),
        curriculum: values.curriculum,
        status: values.status,
      },
      {
        id: course?.id,
        slug: course?.slug,
        existing: course,
      },
      store,
    );

    persistCourse(built);
    setToastMessage(
      mode === "create"
        ? `Course saved as ${built.status} in this browser.`
        : "Course updates saved in this browser.",
    );
    setToastOpen(true);
    window.setTimeout(() => {
      router.push("/instructor/courses");
    }, 900);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8">
        <section className="space-y-5 rounded-xl border border-border bg-white p-5">
          <h2 className="text-base font-semibold text-foreground">Basics</h2>
          <Input
            label="Course title"
            value={values.title}
            onChange={(e) => setValues({ ...values, title: e.target.value })}
            error={errors.title}
            placeholder="e.g. Complete Next.js Mastery"
          />
          <Input
            label="Short description"
            value={values.subtitle}
            onChange={(e) => setValues({ ...values, subtitle: e.target.value })}
            error={errors.subtitle}
          />
          <Textarea
            label="Full description"
            value={values.description}
            onChange={(e) =>
              setValues({ ...values, description: e.target.value })
            }
            error={errors.description}
            rows={5}
          />
          <Input
            label="Thumbnail image URL"
            value={values.thumbnail}
            onChange={(e) =>
              setValues({ ...values, thumbnail: e.target.value })
            }
            hint="Optional. Leave blank to use a default educational image."
            placeholder="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&fit=crop"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="Category"
              value={values.categoryId}
              onChange={(e) => {
                const category = categories.find((item) => item.id === e.target.value);
                setValues({
                  ...values,
                  categoryId: e.target.value,
                  subcategory: category?.subcategories[0] ?? "",
                });
              }}
              options={categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
            />
            <Select
              label="Subcategory"
              value={values.subcategory}
              onChange={(e) =>
                setValues({ ...values, subcategory: e.target.value })
              }
              options={(selectedCategory?.subcategories ?? []).map((sub) => ({
                value: sub,
                label: sub,
              }))}
            />
            <Select
              label="Difficulty"
              value={values.level}
              onChange={(e) =>
                setValues({
                  ...values,
                  level: e.target.value as Difficulty,
                })
              }
              options={levels.map((level) => ({ value: level, label: level }))}
            />
            <Input
              label="Price (USD)"
              type="number"
              min={0}
              value={values.price}
              onChange={(e) => setValues({ ...values, price: e.target.value })}
              error={errors.price}
              hint="Enter 0 for a free course"
            />
            <Input
              label="Duration (minutes)"
              type="number"
              min={0}
              value={values.duration}
              onChange={(e) =>
                setValues({ ...values, duration: e.target.value })
              }
              error={errors.duration}
            />
            <Select
              label="Status"
              value={values.status}
              onChange={(e) =>
                setValues({
                  ...values,
                  status: e.target.value as "draft" | "published",
                })
              }
              options={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
              ]}
            />
          </div>
        </section>

        <section className="space-y-5 rounded-xl border border-border bg-white p-5">
          <h2 className="text-base font-semibold text-foreground">
            Outcomes & requirements
          </h2>
          <Textarea
            label="Learning outcomes"
            value={values.learningOutcomes}
            onChange={(e) =>
              setValues({ ...values, learningOutcomes: e.target.value })
            }
            error={errors.learningOutcomes}
            hint="One outcome per line"
            rows={4}
          />
          <Textarea
            label="Requirements"
            value={values.requirements}
            onChange={(e) =>
              setValues({ ...values, requirements: e.target.value })
            }
            hint="One requirement per line"
            rows={3}
          />
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-foreground">
              Curriculum
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setValues((current) => ({
                  ...current,
                  curriculum: [
                    ...current.curriculum,
                    {
                      id: `section-${Date.now()}`,
                      title: `Section ${current.curriculum.length + 1}`,
                      lessons: [
                        {
                          id: `lesson-${Date.now()}`,
                          title: "New lesson",
                          duration: 10,
                          type: "video",
                        },
                      ],
                    },
                  ],
                }))
              }
            >
              <Plus className="h-4 w-4" />
              Add section
            </Button>
          </div>
          {errors.curriculum ? (
            <p className="text-xs text-danger">{errors.curriculum}</p>
          ) : null}

          <div className="space-y-4">
            {values.curriculum.map((section, sectionIndex) => (
              <div
                key={section.id}
                className="space-y-3 rounded-xl border border-border bg-surface/40 p-4"
              >
                <div className="flex flex-wrap items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <Input
                      label={`Section ${sectionIndex + 1} title`}
                      value={section.title}
                      onChange={(e) =>
                        updateSection(sectionIndex, { title: e.target.value })
                      }
                      error={errors[`section-${sectionIndex}`]}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-7 text-danger"
                    onClick={() =>
                      setValues((current) => ({
                        ...current,
                        curriculum: current.curriculum.filter(
                          (_, index) => index !== sectionIndex,
                        ),
                      }))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>

                <div className="space-y-3">
                  {section.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className="grid gap-3 rounded-lg border border-border bg-white p-3 md:grid-cols-[1fr_110px_140px_auto]"
                    >
                      <Input
                        label="Lesson title"
                        value={lesson.title}
                        onChange={(e) =>
                          updateLesson(sectionIndex, lessonIndex, {
                            title: e.target.value,
                          })
                        }
                        error={errors[`lesson-${sectionIndex}-${lessonIndex}`]}
                      />
                      <Input
                        label="Minutes"
                        type="number"
                        min={1}
                        value={String(lesson.duration)}
                        onChange={(e) =>
                          updateLesson(sectionIndex, lessonIndex, {
                            duration: Number(e.target.value) || 1,
                          })
                        }
                      />
                      <Select
                        label="Type"
                        value={lesson.type}
                        onChange={(e) =>
                          updateLesson(sectionIndex, lessonIndex, {
                            type: e.target.value as "video" | "article" | "quiz",
                          })
                        }
                        options={[
                          { value: "video", label: "Video" },
                          { value: "article", label: "Article" },
                          { value: "quiz", label: "Quiz" },
                        ]}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="md:mt-7"
                        onClick={() =>
                          updateSection(sectionIndex, {
                            lessons: section.lessons.filter(
                              (_, index) => index !== lessonIndex,
                            ),
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {errors[`section-lessons-${sectionIndex}`] ? (
                  <p className="text-xs text-danger">
                    {errors[`section-lessons-${sectionIndex}`]}
                  </p>
                ) : null}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateSection(sectionIndex, {
                      lessons: [
                        ...section.lessons,
                        {
                          id: `lesson-${Date.now()}`,
                          title: "New lesson",
                          duration: 10,
                          type: "video",
                        },
                      ],
                    })
                  }
                >
                  <Plus className="h-4 w-4" />
                  Add lesson
                </Button>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Button type="submit">
            {mode === "create" ? "Save course" : "Save changes"}
          </Button>
          <Button type="button" variant="outline" href="/instructor/courses">
            Cancel
          </Button>
        </div>
        <p className="text-xs text-muted">
          Demo persistence uses localStorage in this browser only — not a real
          multi-user LMS.
        </p>
      </form>
      <Toast
        open={toastOpen}
        message={toastMessage}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}
