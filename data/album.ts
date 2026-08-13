import { tracklist, type Track, type TrackSection } from "@/data/tracklist";

export type { Track, TrackSection };

export type Album = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  coverSrc: string;
  coverAlt: string;
  sections: TrackSection[];
  disclaimer: string;
};

export const weightOfThings: Album = {
  id: "the-way-of-kings",
  title: "The Light Of Ages",
  subtitle: "Inspired by themes from fantasy epic \"The Way Of Kings\".",
  price: "$19.99",
  coverSrc: "/album-cover.png",
  coverAlt: "The Light Of Ages album cover",
  sections: tracklist,
  disclaimer:
    "*All songs are 100% original, written by Merlinn, inspired loosely by general fantasy themes. Any specific similarities to works of literature are strictly coincidental, accidental, or entirely imagined.",
};
