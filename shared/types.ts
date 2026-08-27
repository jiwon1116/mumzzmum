// ============================================================
//  mumzzmum · domain types
//  Mirrors supabase/schema.sql. Keep the two in sync.
// ============================================================

export type Role = "admin" | "user";

export type Profile = {
  id: string;
  role: Role;
};

/** A researched brand — the top of the COLLECTION hierarchy (Brand 1 : N Product). */
export type Brand = {
  id: string;
  slug: string;
  name: string;
  country: string | null; // country of origin
  founded: string | null; // founding year / date
  target: string | null;
  price_range: string | null;
  mood: string | null;
  description: string | null; // long-form "About the brand"
  brand_character: string[] | null; // tags
  signature: string | null;
  core_products: string | null;
  materials: string | null;
  color_palette: string | null;
  sns_content: string | null;
  what_i_like: string | null;
  what_i_would_change: string | null;
  created_at?: string;
};

/** A product that belongs to a Brand. */
export type Product = {
  id: string;
  brand_id: string;
  name: string;
  image_urls: string[] | null; // multiple images, first is the cover
  price: string | null;
  category: string | null;
  color: string | null;
  material: string | null;
  silhouette: string | null;
  detail: string | null;
  what_i_like: string | null;
  what_i_would_change: string | null;
  created_at?: string;
};

/** A saved visual reference in INSPIRATION. */
export type Inspiration = {
  id: string;
  title: string | null;
  image_url: string | null;
  category: string | null;
  source: string | null;
  note: string;
  tags: string[] | null;
  created_at?: string;
};

/** An original design shown in EXHIBITION. */
export type ExhibitionPiece = {
  id: string;
  title: string;
  image_urls: string[] | null;
  category: string | null;
  concept: string | null;
  design_notes: string | null;
  material: string | null;
  silhouette: string | null;
  details: string | null;
  date: string | null; // free-form, e.g. "2026 SS"
  created_at?: string;
};

// A brand together with its products — used on the brand detail page.
export type BrandWithProducts = Brand & { products: Product[] };
