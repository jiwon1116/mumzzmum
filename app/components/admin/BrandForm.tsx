"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { createBrand, updateBrand } from "@/server/actions";
import type { Brand } from "@/shared/types";

// Quick-pick presets — click to fill; typing custom values still works.
const TARGET_OPTS = ["10대", "20대", "30대", "40대+", "유니섹스", "캐주얼", "미니멀", "스트릿", "빈티지", "워크웨어"];
const MOOD_OPTS = ["Vintage", "Minimal", "Street", "Workwear", "Americana", "Casual", "Romantic", "Avant-garde", "Luxury", "Sporty"];

/** Multi-value picker — clicking toggles the tag in a separator-joined string. */
function MultiChips({
  value,
  sep,
  options,
  onChange,
}: {
  value: string;
  sep: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const parts = value
    ? value.split(sep.trim() ? sep.trim() : sep).map((s) => s.trim()).filter(Boolean)
    : [];
  const toggle = (o: string) => {
    const next = parts.includes(o)
      ? parts.filter((p) => p !== o)
      : [...parts, o];
    onChange(next.join(sep));
  };
  return (
    <div className="presets">
      {options.map((o) => (
        <button
          type="button"
          key={o}
          className={`chip${parts.includes(o) ? " is-active" : ""}`}
          onClick={() => toggle(o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

const empty = {
  name: "",
  slug: "",
  country: "",
  founded: "",
  target: "",
  mood: "",
  description: "",
  brand_character: "",
  what_i_like: "",
};

function toForm(brand?: Brand) {
  if (!brand) return { ...empty };
  return {
    name: brand.name ?? "",
    slug: brand.slug ?? "",
    country: brand.country ?? "",
    founded: brand.founded ?? "",
    target: brand.target ?? "",
    mood: brand.mood ?? "",
    description: brand.description ?? "",
    brand_character: (brand.brand_character ?? []).join(", "),
    what_i_like: brand.what_i_like ?? "",
  };
}

export default function BrandForm({ brand }: { brand?: Brand }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => toForm(brand));
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

  // Open from a clean slate so nothing carries over from the last time.
  function openFresh() {
    setForm(toForm(brand));
    setError(null);
    setOpen(true);
  }

  function submit() {
    setError(null);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      country: form.country || null,
      founded: form.founded || null,
      target: form.target || null,
      mood: form.mood || null,
      description: form.description || null,
      brand_character: form.brand_character
        ? form.brand_character.split(",").map((s) => s.trim()).filter(Boolean)
        : null,
      what_i_like: form.what_i_like || null,
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
        onClick={openFresh}
      >
        {brand ? "Edit" : "+ Add Brand"}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={brand ? "Edit Brand" : "Add Brand"}
      >
        <label className="field">
          <span className="field__label">Brand Name *</span>
          <input className="field__input" value={form.name} onChange={set("name")} />
        </label>

        <label className="field">
          <span className="field__label">Slug (URL)</span>
          <input
            className="field__input"
            value={form.slug}
            onChange={set("slug")}
            placeholder="자동 생성됨"
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field__label">Country (국가)</span>
            <input
              className="field__input"
              value={form.country}
              onChange={set("country")}
              placeholder="예: France, 한국"
            />
          </label>
          <label className="field">
            <span className="field__label">Founded (설립일)</span>
            <input
              className="field__input"
              value={form.founded}
              onChange={set("founded")}
              placeholder="예: 1994"
            />
          </label>
        </div>

        <div className="field-row">
          <label className="field">
            <span className="field__label">Target</span>
            <input className="field__input" value={form.target} onChange={set("target")} />
            <MultiChips
              value={form.target}
              sep=" / "
              options={TARGET_OPTS}
              onChange={(v) => setForm((f) => ({ ...f, target: v }))}
            />
          </label>
          <label className="field">
            <span className="field__label">Mood</span>
            <input className="field__input" value={form.mood} onChange={set("mood")} />
            <MultiChips
              value={form.mood}
              sep=" · "
              options={MOOD_OPTS}
              onChange={(v) => setForm((f) => ({ ...f, mood: v }))}
            />
          </label>
        </div>

        <label className="field">
          <span className="field__label">브랜드 설명 (About)</span>
          <textarea
            className="field__textarea"
            value={form.description}
            onChange={set("description")}
          />
        </label>

        <label className="field">
          <span className="field__label">What I Like</span>
          <textarea
            className="field__textarea"
            value={form.what_i_like}
            onChange={set("what_i_like")}
          />
        </label>

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
