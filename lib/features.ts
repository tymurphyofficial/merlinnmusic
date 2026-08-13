/** When true, only the home page is reachable and commerce/auth UI is hidden. */
export function isHomeOnly(): boolean {
  return process.env.NEXT_PUBLIC_HOME_ONLY === "true";
}
