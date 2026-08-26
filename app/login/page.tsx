"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/shared/supabase/client";
import { useAuth } from "@/app/components/AuthProvider";

type Mode = "signin" | "signup";

// Supabase Auth is email-based, so an "ID" is mapped to a synthetic address.
// The domain must be a valid TLD (Supabase rejects ".local"), and Supabase
// "Confirm email" MUST be OFF since this address never receives mail.
const ID_DOMAIN = "mumzzmum.com";
const emailFromId = (id: string) =>
  `${id.trim().toLowerCase()}@${ID_DOMAIN}`;
// Allowed IDs: letters, numbers, dot, underscore, hyphen — 3+ chars.
const ID_RE = /^[a-z0-9._-]{3,}$/i;

export default function LoginPage() {
  const { user, isAdmin, refresh } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const id = username.trim();
    if (!ID_RE.test(id)) {
      setError("아이디는 영문·숫자·(._-) 3자 이상이어야 합니다.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setError("Supabase가 연결되지 않았습니다. .env.local을 확인하세요.");
      return;
    }

    const email = emailFromId(id);
    setLoading(true);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      setLoading(false);

      if (error) {
        setError(`가입 실패: ${error.message}`);
        return;
      }
      // Supabase returns a user with no identities when the ID already exists.
      if (data.user && data.user.identities?.length === 0) {
        setError("이미 존재하는 아이디입니다. 로그인해 주세요.");
        setMode("signin");
        return;
      }
      if (data.session) {
        await refresh();
        setNotice("계정이 생성되었습니다. 아래에서 관리자 권한을 받으세요.");
        return;
      }
      // No session → "Confirm email" is ON, but there is no real inbox for an ID.
      setError(
        "가입은 되었지만 자동 로그인이 막혔습니다. Supabase → Authentication → " +
          "Providers → Email 에서 'Confirm email'을 끈 뒤 다시 로그인하세요.",
      );
      setMode("signin");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setError(`로그인 실패: ${error.message}`);
      return;
    }
    await refresh();
  }

  async function handleClaimAdmin() {
    setError(null);
    setNotice(null);
    const supabase = createClient();
    if (!supabase) return;

    setClaiming(true);
    const { data, error } = await supabase.rpc("claim_admin");
    setClaiming(false);

    if (error) {
      setError(
        `관리자 등록 실패: ${error.message} — Supabase SQL Editor에서 supabase/schema.sql을 실행했는지 확인하세요.`,
      );
      return;
    }
    if (data === "promoted") {
      await refresh();
      setNotice("관리자로 등록되었습니다. 이제 콘텐츠를 추가·수정·삭제할 수 있습니다.");
    } else if (data === "admin-exists") {
      setError("이미 관리자가 존재합니다. 추가 관리자는 Supabase에서 직접 지정하세요.");
    } else {
      setError("로그인 상태가 아닙니다. 먼저 로그인하세요.");
    }
  }

  // Show the ID portion (strip the synthetic domain) for a logged-in user.
  const displayId = user?.email?.replace(`@${ID_DOMAIN}`, "") ?? "";

  return (
    <div className="container page">
      <div className="login">
        <p className="eyebrow">Admin</p>
        <h1 className="login__title">
          {mode === "signup" ? "Create account" : "Sign in"}
        </h1>
        <p className="login__hint">
          관리자만 콘텐츠를 추가·수정·삭제할 수 있습니다. 방문자는 로그인 없이
          모든 아카이브를 열람할 수 있습니다.
        </p>

        {user ? (
          <div className="login__form">
            <p className="login__hint" style={{ margin: "0 0 20px" }}>
              <b>{displayId}</b> 로 로그인됨 —{" "}
              {isAdmin ? "관리자" : "일반 사용자"}.
            </p>

            {notice && <p className="login__notice">{notice}</p>}
            {error && <p className="login__error">{error}</p>}

            {isAdmin ? (
              <Link href="/" className="btn btn--solid" style={{ width: "100%" }}>
                아카이브로 이동
              </Link>
            ) : (
              <button
                type="button"
                className="btn btn--solid"
                onClick={handleClaimAdmin}
                disabled={claiming}
              >
                {claiming ? "등록 중…" : "관리자 권한 받기 (최초 1회)"}
              </button>
            )}

            <button
              type="button"
              className="btn"
              style={{ width: "100%", marginTop: 10 }}
              onClick={async () => {
                const supabase = createClient();
                await supabase?.auth.signOut();
                await refresh();
              }}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <>
            <form className="login__form" onSubmit={handleSubmit}>
              <label className="field">
                <span className="field__label">아이디</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  className="field__input"
                  placeholder="영문·숫자·(._-) 3자 이상"
                />
              </label>
              <label className="field">
                <span className="field__label">비밀번호</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  minLength={6}
                  required
                  className="field__input"
                  placeholder="6자 이상"
                />
              </label>

              {notice && <p className="login__notice">{notice}</p>}
              {error && <p className="login__error">{error}</p>}

              <button
                type="submit"
                className="btn btn--solid"
                disabled={loading}
              >
                {loading
                  ? "처리 중…"
                  : mode === "signup"
                    ? "가입하기"
                    : "로그인"}
              </button>
            </form>
          </>
        )}

        <Link href="/" className="login__back">
          ← Back to archive
        </Link>
      </div>
    </div>
  );
}
