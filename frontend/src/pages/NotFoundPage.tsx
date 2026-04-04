import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="max-w-xl rounded-[2rem] border border-white/70 bg-white p-8 text-center shadow-card sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-ink-700 sm:text-base">
          The page you tried to open is unavailable, or the link may be incorrect.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            to="/"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
