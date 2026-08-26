// Central place for Supabase connection info.
// Accepts either the new "publishable" key name or the legacy "anon" name.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// When false, the app runs entirely on local seed data.
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);
