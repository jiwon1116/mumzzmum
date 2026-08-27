import Link from "next/link";
import { notFound } from "next/navigation";
import Media from "../../components/Media";
import { AdminBar } from "../../components/admin/AdminOnly";
import InspirationForm from "../../components/admin/InspirationForm";
import DeleteButton from "../../components/admin/DeleteButton";
import { getInspirationItem } from "@/shared/data";

export default async function InspirationDetailPage({
  params,
}: PageProps<"/inspiration/[id]">) {
  const { id } = await params;
  const item = await getInspirationItem(id);

  if (!item) notFound();

  const created = item.created_at
    ? new Date(item.created_at).toLocaleDateString("en-CA")
    : null;

  return (
    <div className="container page">
      <Link href="/inspiration" className="back-link">
        ← Inspiration
      </Link>

      <AdminBar>
        <InspirationForm item={item} />
        <DeleteButton
          kind="inspiration"
          id={item.id}
          redirectTo="/inspiration"
        />
      </AdminBar>

      <div className="insp-detail">
        {item.image_url ? (
          <div className="insp-detail__media">
            {/* original aspect ratio — no crop */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image_url} alt={item.title ?? item.note} />
          </div>
        ) : (
          <Media
            src={null}
            alt={item.title ?? item.note}
            label="Inspiration"
            className="detail__media"
          />
        )}

        <div>
          {item.note && <p className="insp-detail__note">{item.note}</p>}

          <dl className="dl">
            {created && (
              <div className="dl__row">
                <dt className="dl__key">작성일</dt>
                <dd className="dl__val">{created}</dd>
              </div>
            )}
            {item.category && (
              <div className="dl__row">
                <dt className="dl__key">Category</dt>
                <dd className="dl__val">{item.category}</dd>
              </div>
            )}
            {item.source && (
              <div className="dl__row">
                <dt className="dl__key">Source</dt>
                <dd className="dl__val">{item.source}</dd>
              </div>
            )}
          </dl>

          {item.tags && item.tags.length > 0 && (
            <section className="section">
              <div className="tags">
                {item.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
