import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "../../components/ProductGallery";
import { AdminBar } from "../../components/admin/AdminOnly";
import ExhibitionForm from "../../components/admin/ExhibitionForm";
import DeleteButton from "../../components/admin/DeleteButton";
import { getExhibitionPiece } from "@/shared/data";

export default async function ExhibitionDetailPage({
  params,
}: PageProps<"/exhibition/[id]">) {
  const { id } = await params;
  const piece = await getExhibitionPiece(id);

  if (!piece) notFound();

  const facts: { label: string; value: string | null }[] = [
    { label: "Category", value: piece.category },
    { label: "Material", value: piece.material },
    { label: "Silhouette", value: piece.silhouette },
    { label: "Date", value: piece.date },
  ];

  return (
    <div className="container page">
      <Link href="/exhibition" className="back-link">
        ← Exhibition
      </Link>

      <AdminBar>
        <ExhibitionForm piece={piece} />
        <DeleteButton kind="exhibition" id={piece.id} redirectTo="/exhibition" />
      </AdminBar>

      <div className="detail">
        <ProductGallery images={piece.image_urls ?? []} alt={piece.title} />

        <div>
          <h1 className="exh-detail__title">{piece.title}</h1>
          {piece.category && (
            <p className="exh-detail__meta">{piece.category}</p>
          )}

          {piece.concept && (
            <section className="section">
              <p className="section__label">Concept</p>
              <p className="prose">{piece.concept}</p>
            </section>
          )}

          {piece.design_notes && (
            <section className="section">
              <p className="section__label">Design Notes</p>
              <p className="prose">{piece.design_notes}</p>
            </section>
          )}

          {piece.details && (
            <section className="section">
              <p className="section__label">Details</p>
              <p className="prose">{piece.details}</p>
            </section>
          )}

          <dl className="dl">
            {facts.map(
              (f) =>
                f.value && (
                  <div className="dl__row" key={f.label}>
                    <dt className="dl__key">{f.label}</dt>
                    <dd className="dl__val">{f.value}</dd>
                  </div>
                ),
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
