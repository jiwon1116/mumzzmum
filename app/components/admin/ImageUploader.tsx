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

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const supabase = createClient();
    if (!supabase) {
      setError("Supabase가 연결되지 않아 업로드할 수 없습니다.");
      return;
    }

    setBusy(true);
    setError(null);
    const uploaded: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${folder}/${uid()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("media")
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type || undefined,
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
    if (uploaded.length) {
      onChange(multiple ? [...value, ...uploaded] : [uploaded[0]]);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div className="uploader">
      {value.length > 0 && (
        <div className="uploader__grid">
          {value.map((url, i) => (
            <div className="uploader__item" key={url + i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" />
              <button
                type="button"
                className="uploader__remove"
                onClick={() => removeAt(i)}
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className="uploader__drop"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        {busy
          ? "Uploading…"
          : multiple
            ? "Click or drop images to upload"
            : "Click or drop an image to upload"}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="login__error">{error}</p>}
    </div>
  );
}
