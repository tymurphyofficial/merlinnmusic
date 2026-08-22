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
        <h1 className={`${cinzel.className} mt-3 text-3xl font-medium tracking-[0.16em] text-white uppercase sm:text-4xl`}>
          Let&apos;s Jam
        </h1>
        {/* <section className="rounded-md bg-[#3a3a3a] px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:px-8 sm:py-6">
          <div className="mt-0 space-y-4 text-sm leading-relaxed text-[#b0b0b0] sm:text-[0.95rem]">
            <p>
              I've been playing guitar since I was 10. In highschool, I was in a garage band
              with my friends that we called Thrust. We sucked, but it was fun. I miss those days.
            </p>
            <p>
              A huge fan of fantasy novels, I find the music I enjoy writing the most are power-metal
              and acoustic songs with fantasy themes inspired by the books I read. Many songs I have 
              written recently are loosely about The Way Of Kings by Brandon Sanderson.
            </p>
            <p>
              My problem is that my vocals chords are fairly damaged. Additionally, since I've always loved
              rhythm guitar and melodies, I was never interested in becoming a virtuoso guitarist capable
              of the sweeping guitar solos characteristic of the power-metal genre. 
            </p>
            <p>
              I like to write. Lyrics, melody, structure—the heart and soul of a song. Recently, I've brought
              my songs to life using AI, and while they sound great, I don't like doing that. AI makes me feel icky.
            </p>
            <p>
              Thankfully, the internet is a big place full of awesome people like yourself who are willing to lend
              their talents to make something incredible.
            </p>
          </div>
        </section> */}

        {/* <section className="mt-10">
          <h2
            className={`${cinzel.className} px-1 text-xs tracking-[0.14em] text-[#a8a8a8] uppercase sm:text-sm`}
          >
            House Rules
          </h2>
          <div className="mt-4 rounded-md bg-[#3a3a3a] px-5 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:px-8 sm:py-8">
            <ul className="space-y-5">
              {rules.map((rule) => (
                <li
                  key={rule.title}
                  className="border-l border-[var(--accent)]/70 pl-4"
                >
                  <h3 className="text-sm font-semibold tracking-tight text-white">
                    {rule.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#b0b0b0]">
                    {rule.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section> */}

        <section className="mt-2">
          <h2
            className={`${cinzel.className} px-1 text-xs tracking-[0.14em] text-[#a8a8a8] uppercase sm:text-sm`}
          >
            Send In Your Performance
          </h2>
          <div className="mt-4 rounded-md bg-[#3a3a3a] px-5 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:px-8 sm:py-8">
            <JamSubmissionForm />
          </div>
        </section>
      </div>
    </main>
  );
}
