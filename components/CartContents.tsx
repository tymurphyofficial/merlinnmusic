"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartContents() {
  const { items, isReady, removeItem } = useCart();

  if (!isReady) {
    return (
      <p className="mt-4 px-1 text-sm text-[#a8a8a8]">Loading cart…</p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-4 px-1">
        <p className="text-sm text-[#a8a8a8]">Your cart is empty.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-white underline-offset-4 hover:underline"
        >
          Continue browsing
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-md bg-[#3a3a3a] px-5 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:px-8 sm:py-8"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
              <div className="relative mx-auto aspect-square w-40 shrink-0 overflow-hidden sm:mx-0 sm:w-44">
                <Image
                  src={item.coverSrc}
                  alt={item.coverAlt}
                  fill
                  sizes="176px"
                  className="object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col pt-0 sm:pt-1">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#b0b0b0]">
                  {item.subtitle}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <span className="text-base text-white">{item.price}</span>
                  <span className="text-xs tracking-wide text-[#a8a8a8] uppercase">
                    Digital download
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="mt-5 w-fit cursor-pointer text-sm text-[#a8a8a8] underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex justify-end px-1">
        <Link
          href="/checkout"
          className="cursor-pointer rounded-md bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-[#2a2a2a] transition-opacity hover:opacity-90"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
