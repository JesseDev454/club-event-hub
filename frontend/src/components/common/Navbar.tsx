import { useState, type FormEvent } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { getInitials } from "../../lib/utils";
import { useAuth } from "../../state/AuthContext";
import { Button } from "../ui/Button";
import { MaterialIcon } from "./MaterialIcon";
import { PageContainer } from "./PageContainer";

const publicLinks = [
  { to: "/events", label: "Events" },
  { to: "/clubs", label: "Clubs" },
];

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
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <PageContainer className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-8">
          <Link className="font-headline text-2xl font-bold tracking-tight text-primary" to="/">
            NileConnect
          </Link>

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

        <div className="flex items-center gap-3">
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
                  className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container-low"
                  type="button"
                >
                  <MaterialIcon name="notifications" />
                </button>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {userInitials}
                </div>
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
                <Button className="rounded-full bg-primary px-5 text-white hover:bg-primary-container">
                  Create account
                </Button>
              </Link>
            </>
          )}
        </div>
      </PageContainer>
    </header>
  );
}
