"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setPassword("");
      setConfirmPassword("");
      setSuccess("Password updated successfully.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label
          htmlFor="new-password"
          className="mb-1.5 block text-sm text-[#c8c8c8]"
        >
          New password
        </label>
        <input
          id="new-password"
          name="new-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full border border-white/30 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="mb-1.5 block text-sm text-[#c8c8c8]"
        >
          Confirm password
        </label>
        <input
          id="confirm-password"
          name="confirm-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full border border-white/30 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white"
          placeholder="••••••••"
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
        >
          {error}
        </p>
      ) : null}

      {success ? (
        <p
          role="status"
          className="border border-white/20 bg-white/5 px-3 py-2 text-sm text-[#d0d0d0]"
        >
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer border border-white px-4 py-2 text-sm text-white transition-colors hover:bg-white hover:text-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
