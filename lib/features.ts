/** When true, only the home page is reachable and commerce/auth UI is hidden. */
export function isHomeOnly(): boolean {
  return process.env.NEXT_PUBLIC_HOME_ONLY === "true";
}

/** Set to true to show play buttons and the player bar. Playback code stays in place. */
export function isPlaybackEnabled(): boolean {
  return false;
}
