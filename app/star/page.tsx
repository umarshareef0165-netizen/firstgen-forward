"use client";
import { useMemo, useState } from "react";

export default function StarPage() {
  const [situation, setSituation] = useState("");
  const [task, setTask] = useState("");
  const [action, setAction] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const answer = useMemo(() => {
    const parts = [
      situation.trim() ? `In ${situation.trim()}` : "",
      task.trim() ? `My task was to ${task.trim()}` : "",
      action.trim() ? `I ${action.trim()}` : "",
      result.trim() ? `As a result, ${result.trim()}` : "",
    ].filter(Boolean);
    return parts.join(" ");
  }, [situation, task, action, result]);
  const words = answer ? answer.split(/\s+/).length : 0;
  const done = [situation, task, action, result].filter((x) => x.trim().length > 3).length;

  async function copy() {
    try { await navigator.clipboard.writeText(answer); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard unavailable */ }
  }
  function loadExample() {
    setSituation("my final-year project team had two weeks left and our crop-advisory app kept crashing when farmers uploaded photos.");
    setTask("make the upload reliable before our demo day.");
    setAction("traced the crash to uncompressed images, added client-side compression, and tested uploads on a slow connection with 20 photos.");
    setResult("uploads stopped crashing, the demo ran cleanly, and the app was submitted on time.");
  }

  return (
    <>
      <p className="kicker">STAR Answer Builder</p>
      <h1>Turn one real experience into an interview story.</h1>
      <p className="muted">Interviewers remember stories, not adjectives. Fill in the four boxes from something you actually did — a project, a job, a class, tutoring — and the builder assembles a structured answer you can say in about 60 seconds.</p>

      <div className="grid c2">
        <div>
          <label htmlFor="situation">S — Situation: where and when?</label>
          <textarea id="situation" value={situation} onChange={(e) => setSituation(e.target.value)} placeholder="e.g. my final-year project team had two weeks left and…" style={{ minHeight: 80 }} />
          <label htmlFor="task">T — Task: what was your job?</label>
          <textarea id="task" value={task} onChange={(e) => setTask(e.target.value)} placeholder="e.g. make the photo upload reliable before demo day…" style={{ minHeight: 80 }} />
          <label htmlFor="action">A — Action: what did YOU do?</label>
          <textarea id="action" value={action} onChange={(e) => setAction(e.target.value)} placeholder="e.g. traced the crash, added compression, tested 20 uploads…" style={{ minHeight: 80 }} />
          <label htmlFor="result">R — Result: what changed?</label>
          <textarea id="result" value={result} onChange={(e) => setResult(e.target.value)} placeholder="e.g. uploads stopped crashing and the demo ran cleanly…" style={{ minHeight: 80 }} />
          <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
            <button className="btn ghost" style={{ color: "var(--ink)", border: "1px solid var(--line)", background: "#fff" }} type="button" onClick={loadExample}>Load an example</button>
            <button className="btn ghost" style={{ color: "var(--ink)", border: "1px solid var(--line)", background: "#fff" }} type="button" onClick={() => { setSituation(""); setTask(""); setAction(""); setResult(""); }}>Clear</button>
          </div>
        </div>
        <div>
          <div className="card" aria-live="polite">
            <p className="kicker">Your answer · {done}/4 parts filled · {words} words</p>
            {answer ? <p style={{ fontSize: "1.05rem" }}>{answer}</p> : <p className="muted">Your assembled answer will appear here as you type.</p>}
            <p>
              <span className={`pill ${words >= 60 && words <= 140 ? "good" : "warn"}`}>
                {words === 0 ? "Aim for 60–140 words (about 60 seconds spoken)" : words < 60 ? "A little short — add detail to the Action" : words > 140 ? "A little long — trim the Situation" : "Good length — about 60 seconds spoken"}
              </span>
            </p>
            <button className="btn secondary" type="button" onClick={copy} disabled={!answer}>{copied ? "Copied ✓" : "Copy my answer"}</button>
          </div>
          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>STAR checklist</h3>
            <ul className="tight">
              <li>{situation.trim() ? "✅" : "⬜"} Situation — one line, place and time</li>
              <li>{task.trim() ? "✅" : "⬜"} Task — your responsibility, not the team’s</li>
              <li>{action.trim() ? "✅" : "⬜"} Action — sentences starting with “I …”</li>
              <li>{result.trim() ? "✅" : "⬜"} Result — a change, a number, or a lesson</li>
            </ul>
            <p className="muted" style={{ marginBottom: 0 }}>Then practise it in the <a href="/interview">Mock Interview Studio</a> — paste it as an answer and check the score.</p>
          </div>
        </div>
      </div>
    </>
  );
}
