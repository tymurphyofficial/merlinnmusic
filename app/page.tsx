import Album from "@/components/Album";
import { weightOfThings } from "@/data/album";
import { userOwnsProduct } from "@/lib/ownership";
import { createClient } from "@/lib/supabase/server";
import { WAY_OF_KINGS_PRODUCT } from "@/lib/types/order";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ownsAlbum = user
    ? await userOwnsProduct(user.id, WAY_OF_KINGS_PRODUCT)
    : false;

  return (
    <main className="min-h-[70vh] bg-[var(--background)] pb-10">
      <Album album={weightOfThings} ownsAlbum={ownsAlbum} />
    </main>
  );
}
