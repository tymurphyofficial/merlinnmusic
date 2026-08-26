import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import JamSubmissionForm from "@/components/JamSubmissionForm";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Let's Jam | MERLINN",
  description:
    "Sing a Merlinn song and send it in. Fan performances may be featured in YouTube videos — reviewed by hand, never auto-published.",
};

export const maxDuration = 60;

const rules = [
  {
    title: "Your voice. These songs.",
    body: "I'll keep writing new music. You sing it your way and I'll post it.",
  },
  {
    title: "Stay classy.",
    body: "Don't send me weird stuff.",
  },
  {
    title: "Let's jam.",
    body: "I have very few followers so the chance I'll make a video with you is really high.",
  },
];

export default function LetsJamPage() {
  return (
    <main className="min-h-[70vh] bg-[var(--background)] pb-10">
      <div className="mx-auto w-full max-w-3xl px-4 pt-5 pb-6 sm:px-6 sm:pt-6 sm:pb-10">
        <section className="rounded-md bg-[#3a3a3a] px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:px-8 sm:py-6">
          <div className="mt-0 space-y-4 text-sm leading-relaxed text-[#b0b0b0] sm:text-[0.95rem]">
            <div className="text-center">
              <p className="mb-2">
                I do not dream of becoming a famous musician. 
              </p>
              <p className="mb-2">
                I do not envy those who tour and spend their nights in hotel rooms.
              </p>
              <p className="mb-2">
                I am a life-long rhythm guitarist who loves to write and compose original music. 
              </p>
              <hr className="max-w-80 m-auto opacity-20 mt-4"/>
            </div>
            
            <p>
              My greatest obstacle is my voice. 
            </p>
            <p>
              Years of yelling in loud work environments—and belting 
              out screamo in my car—have left my vocal chords in tatters. Ten minutes of trying to speak 
              in a noisy pub and I'm hoarse. It's a shame, really. I can hear the music perfectly in my 
              mind, yet I lack the vocal instrument to play it (and I'd really rather not use an AI 
              singer—it cheapens the music I work so hard to write).
            </p>
            <p>
              The idea: my songs, your voice.
            </p>
            <p>
              Upload a clip of yourself belting out part of a Merlinn song below. Good, bad; don't care. I'll turn it into a
              split-screen with myself on the guitar and post it.
            </p>
            <p>
              Let's just have fun and make some music together.
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
