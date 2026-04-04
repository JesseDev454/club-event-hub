import { Link } from "react-router-dom";

import { PageContainer } from "./PageContainer";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-100">
      <PageContainer className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <span className="font-headline text-xl font-bold text-slate-950">NileConnect</span>
          <p className="text-sm text-slate-600">
            © 2026 Nile University. All intellectual growth reserved.
          </p>
        </div>

        <nav className="flex flex-wrap gap-6 text-sm text-slate-600">
          <Link className="transition hover:text-emerald-600" to="/">
            Home
          </Link>
          <Link className="transition hover:text-emerald-600" to="/events">
            Events
          </Link>
          <Link className="transition hover:text-emerald-600" to="/clubs">
            Clubs
          </Link>
          <a className="transition hover:text-emerald-600" href="mailto:support@nileconnect.edu">
            Support
          </a>
        </nav>
      </PageContainer>
    </footer>
  );
}
