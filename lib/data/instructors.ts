import type { Instructor } from "@/lib/types";

export const instructors: Instructor[] = [
  {
    id: "ins-1",
    slug: "elena-martinez",
    name: "Elena Martinez",
    title: "Senior Full-Stack Engineer",
    bio: "Elena has spent 12 years building product platforms at high-growth startups. She teaches practical web engineering with a focus on clean architecture, accessibility, and shipping real features.",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 1842,
    studentCount: 42800,
    yearsExperience: 12,
    specialties: ["React", "Next.js", "TypeScript", "System Design"],
    expertiseCategoryIds: ["cat-1", "cat-2"],
    social: {
      website: "https://example.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: "ins-2",
    slug: "james-okonkwo",
    name: "James Okonkwo",
    title: "Data Scientist & ML Educator",
    bio: "Former research scientist turned educator. James helps learners move from spreadsheets to production machine learning with clear mental models and hands-on projects.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 1267,
    studentCount: 31200,
    yearsExperience: 10,
    specialties: ["Python", "Machine Learning", "Statistics", "SQL"],
    expertiseCategoryIds: ["cat-7", "cat-8", "cat-2"],
  },
  {
    id: "ins-3",
    slug: "sophia-chen",
    name: "Sophia Chen",
    title: "Product Designer",
    bio: "Sophia leads design systems for consumer apps used by millions. Her courses emphasize research-backed UX decisions and polished visual craft.",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 2104,
    studentCount: 51900,
    yearsExperience: 11,
    specialties: ["Figma", "Design Systems", "UX Research", "Prototyping"],
    expertiseCategoryIds: ["cat-3", "cat-4"],
  },
  {
    id: "ins-4",
    slug: "marcus-reid",
    name: "Marcus Reid",
    title: "Cloud & Systems Architect",
    bio: "Marcus designs resilient infrastructure for enterprise teams. He teaches programming craft and platform practices that balance speed, security, and clarity.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 893,
    studentCount: 18400,
    yearsExperience: 14,
    specialties: ["Python", "Algorithms", "Architecture", "DevOps Basics"],
    expertiseCategoryIds: ["cat-2", "cat-1"],
  },
  {
    id: "ins-5",
    slug: "amira-hassan",
    name: "Amira Hassan",
    title: "Growth Marketing Lead",
    bio: "Amira has scaled B2B and consumer acquisition channels across three continents. She focuses on measurement, creative testing, and sustainable growth loops.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 1105,
    studentCount: 27600,
    yearsExperience: 9,
    specialties: ["SEO", "Content Strategy", "Analytics", "Paid Media"],
    expertiseCategoryIds: ["cat-5", "cat-6"],
  },
  {
    id: "ins-6",
    slug: "daniel-park",
    name: "Daniel Park",
    title: "Mobile Engineering Lead",
    bio: "Daniel ships native and cross-platform apps with a craft-first mindset. His teaching blends performance, design collaboration, and release discipline.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 742,
    studentCount: 15300,
    yearsExperience: 8,
    specialties: ["Swift", "Kotlin", "React Native", "App Architecture"],
    expertiseCategoryIds: ["cat-9", "cat-1"],
  },
  {
    id: "ins-7",
    slug: "nina-volkova",
    name: "Nina Volkova",
    title: "Brand & Visual Designer",
    bio: "Nina builds memorable brand systems for startups and cultural institutions. She teaches graphic design fundamentals that transfer cleanly into digital products.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 528,
    studentCount: 9800,
    yearsExperience: 7,
    specialties: ["Branding", "Typography", "Layout", "Adobe Suite"],
    expertiseCategoryIds: ["cat-4", "cat-3"],
  },
  {
    id: "ins-8",
    slug: "liam-foster",
    name: "Liam Foster",
    title: "Photographer & Visual Storyteller",
    bio: "Liam has photographed campaigns for travel and lifestyle brands for over a decade. His courses focus on light, composition, and editing that serves the story.",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 391,
    studentCount: 12400,
    yearsExperience: 13,
    specialties: ["Portrait", "Lighting", "Composition", "Lightroom"],
    expertiseCategoryIds: ["cat-10"],
  },
  {
    id: "ins-9",
    slug: "priya-desai",
    name: "Priya Desai",
    title: "AI Product Engineer",
    bio: "Priya builds applied AI features for productivity products. She teaches practical ML and generative AI workflows teams can ship responsibly.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 664,
    studentCount: 16750,
    yearsExperience: 6,
    specialties: ["Generative AI", "NLP", "ML Ops", "Python"],
    expertiseCategoryIds: ["cat-8", "cat-7", "cat-2"],
  },
];

export function getInstructorBySlug(slug: string) {
  return instructors.find((i) => i.slug === slug);
}

export function getInstructorById(id: string) {
  return instructors.find((i) => i.id === id);
}

export function getTopInstructors(limit = 4) {
  return [...instructors]
    .sort((a, b) => b.rating - a.rating || b.studentCount - a.studentCount)
    .slice(0, limit);
}
