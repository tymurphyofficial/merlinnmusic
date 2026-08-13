export type SocialLink = {
  id: "spotify" | "youtube" | "tiktok";
  label: string;
  href: string;
};

export const socialLinks: SocialLink[] = [
  {
    id: "spotify",
    label: "Spotify",
    href: "https://open.spotify.com/artist/7gNAANPPa3ssSWF1coeiz9?si=f8ry3rDwS6u2Y2L8z2ooPA",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@MerlinnMusic",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@merlinnmusic",
  },
];
