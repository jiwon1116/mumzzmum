"use client";

import { useEffect, useRef, useState } from "react";
import { BG_IMAGE_1, BG_IMAGE_2 } from "./revealImages";

/**
 * Desktop-only interactive background.
 * BG_IMAGE_1 is always visible; BG_IMAGE_2 is revealed inside a soft circular
 * spotlight that eases toward the cursor. A faint SVG grid parallaxes with it.
 */
export default function ImageRevealBackground() {
  const revealRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<SVGPatternElement>(null);
  const [cell, setCell] = useState(48);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const smooth = { x: mouse.x, y: mouse.y };
    const offset = { x: 0, y: 0 };
    let raf = 0;

    const sync = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setCell(Math.round(Math.min(64, Math.max(36, window.innerWidth * 0.028))));
    };
    sync();

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", sync);

    const loop = () => {
      // Ease the spotlight toward the raw cursor.
      smooth.x += (mouse.x - smooth.x) * 0.1;
      smooth.y += (mouse.y - smooth.y) * 0.1;

      const radius = Math.round(
        Math.min(420, Math.max(160, window.innerWidth * 0.16)),
      );

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const g = ctx.createRadialGradient(
          smooth.x,
          smooth.y,
          0,
          smooth.x,
          smooth.y,
          radius,
        );
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(0.4, "rgba(255,255,255,1)");
        g.addColorStop(0.6, "rgba(255,255,255,0.75)");
        g.addColorStop(0.75, "rgba(255,255,255,0.4)");
        g.addColorStop(0.88, "rgba(255,255,255,0.12)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const url = canvas.toDataURL();
        const el = revealRef.current;
        if (el) {
          el.style.webkitMaskImage = `url(${url})`;
          el.style.maskImage = `url(${url})`;
          el.style.webkitMaskSize = "100% 100%";
          el.style.maskSize = "100% 100%";
          el.style.webkitMaskRepeat = "no-repeat";
          el.style.maskRepeat = "no-repeat";
        }
      }

      // Parallax the grid toward the eased cursor.
      const cx = smooth.x / window.innerWidth - 0.5;
      const cy = smooth.y / window.innerHeight - 0.5;
      offset.x += (cx * 16 - offset.x) * 0.06;
      offset.y += (cy * 16 - offset.y) * 0.06;
      const p = patternRef.current;
      if (p) {
        p.setAttribute("x", String(offset.x));
        p.setAttribute("y", String(offset.y));
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const bgStyle = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  } as const;

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base layer */}
      <div
        className="absolute inset-0"
        style={{ ...bgStyle, backgroundImage: `url(${BG_IMAGE_1})` }}
      />
      {/* Reveal layer (masked to the spotlight) */}
      <div
        ref={revealRef}
        className="absolute inset-0"
        style={{ ...bgStyle, backgroundImage: `url(${BG_IMAGE_2})` }}
      />
      {/* Parallax grid */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.1 }}>
        <defs>
          <pattern
            ref={patternRef}
            id="lgpsm-grid"
            width={cell}
            height={cell}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${cell} 0 L 0 0 0 ${cell}`}
              fill="none"
              stroke="#64748b"
              strokeWidth={0.6}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lgpsm-grid)" />
      </svg>
    </div>
  );
}
