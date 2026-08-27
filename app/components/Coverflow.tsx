"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export type Shot = {
  id: string;
  title: string;
  src: string | null;
  href: string;
};

/**
 * 3D cover-flow gallery for the Exhibition. Photos line up horizontally; the
 * one nearest the centre stands upright and large while the others rotate away
 * in perspective. Drag with the mouse or swipe on touch to spin through them,
 * tap to open the piece.
 */
export default function Coverflow({ shots }: { shots: Shot[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const drag = useRef({ down: false, startX: 0, scroll: 0, moved: 0 });
  const raf = useRef(0);
  const update = useRef<() => void>(() => {});
  const centered = useRef(false);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;

    // Position each tile in 3D based on its distance from the viewport centre.
    update.current = () => {
      const rect = el.getBoundingClientRect();
      const centre = rect.left + rect.width / 2;
      itemRefs.current.forEach((it) => {
        if (!it) return;
        const r = it.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const d = Math.max(-1.8, Math.min(1.8, (c - centre) / (rect.width / 2)));
        const abs = Math.min(Math.abs(d), 1);
        const rotateY = d * -52;
        const scale = 1 - abs * 0.32;
        const tz = -Math.abs(d) * 160;
        it.style.transform = `perspective(1400px) translateZ(${tz}px) rotateY(${rotateY}deg) scale(${scale})`;
        it.style.opacity = String(1 - abs * 0.4);
        it.style.zIndex = String(100 - Math.round(Math.abs(d) * 100));
      });
    };

    const centreFirst = () => {
      const it = itemRefs.current[0];
      if (!it) return;
      el.scrollLeft = it.offsetLeft - (el.clientWidth - it.offsetWidth) / 2;
      update.current();
    };

    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(update.current);
    };

    update.current();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => update.current());
    ro.observe(el);

    // Centre the first piece once the frame has settled.
    const t = window.setTimeout(centreFirst, 60);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf.current);
      window.clearTimeout(t);
    };
  }, [shots]);

  const onImgLoad = () => {
    update.current();
    // Re-centre once, after the first real image gives the row its width.
    if (!centered.current) {
      centered.current = true;
      const el = scroller.current;
      const it = itemRefs.current[0];
      if (el && it) {
        el.scrollLeft = it.offsetLeft - (el.clientWidth - it.offsetWidth) / 2;
        update.current();
      }
    }
  };

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
      className="coverflow"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {shots.map((s, i) => (
        <Link
          key={s.id}
          href={s.href}
          className="coverflow__item"
          title={s.title}
          draggable={false}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          onClick={(e) => {
            if (drag.current.moved > 6) e.preventDefault();
          }}
        >
          {s.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.src} alt={s.title} draggable={false} onLoad={onImgLoad} />
          ) : (
            <span className="coverflow__ph">{s.title}</span>
          )}
          <span className="coverflow__cap">{s.title}</span>
        </Link>
      ))}
    </div>
  );
}
