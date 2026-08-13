import Link from "next/link";
import { redirect } from "next/navigation";
import { createOrderFromCheckoutSession } from "@/lib/orders";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

type CheckoutSuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/account");
  }

  const { session_id: sessionId } = await searchParams;

  if (sessionId) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      // Only fulfill sessions that belong to this user.
      if (session.metadata?.user_id === user.id) {
        await createOrderFromCheckoutSession(session);
      }
    } catch (error) {
      console.error("Checkout success fulfillment error:", error);
    }
  }

  return (
    <main className="min-h-[70vh] bg-[var(--background)]">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20">
        <div className="w-full rounded-md bg-[#3a3a3a] px-6 py-10 shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:px-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Payment successful
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#b0b0b0]">
            Payment successful! You can now download the album from your
            account.
          </p>
          <Link
            href="/account"
            className="mt-8 inline-block cursor-pointer rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#2a2a2a] transition-opacity hover:opacity-90"
          >
            Go to account
          </Link>
        </div>
      </div>
    </main>
  );
}
