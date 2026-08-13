import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { userOwnsProduct } from "@/lib/ownership";
import { WAY_OF_KINGS_PRODUCT } from "@/lib/types/order";

const BUCKET = process.env.SUPABASE_DOWNLOADS_BUCKET ?? "downloads";
const OBJECT_PATH = "the_way_of_kings.zip";
/** Signed URL lifetime in seconds — keep short. */
const SIGNED_URL_EXPIRES_IN = 60;

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ownsAlbum = await userOwnsProduct(user.id, WAY_OF_KINGS_PRODUCT);

  if (!ownsAlbum) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Sign with the service role only after ownership is confirmed so the
  // private bucket never needs a public (or broad authenticated) policy.
  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json(
      {
        error:
          "Server misconfigured: add SUPABASE_SERVICE_ROLE_KEY to .env.local",
      },
      { status: 500 },
    );
  }

  const { data: signed, error: signedError } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(OBJECT_PATH, SIGNED_URL_EXPIRES_IN);

  if (signedError || !signed?.signedUrl) {
    console.error("Signed URL error:", {
      bucket: BUCKET,
      path: OBJECT_PATH,
      message: signedError?.message,
    });

    return NextResponse.json(
      {
        error: "Unable to create download link",
        details: signedError?.message ?? "No signed URL returned",
        bucket: BUCKET,
        path: OBJECT_PATH,
      },
      { status: 500 },
    );
  }

  return NextResponse.redirect(signed.signedUrl);
}
