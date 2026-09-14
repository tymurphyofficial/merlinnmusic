import Album from "@/components/Album";
import { beardMakethTheMan, weightOfThings } from "@/data/album";
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
    <main className="h-full bg-[var(--background)] pb-10">
      <div className="flex justify-center min-h-screen">
        <h2 className="relative top-40">COMING SOON</h2>
      </div>
      {/* <Album album={weightOfThings} ownsAlbum={ownsAlbum} /> */}
      {/* <Album album={beardMakethTheMan} /> */}
    </main>
  );
}
