"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_KEY, isSupabaseConfigured } from "../config";

// Browser-side Supabase client (used by auth UI, uploads, client forms).
// Returns null when credentials are absent so the UI can degrade gracefully.
export function createClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(SUPABASE_URL as string, SUPABASE_KEY as string);
}
