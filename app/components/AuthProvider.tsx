"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/shared/supabase/client";

type AuthState = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  /** Re-read the current user + role from the DB (e.g. after claiming admin). */
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Read the admin role straight from the DB (source of truth).
  const resolveRole = useCallback(
    async (nextUser: User | null) => {
      if (!nextUser || !supabase) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", nextUser.id)
        .maybeSingle();
      setIsAdmin(data?.role === "admin");
    },
    [supabase],
  );

  // Re-fetch user + role on demand (used after claiming admin).
  const refresh = useCallback(async () => {
    if (!supabase) return;
    const {
      data: { user: nextUser },
    } = await supabase.auth.getUser();
    setUser(nextUser);
    await resolveRole(nextUser);
  }, [supabase, resolveRole]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return;
      setUser(data.user);
      await resolveRole(data.user);
      if (active) setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      await resolveRole(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase, resolveRole]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAdmin,
      loading,
      signOut: async () => {
        await supabase?.auth.signOut();
      },
      refresh,
    }),
    [user, isAdmin, loading, supabase, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
