import type { Metadata } from "next";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "The Music | MERLINN",
  description: "How Merlinn makes his epic wizardly music.",
};

const steps = [
  {
    title: "Step 1 - Foundation",
    description:
      "Before anything is written, you must decide what you are going to write about. Is the message and emotional tone you imagine for the song best served by fast power-metal with sweeping virtuoso guitar solos, or melodic and passionate acoustics?  ",
  },
  {
    title: "Step 2 - Work The Chords",
    description:
      "Find the sequence of chords that captures the feeling you envision. Do this by playing and experimenting with different chord sequences. Vary the rhythm, the strumming patterns, the time signature, the key. I keep at it until I've found my core sequence and it just 'feels right'.",
  },
  {
    title: "Step 3 - Melody",
    description:
      "With my core chords in place, I play them over and over and over again. As I do, I hum. Sometimes I moan. Other times I say nonsense words. Eventually, I settle on a vocal melody that fits the chords and the mood of the song. I then record it on my phone so that I don't forget it (because I will).",
  },
  {
    title: "Step 4 - Expand & Arrange",
    description:
      "With the root of the song—a single chord progression, rhythm and timing, and a vocal melody—in place, it's time to expand. I now experiment with other chords progressions based off this one that might be good for a verse or chorus or bridge. I move pieces around and create additional vocal melodies. By the end, the song is arranged and the vocal melodies are ready for lyrics.",
  },
  {
    title: "Step 5 - Lyrics",
    description:
      "I put words to the vocal melodies I've written and hummed now well over a hundred times. ",
  },
  {
    title: "Step 6 - Recording",
    description:
      "I record the guitar parts that I have written on my computer using GarageBand. There are usually two parts, and so I record both and layer them. I then record the vocals, singing them myself. Even though my voice is not great, I can still carry a note and handle the melodies well enough. I layer this over the guitar parts and export the rough recording.",
  },
  {
    title: "Step 7 - The Poor Artist's Dilemma",
    description:
      "Everything up until this point is how to create the soul of a song. The chords, the rhythms, the melodies, the lyrics—they have all come from me. If I had the resources to hire musicians to track the other parts, I would. But I can't afford to drop thousands of dollars on every song. That's crazy. So, I turn to the machine (yes, I mean AI.)",
  },
  {
    title: "Step 8 - The Machine",
    description:
      "I take my rough recording of guitar and vocals and I upload it to an AI music thing (I use Suno). It allows me to give it my recording, and my lyrics, and then set parameters to prevent it from straying from my song. The output is... variable. Sometimes it's good. Often it's shit. The one thing it never is is the exact song I imagine in my head. So, I end up spending hours generating many tracks just to find ones with a good verse, good chorus, and so forth. ",
  },
  {
    title: "Step 9 - Reassembly",
    description:
      "I split the stems (the instruments) for each generated track and download them. I then bring them all back into GarageBand and painstakingly combine and layer them, removing instruments and entire chunks as I see fit, blending and fading in/out the different pieces, until I have a final cohesive whole that achieves my original vision. ",
  },
  {
    title: "Step 10 - Begin Again",
    description:
      "The song is completed, and the vision has been realized. I export the track, name it, and start anew.",
  },
];

export default function TheMusicPage() {
  return (
    <main className="min-h-[70vh] bg-[var(--background)] pb-10">
      <div className="mx-auto w-full max-w-3xl px-4 pt-5 pb-6 sm:px-6 sm:pt-6 sm:pb-10">
        <div className="relative py-4">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3"
          >
            <div className="absolute top-10 bottom-10 left-1/2 w-px -translate-x-1/2 bg-[#c8c8c8]/50" />
          </div>

          <ol className="relative space-y-10 sm:space-y-14">
            {steps.map((step) => (
              <li key={step.title} className="flex items-start gap-4 sm:gap-8">
                <div className="relative z-10 w-1/3 shrink-0">
                  <div
                    className="aspect-square w-full rounded-md bg-[#3a3a3a] shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
                    aria-hidden
                  />
                </div>
                <div className="min-w-0 flex-1 pt-1">
                  <h2
                    className={`${cinzel.className} text-lg font-medium tracking-[0.16em] text-white uppercase sm:text-md`}
                  >
                    {step.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#b0b0b0] sm:text-[0.95rem]">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  );
}
