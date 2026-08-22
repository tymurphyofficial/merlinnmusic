"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { submitJam } from "@/app/lets-jam/actions";
import {
  formatFileSize,
  isAllowedJamFile,
  JAM_FILE_ACCEPT,
  JAM_FILE_ERROR,
  JAM_FILE_HINT,
  JAM_MAX_FILE_BYTES,
  JAM_MAX_FILE_MB,
  JAM_SONGS,
} from "@/data/jam";

const fieldClassName =
  "w-full border border-white/30 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white [color-scheme:dark]";

type UploadResponse = {
  url?: string;
  downloadUrl?: string;
  error?: string;
};

function uploadRecording(
  file: File,
  onProgress: (percent: number) => void,
): Promise<UploadResponse> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", "/api/jam/upload");

    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    request.onload = () => {
      try {
        const payload = JSON.parse(request.responseText) as UploadResponse;
        if (request.status >= 200 && request.status < 300) {
          resolve(payload);
          return;
        }
        reject(new Error(payload.error || "Couldn't upload that file."));
      } catch {
        reject(new Error("Couldn't upload that file. Please try again."));
      }
    };

    request.onerror = () => {
      reject(new Error("Couldn't upload that file. Please try again."));
    };

    const body = new FormData();
    body.set("recording", file);
    request.send(body);
  });
}

export default function JamSubmissionForm() {
  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const busy = uploading;

  function clearFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFileLabel(null);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = event.target.files?.[0];

    if (!file) {
      setFileLabel(null);
      return;
    }

    if (file.size > JAM_MAX_FILE_BYTES) {
      clearFileInput();
      setError(`That file is over ${JAM_MAX_FILE_MB}MB. Try a smaller file.`);
      return;
    }

    if (!isAllowedJamFile(file)) {
      clearFileInput();
      setError(JAM_FILE_ERROR);
      return;
    }

    setFileLabel(`${file.name} (${formatFileSize(file.size)})`);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("recording");

    if (!(file instanceof File) || file.size === 0) {
      setError("Please attach a video.");
      return;
    }

    if (file.size > JAM_MAX_FILE_BYTES) {
      setError(`That file is over ${JAM_MAX_FILE_MB}MB. Try a smaller file.`);
      return;
    }

    if (!isAllowedJamFile(file)) {
      setError(JAM_FILE_ERROR);
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const blob = await uploadRecording(file, setProgress);

      if (!blob.url) {
        throw new Error("Couldn't upload that file. Please try again.");
      }

      formData.delete("recording");
      formData.set("fileName", file.name);
      formData.set("fileSize", String(file.size));
      formData.set("fileUrl", blob.url);
      formData.set("downloadUrl", blob.downloadUrl || blob.url);

      setSuccess(true);

      try {
        await submitJam({ ok: false }, formData);
      } catch (notifyError) {
        console.error("[lets-jam] notification email failed", notifyError);
      }
    } catch (uploadError) {
      console.error("[lets-jam] upload failed", uploadError);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Couldn't upload that file. Please try again.",
      );
    } finally {
      setUploading(false);
      setProgress(null);
    }
  }

  if (success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="text-center sm:text-left"
      >
        <p className="text-xs tracking-[0.18em] text-[var(--accent)] uppercase">
          Received
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Your song is in the keep.
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-[#b0b0b0] sm:text-[0.95rem]">
          It arrived. I&apos;ll review it by hand — nothing auto-publishes into
          the void. If it belongs in a video, I&apos;ll be in touch. If it
          doesn&apos;t make this round, thank you for singing anyway. The world
          is heavier without it.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <div className="flex justify-between">
          <label htmlFor="song" className="mb-1.5 block text-sm text-[#c8c8c8]">
            Song
          </label>
          <a 
            href="https://open.spotify.com/artist/7gNAANPPa3ssSWF1coeiz9?si=f8ry3rDwS6u2Y2L8z2ooPA"
            className="mb-1.5 block text-sm text-[#c8c8c8] italic underline"
            target="_blank"
          >
            Listen on Spotify
          </a>
        </div>
        
        <div className="relative">
          <select
            id="song"
            name="song"
            required
            defaultValue=""
            className={`${fieldClassName} appearance-none pr-10`}
          >
            <option value="" disabled>
              Choose a song
            </option>
            {JAM_SONGS.map((song) => (
              <option key={song} value={song}>
                {song}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-white/60"
          >
            <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.58l3.3-3.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.42Z" />
          </svg>
        </div>
      </div>

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm text-[#c8c8c8]">
          Your name / stage name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={80}
          autoComplete="nickname"
          placeholder="What should the credits say?"
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm text-[#c8c8c8]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={120}
          autoComplete="email"
          placeholder="you@example.com"
          className={fieldClassName}
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <label htmlFor="socials" className="block text-sm text-[#c8c8c8]">
            Social handles
          </label>
          <span className="text-xs text-[#8a8a8a]">Optional</span>
        </div>
        <input
          id="socials"
          name="socials"
          type="text"
          maxLength={200}
          placeholder="Instagram, YouTube, TikTok — whatever you want credited"
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor="recording" className="mb-1.5 block text-sm text-[#c8c8c8]">
          Video
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label
            htmlFor="recording"
            className={`inline-flex items-center justify-center border border-white px-4 py-2.5 text-sm text-white transition-colors ${
              busy
                ? "pointer-events-none opacity-60"
                : "cursor-pointer hover:bg-white hover:text-[#2a2a2a]"
            }`}
          >
            Choose file
          </label>
          <p className="min-w-0 truncate text-sm text-[#a8a8a8]">
            {fileLabel ?? "No file chosen"}
          </p>
        </div>
        <input
          ref={fileInputRef}
          id="recording"
          name="recording"
          type="file"
          accept={JAM_FILE_ACCEPT}
          onChange={handleFileChange}
          className="sr-only"
        />
        <p className="mt-2 text-xs leading-relaxed text-[#8a8a8a]">
          {JAM_FILE_HINT}
        </p>
      </div>

      <div>
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <label htmlFor="message" className="block text-sm text-[#c8c8c8]">
            A short note
          </label>
          <span className="text-xs text-[#8a8a8a]">Optional</span>
        </div>
        <textarea
          id="message"
          name="message"
          rows={3}
          maxLength={500}
          placeholder="Take, setting, or anything I should know."
          className={`${fieldClassName} resize-y`}
        />
      </div>

      <label htmlFor="consent" className="flex cursor-pointer items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[var(--accent)]"
        />
        <span className="text-xs leading-relaxed text-[#b0b0b0] sm:text-sm">
          I grant Merlinn a non-exclusive, worldwide license to use this video,
          and my name or stage name, in videos, social posts, and related
          promotional materials, with credit. I confirm this is my original
          vocal performance of a Merlinn song, and I have the right to send it.
          I understand every submission is reviewed by hand and may not be used.
        </span>
      </label>

      {error ? (
        <p
          role="alert"
          className="border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="w-full cursor-pointer rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#2a2a2a] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[14rem]"
      >
        {uploading
          ? progress !== null
            ? `Uploading… ${progress}%`
            : "Uploading…"
          : "Send it in"}
      </button>
    </form>
  );
}
