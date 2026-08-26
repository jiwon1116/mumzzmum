import Link from "next/link";
import Media from "../components/Media";
import { AdminBar } from "../components/admin/AdminOnly";
import ExhibitionForm from "../components/admin/ExhibitionForm";
import { getExhibition } from "@/shared/data";

export const metadata = { title: "Exhibition — MUMZZMUM" };

export default async function ExhibitionPage() {
  const pieces = await getExhibition();

  return (
    <div className="container page">
      <header className="page__head">
        <p className="eyebrow">03 — Studio</p>
        <h1 className="page__title">Exhibition</h1>
        <p className="page__desc">
          내가 그린 도식과 디자인한 옷을 전시하는 공간. 아이디어에서 완성
          착장까지.
        </p>
        <p className="page__count">{pieces.length} Pieces</p>
      </header>

      <AdminBar>
        <ExhibitionForm />
      </AdminBar>

      {pieces.length === 0 ? (
        <div className="empty">아직 등록된 작업이 없습니다.</div>
      ) : (
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
      )}
    </div>
  );
}
