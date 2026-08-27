"use client";

export type View = "walk" | "grid" | "list";

const LABELS: [View, string][] = [
  ["walk", "감상"],
  ["grid", "그리드"],
  ["list", "목록"],
];

/** Walk (immersive) · Grid (overview) · List (text) switch for archive pages. */
export default function ViewToggle({
  view,
  onChange,
}: {
  view: View;
  onChange: (v: View) => void;
}) {
  return (
    <div className="viewtoggle" role="group" aria-label="보기 방식">
      {LABELS.map(([v, label]) => (
        <button
          key={v}
          type="button"
          className={`viewtoggle__btn${view === v ? " is-active" : ""}`}
          aria-pressed={view === v}
          onClick={() => onChange(v)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
