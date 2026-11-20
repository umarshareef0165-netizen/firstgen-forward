# FirstGen Forward

**An AI-style readiness coach that turns first-generation students into interview-ready candidates.**

Built for **EvoHacks 2** (Devpost, Nov 21–22, 2026) by Umar Shareef, solo.

## The problem

First-generation students often prepare for interviews alone — no family member has sat in
that interview, no one at home can review the CV. Paid coaching costs money many families
do not have. FirstGen Forward teaches the unwritten rules openly, with practice and feedback
any student can use tonight.

## What it does (all fully working, client-side, $0)

1. **Mock Interview Studio** (`/interview`) — 26 real interview questions across 4 roles
   (Software Engineer Intern, Data Analyst, Product / General, Tutor / Teaching). Timed
   answers scored by a transparent 0–100 rubric: STAR structure, key-idea coverage,
   action verbs, concrete numbers, length and filler words — with exact fixes and a
   practice history saved in the browser.
2. **CV Scorecard** (`/cv-score`) — paste CV text, get a 0–100 score: sections present,
   contact details, portfolio link, action verbs, quantified achievements, weak phrases,
   plus a prioritised fix list and a strong-bullet formula.
3. **STAR Answer Builder** (`/star`) — turn one real experience into a structured
   Situation–Task–Action–Result answer with a word count and a 60-second spoken check,
   plus copy-to-clipboard.
4. **30-Day Readiness Plan** (`/plan`) — day-by-day plan from target role, weeks and
   hours/week, with checkboxes that persist in the browser.

Plus: high-contrast and larger-text toggles, full keyboard navigation, skip link,
plain language, and no step that needs perfect eyesight, hearing, or a fast connection.

## Honest note on the feedback

No large language model is involved. Each answer is checked by a published, transparent
rubric (see `lib/engine.ts`) — the same rules interviewers use, shown openly so the user
can see exactly where every point came from. That keeps the tool free, private and
instant, and it never invents praise the user did not earn.

## Privacy

No sign-up, no server database, no tracking. Answers, CV text and plan checkmarks live
only in the browser's local storage.

## Tech stack

Next.js 14 (App Router) · React 18 · TypeScript · plain CSS · deployed on Vercel (free tier).
No backend, no API keys, no paid services.

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Live demo

https://firstgen-forward.vercel.app

## About the builder

Umar Shareef — final-year BSCS student, University of Agriculture Faisalabad (2023–2027),
first-generation, limited-income student; 1 year of private tuition experience; React /
Next.js / TypeScript / Python. Live products: HireReady Agent, FasalShift, AgriYield Advisor,
FrankenLedger. GitHub: umarshareef0165-netizen.
