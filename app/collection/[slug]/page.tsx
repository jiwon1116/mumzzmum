import Link from "next/link";
import { notFound } from "next/navigation";
import Media from "../../components/Media";
import { AdminBar, AdminOnly } from "../../components/admin/AdminOnly";
import BrandForm from "../../components/admin/BrandForm";
import ProductForm from "../../components/admin/ProductForm";
import DeleteButton from "../../components/admin/DeleteButton";
import { getBrand } from "@/shared/data";

export default async function BrandDetailPage({
  params,
}: PageProps<"/collection/[slug]">) {
  const { slug } = await params;
  const brand = await getBrand(slug);

  if (!brand) notFound();

  const quickFacts: { label: string; value: string | null }[] = [
    { label: "Target", value: brand.target },
    { label: "Price Range", value: brand.price_range },
    { label: "Mood", value: brand.mood },
  ];

  return (
    <div className="container page">
      <Link href="/collection" className="back-link">
        ← Collection
      </Link>

      <AdminBar>
        <BrandForm brand={brand} />
        <DeleteButton kind="brand" id={brand.id} redirectTo="/collection" />
      </AdminBar>

      <div className="detail">
        <div className="detail__media">
          <Media
            src={brand.image_url}
            alt={brand.name}
            label={brand.name}
            className="detail__media"
            sizes="(max-width: 860px) 100vw, 45vw"
            priority
          />
        </div>

        <div>
          <h1 className="detail__name">{brand.name}</h1>

          <dl className="dl">
            {quickFacts.map(
              (f) =>
                f.value && (
                  <div className="dl__row" key={f.label}>
                    <dt className="dl__key">{f.label}</dt>
                    <dd className="dl__val">{f.value}</dd>
                  </div>
                ),
            )}
          </dl>

          {brand.description && (
            <section className="section">
              <p className="section__label">About the Brand</p>
              <p className="prose">{brand.description}</p>
            </section>
          )}

          {brand.brand_character && brand.brand_character.length > 0 && (
            <section className="section">
              <p className="section__label">Brand Character</p>
              <div className="tags">
                {brand.brand_character.map((c) => (
                  <span className="tag" key={c}>
                    {c}
                  </span>
                ))}
              </div>
            </section>
          )}

          {(brand.signature || brand.core_products) && (
            <section className="section section-split">
              {brand.signature && (
                <div>
                  <p className="section__label">Signature</p>
                  <p className="prose">{brand.signature}</p>
                </div>
              )}
              {brand.core_products && (
                <div>
                  <p className="section__label">Core Products</p>
                  <p className="prose">{brand.core_products}</p>
                </div>
              )}
            </section>
          )}

          {(brand.materials || brand.color_palette) && (
            <section className="section section-split">
              {brand.materials && (
                <div>
                  <p className="section__label">Materials</p>
                  <p className="prose">{brand.materials}</p>
                </div>
              )}
              {brand.color_palette && (
                <div>
                  <p className="section__label">Color Palette</p>
                  <p className="prose">{brand.color_palette}</p>
                </div>
              )}
            </section>
          )}

          {brand.sns_content && (
            <section className="section">
              <p className="section__label">SNS / Content</p>
              <p className="prose">{brand.sns_content}</p>
            </section>
          )}

          {(brand.what_i_like || brand.what_i_would_change) && (
            <section className="section section-split">
              {brand.what_i_like && (
                <div>
                  <p className="section__label">What I Like</p>
                  <p className="prose">{brand.what_i_like}</p>
                </div>
              )}
              {brand.what_i_would_change && (
                <div>
                  <p className="section__label">What I Would Change</p>
                  <p className="prose">{brand.what_i_would_change}</p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {/* Products */}
      <section className="section">
        <p className="section__label">Products — {brand.products.length}</p>
        <AdminOnly>
          <div className="card-admin" style={{ marginBottom: "20px" }}>
            <ProductForm brandId={brand.id} />
          </div>
        </AdminOnly>
        {brand.products.length === 0 ? (
          <div className="empty">아직 등록된 제품이 없습니다.</div>
        ) : (
          <div className="grid-products">
            {brand.products.map((product) => (
              <Link
                key={product.id}
                href={`/collection/${brand.slug}/${product.id}`}
                className="product-card"
              >
                <Media
                  src={product.image_urls?.[0]}
                  alt={product.name}
                  label={product.name}
                  className="product-card__media"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="product-card__name">{product.name}</div>
                <div className="product-card__meta">
                  {product.price && <span>{product.price}</span>}
                  {product.color && <span>{product.color}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
