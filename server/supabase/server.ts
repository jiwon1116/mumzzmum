import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_KEY, isSupabaseConfigured } from "@/shared/config";

// Server-side Supabase client bound to the request's cookies.
// Used by Server Components (reads) and Server Actions (writes).
// Returns null when credentials are absent so callers fall back to seed data.
export async function createClient() {
  if (!isSupabaseConfigured) return null;

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL as string, SUPABASE_KEY as string, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component where cookies are read-only.
          // Session refresh is handled in proxy.ts, so this is safe to ignore.
        }
      },
    },
  });
}
