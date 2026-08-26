import { createClient } from "@/server/supabase/server";
import {
  seedBrands,
  seedProducts,
  seedInspiration,
  seedExhibition,
} from "./seed";
import type {
  Brand,
  Product,
  Inspiration,
  ExhibitionPiece,
  BrandWithProducts,
} from "./types";

// Every getter tries Supabase first and falls back to seed data, so the
// site renders identically before *and* after the database is connected.

// ---------- Brands ----------
export async function getBrands(): Promise<Brand[]> {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length) return data as Brand[];
  }
  return seedBrands;
}

export async function getBrand(slug: string): Promise<BrandWithProducts | null> {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("brands")
      .select("*, products(*)")
      .eq("slug", slug)
      .maybeSingle();
    if (!error && data) {
      const { products, ...brand } = data as Brand & { products: Product[] };
      return { ...brand, products: products ?? [] };
    }
  }
  const brand = seedBrands.find((b) => b.slug === slug);
  if (!brand) return null;
  return {
    ...brand,
    products: seedProducts.filter((p) => p.brand_id === brand.id),
  };
}

export async function getProduct(id: string): Promise<
  (Product & { brand: Pick<Brand, "id" | "name" | "slug"> | null }) | null
> {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*, brand:brands(id, name, slug)")
      .eq("id", id)
      .maybeSingle();
    if (!error && data) {
      return data as Product & {
        brand: Pick<Brand, "id" | "name" | "slug"> | null;
      };
    }
  }
  const product = seedProducts.find((p) => p.id === id);
  if (!product) return null;
  const brand = seedBrands.find((b) => b.id === product.brand_id) ?? null;
  return {
    ...product,
    brand: brand ? { id: brand.id, name: brand.name, slug: brand.slug } : null,
  };
}

// ---------- Inspiration ----------
export async function getInspiration(): Promise<Inspiration[]> {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("inspiration")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length) return data as Inspiration[];
  }
  return seedInspiration;
}

export async function getInspirationItem(
  id: string,
): Promise<Inspiration | null> {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("inspiration")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!error && data) return data as Inspiration;
  }
  return seedInspiration.find((i) => i.id === id) ?? null;
}

// ---------- Exhibition ----------
export async function getExhibition(): Promise<ExhibitionPiece[]> {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("exhibition")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length) return data as ExhibitionPiece[];
  }
  return seedExhibition;
}

export async function getExhibitionPiece(
  id: string,
): Promise<ExhibitionPiece | null> {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("exhibition")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!error && data) return data as ExhibitionPiece;
  }
  return seedExhibition.find((e) => e.id === id) ?? null;
}
