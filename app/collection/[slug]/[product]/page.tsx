import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "../../../components/ProductGallery";
import { AdminBar } from "../../../components/admin/AdminOnly";
import ProductForm from "../../../components/admin/ProductForm";
import DeleteButton from "../../../components/admin/DeleteButton";
import { getProduct } from "@/shared/data";

export default async function ProductDetailPage({
  params,
}: PageProps<"/collection/[slug]/[product]">) {
  const { slug, product: productId } = await params;
  const product = await getProduct(productId);

  if (!product) notFound();

  const facts: { label: string; value: string | null }[] = [
    { label: "Brand", value: product.brand?.name ?? null },
    { label: "Price", value: product.price },
    { label: "Category", value: product.category },
    { label: "Color", value: product.color },
    { label: "Material", value: product.material },
    { label: "Silhouette", value: product.silhouette },
    { label: "Detail", value: product.detail },
  ];

  return (
    <div className="container page">
      <Link href={`/collection/${slug}`} className="back-link">
        ← {product.brand?.name ?? "Brand"}
      </Link>

      <AdminBar>
        <ProductForm brandId={product.brand_id} product={product} />
        <DeleteButton
          kind="product"
          id={product.id}
          redirectTo={`/collection/${slug}`}
        />
      </AdminBar>

      <div className="detail">
        <ProductGallery
          images={product.image_urls ?? []}
          alt={product.name}
        />

        <div>
          <h1 className="detail__name">{product.name}</h1>
          {product.brand && (
            <p className="detail__meta">
              <Link href={`/collection/${product.brand.slug}`}>
                {product.brand.name}
              </Link>
            </p>
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

          {(product.what_i_like || product.what_i_would_change) && (
            <section className="section section-split">
              {product.what_i_like && (
                <div>
                  <p className="section__label">What I Like</p>
                  <p className="prose">{product.what_i_like}</p>
                </div>
              )}
              {product.what_i_would_change && (
                <div>
                  <p className="section__label">What I Would Change</p>
                  <p className="prose">{product.what_i_would_change}</p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
