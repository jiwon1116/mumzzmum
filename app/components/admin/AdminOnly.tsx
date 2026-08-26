"use client";

import type { ReactNode } from "react";
import { useAuth } from "../AuthProvider";

/** Renders children only for a logged-in admin. Visitors see nothing. */
export function AdminOnly({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;
  return <>{children}</>;
}

/** A subtle dashed admin bar (only shown to admins). */
export function AdminBar({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;
  return (
    <div className="admin-bar">
      <span className="admin-bar__label">Admin</span>
      {children}
    </div>
  );
}
