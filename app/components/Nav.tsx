"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

const links = [
  { href: "/collection", label: "Collection" },
  { href: "/inspiration", label: "Inspiration" },
  { href: "/exhibition", label: "Exhibition" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="nav">
      <Link href="/" className="nav__brand" aria-label="MUMZZMUM — home">
        MUMZZMUM
      </Link>

      {/* desktop links */}
      <div className="nav__links">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav__link${isActive(link.href) ? " is-active" : ""}`}
          >
            {link.label}
          </Link>
        ))}
        {isAdmin && (
          <button
            type="button"
            onClick={handleSignOut}
            className="nav__admin"
            title="Signed in as admin — click to sign out"
          >
            <span className="nav__admin-dot" aria-hidden />
            Admin
          </button>
        )}
      </div>

      {/* mobile toggle */}
      <button
        type="button"
        className={`nav__burger${open ? " is-open" : ""}`}
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
      </button>

      {/* mobile panel */}
      <div className={`nav__mobile${open ? " is-open" : ""}`}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav__mobile-link${
              isActive(link.href) ? " is-active" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
        {isAdmin && (
          <button
            type="button"
            onClick={handleSignOut}
            className="nav__mobile-link nav__mobile-link--admin"
          >
            Sign out
          </button>
        )}
      </div>
    </nav>
  );
}
