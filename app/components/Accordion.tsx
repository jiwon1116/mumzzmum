"use client";

import { useState, type ReactNode } from "react";

/** Collapsible section with a bold title bar and a +/− indicator. */
export default function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="accordion">
      <button
        type="button"
        className="accordion__toggle"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        <span className="accordion__chev">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="accordion__body">{children}</div>}
    </div>
  );
}
