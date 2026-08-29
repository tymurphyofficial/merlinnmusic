import Image from "next/image";
import { redirect } from "next/navigation";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { logout } from "@/lib/auth";
import { getUserPaidOrders } from "@/lib/ownership";
import { getCatalogProduct } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getUserPaidOrders(user.id);

  // One card per unique product (in case of duplicate paid rows).
  const relics = Array.from(
    new Map(
      orders
        .map((order) => {
          const catalog = getCatalogProduct(order.product);
          return catalog ? ([order.product, catalog] as const) : null;
        })
        .filter(
          (entry): entry is readonly [string, NonNullable<ReturnType<typeof getCatalogProduct>>] =>
            entry !== null,
        ),
    ).values(),
  );

  return (
    <main className="min-h-[70vh] bg-[var(--background)]">
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Account info */}
        <div className="rounded-md bg-[#3a3a3a] px-6 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:px-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Your Account
          </h1>
          <p className="mt-3 text-sm text-[#b0b0b0]">
            Signed in as <span className="text-white">{user.email}</span>
          </p>
        </div>

        {/* Relics & Loot */}
        <section className="mt-10">
          <h2 className="px-1 text-xl font-semibold tracking-tight text-white">
            Relics &amp; Loot
          </h2>

          {relics.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {relics.map(({ product, album, downloadHref }) => (
                <li
                  key={product}
                  className="rounded-md bg-[#3a3a3a] px-5 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:px-8 sm:py-8"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                    <div className="relative mx-auto aspect-square w-40 shrink-0 overflow-hidden sm:mx-0 sm:w-44">
                      <Image
                        src={album.coverSrc}
                        alt={album.coverAlt}
                        fill
                        sizes="176px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col pt-0 sm:pt-1">
                      <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        {album.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#b0b0b0]">
                        {album.subtitle}
                      </p>

                      <div className="mt-5 flex items-center gap-3">
                        <a
                          href={downloadHref}
                          className="inline-flex w-28 cursor-pointer flex-col items-center justify-center rounded-md bg-[var(--accent)] px-5 py-2 text-[#2a2a2a] transition-opacity hover:opacity-90"
                        >
                          <span className="text-sm font-semibold leading-tight">
                            MP3
                          </span>
                          <span className="text-[0.65rem] font-normal leading-tight capitalize opacity-80">
                            smaller files
                          </span>
                        </a>
                        <a
                          href={downloadHref}
                          className="inline-flex w-28 cursor-pointer flex-col items-center justify-center rounded-md bg-[var(--accent)] px-5 py-2 text-[#2a2a2a] transition-opacity hover:opacity-90"
                        >
                          <span className="text-sm font-semibold leading-tight">
                            WAV
                          </span>
                          <span className="text-[0.65rem] font-normal leading-tight capitalize opacity-80">
                            lossless
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded-md bg-[#3a3a3a] px-6 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:px-8">
              <p className="text-sm text-[#a8a8a8]">
                You haven&apos;t claimed any relics yet.
              </p>
            </div>
          )}
        </section>

        {/* Change password */}
        <section className="mt-10">
          <h2 className="px-1 text-xl font-semibold tracking-tight text-white">
            Change Password
          </h2>
          <div className="mt-4 rounded-md bg-[#3a3a3a] px-6 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:px-8">
            <p className="text-sm text-[#b0b0b0]">
              Choose a new password for your account.
            </p>
            <ChangePasswordForm />
          </div>
        </section>

        {/* Help */}
        <section className="mt-10">
          <h2 className="px-1 text-xl font-semibold tracking-tight text-white">
            Need Help?
          </h2>
          <div className="mt-4 rounded-md bg-[#3a3a3a] px-6 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:px-8">
            <p className="text-sm text-[#b0b0b0]">
              If you need help, email{" "}
              <a
                href="mailto:merlinnmusic@gmail.com"
                className="text-white underline-offset-4 transition-opacity hover:opacity-75 hover:underline"
              >
                merlinnmusic@gmail.com
              </a>
              .
            </p>
          </div>
        </section>

        <form action={logout} className="mt-10 flex justify-center">
          <button
            type="submit"
            className="cursor-pointer bg-black px-4 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
          >
            Log out
          </button>
        </form>
      </div>
    </main>
  );
}
