"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Media from "./Media";
import type { Product } from "@/shared/types";

export default function ProductsBrowser({
  products,
  brandSlug,
}: {
  products: Product[];
  brandSlug: string;
}) {
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return Array.from(set).sort();
  }, [products]);

  const filtered = category
    ? products.filter((p) => p.category === category)
    : products;

  if (products.length === 0) {
    return <div className="empty">아직 등록된 제품이 없습니다.</div>;
  }

  return (
    <>
      {categories.length > 0 && (
        <div className="filter">
          <button
            type="button"
            className={`chip${category === null ? " is-active" : ""}`}
            onClick={() => setCategory(null)}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip${category === c ? " is-active" : ""}`}
              onClick={() => setCategory(category === c ? null : c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="grid-products">
        {filtered.map((product) => (
          <Link
            key={product.id}
            href={`/collection/${brandSlug}/${product.id}`}
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
    </>
  );
}
