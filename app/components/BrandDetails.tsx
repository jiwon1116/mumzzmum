"use client";

import { useState } from "react";
import type { Brand } from "@/shared/types";

/**
 * Collapsible "상세 정보" for a brand — keeps the long-form fields tucked
 * away so the page leads with the essentials and the products.
 */
export default function BrandDetails({ brand }: { brand: Brand }) {
  const [open, setOpen] = useState(false);

  const hasDetails =
    brand.signature ||
    brand.core_products ||
    brand.materials ||
    brand.color_palette ||
    brand.sns_content ||
    brand.what_i_like ||
    brand.what_i_would_change;

  if (!hasDetails) return null;

  return (
    <div className="accordion">
      <button
        type="button"
        className="accordion__toggle"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        상세 정보
        <span className="accordion__chev">{open ? "▴ 접기" : "▾ 펼치기"}</span>
      </button>

      {open && (
        <div className="accordion__body">
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
      )}
    </div>
  );
}
