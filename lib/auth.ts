"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Sign the current user out and redirect to the login page. */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/** Sign the current user out without redirecting. Useful from client code. */
export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  return { error: error?.message ?? null };
}
