import { Link } from "react-router-dom";

import { MaterialIcon } from "../components/common/MaterialIcon";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link className="font-headline text-2xl font-bold tracking-tight text-primary" to="/">
              NileConnect
            </Link>
            <div className="hidden gap-6 md:flex">
              <Link className="text-sm font-medium text-slate-500 transition hover:text-primary" to="/events">
                Events
              </Link>
              <Link className="text-sm font-medium text-slate-500 transition hover:text-primary" to="/clubs">
                Clubs
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-full p-2 text-slate-500 transition hover:bg-slate-50" type="button">
              <MaterialIcon name="notifications" />
            </button>
            <div className="h-10 w-10 rounded-full bg-surface-container-high" />
          </div>
        </nav>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-12">
          <div className="order-2 space-y-8 lg:order-1 lg:col-span-5">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-secondary-container px-4 py-1.5 text-sm font-semibold text-[#00210f]">
                Error 404
              </span>
              <h1 className="font-headline text-6xl font-extrabold leading-tight tracking-tight text-primary md:text-7xl">
                Class not in <span className="text-secondary">session.</span>
              </h1>
              <p className="max-w-md text-lg leading-8 text-on-surface-variant">
                It looks like you&apos;ve wandered off-campus. NileConnect couldn&apos;t find the
                page you&apos;re looking for.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] px-8 py-4 font-semibold text-white transition hover:shadow-soft"
                to="/"
              >
                Return to Homepage
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-full bg-secondary-container px-8 py-4 font-semibold text-[#00210f] transition hover:brightness-95"
                to="/events"
              >
                Explore Events
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="rounded-2xl bg-surface-container-low p-4">
                <MaterialIcon className="mb-2 text-primary" name="search" />
                <p className="text-sm font-semibold text-primary">Need help?</p>
                <p className="text-xs text-on-surface-variant">Try browsing events or clubs.</p>
              </div>
              <div className="rounded-2xl bg-surface-container-low p-4">
                <MaterialIcon className="mb-2 text-secondary" name="map" />
                <p className="text-sm font-semibold text-secondary">Back on track</p>
                <p className="text-xs text-on-surface-variant">Return to a live route safely.</p>
              </div>
            </div>
          </div>

          <div className="order-1 grid h-[400px] grid-cols-6 gap-4 md:h-[600px] lg:order-2 lg:col-span-7">
            <div className="relative col-span-4 row-span-2 overflow-hidden rounded-[2rem]">
              <img
                alt="Nile University Campus"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuClQ7z8oY9evhMwjOTzpa7oX4XAcNAgzUBHDz5mJ9wfkZ_izEjq7uWEOq5zdeqRcx_42l29y312wNdtocWkxSJRjC4GGlmqrppYfgjZe6TLHkLQJtHkpWKaXiy-tAAF14fgrbJVsru4BGj8t2yTYUP5usTBt38pIgoDCBHG10hpQR7AMJBp7YELiuTcaX5SqEo0K17x0qcgmcmljm0mgUpZ-bkg4ftC3Zl6qCtHPGOfhtF_U8KXR8HbKq57QTdlNDaMbjc-dxjReGpp"
              />
            </div>
            <div className="col-span-2 flex items-center justify-center rounded-[2rem] bg-secondary-container p-8">
              <span className="text-7xl font-bold text-[#00210f]/40">404</span>
            </div>
            <div className="col-span-2 overflow-hidden rounded-[2rem] shadow-soft">
              <img
                alt="Student studying"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdTDgdTtzJu8LNodUrXsU0W7jKB2Pc7ifYGxyXNlXkDTQYGIpYlY4y6Tq8_qY1AppGBaZ_KsKISakJPNHJE4uOgmWOJS-zwhqZacDBC1Z0vBxYSOZ3i3rShlozjYBVXkG8na44XDUVW8qb9FvoGoyDugdPJuNjBAN01hV2-NXCUDNFHaBeC6GA8KfI0wU1twcymB5RvutGNaB5SRte81NCbyPl1EPLYj_ReT65OKiJOvYxyVnrTZnGp_PZXBGDLHH8Fmuh0V9h0YWZ"
              />
            </div>
            <div className="col-span-6 -mt-12 flex justify-end pr-8">
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/80 p-4 shadow-soft backdrop-blur-xl">
                <div className="h-2 w-2 rounded-full bg-red-600" />
                <span className="text-sm font-medium text-primary">Destination unreachable</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
