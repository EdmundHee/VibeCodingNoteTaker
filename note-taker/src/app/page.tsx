import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold text-[var(--ink-primary)]">Pagewise</div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm px-4 py-2 bg-[var(--ink-primary)] text-white rounded-md hover:opacity-90"
          >
            Get started
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24">
        <h1 className="text-5xl font-semibold text-[var(--ink-primary)] text-center mb-6 tracking-tight">
          A calm home for<br />the things you think
        </h1>
        <p className="text-lg text-[var(--ink-secondary)] text-center max-w-xl mb-10">
          Pagewise is a quiet place to write, plan, and connect ideas — without the chrome and clutter of every other tool.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 bg-[var(--ink-primary)] text-white rounded-md font-medium hover:opacity-90"
          >
            Start writing — it&apos;s free
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-[var(--border)] text-[var(--ink-primary)] rounded-md font-medium hover:bg-[var(--hover-surface)]"
          >
            Sign in
          </Link>
        </div>
      </main>

      <footer className="border-t border-[var(--border)] px-6 py-6 text-center text-sm text-[var(--ink-tertiary)]">
        Pagewise © 2026
      </footer>
    </div>
  );
}