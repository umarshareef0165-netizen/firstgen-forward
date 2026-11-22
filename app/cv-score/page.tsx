"use client";
import { useState } from "react";
import { analyseCv, type CvReport } from "../../lib/engine";

const SAMPLE = `Your Name
you@example.com | +1 (555) 010-0000 | github.com/your-username
Education: BSc Computer Science, Example University, 2023–2027
Experience: Private Tutor (1 year) — taught programming to school students.
Projects: Study Planner App — built a revision planner for classmates. CV Helper — built a tool that scores CVs.
Skills: React, Next.js, TypeScript, Python, Node.js, Supabase, Vercel`;

export default function CvPage() {
  const [text, setText] = useState("");
  const [report, setReport] = useState<CvReport | null>(null);
  function run() { if (text.trim().length > 20) setReport(analyseCv(text)); }
  function ringClass(s: number) { return s >= 70 ? "" : s >= 45 ? "mid" : "low"; }
  return (
    <>
      <p className="kicker">CV Scorecard</p>
      <h1>Is your CV doing the talking for you?</h1>
      <p className="muted">Paste your CV as plain text. You get a 0–100 score with a prioritised fix list. Nothing is uploaded — the check runs entirely in your browser. Tip: copy from your PDF or document and paste it here.</p>
      <label htmlFor="cv">Your CV text</label>
      <textarea id="cv" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your CV text here…" style={{ minHeight: 220 }} />
      <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
        <button className="btn" type="button" onClick={run} disabled={text.trim().length <= 20}>Score my CV</button>
        <button className="btn ghost" style={{ color: "var(--ink)", border: "1px solid var(--line)", background: "#fff" }} type="button" onClick={() => setText(SAMPLE)}>Try a sample CV</button>
        <button className="btn ghost" style={{ color: "var(--ink)", border: "1px solid var(--line)", background: "#fff" }} type="button" onClick={() => { setText(""); setReport(null); }}>Clear</button>
      </div>

      {report && (
        <section className="section" aria-live="polite">
          <h2>Your CV score</h2>
          <div className="grid c2">
            <div className="card" style={{ textAlign: "center" }}>
              <div className={`score-ring ${ringClass(report.score)}`} role="img" aria-label={`CV score ${report.score} out of 100`}>{report.score}</div>
              <p style={{ marginTop: ".8rem" }}><strong>{report.score >= 70 ? "Strong CV — polish the details" : report.score >= 45 ? "Solid base — fix the top issues" : "Needs real work — start at the top of the list"}</strong></p>
              <p className="muted">{report.wordCount} words · {report.actionVerbCount} action verbs · {report.quantifiedCount} quantified achievements</p>
              <p>
                <span className={`pill ${report.hasEmail ? "good" : "bad"}`}>Email: {report.hasEmail ? "found" : "missing"}</span>{" "}
                <span className={`pill ${report.hasLink ? "good" : "bad"}`}>Portfolio link: {report.hasLink ? "found" : "missing"}</span>
              </p>
            </div>
            <div className="card">
              <h3>Sections found</h3>
              <ul className="tight">{report.sections.map((s) => <li key={s.name}>{s.found ? "✅" : "❌"} {s.name}</li>)}</ul>
              <h3 style={{ marginTop: "1rem" }}>Fix these first</h3>
              {report.issues.length ? <ol className="tight">{report.issues.map((f, i) => <li key={i}>{f}</li>)}</ol> : <p>Nothing to fix — this CV covers the essentials.</p>}
            </div>
          </div>
          {report.wins.length > 0 && (
            <div className="card" style={{ marginTop: "1rem" }}>
              <h3>What is already working</h3>
              <ul className="tight">{report.wins.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </div>
          )}
          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>How to write a bullet that scores</h3>
            <p className="muted">Weak: "Helped with the website." Strong: "Built the booking page in React, cutting load time from 4s to 1.2s for 200 monthly visitors." Formula: <strong>action verb + what you built + result with a number</strong>.</p>
          </div>
        </section>
      )}
    </>
  );
}
