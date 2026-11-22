import { courses as seedCourses, getAllLessons } from "@/lib/data/courses";
import { currentInstructor } from "@/lib/data/instructor-dashboard";
import { getInstructorById } from "@/lib/data/instructors";
import {
  DEMO_INSTRUCTOR_ID,
  INSTRUCTOR_STORAGE_KEY,
  type InstructorProfileData,
  type InstructorSettingsData,
  type InstructorStore,
} from "@/lib/instructor/types";
import type { Course, CurriculumSection, Difficulty } from "@/lib/types";

function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function defaultInstructorProfile(): InstructorProfileData {
  const seed = getInstructorById(DEMO_INSTRUCTOR_ID);
  return {
    name: currentInstructor.name,
    email: currentInstructor.email,
    title: currentInstructor.title,
    bio: currentInstructor.bio,
    location: currentInstructor.location,
    avatar: currentInstructor.avatar,
    specialties: seed?.specialties ?? ["React", "Next.js", "TypeScript"],
    website: seed?.social?.website ?? "",
    linkedin: seed?.social?.linkedin ?? "",
    twitter: seed?.social?.twitter ?? "",
  };
}

export function defaultInstructorSettings(): InstructorSettingsData {
  return {
    emailNotifications: true,
    marketingEmails: false,
    showProfilePublicly: true,
    defaultCourseVisibility: "draft",
  };
}

export function emptyInstructorStore(): InstructorStore {
  return {
    version: 1,
    profile: defaultInstructorProfile(),
    settings: defaultInstructorSettings(),
    customCourses: [],
    overrides: {},
    deletedCourseIds: [],
  };
}

function isCourse(value: unknown): value is Course {
  if (!value || typeof value !== "object") return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === "string" &&
    typeof c.slug === "string" &&
    typeof c.title === "string" &&
    typeof c.instructorId === "string" &&
    Array.isArray(c.curriculum) &&
    (c.status === "published" || c.status === "draft")
  );
}

function sanitizeStore(raw: unknown): InstructorStore {
  const base = emptyInstructorStore();
  if (!raw || typeof raw !== "object") return base;
  const data = raw as Record<string, unknown>;
  if (data.version !== 1) return base;

  const profile =
    data.profile && typeof data.profile === "object"
      ? { ...base.profile, ...(data.profile as InstructorProfileData) }
      : base.profile;
  const settings =
    data.settings && typeof data.settings === "object"
      ? { ...base.settings, ...(data.settings as InstructorSettingsData) }
      : base.settings;

  const customCourses = Array.isArray(data.customCourses)
    ? data.customCourses.filter(isCourse)
    : [];
  const overrides: Record<string, Course> = {};
  if (data.overrides && typeof data.overrides === "object") {
    for (const [id, course] of Object.entries(
      data.overrides as Record<string, unknown>,
    )) {
      if (isCourse(course)) overrides[id] = course;
    }
  }
  const deletedCourseIds = Array.isArray(data.deletedCourseIds)
    ? data.deletedCourseIds.filter((id): id is string => typeof id === "string")
    : [];

  return {
    version: 1,
    profile,
    settings,
    customCourses,
    overrides,
    deletedCourseIds,
  };
}

export function readInstructorStore(): InstructorStore {
  if (typeof window === "undefined") return emptyInstructorStore();
  try {
    const raw = window.localStorage.getItem(INSTRUCTOR_STORAGE_KEY);
    if (!raw) return emptyInstructorStore();
    return sanitizeStore(JSON.parse(raw));
  } catch {
    return emptyInstructorStore();
  }
}

export function writeInstructorStore(store: InstructorStore) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      INSTRUCTOR_STORAGE_KEY,
      JSON.stringify(sanitizeStore(store)),
    );
    window.dispatchEvent(new Event("learnsphere-instructor-updated"));
  } catch {
    // Ignore quota errors in demo mode.
  }
}

export function mergeCourseCatalog(
  store: InstructorStore = readInstructorStore(),
  seed: Course[] = seedCourses,
): Course[] {
  const deleted = new Set(store.deletedCourseIds);
  const merged = seed
    .filter((course) => !deleted.has(course.id))
    .map((course) => store.overrides[course.id] ?? course);

  const seedIds = new Set(seed.map((course) => course.id));
  const customs = store.customCourses.filter(
    (course) => !deleted.has(course.id) && !seedIds.has(course.id),
  );

  return [...merged, ...customs];
}

export function getInstructorOwnedCourses(
  store: InstructorStore = readInstructorStore(),
  instructorId = DEMO_INSTRUCTOR_ID,
) {
  return mergeCourseCatalog(store).filter(
    (course) => course.instructorId === instructorId,
  );
}

export function resolveCourseById(
  id: string,
  store?: InstructorStore,
): Course | undefined {
  const catalog =
    typeof window === "undefined" && !store
      ? seedCourses
      : mergeCourseCatalog(store ?? readInstructorStore());
  return catalog.find((course) => course.id === id);
}

export function resolveCourseBySlug(
  slug: string,
  store?: InstructorStore,
): Course | undefined {
  const catalog =
    typeof window === "undefined" && !store
      ? seedCourses
      : mergeCourseCatalog(store ?? readInstructorStore());
  return catalog.find((course) => course.slug === slug);
}

export function resolvePublishedCourses(store?: InstructorStore) {
  const catalog =
    typeof window === "undefined" && !store
      ? seedCourses
      : mergeCourseCatalog(store ?? readInstructorStore());
  return catalog.filter((course) => course.status === "published");
}

export function slugifyTitle(title: string) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return base || "course";
}

export function ensureUniqueSlug(
  slug: string,
  store: InstructorStore,
  excludeId?: string,
) {
  const catalog = mergeCourseCatalog(store);
  let candidate = slug;
  let i = 2;
  while (
    catalog.some(
      (course) => course.slug === candidate && course.id !== excludeId,
    )
  ) {
    candidate = `${slug}-${i}`;
    i += 1;
  }
  return candidate;
}

export function createEmptyCurriculum(courseId: string): CurriculumSection[] {
  return [
    {
      id: `${courseId}-s1`,
      title: "Getting started",
      lessons: [
        {
          id: `${courseId}-s1-l1`,
          title: "Welcome",
          duration: 8,
          type: "video",
          isPreview: true,
        },
      ],
    },
  ];
}

export function normalizeCurriculum(
  courseId: string,
  sections: CurriculumSection[],
): CurriculumSection[] {
  return sections.map((section, sIdx) => {
    const sectionId = section.id || `${courseId}-s${sIdx + 1}`;
    return {
      id: sectionId,
      title: section.title.trim() || `Section ${sIdx + 1}`,
      lessons: section.lessons.map((lesson, lIdx) => ({
        id: lesson.id || `${sectionId}-l${lIdx + 1}`,
        title: lesson.title.trim() || `Lesson ${lIdx + 1}`,
        duration: Math.max(1, Number(lesson.duration) || 5),
        type: lesson.type || "video",
        isPreview: Boolean(lesson.isPreview),
      })),
    };
  });
}

export interface CourseInput {
  title: string;
  subtitle: string;
  description: string;
  categoryId: string;
  subcategory: string;
  thumbnail: string;
  level: Difficulty;
  price: number;
  duration: number;
  learningOutcomes: string[];
  requirements: string[];
  curriculum: CurriculumSection[];
  status: "draft" | "published";
  tags?: string[];
}

export function buildCourseFromInput(
  input: CourseInput,
  options: { id?: string; slug?: string; existing?: Course },
  store: InstructorStore,
): Course {
  const id = options.id ?? `crs-local-${Date.now()}`;
  const slug = ensureUniqueSlug(
    options.slug ?? slugifyTitle(input.title),
    store,
    id,
  );
  const curriculum = normalizeCurriculum(id, input.curriculum);
  const lessons = curriculum.flatMap((section) => section.lessons);
  const duration =
    input.duration > 0
      ? input.duration
      : lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
  const today = todayIso();
  const existing = options.existing;

  return {
    id,
    slug,
    title: input.title.trim(),
    subtitle: input.subtitle.trim(),
    description: input.description.trim(),
    thumbnail:
      input.thumbnail.trim() ||
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&fit=crop",
    previewImage:
      existing?.previewImage ||
      input.thumbnail.trim() ||
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&fit=crop",
    categoryId: input.categoryId,
    subcategory: input.subcategory,
    instructorId: DEMO_INSTRUCTOR_ID,
    level: input.level,
    price: Math.max(0, input.price),
    rating: existing?.rating ?? 0,
    reviewCount: existing?.reviewCount ?? 0,
    studentCount: existing?.studentCount ?? 0,
    duration,
    lessonCount: lessons.length,
    language: existing?.language ?? "English",
    lastUpdated: today,
    publishedAt: existing?.publishedAt ?? today,
    status: input.status,
    featured: existing?.featured,
    popular: existing?.popular,
    trending: existing?.trending,
    bestseller: existing?.bestseller,
    learningOutcomes: input.learningOutcomes
      .map((item) => item.trim())
      .filter(Boolean),
    requirements: input.requirements.map((item) => item.trim()).filter(Boolean),
    curriculum,
    reviews: existing?.reviews ?? [],
    tags: input.tags?.length
      ? input.tags
      : existing?.tags ?? [input.subcategory || "Course"],
  };
}

export function saveCourse(
  course: Course,
  store: InstructorStore = readInstructorStore(),
): InstructorStore {
  const seedIds = new Set(seedCourses.map((item) => item.id));
  let next: InstructorStore;

  if (seedIds.has(course.id)) {
    next = {
      ...store,
      overrides: { ...store.overrides, [course.id]: course },
      deletedCourseIds: store.deletedCourseIds.filter((id) => id !== course.id),
    };
  } else {
    const exists = store.customCourses.some((item) => item.id === course.id);
    next = {
      ...store,
      customCourses: exists
        ? store.customCourses.map((item) =>
            item.id === course.id ? course : item,
          )
        : [course, ...store.customCourses],
      deletedCourseIds: store.deletedCourseIds.filter((id) => id !== course.id),
    };
  }

  writeInstructorStore(next);
  return next;
}

export function setCourseStatus(
  courseId: string,
  status: "draft" | "published",
  store: InstructorStore = readInstructorStore(),
): InstructorStore {
  const course = resolveCourseById(courseId, store);
  if (!course || course.instructorId !== DEMO_INSTRUCTOR_ID) return store;
  return saveCourse(
    {
      ...course,
      status,
      lastUpdated: todayIso(),
      publishedAt: status === "published" ? todayIso() : course.publishedAt,
    },
    store,
  );
}

/** Deletes a course from the instructor catalog. Clears matching local enrollments. */
export function deleteCourse(
  courseId: string,
  store: InstructorStore = readInstructorStore(),
): InstructorStore {
  const seedIds = new Set(seedCourses.map((item) => item.id));
  const next: InstructorStore = {
    ...store,
    customCourses: store.customCourses.filter((item) => item.id !== courseId),
    overrides: Object.fromEntries(
      Object.entries(store.overrides).filter(([id]) => id !== courseId),
    ),
    deletedCourseIds: seedIds.has(courseId)
      ? Array.from(new Set([...store.deletedCourseIds, courseId]))
      : store.deletedCourseIds.filter((id) => id !== courseId),
  };
  writeInstructorStore(next);

  // Keep learning + engagement data consistent when a course is removed.
  if (typeof window !== "undefined") {
    void import("@/lib/learning/storage").then(({ removeEnrollmentsForCourse }) => {
      removeEnrollmentsForCourse(courseId);
    });
    void import("@/lib/engagement/storage").then(({ removeEngagementForCourse }) => {
      removeEngagementForCourse(courseId);
    });
  }

  return next;
}

export function saveInstructorProfile(
  profile: InstructorProfileData,
  store: InstructorStore = readInstructorStore(),
) {
  const next = { ...store, profile };
  writeInstructorStore(next);
  return next;
}

export function saveInstructorSettings(
  settings: InstructorSettingsData,
  store: InstructorStore = readInstructorStore(),
) {
  const next = { ...store, settings };
  writeInstructorStore(next);
  return next;
}

export function getCourseLessonCount(course: Course) {
  return getAllLessons(course).length;
}
