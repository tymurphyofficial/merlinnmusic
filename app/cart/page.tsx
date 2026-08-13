import CartContents from "@/components/CartContents";

export default function CartPage() {
  return (
    <main className="min-h-[70vh] bg-[var(--background)]">
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="px-1 text-2xl font-semibold tracking-tight text-white">
          Cart
        </h1>
        <CartContents />
      </div>
    </main>
  );
}
