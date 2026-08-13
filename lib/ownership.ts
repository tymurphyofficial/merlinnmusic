import { createAdminClient } from "@/lib/supabase/admin";
import type { Order } from "@/lib/types/order";

/**
 * Returns true if the user has at least one paid order for the product.
 * Uses the service-role client so RLS cannot hide legitimate purchases.
 * Only call after the user ID has been verified via auth.getUser().
 */
export async function userOwnsProduct(
  userId: string,
  product: string,
): Promise<boolean> {
  try {
    const admin = createAdminClient();

    const { data, error } = await admin
      .from("orders")
      .select("id")
      .eq("user_id", userId)
      .eq("product", product)
      .eq("status", "paid")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Ownership check failed:", error.message);
      return false;
    }

    return Boolean(data);
  } catch (error) {
    console.error("Ownership check failed:", error);
    return false;
  }
}

/** Fetches all paid orders for a user, newest first. */
export async function getUserPaidOrders(userId: string): Promise<Order[]> {
  try {
    const admin = createAdminClient();

    const { data, error } = await admin
      .from("orders")
      .select("id, user_id, product, amount, status, created_at")
      .eq("user_id", userId)
      .eq("status", "paid")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch orders:", error.message);
      return [];
    }

    return (data as Order[] | null) ?? [];
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}
