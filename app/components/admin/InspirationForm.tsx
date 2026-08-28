"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import ImageUploader from "./ImageUploader";
import { createInspiration, updateInspiration } from "@/server/actions";
import type { Inspiration } from "@/shared/types";

export default function InspirationForm({ item }: { item?: Inspiration }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(item?.note ?? "");
  const [images, setImages] = useState<string[]>(
    item?.image_url ? [item.image_url] : [],
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  // Start every "Add" session from a clean slate (no leftovers from last time).
  function openFresh() {
    setNote(item?.note ?? "");
    setImages(item?.image_url ? [item.image_url] : []);
    setError(null);
    setOpen(true);
  }

  function submit() {
    setError(null);
    if (!item && images.length === 0) {
      setError("사진을 하나 이상 추가하세요.");
      return;
    }
    start(async () => {
      let res: { ok: true } | { ok: false; error: string } = { ok: true };
      if (item) {
        res = await updateInspiration(item.id, {
          note: note || "",
          image_url: images[0] ?? null,
        });
      } else {
        // one inspiration entry per uploaded photo
        for (const img of images) {
          res = await createInspiration({ note: note || "", image_url: img });
          if (!res.ok) break;
        }
      }
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setOpen(false);
      if (!item) {
        setNote("");
        setImages([]);
      }
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        className={item ? "btn btn--ghost" : "btn"}
        onClick={openFresh}
      >
        {item ? "Edit" : "+ Add Inspiration"}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={item ? "Edit Inspiration" : "Add Inspiration"}
      >
        <div className="field">
          <span className="field__label">
            Photos — 여러 장 한 번에 올릴 수 있어요
          </span>
          <ImageUploader
            value={images}
            onChange={setImages}
            multiple
            folder="inspiration"
          />
        </div>

        <label className="field">
          <span className="field__label">메모 (선택)</span>
          <textarea
            className="field__textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="간략한 메모 — 왜 저장했는지"
          />
        </label>

        {!item && images.length > 1 && (
          <p className="login__hint" style={{ margin: "0 0 16px" }}>
            사진 {images.length}장이 각각 하나의 영감으로 등록됩니다
            {note ? " (같은 메모 적용)" : ""}.
          </p>
        )}

        {error && <p className="login__error">{error}</p>}

        <div className="modal__actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn--solid"
            onClick={submit}
            disabled={pending}
          >
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </Modal>
    </>
  );
}
