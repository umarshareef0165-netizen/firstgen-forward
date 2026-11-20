import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import A11yToolbar from "./A11yToolbar";

export const metadata: Metadata = {
  title: "FirstGen Forward — Interview & CV readiness coach for first-generation students",
  description: "A free coach for first-generation students: timed mock interviews with rubric feedback, a CV scorecard, a STAR answer builder, and a 30-day readiness plan. No sign-up, no cost, works in the browser.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">Skip to main content</a>
        <header className="topbar">
          <div className="topbar-inner">
            <Link className="brand" href="/">FirstGen <span>Forward</span></Link>
            <nav className="nav" aria-label="Main">
              <Link href="/interview">Mock Interview</Link>
              <Link href="/cv-score">CV Scorecard</Link>
              <Link href="/star">STAR Builder</Link>
              <Link href="/plan">30-Day Plan</Link>
            </nav>
            <A11yToolbar />
          </div>
        </header>
        <main id="main" className="wrap">{children}</main>
        <footer>
          Built for EvoHacks 2 by Umar Shareef — free for every student, no sign-up, no data leaves your browser.
          <br />Mock feedback is rule-based guidance, not a human judgement — use it to practise, then get a real person to review your best answers.
        </footer>
      </body>
    </html>
  );
}
