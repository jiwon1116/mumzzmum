"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import ImageUploader from "./ImageUploader";
import { createBrand, updateBrand } from "@/server/actions";
import type { Brand } from "@/shared/types";

const empty = {
  name: "",
  slug: "",
  target: "",
  price_range: "",
  mood: "",
  description: "",
  brand_character: "",
  signature: "",
  core_products: "",
  materials: "",
  color_palette: "",
  sns_content: "",
  what_i_like: "",
  what_i_would_change: "",
};

function toForm(brand?: Brand) {
  if (!brand) return { ...empty };
  return {
    name: brand.name ?? "",
    slug: brand.slug ?? "",
    target: brand.target ?? "",
    price_range: brand.price_range ?? "",
    mood: brand.mood ?? "",
    description: brand.description ?? "",
    brand_character: (brand.brand_character ?? []).join(", "),
    signature: brand.signature ?? "",
    core_products: brand.core_products ?? "",
    materials: brand.materials ?? "",
    color_palette: brand.color_palette ?? "",
    sns_content: brand.sns_content ?? "",
    what_i_like: brand.what_i_like ?? "",
    what_i_would_change: brand.what_i_would_change ?? "",
  };
}

export default function BrandForm({ brand }: { brand?: Brand }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => toForm(brand));
  const [images, setImages] = useState<string[]>(
    brand?.image_url ? [brand.image_url] : [],
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const set =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  function submit() {
    setError(null);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      target: form.target || null,
      price_range: form.price_range || null,
      mood: form.mood || null,
      description: form.description || null,
      brand_character: form.brand_character
        ? form.brand_character.split(",").map((s) => s.trim()).filter(Boolean)
        : null,
      signature: form.signature || null,
      core_products: form.core_products || null,
      materials: form.materials || null,
      color_palette: form.color_palette || null,
      sns_content: form.sns_content || null,
      what_i_like: form.what_i_like || null,
      what_i_would_change: form.what_i_would_change || null,
      image_url: images[0] ?? null,
    };
    if (!payload.name) {
      setError("브랜드 이름은 필수입니다.");
      return;
    }
    start(async () => {
      const res = brand
        ? await updateBrand(brand.id, payload)
        : await createBrand(payload);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setOpen(false);
      if (!brand && res.data) router.push(`/collection/${res.data.slug}`);
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        className={brand ? "btn btn--ghost" : "btn"}
        onClick={() => setOpen(true)}
      >
        {brand ? "Edit" : "+ Add Brand"}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={brand ? "Edit Brand" : "Add Brand"}
      >
        <label className="field">
          <span className="field__label">Main Image</span>
          <ImageUploader value={images} onChange={setImages} folder="brands" />
        </label>

        <label className="field">
          <span className="field__label">Brand Name *</span>
          <input className="field__input" value={form.name} onChange={set("name")} />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field__label">Slug (URL)</span>
            <input
              className="field__input"
              value={form.slug}
              onChange={set("slug")}
              placeholder="자동 생성됨"
            />
          </label>
          <label className="field">
            <span className="field__label">Price Range</span>
            <input className="field__input" value={form.price_range} onChange={set("price_range")} />
          </label>
        </div>

        <div className="field-row">
          <label className="field">
            <span className="field__label">Target</span>
            <input className="field__input" value={form.target} onChange={set("target")} />
          </label>
          <label className="field">
            <span className="field__label">Mood</span>
            <input className="field__input" value={form.mood} onChange={set("mood")} />
          </label>
        </div>

        <label className="field">
          <span className="field__label">About the Brand</span>
          <textarea className="field__textarea" value={form.description} onChange={set("description")} />
        </label>

        <label className="field">
          <span className="field__label">Brand Character (comma separated)</span>
          <input
            className="field__input"
            value={form.brand_character}
            onChange={set("brand_character")}
            placeholder="Vintage, Workwear, Americana"
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field__label">Signature</span>
            <input className="field__input" value={form.signature} onChange={set("signature")} />
          </label>
          <label className="field">
            <span className="field__label">Core Products</span>
            <input className="field__input" value={form.core_products} onChange={set("core_products")} />
          </label>
        </div>

        <div className="field-row">
          <label className="field">
            <span className="field__label">Materials</span>
            <input className="field__input" value={form.materials} onChange={set("materials")} />
          </label>
          <label className="field">
            <span className="field__label">Color Palette</span>
            <input className="field__input" value={form.color_palette} onChange={set("color_palette")} />
          </label>
        </div>

        <label className="field">
          <span className="field__label">SNS / Content</span>
          <textarea className="field__textarea" value={form.sns_content} onChange={set("sns_content")} />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field__label">What I Like</span>
            <textarea className="field__textarea" value={form.what_i_like} onChange={set("what_i_like")} />
          </label>
          <label className="field">
            <span className="field__label">What I Would Change</span>
            <textarea className="field__textarea" value={form.what_i_would_change} onChange={set("what_i_would_change")} />
          </label>
        </div>

        {error && <p className="login__error">{error}</p>}

        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button type="button" className="btn btn--solid" onClick={submit} disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </Modal>
    </>
  );
}
