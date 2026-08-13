import Link from "next/link";
import { redirect } from "next/navigation";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { createClient } from "@/lib/supabase/server";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-[70vh] bg-[var(--background)]">
      <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-md bg-[#3a3a3a] px-6 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:px-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Reset password
          </h1>
          <p className="mt-2 text-sm text-[#b0b0b0]">
            Choose a new password for your account.
          </p>
          <ChangePasswordForm />
          <p className="mt-6 text-center text-sm text-[#a8a8a8]">
            <Link
              href="/account"
              className="text-white underline-offset-4 transition-opacity hover:opacity-75 hover:underline"
            >
              Back to account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
