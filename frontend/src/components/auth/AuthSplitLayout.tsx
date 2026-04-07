import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { MaterialIcon } from "../common/MaterialIcon";

type AuthSplitLayoutProps = {
  children: ReactNode;
  eyebrow: string;
  helperText: string;
  title: string;
  subtitle: string;
  footerPrompt: ReactNode;
};

const brandImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDfSdt2gfDM52RoD_zaG0YSIZVTDQYM1o4hreByobfBFuASbvb0bBi8sKB_jpy-im9pXJo1XGBnyTiRGjBqzRblux2lY5tmI1j6TKj7c0vUBD_XzBoHJrPVelJFA3WkTJd3nxGUk59HgWmTDJZ-pLbCm5eZZ9lgsJO6vI52paZVlU1JPAUZDfRslxZOAJnkxpL_V9pMMI00dynVSBf03Cj-CDsUHBkWiRQWIpvztVLHbtT_ATYuibITYu4WdP5nT61ImvIkSCz5Bpw";

function BrandBullet({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/12 p-4 backdrop-blur-md">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-emerald-100 shadow-sm">
        <MaterialIcon name={icon} />
      </div>
      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="mt-1 text-sm leading-6 text-blue-50/90">{text}</p>
      </div>
    </div>
  );
}

export function AuthSplitLayout({
  children,
  eyebrow,
  helperText,
  title,
  subtitle,
  footerPrompt,
}: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 overflow-hidden bg-surface lg:grid-cols-12">
      <section className="relative hidden overflow-hidden bg-primary lg:col-span-7 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0">
          <img
            alt="Nile University campus architecture"
            className="h-full w-full object-cover opacity-80 saturate-110"
            src={brandImage}
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,30,64,0.82)_0%,rgba(0,30,64,0.72)_42%,rgba(0,51,102,0.58)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(151,243,181,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(167,200,255,0.18),transparent_36%)]" />
        </div>

        <div className="relative z-10">
          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-white shadow-lg shadow-emerald-900/20">
              <MaterialIcon name="school" />
            </div>
            <span className="font-headline text-2xl font-extrabold tracking-tighter text-white">
              NileConnect
            </span>
          </div>

          <div className="max-w-xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
              {eyebrow}
            </p>
            <h1 className="font-headline text-5xl font-extrabold leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
              The central hub for <br />
              <span className="text-emerald-100">Nile University</span> life.
            </h1>
            <p className="mt-8 max-w-md text-lg leading-8 text-blue-50/90">
              {helperText}
            </p>
          </div>
        </div>

        <div className="relative z-10 grid gap-4 md:grid-cols-3">
          <BrandBullet
            icon="event_available"
            text="See live campus events before you decide to join."
            title="Discover events"
          />
          <BrandBullet
            icon="groups"
            text="Explore student communities and discover active clubs on campus."
            title="Find clubs"
          />
          <BrandBullet
            icon="shield_person"
            text="Join as a student and grow into leadership."
            title="Grow as a leader"
          />
        </div>
      </section>

      <section className="relative flex flex-col justify-center bg-surface p-6 md:p-12 lg:col-span-5 lg:p-20">
        <div className="absolute left-8 top-8 flex items-center gap-2 lg:hidden">
          <span className="font-headline text-xl font-extrabold tracking-tighter text-primary">
            NileConnect
          </span>
        </div>

        <div className="mx-auto w-full max-w-[420px] space-y-10">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-primary">
              {title}
            </h2>
            <p className="text-base text-on-surface-variant">{subtitle}</p>
          </div>

          {children}

          <p className="text-center text-on-surface-variant">{footerPrompt}</p>
        </div>

        <footer className="mt-10 flex justify-center gap-6 text-[10px] uppercase tracking-[0.2em] text-outline opacity-70 lg:absolute lg:bottom-8 lg:left-0 lg:mt-0 lg:w-full">
          <Link className="transition-colors hover:text-primary" to="/">
            Home
          </Link>
          <Link className="transition-colors hover:text-primary" to="/events">
            Events
          </Link>
          <Link className="transition-colors hover:text-primary" to="/clubs">
            Clubs
          </Link>
        </footer>
      </section>
    </div>
  );
}
