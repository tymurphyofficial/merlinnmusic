"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePlayer, type PlayerTrack } from "@/components/PlayerProvider";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function PreviousIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6 6h2.2v12H6V6Zm3.3 6 8.7 6.2V5.8L9.3 12Z" />
    </svg>
  );
}

function NextIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M15.8 6H18v12h-2.2V6ZM6 5.8v12.4L14.7 12 6 5.8Z" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5.5v13l11-6.5L8 5.5Z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M7 5.5h3.5v13H7v-13Zm6.5 0H17v13h-3.5v-13Z" />
    </svg>
  );
}

function VolumeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M3.5 9.5h3.2L11 6.2v11.6L6.7 14.5H3.5v-5Zm9.2-.7a3.6 3.6 0 0 1 0 6.4v-1.7a1.9 1.9 0 0 0 0-3v-1.7Zm0-3.3a6.9 6.9 0 0 1 0 13v-1.7a5.2 5.2 0 0 0 0-9.6V5.5Z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    isVisible,
    currentTime,
    duration,
    volume,
    togglePlay,
    seek,
    setVolume,
    playNext,
    playPrevious,
    dismiss,
  } = usePlayer();

  // Keep the last track mounted while the bar slides down on dismiss.
  const [displayTrack, setDisplayTrack] = useState<PlayerTrack | null>(
    currentTrack,
  );

  useEffect(() => {
    if (currentTrack) {
      setDisplayTrack(currentTrack);
    }
  }, [currentTrack]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const track = currentTrack ?? displayTrack;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      aria-hidden={!isVisible}
      onTransitionEnd={(event) => {
        if (
          event.propertyName === "transform" &&
          !isVisible &&
          !currentTrack
        ) {
          setDisplayTrack(null);
        }
      }}
    >
      {track ? (
        <div className="relative h-[5.5rem]">
          <div className="mx-auto grid h-full max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 pr-14 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)] sm:gap-6 sm:px-6 sm:pr-20 lg:pr-24">
            {/* Now playing */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden sm:h-14 sm:w-14">
                <Image
                  src={track.coverSrc}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {track.title}
                </p>
                <p className="truncate text-xs text-[#a8a8a8]">
                  {track.artist}
                </p>
              </div>
            </div>

            {/* Volume */}
            <div className="hidden items-center justify-end gap-2 sm:col-start-3 sm:flex">
              <VolumeIcon className="h-4 w-4 text-[#a8a8a8]" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                aria-label="Volume"
                className="player-range h-1 w-24 cursor-pointer appearance-none rounded-full bg-[#4a4a4a]"
                style={{
                  background: `linear-gradient(to right, #fff ${volume * 100}%, #4a4a4a ${volume * 100}%)`,
                }}
              />
            </div>

            {/* Controls */}
            <div className="col-span-2 flex w-full min-w-0 flex-col items-center gap-1.5 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:max-w-xl sm:justify-self-center">
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={playPrevious}
                  className="text-white/80 transition-colors hover:text-white"
                  aria-label="Previous track"
                >
                  <PreviousIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <PauseIcon className="h-4 w-4" />
                  ) : (
                    <PlayIcon className="h-4 w-4 translate-x-px" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={playNext}
                  className="text-white/80 transition-colors hover:text-white"
                  aria-label="Next track"
                >
                  <NextIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="flex w-full items-center gap-2">
                <span className="w-8 text-right text-[0.65rem] tabular-nums text-[#a8a8a8]">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={(event) => seek(Number(event.target.value))}
                  aria-label="Seek"
                  className="player-range h-1 w-full cursor-pointer appearance-none rounded-full bg-[#4a4a4a]"
                  style={{
                    background: `linear-gradient(to right, #fff ${progress}%, #4a4a4a ${progress}%)`,
                  }}
                />
                <span className="w-8 text-[0.65rem] tabular-nums text-[#a8a8a8]">
                  {formatTime(duration || 0)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={dismiss}
            className="absolute top-1/2 right-3 z-10 -translate-y-1/2 text-white/70 transition-colors hover:text-white sm:right-5 md:right-6 lg:right-8"
            aria-label="Close player"
          >
            <CloseIcon className="h-10 w-10" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
