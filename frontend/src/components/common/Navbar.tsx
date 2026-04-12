import { useState, type FormEvent } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { getInitials } from "../../lib/utils";
import { useAuth } from "../../state/AuthContext";
import { Button } from "../ui/Button";
import { BrandLogo } from "./BrandLogo";
import { MaterialIcon } from "./MaterialIcon";
import { PageContainer } from "./PageContainer";

const publicLinks = [
  { to: "/events", label: "Events" },
  { to: "/clubs", label: "Clubs" },
];

function MobileBottomNavLink({
  icon,
  label,
  to,
}: {
  icon: string;
  label: string;
  to: string;
}) {
  return (
    <NavLink
      className={({ isActive }) =>
        `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-bold transition ${
          isActive ? "bg-primary text-white" : "text-on-surface-variant hover:bg-surface-container-low"
        }`
      }
      to={to}
    >
      <MaterialIcon className="text-xl" filled name={icon} />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, logout, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const userInitials = getInitials(user?.name ?? "NC");

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedQuery = searchQuery.trim();
    if (!normalizedQuery) {
      return;
    }

    const targetBasePath = location.pathname.startsWith("/clubs") ? "/clubs" : "/events";
    navigate(`${targetBasePath}?q=${encodeURIComponent(normalizedQuery)}`);
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <PageContainer className="flex items-center justify-between gap-3 py-3 sm:gap-4 sm:py-4">
        <div className="flex min-w-0 items-center gap-8">
          <BrandLogo
            imageClassName="h-9 w-9 sm:h-11 sm:w-11"
            textClassName="font-headline text-lg font-bold tracking-tight text-primary sm:text-2xl"
          />

          <nav className="hidden items-center gap-6 md:flex">
            {publicLinks.map((link) => (
              <NavLink
                key={link.to}
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-emerald-600 pb-1 text-sm font-semibold text-primary"
                    : "text-sm font-medium text-slate-500 transition hover:text-primary"
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
                    ? "border-b-2 border-emerald-600 pb-1 text-sm font-semibold text-primary"
                    : "text-sm font-medium text-slate-500 transition hover:text-primary"
                }
                to="/admin/events"
              >
                My Club
              </NavLink>
            ) : null}
          </nav>
        </div>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {!loading ? (
            <form
              className="hidden items-center gap-2 rounded-full bg-surface-container-low px-4 py-2 lg:flex"
              onSubmit={handleSearchSubmit}
            >
              <MaterialIcon className="text-sm text-outline" name="search" />
              <input
                className="w-48 bg-transparent text-sm text-on-surface outline-none placeholder:text-outline"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search clubs or events..."
                value={searchQuery}
              />
            </form>
          ) : null}

          {loading ? (
            <span className="text-sm text-on-surface-variant">Loading...</span>
          ) : isAuthenticated ? (
            <>
              {user?.role === "student" ? (
                <Link to="/clubs/new">
                  <Button className="hidden rounded-full bg-primary px-5 text-white hover:bg-primary-container md:inline-flex">
                    <MaterialIcon className="mr-2 text-base" name="groups" />
                    Create Club
                  </Button>
                </Link>
              ) : null}

              {user?.role === "club_admin" ? (
                <>
                  {user.clubId ? (
                    <Link to={`/clubs/${user.clubId}/edit`}>
                      <Button
                        className="hidden rounded-full border border-outline-variant bg-white px-5 !text-primary hover:bg-surface-container-low md:inline-flex"
                        variant="secondary"
                      >
                        Edit Club
                      </Button>
                    </Link>
                  ) : null}

                  <Link to="/admin/events/new">
                    <Button className="hidden rounded-full bg-primary px-5 text-white hover:bg-primary-container md:inline-flex">
                      <MaterialIcon className="mr-2 text-base" name="add_circle" />
                      Create Event
                    </Button>
                  </Link>
                </>
              ) : null}

              <button
                className="hidden rounded-full border border-outline-variant px-4 py-2 text-sm font-semibold text-primary transition hover:bg-surface-container-low md:inline-flex"
                onClick={logout}
                type="button"
              >
                Logout
              </button>

              <div className="flex items-center gap-3 border-l border-outline-variant/40 pl-3">
                <button
                  className="hidden rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container-low sm:inline-flex"
                  type="button"
                >
                  <MaterialIcon name="notifications" />
                </button>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {userInitials}
                </div>
                <button
                  aria-label="Log out"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/40 text-primary transition hover:bg-surface-container-low md:hidden"
                  onClick={logout}
                  type="button"
                >
                  <MaterialIcon name="logout" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link className="hidden md:inline-flex" to="/login">
                <Button
                  className="rounded-full border border-outline-variant bg-white px-5 !text-primary hover:bg-surface-container-low"
                  variant="secondary"
                >
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button className="rounded-full bg-primary px-3 text-sm text-white hover:bg-primary-container sm:px-5">
                  <span className="sm:hidden">Join</span>
                  <span className="hidden sm:inline">Create account</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </PageContainer>
    </header>

      <nav className="fixed bottom-0 left-0 z-40 w-full border-t border-outline-variant/30 bg-white/90 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0px_-10px_32px_rgba(0,30,64,0.08)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-md gap-2">
          <MobileBottomNavLink icon="home" label="Home" to="/" />
          <MobileBottomNavLink icon="event" label="Events" to="/events" />
          <MobileBottomNavLink icon="groups" label="Clubs" to="/clubs" />
          {user?.role === "club_admin" ? (
            <MobileBottomNavLink icon="dashboard" label="My Club" to="/admin/events" />
          ) : isAuthenticated ? (
            <MobileBottomNavLink icon="add_circle" label="Create" to="/clubs/new" />
          ) : (
            <MobileBottomNavLink icon="login" label="Login" to="/login" />
          )}
        </div>
      </nav>
    </>
  );
}
