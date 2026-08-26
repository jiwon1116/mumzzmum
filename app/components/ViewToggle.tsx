"use client";

export type View = "gallery" | "list";

/** Gallery (photos) ↔ List (text-only) switch, shared by the archive pages. */
export default function ViewToggle({
  view,
  onChange,
}: {
  view: View;
  onChange: (v: View) => void;
}) {
  return (
    <div className="viewtoggle" role="group" aria-label="보기 방식">
      <button
        type="button"
        className={`viewtoggle__btn${view === "gallery" ? " is-active" : ""}`}
        aria-pressed={view === "gallery"}
        onClick={() => onChange("gallery")}
      >
        갤러리
      </button>
      <button
        type="button"
        className={`viewtoggle__btn${view === "list" ? " is-active" : ""}`}
        aria-pressed={view === "list"}
        onClick={() => onChange("list")}
      >
        목록
      </button>
    </div>
  );
}
