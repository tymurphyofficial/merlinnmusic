export default function Footer() {
  return (
    <footer className="w-full bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-6 sm:px-10">
        <p className="text-center text-xs tracking-wide text-white/60 sm:text-sm">
          © {new Date().getFullYear()} Merlinn. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
