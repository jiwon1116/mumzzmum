"use client";

import { useState } from "react";
import Link from "next/link";
import Coverflow from "./Coverflow";
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
        <Coverflow
          shots={pieces.map((piece) => ({
            id: piece.id,
            title: piece.title,
            src: piece.image_urls?.[0] ?? null,
            href: `/exhibition/${piece.id}`,
          }))}
        />
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
