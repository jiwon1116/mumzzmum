"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import ImageUploader from "./ImageUploader";
import { createExhibition, updateExhibition } from "@/server/actions";
import type { ExhibitionPiece } from "@/shared/types";

const empty = {
  title: "",
  category: "",
  concept: "",
  design_notes: "",
  material: "",
  silhouette: "",
  details: "",
  date: "",
};

function toForm(p?: ExhibitionPiece) {
  if (!p) return { ...empty };
  return {
    title: p.title ?? "",
    category: p.category ?? "",
    concept: p.concept ?? "",
    design_notes: p.design_notes ?? "",
    material: p.material ?? "",
    silhouette: p.silhouette ?? "",
    details: p.details ?? "",
    date: p.date ?? "",
  };
}

export default function ExhibitionForm({ piece }: { piece?: ExhibitionPiece }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => toForm(piece));
  const [images, setImages] = useState<string[]>(piece?.image_urls ?? []);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  function submit() {
    setError(null);
    if (!form.title.trim()) {
      setError("제목은 필수입니다.");
      return;
    }
    const payload = {
      title: form.title.trim(),
      category: form.category || null,
      concept: form.concept || null,
      design_notes: form.design_notes || null,
      material: form.material || null,
      silhouette: form.silhouette || null,
      details: form.details || null,
      date: form.date || null,
      image_urls: images.length ? images : null,
    };
    start(async () => {
      const res = piece
        ? await updateExhibition(piece.id, payload)
        : await createExhibition(payload);
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
        className={piece ? "btn btn--ghost" : "btn"}
        onClick={() => setOpen(true)}
      >
        {piece ? "Edit" : "+ Add Piece"}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={piece ? "Edit Piece" : "Add Piece"}
      >
        <label className="field">
          <span className="field__label">Images</span>
          <ImageUploader
            value={images}
            onChange={setImages}
            multiple
            folder="exhibition"
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field__label">Title *</span>
            <input className="field__input" value={form.title} onChange={set("title")} />
          </label>
          <label className="field">
            <span className="field__label">Category</span>
            <input className="field__input" value={form.category} onChange={set("category")} />
          </label>
        </div>

        <label className="field">
          <span className="field__label">Concept</span>
          <textarea className="field__textarea" value={form.concept} onChange={set("concept")} />
        </label>

        <label className="field">
          <span className="field__label">Design Notes</span>
          <textarea className="field__textarea" value={form.design_notes} onChange={set("design_notes")} />
        </label>

        <label className="field">
          <span className="field__label">Details</span>
          <textarea className="field__textarea" value={form.details} onChange={set("details")} />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field__label">Material</span>
            <input className="field__input" value={form.material} onChange={set("material")} />
          </label>
          <label className="field">
            <span className="field__label">Silhouette</span>
            <input className="field__input" value={form.silhouette} onChange={set("silhouette")} />
          </label>
        </div>

        <label className="field">
          <span className="field__label">Date</span>
          <input
            className="field__input"
            value={form.date}
            onChange={set("date")}
            placeholder="2026 SS"
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
