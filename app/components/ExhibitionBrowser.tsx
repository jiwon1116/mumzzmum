"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import Media from "./Media";
import GalleryWall from "./GalleryWall";
import ViewToggle, { type View } from "./ViewToggle";
import type { ExhibitionPiece } from "@/shared/types";

// Normalise a free-form date ("2026 SS", "25FW", "26ss", "F/W 2025") into a
// canonical season label + a sort key (newest first, FW after SS in a year).
function seasonInfo(date: string | null): {
  key: string;
  label: string;
  sort: number;
} {
  if (!date || !date.trim()) return { key: "__none", label: "기타", sort: -1 };
  const d = date.toUpperCase();
  const num = d.match(/\d{2,4}/);
  let year = 0;
  if (num) {
    const n = num[0];
    year = n.length >= 4 ? parseInt(n.slice(0, 4), 10) : 2000 + parseInt(n, 10);
  }
  const isFW = /(FW|F\/W|FALL|WINTER|AUTUMN)/.test(d);
  const isSS = /(SS|S\/S|SPRING|SUMMER)/.test(d);
  const season = isFW ? "FW" : isSS ? "SS" : "";
  const label = [year || null, season || null].filter(Boolean).join(" ");
  if (!label) return { key: date, label: date, sort: -1 };
  return { key: label, label, sort: (year || 0) * 10 + (isFW ? 1 : 0) };
}

export default function ExhibitionBrowser({
  pieces,
}: {
  pieces: ExhibitionPiece[];
}) {
  const [view, setView] = useState<View>(pieces.length > 10 ? "grid" : "walk");
  const [query, setQuery] = useState("");
  const [season, setSeason] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const seasons = useMemo(() => {
    const map = new Map<string, number>();
    pieces.forEach((p) => {
      const s = seasonInfo(p.date);
      if (s.key !== "__none") map.set(s.label, s.sort);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label]) => label);
  }, [pieces]);

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
      const matchesSeason = !season || seasonInfo(p.date).label === season;
      const matchesCategory = !category || p.category === category;
      return matchesQuery && matchesSeason && matchesCategory;
    });
  }, [pieces, query, season, category]);

  // Group the filtered pieces by season, newest first.
  const groups = useMemo(() => {
    const map = new Map<string, { info: ReturnType<typeof seasonInfo>; items: ExhibitionPiece[] }>();
    filtered.forEach((p) => {
      const info = seasonInfo(p.date);
      if (!map.has(info.key)) map.set(info.key, { info, items: [] });
      map.get(info.key)!.items.push(p);
    });
    return Array.from(map.values()).sort((a, b) => b.info.sort - a.info.sort);
  }, [filtered]);

  if (pieces.length === 0) {
    return <div className="empty">아직 등록된 작업이 없습니다.</div>;
  }

  const meta = (p: ExhibitionPiece) =>
    [p.category, p.date, p.material].filter(Boolean).join("   ·   ");

  const gridCells = (items: ExhibitionPiece[]) => (
    <div className="grid-insta">
      {items.map((piece) => (
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
  );

  const listRows = (items: ExhibitionPiece[]) => (
    <ul className="list">
      {items.map((piece) => (
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
  );

  const grouped = (render: (items: ExhibitionPiece[]) => ReactNode) =>
    // when a single season is selected there's no need for headers
    season
      ? render(filtered)
      : groups.map((g) => (
          <div className="season-group" key={g.info.key}>
            <h3 className="season-group__head">
              {g.info.label}
              <span className="season-group__count">{g.items.length}</span>
            </h3>
            {render(g.items)}
          </div>
        ));

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
          placeholder="Search piece, season, category…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {seasons.length > 0 && (
        <div className="filterrow">
          <span className="filterrow__label">시즌</span>
          <button
            type="button"
            className={`chip${season === null ? " is-active" : ""}`}
            onClick={() => setSeason(null)}
          >
            All
          </button>
          {seasons.map((s) => (
            <button
              key={s}
              type="button"
              className={`chip${season === s ? " is-active" : ""}`}
              onClick={() => setSeason(season === s ? null : s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {categories.length > 0 && (
        <div className="filterrow">
          <span className="filterrow__label">종류</span>
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
        </div>
      )}

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
        grouped(gridCells)
      ) : (
        grouped(listRows)
      )}
    </>
  );
}
