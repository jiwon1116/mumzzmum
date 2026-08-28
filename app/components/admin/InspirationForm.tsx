"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import ImageUploader from "./ImageUploader";
import { createInspiration, updateInspiration } from "@/server/actions";
import type { Inspiration } from "@/shared/types";

const empty = { category: "", source: "", note: "", tags: "" };

function toForm(i?: Inspiration) {
  if (!i) return { ...empty };
  return {
    category: i.category ?? "",
    source: i.source ?? "",
    note: i.note ?? "",
    tags: (i.tags ?? []).join(", "),
  };
}

export default function InspirationForm({ item }: { item?: Inspiration }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => toForm(item));
  const [images, setImages] = useState<string[]>(
    item?.image_url ? [item.image_url] : [],
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  function submit() {
    setError(null);
    const payload = {
      title: null,
      category: form.category || null,
      source: form.source || null,
      note: form.note,
      tags: form.tags
        ? form.tags.split(",").map((s) => s.trim()).filter(Boolean)
        : null,
      image_url: images[0] ?? null,
    };
    start(async () => {
      const res = item
        ? await updateInspiration(item.id, payload)
        : await createInspiration(payload);
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
        className={item ? "btn btn--ghost" : "btn"}
        onClick={() => setOpen(true)}
      >
        {item ? "Edit" : "+ Add Inspiration"}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={item ? "Edit Inspiration" : "Add Inspiration"}
      >
        <div className="field">
          <span className="field__label">Image</span>
          <ImageUploader
            value={images}
            onChange={setImages}
            folder="inspiration"
          />
        </div>

        <div className="field-row">
          <label className="field">
            <span className="field__label">Category</span>
            <input className="field__input" value={form.category} onChange={set("category")} />
          </label>
          <label className="field">
            <span className="field__label">Source</span>
            <input className="field__input" value={form.source} onChange={set("source")} />
          </label>
        </div>

        <label className="field">
          <span className="field__label">Note — 왜 저장했는지</span>
          <textarea className="field__textarea" value={form.note} onChange={set("note")} />
        </label>

        <label className="field">
          <span className="field__label">Tags (comma separated)</span>
          <input
            className="field__input"
            value={form.tags}
            onChange={set("tags")}
            placeholder="silhouette, minimal"
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
