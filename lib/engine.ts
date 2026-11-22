export const QUESTION_BANK: Record<string, { q: string; keywords: string[]; tip: string }[]> = {
  "Software Engineer Intern": [
    { q: "Tell me about yourself.", keywords: ["student", "project", "built", "learn", "computer science"], tip: "Keep it to 60–90 seconds: present → past project → future goal." },
    { q: "Tell me about a project you built and a hard bug you fixed in it.", keywords: ["bug", "error", "fixed", "debug", "test", "learned"], tip: "Name the bug, the steps you tried, and what the fix taught you." },
    { q: "Explain recursion (or an API you have used) as if I am a non-technical teammate.", keywords: ["example", "like", "simple", "step"], tip: "Use one everyday analogy, then one concrete example." },
    { q: "Describe a time you worked in a team and disagreed with a teammate. What happened?", keywords: ["team", "listened", "discussed", "agreed", "resolved", "compromise"], tip: "Show listening first, then the decision, then the outcome." },
    { q: "Why do you want this internship, and what will you bring to the team?", keywords: ["learn", "contribute", "team", "project", "skill"], tip: "Connect one of their needs to one thing you have actually built." },
    { q: "How do you approach learning a technology you have never used before?", keywords: ["documentation", "small", "project", "practice", "build"], tip: "Show a repeatable method: docs → tiny build → bigger build." },
    { q: "Tell me about a time you missed a deadline or failed at something. What did you do next?", keywords: ["failed", "missed", "learned", "plan", "next", "fixed"], tip: "Own it briefly, then spend most of the answer on the fix." },
    { q: "What questions do you have for us?", keywords: ["team", "learn", "project", "mentor", "growth"], tip: "Ask about the team, mentorship, and what success looks like in the role." },
  ],
  "Data Analyst": [
    { q: "Tell me about yourself.", keywords: ["data", "project", "analysis", "learn", "student"], tip: "Lead with the data work you have actually done." },
    { q: "Walk me through a dataset you explored. What did you find?", keywords: ["data", "clean", "pattern", "insight", "chart", "found"], tip: "Name the dataset, the cleaning step, and one surprising finding." },
    { q: "How would you explain a chart to someone who has never seen data before?", keywords: ["simple", "example", "trend", "means"], tip: "One sentence on what the chart shows, one on why it matters." },
    { q: "Describe a time your first analysis was wrong. How did you catch it?", keywords: ["checked", "wrong", "verified", "fixed", "learned"], tip: "Show your verification habit — that is the skill being tested." },
    { q: "Why this role, and what will you bring to the team?", keywords: ["learn", "contribute", "data", "team", "skill"], tip: "Tie one of their needs to one analysis you have done." },
    { q: "How do you prioritise when you have three analyses due the same day?", keywords: ["ask", "prioritise", "impact", "deadline", "communicate"], tip: "Impact first, then ask the stakeholder to confirm the order." },
  ],
  "Product / General": [
    { q: "Tell me about yourself.", keywords: ["student", "project", "built", "learn", "interest"], tip: "Present → past evidence → future goal, in under 90 seconds." },
    { q: "Tell me about a product you love and one thing you would improve about it.", keywords: ["user", "problem", "improve", "because", "feature"], tip: "Name the user, the pain, then your change and why it helps." },
    { q: "Describe a time you had to convince others to try your idea.", keywords: ["listened", "evidence", "tried", "result", "feedback"], tip: "Evidence persuades: a small test beats a long argument." },
    { q: "How do you handle feedback you disagree with?", keywords: ["listen", "understand", "discuss", "decide", "learn"], tip: "Listen fully first, then discuss the trade-off calmly." },
    { q: "Why this role, and what will you bring?", keywords: ["learn", "contribute", "team", "skill", "project"], tip: "One real example beats three adjectives." },
    { q: "Tell me about a time you failed and what you changed afterwards.", keywords: ["failed", "learned", "changed", "next", "plan"], tip: "Short on the failure, long on the change." },
  ],
  "Tutor / Teaching": [
    { q: "Tell me about yourself and your teaching experience.", keywords: ["tutor", "student", "taught", "helped", "learn"], tip: "State your subject, your experience, and one student outcome." },
    { q: "How would you explain a difficult topic to a student who is stuck?", keywords: ["example", "simple", "step", "practice", "patience"], tip: "Break it into the smallest step they can do, then build up." },
    { q: "Describe a time a student did not understand you. What did you change?", keywords: ["listened", "different", "example", "tried", "worked"], tip: "Show you changed your approach, not the student." },
    { q: "How do you keep a student motivated when the topic is hard?", keywords: ["progress", "small", "encourage", "goal", "celebrate"], tip: "Small visible wins keep motivation alive." },
    { q: "Why do you want to tutor with us?", keywords: ["help", "student", "learn", "subject", "impact"], tip: "Connect your own learning journey to the students you will help." },
    { q: "How do you plan a lesson for a student you have never met?", keywords: ["ask", "level", "goal", "plan", "check"], tip: "Assess first, then plan: level → goal → steps → check." },
  ],
};
export const ACTION_VERBS = ["built", "created", "designed", "developed", "led", "launched", "improved", "automated", "shipped", "delivered", "organised", "organized", "mentored", "taught", "analysed", "analyzed", "implemented", "optimised", "optimized", "reduced", "increased", "won", "presented", "collaborated", "deployed", "tested", "fixed", "researched", "decided", "talked", "asked", "chose", "started"];
export const WEAK_PHRASES = ["responsible for", "helped with", "worked on", "involved in", "duties included", "assisted with"];
export const FILLERS = ["um", "uh", "like", "you know", "basically", "actually", "literally", "sort of", "kind of"];

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
  const hasSituation = sentences.some((s) => /\b(when|while|during|at (my|the|our)|in my)\b/i.test(s));
  const actionRe = new RegExp(`\\bi\\s+(${ACTION_VERBS.map(escapeRegExp).join("|")}|reached\\s+out)\\b`, "i");
  const hasAction = sentences.some((s) => actionRe.test(s));
  const resultRe = /\b(result|outcome|improved|reduced|increased|learned|passed|won|shipped|delivered|score)\b/i;
  const hasGenuineResult = sentences.some((s) => resultRe.test(s)) && (hasOutcomeNumber(text) || /\bi learned (that|to|how)\b/i.test(text) || /\b(improved|reduced|increased|cut|saved|grew)\b[^.]{0,40}\b(by|from|to)\b/i.test(text));
  const hasResult = hasGenuineResult;
  const star = hasSituation && hasAction && hasResult;
  const keywordHits = keywords.filter((k) => hasPhrase(text, k));
  const actionVerbHits = ACTION_VERBS.filter((v) => wordSet.includes(v) || sentences.some((s) => new RegExp(`\\bi\\s+${escapeRegExp(v)}\\b`, "i").test(s)));
  const verbInSentence = (v: string) => sentences.some((s) => new RegExp(`\\bi\\s+${escapeRegExp(v)}\\b`, "i").test(s));
  const verbHits = ACTION_VERBS.filter((v) => verbInSentence(v));
  const lengthScore = wordCount >= 60 ? 25 : wordCount >= 30 ? 15 : wordCount >= 10 ? 6 : 0;
  const starScore = star ? 25 : (hasSituation ? 8 : 0) + (hasAction ? 10 : 0) + (hasResult ? 7 : 0);
  const keywordScore = Math.min(20, Math.round((keywordHits.length / Math.max(1, keywords.length)) * 20));
  const verbScore = Math.min(12, verbHits.length * 4);
  const numberScore = hasOutcomeNumber(text) ? 8 : 0;
  const fillerScore = fillerCount === 0 && wordCount > 0 ? 10 : fillerCount <= 2 ? 6 : 0;
  const breakdown = { length: lengthScore, star: starScore, keywords: keywordScore, verbs: verbScore, number: numberScore, filler: fillerScore };
  const score = Math.min(100, lengthScore + starScore + keywordScore + verbScore + numberScore + fillerScore);
  const feedback: string[] = [];
  if (wordCount < 10) feedback.push("Too short — aim for at least 60 words (about 45–60 seconds spoken).");
  else if (wordCount < 30) feedback.push("Still thin — aim for 60–120 words with one concrete example.");
  else if (wordCount < 60) feedback.push("Add a bit more — a concrete example with a number lifts this a lot.");
  else if (wordCount > 220) feedback.push("Long answer — trim to the strongest example and stop.");
  if (!hasSituation) feedback.push("Set the scene in one line: when and where this happened.");
  if (!hasAction) feedback.push("Say what YOU did — one sentence starting “I …”.");
  if (!hasResult) feedback.push("Close with the result: what changed, or what you learned — with a number if you can.");
  if (keywordHits.length < Math.ceil(keywords.length / 2)) feedback.push("Answer the question more directly — the interviewer is listening for the question's key ideas.");
  if (verbHits.length === 0) feedback.push("Use action verbs (built, led, fixed, organised) to show your part.");
  else if (verbHits.length === 1) feedback.push("Use a second action verb to show more of what you did.");
  if (!hasOutcomeNumber(text)) feedback.push("Add one number tied to an outcome (users, marks, time saved) — a bare date or count is not enough.");
  if (fillerCount > 2) feedback.push(`Cut the fillers — you used ${fillerCount}. Pause instead of saying “um” or “like”.`);
  const strengths: string[] = [];
  if (wordCount >= 60 && wordCount <= 220) strengths.push("Good length — enough detail without rambling.");
  if (star) strengths.push("Clear STAR structure — situation, action and result are all present.");
  else if (hasSituation && hasAction) strengths.push("Situation and action are clear — add the result to complete STAR.");
  if (keywordHits.length >= Math.ceil(keywords.length / 2)) strengths.push("Good coverage of the question's key ideas.");
  if (verbHits.length >= 2) strengths.push(`Strong action verbs (${verbHits.slice(0, 3).join(", ")}).`);
  if (hasOutcomeNumber(text)) strengths.push("Includes a quantified outcome — that builds credibility.");
  if (fillerCount === 0 && wordCount > 0) strengths.push("No filler words — clean, confident delivery.");
  if (feedback.length === 0) strengths.push("Strong answer — keep this structure for the real interview.");
  return { score, wordCount, fillerCount, structure: { star, hasSituation, hasAction, hasResult }, keywordHits, keywordTotal: keywords.length, actionVerbHits, hasNumber: hasOutcomeNumber(text), feedback, strengths, breakdown };
}
export type CvReport = {
  score: number;
  wordCount: number;
  sections: { name: string; found: boolean }[];
  hasEmail: boolean;
  hasPhone: boolean;
  hasLink: boolean;
  actionVerbCount: number;
  quantifiedCount: number;
  weakPhrases: string[];
  issues: string[];
  wins: string[];
};

export function analyseCv(text: string): CvReport {
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const hasEmail = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(text);
  const hasPhone = /(\+?\d[\d\s-]{7,}\d)/.test(text);
  const hasLink = /https?:\/\/|github\.com|linkedin\.com|portfolio|website/.test(lower);
  const scrubbed = text
    .replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, " ")
    .replace(/(\+?\d[\d\s-]{7,}\d)/g, " ")
    .replace(/https?:\/\/\S+|github\.com\/\S+|linkedin\.com\/\S+/g, " ");
  const unitHits = OUTCOME_UNITS.filter((u) => new RegExp(`\\b\\d[\\d,]*\\s*${escapeRegExp(u)}\\b`, "i").test(scrubbed));
  const verbRe = new RegExp(`\\b(${ACTION_VERBS.map(escapeRegExp).join("|")})\\b`, "gi");
  const verbs = [...new Set((scrubbed.match(verbRe) || []).map((v) => v.toLowerCase()))];
  const hasHeading = (re: RegExp) => re.test(lower);
  const SKILL_WORDS = ["react", "python", "javascript", "typescript", "excel", "sql", "communication", "leadership", "next", "node", "html", "css", "git", "figma", "canva", "c", "java"];
  const sectionDefs = [
    { name: "Contact details", found: hasEmail || hasPhone },
    { name: "Education", found: hasHeading(/education|degree|university|college|school|bachelor|bsc|bscs|ba\b|msc|ma\b/) },
    { name: "Experience", found: hasHeading(/experience|work|job|internship|role|position|volunteer|tutor/) },
    { name: "Projects", found: hasHeading(/project|built|developed|created|portfolio/) },
    { name: "Skills", found: SKILL_WORDS.some((w) => new RegExp(`\\b${escapeRegExp(w)}\\b`, "i").test(lower)) },
  ];
  const sections = sectionDefs.map(({ name, found }) => ({ name, found }));
  const weak = WEAK_PHRASES.filter((p) => lower.includes(p));
  const quantified = unitHits.length + (verbs.length > 0 && /\d/.test(scrubbed) ? 0 : 0);
  let score =
    (hasEmail || hasPhone ? 15 : 0) +
    (hasLink ? 10 : 0) +
    Math.min(25, sections.filter((s) => s.found).length * 5) +
    Math.min(20, verbs.length * 4) +
    Math.min(15, quantified * 5) +
    (words.length >= 150 ? 15 : words.length >= 80 ? 8 : words.length >= 40 ? 3 : 0);
  if (words.length < 60) score = Math.min(score, 34);
  if (words.length > 800) score = Math.min(score, 60);
  score = Math.max(0, Math.min(100, score));
  const issues: string[] = [];
  if (!hasEmail && !hasPhone) issues.push("Add contact details — an email address and phone number at the top.");
  if (!hasLink) issues.push("Add a link to a portfolio, GitHub or LinkedIn profile.");
  const missing = sections.filter((s) => !s.found).map((s) => s.name);
  if (missing.length) issues.push(`Missing sections: ${missing.join(", ")}.`);
  if (verbs.length < 3) issues.push("Use more action verbs — start bullets with built, led, improved, organised.");
  if (quantified < 2) issues.push("Quantify your impact — add numbers to at least two achievements.");
  if (words.length < 150) issues.push("Your CV is short — aim for 150–300 words with enough detail.");
  if (words.length > 400) issues.push("Your CV is long — trim to under 400 words and keep only the strongest bullets.");
  if (!issues.length) issues.push("Strong CV — check the details, then tailor it to each role.");
  const wins: string[] = [];
  if (hasEmail || hasPhone) wins.push("Contact details are present.");
  if (hasLink) wins.push("A portfolio or profile link is included.");
  if (verbs.length >= 3) wins.push(`${verbs.length} action verbs found.`);
  if (quantified >= 2) wins.push(`${quantified} quantified achievements found.`);
  if (sections.filter((s) => s.found).length >= 4) wins.push("Most sections are covered.");
  return { score, wordCount: words.length, sections, hasEmail, hasPhone, hasLink, actionVerbCount: verbs.length, quantifiedCount: quantified, weakPhrases: weak, issues, wins };
}
export function buildPlan(role: string, weeks: number, hoursPerWeek: number) {
  const today = new Date();
  const perDay = Math.max(20, Math.round((hoursPerWeek * 60) / 7));
  const days = [
    { day: 1, title: "Pick your target role", task: `Write down the ${role} role you are aiming for and three skills it needs most.` },
    { day: 2, title: "CV health check", task: "Run your CV through the CV Scorecard and fix the top issue it reports." },
    { day: 3, title: "Tell me about yourself", task: "Write a 60–90 second answer, then say it out loud twice." },
    { day: 4, title: "Mock interview 1", task: "Answer 3 interview questions in the Interview Studio and read every line of feedback." },
    { day: 5, title: "Build your STAR story", task: "Write one STAR story from a real project or class experience." },
    { day: 6, title: "Fix one weak answer", task: "Take your lowest-scoring mock answer and rewrite it with an action verb and a number." },
    { day: 7, title: "Research the role", task: "Read one real job description for your target role and note the 5 skills it asks for most." },
    { day: 8, title: "STAR story 2", task: "Write a second STAR story — this time about a time something went wrong." },
    { day: 9, title: "CV pass 2", task: "Re-score your CV after yesterday's fixes and aim for +5 points." },
    { day: 10, title: "Mock interview 2", task: "Do a full mock interview. Compare your score with mock 1." },
    { day: 11, title: "Apply for real", task: "Apply to one real role or internship with a tailored CV." },
    { day: 12, title: "Tell a friend", task: "Explain your best STAR story to a friend in under 2 minutes and ask what was unclear." },
    { day: 13, title: "Numbers day", task: "Add a number to every bullet on your CV — users, marks, time saved, items fixed." },
    { day: 14, title: "Rest + review", task: "Re-read your best answers. Rest — recovery is part of preparation." },
    { day: 15, title: "STAR story 3", task: "Write a STAR story about helping or leading a team." },
    { day: 16, title: "Mock interview 3", task: "Do a full mock. This time, pause instead of saying “um” or “like”." },
    { day: 17, title: "CV tailoring", task: "Tailor your CV to one real job advert — change at least 5 lines." },
    { day: 18, title: "Teach it back", task: "Teach a friend one concept from your field in 5 minutes." },
    { day: 19, title: "Apply again", task: "Apply to a second real role, or follow up on the first." },
    { day: 20, title: "Fix the weakest area", task: "Look at your lowest rubric breakdown area and drill it for one session." },
    { day: 21, title: "Rest + review", task: "Review all your STAR stories. Cut any sentence that does not add evidence." },
    { day: 22, title: "Mock interview 4", task: "Full mock interview. Aim for 70+ and zero filler words." },
    { day: 23, title: "Portfolio check", task: "Make sure your GitHub or portfolio link works and shows your best project first." },
    { day: 24, title: "STAR story 4", task: "Write a STAR story about learning something new quickly." },
    { day: 25, title: "CV final pass", task: "Read your CV out loud. Fix typos, weak phrases and vague bullets." },
    { day: 26, title: "Interview questions for them", task: "Write 3 smart questions to ask the interviewer at the end." },
    { day: 27, title: "Mock interview 5", task: "Final full mock. Time yourself — 2 minutes per answer, no notes." },
    { day: 28, title: "Rest + review", task: "Light review only. Sleep well — cramming now hurts more than it helps." },
    { day: 29, title: "Apply to 3 roles", task: "Apply to 3 real roles that match your level. Save the adverts." },
    { day: 30, title: "Interview day prep", task: "Pack your bag, confirm the time and place, and re-read your STAR stories once." },
  ];
  return days.map((d) => {
    const date = new Date(today);
    date.setDate(today.getDate() + d.day - 1);
    return { ...d, date: date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }), minutes: perDay };
  });
}
