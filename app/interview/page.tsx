"use client";
import { useEffect, useRef, useState } from "react";
import { QUESTION_BANK, scoreAnswer, type Rubric } from "../../lib/engine";

type Attempt = { role: string; question: string; answer: string; score: number; date: string };

export default function InterviewPage() {
  const roles = Object.keys(QUESTION_BANK);
  const [role, setRole] = useState(roles[0]);
  const [qi, setQi] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<Rubric | null>(null);
  const [history, setHistory] = useState<Attempt[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try { setHistory(JSON.parse(localStorage.getItem("fgf-history") || "[]")); } catch { /* empty */ }
  }, []);
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (timerRef.current) clearInterval(timerRef.current);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running]);

  const questions = QUESTION_BANK[role];
  const qiClamped = Math.min(qi, questions.length - 1);
  const current = questions[qiClamped];
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  function newQuestion(nextRole = role, nextQi?: number) {
    let next = nextQi;
    if (next === undefined) {
      do {
        next = Math.floor(Math.random() * questions.length);
      } while (next === qi && questions.length > 1);
    }
    setQi(next);
    setResult(null);
    setAnswer("");
    setSeconds(0);
    setRunning(true);
  }
  function submit() {
    if (answer.trim().split(/\s+/).length < 3) return;
    setRunning(false);
    const r = scoreAnswer(answer, current.keywords);
    setResult(r);
    const attempt: Attempt = { role, question: current.q, answer: answer.trim(), score: r.score, date: new Date().toLocaleString() };
    const next = [attempt, ...history].slice(0, 12);
    setHistory(next);
    try { localStorage.setItem("fgf-history", JSON.stringify(next)); } catch { /* storage unavailable */ }
  }
  function ringClass(s: number) { return s >= 70 ? "" : s >= 45 ? "mid" : "low"; }

  return (
    <>
      <p className="kicker">Mock Interview Studio</p>
      <h1>Practise out loud. Get honest feedback.</h1>
      <p className="muted">Answer each question in 60–120 words. The timer starts automatically with each question — pause it any time. Scores are out of 100 — aim for 70+.</p>

      <div className="grid c2">
        <div>
          <label htmlFor="role">Target role</label>
          <select id="role" value={role} onChange={(e) => { setRole(e.target.value); setQi(0); setRunning(true); }}>
            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <div style={{ display: "flex", gap: ".6rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <button className="btn secondary" type="button" onClick={() => newQuestion()}>New question</button>
            <button className="btn ghost" style={{ color: "var(--ink)", border: "1px solid var(--line)", background: "#fff" }} type="button" onClick={() => setRunning(!running)}>{running ? "Pause timer" : "Resume timer"}</button>
          </div>
          <p style={{ marginTop: "1rem" }}>Timer: <span className="timer" aria-live="off">{mm}:{ss}</span> <span className="muted">(aim: under 01:30 per answer)</span></p>
        </div>
        <div className="qbox" aria-live="polite">
          <p className="kicker">Question {qiClamped + 1} of {questions.length}</p>
          <h2 style={{ fontSize: "1.35rem" }}>{current.q}</h2>
          <p className="muted" style={{ marginBottom: 0 }}>Interviewer tip: {current.tip}</p>
        </div>
      </div>

      <label htmlFor="answer">Your answer</label>
      <textarea id="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer here — as you would say it in the interview…" aria-describedby="wordcount" />
      <p id="wordcount" className="muted">{answer.trim() ? answer.trim().split(/\s+/).length : 0} words</p>
      <button className="btn" type="button" onClick={submit} disabled={answer.trim().split(/\s+/).filter(Boolean).length < 3}>Score my answer</button>
      {result && (
        <section className="section" aria-live="polite">
          <h2>Your rubric score</h2>
          <div className="grid c2">
            <div className="card" style={{ textAlign: "center" }}>
              <div className={`score-ring ${ringClass(result.score)}`} role="img" aria-label={`Score ${result.score} out of 100`}>{result.score}</div>
              <p style={{ marginTop: ".8rem" }}><strong>{result.score >= 70 ? "Interview-ready answer" : result.score >= 45 ? "Good start — fix one thing" : "Needs a rewrite — see below"}</strong></p>
              <p className="muted">{result.wordCount} words · {result.fillerCount} filler word{result.fillerCount === 1 ? "" : "s"} · key ideas covered {result.keywordHits.length}/{result.keywordTotal}</p>
            </div>
            <div className="card">
              <h3>What to fix next</h3>
              {result.feedback.length ? <ul className="tight">{result.feedback.map((f, i) => <li key={i}>{f}</li>)}</ul> : <p>Nothing to fix — this answer is solid.</p>}
              <h3 style={{ marginTop: "1rem" }}>What worked</h3>
              <ul className="tight">{result.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
              <p style={{ marginTop: "1rem" }}>
                <span className="pill good">STAR structure: {result.structure.star ? "yes" : "no"}</span>{" "}
                <span className="pill good">Action verbs: {result.actionVerbHits.length ? result.actionVerbHits.slice(0, 3).join(", ") : "none"}</span>{" "}
                <span className="pill good">Number included: {result.hasNumber ? "yes" : "no"}</span>
              </p>
              <button className="btn secondary small" type="button" onClick={() => newQuestion()}>Try another question →</button>
            </div>
          </div>
        </section>
      )}

      {history.length > 0 && (
        <section className="section">
          <h2>Your practice history <span className="muted" style={{ fontSize: ".9rem" }}>(saved only in this browser)</span></h2>
          <div className="grid c2">
            {history.map((h, i) => (
              <div className="card" key={i}>
                <p><span className={`pill ${h.score >= 70 ? "good" : h.score >= 45 ? "warn" : "bad"}`}>{h.score}/100</span> <strong>{h.role}</strong></p>
                <p className="muted" style={{ marginBottom: ".3rem" }}>{h.question}</p>
                <p style={{ fontSize: ".92rem", marginBottom: ".3rem" }}>{h.answer.slice(0, 180)}{h.answer.length > 180 ? "…" : ""}</p>
                <p className="muted" style={{ fontSize: ".82rem", margin: 0 }}>{h.date}</p>
              </div>
            ))}
          </div>
          <button className="btn ghost" style={{ color: "var(--ink)", border: "1px solid var(--line)", background: "#fff" }} type="button" onClick={() => { setHistory([]); try { localStorage.removeItem("fgf-history"); } catch { /* ignore */ } }}>Clear history</button>
        </section>
      )}
    </>
  );
}
