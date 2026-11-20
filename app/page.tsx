import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="hero">
        <p className="kicker" style={{ color: "#fbbf24" }}>For first-generation students</p>
        <h1>Walk into your first interview like you have done it a hundred times.</h1>
        <p>
          First-generation students often prepare alone — no family member has sat in that
          interview, no one at home can review the CV. FirstGen Forward is a free coach that
          fills that gap: timed mock interviews with honest rubric feedback, a CV scorecard,
          a STAR answer builder, and a 30-day plan. No sign-up. No cost. Nothing leaves your browser.
        </p>
        <div className="cta-row">
          <Link className="btn" href="/interview">Start a mock interview →</Link>
          <Link className="btn ghost" href="/cv-score">Score my CV</Link>
        </div>
      </section>

      <section className="section">
        <p className="kicker">The problem</p>
        <h2>Opportunity should not depend on who you know at home.</h2>
        <p>
          Students whose parents did not go to university or work in tech start behind in the
          unwritten rules: how long an answer should be, what a strong CV bullet looks like,
          how to tell a story with a clear result. Paid coaching costs money many families do
          not have. FirstGen Forward teaches those rules openly, with practice and feedback
          you can use tonight.
        </p>
        <div className="grid c4">
          <div className="card"><div className="stat">4</div><p className="muted">practice tools in one place — interview, CV, stories, plan</p></div>
          <div className="card"><div className="stat">26</div><p className="muted">real interview questions across 4 roles, with feedback on every answer</p></div>
          <div className="card"><div className="stat">100</div><p className="muted">point rubric — every score explains exactly what to fix next</p></div>
          <div className="card"><div className="stat">$0</div><p className="muted">free forever, no account, no uploads — your words stay on your device</p></div>
        </div>
      </section>

      <section className="section">
        <p className="kicker">What you get</p>
        <h2>Four tools, one goal: interview-ready.</h2>
        <div className="grid c2">
          <div className="card">
            <div className="icon" aria-hidden="true">🎙️</div>
            <h3>Mock Interview Studio</h3>
            <p className="muted">Pick a role, get a timed question, answer in your own words. Every answer is scored on STAR structure, key ideas, action verbs, numbers and filler words — with exact fixes, not vague praise.</p>
            <Link className="btn secondary small" href="/interview">Practise now</Link>
          </div>
          <div className="card">
            <div className="icon" aria-hidden="true">📄</div>
            <h3>CV Scorecard</h3>
            <p className="muted">Paste your CV text and get a 0–100 score: sections, contact details, action verbs, quantified achievements and weak phrases — plus a prioritised fix list.</p>
            <Link className="btn secondary small" href="/cv-score">Score my CV</Link>
          </div>
          <div className="card">
            <div className="icon" aria-hidden="true">⭐</div>
            <h3>STAR Answer Builder</h3>
            <p className="muted">Turn one real experience into a structured Situation–Task–Action–Result answer, ready to say out loud. Includes a word count and a “say it in 60 seconds” check.</p>
            <Link className="btn secondary small" href="/star">Build a story</Link>
          </div>
          <div className="card">
            <div className="icon" aria-hidden="true">🗓️</div>
            <h3>30-Day Readiness Plan</h3>
            <p className="muted">Tell it your target role and weekly hours and it builds a day-by-day plan — interview, CV, stories, skill drills, rest — with checkboxes that save on your device.</p>
            <Link className="btn secondary small" href="/plan">Make my plan</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <p className="kicker">How it works</p>
        <h2>Twenty minutes tonight. A different interview next week.</h2>
        <ol>
          <li><strong>Answer one question</strong> in the Mock Interview Studio and read the rubric — fix one thing.</li>
          <li><strong>Score your CV</strong> and fix the top two issues on the list.</li>
          <li><strong>Build one STAR story</strong> from a project or job you actually did.</li>
          <li><strong>Follow the plan</strong> — a little every day beats a panic weekend.</li>
        </ol>
        <div className="note">
          <strong>Built by someone who needed it.</strong> The builder, Umar Shareef, is a
          first-generation, limited-income student himself — final-year Computer Science at the
          University of Agriculture, Faisalabad — who prepared for interviews and internships
          without a family guide. This tool is the coach he wished he had.
        </div>
      </section>

      <section className="section">
        <p className="kicker">Accessible by design</p>
        <h2>Built so everyone can use it.</h2>
        <p>
          High-contrast and larger-text toggles in the header, full keyboard navigation, clear
          labels on every control, plain language throughout, and no step that requires perfect
          eyesight, hearing, or a fast connection. Feedback is written, never audio-only, and
          every tool works without a mouse.
        </p>
        <details>
          <summary>How does the feedback work — is it real AI?</summary>
          <p>Honestly: no large language model is involved. Each answer is checked by a transparent,
          published rubric — STAR structure, coverage of the question’s key ideas, action verbs,
          concrete numbers, length and filler words. The rules are the same ones interviewers use,
          and the app shows you exactly which rule each point came from. That keeps it free, private
          and instant — and it never invents praise you did not earn.</p>
        </details>
        <details>
          <summary>Where does my data go?</summary>
          <p>Nowhere. Your answers, CV text and plan checkmarks are stored only in your browser’s
          local storage. There is no account, no server database and no tracking.</p>
        </details>
        <details>
          <summary>Who is it for?</summary>
          <p>First-generation and low-income students first — but anyone preparing for an internship
          or first job can use it. The question banks cover Software Engineer Intern, Data Analyst,
          Product / General, and Tutor / Teaching roles.</p>
        </details>
      </section>
    </>
  );
}
