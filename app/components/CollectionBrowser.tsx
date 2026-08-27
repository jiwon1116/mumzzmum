"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Filmstrip from "./Filmstrip";
import ViewToggle, { type View } from "./ViewToggle";
import type { Brand } from "@/shared/types";

export default function CollectionBrowser({ brands }: { brands: Brand[] }) {
  const [query, setQuery] = useState("");
  const [character, setCharacter] = useState<string | null>(null);
  const [view, setView] = useState<View>("gallery");

  // Unique character tags across all brands, for the filter chips.
  const characters = useMemo(() => {
    const set = new Set<string>();
    brands.forEach((b) => b.brand_character?.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, [brands]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return brands.filter((b) => {
      const matchesQuery =
        !q ||
        b.name.toLowerCase().includes(q) ||
        (b.mood ?? "").toLowerCase().includes(q) ||
        (b.brand_character ?? []).some((c) => c.toLowerCase().includes(q));
      const matchesCharacter =
        !character || (b.brand_character ?? []).includes(character);
      return matchesQuery && matchesCharacter;
    });
  }, [brands, query, character]);

  return (
    <>
      <div className="toolbar">
        <span className="toolbar__label">{filtered.length} Brands</span>
        <ViewToggle view={view} onChange={setView} />
      </div>

      <div className="filter">
        <input
          type="search"
          className="filter__search"
          placeholder="Search brand, mood, character…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {characters.length > 0 && (
          <>
            <button
              type="button"
              className={`chip${character === null ? " is-active" : ""}`}
              onClick={() => setCharacter(null)}
            >
              All
            </button>
            {characters.map((c) => (
              <button
                key={c}
                type="button"
                className={`chip${character === c ? " is-active" : ""}`}
                onClick={() => setCharacter(character === c ? null : c)}
              >
                {c}
              </button>
            ))}
          </>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">조건에 맞는 브랜드가 없습니다.</div>
      ) : view === "gallery" ? (
        <Filmstrip
          shots={filtered.map((brand) => ({
            id: brand.id,
            title: brand.name,
            src: brand.image_url,
            href: `/collection/${brand.slug}`,
          }))}
        />
      ) : (
        <ul className="list">
          {filtered.map((brand) => (
            <li key={brand.id}>
              <Link href={`/collection/${brand.slug}`}>
                <span className="list__title">{brand.name}</span>
                <span className="list__meta">
                  {[brand.mood, brand.price_range].filter(Boolean).join(" · ")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
