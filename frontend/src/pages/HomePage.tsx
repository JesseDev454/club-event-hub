import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { clubsApi } from "../api/clubsApi";
import { getApiErrorMessage } from "../api/client";
import { eventsApi } from "../api/eventsApi";
import { MaterialIcon } from "../components/common/MaterialIcon";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingState } from "../components/ui/LoadingState";
import { getCategoryVisual } from "../lib/presentation";
import { formatTimeRange } from "../lib/utils";
import { useAuth } from "../state/AuthContext";
import type { ClubSummary, EventListItem } from "../types/domain";

type ClubUpcomingCounts = Record<string, number>;

const heroPeople = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAioWFi0r9nkEFpaBENpR70-5NdzvyVPv5tezO1ZmGKFlwKt98eG-eU_A5KZkHhEH_u6aC9wDi_ZzY7fkEkt-zh6oitRo6KMztcHM4yZXc6Tj4MD45v6ifnv3lOxFXWGRiYcS7G9uysrNQPrkVTR4AJdQfIaazCOfp5fN0t4BgoFwuOYm8gqnm5NGi4hEB4MrMkzZytYfVqC5N1RsJbTRUYZN49NjHjSkTUwU0wvusd2hkZP7xxJHlAqXlJ3YhB_bW1DUhLM2OxkJw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC85MVaXyhiutwm4bVIGnRYS2wRxLOD13voPHWe7ZgL5J3AZ2M4SV7Ka1-2OlySExWMUpx5PZhfNt8xOQgRhj12ut1tlsEYfE7itjc8OC9y8lwiuus-iRvVmlrlu_DhKbxQF68lij7Ei0rKzfOMO2leUfo3ySLeT4nCi1n_6HnVnVpSfDM5_obJzihVUg9Emmn7S3bjbsgLKHnnN_t1s7MQZfvcO4nyVYFJBgX_NKIjCRpjDngeI3Acii6Be7SLMEFKenwRCVhmEkI",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAImQDUSdu3daSQBA14aS6srShKMpU1Gg3rWl9_f9AsjHks6CUdgvXfNht3q87MkJjNbkiEQvRNzsnfj_9X-kQSnXrWfYXbTEbXE5yYgjFjgZjcKz-PUePRY4eFqPeGF9WWkiR6ZpEN_Ipij4RrNfguZwlrPDMRbJu0p4oP6jtQcxTZMnBm7ZdQgx0jP3lILrvqlQGI8sND5unVAGjQt1j_3sRenNKftbBu_V5YBVa5zacJc4mPqjggLampxx8-u9Kdf06MpuL-wRE",
];

const heroImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCjbh-96t4iV_RCiSzLvF_7vvLrasDdC3_yjn2QmsbyEBKwHf-hNnatKKqr9vXgWW9RUeLnrGDUv-itYHytOnCUb8VcN1hEmE2irmyyxRIXSuVICd8CDziQogSxNvHNFtstsk-wiGcfvoeld7gBjBnOMGkclFxBlLOjjoCxZ5kRi7kb6cLHQWVciiZKUBu27Pp5fmjvxUtwMmWCZLx7C0JAvSqJqFHMORDmyf0JpXZyqMvZ_eOVwXjX1hDsM9F-1pDCAxW7wQOI8lg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBT2OP5b4E-OHC-RYaZOES3ZXXtMVBGp8zPjSPo1dslyEiw616DXwYjCstmhy0PE-5zUNOv9X5T5KHJLzX3UsDd5SKNzaWEfnGFenuUQEdrgynHeLpBPd3bl1ft2V2rgTDnWRVgL37hi0dvDOP9dqXSfPVKrr9kCyT3KqA97IVWaxPBjlmJV5qIioG3gwQSGBoSPtt9qpK1L2yTlU8fimJS6KO-HzKm30JYyoNzGtrPCybQ8i1j-efUjAEsL29yk2XZ1A7Vi1_4zGY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDcc4-6WOELrSIb9893tU7qFDNzh7ADJdXb9Pl_Pjzzxx5nYDIQOwke_9vAPD6WGzGOP_qiGQzLnN-XUBr-eb3W2L_6YjZs3ojVFeg8iks7ULE6scwiZSMmjoPk41V3og8eoW-uEWdsuvsTt3Ej2F9iB9PyYSA5dDz6RO0zfVjimaQ7p9jeu0MrEgHe7YcQSrA9c8LiMmLG5BVifPTZfKVtf0-4ejpvRANDqw61AoqkgmhgxaH4dUU4QZyEQ8q8sAO6E97K1AO--QQ",
];

const explorePills = ["Tech", "Arts", "Sports", "Academic", "Social"];

function formatMonth(dateString: string) {
  return new Intl.DateTimeFormat(undefined, { month: "short" }).format(
    new Date(`${dateString}T00:00:00`),
  );
}

function formatDay(dateString: string) {
  return new Date(`${dateString}T00:00:00`).getDate().toString();
}

function formatCompact(value: number) {
  return new Intl.NumberFormat(undefined, {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 0,
  }).format(value);
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-extrabold text-white sm:text-4xl">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-widest text-on-primary-container sm:text-sm">
        {label}
      </p>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  description,
  tone,
  iconClassName,
  offset,
}: {
  icon: string;
  title: string;
  description: string;
  tone: string;
  iconClassName?: string;
  offset?: string;
}) {
  return (
    <div className={`min-w-0 flex flex-col gap-4 rounded-2xl bg-surface p-6 shadow-[0px_12px_32px_rgba(24,28,32,0.06)] ${offset ?? ""}`}>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
        <MaterialIcon className={iconClassName} name={icon} />
      </div>
      <h4 className="font-bold text-primary">{title}</h4>
      <p className="text-sm text-on-surface-variant">{description}</p>
    </div>
  );
}

export function HomePage() {
  const { isAuthenticated } = useAuth();
  const [clubs, setClubs] = useState<ClubSummary[]>([]);
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredClubUpcomingCounts, setFeaturedClubUpcomingCounts] = useState<ClubUpcomingCounts>({});

  useEffect(() => {
    let isMounted = true;

    const loadHomepageContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const [clubsData, eventsData] = await Promise.all([clubsApi.getClubs(), eventsApi.getEvents()]);
        if (isMounted) {
          setClubs(clubsData);
          setEvents(eventsData);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            getApiErrorMessage(
              loadError,
              "We couldn't load the latest campus highlights right now. You can still browse clubs and events directly.",
            ),
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadHomepageContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredEvents = useMemo(
    () =>
      [...events]
        .sort((a, b) => {
          const first = new Date(`${a.eventDate}T${a.startTime || "00:00:00"}`).getTime();
          const second = new Date(`${b.eventDate}T${b.startTime || "00:00:00"}`).getTime();
          return first - second;
        })
        .slice(0, 3),
    [events],
  );

  const featuredClubs = useMemo(() => clubs.slice(0, 4), [clubs]);

  const totalRsvps = useMemo(
    () => events.reduce((sum, event) => sum + (event.rsvpCount ?? 0), 0),
    [events],
  );

  useEffect(() => {
    let isMounted = true;

    const loadFeaturedClubCounts = async () => {
      if (loading || error || featuredClubs.length === 0) {
        if (isMounted) {
          setFeaturedClubUpcomingCounts({});
        }
        return;
      }

      const clubDetails = await Promise.allSettled(
        featuredClubs.map(async (club) => clubsApi.getClubById(club.id)),
      );

      if (!isMounted) {
        return;
      }

      const nextClubCounts: ClubUpcomingCounts = {};
      clubDetails.forEach((result) => {
        if (result.status === "fulfilled") {
          nextClubCounts[result.value.id] = result.value.upcomingEvents.length;
        }
      });
      setFeaturedClubUpcomingCounts(nextClubCounts);
    };

    void loadFeaturedClubCounts();

    return () => {
      isMounted = false;
    };
  }, [error, featuredClubs, loading]);

  const activeCategoryCount = useMemo(() => {
    const categories = new Set<string>();
    [...events, ...clubs].forEach((item) => categories.add(item.category));
    return categories.size;
  }, [clubs, events]);

  return (
    <div className="space-y-8 sm:space-y-12 lg:space-y-20">
      <section className="relative overflow-hidden bg-surface px-0 py-4 sm:px-6 sm:py-10 lg:min-h-[54rem] lg:px-8 lg:py-20">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-secondary-container/30 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-primary-fixed/30 blur-3xl" />

        <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="nc-animate-fade-up max-w-2xl space-y-8">
            <div className="inline-flex items-center rounded-full bg-secondary-container px-3 py-1 text-xs font-bold uppercase tracking-widest text-on-secondary-container">
              Campus Life Redefined
            </div>
            <h1 className="nc-text-safe font-headline text-4xl font-extrabold leading-[1.08] tracking-tight text-primary sm:text-6xl lg:text-7xl">
              Discover Nile University <span className="text-secondary">clubs and events</span>{" "}
              in one place
            </h1>
            <p className="max-w-lg text-base leading-7 text-on-surface-variant sm:text-xl sm:leading-relaxed">
              Find active student communities, explore upcoming campus events, and RSVP in
              seconds. Your bridge to a vibrant university experience starts here.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] px-8 py-4 text-base font-bold text-white shadow-[0px_12px_32px_rgba(24,28,32,0.06)] transition-transform hover:scale-105 active:scale-95 sm:w-auto sm:text-lg"
                to="/events"
              >
                Explore Events
                <MaterialIcon name="arrow_forward" />
              </Link>
              <Link
                className="inline-flex w-full items-center justify-center rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-8 py-4 text-base font-bold text-primary transition-all hover:bg-surface-container-high sm:w-auto sm:text-lg"
                to="/clubs"
              >
                Join a Club
              </Link>
            </div>

            <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:gap-6 sm:pt-8">
              <div className="flex -space-x-3">
                {heroPeople.map((image, index) => (
                  <img
                    alt={`Campus community ${index + 1}`}
                    className="h-12 w-12 rounded-full border-4 border-surface object-cover"
                    decoding="async"
                    key={image}
                    src={image}
                  />
                ))}
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-surface bg-primary-fixed text-xs font-bold text-on-primary-fixed">
                  +2k
                </div>
              </div>
              <p className="text-sm font-medium text-on-surface-variant">
                Joined by{" "}
                <span className="font-bold text-primary">
                  {loading ? "students" : `${formatCompact(totalRsvps)}+ students`}
                </span>{" "}
                this semester
              </p>
            </div>
          </div>

          <div className="nc-animate-soft-scale relative hidden lg:block" style={{ animationDelay: "120ms" }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="rotate-[-2deg] rounded-2xl bg-surface-container-lowest p-2 shadow-[0px_12px_32px_rgba(24,28,32,0.06)] transition-transform duration-500 hover:rotate-0">
                  <img alt="Editorial campus moment" className="aspect-[4/5] w-full rounded-xl object-cover" decoding="async" loading="lazy" src={heroImages[0]} />
                </div>
                <div className="flex rotate-[1deg] items-center gap-4 rounded-2xl bg-surface-container-lowest p-4 shadow-[0px_12px_32px_rgba(24,28,32,0.06)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                    <MaterialIcon filled name="verified" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Top Event
                    </p>
                    <p className="font-bold text-primary">{featuredEvents[0]?.title ?? "Tech Summit 2024"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rotate-[3deg] rounded-2xl bg-surface-container-lowest p-2 shadow-[0px_12px_32px_rgba(24,28,32,0.06)] transition-transform duration-500 hover:rotate-0">
                  <img alt="Editorial workshop moment" className="aspect-[4/3] w-full rounded-xl object-cover" decoding="async" loading="lazy" src={heroImages[1]} />
                </div>
                <div className="rotate-[-1deg] rounded-2xl bg-surface-container-lowest p-2 shadow-[0px_12px_32px_rgba(24,28,32,0.06)]">
                  <img alt="Editorial performance moment" className="aspect-square w-full rounded-xl object-cover" decoding="async" loading="lazy" src={heroImages[2]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="nc-animate-fade-up bg-primary px-4 py-8 text-white sm:px-8 sm:py-10" style={{ animationDelay: "180ms" }}>
        <div className="grid grid-cols-2 gap-6 sm:flex sm:flex-wrap sm:justify-center sm:gap-12 md:gap-24">
          <Stat label="Active Events" value={loading ? "..." : `${events.length}+`} />
          <Stat label="Registered Clubs" value={loading ? "..." : `${clubs.length}+`} />
          <Stat label="Campus Categories" value={loading ? "..." : `${activeCategoryCount}+`} />
          <Stat label="RSVPs Made" value={loading ? "..." : `${formatCompact(totalRsvps)}+`} />
        </div>
      </section>

      <section className="nc-animate-fade-up -mx-4 bg-surface-container-low px-4 py-8 sm:mx-0 sm:px-8 sm:py-12" style={{ animationDelay: "240ms" }}>
        <div className="no-scrollbar flex items-center gap-3 overflow-x-auto sm:flex-wrap sm:justify-center sm:gap-4">
          <span className="shrink-0 text-sm font-bold uppercase tracking-widest text-on-surface-variant sm:mr-4">
            Explore by:
          </span>
          <Link className="shrink-0 rounded-full bg-primary px-6 py-2 text-sm font-bold text-white" to="/events">
            All Categories
          </Link>
          {explorePills.map((pill) => (
            <Link
              className="shrink-0 rounded-full bg-surface-container-lowest px-6 py-2 text-sm font-medium text-on-surface transition-all hover:bg-secondary-container"
              key={pill}
              to={`/events?q=${encodeURIComponent(pill)}`}
            >
              {pill}
            </Link>
          ))}
        </div>
      </section>

      {loading ? <LoadingState label="Loading homepage highlights..." /> : null}
      {error ? <ErrorMessage message={error} /> : null}

      {!loading && !error ? (
        <>
          <section className="space-y-8 px-0 sm:space-y-12 sm:px-2">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-secondary">
                  Happening Soon
                </span>
                <h2 className="font-headline text-3xl font-extrabold text-primary sm:text-4xl">
                  Featured upcoming events
                </h2>
              </div>
              <Link className="group inline-flex items-center gap-2 font-bold text-primary" to="/events">
                See all events
                <MaterialIcon className="transition-transform group-hover:translate-x-1" name="arrow_right_alt" />
              </Link>
            </div>

            {featuredEvents.length === 0 ? (
              <EmptyState description="Upcoming events will appear here as clubs publish new activities." title="No featured events yet" />
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredEvents.map((event, index) => {
                  const visual = getCategoryVisual(event.category);
                  const rsvpCount = event.rsvpCount ?? 0;

                  return (
                    <article className="nc-animate-fade-up group overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0px_12px_32px_rgba(24,28,32,0.06)] transition-all duration-300 hover:-translate-y-2" key={event.id} style={{ animationDelay: `${80 * index}ms` }}>
                      <div className="relative h-48 sm:h-56">
                        <img alt={event.title} className="h-full w-full object-cover" decoding="async" loading="lazy" src={visual.image} />
                        <div className="absolute left-4 top-4 min-w-[50px] rounded-xl bg-white/90 p-2 text-center backdrop-blur-sm">
                          <p className="text-xs font-bold uppercase text-on-surface-variant">{formatMonth(event.eventDate)}</p>
                          <p className="text-xl font-extrabold text-primary">{formatDay(event.eventDate)}</p>
                        </div>
                        <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-white">
                          <MaterialIcon className="text-base" filled name="groups" />
                          {rsvpCount} Joined
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary">
                          <MaterialIcon className="text-[16px]" name="celebration" />
                          {event.category}
                        </div>
                        <h3 className="nc-line-clamp-2 nc-text-safe mb-2 font-headline text-xl font-bold text-primary transition-colors group-hover:text-secondary">
                          {event.title}
                        </h3>
                        <div className="space-y-2 text-sm text-on-surface-variant">
                          <div className="flex items-center gap-2">
                            <MaterialIcon className="text-lg text-primary" filled name="schedule" />
                            {formatTimeRange(event.startTime, event.endTime)}
                          </div>
                          <div className="flex items-center gap-2">
                            <MaterialIcon className="text-lg text-primary" filled name="location_on" />
                            {event.venue}
                          </div>
                        </div>
                        <Link className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-outline-variant/30 py-3 font-bold text-primary transition-all hover:bg-primary hover:text-white" to={`/events/${event.id}`}>
                          RSVP Now
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="nc-animate-fade-up bg-surface-container-lowest px-8 py-24">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div className="order-2 relative lg:order-1">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-6">
                    <ValueCard
                      icon="hub"
                      iconClassName="text-primary"
                      title="Find Your Crew"
                      description="Connect with people who share your passion for tech, art, or social causes."
                      tone="border border-primary/10 bg-primary-fixed text-primary"
                    />
                    <ValueCard icon="rocket_launch" title="Lead and Grow" description="Step up into leadership roles and organize events that make an impact." offset="sm:translate-x-4" tone="bg-secondary-container text-on-secondary-container" />
                  </div>
                  <div className="space-y-6 pt-12">
                    <ValueCard icon="event_available" title="Never Miss Out" description="Stay close to the activities and communities shaping campus life each week." tone="bg-tertiary-fixed text-on-tertiary-fixed" />
                    <ValueCard icon="emoji_events" title="Build Your Portfolio" description="Extracurricular activities help you leave university with real stories and leadership experience." offset="sm:translate-x-4" tone="bg-surface-container-highest text-primary" />
                  </div>
                </div>
              </div>

              <div className="order-1 space-y-8 lg:order-2">
                <span className="text-sm font-bold uppercase tracking-widest text-secondary">
                  Why NileConnect?
                </span>
                <h2 className="font-headline text-4xl font-extrabold leading-tight text-primary sm:text-5xl">
                  Your gateway to a richer campus experience
                </h2>
                <p className="text-lg text-on-surface-variant">
                  We believe that university life is more than just lectures and exams. It&apos;s
                  about finding your community, exploring new interests, and building lifelong
                  connections.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <MaterialIcon className="text-secondary" filled name="check_circle" />
                    <span className="font-medium text-on-surface">Verified student-led organizations only.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MaterialIcon className="text-secondary" filled name="check_circle" />
                    <span className="font-medium text-on-surface">One-click RSVP and clear public event pages for students.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MaterialIcon className="text-secondary" filled name="check_circle" />
                    <span className="font-medium text-on-surface">Create a club and start leading your own campus community.</span>
                  </li>
                </ul>
                <Link className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-white shadow-lg" to="/clubs">
                  Learn more about NileConnect
                </Link>
              </div>
            </div>
          </section>

          <section className="-mx-4 bg-surface-container-low px-4 py-16 sm:mx-0 sm:px-8 sm:py-24">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-secondary">
                Our Communities
              </span>
              <h2 className="mb-6 font-headline text-4xl font-extrabold text-primary">
                Discover clubs that match your passion
              </h2>
              <p className="text-on-surface-variant">
                Join student-run organizations and explore the communities already bringing campus life to life.
              </p>
            </div>

            {featuredClubs.length === 0 ? (
              <EmptyState description="Featured clubs will appear here as active communities are added to the platform." title="No featured clubs yet" />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {featuredClubs.map((club, index) => {
                  const visual = getCategoryVisual(club.category);
                  const upcomingCount = featuredClubUpcomingCounts[club.id] ?? 0;

                  return (
                    <article className="nc-animate-fade-up group rounded-2xl border border-transparent bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(24,28,32,0.06)] transition-all hover:border-secondary" key={club.id} style={{ animationDelay: `${70 * index}ms` }}>
                      <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${visual.accentClassName}`}>
                        <MaterialIcon className="text-3xl" name={visual.icon} />
                      </div>
                      <h3 className="nc-line-clamp-2 nc-text-safe mb-2 font-headline text-lg font-bold text-primary">{club.name}</h3>
                      <p className="nc-line-clamp-2 mb-4 text-xs text-on-surface-variant">
                        {club.tagline || club.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between border-t border-outline-variant/10 pt-4">
                        <span className="text-xs font-bold text-secondary">{upcomingCount} Upcoming</span>
                        <Link className="text-on-surface-variant transition-colors group-hover:text-primary" to={`/clubs/${club.id}`}>
                          <MaterialIcon name="add_circle" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="nc-animate-soft-scale px-0 py-16 sm:px-8 sm:py-24">
            <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#001e40_0%,#003366_100%)] p-6 text-center shadow-[0px_12px_32px_rgba(24,28,32,0.06)] sm:p-12 lg:p-20">
              <div className="relative z-10 mx-auto max-w-2xl space-y-8">
                <h2 className="font-headline text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                  Ready to join the community?
                </h2>
                <p className="mx-auto max-w-xl text-base font-medium leading-7 text-white/90 sm:text-lg sm:leading-8">
                  Don&apos;t miss out on the most exciting events of the semester. Sign up today and start discovering Nile.
                </p>
                <div className="relative z-20 flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                  <Link className="inline-flex w-full items-center justify-center rounded-xl bg-secondary px-10 py-4 text-lg font-extrabold text-white shadow-xl transition-all hover:scale-105 sm:w-auto" to={isAuthenticated ? "/events" : "/register"}>
                    {isAuthenticated ? "Explore Events" : "Get Started"}
                  </Link>
                  <Link className="inline-flex w-full items-center justify-center rounded-xl border border-white/30 bg-white/15 px-10 py-4 text-lg font-extrabold text-white transition-all hover:bg-white/25 sm:w-auto" to="/events">
                    Browse Anonymously
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
