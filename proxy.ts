import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_KEY, isSupabaseConfigured } from "@/shared/config";

// Next.js 16 renamed Middleware to Proxy (same functionality).
// Here it keeps the Supabase auth session fresh on every request by
// syncing cookies between the request and response.
export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });

  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(
    SUPABASE_URL as string,
    SUPABASE_KEY as string,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Touch the session so expired tokens are refreshed into the response cookies.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Run on all routes except static assets and image optimization.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
