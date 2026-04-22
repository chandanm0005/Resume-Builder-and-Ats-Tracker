# ResumeHub — AI-Powered Resume Builder & ATS Tracker

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20Here-blue)]((https://resume-builder-and-ats-tracker.onrender.com)) <!-- Replace with actual demo link -->

Developed as an academic mini project under REVA University.

A full-stack web application that helps job seekers build ATS-optimized resumes and screen them against real job descriptions using a custom-built ATS scoring engine.

## Features

### Resume Builder
- 5 Professional Templates: Modern, Classic, Minimal, Executive, Compact
- Import Existing Resume: Upload PDF/DOCX and auto-fill personal details, summary, and skills
- AI Enhance: Per-field button that expands weak descriptions into strong professional bullets
- Live Preview: Side-by-side preview matching the downloaded PDF
- PDF Export: Browser-native print-to-PDF with accurate HTML rendering
- Section-based Navigation: Personal, Experience, Projects, Education, Skills & More
- State Persistence: All sections remain mounted, preventing data loss on tab switches

### ATS Screener
- Real PDF & DOCX Parsing: Uses pdfjs-dist and mammoth for text extraction
- Paste Fallback: For image-based PDFs, paste resume text directly
- JD-driven Keyword Extraction: Extracts keywords directly from job descriptions
- 7-factor ATS Scoring Engine: Mirrors real ATS evaluation criteria
- Improvement Suggestions: Specific fixes to boost scores
- Learning Resources: Links to official docs for missing skills

### ATS Scoring Algorithm
The screener uses a 7-factor weighted scoring model:

| Factor              | Weight | Description |
|---------------------|--------|-------------|
| Skill & Keyword Match | 30%   | Keywords from JD matched against resume using whole-word regex |
| Section Completeness | 15%   | Checks for Contact, Summary, Experience, Education, Skills sections |
| Action Verbs        | 15%   | Counts strong verbs like Developed, Built, Optimized |
| Quantified Impact   | 10%   | Looks for numbers with context (e.g., "40%", "5 users") |
| Role Alignment      | 10%   | Checks if resume mentions the job title from JD |
| Education Match     | 10%   | Verifies degree requirements if specified in JD |
| JD Keyword Density  | 10%   | Meaningful words from JD present in resume |

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 19, TypeScript, Vite |
| Routing    | Wouter |
| Styling    | Tailwind CSS v4, Radix UI |
| State      | React useState (client-side) |
| Backend    | Express.js v5, TypeScript |
| Auth       | Passport.js (Google OAuth + local email/password) |
| Database   | PostgreSQL + Drizzle ORM |
| PDF Parsing| pdfjs-dist (no-worker mode) |
| DOCX Parsing| mammoth |
| PDF Export | Browser print API with template HTML |
| Animations | Framer Motion |

## Challenges Faced & Solutions

1. **PDF Export Inconsistency**: Replaced jsPDF with browser-native print for accurate preview-to-PDF matching.
2. **PDF Parsing in Browser**: Disabled Web Worker in pdfjs-dist to avoid Vite runtime errors.
3. **Mocked ATS Screener**: Implemented real text extraction and JD-driven scoring.
4. **Keyword False Positives**: Used whole-word boundary regex and minimum length enforcement.
5. **Data Loss on Tab Switch**: Kept all sections mounted in DOM with hidden visibility.
6. **Template Rendering Issues**: Built distinct HTML/CSS renderers for each template.
7. **DOCX Parsing Not Working**: Integrated mammoth for proper async text extraction.
8. **No Import Feature**: Added auto-extraction of details from uploaded resumes.

## Project Structure

```
├── client/
│   └── src/
│       ├── pages/
│       │   ├── builder/
│       │   │   ├── index.tsx        # Resume builder with AI enhance
│       │   │   ├── ResumePreview.tsx # 5 template renderers
│       │   │   └── pdf-export.ts    # HTML-to-PDF export
│       │   ├── screener/
│       │   │   └── index.tsx        # ATS screener with real scoring
│       │   ├── Home.tsx
│       │   └── login.tsx
│       ├── components/
│       │   └── layout/Navbar.tsx
│       └── lib/
│           ├── auth.ts
│           └── queryClient.ts
├── server/
│   ├── index.ts                     # Express server
│   ├── routes.ts                    # Auth routes (Google OAuth + local)
│   └── storage.ts                   # In-memory user storage
├── shared/
│   └── schema.ts                    # Drizzle schema (users table)
└── README.md
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5030](http://localhost:5030) in your browser.

### Environment Variables (Optional)

- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
- `SESSION_SECRET`: Session secret for authentication
- `DATABASE_URL`: PostgreSQL connection URL

Google OAuth and database are optional — the app works fully in demo mode with in-memory storage.

## Team

Built by students of REVA University as an academic mini project.

**ResumeHub — Beat the Bots. Land the Interview.**
