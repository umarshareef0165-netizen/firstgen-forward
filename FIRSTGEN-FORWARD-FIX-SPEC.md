# FirstGen Forward — Bug-Fix Specification (EvoHacks 2)

**Repo:** `github.com/umarshareef0165-netizen/firstgen-forward` · **Live:** https://firstgen-forward.vercel.app
**Prepared:** Nov 20, 2026, ~15:25 PT · **Status: SPEC ONLY — fixes NOT applied**

## ⚠️ What happened (read first)

- The repo was cloned successfully to `~/workspace/firstgen-forward-fix/` (branch `main`, clean, HEAD `e82bbf4`).
- The runtime then flagged the cloned content with an **execution-risk check**: I was permitted to READ the files with plain file viewing, but I must NOT run, build, test, edit, or push anything inside the cloned repo, and must NOT run git/package-manager commands in it.
- So **no code was changed, no build was run, nothing was pushed, and the live site was not re-verified.**
- This file is the complete, ready-to-apply fix specification: exact old → new code for every bug below, file by file. The parent agent must apply it (or ask the user how to proceed), then run `npm run build`, push **one commit** to `main` (Vercel auto-deploys), and run the live verification checklist at the end.
- All fixes below were designed from reading the actual source (no guessing): `lib/engine.ts`, `app/interview/page.tsx`, `app/star/page.tsx`, `app/plan/page.tsx`, `app/cv-score/page.tsx`, `README.md`.
- Corrections to the bug report, found while reading the code:
  - **Bug 8 (history):** interview-history persistence in `localStorage` ("fgf-history") is **already implemented** in `app/interview/page.tsx` (load on mount, save on submit, clear button). The live site losing history on refresh is a **stale deploy**, not a code bug — the new push/redeploy fixes it. No code change needed for history.
  - **Privacy:** the real phone + email appear in **only one place**: `app/cv-score/page.tsx:6` (the `SAMPLE` CV). The STAR example contains **no** contact details (verified by grep). The GitHub handle in `README.md:67` is his public identity — keep it.
  - **Bug 7 (README):** the README does not literally print "Length 25/25…"; it promises the rubric is "shown openly so the user can see exactly where every point came from". The fix is the UI breakdown (below), no README change needed.

## Bugs covered

- HIGH (all 5): (1) interview counter "Question 8 of 6" · (2) STAR Builder broken English · (3) rubric praises gibberish · (4) CV Scorecard calls a 52-word CV "Strong" (81/100) · (5) timer does not run on first load.
- MEDIUM (6–10): (6) plan is 28 days, not 30, with a repeated 7-day cycle · (7) no point breakdown in feedback UI · (8) CV report goes stale after editing with no indicator (+ history note above) · (9) `hasAction` narrower than `ACTION_VERBS` · (10) scoring bands contradict UI guidance.
- LOW/PRIVACY: sample CV publishes his real phone (+92 3191548165) and email publicly — replace with placeholders.

---

## 1. `lib/engine.ts` — the engine (bugs 3, 4, 6, 7, 9, 10)

### 1a. Unify the action-verb list (bug 9)

OLD:
```ts
export const ACTION_VERBS = ["built", "created", "designed", "developed", "led", "launched", "improved", "automated", "shipped", "delivered", "organised", "organized", "mentored", "taught", "analysed", "analyzed", "implemented", "optimised", "optimized", "reduced", "increased", "won", "presented", "collaborated", "deployed", "tested", "fixed", "researched"];
```

NEW (adds the five single-word verbs the old `hasAction` regex accepted but the list did not):
```ts
export const ACTION_VERBS = ["built", "created", "designed", "developed", "led", "launched", "improved", "automated", "shipped", "delivered", "organised", "organized", "mentored", "taught", "analysed", "analyzed", "implemented", "optimised", "optimized", "reduced", "increased", "won", "presented", "collaborated", "deployed", "tested", "fixed", "researched", "decided", "talked", "asked", "chose", "started"];
```

### 1b. Add helpers + breakdown to the Rubric type (bugs 3, 7)

Add after the `ACTION_VERBS`/`WEAK_PHRASES`/`FILLERS` exports, before `export type Rubric`:

```ts
const WORD_RE = /[a-z0-9]+(?:['-][a-z0-9]+)*/gi;
function wordsOf(text: string): string[] {
  return text.toLowerCase().match(WORD_RE) ?? [];
}
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
// Word-boundary phrase match: "data" must not match "dataset", "led" must not match "knowledge".
function hasPhrase(text: string, phrase: string): boolean {
  const ws = phrase.toLowerCase().split(/\s+/);
  if (ws.length === 1) return wordsOf(text).includes(ws[0]);
  return new RegExp(`\\b${ws.map(escapeRegExp).join("\\s+")}\\b`, "i").test(text);
}
// A real sentence has at least 4 words — filters out keyword salad.
function sentencesOf(text: string): string[] {
  return text.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.split(/\s+/).filter(Boolean).length >= 4);
}
const OUTCOME_UNITS = ["%", "percent", "users", "students", "marks", "points", "hours", "days", "seconds", "visitors", "customers", "bugs", "items", "photos", "people", "clients", "sales", "revenue", "downloads", "teams", "projects"];
// A genuine quantified outcome: a number tied to a unit ("200 users", "40%") — not a bare digit.
function hasOutcomeNumber(text: string): boolean {
  if (/\b\d+\s*(%|x)\b/i.test(text)) return true;
  return OUTCOME_UNITS.some((u) => new RegExp(`\\b\\d[\\d,]*\\s*${escapeRegExp(u)}\\b`, "i").test(text));
}
```

Update the `Rubric` type — add a `breakdown` field (max 25 + 25 + 20 + 12 + 8 + 10 = 100):

```ts
export type Rubric = {
  score: number;
  wordCount: number;
  fillerCount: number;
  structure: { star: boolean; hasSituation: boolean; hasAction: boolean; hasResult: boolean };
  keywordHits: string[];
  keywordTotal: number;
  actionVerbHits: string[];
  hasNumber: boolean;
  breakdown: { length: number; star: number; keywords: number; verbs: number; number: number; filler: number };
  feedback: string[];
  strengths: string[];
};
```

### 1c. Rewrite `scoreAnswer` (bug 3 + bug 7 breakdown + bug 10 bands)

Replace the whole `scoreAnswer` function with:

```ts
export function scoreAnswer(answer: string, keywords: string[]): Rubric {
  const text = answer.trim();
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const wordSet = wordsOf(text);
  const sentences = sentencesOf(text);
  const fillerCount = FILLERS.reduce((n, f) => {
    const m = lower.match(new RegExp(`\\b${f.replace(" ", "\\s+")}\\b`, "g"));
    return n + (m ? m.length : 0);
  }, 0);
  // STAR credit needs REAL sentences, not bare words.
  const hasSituation = sentences.some((s) => /\b(when|while|during|at (my|the|our)|in my)\b/i.test(s));
  const actionRe = new RegExp(`\\bi\\s+(${ACTION_VERBS.map(escapeRegExp).join("|")}|reached\\s+out)\\b`, "i");
  const hasAction = sentences.some((s) => actionRe.test(s));
  const resultRe = /\b(result|outcome|improved|reduced|increased|learned|passed|won|shipped|delivered|score)\b/i;
  const hasGenuineResult =
    sentences.some((s) => resultRe.test(s)) &&
    (hasOutcomeNumber(text) ||
      /\bi learned (that|to|how)\b/i.test(text) ||
      /\b(improved|reduced|increased|cut|saved|grew)\b[^.]{0,40}\b(by|from|to)\b/i.test(text));
  const hasResult = hasGenuineResult;
  const star = hasSituation && hasAction && hasResult;
  const keywordHits = keywords.filter((k) => hasPhrase(text, k));
  const actionVerbHits = ACTION_VERBS.filter((v) => wordSet.includes(v));
  const verbInSentence = sentences.some((s) => ACTION_VERBS.some((v) => new RegExp(`\\b${escapeRegExp(v)}\\b`, "i").test(s)));
  const hasNumber = hasOutcomeNumber(text);
  const breakdown = {
    length: wordCount >= 60 ? 25 : wordCount >= 30 ? 15 : wordCount >= 10 ? 6 : 0,
    star: star ? 25 : hasAction && hasResult ? 14 : hasAction ? 7 : 0,
    keywords: Math.round((keywordHits.length / Math.max(1, keywords.length)) * 20),
    verbs: actionVerbHits.length >= 2 && verbInSentence ? 12 : actionVerbHits.length >= 1 && verbInSentence ? 6 : 0,
    number: hasNumber ? 8 : 0,
    filler: fillerCount === 0 && wordCount > 0 ? 10 : fillerCount <= 2 ? 5 : 0,
  };
  const score = Math.min(100, breakdown.length + breakdown.star + breakdown.keywords + breakdown.verbs + breakdown.number + breakdown.filler);
  const feedback: string[] = [];
  const strengths: string[] = [];
  if (wordCount < 30) feedback.push("Answer is too short — under 30 words earns no length marks; aim for 60–120 words (about 45–60 seconds spoken) with one concrete example.");
  if (!hasSituation) feedback.push("Add a one-line situation: where and when this happened.");
  if (!hasAction) feedback.push("Say what YOU did — start action sentences with “I …”.");
  if (!hasResult) feedback.push("Close with the result: what changed, what you learned, or a number tied to an outcome (e.g. “200 users”, “40% faster”).");
  if (keywordHits.length < Math.ceil(keywords.length / 2)) feedback.push("Cover more of the question's key ideas — the interviewer is listening for them.");
  if (fillerCount > 2) feedback.push(`Cut filler words — you used ${fillerCount}. Pause instead of saying “um” or “like”.`);
  if (!hasNumber) feedback.push("Add one number if you can (users, marks, time saved, items fixed) — it makes the answer believable.");
  if (wordCount > 220) feedback.push("This is long for one answer — trim it to the strongest example and stop.");
  if (star) strengths.push("Clear STAR structure — situation, action and result are all present.");
  if (keywordHits.length >= Math.ceil(keywords.length / 2)) strengths.push("Good coverage of the question's key ideas.");
  if (actionVerbHits.length >= 2) strengths.push(`Strong action verbs (${actionVerbHits.slice(0, 3).join(", ")}).`);
  if (hasNumber) strengths.push("Includes a concrete number — that builds credibility.");
  if (fillerCount === 0 && wordCount > 0) strengths.push("No filler words — clean, confident delivery.");
  if (feedback.length === 0) strengths.push("Solid answer — keep this structure for the real interview.");
  return { score, wordCount, fillerCount, structure: { star, hasSituation, hasAction, hasResult }, keywordHits, keywordTotal: keywords.length, actionVerbHits, hasNumber, breakdown, feedback, strengths };
}
```

Notes on why this fixes bug 3 (13-word keyword salad scored 53/100 "Good start"):
- Keyword hits are now word-boundary (`hasPhrase`): "dataset" no longer counts as "data", "knowledge" no longer counts as "led".
- "users"/"worked" were removed from the result markers entirely — a bare word no longer earns result credit.
- STAR/result credit requires a real sentence (≥4 words) plus a genuine outcome (number tied to a unit, "I learned that/to/how", or "improved/reduced… by/from/to").
- Verb points require the verb to appear inside a real sentence.
- `hasNumber` now means an outcome number, not any digit.
- Expected result on the gibberish repro: length 13 → 6, STAR 0–7, keywords ~0–5, verbs ~6, number 0, filler 10 → roughly 22–33/100, label "Needs a rewrite". A genuine 60–120-word STAR answer with a number still scores 70+.

### 1d. Rewrite `analyseCv` (bug 4)

Replace the whole `analyseCv` function with:

```ts
export function analyseCv(text: string): CvReport {
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/.test(lower);
  const hasPhone = /\+?\d[\d\s().-]{7,}\d/.test(text);
  const hasLink = /github\.com|linkedin\.com|vercel\.app|https?:\/\//.test(lower);
  // Quantified achievements: strip the contact block (emails, phones) and all year
  // numbers first, then count ONLY numbers tied to an outcome unit or outcome verb.
  const scrubbed = text
    .replace(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi, " ")
    .replace(/\+?\d[\d\s().-]{7,}\d/g, " ")
    .replace(/\b(19|20)\d{2}\b/g, " ");
  const unitHits = (scrubbed.match(new RegExp(`\\b\\d[\\d,]*\\s*(%|percent|x|${OUTCOME_UNITS.join("|")})\\b`, "gi")) || []).length;
  const verbHits = (scrubbed.match(/\b(improved|reduced|increased|cut|saved|grew|raised|boosted|doubled)\b[^.\n]{0,40}\b\d[\d,]*\b/gi) || []).length;
  const quantified = unitHits + verbHits;
  // Section detection: headings or tight patterns — never a lone word.
  const hasHeading = (name: string) => new RegExp(`(^|\\n)\\s*${name}\\b`, "i").test(text);
  const SKILL_WORDS = ["react", "python", "javascript", "typescript", "node", "supabase", "vercel", "sql", "java", "html", "css", "git", "figma", "next"];
  const skillHits = SKILL_WORDS.filter((w) => new RegExp(`\\b${escapeRegExp(w)}\\b`, "i").test(lower)).length;
  const sectionDefs = [
    { name: "Contact / header", found: hasEmail || hasPhone },
    { name: "Education", found: hasHeading("education") || /\b(bscs|bachelor|university|degree|gpa|cgpa)\b/i.test(lower) },
    { name: "Experience", found: hasHeading("experience") || hasHeading("employment") || hasHeading("work") || /\b(intern|internship)\b/i.test(lower) || /\b(tutor|teacher|developer|engineer|analyst|designer)\b[^.\n]{0,50}\b(20\d{2}|present|\d+\s*(years?|months?))\b/i.test(lower) },
    { name: "Projects", found: hasHeading("projects") || hasHeading("portfolio") || /\b(built|created|developed|launched|shipped)\b[^.\n]{0,60}\b(app|tool|website|platform|system|agent|game|api|dashboard)\b/i.test(lower) || /github\.com\/[a-z0-9_-]+\/[a-z0-9_-]+/i.test(lower) },
    { name: "Skills", found: hasHeading("skills") || skillHits >= 3 },
  ];
  const sections = sectionDefs.map((s) => ({ name: s.name, found: s.found }));
  const verbs = ACTION_VERBS.filter((v) => new RegExp(`\\b${escapeRegExp(v)}\\b`, "i").test(lower));
  const weak = WEAK_PHRASES.filter((p) => lower.includes(p));
  let score = 0;
  score += sections.filter((s) => s.found).length * 10;
  if (hasEmail) score += 8;
  if (hasLink) score += 10;
  if (verbs.length >= 5) score += 12; else if (verbs.length >= 3) score += 7; else if (verbs.length >= 1) score += 3;
  if (quantified >= 3) score += 10; else if (quantified >= 1) score += 5;
  if (words.length >= 200 && words.length <= 700) score += 10; else if (words.length >= 120) score += 5;
  score -= weak.length * 4;
  score = Math.max(0, Math.min(100, score));
  // A short CV cannot score as strong, however complete it looks.
  if (words.length < 60) score = Math.min(score, 34);
  else if (words.length < 100) score = Math.min(score, 44);
  else if (words.length < 150) score = Math.min(score, 59);
  const issues: string[] = [];
  const wins: string[] = [];
  sections.filter((s) => !s.found).forEach((s) => issues.push(`Missing or unclear section: ${s.name}.`));
  if (!hasEmail) issues.push("No email address found — recruiters need a way to reach you.");
  if (!hasLink) issues.push("No portfolio, GitHub or live-project link found — add one; it is your strongest proof.");
  if (verbs.length < 3) issues.push("Too few action verbs — start bullets with Built, Led, Improved, Shipped, not “responsible for”.");
  if (quantified < 2) issues.push("Add numbers to your bullets — e.g. users reached, marks improved, time saved.");
  if (words.length < 150) issues.push("CV looks very short — add one project with what you built and the result.");
  if (words.length > 800) issues.push("CV is long — cut it to one page; keep only the strongest bullets.");
  weak.forEach((w) => issues.push(`Weak phrase “${w}” — replace it with a specific action and result.`));
  if (hasEmail) wins.push("Contact email present.");
  if (hasLink) wins.push("Portfolio or project link present — judges and recruiters can verify your work.");
  if (verbs.length >= 5) wins.push(`Strong action verbs throughout (${verbs.slice(0, 4).join(", ")}).`);
  if (quantified >= 3) wins.push("Achievements are quantified — that makes them believable.");
  if (sections.every((s) => s.found)) wins.push("All core sections present.");
  return { score, wordCount: words.length, sections, hasEmail, hasPhone, hasLink, actionVerbCount: verbs.length, quantifiedCount: quantified, weakPhrases: weak, issues, wins };
}
```

Expected result on the 52-word sample CV: quantified = 0 (contact digits, "1 year", and years 2023–2027 all excluded), verbs = 2 ("taught", "built"), sections all found (50) + email (8) + link (10) + verbs (3) = 71 → capped at 34 for <60 words → label "Needs real work", with issues "CV looks very short", "Too few action verbs", "Add numbers to your bullets". Consistent at last.

### 1e. Rewrite `buildPlan` — a true 30-day plan with dates (bug 6)

Replace the whole `buildPlan` function with:

```ts
export function buildPlan(role: string, weeks: number, hoursPerWeek: number): { day: number; date: string; title: string; task: string; minutes: number }[] {
  const perDay = Math.max(20, Math.round((hoursPerWeek * 60) / 7));
  const DAILY: { title: string; task: string }[] = [
    // Week 1 — Foundations
    { title: "Know the role", task: `Read one real job description for a ${role} role and write down the 5 skills it asks for most.` },
    { title: "Mock interview #1", task: `Answer 3 ${role} interview questions out loud in the Interview Studio and review the rubric feedback.` },
    { title: "CV first pass", task: "Paste your CV into the CV Scorecard and fix the top 3 issues it finds." },
    { title: "STAR story #1", task: "Write one STAR story from a real project or class experience in the STAR Builder." },
    { title: "Skill drill: basics", task: "Build or fix one small thing in your stack (a component, a script, a query) and note what you learned." },
    { title: "Research the company", task: "Pick one company you want to apply to and read its product, values and recent news. Note one thing you would ask them." },
    { title: "Rest + review", task: "Re-read your best STAR answer and your top-scored mock answer. Rest — recovery is part of preparation." },
    // Week 2 — Stories & CV
    { title: "Mock interview #2", task: `Answer 3 different ${role} questions out loud. This time, keep every answer inside 90 seconds.` },
    { title: "STAR story #2", task: "Write a second STAR story — a time you failed or missed a deadline — and practise saying it in 60 seconds." },
    { title: "CV polish", task: "Rewrite one CV bullet with an action verb and a number, then re-run the CV Scorecard." },
    { title: "Skill drill: debugging", task: "Take one bug you fixed recently and write down the steps you tried, in order. That is your next STAR story." },
    { title: "Teach it back", task: "Explain one technical idea from your field to a friend or family member in plain words. If they get it, you own it." },
    { title: "Application day #1", task: "Apply to one real opportunity with a tailored CV, or message one person for advice." },
    { title: "Rest + review", task: "Re-read both STAR stories out loud. Cut any sentence that does not add evidence." },
    // Week 3 — Mocks
    { title: "Full timed mock", task: `Do a full 30-minute timed mock: 5 ${role} questions back to back, no pauses, then score every answer.` },
    { title: "STAR story #3", task: "Write a third STAR story — a time you worked in a team and disagreed. Show listening first." },
    { title: "CV final pass", task: "Re-run the CV Scorecard. Your score should be 70+ now — if not, fix the top issue it names." },
    { title: "Skill drill: build", task: "Ship one tiny improvement to a project you can show — a feature, a fix, a README. Link it from your CV." },
    { title: "Mock interview #3", task: `Answer 3 ${role} questions you have not tried yet. Aim for 60–120 words each.` },
    { title: "Application day #2", task: "Apply to a second real opportunity, or follow up on the first one." },
    { title: "Rest + review", task: "Listen to yourself: record one answer on your phone and play it back. Cut the filler words." },
    // Week 4 — Applications & polish
    { title: "Mock interview #4", task: `Answer 3 ${role} questions out loud with a friend asking them. No notes allowed.` },
    { title: "STAR speed round", task: "Say all three STAR stories back to back in under 3 minutes total." },
    { title: "Portfolio check", task: "Open every link on your CV in a fresh browser. Fix any link that is broken or slow." },
    { title: "Skill drill: explain", task: "Write a 5-line explanation of your best project for a non-technical reader. Use it in 'Tell me about yourself'." },
    { title: "Application day #3", task: "Apply to a third real opportunity with a tailored CV and a short personal note." },
    { title: "Mock interview #5", task: "Your hardest questions only: the ones you scored lowest on. Answer each twice." },
    { title: "Rest + review", task: "Re-read your CV and all three STAR stories once. Then stop — you are ready." },
    // Days 29–30 — Final
    { title: "Dress rehearsal", task: "Full dress rehearsal: 30 minutes, 5 questions, timed, out loud, no stopping. Score it and note the one fix left." },
    { title: "Ready day", task: "Light review only: your STAR stories, your CV, and the questions you will ask them. Sleep well — you have done the work." },
  ];
  const today = new Date();
  return DAILY.map((d, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return { day: i + 1, date: date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }), title: d.title, task: d.task, minutes: perDay };
  });
}
```

Note: `weeks` is kept in the signature (callers pass it) and is used by the plan page for the deadline note (section 4). The plan itself is always 30 days, starting today.

---

## 2. `app/interview/page.tsx` — counter, timer, breakdown (bugs 1, 5, 7, 10)

### 2a. Timer starts on first load (bug 5)

OLD: `const [running, setRunning] = useState(false);`
NEW: `const [running, setRunning] = useState(true);`

### 2b. Clamp the counter so it can never exceed the question count (bug 1)

OLD:
```tsx
  const questions = QUESTION_BANK[role];
  const current = questions[qi % questions.length];
```
NEW:
```tsx
  const questions = QUESTION_BANK[role];
  const qiClamped = Math.min(qi, questions.length - 1);
  const current = questions[qiClamped];
```

OLD display:
```tsx
          <p className="kicker">Question {qi + 1} of {questions.length}</p>
```
NEW:
```tsx
          <p className="kicker">Question {qiClamped + 1} of {questions.length}</p>
```

### 2c. Role change resets the question and restarts the timer (bugs 1, 5)

OLD:
```tsx
          <select id="role" value={role} onChange={(e) => { setRole(e.target.value); setResult(null); setAnswer(""); setSeconds(0); setRunning(false); }}>
```
NEW:
```tsx
          <select id="role" value={role} onChange={(e) => { setRole(e.target.value); setQi(0); setResult(null); setAnswer(""); setSeconds(0); setRunning(true); }}>
```

### 2d. "New question" never repeats the same question twice in a row (bug 1)

OLD:
```tsx
  function newQuestion(nextRole = role, nextQi?: number) {
    const idx = nextQi ?? Math.floor(Math.random() * QUESTION_BANK[nextRole].length);
    setQi(idx); setAnswer(""); setResult(null); setSeconds(0); setRunning(true);
  }
```
NEW:
```tsx
  function newQuestion(nextRole = role, nextQi?: number) {
    const list = QUESTION_BANK[nextRole];
    let idx = nextQi ?? Math.floor(Math.random() * list.length);
    if (nextQi === undefined && list.length > 1) {
      while (idx === qi) idx = Math.floor(Math.random() * list.length);
    }
    setQi(idx); setAnswer(""); setResult(null); setSeconds(0); setRunning(true);
  }
```

### 2e. Fix the intro copy (bugs 5, 10) and add the band explainer

OLD:
```tsx
      <p className="muted">Answer in your own words — typing is fine, but saying it out loud first is closer to the real thing. Aim for 60–120 words per answer. The timer starts when you pick a question.</p>
```
NEW:
```tsx
      <p className="muted">Answer in your own words — typing is fine, but saying it out loud first is closer to the real thing. Aim for 60–120 words per answer: that is full length marks. The timer starts automatically with each question — pause it any time.</p>
```

OLD word-count line:
```tsx
      <p id="wordcount" className="muted">{answer.trim() ? answer.trim().split(/\s+/).length : 0} words</p>
```
NEW (adds the band explainer, bug 10):
```tsx
      <p id="wordcount" className="muted">{answer.trim() ? answer.trim().split(/\s+/).length : 0} words</p>
      <p className="muted" style={{ fontSize: ".85rem" }}>Length marks: 60+ words = 25 · 30–59 words = 15 · 10–29 words = 6 · under 10 words = 0.</p>
```

### 2f. Add the point breakdown to the feedback UI (bug 7)

In the result card, after the score-ring paragraph that shows `{result.wordCount} words · …`, add the breakdown. OLD (the score card block):

```tsx
              <p className="muted">{result.wordCount} words · {result.fillerCount} filler word{result.fillerCount === 1 ? "" : "s"} · key ideas covered {result.keywordHits.length}/{result.keywordTotal}</p>
```

NEW — append a breakdown list directly after that paragraph (still inside the same centered card):

```tsx
              <p className="muted">{result.wordCount} words · {result.fillerCount} filler word{result.fillerCount === 1 ? "" : "s"} · key ideas covered {result.keywordHits.length}/{result.keywordTotal}</p>
              <div style={{ textAlign: "left", marginTop: "1rem" }}>
                <h3 style={{ fontSize: ".95rem", marginBottom: ".4rem" }}>Where your points came from</h3>
                <ul className="tight" style={{ fontSize: ".92rem" }}>
                  <li>Length: {result.breakdown.length}/25</li>
                  <li>STAR structure: {result.breakdown.star}/25</li>
                  <li>Key ideas: {result.breakdown.keywords}/20</li>
                  <li>Action verbs: {result.breakdown.verbs}/12</li>
                  <li>Concrete number: {result.breakdown.number}/8</li>
                  <li>No filler: {result.breakdown.filler}/10</li>
                </ul>
              </div>
```

---

## 3. `app/star/page.tsx` — proper sentences (bug 2 + bug 10 alignment)

Replace the `answer` useMemo with a normalising assembler. OLD:

```tsx
  const answer = useMemo(() => {
    const parts = [
      situation.trim() ? `In ${situation.trim()}` : "",
      task.trim() ? `My task was to ${task.trim()}` : "",
      action.trim() ? `I ${action.trim()}` : "",
      result.trim() ? `As a result, ${result.trim()}` : "",
    ].filter(Boolean);
    return parts.join(" ");
  }, [situation, task, action, result]);
```

NEW:

```tsx
  // Strip a duplicated lead-in (e.g. user types "In my final year…" or "I traced…"),
  // strip a trailing full stop, collapse whitespace. Lead-ins are stripped in a loop
  // so "In In my…" and "I I traced…" are both fixed. No capitalisation is forced:
  // the fixed lead-ins ("In", "My task was to", "I", "As a result") already start
  // each sentence, and the user's words continue in lower case, as they should.
  function cleanPart(text: string, leadIn: RegExp): string {
    let t = text.trim().replace(/\s+/g, " ");
    t = t.replace(/[.。]+$/, "");
    let prev = "";
    while (prev !== t) { prev = t; t = t.replace(leadIn, "").trim(); }
    return t;
  }
  const answer = useMemo(() => {
    const s = cleanPart(situation, /^(in|during|when|while)\s+/i);
    const t = cleanPart(task, /^(my task was to|my task|to)\s+/i);
    const a = cleanPart(action, /^(i|we)\s+/i);
    const r = cleanPart(result, /^(as a result,?|so|therefore)\s+/i);
    const parts = [
      s ? `In ${s}.` : "",
      t ? `My task was to ${t}.` : "",
      a ? `I ${a}.` : "",
      r ? `As a result, ${r}.` : "",
    ].filter(Boolean);
    return parts.join(" ");
  }, [situation, task, action, result]);
```

Check against the built-in example: "In my final-year project team had two weeks left and our crop-advisory app kept crashing when farmers uploaded photos. My task was to make the upload reliable before our demo day. I traced the crash to uncompressed images, added client-side compression, and tested uploads on a slow connection with 20 photos. As a result, uploads stopped crashing, the demo ran cleanly, and the app was submitted on time." — proper sentences, no doubled words, one full stop each.

Bug 10 alignment — the length pill currently says 60–140 words; the interview guidance is 60–120. OLD:
```tsx
                {words === 0 ? "Aim for 60–140 words (about 60 seconds spoken)" : words < 60 ? "A little short — add detail to the Action" : words > 140 ? "A little long — trim the Situation" : "Good length — about 60 seconds spoken"}
```
NEW (range 60–120 to match the interview studio; the pill range check changes with it):
```tsx
                {words === 0 ? "Aim for 60–120 words (about 60 seconds spoken)" : words < 60 ? "A little short — add detail to the Action" : words > 120 ? "A little long — trim the Situation" : "Good length — about 60 seconds spoken"}
```
And the pill's condition `words >= 60 && words <= 140` → `words >= 60 && words <= 120`.

---

## 4. `app/plan/page.tsx` — true 30-day plan, role-scoped checkmarks, dates (bug 6)

### 4a. Build the plan only when the button is clicked; key checkmarks by role+day

OLD state + memo:
```tsx
  const [made, setMade] = useState(false);
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const plan = useMemo(() => (made ? buildPlan(role, weeks, hours) : []), [made, role, weeks, hours]);
  const doneCount = plan.filter((d) => checked[d.day]).length;
```
NEW:
```tsx
  const [made, setMade] = useState(false);
  const [plan, setPlan] = useState<{ day: number; date: string; title: string; task: string; minutes: number }[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const doneCount = plan.filter((d) => checked[`${role}|${d.day}`]).length;
```
(Remove the now-unused `useMemo` import if it is no longer used elsewhere in the file.)

OLD toggle:
```tsx
  function toggle(day: number) {
    const next = { ...checked, [day]: !checked[day] };
    setChecked(next);
    try { localStorage.setItem("fgf-plan", JSON.stringify(next)); } catch { /* ignore */ }
  }
```
NEW:
```tsx
  function toggle(day: number) {
    const key = `${role}|${day}`;
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    try { localStorage.setItem("fgf-plan", JSON.stringify(next)); } catch { /* ignore */ }
  }
```

### 4b. Button builds (and rebuilds) explicitly

OLD:
```tsx
        <button className="btn" type="button" onClick={() => setMade(true)} style={{ marginTop: "1rem" }}>Build my plan</button>
```
NEW:
```tsx
        <button className="btn" type="button" onClick={() => { setPlan(buildPlan(role, weeks, hours)); setMade(true); }} style={{ marginTop: "1rem" }}>{made ? "Rebuild my plan" : "Build my plan"}</button>
```

### 4c. Show the 30-day heading, the deadline note, dates, and role-scoped checkmarks

OLD heading + list:
```tsx
          <h2>Your {weeks}-week plan · {role}</h2>
```
NEW:
```tsx
          <h2>Your 30-day plan · {role}</h2>
          {weeks * 7 < 30 && (
            <p className="muted">Your deadline is in {weeks} week{weeks === 1 ? "" : "s"} — prioritise days 1–{weeks * 7}; days {weeks * 7 + 1}–30 are bonus polish.</p>
          )}
```

OLD checkbox row:
```tsx
              <label className="check" key={d.day} style={{ textDecoration: checked[d.day] ? "line-through" : "none", opacity: checked[d.day] ? 0.65 : 1 }}>
                <input type="checkbox" checked={!!checked[d.day]} onChange={() => toggle(d.day)} aria-label={`Day ${d.day}: ${d.title}`} />
                <span><strong>Day {d.day} — {d.title}</strong> <span className="muted">({d.minutes} min)</span><br /><span className="muted">{d.task}</span></span>
              </label>
```
NEW:
```tsx
              <label className="check" key={d.day} style={{ textDecoration: checked[`${role}|${d.day}`] ? "line-through" : "none", opacity: checked[`${role}|${d.day}`] ? 0.65 : 1 }}>
                <input type="checkbox" checked={!!checked[`${role}|${d.day}`]} onChange={() => toggle(d.day)} aria-label={`Day ${d.day}: ${d.title}`} />
                <span><strong>Day {d.day} — {d.date} — {d.title}</strong> <span className="muted">({d.minutes} min)</span><br /><span className="muted">{d.task}</span></span>
              </label>
```

Reset button label — OLD: `Reset checkmarks` → NEW: `Reset all checkmarks` (it clears every role's marks, which is what it does).

---

## 5. `app/cv-score/page.tsx` — placeholder sample + stale report (privacy + bug 8)

### 5a. Replace the real contact details in the sample CV (privacy)

OLD:
```tsx
const SAMPLE = `Umar Shareef
umarshareef0165@gmail.com | +92 3191548165 | github.com/umarshareef0165-netizen
```
NEW:
```tsx
const SAMPLE = `Your Name
you@example.com | +1 (555) 010-0000 | github.com/your-username
```
(Keep the rest of the sample — Education, Experience, Projects, Skills — unchanged. `example.com` and the `555-010` range are reserved for examples, so nothing real leaks. The analyser still finds an email, a phone and a link, and the quantified count stays 0, so the sample now scores ~34 with "CV looks very short" — consistent.)

### 5b. Mark the report stale when the CV text changes (bug 8)

Add state next to the existing `useState` lines:
```tsx
  const [stale, setStale] = useState(false);
```

OLD run/clear:
```tsx
  function run() { if (text.trim().length > 20) setReport(analyseCv(text)); }
```
NEW:
```tsx
  function run() { if (text.trim().length > 20) { setReport(analyseCv(text)); setStale(false); } }
```

OLD textarea:
```tsx
      <textarea id="cv" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your CV text here…" style={{ minHeight: 220 }} />
```
NEW:
```tsx
      <textarea id="cv" value={text} onChange={(e) => { setText(e.target.value); if (report) setStale(true); }} placeholder="Paste your CV text here…" style={{ minHeight: 220 }} />
```

OLD Clear button:
```tsx
        <button className="btn ghost" style={{ color: "var(--ink)", border: "1px solid var(--line)", background: "#fff" }} type="button" onClick={() => { setText(""); setReport(null); }}>Clear</button>
```
NEW:
```tsx
        <button className="btn ghost" style={{ color: "var(--ink)", border: "1px solid var(--line)", background: "#fff" }} type="button" onClick={() => { setText(""); setReport(null); setStale(false); }}>Clear</button>
```

Show the stale banner — insert directly before the `{report && (` block:
```tsx
      {report && stale && (
        <p className="pill warn" style={{ marginTop: "1rem" }}>Your CV text changed since this score — press “Score my CV” again to update it.</p>
      )}
```
And dim the stale report — OLD: `{report && (` … the `<section className="section" aria-live="polite">` … NEW: add `style={{ opacity: stale ? 0.6 : 1 }}` to that `<section>` opening tag.

---

## 6. What does NOT change

- No new features, no new pages, no paid APIs, no sign-up, everything stays client-side.
- `README.md`: no change (the breakdown promise is now kept by the UI; "26 questions" and "30-Day Readiness Plan" are now both true).
- `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `app/A11yToolbar.tsx`: untouched.
- No other project touched (FasalMitra / Codebenders explicitly out of scope).

---

## 7. Apply, build, push (parent agent)

1. Apply every change in sections 1–5 above to the clone at `~/workspace/firstgen-forward-fix/` (or a fresh clone).
2. `cd` into the repo and run `npm install` (if needed) then `npm run build` — it must pass clean. Fix any TypeScript errors the build reports (most likely candidates: the `useMemo` import in `app/plan/page.tsx` if now unused — remove it; the `Rubric` type now requires `breakdown` — it is returned by the new `scoreAnswer`).
3. Commit **one** commit to `main` (e.g. `Fix 5 high-severity bugs + mediums + sample-CV privacy (EvoHacks 2)`) and push. Vercel auto-deploys; do NOT push a half-fixed intermediate state.
4. Wait for the Vercel deploy to go live, then run the live verification checklist below.

## 8. Live verification checklist (run on https://firstgen-forward.vercel.app after deploy)

- [ ] **Bug 1:** Interview Studio → switch role to "Data Analyst" (6 questions) — counter reads "Question 1 of 6", never "Question 8 of 6". Click "New question" 5× — never the same question twice in a row.
- [ ] **Bug 2:** STAR Builder → "Load an example" — output reads as four proper sentences, no "In In…", no "I I…", each part ends with a full stop. Also type "In my final year…" in Situation and "I traced…" in Action — output stays clean.
- [ ] **Bug 3:** Interview Studio → paste a 13-word keyword salad (e.g. "I led a dataset of users who worked with knowledge and data projects") — score is well under 45 and the label is "Needs a rewrite", not "Good start". A genuine 60–120-word STAR answer with a number still scores 70+.
- [ ] **Bug 4:** CV Scorecard → "Try a sample CV" — score is ≤34 with "CV looks very short" and "Too few action verbs" listed; quantified achievements = 0. A strong 250-word CV with numbers still scores 70+.
- [ ] **Bug 5:** Interview Studio → fresh load — timer is already running (seconds ticking, button reads "Pause timer"). Switch role — timer restarts at 00:00 and keeps running.
- [ ] **Bug 6:** Plan → build a plan — exactly 30 days, Day 8 ≠ Day 1, each day shows a calendar date, checkmarks are per-role (switch role → checkmarks change), and editing inputs does not rebuild the plan until "Rebuild my plan" is clicked.
- [ ] **Bug 7:** Score any answer — the result card shows "Where your points came from" with six lines (Length /25, STAR /25, Key ideas /20, Action verbs /12, Concrete number /8, No filler /10) that add up to the score.
- [ ] **Bug 8:** CV Scorecard → score, then edit the text — a "score is out of date" banner appears and the report dims until re-scored. Interview history survives a page refresh.
- [ ] **Bug 9:** Interview Studio → answer starting "I presented…" — earns STAR-action credit (not zero).
- [ ] **Bug 10:** The word-count area explains the bands (60+ = 25, 30–59 = 15, 10–29 = 6, under 10 = 0).
- [ ] **Privacy:** "Try a sample CV" shows `you@example.com` / `+1 (555) 010-0000` / `github.com/your-username` — no real phone or email anywhere on the site or in the repo. Confirm with a repo grep for `3191548165` and `umarshareef0165@gmail.com` returning no hits in app code.
- [ ] **No regressions:** `npm run build` clean; home page and all four tools load; no console errors on a fresh load.
