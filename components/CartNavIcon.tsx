"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartNavIcon() {
  const { items, isReady } = useCart();
  const hasItems = isReady && items.length > 0;

  return (
    <Link
      href="/cart"
      className="transition-opacity hover:opacity-75"
      aria-label={hasItems ? "Cart (has items)" : "Cart"}
    >
      <Image
        src={hasItems ? "/icon-chest-has-item.png" : "/icon-chest.png"}
        alt=""
        width={176}
        height={132}
        className="h-[30px] w-auto object-contain"
      />
    </Link>
  );
}
