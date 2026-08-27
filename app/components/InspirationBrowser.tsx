"use client";

import { useState } from "react";
import Link from "next/link";
import Filmstrip from "./Filmstrip";
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
        <Filmstrip
          shots={items.map((item) => ({
            id: item.id,
            title: item.title ?? item.note ?? "Inspiration",
            src: item.image_url,
            href: `/inspiration/${item.id}`,
          }))}
        />
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
