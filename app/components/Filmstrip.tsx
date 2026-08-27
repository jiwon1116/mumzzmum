"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type Shot = {
  id: string;
  title: string;
  src: string | null;
  href: string;
};

/**
 * A horizontal, drag-to-scroll photo gallery (carousel / filmstrip). Photos
 * keep their natural aspect ratio at a fixed height and line up side by side;
 * drag with the mouse or swipe on touch to scroll, tap to open the item.
 */
export default function Filmstrip({ shots }: { shots: Shot[] }) {
  const router = useRouter();
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, scroll: 0, moved: 0 });
  const pressedHref = useRef<string | null>(null);
  const lastType = useRef<string>("");

  // Mouse: click-drag to scroll, navigate on release (pointer capture steals
  // the click, so we route manually). Touch keeps the browser's native swipe
  // and the anchor's native navigation.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    lastType.current = e.pointerType;
    const a = (e.target as HTMLElement).closest("a");
    pressedHref.current = a?.getAttribute("href") ?? null;
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
    if (e.pointerType !== "mouse" || !drag.current.down) return;
    drag.current.down = false;
    if (drag.current.moved <= 6 && pressedHref.current) {
      router.push(pressedHref.current);
    }
  };

  return (
    <div
      ref={scroller}
      className="filmstrip"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {shots.map((s) => (
        <Link
          key={s.id}
          href={s.href}
          className="filmstrip__item"
          title={s.title}
          draggable={false}
          // Mouse nav is handled in onPointerUp; block the anchor's own click
          // so it doesn't double-fire. Touch uses the native anchor click.
          onClick={(e) => {
            if (lastType.current === "mouse") e.preventDefault();
          }}
        >
          {s.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.src} alt={s.title} draggable={false} />
          ) : (
            <span className="filmstrip__ph">{s.title}</span>
          )}
          <span className="filmstrip__cap">{s.title}</span>
        </Link>
      ))}
    </div>
  );
}
