"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/shared/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError("Supabase가 연결되지 않았습니다. .env.local을 확인하세요.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="container page">
      <div className="login">
        <p className="eyebrow">Admin</p>
        <h1 className="login__title">Sign in</h1>
        <p className="login__hint">
          관리자만 콘텐츠를 추가·수정·삭제할 수 있습니다. 방문자는 로그인 없이
          모든 아카이브를 열람할 수 있습니다.
        </p>

        <form className="login__form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="field__input"
            />
          </label>
          <label className="field">
            <span className="field__label">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="field__input"
            />
          </label>

          {error && <p className="login__error">{error}</p>}

          <button type="submit" className="btn btn--solid" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <Link href="/" className="login__back">
          ← Back to archive
        </Link>
      </div>
    </div>
  );
}
