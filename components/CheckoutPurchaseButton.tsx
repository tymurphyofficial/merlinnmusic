"use client";

import { useState } from "react";

export default function CheckoutPurchaseButton({ price }: { price: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !data.url) {
        setError(data.error ?? "Unable to start checkout");
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 flex w-full flex-col items-center gap-3 sm:items-end">
      {error ? (
        <p role="alert" className="w-full text-sm text-red-300 sm:text-right">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="w-full cursor-pointer rounded-md bg-[var(--accent)] px-6 py-3.5 text-base font-semibold text-[#2a2a2a] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[14rem]"
      >
        {loading ? "Redirecting…" : `Pay ${price}`}
      </button>
    </div>
  );
}
