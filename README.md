# LearnSphere

LearnSphere is a frontend Learning Management System (LMS) portfolio demo built with Next.js. It showcases course discovery, student learning workflows, instructor course management, and engagement features using mock catalog data and browser `localStorage` persistence.

> **Demo only:** LearnSphere does not include a backend, database, real authentication, multi-user sync, payment processing, or accredited certificates.

## Features

### Public site
- Home, About, Contact, FAQ
- Course exploration with search, filters, and sorting
- Categories and category course listings
- Course detail pages with enrollment panel
- Instructor directory and profile pages
- Demo login / signup forms (validation only)

### Student experience
- Dashboard overview, My Learning, enrolled courses, progress
- Lesson player with curriculum navigation
- Wishlist, bookmarks, personal lesson notes
- Course discussions (local demo)
- Reviews and ratings after course completion
- Certificates with print / Save as PDF
- Notifications and learning activity
- Profile settings + local demo data reset

### Instructor experience
- Course create / edit / publish / delete
- Local enrollment and analytics views
- Reviews and discussion replies
- Profile and settings
- Local demo data reset

## Tech stack

- **Next.js** 16 (App Router, Cache Components)
- **React** 19
- **TypeScript**
- **Tailwind CSS** v4
- **lucide-react** icons
- Browser **localStorage** for demo persistence

## Getting started

### Requirements

- Node.js 20+ recommended
- npm (or compatible package manager)

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

### Lint and typecheck

```bash
npm run lint
npm run typecheck
```

## Environment variables

No secrets or API keys are required for the demo.

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical site URL used for metadata (`metadataBase`). Example: `https://your-app.vercel.app` |

Create a local file if needed:

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`.env*` files are ignored by Git.

## localStorage keys

Demo data is stored only in the current browser:

- `learnsphere.learning.v1` — enrollments and lesson progress
- `learnsphere.instructor.v1` — instructor profile, settings, course edits
- `learnsphere.engagement.v1` — reviews, certificates, bookmarks, notes, discussions, notifications, activity
- `learnsphere.student-profile.v1` — student profile settings

Reset from **Student → Profile settings** or **Instructor → Settings**.

## Project structure

```text
app/                 # App Router pages (public, student, instructor, learn)
components/          # UI and feature components
hooks/               # Client store hooks
lib/data/            # Seed catalog and content
lib/learning/        # Enrollment / progress storage
lib/instructor/      # Instructor course catalog storage
lib/engagement/      # Reviews, certificates, discussions, notifications
lib/demo/            # Demo data reset helpers
public/              # Static assets
```

## Deployment (Vercel)

1. Push the repository to GitHub/GitLab/Bitbucket (or import the folder in Vercel).
2. Create a new Vercel project and select the Next.js app root (`my-app` if nested).
3. Framework preset: **Next.js** (auto-detected).
4. Build command: `npm run build`
5. Output: handled by Next.js (no static export required).
6. Optional: set `NEXT_PUBLIC_SITE_URL` to your production URL.
7. Deploy.

Image remote host already configured for `images.unsplash.com` in `next.config.ts`.

Do not enable real auth, payments, or secrets for this demo unless you intentionally extend the project.

## Demo limitations

- Single-browser persistence only (no cross-device sync)
- Demo student (`Alex Rivera`) and instructor (`Elena Martinez`) identities
- Login/signup and contact forms validate locally and do not call a server
- Certificates are printable demo credentials, not accredited awards
- Reviews, discussions, and notifications are local only
- Pricing and earnings figures are illustrative

## License

Private portfolio project unless otherwise stated by the repository owner.
