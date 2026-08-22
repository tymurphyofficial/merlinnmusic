import {
  beardMakethTheManTracklist,
  tracklist,
  type Track,
  type TrackSection,
} from "@/data/tracklist";

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
  subtitle: "Inspired by themes from the fantasy epic \"The Way Of Kings\".",
  price: "$19.99",
  coverSrc: "/album-art/album-cover-the-light-of-ages.png",
  coverAlt: "The Light Of Ages album cover",
  sections: tracklist,
  disclaimer:
    "*All songs are 100% original, written by Merlinn, inspired loosely by general fantasy themes. Any specific similarities to works of literature are strictly coincidental, accidental, or entirely imagined.",
};

export const beardMakethTheMan: Album = {
  id: "the-beard-maketh-the-man",
  title: "The Beard Maketh The Man",
  subtitle: "A (mostly) acoustic collection.",
  price: "$14.99",
  coverSrc: "/album-art/album-cover-the-beard-maketh-the-man.png",
  coverAlt: "The Beard Maketh The Man album cover",
  sections: beardMakethTheManTracklist,
  disclaimer: "",
};
