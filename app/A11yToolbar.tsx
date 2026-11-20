"use client";
import { useEffect, useState } from "react";

export default function A11yToolbar() {
  const [hc, setHc] = useState(false);
  const [lt, setLt] = useState(false);
  useEffect(() => {
    document.body.classList.toggle("high-contrast", hc);
    document.body.classList.toggle("large-text", lt);
  }, [hc, lt]);
  return (
    <div className="a11y" role="group" aria-label="Accessibility options">
      <button type="button" aria-pressed={hc} onClick={() => setHc(!hc)}>High contrast</button>
      <button type="button" aria-pressed={lt} onClick={() => setLt(!lt)}>Larger text</button>
    </div>
  );
}
