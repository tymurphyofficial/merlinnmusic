"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/CartProvider";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
  redirectTo?: string;
};

export default function AuthForm({
  mode,
  redirectTo = "/",
}: AuthFormProps) {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const safeRedirect =
    redirectTo.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : "/";

  const isLogin = mode === "login";
  const title = showForgotPassword
    ? "Reset password"
    : isLogin
      ? "Log in"
      : "Sign up";
  const submitLabel = showForgotPassword
    ? "Send reset link"
    : isLogin
      ? "Log in"
      : "Create account";
  const alternateHref = isLogin
    ? `/signup${safeRedirect !== "/" ? `?redirect=${encodeURIComponent(safeRedirect)}` : ""}`
    : `/login${safeRedirect !== "/" ? `?redirect=${encodeURIComponent(safeRedirect)}` : ""}`;
  const alternateLabel = isLogin
    ? "Need an account? Sign up"
    : "Already have an account? Log in";

  async function resolvePostAuthDestination() {
    const response = await fetch("/api/auth/post-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItemIds: items.map((item) => item.id),
      }),
    });

    if (!response.ok) {
      router.push("/checkout");
      router.refresh();
      return;
    }

    const data = (await response.json()) as {
      redirectTo?: string;
      clearCart?: boolean;
    };

    if (data.clearCart) {
      clearCart();
    }

    router.push(data.redirectTo ?? "/checkout");
    router.refresh();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    const supabase = createClient();

    try {
      if (showForgotPassword) {
        const resetRedirect = `${window.location.origin}/auth/callback?next=/reset-password`;
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          email,
          { redirectTo: resetRedirect },
        );

        if (resetError) {
          setError(resetError.message);
          return;
        }

        setInfo("Check your email for a password reset link.");
        return;
      }

      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
          return;
        }

        await resolvePostAuthDestination();
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.session) {
        await resolvePostAuthDestination();
        return;
      }

      // Email confirmation may be required depending on Supabase settings.
      setInfo("Check your email to confirm your account before logging in.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6 sm:py-16">
      <div className="rounded-md bg-[#3a3a3a] px-6 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {title}
        </h1>
        <p className="mt-2 text-sm text-[#b0b0b0]">
          {showForgotPassword
            ? "Enter your email and we’ll send you a reset link."
            : isLogin
              ? "Welcome back. Enter your email and password."
              : "Create an account with your email and password."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm text-[#c8c8c8]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-white/30 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white"
              placeholder="you@example.com"
            />
          </div>

          {!showForgotPassword ? (
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="block text-sm text-[#c8c8c8]"
                >
                  Password
                </label>
                {isLogin ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setError(null);
                      setInfo(null);
                    }}
                    className="cursor-pointer text-sm text-[#a8a8a8] underline-offset-4 transition-opacity hover:text-white hover:underline"
                  >
                    Forgot password?
                  </button>
                ) : null}
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border border-white/30 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white"
                placeholder="••••••••"
              />
            </div>
          ) : null}

          {error ? (
            <p
              role="alert"
              className="border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
            >
              {error}
            </p>
          ) : null}

          {info ? (
            <p
              role="status"
              className="border border-white/20 bg-white/5 px-3 py-2 text-sm text-[#d0d0d0]"
            >
              {info}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer border border-white bg-white px-4 py-2.5 text-sm font-medium text-[#2a2a2a] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Please wait…" : submitLabel}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#a8a8a8]">
          {showForgotPassword ? (
            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setError(null);
                setInfo(null);
              }}
              className="cursor-pointer text-white underline-offset-4 transition-opacity hover:opacity-75 hover:underline"
            >
              Back to log in
            </button>
          ) : (
            <Link
              href={alternateHref}
              className="text-white underline-offset-4 transition-opacity hover:opacity-75 hover:underline"
            >
              {alternateLabel}
            </Link>
          )}
        </p>
      </div>
    </div>
  );
}
