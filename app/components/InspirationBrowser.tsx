"use client";

import { useState } from "react";
import Link from "next/link";
import Media from "./Media";
import ViewToggle, { type View } from "./ViewToggle";
import type { Inspiration } from "@/shared/types";

export default function InspirationBrowser({
  items,
}: {
  items: Inspiration[];
}) {
  const [view, setView] = useState<View>("gallery");

  if (items.length === 0) {
    return <div className="empty">아직 저장된 영감이 없습니다.</div>;
  }

  return (
    <>
      <div className="toolbar">
        <span className="toolbar__label">{items.length} Notes</span>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {view === "gallery" ? (
        <div className="masonry">
          {items.map((item) => (
            <Link href={`/inspiration/${item.id}`} key={item.id}>
              <figure className="insp-card">
                <Media
                  src={item.image_url}
                  alt={item.title ?? item.note}
                  label="Inspiration"
                  sizes="(max-width: 720px) 50vw, (max-width: 1080px) 33vw, 25vw"
                />
                <figcaption className="insp-card__note">
                  {item.title ?? item.note}
                </figcaption>
                {item.tags && item.tags.length > 0 && (
                  <div className="insp-card__tags">
                    {item.tags.map((t) => `#${t}`).join("  ")}
                  </div>
                )}
              </figure>
            </Link>
          ))}
        </div>
      ) : (
        <ul className="list">
          {items.map((item) => (
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
