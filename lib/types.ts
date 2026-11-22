export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type PriceType = "free" | "paid";

export type CourseStatus = "published" | "draft";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  color: string;
  subcategories: string[];
}

export interface Instructor {
  id: string;
  slug: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  studentCount: number;
  yearsExperience: number;
  specialties: string[];
  expertiseCategoryIds: string[];
  social?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface Lesson {
  id: string;
  title: string;
  duration: number;
  type: "video" | "article" | "quiz";
  isPreview?: boolean;
  completed?: boolean;
}

export interface CurriculumSection {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Review {
  id: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  date: string;
  comment: string;
  isDemo?: boolean;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  previewImage: string;
  categoryId: string;
  subcategory: string;
  instructorId: string;
  level: Difficulty;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  duration: number;
  lessonCount: number;
  language: string;
  lastUpdated: string;
  publishedAt: string;
  status: CourseStatus;
  featured?: boolean;
  popular?: boolean;
  trending?: boolean;
  bestseller?: boolean;
  learningOutcomes: string[];
  requirements: string[];
  curriculum: CurriculumSection[];
  reviews: Review[];
  tags: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  course: string;
  isDemo: true;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface StudentEnrollment {
  courseId: string;
  progress: number;
  lastAccessed: string;
  completedLessons: string[];
  status: "in-progress" | "completed" | "not-started";
}

export interface Certificate {
  id: string;
  courseId: string;
  issuedAt: string;
  credentialId: string;
}

export interface ActivityItem {
  id: string;
  type: "lesson" | "quiz" | "certificate" | "enrollment";
  title: string;
  description: string;
  date: string;
  courseId?: string;
}

export interface InstructorStats {
  totalStudents: number;
  totalRevenue: number;
  avgRating: number;
  activeCourses: number;
  monthlyEarnings: { month: string; amount: number }[];
}

export type CourseSortKey =
  | "recommended"
  | "newest"
  | "price-low"
  | "price-high"
  | "rating";

export type InstructorSortKey = "recommended" | "rating" | "experience";

export interface CourseFilters {
  q: string;
  category: string;
  subcategory: string;
  instructor: string;
  level: Difficulty | "all";
  minPrice: string;
  maxPrice: string;
  rating: "all" | "4+" | "4.5+";
  priceType: "all" | "free" | "paid";
  featured: boolean;
  trending: boolean;
  sort: CourseSortKey;
  view: "grid" | "list";
}
