import { NextResponse } from "next/server";
import { userOwnsProduct } from "@/lib/ownership";
import { createClient } from "@/lib/supabase/server";

type PostLoginBody = {
  cartItemIds?: string[];
};

function cartIdToProduct(cartItemId: string): string {
  return cartItemId.trim().toLowerCase().replace(/-/g, "_");
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: PostLoginBody = {};
  try {
    body = (await request.json()) as PostLoginBody;
  } catch {
    body = {};
  }

  const cartItemIds = Array.isArray(body.cartItemIds) ? body.cartItemIds : [];

  for (const cartItemId of cartItemIds) {
    const product = cartIdToProduct(cartItemId);
    const owns = await userOwnsProduct(user.id, product);
    if (owns) {
      return NextResponse.json({
        redirectTo: "/account",
        clearCart: true,
      });
    }
  }

  return NextResponse.json({
    redirectTo: "/checkout",
    clearCart: false,
  });
}
