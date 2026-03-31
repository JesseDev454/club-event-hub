import { Link, NavLink } from "react-router-dom";

import { cn } from "../../lib/utils";
import { useAuth } from "../../state/AuthContext";
import { PageContainer } from "./PageContainer";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/clubs", label: "Clubs" },
  { to: "/events", label: "Events" },
];

export function Navbar() {
  const { isAuthenticated, loading, logout, user } = useAuth();

  const linkButtonClassName =
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

  return (
    <header className="sticky top-0 z-10 border-b border-white/60 bg-white/85 backdrop-blur">
      <PageContainer className="flex min-h-16 items-center justify-between gap-4">
        <Link className="text-base font-bold tracking-tight text-ink-900" to="/">
          Club & Event Hub
        </Link>

        <nav className="flex items-center gap-2 text-sm text-ink-700">
          {publicLinks.map((link) => (
            <NavLink
              key={link.to}
              className={({ isActive }) =>
                isActive
                  ? "rounded-lg bg-brand-50 px-3 py-2 font-medium text-brand-700"
                  : "rounded-lg px-3 py-2 hover:bg-ink-100"
              }
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}

          {user?.role === "club_admin" ? (
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "rounded-lg bg-brand-50 px-3 py-2 font-medium text-brand-700"
                  : "rounded-lg px-3 py-2 hover:bg-ink-100"
              }
              to="/admin/events"
            >
              Admin
            </NavLink>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          {loading ? (
            <span className="text-sm text-ink-700">Loading...</span>
          ) : isAuthenticated ? (
            <>
              <span className="hidden text-sm text-ink-700 sm:inline">
                {user?.name ?? "Signed in"}
              </span>
              <button
                className={cn(
                  linkButtonClassName,
                  "bg-white text-ink-900 ring-1 ring-ink-100 hover:bg-ink-50",
                )}
                onClick={logout}
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                className={cn(
                  linkButtonClassName,
                  "hidden bg-white text-ink-900 ring-1 ring-ink-100 hover:bg-ink-50 sm:inline-flex",
                )}
                to="/login"
              >
                Login
              </Link>
              <Link
                className={cn(linkButtonClassName, "bg-brand-600 text-white hover:bg-brand-700")}
                to="/register"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </PageContainer>
    </header>
  );
}
