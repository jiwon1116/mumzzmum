"use client";

import { useState } from "react";
import Link from "next/link";
import Media from "./Media";
import ViewToggle, { type View } from "./ViewToggle";
import type { ExhibitionPiece } from "@/shared/types";

export default function ExhibitionBrowser({
  pieces,
}: {
  pieces: ExhibitionPiece[];
}) {
  const [view, setView] = useState<View>("gallery");

  if (pieces.length === 0) {
    return <div className="empty">아직 등록된 작업이 없습니다.</div>;
  }

  return (
    <>
      <div className="toolbar">
        <span className="toolbar__label">{pieces.length} Pieces</span>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {view === "gallery" ? (
        <div className="grid-insta">
          {pieces.map((piece) => (
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
          {pieces.map((piece) => (
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
