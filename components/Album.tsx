"use client";

import Image from "next/image";
import Link from "next/link";
import { Cinzel } from "next/font/google";
import { useCart } from "@/components/CartProvider";
import { usePlayer, type PlayerTrack } from "@/components/PlayerProvider";
import type { Album as AlbumData } from "@/data/album";
import { isHomeOnly } from "@/lib/features";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const trackGrid =
  "grid grid-cols-[1.25rem_2rem_1fr_4rem] items-center gap-x-2 px-1 sm:grid-cols-[1.5rem_2.25rem_1fr_4.5rem]";

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="10"
        cy="10"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path d="M8.2 6.4v7.2L14.2 10 8.2 6.4Z" />
    </svg>
  );
}

function CoverPlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {/* Nudged right so the triangle reads centered in a circle */}
      <path d="M20 12.5v23l18-11.5L20 12.5Z" />
    </svg>
  );
}

function WaveformIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <rect className="origin-center animate-pulse" x="5" y="7" width="2" height="6" rx="0.5" />
      <rect x="9" y="4" width="2" height="12" rx="0.5" />
      <rect className="origin-center animate-pulse" x="13" y="6" width="2" height="8" rx="0.5" style={{ animationDelay: "150ms" }} />
    </svg>
  );
}

type AlbumProps = {
  album: AlbumData;
  ownsAlbum?: boolean;
};

export default function Album({ album, ownsAlbum = false }: AlbumProps) {
  const homeOnly = isHomeOnly();
  const { currentTrack, isPlaying, playTrack } = usePlayer();
  const { addItem, hasItem, isReady } = useCart();
  const inCart = isReady && hasItem(album.id);

  const handlePlay = (track: AlbumData["sections"][number]["tracks"][number]) => {
    if (!track.audioSrc) return;

    const playerTrack: PlayerTrack = {
      ...track,
      audioSrc: track.audioSrc,
      coverSrc: album.coverSrc,
      artist: "Merlinn",
    };
    playTrack(playerTrack);
  };

  const handlePlayAlbum = () => {
    const firstPlayable = album.sections
      .flatMap((section) => section.tracks)
      .find((track) => Boolean(track.audioSrc));

    if (firstPlayable) {
      handlePlay(firstPlayable);
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: album.id,
      title: album.title,
      subtitle: album.subtitle,
      price: album.price,
      coverSrc: album.coverSrc,
      coverAlt: album.coverAlt,
    });
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-4 pt-5 pb-6 sm:px-6 sm:pt-6 sm:pb-10">
      <div className="rounded-md bg-[#3a3a3a] px-5 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:px-8 sm:py-8">
        {/* Album header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <div className="relative mx-auto aspect-square w-40 shrink-0 overflow-hidden sm:mx-0 sm:w-44">
            <Image
              src={album.coverSrc}
              alt={album.coverAlt}
              fill
              priority
              sizes="176px"
              className="object-cover"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col pt-0 sm:pt-1">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {album.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#b0b0b0]">
              {album.subtitle}
            </p>

            <button
              type="button"
              onClick={handlePlayAlbum}
              className="mt-4 flex h-[2.45rem] w-[2.45rem] cursor-pointer items-center justify-center rounded-full bg-black/40 text-white/90 transition-opacity hover:opacity-80 sm:h-[2.8rem] sm:w-[2.8rem]"
              aria-label="Play album"
            >
              <CoverPlayIcon className="h-[1.4rem] w-[1.4rem] sm:h-[1.575rem] sm:w-[1.575rem]" />
            </button>

            {!homeOnly ? (
              <div className="mt-5 flex items-center gap-4">
                {ownsAlbum ? (
                  <span className="text-sm tracking-wide text-[var(--accent)] uppercase">
                    owned!
                  </span>
                ) : inCart ? (
                  <>
                    <span className="text-base text-white">{album.price}</span>
                    <Link
                      href="/cart"
                      className="cursor-pointer border border-white/50 px-4 py-1.5 text-sm text-white/80 transition-colors hover:border-white hover:text-white"
                    >
                      In cart
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="text-base text-white">{album.price}</span>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="cursor-pointer border border-white px-4 py-1.5 text-sm text-white transition-colors hover:bg-white hover:text-[#2a2a2a]"
                    >
                      Add to cart
                    </button>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Tracklist */}
        <div className="mt-8 sm:mt-10">
          <div className={`${trackGrid} pb-2 text-sm text-[#a8a8a8]`}>
            <span />
            <span>#</span>
            <span>Title</span>
            <span className="text-right">Length</span>
          </div>
          <div className="border-t border-white/90" />

          <div className="mt-1">
            {(() => {
              let trackNumber = 0;
              return album.sections.map((section) => (
                <section key={section.id} className="mt-6 first:mt-3">
                  {section.title ? (
                    <h2
                      className={`${cinzel.className} px-1 pb-2 text-xs tracking-[0.14em] text-[#a8a8a8] uppercase sm:text-sm`}
                    >
                      {section.title}
                    </h2>
                  ) : null}

                  <ul>
                    {section.tracks.map((track) => {
                      trackNumber += 1;
                      const displayNumber = trackNumber;
                      const isPlayable = Boolean(track.audioSrc);
                      const isCurrent = currentTrack?.id === track.id;
                      const showWaveform = isCurrent && isPlaying;

                      const rowClassName = `${trackGrid} w-full py-2 text-left ${
                        isPlayable
                          ? "cursor-pointer transition-colors hover:bg-white/5"
                          : ""
                      }`;

                      const content = (
                        <>
                          <span className="flex h-5 w-5 items-center justify-center">
                            {isPlayable ? (
                              showWaveform ? (
                                <WaveformIcon className="h-4 w-4 text-[var(--accent)]" />
                              ) : (
                                <PlayIcon className="h-4 w-4 text-white" />
                              )
                            ) : null}
                          </span>

                          <span className="text-sm tabular-nums text-[#c8c8c8]">
                            {displayNumber}
                          </span>

                          <span
                            className={`${cinzel.className} truncate text-[0.8rem] tracking-[0.06em] uppercase sm:text-sm ${
                              isCurrent ? "text-[var(--accent)]" : "text-white"
                            } ${
                              !track.visible
                                ? "pointer-events-none select-none blur-[6px]"
                                : ""
                            }`}
                            aria-hidden={!track.visible}
                          >
                            {track.title}
                          </span>

                          <span
                            className={`text-right text-sm tabular-nums text-[#c8c8c8] ${
                              !track.visible
                                ? "pointer-events-none select-none blur-[6px]"
                                : ""
                            }`}
                            aria-hidden={!track.visible}
                          >
                            {track.length}
                          </span>
                        </>
                      );

                      return (
                        <li key={track.id}>
                          {isPlayable ? (
                            <button
                              type="button"
                              onClick={() => handlePlay(track)}
                              className={rowClassName}
                              aria-label={
                                showWaveform
                                  ? `Pause ${track.title}`
                                  : `Play ${track.title}`
                              }
                            >
                              {content}
                            </button>
                          ) : (
                            <div className={rowClassName}>{content}</div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ));
            })()}
          </div>
        </div>
      </div>

      <p className="mt-4 px-1 text-[0.65rem] leading-relaxed text-[#9a9a9a] sm:mt-5 sm:text-xs">
        {album.disclaimer}
      </p>
    </section>
  );
}
