"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export type FloatItem = { id: string; title: string; src: string };

type Tile = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
};

const BASE_SPEED = 0.28; // px/frame — the gentle constant drift
const FRICTION = 0.99; // eases a "throw" back toward the drift speed
const CLICK_SLOP = 6; // px of movement below which a press counts as a click

/**
 * Inspiration photos that float continuously across the canvas, can be dragged
 * (and thrown) with the mouse/touch, and navigate to the item's page on click.
 * Positions are animated imperatively via transforms so the rAF loop never
 * triggers React re-renders.
 */
export default function FloatingGallery({
  items,
  word,
}: {
  items: FloatItem[];
  word: string;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const tiles = useRef<Tile[]>([]);
  // Per-tile size factor in [0,1], fixed once, so each photo gets its own
  // scale (some small, some large) that stays consistent across re-layouts.
  const factors = useRef<number[]>([]);
  const drag = useRef<{
    i: number;
    offX: number;
    offY: number;
    moved: number;
    lastX: number;
    lastY: number;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || items.length === 0) return;

    const apply = (i: number) => {
      const node = nodeRefs.current[i];
      const t = tiles.current[i];
      if (node && t) node.style.transform = `translate3d(${t.x}px, ${t.y}px, 0)`;
    };

    // Assign each tile a random width once (kept as a factor so it rescales
    // proportionally on resize instead of reshuffling).
    if (factors.current.length !== items.length) {
      factors.current = items.map(() => Math.random());
    }

    // Scatter tiles across the container; each gets a varied width and keeps
    // the photo's natural aspect ratio (height follows once the image loads).
    const layout = () => {
      const W = container.clientWidth;
      const H = container.clientHeight;
      const baseW = Math.max(76, Math.min(180, W * 0.16));
      const minW = baseW * 0.55; // smallest tile = 55% of base
      const maxW = baseW * 0.75; // largest tile = 75% of base
      tiles.current = items.map((_, i) => {
        const node = nodeRefs.current[i];
        const tileW = Math.round(minW + factors.current[i] * (maxW - minW));
        if (node) node.style.width = `${tileW}px`;
        const w = node?.offsetWidth || tileW;
        const h = node?.offsetHeight || Math.round(tileW * 1.3);
        const angle = (i / items.length) * Math.PI * 2 + Math.random();
        return {
          x: Math.random() * Math.max(1, W - w),
          y: Math.random() * Math.max(1, H - h),
          vx: Math.cos(angle) * BASE_SPEED,
          vy: Math.sin(angle) * BASE_SPEED,
          w,
          h,
        };
      });
      tiles.current.forEach((_, i) => apply(i));
      container.dataset.ready = "1";
    };

    // Fonts/images can change tile sizes; lay out once the frame settles.
    layout();
    // Only re-scatter on WIDTH changes — mobile browsers fire resize when the
    // address bar hides/shows (height only), which shouldn't reshuffle tiles.
    let lastWidth = container.clientWidth;
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      if (w !== lastWidth) {
        lastWidth = w;
        layout();
      }
    });
    ro.observe(container);

    let raf = 0;
    const frame = () => {
      const W = container.clientWidth;
      const H = container.clientHeight;
      tiles.current.forEach((t, i) => {
        if (drag.current?.i === i) return; // held tiles follow the pointer
        t.x += t.vx;
        t.y += t.vy;

        // Bounce off the edges, keeping the tile fully in view.
        if (t.x <= 0) {
          t.x = 0;
          t.vx = Math.abs(t.vx);
        } else if (t.x + t.w >= W) {
          t.x = W - t.w;
          t.vx = -Math.abs(t.vx);
        }
        if (t.y <= 0) {
          t.y = 0;
          t.vy = Math.abs(t.vy);
        } else if (t.y + t.h >= H) {
          t.y = H - t.h;
          t.vy = -Math.abs(t.vy);
        }

        // Damp a throw, but never let a tile fully stop.
        t.vx *= FRICTION;
        t.vy *= FRICTION;
        const sp = Math.hypot(t.vx, t.vy);
        if (sp < BASE_SPEED) {
          if (sp < 0.0001) {
            t.vx = BASE_SPEED;
          } else {
            t.vx = (t.vx / sp) * BASE_SPEED;
            t.vy = (t.vy / sp) * BASE_SPEED;
          }
        }
        apply(i);
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [items]);

  // Once a photo loads, its natural height is known — sync the physics box
  // to the real size and pull it back inside the frame if it now overflows.
  const onImgLoad = (i: number) => {
    const node = nodeRefs.current[i];
    const t = tiles.current[i];
    const container = containerRef.current;
    if (!node || !t || !container) return;
    t.w = node.offsetWidth;
    t.h = node.offsetHeight;
    t.x = Math.max(0, Math.min(t.x, container.clientWidth - t.w));
    t.y = Math.max(0, Math.min(t.y, container.clientHeight - t.h));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLAnchorElement>, i: number) => {
    const container = containerRef.current;
    const t = tiles.current[i];
    if (!container || !t) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = container.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    drag.current = {
      i,
      offX: px - t.x,
      offY: py - t.y,
      moved: 0,
      lastX: px,
      lastY: py,
    };
    // Lift the grabbed tile above the others.
    nodeRefs.current[i]?.style.setProperty("z-index", "10");
  };

  const onPointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const d = drag.current;
    const container = containerRef.current;
    if (!d || !container) return;
    const rect = container.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const t = tiles.current[d.i];

    let nx = px - d.offX;
    let ny = py - d.offY;
    nx = Math.max(0, Math.min(nx, container.clientWidth - t.w));
    ny = Math.max(0, Math.min(ny, container.clientHeight - t.h));

    // Velocity from the drag → the tile keeps that momentum on release.
    t.vx = nx - t.x;
    t.vy = ny - t.y;
    t.x = nx;
    t.y = ny;

    d.moved += Math.hypot(px - d.lastX, py - d.lastY);
    d.lastX = px;
    d.lastY = py;

    const node = nodeRefs.current[d.i];
    if (node) node.style.transform = `translate3d(${nx}px, ${ny}px, 0)`;
  };

  const endDrag = (
    e: React.PointerEvent<HTMLAnchorElement>,
    i: number,
    href: string,
  ) => {
    const d = drag.current;
    nodeRefs.current[i]?.style.removeProperty("z-index");
    if (d && d.i === i) {
      const wasClick = d.moved < CLICK_SLOP;
      drag.current = null;
      if (wasClick) {
        router.push(href);
        return;
      }
      // Cap thrown speed so tiles don't rocket off.
      const t = tiles.current[i];
      const sp = Math.hypot(t.vx, t.vy);
      const cap = 14;
      if (sp > cap) {
        t.vx = (t.vx / sp) * cap;
        t.vy = (t.vy / sp) * cap;
      }
    }
  };

  return (
    <div ref={containerRef} className="fg">
      <h1 className="fg__word" aria-hidden>
        {word}
      </h1>

      {items.map((item, i) => (
        <a
          key={item.id}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          href={`/inspiration/${item.id}`}
          className="fg__tile"
          title={item.title}
          draggable={false}
          onClick={(e) => e.preventDefault()} // navigation handled in endDrag
          onPointerDown={(e) => onPointerDown(e, i)}
          onPointerMove={onPointerMove}
          onPointerUp={(e) => endDrag(e, i, `/inspiration/${item.id}`)}
          onPointerCancel={(e) => endDrag(e, i, `/inspiration/${item.id}`)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt={item.title}
            draggable={false}
            onLoad={() => onImgLoad(i)}
          />
        </a>
      ))}
    </div>
  );
}
