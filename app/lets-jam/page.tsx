import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import FeaturedLyrics from "@/components/FeaturedLyrics";
import JamSubmissionForm from "@/components/JamSubmissionForm";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Let's Jam | MERLINN",
  description:
    "Sing a Merlinn song and send it in.",
};

export const maxDuration = 60;

export default function LetsJamPage() {
  return (
    <main className="min-h-[70vh] bg-[var(--background)] pb-10">
      <div className="mx-auto w-full max-w-3xl px-4 pt-5 pb-6 sm:px-6 sm:pt-6 sm:pb-10">
        <FeaturedLyrics />

        <section className="rounded-md bg-[#3a3a3a] px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:px-8 sm:py-6">
          <div className="mt-0 space-y-4 text-sm leading-relaxed text-[#b0b0b0] sm:text-[0.95rem]">
            <p>
              I am a life-long rhythm guitarist who loves to write and compose original music. 
            </p>
            <p>
              My greatest obstacle is my voice. Years of yelling in loud work environments has left my vocal chords in tatters. It&apos;s a shame, really. 
              I can hear the music perfectly in my mind, yet I lack the vocal instrument to play it. While AI comes close,
              I feel that it cheapens the music I work so hard to write.
            </p>
            <p>
              The idea: my songs, your voice.
            </p>
            <p>
              Upload a clip of yourself belting out part of a Merlinn song below. Good, bad; don&apos;t care. I&apos;ll turn it into a
              split-screen with myself on the guitar and post it.
            </p>
            <p>
              Let&apos;s just have fun and make some music together.
            </p>
          </div>
        </section>

        <section className="mt-2">
          <h2 className={`${cinzel.className} mt-8 px-1 text-xs tracking-[0.14em] text-[#a8a8a8] uppercase sm:text-sm`}>
            Send In Your Performance
          </h2>
          <div className="mt-2 rounded-md bg-[#3a3a3a] px-5 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:px-8 sm:py-8">
            <JamSubmissionForm />
          </div>
        </section>
      </div>
    </main>
  );
}
