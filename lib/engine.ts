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

export const ACTION_VERBS = ["built", "created", "designed", "developed", "led", "launched", "improved", "automated", "shipped", "delivered", "organised", "organized", "mentored", "taught", "analysed", "analyzed", "implemented", "optimised", "optimized", "reduced", "increased", "won", "presented", "collaborated", "deployed", "tested", "fixed", "researched"];
export const WEAK_PHRASES = ["responsible for", "helped with", "worked on", "involved in", "duties included", "assisted with"];
export const FILLERS = ["um", "uh", "like", "you know", "basically", "actually", "literally", "sort of", "kind of"];

export type Rubric = {
  score: number;
  wordCount: number;
  fillerCount: number;
  structure: { star: boolean; hasSituation: boolean; hasAction: boolean; hasResult: boolean };
  keywordHits: string[];
  keywordTotal: number;
  actionVerbHits: string[];
  hasNumber: boolean;
  feedback: string[];
  strengths: string[];
};

export function scoreAnswer(answer: string, keywords: string[]): Rubric {
  const text = answer.trim();
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const fillerCount = FILLERS.reduce((n, f) => {
    const m = lower.match(new RegExp(`\\b${f.replace(" ", "\\s+")}\\b`, "g"));
    return n + (m ? m.length : 0);
  }, 0);
  const hasSituation = /\b(when|while|at (my|the|our)|during|in my)\b/.test(lower);
  const hasAction = /\b(i (built|created|designed|decided|led|fixed|talked|asked|organised|organized|implemented|chose|started|reached out))\b/.test(lower);
  const hasResult = /\b(result|outcome|improved|reduced|increased|learned|worked|passed|won|shipped|delivered|users|score)\b/.test(lower);
  const star = hasSituation && hasAction && hasResult;
  const keywordHits = keywords.filter((k) => lower.includes(k.toLowerCase()));
  const actionVerbHits = ACTION_VERBS.filter((v) => lower.includes(v));
  const hasNumber = /\d/.test(text);
  let score = 0;
  if (wordCount >= 60) score += 25; else if (wordCount >= 30) score += 15; else if (wordCount >= 10) score += 6;
  if (star) score += 25; else if (hasAction && hasResult) score += 14; else if (hasAction) score += 7;
  score += Math.round((keywordHits.length / Math.max(1, keywords.length)) * 20);
  if (actionVerbHits.length >= 2) score += 12; else if (actionVerbHits.length === 1) score += 6;
  if (hasNumber) score += 8;
  if (fillerCount === 0 && wordCount > 0) score += 10; else if (fillerCount <= 2) score += 5;
  score = Math.min(100, score);
  const feedback: string[] = [];
  const strengths: string[] = [];
  if (wordCount < 30) feedback.push("Answer is too short — aim for 60–120 words (about 45–60 seconds spoken) with one concrete example.");
  if (!hasSituation) feedback.push("Add a one-line situation: where and when this happened.");
  if (!hasAction) feedback.push("Say what YOU did — start action sentences with “I …”.");
  if (!hasResult) feedback.push("Close with the result: what changed, what you learned, or a number.");
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
  return { score, wordCount, fillerCount, structure: { star, hasSituation, hasAction, hasResult }, keywordHits, keywordTotal: keywords.length, actionVerbHits, hasNumber, feedback, strengths };
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
  const sectionDefs = [
    { name: "Contact / header", test: /@|phone|\+?\d[\d\s-]{7,}/ },
    { name: "Education", test: /education|bachelor|bsc|bscs|university|degree|gpa|cgpa/ },
    { name: "Experience", test: /experience|intern|work|job|tutor|developer/ },
    { name: "Projects", test: /project|built|github|portfolio/ },
    { name: "Skills", test: /skills|react|python|javascript|typescript|node/ },
  ];
  const sections = sectionDefs.map((s) => ({ name: s.name, found: s.test.test(lower) }));
  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/.test(lower);
  const hasPhone = /\+?\d[\d\s-]{8,}/.test(text);
  const hasLink = /github\.com|linkedin\.com|vercel\.app|https?:\/\//.test(lower);
  const verbs = ACTION_VERBS.filter((v) => lower.includes(v));
  const quantified = (text.match(/\d+\s?(%|\+|x|users|students|projects|hours|days|gb|ms)?/gi) || []).length;
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

export function buildPlan(role: string, weeks: number, hoursPerWeek: number): { day: number; title: string; task: string; minutes: number }[] {
  const days = weeks * 7;
  const perDay = Math.max(20, Math.round((hoursPerWeek * 60) / 7));
  const cycle: { title: string; task: string }[] = [
    { title: "Mock interview", task: `Answer 3 ${role} interview questions out loud in the Interview Studio and review the rubric feedback.` },
    { title: "CV polish", task: "Rewrite one CV bullet with an action verb and a number, then re-run the CV Scorecard." },
    { title: "STAR story", task: "Write one STAR story from a real project or class experience in the STAR Builder." },
    { title: "Skill drill", task: "Build or fix one small thing in your stack (a component, a script, a query) and note what you learned." },
    { title: "Research the role", task: "Read one real job description for your target role and list the 5 skills it asks for most." },
    { title: "Application day", task: "Apply to one real opportunity with a tailored CV, or message one person for advice." },
    { title: "Rest + review", task: "Re-read your best STAR answer and your top-scored mock answer. Rest — recovery is part of preparation." },
  ];
  return Array.from({ length: days }, (_, i) => ({ day: i + 1, ...cycle[i % cycle.length], minutes: perDay }));
}
