"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Gooey/liquid word morph (adapted from Magic UI's MorphingText): two text
 * layers blur-cross-fade while an SVG alpha-threshold filter melts the blurred
 * edges into merging blobs. API mirrors the requested TextMorph component.
 *   <TextMorph words={[...]} interval={2400} morphDuration={680} className="…" />
 */
function useMorphingText(
  texts: string[],
  morphTime: number,
  cooldownTime: number,
) {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const setStyles = useCallback(
    (fraction: number) => {
      const c1 = text1Ref.current;
      const c2 = text2Ref.current;
      if (!c1 || !c2) return;

      c2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      c2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const inv = 1 - fraction;
      c1.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`;
      c1.style.opacity = `${Math.pow(inv, 0.4) * 100}%`;

      c1.textContent = texts[textIndexRef.current % texts.length];
      c2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    },
    [texts],
  );

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / morphTime;
    if (fraction > 1) {
      cooldownRef.current = cooldownTime;
      fraction = 1;
    }

    // gooey filter only while actually morphing → crisp text at rest
    if (containerRef.current) {
      containerRef.current.style.filter = "url(#textmorph-threshold)";
    }
    setStyles(fraction);
    if (fraction === 1) textIndexRef.current++;
  }, [setStyles, morphTime, cooldownTime]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    if (containerRef.current) containerRef.current.style.filter = "none";
    const c1 = text1Ref.current;
    const c2 = text2Ref.current;
    if (c1 && c2) {
      c2.style.filter = "none";
      c2.style.opacity = "100%";
      c1.style.filter = "none";
      c1.style.opacity = "0%";
    }
  }, []);

  useEffect(() => {
    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const now = new Date();
      const dt = (now.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = now;
      cooldownRef.current -= dt;
      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, [doMorph, doCooldown]);

  return { containerRef, text1Ref, text2Ref };
}

export function TextMorph({
  words,
  interval = 2400,
  morphDuration = 680,
  className = "",
}: {
  words: string[];
  interval?: number;
  morphDuration?: number;
  className?: string;
}) {
  const morphTime = morphDuration / 1000;
  const cooldownTime = Math.max(0.15, interval / 1000 - morphTime);
  const { containerRef, text1Ref, text2Ref } = useMorphingText(
    words,
    morphTime,
    cooldownTime,
  );

  return (
    <div className={`text-morph ${className}`.trim()} ref={containerRef}>
      <span className="text-morph__t" ref={text1Ref} />
      <span className="text-morph__t" ref={text2Ref} />

      <svg aria-hidden className="text-morph__svg">
        <defs>
          <filter id="textmorph-threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

export default TextMorph;
