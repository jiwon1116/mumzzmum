"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Filmstrip from "./Filmstrip";
import ViewToggle, { type View } from "./ViewToggle";
import type { Inspiration } from "@/shared/types";

export default function InspirationBrowser({
  items,
}: {
  items: Inspiration[];
}) {
  const [view, setView] = useState<View>(items.length > 10 ? "grid" : "walk");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      const matchesQuery =
        !q ||
        (i.title ?? "").toLowerCase().includes(q) ||
        i.note.toLowerCase().includes(q) ||
        (i.tags ?? []).some((t) => t.toLowerCase().includes(q));
      const matchesTag = !tag || (i.tags ?? []).includes(tag);
      return matchesQuery && matchesTag;
    });
  }, [items, query, tag]);

  if (items.length === 0) {
    return <div className="empty">아직 저장된 영감이 없습니다.</div>;
  }

  return (
    <>
      <div className="toolbar">
        <span className="toolbar__label">{filtered.length} Notes</span>
        <ViewToggle view={view} onChange={setView} />
      </div>

      <div className="filter">
        <input
          type="search"
          className="filter__search"
          placeholder="Search note, tag…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {tags.length > 0 && (
          <>
            <button
              type="button"
              className={`chip${tag === null ? " is-active" : ""}`}
              onClick={() => setTag(null)}
            >
              All
            </button>
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                className={`chip${tag === t ? " is-active" : ""}`}
                onClick={() => setTag(tag === t ? null : t)}
              >
                #{t}
              </button>
            ))}
          </>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">조건에 맞는 영감이 없습니다.</div>
      ) : view === "walk" ? (
        <Filmstrip
          shots={filtered.map((item) => ({
            id: item.id,
            title: item.title ?? item.note ?? "Inspiration",
            src: item.image_url,
            href: `/inspiration/${item.id}`,
          }))}
        />
      ) : view === "grid" ? (
        <div className="masonry">
          {filtered.map((item) => (
            <Link
              href={`/inspiration/${item.id}`}
              key={item.id}
              className="insp-card"
            >
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="insp-card__img"
                  src={item.image_url}
                  alt={item.title ?? item.note}
                  loading="lazy"
                />
              ) : (
                <div className="insp-card__ph">Inspiration</div>
              )}
              <div className="insp-card__note">
                {item.title ?? item.note}
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className="insp-card__tags">
                  {item.tags.map((t) => `#${t}`).join("  ")}
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <ul className="list">
          {filtered.map((item) => (
            <li key={item.id}>
              <Link href={`/inspiration/${item.id}`}>
                <span className="list__title">
                  {item.title ?? item.note}
                </span>
                <span className="list__meta">
                  {item.tags && item.tags.length > 0
                    ? item.tags.map((t) => `#${t}`).join(" ")
                    : item.category}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
