"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import ImageUploader from "./ImageUploader";
import { createProduct, updateProduct } from "@/server/actions";
import type { Product } from "@/shared/types";

const empty = {
  name: "",
  price: "",
  category: "",
  color: "",
  material: "",
  silhouette: "",
  detail: "",
  what_i_like: "",
  what_i_would_change: "",
};

function toForm(p?: Product) {
  if (!p) return { ...empty };
  return {
    name: p.name ?? "",
    price: p.price ?? "",
    category: p.category ?? "",
    color: p.color ?? "",
    material: p.material ?? "",
    silhouette: p.silhouette ?? "",
    detail: p.detail ?? "",
    what_i_like: p.what_i_like ?? "",
    what_i_would_change: p.what_i_would_change ?? "",
  };
}

export default function ProductForm({
  brandId,
  product,
}: {
  brandId: string;
  product?: Product;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => toForm(product));
  const [images, setImages] = useState<string[]>(product?.image_urls ?? []);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  function submit() {
    setError(null);
    if (!form.name.trim()) {
      setError("제품 이름은 필수입니다.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      price: form.price || null,
      category: form.category || null,
      color: form.color || null,
      material: form.material || null,
      silhouette: form.silhouette || null,
      detail: form.detail || null,
      what_i_like: form.what_i_like || null,
      what_i_would_change: form.what_i_would_change || null,
      image_urls: images.length ? images : null,
    };
    start(async () => {
      const res = product
        ? await updateProduct(product.id, payload)
        : await createProduct({ ...payload, brand_id: brandId });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        className={product ? "btn btn--ghost" : "btn"}
        onClick={() => setOpen(true)}
      >
        {product ? "Edit" : "+ Add Product"}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={product ? "Edit Product" : "Add Product"}
      >
        <label className="field">
          <span className="field__label">Images</span>
          <ImageUploader
            value={images}
            onChange={setImages}
            multiple
            folder="products"
          />
        </label>

        <label className="field">
          <span className="field__label">Product Name *</span>
          <input className="field__input" value={form.name} onChange={set("name")} />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field__label">Price</span>
            <input className="field__input" value={form.price} onChange={set("price")} />
          </label>
          <label className="field">
            <span className="field__label">Category</span>
            <input className="field__input" value={form.category} onChange={set("category")} />
          </label>
        </div>

        <div className="field-row">
          <label className="field">
            <span className="field__label">Color</span>
            <input className="field__input" value={form.color} onChange={set("color")} />
          </label>
          <label className="field">
            <span className="field__label">Material</span>
            <input className="field__input" value={form.material} onChange={set("material")} />
          </label>
        </div>

        <div className="field-row">
          <label className="field">
            <span className="field__label">Silhouette</span>
            <input className="field__input" value={form.silhouette} onChange={set("silhouette")} />
          </label>
          <label className="field">
            <span className="field__label">Detail</span>
            <input className="field__input" value={form.detail} onChange={set("detail")} />
          </label>
        </div>

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
