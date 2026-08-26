"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteBrand,
  deleteProduct,
  deleteInspiration,
  deleteExhibition,
} from "@/server/actions";

type Kind = "brand" | "product" | "inspiration" | "exhibition";

const actions = {
  brand: deleteBrand,
  product: deleteProduct,
  inspiration: deleteInspiration,
  exhibition: deleteExhibition,
};

export default function DeleteButton({
  kind,
  id,
  label = "Delete",
  redirectTo,
}: {
  kind: Kind;
  id: string;
  label?: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!confirm("정말 삭제할까요? 되돌릴 수 없습니다.")) return;
    start(async () => {
      const res = await actions[kind](id);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        className="btn btn--ghost btn--danger"
        onClick={handleClick}
        disabled={pending}
      >
        {pending ? "Deleting…" : label}
      </button>
      {error && <span className="login__error">{error}</span>}
    </>
  );
}
