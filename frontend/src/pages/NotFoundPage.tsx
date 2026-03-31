import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md rounded-3xl border border-white/70 bg-white p-8 text-center shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900">Page not found</h1>
        <p className="mt-3 text-sm text-ink-700">
          This route is not part of the MVP yet, or the path does not exist.
        </p>
        <div className="mt-6">
          <Link
            className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            to="/"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
