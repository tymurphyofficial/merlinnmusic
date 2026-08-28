import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Do not add logic between createServerClient and getUser().
  // A simple mistake can make it very hard to debug session issues.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const homeOnly = process.env.NEXT_PUBLIC_HOME_ONLY === "true";

  // Block auth/commerce routes (and related APIs) so login, signup, and
  // checkout cannot be reached.
  if (
    homeOnly &&
    pathname !== "/" &&
    pathname !== "/lets-jam" &&
    pathname !== "/the-music" &&
    !pathname.startsWith("/api/jam/") &&
    !pathname.startsWith("/api/webhooks/")
  ) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unavailable" }, { status: 403 });
    }

    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";

    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // Protect account routes — redirect unauthenticated users to login.
  if (!user && pathname.startsWith("/account")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);

    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // IMPORTANT: Always return supabaseResponse so refreshed cookies are applied.
  return supabaseResponse;
}
