import type { FaqItem, Testimonial } from "@/lib/types";

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    name: "Maya Thompson",
    role: "Frontend Developer",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    quote:
      "LearnSphere helped me move from tutorials to shipping real product features. The course structure is clear and the instructors feel world-class.",
    course: "Complete Next.js Mastery",
    isDemo: true,
  },
  {
    id: "t-2",
    name: "Owen Silva",
    role: "Data Analyst",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    quote:
      "I switched careers with confidence. The Python and SQL paths gave me portfolio projects I could explain in interviews.",
    course: "Python for Data Science",
    isDemo: true,
  },
  {
    id: "t-3",
    name: "Hannah Lee",
    role: "Product Designer",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    quote:
      "The design systems course changed how our team collaborates with engineering. Practical, polished, and immediately useful.",
    course: "Figma to Design Systems",
    isDemo: true,
  },
];

export const faqs: FaqItem[] = [
  {
    id: "faq-1",
    question: "What is LearnSphere?",
    answer:
      "LearnSphere is a modern learning platform that helps students discover expert-led courses and helps instructors share practical knowledge across technology, design, business, and more.",
    category: "General",
  },
  {
    id: "faq-2",
    question: "Are these courses self-paced?",
    answer:
      "Yes. In this portfolio demo you can enroll locally, open lessons, and track progress in your browser with localStorage.",
    category: "Learning",
  },
  {
    id: "faq-3",
    question: "Do I get a certificate?",
    answer:
      "Completing every lesson in an enrolled course unlocks a printable local demo certificate. It is not an accredited or verified credential.",
    category: "Certificates",
  },
  {
    id: "faq-4",
    question: "Can I become an instructor?",
    answer:
      "Yes — open the instructor dashboard to create, edit, publish, and manage demo courses stored in this browser.",
    category: "Instructors",
  },
  {
    id: "faq-5",
    question: "Is payment required?",
    answer:
      "Course pricing is shown for demonstration. No payment gateway is connected and no real charges are processed.",
    category: "Billing",
  },
  {
    id: "faq-6",
    question: "How do I contact support?",
    answer:
      "Use the Contact page to send a message. The form validates locally and shows a success toast without sending data to a server.",
    category: "Support",
  },
  {
    id: "faq-7",
    question: "Can I access courses on mobile?",
    answer:
      "Yes. The LearnSphere interface is fully responsive across desktop, tablet, and mobile layouts.",
    category: "General",
  },
  {
    id: "faq-8",
    question: "Is LearnSphere a real production LMS?",
    answer:
      "No. LearnSphere is a frontend portfolio demo with mock catalog data and browser localStorage persistence. It does not include a backend, real authentication, multi-user sync, or payments.",
    category: "General",
  },
];

export const platformStats = [
  { label: "Demo learners", value: "120K+", note: "Demo figure" },
  { label: "Expert courses", value: "850+", note: "Demo figure" },
  { label: "Instructors", value: "240+", note: "Demo figure" },
  { label: "Avg. satisfaction", value: "4.8/5", note: "Demo figure" },
];

export const whyChoose = [
  {
    title: "Expert-led curriculum",
    description:
      "Learn from practitioners who ship products, lead teams, and teach with clarity.",
  },
  {
    title: "Career-ready projects",
    description:
      "Every featured path emphasizes portfolio outcomes and practical decision-making.",
  },
  {
    title: "Flexible learning paths",
    description:
      "Move through beginner to advanced content with clear progress and structure.",
  },
  {
    title: "Community-minded design",
    description:
      "A calm, focused interface that keeps attention on learning—not clutter.",
  },
];

export const howItWorks = [
  {
    step: "01",
    title: "Discover",
    description: "Browse categories or search for skills aligned to your goals.",
  },
  {
    step: "02",
    title: "Enroll",
    description: "Choose a course and start from a structured curriculum path.",
  },
  {
    step: "03",
    title: "Practice",
    description: "Complete lessons, track progress, and apply concepts in projects.",
  },
  {
    step: "04",
    title: "Advance",
    description: "Build credentials and keep growing with recommended next courses.",
  },
];

export const benefits = [
  {
    title: "Structured learning",
    description: "Clear sections, lesson outcomes, and measurable progress.",
  },
  {
    title: "Instructor excellence",
    description: "Profiles, ratings, and teaching focus you can trust.",
  },
  {
    title: "Beautiful experience",
    description: "A premium educational interface designed for focus.",
  },
];
