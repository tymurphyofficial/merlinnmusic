import Image from "next/image";
import Link from "next/link";
import { Cinzel } from "next/font/google";
import CartNavIcon from "@/components/CartNavIcon";
import SocialIcons from "@/components/SocialIcons";
import { isHomeOnly } from "@/lib/features";
import { createClient } from "@/lib/supabase/server";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const iconClassName = "h-10 w-auto";

export default async function Header() {
  const homeOnly = isHomeOnly();

  let isLoggedIn = false;
  if (!homeOnly) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isLoggedIn = Boolean(user);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--background)]">
      <nav
        className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-2 pt-8 sm:px-10 sm:pb-2.5 sm:pt-10"
        aria-label="Main"
      >
        <Link
          href="/"
          className={`${cinzel.className} text-4xl font-medium tracking-[0.22em] text-white sm:text-5xl`}
        >
          MERLINN
        </Link>

        <div className="mt-3 sm:mt-3.5">
          <SocialIcons />
        </div>

        {!homeOnly ? (
          <div className="absolute top-1/2 right-6 flex -translate-y-1/2 items-center gap-5 sm:right-10 sm:gap-6">
            <Link
              href={isLoggedIn ? "/account" : "/login"}
              className="transition-opacity hover:opacity-75"
              aria-label={isLoggedIn ? "Account" : "Login"}
            >
              <Image
                src={
                  isLoggedIn ? "/icon-knight-logged-in.png" : "/icon-knight.png"
                }
                alt=""
                width={200}
                height={200}
                className={iconClassName}
              />
            </Link>
            <CartNavIcon />
          </div>
        ) : null}
      </nav>
    </header>
  );
}
