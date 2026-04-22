# ResumeHub — AI-Powered Resume Builder & ATS Tracker

> Developed as an academic mini project under **REVA University**

A full-stack web application that helps job seekers build ATS-optimized resumes and screen them against real job descriptions using a custom-built ATS scoring engine.

---

## Live Features

### Resume Builder
- **5 Professional Templates** — Modern, Classic, Minimal, Executive, Compact
- **Import Existing Resume** — Upload PDF/DOCX and auto-fill personal details, summary, and skills
- **AI Enhance** — Per-field button that expands weak 1-line descriptions into 2-3 strong professional bullets with action verbs and impact phrases
- **Live Preview** — Side-by-side preview that exactly matches the downloaded PDF
- **PDF Export** — Browser-native print-to-PDF with template-accurate HTML rendering
- **Section-based navigation** — Personal, Experience, Projects, Education, Skills & More
- **State persistence** — All sections stay mounted (hidden/shown), so switching tabs never loses your data

### ATS Screener
- **Real PDF & DOCX parsing** — Uses `pdfjs-dist` (no worker, main-thread) and `mammoth` for actual text extraction
- **Paste fallback** — If PDF is image-based, users can paste resume text directly
- **JD-driven keyword extraction** — Extracts ALL meaningful keywords from whatever the JD says (not a fixed list)
- **7-factor ATS scoring engine** — Mirrors how real Applicant Tracking Systems evaluate resumes
- **Improvement suggestions** — Tells you exactly what to fix to boost your score
- **Learning resources** — Links to official docs for missing skills

---

## ATS Scoring Algorithm

The screener uses a **7-factor weighted scoring model** that mirrors real ATS systems:

| Factor | Weight | What it checks |
|--------|--------|----------------|
| **Skill & Keyword Match** | 30% | Keywords extracted directly from the JD matched against resume using whole-word regex (prevents "R" matching "React", "Go" matching "Google") |
| **Section Completeness** | 15% | Checks for Contact, Summary, Experience, Education, Skills sections |
| **Action Verbs** | 15% | Counts strong verbs: Developed, Built, Optimized, Led, Delivered, Engineered... |
| **Quantified Impact** | 10% | Looks for numbers with context — "40%", "5 users", "3 projects", "2x faster" |
| **Role Alignment** | 10% | Checks if resume mentions the job title extracted from the JD |
| **Education Match** | 10% | If JD requires a degree, checks if resume has one |
| **JD Keyword Density** | 10% | Meaningful words from JD (5+ chars, no stop words) present in resume |

### Keyword Extraction Strategy
Keywords are extracted **directly from the JD** — not from a fixed list:
1. **Curated tech terms** (~200 skills) matched with whole-word boundary regex
2. **CamelCase tokens** — `ReactNative`, `TypeScript`, `PostgreSQL`
3. **ALL-CAPS acronyms** — `AWS`, `SQL`, `API`, `REST`, `JWT`
4. **Slash combos** — `CI/CD`, `UI/UX`
5. **Dotted names** — `node.js`, `next.js`
6. **Versioned tokens** — `Python3`, `ES6`, `HTML5`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| Routing | Wouter |
| Styling | Tailwind CSS v4, Radix UI |
| State | React useState (client-side) |
| Backend | Express.js v5, TypeScript |
| Auth | Passport.js (Google OAuth + local email/password) |
| Database | PostgreSQL + Drizzle ORM |
| PDF Parsing | pdfjs-dist (no-worker mode) |
| DOCX Parsing | mammoth |
| PDF Export | Browser print API with template HTML |
| Animations | Framer Motion |

---

## Challenges We Faced & How We Fixed Them

### 1. PDF Export — Preview ≠ Download
**Problem:** The original code used `jsPDF` to generate PDFs programmatically, but the output looked completely different from the on-screen preview.

**Fix:** Replaced jsPDF with a browser-native print approach — the same HTML/CSS used for the live preview is injected into a hidden iframe and printed. What you see is exactly what you get.

---

### 2. PDF Parsing Broken in Browser
**Problem:** `pdfjs-dist` requires a Web Worker for PDF parsing, but setting up the worker in a Vite environment caused runtime errors due to version mismatches with CDN worker URLs (`.min.js` vs `.mjs`).

**Fix:** Disabled the worker entirely (`workerSrc = ""`) and ran pdfjs in the main thread using `useWorkerFetch: false, isEvalSupported: false`. This works reliably in all Vite setups without any CDN dependency.

---

### 3. ATS Screener Was Fully Mocked
**Problem:** The original screener generated fake resume text with random technologies and used `Math.random()` to decide matches. Scores were meaningless.

**Fix:** Rebuilt the entire screener with:
- Real PDF/DOCX text extraction
- JD-driven keyword extraction (not a fixed list)
- 7-factor weighted scoring that mirrors real ATS logic
- Actual text comparison between resume and JD

---

### 4. Keyword False Positives ("R", "Go" matching everything)
**Problem:** Single-letter and short keywords like "R" (the language) and "Go" were matching words like "React", "Google", "for", "or" — inflating match scores.

**Fix:** Implemented whole-word boundary regex matching:
```js
new RegExp("(?<![a-zA-Z0-9.+#])" + escaped + "(?![a-zA-Z0-9.+#])", "i")
```
Also enforced minimum 4-character length for skill matching.

---

### 5. Tab Switching Lost Form Data
**Problem:** Switching between sections (Personal → Experience → Projects) caused React to unmount the inactive section components, destroying all entered data.

**Fix:** All sections are always mounted in the DOM. Active section is shown, inactive ones use `className="hidden"`. State lives in the parent component and is never destroyed.

---

### 6. Resume Templates Not Rendering in PDF
**Problem:** Template selection had no effect — all downloads looked the same regardless of which template was chosen.

**Fix:** Built 5 distinct HTML/CSS template renderers (Modern, Classic, Minimal, Executive, Compact). The same renderer used for live preview is used for PDF generation, ensuring consistency.

---

### 7. DOCX Parsing Not Implemented
**Problem:** `mammoth` was listed as a dependency but never actually called. DOCX uploads silently failed.

**Fix:** Implemented proper async DOCX parsing using `mammoth.extractRawText()` with ArrayBuffer input. Added error handling and user feedback when extraction fails.

---

### 8. Builder Had No Import Feature
**Problem:** Users had to manually type all their details even if they already had a resume.

**Fix:** Added an "Import Resume" screen as the first step. Upload PDF/DOCX → auto-extracts name, email, phone, location, LinkedIn, GitHub, summary, and skills using regex and section-heading detection.

---

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

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5030` in your browser.

### Environment Variables (optional)
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
DATABASE_URL=your_postgres_url
```

Google OAuth and database are optional — the app works fully without them using demo mode and in-memory storage.

---

## Team

Built by students of **REVA University** as an academic mini project.

---

*ResumeHub — Beat the Bots. Land the Interview.*
