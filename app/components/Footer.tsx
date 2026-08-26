"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  // Home (/) is the LGPSM landing with its own footer — hide the global one there.
  if (pathname === "/") return null;

  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__mark">MUMZZMUM</span>
        <span className="footer__meta">
          A Personal Fashion Archive
          {/* Discreet admin entry — unobtrusive to visitors. */}
          <Link href="/login" className="footer__dot" aria-label="Admin sign in">
            ·
          </Link>
          {year}
        </span>
      </div>
    </footer>
  );
}
