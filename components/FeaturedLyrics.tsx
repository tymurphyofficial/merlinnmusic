"use client";

import { useEffect, useState } from "react";
import { Cinzel } from "next/font/google";
import { JAM_LYRICS, type JamLyric } from "@/data/jam-lyrics";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function FeaturedLyrics() {
  const [featured, setFeatured] = useState<JamLyric | null>(
    JAM_LYRICS.length === 1 ? (JAM_LYRICS[0] ?? null) : null,
  );

  useEffect(() => {
    if (JAM_LYRICS.length <= 1) return;
    setFeatured(
      JAM_LYRICS[Math.floor(Math.random() * JAM_LYRICS.length)] ?? null,
    );
  }, []);

  if (!featured) return null;

  return (
    <figure className="mb-2 px-1 py-4 text-center sm:mb-6 sm:py-6">
      <blockquote>
        <p
          className={`${cinzel.className} whitespace-pre-line text-[0.95rem] leading-[1.85] tracking-[0.03em] text-white sm:text-sm`}
        >
          {featured.lyrics}
        </p>
      </blockquote>
      <figcaption
        className={`${cinzel.className} mt-2 text-sm font-medium tracking-[0.12em] text-[#a8a8a8] sm:text-base`}
      >
        {featured.song}
      </figcaption>
    </figure>
  );
}
