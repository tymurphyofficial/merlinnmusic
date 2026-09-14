export type Track = {
  id: string;
  title: string;
  length: string;
  /** When false, the track is hidden from the public tracklist. */
  visible: boolean;
  /** Public path to an audio file; when set, the track is playable. */
  audioSrc?: string;
};

export type TrackSection = {
  id: string;
  title: string;
  tracks: Track[];
};

export const tracklist: TrackSection[] = [
  {
    id: "the-light-of-ages-tracks",
    title: "",
    tracks: [
      {
        id: "p1-1",
        title: "The Winds Have Brought Us Safely",
        length: "3:52",
        visible: true,
      },
      {
        id: "p1-5",
        title: "To Kill A God",
        length: "3:35",
        visible: true,
      },
      {
        id: "p1-2",
        title: "That Solitary Bridgeman",
        length: "4:56",
        visible: true,
      },
      {
        id: "p1-3",
        title: "Unite Them",
        length: "3:22",
        visible: true,
        // audioSrc: "/audio/Unite Them.mp3",
      },
      {
        id: "from-the-front",
        title: "From The Front",
        length: "4:48",
        visible: true,
      },
      {
        id: "i1-1",
        title: "All The Faith In The World (Interlude I)",
        length: "2:45",
        visible: true,
      },
      {
        id: "p1-7",
        title: "Small, But Mighty!",
        length: "3:09",
        visible: true,
        audioSrc: "/audio/Small, But Mighty!.mp3",
      },
      {
        id: "p2-1",
        title: "Morality of Murder",
        length: "4:08",
        visible: true,
      },
      {
        id: "p2-6",
        title: "Shadows And Secrets",
        length: "4:44",
        visible: true,
      },
      {
        id: "p3-3",
        title: "Not Done Bleeding",
        length: "4:48",
        visible: true,
        audioSrc: "/audio/Not Done Bleeding.mp3",
      },
      {
        id: "empty-bloodlust",
        title: "Empty Bloodlust",
        length: "4:44",
        visible: true,
      },
      {
        id: "p1-4",
        title: "The Night My Brother Died",
        length: "5:12",
        visible: true,
        audioSrc: "/audio/The Night My Brother Died.mp3",
      },
      {
        id: "p3-6",
        title: "Worldsinger",
        length: "4:26",
        visible: true,
      },
      {
        id: "p3-10",
        title: "Come All You Weary",
        length: "3:49",
        visible: true,
      },
    ],
  },
];

export const beardMakethTheManTracklist: TrackSection[] = [
  {
    id: "beard-tracks",
    title: "",
    tracks: [
      {
        id: "beard-1",
        title: "The Storm",
        length: "3:29",
        visible: true,
        audioSrc: "/audio/The Storm.mp3",
      },
      {
        id: "beard-2",
        title: "Monster In The Woods",
        length: "3:47",
        visible: true,
        audioSrc: "/audio/Monster In The Woods.mp3",
      },
      {
        id: "beard-3",
        title: "There's No Dragons Here",
        length: "3:01",
        visible: true,
        audioSrc: "/audio/There's No Dragons Here.mp3",
      },
      {
        id: "beard-4",
        title: "The Inn at World's End",
        length: "3:33",
        visible: false,
      },
      {
        id: "beard-5",
        title: "Tankard and Steel",
        length: "4:05",
        visible: false,
      },
      {
        id: "beard-6",
        title: "A Fool's Errand",
        length: "3:19",
        visible: false,
      },
      {
        id: "beard-7",
        title: "Whispers in the Mead",
        length: "5:02",
        visible: false,
      },
      {
        id: "beard-8",
        title: "Boots of the Wanderer",
        length: "4:37",
        visible: false,
      },
      {
        id: "beard-9",
        title: "Firelight Bargain",
        length: "3:54",
        visible: false,
      },
      {
        id: "beard-10",
        title: "Crooked Crown",
        length: "4:16",
        visible: false,
      },
      {
        id: "beard-11",
        title: "No Saint Among Us",
        length: "3:41",
        visible: false,
      },
      {
        id: "beard-12",
        title: "Raise the Banner",
        length: "5:08",
        visible: false,
      },
      {
        id: "beard-13",
        title: "When the Mead Runs Dry",
        length: "4:29",
        visible: false,
      },
    ],
  },
];
