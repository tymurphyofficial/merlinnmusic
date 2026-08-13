"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { tracklist, type Track } from "@/data/tracklist";
import { weightOfThings } from "@/data/album";

export type PlayerTrack = Track & {
  audioSrc: string;
  coverSrc: string;
  artist: string;
};

type PlayerContextValue = {
  currentTrack: PlayerTrack | null;
  isPlaying: boolean;
  isVisible: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playTrack: (track: PlayerTrack) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  dismiss: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

function getPlayableTracks(): PlayerTrack[] {
  return tracklist.flatMap((section) =>
    section.tracks
      .filter((track): track is Track & { audioSrc: string } =>
        Boolean(track.audioSrc),
      )
      .map((track) => ({
        ...track,
        coverSrc: weightOfThings.coverSrc,
        artist: "Merlinn",
      })),
  );
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackRef = useRef<PlayerTrack | null>(null);
  const playableTracks = useMemo(() => getPlayableTracks(), []);

  const [currentTrack, setCurrentTrack] = useState<PlayerTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = 0.8;
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audioRef.current = null;
    };
  }, []);

  const loadAndPlay = useCallback((track: PlayerTrack) => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsVisible(true);
    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(0);
    audio.src = encodeURI(track.audioSrc);
    void audio.play();
  }, []);

  const playTrack = useCallback(
    (track: PlayerTrack) => {
      const audio = audioRef.current;
      if (!audio) return;

      setIsVisible(true);

      if (currentTrackRef.current?.id === track.id) {
        if (audio.paused) {
          void audio.play();
        } else {
          audio.pause();
        }
        return;
      }

      loadAndPlay(track);
    },
    [loadAndPlay],
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrackRef.current) return;

    if (audio.paused) {
      void audio.play();
    } else {
      audio.pause();
    }
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((next: number) => {
    const clamped = Math.min(1, Math.max(0, next));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);

  const playNext = useCallback(() => {
    const current = currentTrackRef.current;
    if (!current || playableTracks.length === 0) return;
    const index = playableTracks.findIndex((t) => t.id === current.id);
    if (index < 0) return;
    const nextIndex = (index + 1) % playableTracks.length;
    loadAndPlay(playableTracks[nextIndex]);
  }, [loadAndPlay, playableTracks]);

  const playPrevious = useCallback(() => {
    const audio = audioRef.current;
    const current = currentTrackRef.current;
    if (!current || !audio) return;

    if (audio.currentTime > 3) {
      seek(0);
      return;
    }

    const index = playableTracks.findIndex((t) => t.id === current.id);
    if (index <= 0) {
      seek(0);
      return;
    }
    loadAndPlay(playableTracks[index - 1]);
  }, [loadAndPlay, playableTracks, seek]);

  const dismiss = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    // Hide first so the bar can slide down while content is still mounted.
    setIsVisible(false);
    setCurrentTrack(null);
    setIsPlaying(false);
  }, []);

  const value = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      isVisible,
      currentTime,
      duration,
      volume,
      playTrack,
      togglePlay,
      seek,
      setVolume,
      playNext,
      playPrevious,
      dismiss,
    }),
    [
      currentTrack,
      isPlaying,
      isVisible,
      currentTime,
      duration,
      volume,
      playTrack,
      togglePlay,
      seek,
      setVolume,
      playNext,
      playPrevious,
      dismiss,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
