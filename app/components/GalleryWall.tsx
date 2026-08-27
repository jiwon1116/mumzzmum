"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export type Piece = {
  id: string;
  title: string;
  src: string | null;
  href: string;
  meta: string;
};

/**
 * A museum "wall" walkthrough: pieces hang side by side with generous spacing
 * and a placard beneath each. Whichever piece is nearest the centre is lit,
 * the rest dim back — as if you're walking the gallery. Drag or swipe to move.
 */
export default function GalleryWall({ pieces }: { pieces: Piece[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const drag = useRef({ down: false, startX: 0, scroll: 0, moved: 0 });
  const raf = useRef(0);
  const update = useRef<() => void>(() => {});

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;

    // Spotlight the centre piece; dim the rest by distance from centre.
    update.current = () => {
      const rect = el.getBoundingClientRect();
      const centre = rect.left + rect.width / 2;
      itemRefs.current.forEach((it) => {
        if (!it) return;
        const r = it.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const d = Math.min(Math.abs((c - centre) / (rect.width / 2)), 1);
        it.style.opacity = String(1 - d * 0.62);
        it.style.transform = `scale(${1 - d * 0.08})`;
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(update.current);
    };

    update.current();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => update.current());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, [pieces]);

  const onImgLoad = () => update.current();

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = scroller.current;
    if (!el) return;
    drag.current = {
      down: true,
      startX: e.clientX,
      scroll: el.scrollLeft,
      moved: 0,
    };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.down) return;
    const el = scroller.current;
    if (!el) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.abs(dx);
    el.scrollLeft = drag.current.scroll - dx;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") drag.current.down = false;
  };

  return (
    <div
      ref={scroller}
      className="gallerywall"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {pieces.map((p, i) => (
        <figure
          className="gwall__item"
          key={p.id}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
        >
          <Link
            href={p.href}
            className="gwall__frame"
            title={p.title}
            draggable={false}
            onClick={(e) => {
              if (drag.current.moved > 6) e.preventDefault();
            }}
          >
            {p.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.src} alt={p.title} draggable={false} onLoad={onImgLoad} />
            ) : (
              <span className="gwall__ph">{p.title}</span>
            )}
          </Link>
          <figcaption className="gwall__label">
            <span className="gwall__no">No. {String(i + 1).padStart(2, "0")}</span>
            <Link href={p.href} className="gwall__title">
              {p.title}
            </Link>
            {p.meta && <span className="gwall__meta">{p.meta}</span>}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
