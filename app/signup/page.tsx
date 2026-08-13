import AuthForm from "@/components/AuthForm";

type SignupPageProps = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirect ?? "/";

  return (
    <main className="min-h-[70vh] bg-[var(--background)]">
      <AuthForm mode="signup" redirectTo={redirectTo} />
    </main>
  );
}
