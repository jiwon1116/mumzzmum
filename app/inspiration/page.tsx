import Link from "next/link";
import Media from "../components/Media";
import { AdminBar } from "../components/admin/AdminOnly";
import InspirationForm from "../components/admin/InspirationForm";
import { getInspiration } from "@/shared/data";

export const metadata = { title: "Inspiration — MUMZZMUM" };

export default async function InspirationPage() {
  const items = await getInspiration();

  return (
    <div className="container page">
      <header className="page__head">
        <p className="eyebrow">02 — Mood</p>
        <h1 className="page__title">Inspiration</h1>
        <p className="page__desc">
          그냥 저장하지 않는다. 왜 좋은지 한 줄로 남긴다. 쌓이면 내가 어떤
          것을 좋아하는지 패턴이 보인다.
        </p>
        <p className="page__count">{items.length} Notes</p>
      </header>

      <AdminBar>
        <InspirationForm />
      </AdminBar>

      {items.length === 0 ? (
        <div className="empty">아직 저장된 영감이 없습니다.</div>
      ) : (
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
      )}
    </div>
  );
}
