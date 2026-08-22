import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets, images, and the Let's Jam
     * upload API (large files must not be cloned/truncated by middleware).
     */
    "/((?!_next/static|_next/image|favicon|api/jam/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|wav|mp3|ico|webmanifest)$).*)",
  ],
};
