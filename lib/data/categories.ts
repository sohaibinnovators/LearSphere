import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "cat-1",
    slug: "web-development",
    name: "Web Development",
    description:
      "Build modern websites and applications with HTML, CSS, JavaScript, and frameworks.",
    icon: "code",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
    color: "#4F46E5",
    subcategories: ["Frontend", "Backend", "Full-Stack", "Frameworks"],
  },
  {
    id: "cat-2",
    slug: "programming",
    name: "Programming",
    description:
      "Strengthen core programming skills across languages, algorithms, and software craft.",
    icon: "terminal",
    image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop",
    color: "#6366F1",
    subcategories: ["JavaScript", "TypeScript", "Python", "Algorithms"],
  },
  {
    id: "cat-3",
    slug: "ui-ux-design",
    name: "UI/UX Design",
    description:
      "Craft beautiful, usable interfaces and end-to-end product experiences.",
    icon: "palette",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    color: "#0EA5E9",
    subcategories: ["UX Research", "Interface Design", "Design Systems", "Prototyping"],
  },
  {
    id: "cat-4",
    slug: "graphic-design",
    name: "Graphic Design",
    description:
      "Create visual identities, layouts, and brand assets with professional design craft.",
    icon: "pen",
    image:
      "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&h=600&fit=crop",
    color: "#EC4899",
    subcategories: ["Branding", "Typography", "Illustration", "Layout"],
  },
  {
    id: "cat-5",
    slug: "digital-marketing",
    name: "Digital Marketing",
    description:
      "Master SEO, content, social media, and growth campaigns that convert.",
    icon: "megaphone",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    color: "#14B8A6",
    subcategories: ["SEO", "Content", "Social Media", "Paid Ads"],
  },
  {
    id: "cat-6",
    slug: "business-entrepreneurship",
    name: "Business & Entrepreneurship",
    description:
      "Grow as a leader and founder with strategy, operations, and communication essentials.",
    icon: "briefcase",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    color: "#F59E0B",
    subcategories: ["Leadership", "Strategy", "Startups", "Operations"],
  },
  {
    id: "cat-7",
    slug: "data-science",
    name: "Data Science",
    description:
      "Analyze data, build models, and turn insights into decisions with Python and analytics.",
    icon: "chart",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    color: "#06B6D4",
    subcategories: ["Analytics", "SQL", "Visualization", "Statistics"],
  },
  {
    id: "cat-8",
    slug: "ai-machine-learning",
    name: "AI & Machine Learning",
    description:
      "Learn modern AI workflows from foundational ML to applied generative systems.",
    icon: "brain",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    color: "#8B5CF6",
    subcategories: ["Machine Learning", "Deep Learning", "NLP", "Generative AI"],
  },
  {
    id: "cat-9",
    slug: "mobile-app-development",
    name: "Mobile App Development",
    description:
      "Create polished iOS and Android apps with native and cross-platform tools.",
    icon: "smartphone",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
    color: "#3B82F6",
    subcategories: ["iOS", "Android", "React Native", "Flutter"],
  },
  {
    id: "cat-10",
    slug: "photography",
    name: "Photography",
    description:
      "Capture stronger images with composition, lighting, and post-production fundamentals.",
    icon: "camera",
    image:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop",
    color: "#64748B",
    subcategories: ["Portrait", "Landscape", "Lighting", "Editing"],
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string) {
  return categories.find((c) => c.id === id);
}
