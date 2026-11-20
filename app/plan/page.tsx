"use client";
import { useEffect, useMemo, useState } from "react";
import { buildPlan } from "../../lib/engine";

export default function PlanPage() {
  const [role, setRole] = useState("Software Engineer Intern");
  const [weeks, setWeeks] = useState(4);
  const [hours, setHours] = useState(7);
  const [made, setMade] = useState(false);
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const plan = useMemo(() => (made ? buildPlan(role, weeks, hours) : []), [made, role, weeks, hours]);
  const doneCount = plan.filter((d) => checked[d.day]).length;

  useEffect(() => {
    try { setChecked(JSON.parse(localStorage.getItem("fgf-plan") || "{}")); } catch { /* empty */ }
  }, []);
  function toggle(day: number) {
    const next = { ...checked, [day]: !checked[day] };
    setChecked(next);
    try { localStorage.setItem("fgf-plan", JSON.stringify(next)); } catch { /* ignore */ }
  }

  return (
    <>
      <p className="kicker">30-Day Readiness Plan</p>
      <h1>A little every day beats a panic weekend.</h1>
      <p className="muted">Tell it your target role and how many hours a week you can give. It builds a day-by-day plan — mock interviews, CV polish, STAR stories, skill drills, applications and rest. Checkboxes save in your browser.</p>

      <div className="card">
        <div className="grid c3">
          <div>
            <label htmlFor="role">Target role</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option>Software Engineer Intern</option>
              <option>Data Analyst</option>
              <option>Product / General</option>
              <option>Tutor / Teaching</option>
            </select>
          </div>
          <div>
            <label htmlFor="weeks">Weeks until the interview or deadline</label>
            <input id="weeks" type="number" min={1} max={8} value={weeks} onChange={(e) => setWeeks(Math.max(1, Math.min(8, Number(e.target.value) || 1)))} />
          </div>
          <div>
            <label htmlFor="hours">Hours you can give per week</label>
            <input id="hours" type="number" min={2} max={30} value={hours} onChange={(e) => setHours(Math.max(2, Math.min(30, Number(e.target.value) || 2)))} />
          </div>
        </div>
        <button className="btn" type="button" onClick={() => setMade(true)} style={{ marginTop: "1rem" }}>Build my plan</button>
      </div>

      {made && plan.length > 0 && (
        <section className="section" aria-live="polite">
          <h2>Your {weeks}-week plan · {role}</h2>
          <div className="progress-label"><span>{doneCount} of {plan.length} days done</span><span>{Math.round((doneCount / plan.length) * 100)}%</span></div>
          <div className="progress" role="progressbar" aria-valuenow={Math.round((doneCount / plan.length) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Plan progress"><div style={{ width: `${(doneCount / plan.length) * 100}%` }} /></div>
          <div style={{ marginTop: "1rem" }}>
            {plan.map((d) => (
              <label className="check" key={d.day} style={{ textDecoration: checked[d.day] ? "line-through" : "none", opacity: checked[d.day] ? 0.65 : 1 }}>
                <input type="checkbox" checked={!!checked[d.day]} onChange={() => toggle(d.day)} aria-label={`Day ${d.day}: ${d.title}`} />
                <span><strong>Day {d.day} — {d.title}</strong> <span className="muted">({d.minutes} min)</span><br /><span className="muted">{d.task}</span></span>
              </label>
            ))}
          </div>
          <p style={{ marginTop: "1rem" }}>
            <button className="btn ghost" style={{ color: "var(--ink)", border: "1px solid var(--line)", background: "#fff" }} type="button" onClick={() => { setChecked({}); try { localStorage.removeItem("fgf-plan"); } catch { /* ignore */ } }}>Reset checkmarks</button>
          </p>
        </section>
      )}
    </>
  );
}
