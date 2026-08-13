import Image from "next/image";
import { redirect } from "next/navigation";
import CheckoutPurchaseButton from "@/components/CheckoutPurchaseButton";
import { weightOfThings } from "@/data/album";
import { createClient } from "@/lib/supabase/server";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/checkout");
  }

  const album = weightOfThings;

  return (
    <main className="min-h-[70vh] bg-[var(--background)]">
      <div className="mx-auto w-full max-w-lg px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-center text-2xl font-semibold tracking-tight text-white">
          Checkout
        </h1>

        <div className="mt-8 rounded-md bg-[#3a3a3a] px-6 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:px-8">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left sm:gap-6">
            <div className="relative aspect-square w-40 shrink-0 overflow-hidden sm:w-36">
              <Image
                src={album.coverSrc}
                alt={album.coverAlt}
                fill
                sizes="160px"
                className="object-cover"
                priority
              />
            </div>

            <div className="min-w-0 flex-1 pt-1">
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                {album.title}
              </h2>
              <p className="mt-2 text-sm text-[#a8a8a8]">Digital download</p>
              <p className="mt-1 text-xs leading-relaxed text-[#8a8a8a] italic">
                Digital download available from account page after purchase
              </p>
              <p className="mt-4 text-lg text-white">{album.price}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-white/15 pt-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-[#a8a8a8]">Total</span>
              <span className="text-xl font-semibold text-white">
                {album.price}
              </span>
            </div>

            <CheckoutPurchaseButton price={album.price} />
          </div>
        </div>
      </div>
    </main>
  );
}
