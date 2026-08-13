import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

type FulfillResult =
  | { ok: true; created: boolean; orderId: string }
  | { ok: false; error: string };

/**
 * Creates a paid order from a completed Stripe Checkout Session.
 * Idempotent: if the user already has a paid order for the product, skips insert.
 */
export async function createOrderFromCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<FulfillResult> {
  if (session.payment_status !== "paid") {
    return { ok: false, error: "Payment not completed" };
  }

  const userId = session.metadata?.user_id;
  const product = session.metadata?.product;

  if (!userId || !product) {
    return { ok: false, error: "Missing checkout metadata" };
  }

  const admin = createAdminClient();

  const { data: existing, error: existingError } = await admin
    .from("orders")
    .select("id")
    .eq("user_id", userId)
    .eq("product", product)
    .eq("status", "paid")
    .limit(1)
    .maybeSingle();

  if (existingError) {
    console.error("Order lookup failed:", existingError.message);
    return { ok: false, error: existingError.message };
  }

  if (existing) {
    return { ok: true, created: false, orderId: existing.id };
  }

  const { data: created, error: insertError } = await admin
    .from("orders")
    .insert({
      user_id: userId,
      product,
      amount: session.amount_total ?? 0,
      status: "paid",
    })
    .select("id")
    .single();

  if (insertError || !created) {
    console.error("Order insert failed:", insertError?.message);
    return {
      ok: false,
      error: insertError?.message ?? "Unable to create order",
    };
  }

  return { ok: true, created: true, orderId: created.id };
}
