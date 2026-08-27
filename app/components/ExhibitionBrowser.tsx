"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Media from "./Media";
import GalleryWall from "./GalleryWall";
import ViewToggle, { type View } from "./ViewToggle";
import type { ExhibitionPiece } from "@/shared/types";

export default function ExhibitionBrowser({
  pieces,
}: {
  pieces: ExhibitionPiece[];
}) {
  const [view, setView] = useState<View>(pieces.length > 10 ? "grid" : "walk");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    pieces.forEach((p) => p.category && set.add(p.category));
    return Array.from(set).sort();
  }, [pieces]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pieces.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.category ?? "").toLowerCase().includes(q) ||
        (p.date ?? "").toLowerCase().includes(q);
      const matchesCategory = !category || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [pieces, query, category]);

  if (pieces.length === 0) {
    return <div className="empty">아직 등록된 작업이 없습니다.</div>;
  }

  const meta = (p: ExhibitionPiece) =>
    [p.category, p.date, p.material].filter(Boolean).join("   ·   ");

  return (
    <>
      <div className="toolbar">
        <span className="toolbar__label">{filtered.length} Pieces</span>
        <ViewToggle view={view} onChange={setView} />
      </div>

      <div className="filter">
        <input
          type="search"
          className="filter__search"
          placeholder="Search piece, category, year…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {categories.length > 0 && (
          <>
            <button
              type="button"
              className={`chip${category === null ? " is-active" : ""}`}
              onClick={() => setCategory(null)}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`chip${category === c ? " is-active" : ""}`}
                onClick={() => setCategory(category === c ? null : c)}
              >
                {c}
              </button>
            ))}
          </>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">조건에 맞는 작업이 없습니다.</div>
      ) : view === "walk" ? (
        <GalleryWall
          pieces={filtered.map((piece) => ({
            id: piece.id,
            title: piece.title,
            src: piece.image_urls?.[0] ?? null,
            href: `/exhibition/${piece.id}`,
            meta: meta(piece),
          }))}
        />
      ) : view === "grid" ? (
        <div className="grid-insta">
          {filtered.map((piece) => (
            <Link
              href={`/exhibition/${piece.id}`}
              className="insta-cell"
              key={piece.id}
            >
              <Media
                src={piece.image_urls?.[0]}
                alt={piece.title}
                label={piece.title}
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              <div className="insta-cell__overlay">
                <span className="insta-cell__title">{piece.title}</span>
                <span className="insta-cell__kind">
                  {[piece.category, piece.date].filter(Boolean).join(" — ")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <ul className="list">
          {filtered.map((piece) => (
            <li key={piece.id}>
              <Link href={`/exhibition/${piece.id}`}>
                <span className="list__title">{piece.title}</span>
                <span className="list__meta">
                  {[piece.category, piece.date].filter(Boolean).join(" · ")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
