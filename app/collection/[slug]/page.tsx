import Link from "next/link";
import { notFound } from "next/navigation";
import ProductsBrowser from "../../components/ProductsBrowser";
import Accordion from "../../components/Accordion";
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

  const facts: { label: string; value: string | null }[] = [
    { label: "Target", value: brand.target },
    { label: "Price", value: brand.price_range },
    { label: "Mood", value: brand.mood },
  ].filter((f) => f.value);

  const sub = [brand.country, brand.founded ? `Est. ${brand.founded}` : null]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <div className="container page">
      <Link href="/collection" className="back-link">
        ← Collection
      </Link>

      <AdminBar>
        <BrandForm brand={brand} />
        <DeleteButton kind="brand" id={brand.id} redirectTo="/collection" />
      </AdminBar>

      <div className="branddetail">
        <aside className="branddetail__meta">
          <header className="brandhead">
            <p className="eyebrow">Brand</p>
            <h1 className="brandhead__name">{brand.name}</h1>
            {sub && <p className="brandhead__sub">{sub}</p>}
          </header>

          {facts.length > 0 && (
            <div className="brandfacts">
              {facts.map((f) => (
                <div className="brandfacts__item" key={f.label}>
                  <span className="brandfacts__key">{f.label}</span>
                  <span className="brandfacts__val">{f.value}</span>
                </div>
              ))}
            </div>
          )}
        </aside>

        <div className="branddetail__body">
          {brand.description && (
            <Accordion title="About the Brand" defaultOpen>
              <p className="prose">{brand.description}</p>
            </Accordion>
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

          {brand.what_i_like && (
            <Accordion title="What I Like">
              <p className="prose">{brand.what_i_like}</p>
            </Accordion>
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
        <ProductsBrowser products={brand.products} brandSlug={brand.slug} />
      </section>
    </div>
  );
}
