import { createClient } from "@/server/supabase/server";
import type {
  Brand,
  Product,
  Inspiration,
  ExhibitionPiece,
  BrandWithProducts,
} from "./types";

// Reads live data from Supabase. When Supabase isn't configured or a table is
// empty, the getters simply return empty results (no sample/seed data).

// ---------- Brands ----------
export async function getBrands(): Promise<Brand[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as Brand[];
}

export async function getBrand(slug: string): Promise<BrandWithProducts | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("brands")
    .select("*, products(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  const { products, ...brand } = data as Brand & { products: Product[] };
  return { ...brand, products: products ?? [] };
}

export async function getProduct(id: string): Promise<
  (Product & { brand: Pick<Brand, "id" | "name" | "slug"> | null }) | null
> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("products")
    .select("*, brand:brands(id, name, slug)")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as Product & {
    brand: Pick<Brand, "id" | "name" | "slug"> | null;
  };
}

// ---------- Inspiration ----------
export async function getInspiration(): Promise<Inspiration[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("inspiration")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as Inspiration[];
}

export async function getInspirationItem(
  id: string,
): Promise<Inspiration | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("inspiration")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as Inspiration;
}

// ---------- Exhibition ----------
export async function getExhibition(): Promise<ExhibitionPiece[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("exhibition")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as ExhibitionPiece[];
}

export async function getExhibitionPiece(
  id: string,
): Promise<ExhibitionPiece | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("exhibition")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as ExhibitionPiece;
}
