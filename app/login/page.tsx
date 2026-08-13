import AuthForm from "@/components/AuthForm";

type LoginPageProps = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirect ?? "/";

  return (
    <main className="min-h-[70vh] bg-[var(--background)]">
      <AuthForm mode="login" redirectTo={redirectTo} />
    </main>
  );
}
