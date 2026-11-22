import type { Course } from "@/lib/types";

const sharedCurriculum = (
  prefix: string,
  titles: [string, string[]][],
): Course["curriculum"] =>
  titles.map(([sectionTitle, lessons], sIdx) => ({
    id: `${prefix}-s${sIdx + 1}`,
    title: sectionTitle,
    lessons: lessons.map((title, lIdx) => ({
      id: `${prefix}-s${sIdx + 1}-l${lIdx + 1}`,
      title,
      duration: 8 + ((sIdx + lIdx) % 5) * 4,
      type: lIdx === lessons.length - 1 && lIdx > 0 ? "quiz" : "video",
      isPreview: sIdx === 0 && lIdx === 0,
    })),
  }));

const demoReview = (
  id: string,
  name: string,
  avatar: string,
  rating: number,
  date: string,
  comment: string,
) => ({
  id,
  studentName: name,
  studentAvatar: avatar,
  rating,
  date,
  comment: `Demo review — ${comment}`,
  isDemo: true as const,
});

export const courses: Course[] = [
  {
    id: "crs-1",
    slug: "complete-nextjs-mastery",
    title: "Complete Next.js Mastery",
    subtitle: "Build production-ready apps with the modern React framework.",
    description:
      "Learn to design, build, and ship scalable web applications with Next.js. This course covers routing, server components, data fetching, authentication patterns, and deployment best practices through a real product project.",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=800&fit=crop",
    categoryId: "cat-1",
    subcategory: "Frameworks",
    instructorId: "ins-1",
    level: "Intermediate",
    price: 89,
    originalPrice: 129,
    rating: 4.9,
    reviewCount: 2146,
    studentCount: 18420,
    duration: 1260,
    lessonCount: 84,
    language: "English",
    lastUpdated: "2026-10-12",
    publishedAt: "2025-11-02",
    status: "published",
    featured: true,
    popular: true,
    trending: true,
    bestseller: true,
    learningOutcomes: [
      "Architect Next.js apps with App Router and Server Components",
      "Implement authenticated flows and protected routes",
      "Optimize performance, caching, and image delivery",
      "Ship a complete SaaS-style product to production",
    ],
    requirements: [
      "Solid JavaScript fundamentals",
      "Basic React experience",
      "Familiarity with HTML and CSS",
    ],
    curriculum: sharedCurriculum("crs-1", [
      ["Foundations & Project Setup", ["Welcome & course roadmap", "Tooling and workspace setup", "App Router mental model"]],
      ["Building Interfaces", ["Layouts and nested routes", "Composable UI patterns", "Forms and validation"]],
      ["Data & State", ["Fetching on the server", "Mutations and optimistic UI", "Caching strategies"]],
      ["Production Ready", ["Auth patterns overview", "Observability basics", "Deploy and monitor"]],
    ]),
    reviews: [
      demoReview(
        "rev-1",
        "Priya Nair",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        5,
        "2026-09-18",
        "Clearest Next.js course I've taken. The project structure advice alone was worth it.",
      ),
      demoReview(
        "rev-2",
        "Tom Bradley",
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
        5,
        "2026-08-02",
        "Practical, current, and well paced. Great balance of theory and shipping.",
      ),
    ],
    tags: ["Next.js", "React", "TypeScript"],
  },
  {
    id: "crs-2",
    slug: "python-for-data-science",
    title: "Python for Data Science",
    subtitle: "From pandas to practical machine learning workflows.",
    description:
      "A hands-on path through Python data analysis. Work with real datasets, visualize insights, and build interpretable ML models you can explain to stakeholders.",
    thumbnail:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=800&fit=crop",
    categoryId: "cat-7",
    subcategory: "Analytics",
    instructorId: "ins-2",
    level: "Beginner",
    price: 79,
    originalPrice: 119,
    rating: 4.8,
    reviewCount: 1688,
    studentCount: 24150,
    duration: 1080,
    lessonCount: 72,
    language: "English",
    lastUpdated: "2026-09-28",
    publishedAt: "2025-08-14",
    status: "published",
    featured: true,
    popular: true,
    learningOutcomes: [
      "Clean and transform datasets with pandas",
      "Create clear visual analyses",
      "Train and evaluate baseline ML models",
      "Communicate findings with structured notebooks",
    ],
    requirements: ["No prior Python required", "Comfort with basic algebra"],
    curriculum: sharedCurriculum("crs-2", [
      ["Python Essentials", ["Environment setup", "Core syntax and data types", "Working with files"]],
      ["Data Wrangling", ["pandas DataFrames", "Cleaning messy data", "Feature engineering basics"]],
      ["Visualization & Modeling", ["Charts that explain", "Train/test workflows", "Model evaluation"]],
    ]),
    reviews: [
      demoReview(
        "rev-3",
        "Aisha Rahman",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        5,
        "2026-07-21",
        "Excellent for career switchers. Exercises feel realistic.",
      ),
    ],
    tags: ["Python", "Data Science", "Machine Learning"],
  },
  {
    id: "crs-3",
    slug: "figma-to-design-systems",
    title: "Figma to Design Systems",
    subtitle: "Design scalable UI systems teams actually adopt.",
    description:
      "Learn to create tokens, components, documentation, and governance practices that keep product UI consistent as teams grow.",
    thumbnail:
      "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1200&h=800&fit=crop",
    categoryId: "cat-3",
    subcategory: "Design Systems",
    instructorId: "ins-3",
    level: "Intermediate",
    price: 69,
    rating: 4.9,
    reviewCount: 1320,
    studentCount: 15680,
    duration: 720,
    lessonCount: 48,
    language: "English",
    lastUpdated: "2026-10-01",
    publishedAt: "2025-09-20",
    status: "published",
    featured: true,
    trending: true,
    bestseller: true,
    learningOutcomes: [
      "Structure Figma files for multi-product teams",
      "Build reusable component libraries",
      "Define design tokens and theming",
      "Partner effectively with engineering",
    ],
    requirements: ["Basic Figma experience", "Interest in product design"],
    curriculum: sharedCurriculum("crs-3", [
      ["System Foundations", ["Audit existing UI", "Token strategy", "Naming conventions"]],
      ["Component Craft", ["Atomic patterns", "Variants and states", "Accessibility checks"]],
      ["Adoption", ["Documentation", "Handoff workflows", "Governance rituals"]],
    ]),
    reviews: [
      demoReview(
        "rev-4",
        "Chris Nguyen",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
        5,
        "2026-06-14",
        "Immediately useful for our design org. Highly recommended.",
      ),
    ],
    tags: ["Figma", "Design Systems", "UX"],
  },
  {
    id: "crs-4",
    slug: "algorithms-for-working-developers",
    title: "Algorithms for Working Developers",
    subtitle: "Practical problem-solving patterns for real codebases.",
    description:
      "Strengthen algorithmic thinking without academic overwhelm. Focus on patterns you actually use in interviews and production systems.",
    thumbnail:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop",
    categoryId: "cat-2",
    subcategory: "Algorithms",
    instructorId: "ins-4",
    level: "Intermediate",
    price: 99,
    originalPrice: 149,
    rating: 4.7,
    reviewCount: 956,
    studentCount: 11240,
    duration: 960,
    lessonCount: 60,
    language: "English",
    lastUpdated: "2026-08-19",
    publishedAt: "2025-06-10",
    status: "published",
    popular: true,
    learningOutcomes: [
      "Apply common algorithm patterns confidently",
      "Analyze time and space trade-offs",
      "Practice structured interview solutions",
      "Refactor complex logic into clearer code",
    ],
    requirements: ["Comfortable with one programming language", "Basic data structures familiarity"],
    curriculum: sharedCurriculum("crs-4", [
      ["Foundations", ["Complexity basics", "Arrays and hashing", "Two-pointer patterns"]],
      ["Core Patterns", ["Trees and graphs intro", "Dynamic programming starters", "Greedy strategies"]],
      ["Applied Practice", ["Debugging approach", "Interview communication", "Portfolio problems"]],
    ]),
    reviews: [],
    tags: ["Algorithms", "Interview Prep", "Programming"],
  },
  {
    id: "crs-5",
    slug: "growth-marketing-playbook",
    title: "Growth Marketing Playbook",
    subtitle: "Build measurable acquisition engines for modern products.",
    description:
      "A practical framework for SEO, content, lifecycle, and paid experiments with clear measurement and iteration loops.",
    thumbnail:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=1200&h=800&fit=crop",
    categoryId: "cat-5",
    subcategory: "Paid Ads",
    instructorId: "ins-5",
    level: "Intermediate",
    price: 74,
    rating: 4.8,
    reviewCount: 804,
    studentCount: 9870,
    duration: 660,
    lessonCount: 42,
    language: "English",
    lastUpdated: "2026-09-05",
    publishedAt: "2025-07-22",
    status: "published",
    trending: true,
    learningOutcomes: [
      "Build a channel strategy aligned to stage",
      "Design experiments with clear success metrics",
      "Improve retention with lifecycle messaging",
      "Report growth impact to stakeholders",
    ],
    requirements: ["Basic analytics literacy", "Access to a product or side project helps"],
    curriculum: sharedCurriculum("crs-5", [
      ["Strategy", ["Growth model canvas", "North-star metrics", "Channel prioritization"]],
      ["Execution", ["SEO foundations", "Content systems", "Paid creative testing"]],
      ["Measurement", ["Attribution basics", "Dashboards", "Iteration cadence"]],
    ]),
    reviews: [],
    tags: ["Marketing", "Growth", "Analytics"],
  },
  {
    id: "crs-6",
    slug: "react-native-from-scratch",
    title: "React Native from Scratch",
    subtitle: "Ship polished cross-platform mobile apps.",
    description:
      "Learn React Native fundamentals, navigation, native modules awareness, and release workflows for iOS and Android.",
    thumbnail:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=800&fit=crop",
    categoryId: "cat-9",
    subcategory: "React Native",
    instructorId: "ins-6",
    level: "Intermediate",
    price: 84,
    rating: 4.7,
    reviewCount: 612,
    studentCount: 7640,
    duration: 900,
    lessonCount: 56,
    language: "English",
    lastUpdated: "2026-07-30",
    publishedAt: "2025-05-18",
    status: "published",
    learningOutcomes: [
      "Build navigable mobile app structures",
      "Manage offline-friendly state",
      "Style responsive mobile interfaces",
      "Prepare apps for store submission",
    ],
    requirements: ["JavaScript and React basics"],
    curriculum: sharedCurriculum("crs-6", [
      ["Mobile Foundations", ["Expo vs bare workflow", "Components and styling", "Navigation"]],
      ["App Features", ["Forms and validation", "API integration", "Push notifications overview"]],
      ["Release", ["Performance tips", "Testing strategy", "Store readiness"]],
    ]),
    reviews: [],
    tags: ["React Native", "Mobile", "JavaScript"],
  },
  {
    id: "crs-7",
    slug: "leadership-essentials",
    title: "Leadership Essentials",
    subtitle: "Lead teams with clarity, empathy, and accountability.",
    description:
      "Develop practical leadership skills for new managers and emerging leaders—feedback, prioritization, meetings, and team health.",
    thumbnail:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop",
    categoryId: "cat-6",
    subcategory: "Leadership",
    instructorId: "ins-5",
    level: "Beginner",
    price: 59,
    rating: 4.8,
    reviewCount: 540,
    studentCount: 13210,
    duration: 480,
    lessonCount: 32,
    language: "English",
    lastUpdated: "2026-06-22",
    publishedAt: "2025-04-08",
    status: "published",
    featured: true,
    learningOutcomes: [
      "Run effective 1:1s and team rituals",
      "Give feedback that improves performance",
      "Prioritize work across competing goals",
      "Build psychological safety on your team",
    ],
    requirements: ["No formal management experience required"],
    curriculum: sharedCurriculum("crs-7", [
      ["Mindset", ["From IC to leader", "Trust and credibility", "Personal operating system"]],
      ["Practice", ["Feedback conversations", "Meeting design", "Delegation"]],
    ]),
    reviews: [],
    tags: ["Leadership", "Management", "Soft Skills"],
  },
  {
    id: "crs-8",
    slug: "typescript-deep-dive",
    title: "TypeScript Deep Dive",
    subtitle: "Write safer, more expressive application code.",
    description:
      "Move beyond basic types into generics, utility types, narrowing, and architecture patterns used in large TypeScript codebases.",
    thumbnail:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop",
    categoryId: "cat-2",
    subcategory: "TypeScript",
    instructorId: "ins-1",
    level: "Advanced",
    price: 94,
    rating: 4.9,
    reviewCount: 1102,
    studentCount: 8940,
    duration: 780,
    lessonCount: 52,
    language: "English",
    lastUpdated: "2026-10-08",
    publishedAt: "2025-10-01",
    status: "published",
    popular: true,
    trending: true,
    bestseller: true,
    learningOutcomes: [
      "Model complex domains with TypeScript",
      "Use generics and conditional types effectively",
      "Improve DX with strict compiler settings",
      "Refactor large codebases safely",
    ],
    requirements: ["Comfortable with JavaScript and basic TypeScript"],
    curriculum: sharedCurriculum("crs-8", [
      ["Type System Power", ["Narrowing mastery", "Generics in practice", "Utility types"]],
      ["Architecture", ["API contracts", "Domain modeling", "Migration strategies"]],
    ]),
    reviews: [],
    tags: ["TypeScript", "JavaScript", "Architecture"],
  },
  {
    id: "crs-9",
    slug: "sql-analytics-bootcamp",
    title: "SQL Analytics Bootcamp",
    subtitle: "Answer business questions with confident SQL.",
    description:
      "Learn the SQL patterns analysts use daily—joins, window functions, cohort analysis, and clean reporting queries.",
    thumbnail:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?w=1200&h=800&fit=crop",
    categoryId: "cat-7",
    subcategory: "SQL",
    instructorId: "ins-2",
    level: "Beginner",
    price: 0,
    rating: 4.6,
    reviewCount: 428,
    studentCount: 22100,
    duration: 420,
    lessonCount: 28,
    language: "English",
    lastUpdated: "2026-05-16",
    publishedAt: "2025-03-12",
    status: "published",
    popular: true,
    learningOutcomes: [
      "Write readable analytical SQL",
      "Use window functions for rankings and trends",
      "Build reusable reporting queries",
      "Validate data quality before insights",
    ],
    requirements: ["Spreadsheet familiarity helpful"],
    curriculum: sharedCurriculum("crs-9", [
      ["SQL Basics", ["SELECT and filtering", "Aggregations", "Joins"]],
      ["Analytics Patterns", ["Window functions", "Cohorts", "Funnel queries"]],
    ]),
    reviews: [],
    tags: ["SQL", "Analytics", "Data"],
  },
  {
    id: "crs-10",
    slug: "product-ux-research",
    title: "Product UX Research",
    subtitle: "Discover what users need—and prove it.",
    description:
      "Plan research, run interviews and usability tests, synthesize insights, and influence product decisions with evidence.",
    thumbnail:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&h=800&fit=crop",
    categoryId: "cat-3",
    subcategory: "UX Research",
    instructorId: "ins-3",
    level: "Beginner",
    price: 64,
    rating: 4.8,
    reviewCount: 390,
    studentCount: 6520,
    duration: 540,
    lessonCount: 36,
    language: "English",
    lastUpdated: "2026-08-03",
    publishedAt: "2025-06-28",
    status: "published",
    learningOutcomes: [
      "Choose the right research method",
      "Facilitate interviews and usability studies",
      "Synthesize findings into actionable insights",
      "Present research to product stakeholders",
    ],
    requirements: ["Curiosity about user behavior"],
    curriculum: sharedCurriculum("crs-10", [
      ["Research Planning", ["Problem framing", "Recruiting participants", "Study design"]],
      ["Synthesis", ["Affinity mapping", "Journey insights", "Recommendations"]],
    ]),
    reviews: [],
    tags: ["UX Research", "Product", "Design"],
  },
  {
    id: "crs-11",
    slug: "practical-machine-learning",
    title: "Practical Machine Learning",
    subtitle: "Ship useful models with modern ML workflows.",
    description:
      "Go from curated datasets to evaluated models with an emphasis on interpretability, iteration, and responsible deployment basics.",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=800&fit=crop",
    categoryId: "cat-8",
    subcategory: "Machine Learning",
    instructorId: "ins-9",
    level: "Advanced",
    price: 109,
    rating: 4.7,
    reviewCount: 501,
    studentCount: 4890,
    duration: 1020,
    lessonCount: 64,
    language: "English",
    lastUpdated: "2026-09-14",
    publishedAt: "2025-09-01",
    status: "published",
    featured: true,
    trending: true,
    learningOutcomes: [
      "Train and evaluate supervised learning models",
      "Diagnose overfitting and data leakage",
      "Communicate model limitations clearly",
      "Outline a responsible ML release checklist",
    ],
    requirements: ["Python familiarity", "Basic statistics recommended"],
    curriculum: sharedCurriculum("crs-11", [
      ["ML Foundations", ["Problem framing", "Feature pipelines", "Baseline models"]],
      ["Improvement Loops", ["Validation strategies", "Error analysis", "Model selection"]],
      ["Applied Delivery", ["Monitoring basics", "Documentation", "Stakeholder demos"]],
    ]),
    reviews: [],
    tags: ["Machine Learning", "AI", "Python"],
  },
  {
    id: "crs-12",
    slug: "portrait-photography-essentials",
    title: "Portrait Photography Essentials",
    subtitle: "Capture flattering portraits with confident lighting.",
    description:
      "Learn composition, natural and studio lighting, directing subjects, and editing workflows that keep portraits natural and intentional.",
    thumbnail:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&h=800&fit=crop",
    categoryId: "cat-10",
    subcategory: "Portrait",
    instructorId: "ins-8",
    level: "Beginner",
    price: 49,
    rating: 4.5,
    reviewCount: 276,
    studentCount: 17840,
    duration: 360,
    lessonCount: 24,
    language: "English",
    lastUpdated: "2026-04-11",
    publishedAt: "2025-02-20",
    status: "published",
    trending: true,
    learningOutcomes: [
      "Compose portraits with intention",
      "Control natural and softbox lighting",
      "Direct subjects with clear cues",
      "Edit portraits with a consistent style",
    ],
    requirements: ["Any DSLR, mirrorless, or advanced phone camera"],
    curriculum: sharedCurriculum("crs-12", [
      ["Foundations", ["Camera settings for portraits", "Composition frames", "Light observation"]],
      ["Practice", ["Natural light sessions", "Simple studio setups", "Editing workflow"]],
    ]),
    reviews: [],
    tags: ["Photography", "Portrait", "Lighting"],
  },
  {
    id: "crs-13",
    slug: "fullstack-javascript-bootcamp",
    title: "Full-Stack JavaScript Bootcamp",
    subtitle: "Build complete apps from UI to API with modern JS.",
    description:
      "A project-based course covering frontend interfaces, Node APIs, authentication basics, and deployment for full-stack JavaScript applications.",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
    categoryId: "cat-1",
    subcategory: "Full-Stack",
    instructorId: "ins-1",
    level: "Beginner",
    price: 79,
    originalPrice: 110,
    rating: 4.7,
    reviewCount: 880,
    studentCount: 14320,
    duration: 1140,
    lessonCount: 70,
    language: "English",
    lastUpdated: "2026-10-20",
    publishedAt: "2026-01-15",
    status: "published",
    featured: true,
    popular: true,
    learningOutcomes: [
      "Build responsive frontend interfaces",
      "Create REST-style APIs with Node",
      "Connect client and server with auth basics",
      "Deploy a complete demo application",
    ],
    requirements: ["Basic HTML/CSS", "Willingness to practice daily"],
    curriculum: sharedCurriculum("crs-13", [
      ["Frontend Foundations", ["Modern JS essentials", "Component thinking", "State and forms"]],
      ["Backend Basics", ["Node and Express intro", "Data modeling", "Auth overview"]],
      ["Integration", ["API clients", "Error handling", "Deploy checklist"]],
    ]),
    reviews: [],
    tags: ["JavaScript", "Full-Stack", "Node"],
  },
  {
    id: "crs-14",
    slug: "brand-identity-design",
    title: "Brand Identity Design",
    subtitle: "Create cohesive visual systems for modern brands.",
    description:
      "Design logos, type pairings, color systems, and brand guidelines that hold up across digital and print touchpoints.",
    thumbnail:
      "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800&fit=crop",
    categoryId: "cat-4",
    subcategory: "Branding",
    instructorId: "ins-7",
    level: "Intermediate",
    price: 72,
    rating: 4.8,
    reviewCount: 412,
    studentCount: 7210,
    duration: 600,
    lessonCount: 40,
    language: "English",
    lastUpdated: "2026-09-22",
    publishedAt: "2025-11-30",
    status: "published",
    featured: true,
    learningOutcomes: [
      "Define brand strategy inputs for design",
      "Craft logo systems with flexibility",
      "Build typography and color guidelines",
      "Present identity work to stakeholders",
    ],
    requirements: ["Basic design tool familiarity (Figma or Adobe)"],
    curriculum: sharedCurriculum("crs-14", [
      ["Strategy & Discovery", ["Brand audit", "Audience framing", "Moodboards"]],
      ["System Design", ["Logo exploration", "Type and color", "Guidelines"]],
    ]),
    reviews: [],
    tags: ["Branding", "Graphic Design", "Identity"],
  },
  {
    id: "crs-15",
    slug: "seo-content-systems",
    title: "SEO Content Systems",
    subtitle: "Build repeatable organic growth with better content ops.",
    description:
      "Plan keyword strategy, create high-intent content, and set up measurement systems that improve rankings over time.",
    thumbnail:
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=800&fit=crop",
    categoryId: "cat-5",
    subcategory: "SEO",
    instructorId: "ins-5",
    level: "Beginner",
    price: 54,
    rating: 4.6,
    reviewCount: 298,
    studentCount: 8650,
    duration: 450,
    lessonCount: 30,
    language: "English",
    lastUpdated: "2026-07-12",
    publishedAt: "2025-08-05",
    status: "published",
    learningOutcomes: [
      "Research keywords with intent clarity",
      "Structure pages for topical authority",
      "Build an editorial workflow",
      "Track SEO outcomes with practical dashboards",
    ],
    requirements: ["Access to a website or blog helps"],
    curriculum: sharedCurriculum("crs-15", [
      ["Research", ["Keyword mapping", "Competitor gaps", "Brief writing"]],
      ["Production", ["On-page SEO", "Internal linking", "Refresh cadence"]],
    ]),
    reviews: [],
    tags: ["SEO", "Content", "Marketing"],
  },
  {
    id: "crs-16",
    slug: "startup-fundamentals",
    title: "Startup Fundamentals",
    subtitle: "Validate ideas and build an early-stage operating rhythm.",
    description:
      "Learn customer discovery, lean experimentation, pricing basics, and founder workflows that reduce wasted effort.",
    thumbnail:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop",
    categoryId: "cat-6",
    subcategory: "Startups",
    instructorId: "ins-5",
    level: "Beginner",
    price: 45,
    rating: 4.5,
    reviewCount: 210,
    studentCount: 5400,
    duration: 390,
    lessonCount: 26,
    language: "English",
    lastUpdated: "2026-05-02",
    publishedAt: "2025-12-01",
    status: "published",
    learningOutcomes: [
      "Interview customers effectively",
      "Design cheap validation experiments",
      "Define an early go-to-market hypothesis",
      "Set a weekly founder operating cadence",
    ],
    requirements: ["An idea or problem space to explore"],
    curriculum: sharedCurriculum("crs-16", [
      ["Discovery", ["Problem interviews", "Assumption mapping", "Offer testing"]],
      ["Build Rhythm", ["MVP scope", "Metrics that matter", "Founder rituals"]],
    ]),
    reviews: [],
    tags: ["Startups", "Entrepreneurship", "Business"],
  },
  {
    id: "crs-17",
    slug: "generative-ai-for-builders",
    title: "Generative AI for Builders",
    subtitle: "Design useful AI features with modern LLM workflows.",
    description:
      "Learn prompt systems, retrieval patterns, evaluation basics, and product constraints for shipping generative AI experiences.",
    thumbnail:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop",
    categoryId: "cat-8",
    subcategory: "Generative AI",
    instructorId: "ins-9",
    level: "Intermediate",
    price: 96,
    originalPrice: 139,
    rating: 4.8,
    reviewCount: 355,
    studentCount: 6120,
    duration: 720,
    lessonCount: 44,
    language: "English",
    lastUpdated: "2026-10-18",
    publishedAt: "2026-02-10",
    status: "published",
    featured: true,
    trending: true,
    bestseller: true,
    learningOutcomes: [
      "Design reliable prompt and tool workflows",
      "Apply retrieval-augmented patterns",
      "Evaluate output quality systematically",
      "Ship AI features with clear guardrails",
    ],
    requirements: ["Basic programming experience", "Product curiosity"],
    curriculum: sharedCurriculum("crs-17", [
      ["LLM Foundations", ["Capabilities and limits", "Prompt systems", "Tool calling overview"]],
      ["Product Patterns", ["RAG essentials", "Evaluation harnesses", "Safety checks"]],
    ]),
    reviews: [],
    tags: ["Generative AI", "LLMs", "Product"],
  },
  {
    id: "crs-18",
    slug: "ios-swiftui-starter",
    title: "iOS with SwiftUI Starter",
    subtitle: "Build native iOS interfaces with modern SwiftUI.",
    description:
      "Create polished iOS screens, navigation stacks, and data-driven views while learning Apple platform conventions.",
    thumbnail:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&h=800&fit=crop",
    categoryId: "cat-9",
    subcategory: "iOS",
    instructorId: "ins-6",
    level: "Beginner",
    price: 88,
    rating: 4.6,
    reviewCount: 248,
    studentCount: 4320,
    duration: 780,
    lessonCount: 50,
    language: "English",
    lastUpdated: "2026-08-28",
    publishedAt: "2025-10-20",
    status: "published",
    learningOutcomes: [
      "Build SwiftUI layouts and navigation",
      "Bind data to interactive views",
      "Apply iOS design conventions",
      "Prepare a sample app for TestFlight",
    ],
    requirements: ["Mac with Xcode", "Basic programming familiarity"],
    curriculum: sharedCurriculum("crs-18", [
      ["SwiftUI Basics", ["Views and modifiers", "Lists and navigation", "State management"]],
      ["App Building", ["Networking overview", "Persistence intro", "Polish and accessibility"]],
    ]),
    reviews: [],
    tags: ["iOS", "SwiftUI", "Mobile"],
  },
  {
    id: "crs-19",
    slug: "landscape-photography-mastery",
    title: "Landscape Photography Mastery",
    subtitle: "Compose dramatic landscapes in any light.",
    description:
      "Master scouting, composition, filters, and editing for landscapes that feel immersive and intentional.",
    thumbnail:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop",
    categoryId: "cat-10",
    subcategory: "Landscape",
    instructorId: "ins-8",
    level: "Intermediate",
    price: 62,
    rating: 4.7,
    reviewCount: 189,
    studentCount: 3980,
    duration: 510,
    lessonCount: 34,
    language: "English",
    lastUpdated: "2026-06-30",
    publishedAt: "2025-09-12",
    status: "published",
    learningOutcomes: [
      "Scout locations with intent",
      "Balance exposure in high-contrast scenes",
      "Compose with leading lines and scale",
      "Edit landscapes with natural color",
    ],
    requirements: ["Camera with manual controls recommended"],
    curriculum: sharedCurriculum("crs-19", [
      ["In the Field", ["Golden hour planning", "Composition drills", "Filter use"]],
      ["Post Production", ["RAW workflow", "Local adjustments", "Export presets"]],
    ]),
    reviews: [],
    tags: ["Photography", "Landscape", "Editing"],
  },
  {
    id: "crs-20",
    slug: "python-programming-fundamentals",
    title: "Python Programming Fundamentals",
    subtitle: "Learn Python from first principles with real exercises.",
    description:
      "A clear beginner path through Python syntax, data structures, functions, and small projects that build lasting confidence.",
    thumbnail:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=800&fit=crop",
    categoryId: "cat-2",
    subcategory: "Python",
    instructorId: "ins-2",
    level: "Beginner",
    price: 0,
    rating: 4.8,
    reviewCount: 1490,
    studentCount: 31200,
    duration: 660,
    lessonCount: 45,
    language: "English",
    lastUpdated: "2026-09-01",
    publishedAt: "2025-01-20",
    status: "published",
    popular: true,
    bestseller: true,
    learningOutcomes: [
      "Write readable Python scripts",
      "Use lists, dicts, and functions confidently",
      "Handle files and errors",
      "Complete beginner portfolio projects",
    ],
    requirements: ["No prior programming experience required"],
    curriculum: sharedCurriculum("crs-20", [
      ["Getting Started", ["Setup and REPL", "Variables and types", "Control flow"]],
      ["Building Blocks", ["Functions", "Collections", "Modules"]],
      ["Projects", ["CLI utilities", "Data cleanup script", "Mini portfolio wrap-up"]],
    ]),
    reviews: [],
    tags: ["Python", "Programming", "Beginner"],
  },
  {
    id: "crs-21",
    slug: "typography-for-digital-products",
    title: "Typography for Digital Products",
    subtitle: "Make interfaces clearer with intentional type systems.",
    description:
      "Learn type hierarchy, pairing, spacing, and accessibility considerations for product UI and marketing surfaces.",
    thumbnail:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=800&fit=crop",
    categoryId: "cat-4",
    subcategory: "Typography",
    instructorId: "ins-7",
    level: "Beginner",
    price: 39,
    rating: 4.6,
    reviewCount: 164,
    studentCount: 2850,
    duration: 300,
    lessonCount: 20,
    language: "English",
    lastUpdated: "2026-03-18",
    publishedAt: "2025-12-18",
    status: "published",
    learningOutcomes: [
      "Choose typefaces for product contexts",
      "Build scalable type scales",
      "Improve readability and hierarchy",
      "Document typography guidelines",
    ],
    requirements: ["Interest in visual design"],
    curriculum: sharedCurriculum("crs-21", [
      ["Type Basics", ["Anatomy and classification", "Pairing strategies", "Hierarchy"]],
      ["Product Application", ["Responsive type", "Accessibility checks", "Guideline sheets"]],
    ]),
    reviews: [],
    tags: ["Typography", "Graphic Design", "UI"],
  },
  {
    id: "crs-22",
    slug: "data-visualization-storytelling",
    title: "Data Visualization Storytelling",
    subtitle: "Turn charts into decisions people understand.",
    description:
      "Design clear charts, narrative structure, and executive-ready visuals that communicate insights without clutter.",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
    categoryId: "cat-7",
    subcategory: "Visualization",
    instructorId: "ins-2",
    level: "Intermediate",
    price: 68,
    rating: 4.7,
    reviewCount: 233,
    studentCount: 4570,
    duration: 480,
    lessonCount: 32,
    language: "English",
    lastUpdated: "2026-08-09",
    publishedAt: "2026-01-05",
    status: "published",
    learningOutcomes: [
      "Choose chart types intentionally",
      "Reduce visual noise",
      "Structure analytical narratives",
      "Present insights to non-technical audiences",
    ],
    requirements: ["Basic spreadsheet or BI tool familiarity"],
    curriculum: sharedCurriculum("crs-22", [
      ["Visual Grammar", ["Encoding channels", "Chart selection", "Color and annotation"]],
      ["Story Craft", ["Insight framing", "Slide systems", "Critique practice"]],
    ]),
    reviews: [],
    tags: ["Visualization", "Data", "Communication"],
  },
  {
    id: "crs-23",
    slug: "advanced-react-patterns-draft",
    title: "Advanced React Patterns",
    subtitle: "Draft course — not yet published.",
    description:
      "An upcoming deep dive into composition patterns, performance, and architecture for large React applications.",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=800&fit=crop",
    previewImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=800&fit=crop",
    categoryId: "cat-1",
    subcategory: "Frontend",
    instructorId: "ins-1",
    level: "Advanced",
    price: 119,
    rating: 0,
    reviewCount: 0,
    studentCount: 0,
    duration: 900,
    lessonCount: 40,
    language: "English",
    lastUpdated: "2026-11-01",
    publishedAt: "2026-11-01",
    status: "draft",
    learningOutcomes: ["Composition patterns", "Performance profiling", "Architecture decisions"],
    requirements: ["Strong React experience"],
    curriculum: sharedCurriculum("crs-23", [
      ["Patterns", ["Compound components", "State machines overview", "Performance labs"]],
    ]),
    reviews: [],
    tags: ["React", "Draft"],
  },
];

export function getPublishedCourses() {
  return courses.filter((c) => c.status === "published");
}

export function getCourseBySlug(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export function getCourseById(id: string) {
  return courses.find((c) => c.id === id);
}

export function getFeaturedCourses(limit = 4) {
  return getPublishedCourses()
    .filter((c) => c.featured)
    .slice(0, limit);
}

export function getTrendingCourses(limit = 4) {
  return getPublishedCourses()
    .filter((c) => c.trending)
    .slice(0, limit);
}

export function getPopularCourses(limit = 6) {
  return [...getPublishedCourses()]
    .sort((a, b) => b.studentCount - a.studentCount)
    .slice(0, limit);
}

export function getCoursesByCategory(categoryId: string) {
  return getPublishedCourses().filter((c) => c.categoryId === categoryId);
}

export function getCoursesByInstructor(instructorId: string) {
  return getPublishedCourses().filter((c) => c.instructorId === instructorId);
}

export function getRelatedCourses(course: Course, limit = 3) {
  return getPublishedCourses()
    .filter(
      (c) =>
        c.id !== course.id &&
        (c.categoryId === course.categoryId ||
          c.instructorId === course.instructorId ||
          c.subcategory === course.subcategory),
    )
    .slice(0, limit);
}

export function getAllLessons(course: Course) {
  return course.curriculum.flatMap((section) => section.lessons);
}

export function getCategoryCourseCount(categoryId: string) {
  return getCoursesByCategory(categoryId).length;
}

export function getInstructorCourseIds(instructorId: string) {
  return getCoursesByInstructor(instructorId).map((c) => c.id);
}

export function getInstructorPublishedCourseCount(instructorId: string) {
  return getCoursesByInstructor(instructorId).length;
}
