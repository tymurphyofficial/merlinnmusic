import Link from "next/link";
import { Cinzel } from "next/font/google";
import Album from "@/components/Album";
import { beardMakethTheMan, weightOfThings } from "@/data/album";
import { userOwnsProduct } from "@/lib/ownership";
import { createClient } from "@/lib/supabase/server";
import { WAY_OF_KINGS_PRODUCT } from "@/lib/types/order";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

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
      <div className="mx-auto w-full max-w-3xl px-4 pt-5 sm:px-6 sm:pt-6">
        <div className="flex gap-2 mb-2">
          <Link
            href="/the-music"
            className={`${cinzel.className} flex w-full rounded-md bg-[#151515] py-3 sm:py-5 justify-center items-center text-center text-md font-medium tracking-[0.16em] text-white uppercase transition-opacity hover:opacity-80 sm:py-6 sm:text-xl`}
          >
            How I Make Music
          </Link>
          <Link
            href="/lets-jam"
            className={`${cinzel.className} flex w-full rounded-md bg-[#151515] py-3 sm:py-5 justify-center items-center text-center text-xl font-medium tracking-[0.16em] text-white uppercase transition-opacity hover:opacity-80 sm:py-6 sm:text-xl`}
          >
            Let's Jam
          </Link>
        </div>
      </div>
      <Album album={weightOfThings} ownsAlbum={ownsAlbum} />
      <Album album={beardMakethTheMan} />
    </main>
  );
}
