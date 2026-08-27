"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  // Portal target is only available in the browser.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);

    // Freeze the background (incl. the exhibition cover-flow) in place and
    // restore the exact scroll position on close — so the page underneath
    // never shifts or scrolls while the modal is open.
    const body = document.body;
    const scrollY = window.scrollY;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  // Render at <body> level so the cover-flow's 3D stacking contexts can never
  // bleed through the dialog.
  return createPortal(
    <div
      className="modal"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal__panel" role="dialog" aria-modal="true">
        <div className="modal__head">
          <h2 className="modal__title">{title}</h2>
          <button type="button" className="modal__close" onClick={onClose}>
            Close ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
