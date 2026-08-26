import Link from "next/link";

export default function Footer() {
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
