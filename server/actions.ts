"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./supabase/server";
import type { Brand, Product, Inspiration, ExhibitionPiece } from "@/shared/types";

// ── result helper ────────────────────────────────────────────
type Result<T = void> = { ok: true; data?: T } | { ok: false; error: string };

const NOT_CONFIGURED =
  "Supabase가 아직 연결되지 않았습니다 (.env.local 확인).";
const NOT_ADMIN = "관리자만 변경할 수 있습니다.";

// Returns an admin-bound client, or an error result. Enforced in code AND
// again by RLS at the database — a non-admin cannot write either way.
async function adminClient() {
  const supabase = await createClient();
  if (!supabase) return { error: NOT_CONFIGURED as string, supabase: null };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: NOT_ADMIN, supabase: null };
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (data?.role !== "admin") return { error: NOT_ADMIN, supabase: null };
  return { error: null, supabase };
}

// ── URL import (paste a product/brand link → prefill the form) ─────
function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function metaContent(html: string, key: string): string | null {
  const esc = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${esc}["'][^>]*\\bcontent=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${esc}["']`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m && m[1]) return decodeEntities(m[1]);
  }
  return null;
}

export type UrlImport = {
  title: string | null;
  price: string | null;
  description: string | null;
  image_url: string | null;
};

export async function importFromUrl(url: string): Promise<Result<UrlImport>> {
  const { supabase, error } = await adminClient();
  if (!supabase) return { ok: false, error: error! };

  let target: URL;
  try {
    target = new URL(url.trim());
  } catch {
    return { ok: false, error: "올바른 URL이 아닙니다." };
  }

  try {
    const res = await fetch(target.toString(), {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        accept: "text/html",
      },
    });
    if (!res.ok) {
      return { ok: false, error: `페이지를 불러오지 못했습니다 (${res.status}).` };
    }
    const html = await res.text();

    const title =
      metaContent(html, "og:title") ||
      metaContent(html, "twitter:title") ||
      (html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]
        ? decodeEntities(html.match(/<title[^>]*>([^<]+)<\/title>/i)![1])
        : null);
    const description =
      metaContent(html, "og:description") || metaContent(html, "description");
    const price =
      metaContent(html, "og:price:amount") ||
      metaContent(html, "product:price:amount") ||
      metaContent(html, "twitter:data1");

    // Download the preview image into our own storage so it stays stable.
    let image_url: string | null = null;
    const rawImg =
      metaContent(html, "og:image") ||
      metaContent(html, "og:image:url") ||
      metaContent(html, "twitter:image");
    if (rawImg) {
      try {
        const imgUrl = new URL(rawImg, target).toString();
        const imgRes = await fetch(imgUrl);
        if (imgRes.ok) {
          const ct = imgRes.headers.get("content-type") || "image/jpeg";
          const ext = ct.includes("png")
            ? "png"
            : ct.includes("webp")
              ? "webp"
              : ct.includes("gif")
                ? "gif"
                : "jpg";
          const buf = new Uint8Array(await imgRes.arrayBuffer());
          const path = `imports/${crypto.randomUUID()}.${ext}`;
          const { error: upErr } = await supabase.storage
            .from("media")
            .upload(path, buf, { contentType: ct, upsert: false });
          if (!upErr) {
            image_url = supabase.storage.from("media").getPublicUrl(path)
              .data.publicUrl;
          }
        }
      } catch {
        /* leave image_url null on any image failure */
      }
    }

    return {
      ok: true,
      data: {
        title: title?.trim() || null,
        price: price?.trim() || null,
        description: description?.trim() || null,
        image_url,
      },
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "가져오기에 실패했습니다.",
    };
  }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Non-latin names (e.g. Korean) slugify to an empty string, which collides on
// the unique slug column. Fall back to a short random slug so saving always
// works and the URL stays unique.
function toSlug(preferred: string | null | undefined, name: string) {
  const base = preferred?.trim() ? slugify(preferred) : slugify(name);
  return base || `brand-${crypto.randomUUID().slice(0, 8)}`;
}

// ── Brands ───────────────────────────────────────────────────
type BrandInput = Partial<Omit<Brand, "id" | "created_at">> & { name: string };

export async function createBrand(input: BrandInput): Promise<Result<{ slug: string }>> {
  const { supabase, error } = await adminClient();
  if (!supabase) return { ok: false, error: error! };

  const slug = toSlug(input.slug, input.name);
  const { error: dbError } = await supabase
    .from("brands")
    .insert({ ...input, slug });
  if (dbError) return { ok: false, error: dbError.message };

  revalidatePath("/collection");
  revalidatePath("/");
  return { ok: true, data: { slug } };
}

export async function updateBrand(
  id: string,
  input: BrandInput,
): Promise<Result<{ slug: string }>> {
  const { supabase, error } = await adminClient();
  if (!supabase) return { ok: false, error: error! };

  const slug = toSlug(input.slug, input.name);
  const { error: dbError } = await supabase
    .from("brands")
    .update({ ...input, slug })
    .eq("id", id);
  if (dbError) return { ok: false, error: dbError.message };

  revalidatePath("/collection");
  revalidatePath(`/collection/${slug}`);
  return { ok: true, data: { slug } };
}

export async function deleteBrand(id: string): Promise<Result> {
  const { supabase, error } = await adminClient();
  if (!supabase) return { ok: false, error: error! };
  const { error: dbError } = await supabase.from("brands").delete().eq("id", id);
  if (dbError) return { ok: false, error: dbError.message };
  revalidatePath("/collection");
  revalidatePath("/");
  return { ok: true };
}

// ── Products ─────────────────────────────────────────────────
type ProductInput = Partial<Omit<Product, "id" | "created_at">> & {
  name: string;
  brand_id: string;
};

export async function createProduct(input: ProductInput): Promise<Result> {
  const { supabase, error } = await adminClient();
  if (!supabase) return { ok: false, error: error! };
  const { error: dbError } = await supabase.from("products").insert(input);
  if (dbError) return { ok: false, error: dbError.message };
  revalidatePath("/collection");
  return { ok: true };
}

export async function updateProduct(
  id: string,
  input: Partial<Omit<Product, "id" | "created_at">>,
): Promise<Result> {
  const { supabase, error } = await adminClient();
  if (!supabase) return { ok: false, error: error! };
  const { error: dbError } = await supabase
    .from("products")
    .update(input)
    .eq("id", id);
  if (dbError) return { ok: false, error: dbError.message };
  revalidatePath("/collection");
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<Result> {
  const { supabase, error } = await adminClient();
  if (!supabase) return { ok: false, error: error! };
  const { error: dbError } = await supabase
    .from("products")
    .delete()
    .eq("id", id);
  if (dbError) return { ok: false, error: dbError.message };
  revalidatePath("/collection");
  return { ok: true };
}

// ── Inspiration ──────────────────────────────────────────────
type InspirationInput = Partial<Omit<Inspiration, "id" | "created_at">>;

export async function createInspiration(
  input: InspirationInput,
): Promise<Result> {
  const { supabase, error } = await adminClient();
  if (!supabase) return { ok: false, error: error! };
  const { error: dbError } = await supabase
    .from("inspiration")
    .insert({ note: "", ...input });
  if (dbError) return { ok: false, error: dbError.message };
  revalidatePath("/inspiration");
  revalidatePath("/");
  return { ok: true };
}

export async function updateInspiration(
  id: string,
  input: InspirationInput,
): Promise<Result> {
  const { supabase, error } = await adminClient();
  if (!supabase) return { ok: false, error: error! };
  const { error: dbError } = await supabase
    .from("inspiration")
    .update(input)
    .eq("id", id);
  if (dbError) return { ok: false, error: dbError.message };
  revalidatePath("/inspiration");
  revalidatePath(`/inspiration/${id}`);
  return { ok: true };
}

export async function deleteInspiration(id: string): Promise<Result> {
  const { supabase, error } = await adminClient();
  if (!supabase) return { ok: false, error: error! };
  const { error: dbError } = await supabase
    .from("inspiration")
    .delete()
    .eq("id", id);
  if (dbError) return { ok: false, error: dbError.message };
  revalidatePath("/inspiration");
  revalidatePath("/");
  return { ok: true };
}

// ── Exhibition ───────────────────────────────────────────────
type ExhibitionInput = Partial<Omit<ExhibitionPiece, "id" | "created_at">> & {
  title: string;
};

export async function createExhibition(
  input: ExhibitionInput,
): Promise<Result> {
  const { supabase, error } = await adminClient();
  if (!supabase) return { ok: false, error: error! };
  const { error: dbError } = await supabase.from("exhibition").insert(input);
  if (dbError) return { ok: false, error: dbError.message };
  revalidatePath("/exhibition");
  revalidatePath("/");
  return { ok: true };
}

export async function updateExhibition(
  id: string,
  input: Partial<Omit<ExhibitionPiece, "id" | "created_at">>,
): Promise<Result> {
  const { supabase, error } = await adminClient();
  if (!supabase) return { ok: false, error: error! };
  const { error: dbError } = await supabase
    .from("exhibition")
    .update(input)
    .eq("id", id);
  if (dbError) return { ok: false, error: dbError.message };
  revalidatePath("/exhibition");
  revalidatePath(`/exhibition/${id}`);
  return { ok: true };
}

export async function deleteExhibition(id: string): Promise<Result> {
  const { supabase, error } = await adminClient();
  if (!supabase) return { ok: false, error: error! };
  const { error: dbError } = await supabase
    .from("exhibition")
    .delete()
    .eq("id", id);
  if (dbError) return { ok: false, error: dbError.message };
  revalidatePath("/exhibition");
  revalidatePath("/");
  return { ok: true };
}
