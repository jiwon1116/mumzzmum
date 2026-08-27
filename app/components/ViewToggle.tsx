"use client";

export type View = "walk" | "grid" | "list";

const LABELS: [View, string][] = [
  ["walk", "감상"],
  ["grid", "그리드"],
  ["list", "목록"],
];

/** Walk (immersive) · Grid (overview) · List (text) switch for archive pages.
    Pass `views` to show only a subset. */
export default function ViewToggle({
  view,
  onChange,
  views,
}: {
  view: View;
  onChange: (v: View) => void;
  views?: View[];
}) {
  const shown = views ? LABELS.filter(([v]) => views.includes(v)) : LABELS;
  return (
    <div className="viewtoggle" role="group" aria-label="보기 방식">
      {shown.map(([v, label]) => (
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
