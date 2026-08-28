"use client";

import { useRef, useState } from "react";
import { createClient } from "@/shared/supabase/client";

// Unique id that also works on insecure origins (e.g. http://192.168.x.x on a
// phone) where crypto.randomUUID() is unavailable.
function uid() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// iPhone photos are often HEIC/HEIF, which most browsers can't display. Convert
// them to JPEG in the browser so they upload and render everywhere.
async function toUploadable(
  file: File,
): Promise<{ blob: Blob; ext: string; type: string }> {
  const isHeic =
    /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
  if (isHeic) {
    try {
      const heic2any = (await import("heic2any")).default as (opts: {
        blob: Blob;
        toType?: string;
        quality?: number;
      }) => Promise<Blob | Blob[]>;
      const out = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });
      const blob = Array.isArray(out) ? out[0] : out;
      return { blob, ext: "jpg", type: "image/jpeg" };
    } catch {
      /* conversion failed — fall back to uploading the original */
    }
  }
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  return { blob: file, ext, type: file.type || "image/jpeg" };
}

export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  folder = "uploads",
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // local object-URL previews shown instantly while the upload is in flight
  const [previews, setPreviews] = useState<string[]>([]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const supabase = createClient();
    if (!supabase) {
      setError("Supabase가 연결되지 않아 업로드할 수 없습니다.");
      return;
    }

    const list = Array.from(files);
    const localUrls = list.map((f) => URL.createObjectURL(f));
    setPreviews(localUrls);
    setBusy(true);
    setError(null);

    const uploaded: string[] = [];
    try {
      for (const file of list) {
        const { blob, ext, type } = await toUploadable(file);
        const path = `${folder}/${uid()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("media")
          .upload(path, blob, {
            cacheControl: "3600",
            upsert: false,
            contentType: type,
          });
        if (upErr) {
          setError(upErr.message);
          continue;
        }
        const {
          data: { publicUrl },
        } = supabase.storage.from("media").getPublicUrl(path);
        uploaded.push(publicUrl);
        if (!multiple) break;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "업로드 중 오류가 발생했습니다.");
    }

    setBusy(false);
    localUrls.forEach((u) => URL.revokeObjectURL(u));
    setPreviews([]);
    if (uploaded.length) {
      onChange(multiple ? [...value, ...uploaded] : [uploaded[0]]);
    } else if (!error) {
      setError("사진을 업로드하지 못했습니다. 다시 시도해 주세요.");
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div className="uploader">
      {(value.length > 0 || previews.length > 0) && (
        <div className="uploader__grid">
          {value.map((url, i) => (
            <div className="uploader__item" key={url + i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" />
              <button
                type="button"
                className="uploader__remove"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeAt(i);
                }}
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
          {previews.map((url, i) => (
            <div className="uploader__item uploader__item--pending" key={"p" + i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" />
            </div>
          ))}
        </div>
      )}

      {/* A real <label> around the input — reliably opens the picker AND fires
          change on iOS Safari (a programmatically-clicked hidden input does not). */}
      <label
        className="uploader__drop"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        {busy
          ? "Uploading…"
          : multiple
            ? "탭해서 사진 선택 (여러 장 가능)"
            : "탭해서 사진 선택"}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="uploader__input"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {error && <p className="login__error">{error}</p>}
    </div>
  );
}
