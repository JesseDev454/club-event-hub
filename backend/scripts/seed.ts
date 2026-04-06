import bcrypt from "bcryptjs";
import type { Repository } from "typeorm";

import { AppDataSource } from "../src/config/data-source";
import { Club } from "../src/entities/Club";
import { Event } from "../src/entities/Event";
import { RSVP } from "../src/entities/RSVP";
import { User, UserRole } from "../src/entities/User";

const DEFAULT_PASSWORD = "Password123!";
const STUDENT_LOGIN_EMAIL = "student@example.com";
const STUDENT_LOGIN_NAME = "NileConnect Student";
const DEMO_STUDENT_COUNT = 550;

type ClubSeed = {
  adminEmail: string;
  adminName: string;
  category: string;
  contactEmail: string;
  description: string;
  name: string;
};

type EventSeed = {
  category: string;
  clubName: string;
  createdByEmail: string;
  description: string;
  endTime: string | null;
  eventDate: string;
  rsvpCount: number;
  startTime: string;
  title: string;
  venue: string;
};

const CLUB_SEEDS: ClubSeed[] = [
  {
    name: "The Algorithm Guild",
    category: "Technology",
    description:
      "Advancing competitive programming skills and software development best practices through weekly sprints and guest lectures.",
    contactEmail: "algorithm.guild@nile.edu",
    adminEmail: "algorithm.admin@nile.edu",
    adminName: "Algorithm Guild Admin",
  },
  {
    name: "Canvas & Coffee",
    category: "Arts",
    description:
      "A relaxed community for visual artists of all skill levels to collaborate, critique, and showcase their work in campus exhibitions.",
    contactEmail: "canvascoffee@nile.edu",
    adminEmail: "canvas.admin@nile.edu",
    adminName: "Canvas & Coffee Admin",
  },
  {
    name: "Nile Ambassadors",
    category: "Volunteering",
    description:
      "Dedicated to community outreach and youth mentorship programs in the surrounding neighborhood. Join us to make a real impact.",
    contactEmail: "ambassadors@nile.edu",
    adminEmail: "ambassadors.admin@nile.edu",
    adminName: "Nile Ambassadors Admin",
  },
  {
    name: "Nile Drama Society",
    category: "Arts",
    description:
      "Bringing classic and contemporary theater to life through student-led productions and workshops.",
    contactEmail: "drama@nile.edu",
    adminEmail: "drama.admin@nile.edu",
    adminName: "Drama Society Admin",
  },
  {
    name: "Tech Innovators Hub",
    category: "Technology",
    description:
      "A community for coders, designers, and tech enthusiasts to collaborate on real-world digital solutions.",
    contactEmail: "innovators.hub@nile.edu",
    adminEmail: "hub.admin@nile.edu",
    adminName: "Tech Innovators Hub Admin",
  },
  {
    name: "Public Speaking Club",
    category: "Academic",
    description:
      "Master the art of persuasion and clear communication through weekly debate sessions and guest lectures.",
    contactEmail: "publicspeaking@nile.edu",
    adminEmail: "publicspeaking.admin@nile.edu",
    adminName: "Public Speaking Club Admin",
  },
  {
    name: "Visual Arts Collective",
    category: "Arts",
    description:
      "Exploring contemporary visual media from traditional painting to digital photography and film.",
    contactEmail: "visualarts@nile.edu",
    adminEmail: "visualarts.admin@nile.edu",
    adminName: "Visual Arts Collective Admin",
  },
  {
    name: "Nile Student Council",
    category: "Leadership",
    description:
      "The official representative body for student voices, focused on campus improvement and policy.",
    contactEmail: "studentcouncil@nile.edu",
    adminEmail: "council.admin@nile.edu",
    adminName: "Student Council Admin",
  },
  {
    name: "Track & Field Alliance",
    category: "Sports",
    description:
      "Fostering athletic excellence and physical wellness through competitive training and campus meets.",
    contactEmail: "trackfield@nile.edu",
    adminEmail: "track.admin@nile.edu",
    adminName: "Track & Field Admin",
  },
  {
    name: "Nile Business & Career Club",
    category: "Career",
    description:
      "The Nile Business & Career Club bridges academic theory and corporate practice through workshops, case competitions, and industry networking.",
    contactEmail: "businessclub@nile.edu",
    adminEmail: "business.admin@nile.edu",
    adminName: "Business Club Admin",
  },
  {
    name: "Nile Tech Society",
    category: "Tech",
    description:
      "The flagship technology society for software engineering, artificial intelligence, and digital entrepreneurship at Nile University.",
    contactEmail: "admin@niletech.edu",
    adminEmail: "admin@example.com",
    adminName: "Nile Tech Leader",
  },
  {
    name: "Society of Mathematics",
    category: "Academic",
    description:
      "Peer-led sessions, problem-solving circles, and exam clinics for students who want to master mathematics with confidence.",
    contactEmail: "mathematics@nile.edu",
    adminEmail: "math.admin@nile.edu",
    adminName: "Mathematics Society Admin",
  },
  {
    name: "BioScience Faculty",
    category: "Academic",
    description:
      "A public-facing faculty community spotlighting seminars, research conversations, and bioethics discussions on campus.",
    contactEmail: "bioscience@nile.edu",
    adminEmail: "bioscience.admin@nile.edu",
    adminName: "BioScience Faculty Admin",
  },
  {
    name: "Creative Arts Society",
    category: "Arts",
    description:
      "A campus club for students exploring visual arts, performance, and creative collaboration.",
    contactEmail: "creativearts@nile.edu",
    adminEmail: "arts.admin@example.com",
    adminName: "Creative Arts Admin",
  },
  {
    name: "Tech Innovators Club",
    category: "Technology",
    description:
      "A campus club for students interested in building, learning, and sharing technology projects.",
    contactEmail: "techinnovators@nile.edu",
    adminEmail: "techclub.admin@nile.edu",
    adminName: "Tech Innovators Club Admin",
  },
  {
    name: "Athletics Department",
    category: "Sports",
    description:
      "Supporting athletic performance, campus trials, and inter-college competition across the university.",
    contactEmail: "athletics@nile.edu",
    adminEmail: "athletics.admin@nile.edu",
    adminName: "Athletics Department Admin",
  },
  {
    name: "Volunteer Network",
    category: "Volunteering",
    description:
      "Mobilizing students for sustainability, community outreach, and service-driven campus initiatives.",
    contactEmail: "volunteer.network@nile.edu",
    adminEmail: "volunteer.admin@nile.edu",
    adminName: "Volunteer Network Admin",
  },
  {
    name: "Arts Council",
    category: "Arts",
    description:
      "Curating showcases, exhibitions, and collaborations that spotlight student creativity across Nile University.",
    contactEmail: "artscouncil@nile.edu",
    adminEmail: "artscouncil.admin@nile.edu",
    adminName: "Arts Council Admin",
  },
  {
    name: "Student Union",
    category: "Social",
    description:
      "Planning campus-wide social programming, festivals, and shared student experiences throughout the academic year.",
    contactEmail: "studentunion@nile.edu",
    adminEmail: "union.admin@nile.edu",
    adminName: "Student Union Admin",
  },
];

function buildSeries(
  clubName: string,
  createdByEmail: string,
  category: string,
  venue: string,
  startDate: string,
  titles: string[],
): EventSeed[] {
  const start = new Date(`${startDate}T00:00:00Z`);

  return titles.map((title, index) => {
    const eventDate = new Date(start);
    eventDate.setUTCDate(start.getUTCDate() + index * 7);

    return {
      title,
      clubName,
      createdByEmail,
      category,
      venue,
      eventDate: eventDate.toISOString().slice(0, 10),
      startTime: "17:00",
      endTime: "19:00",
      description: `${title} is part of NileConnect's 2026 public activity calendar for ${clubName}.`,
      rsvpCount: 0,
    };
  });
}

const EVENT_SEEDS: EventSeed[] = [
  {
    title: "Future of AI Workshop",
    clubName: "Tech Innovators Club",
    createdByEmail: "techclub.admin@nile.edu",
    category: "Technology",
    description:
      "A focused workshop exploring practical AI tools, student use-cases, and the future of intelligent campus products.",
    eventDate: "2026-10-24",
    startTime: "10:00",
    endTime: "12:30",
    venue: "Innovation Hub, Hall B",
    rsvpCount: 86,
  },
  {
    title: "Nile Beats Music Festival",
    clubName: "Creative Arts Society",
    createdByEmail: "arts.admin@example.com",
    category: "Social",
    description:
      "Students, performers, and music lovers gather for a twilight festival with live sets, spoken word, and creative energy.",
    eventDate: "2026-10-28",
    startTime: "18:00",
    endTime: "22:00",
    venue: "The Main Quad",
    rsvpCount: 214,
  },
  {
    title: "Varsity Football Trials",
    clubName: "Athletics Department",
    createdByEmail: "athletics.admin@nile.edu",
    category: "Sports",
    description:
      "Official selection trials for students aiming to represent Nile University in varsity football competition.",
    eventDate: "2026-11-02",
    startTime: "15:00",
    endTime: "18:00",
    venue: "Nile University Stadium",
    rsvpCount: 45,
  },
  {
    title: "Eco-Campus Clean Up",
    clubName: "Volunteer Network",
    createdByEmail: "volunteer.admin@nile.edu",
    category: "Volunteering",
    description:
      "A high-impact sustainability drive where students help restore shared outdoor spaces and improve campus wellbeing.",
    eventDate: "2026-11-05",
    startTime: "08:00",
    endTime: "11:00",
    venue: "North Entrance Plaza",
    rsvpCount: 112,
  },
  {
    title: "Future of AI: Campus Symposium 2026",
    clubName: "Nile Tech Society",
    createdByEmail: "admin@example.com",
    category: "Tech",
    description:
      "Explore the impact of generative AI on modern engineering and creative disciplines with guest speakers.",
    eventDate: "2026-10-24",
    startTime: "10:00",
    endTime: "17:00",
    venue: "Innovation Hub, Hall A",
    rsvpCount: 142,
  },
  {
    title: "Annual Spring Career Fair",
    clubName: "Nile Business & Career Club",
    createdByEmail: "business.admin@nile.edu",
    category: "Career",
    description:
      "Connect with top employers from engineering, healthcare, and finance sectors looking for interns.",
    eventDate: "2026-10-26",
    startTime: "09:00",
    endTime: "15:00",
    venue: "Main Hall & Plaza",
    rsvpCount: 350,
  },
  {
    title: "Midterm Prep: Calculus Workshop",
    clubName: "Society of Mathematics",
    createdByEmail: "math.admin@nile.edu",
    category: "Academic",
    description:
      "Peer-led review session covering integration techniques and differential equations before midterm season.",
    eventDate: "2026-10-25",
    startTime: "18:00",
    endTime: "20:00",
    venue: "Mathematics Resource Center",
    rsvpCount: 89,
  },
  {
    title: "Nile Moonlight Festival",
    clubName: "Student Union",
    createdByEmail: "union.admin@nile.edu",
    category: "Social",
    description:
      "A night of acoustic music, food trucks, and stargazing on the university lawn.",
    eventDate: "2026-10-31",
    startTime: "20:00",
    endTime: "23:00",
    venue: "University Lawn",
    rsvpCount: 215,
  },
  {
    title: "Inter-College Basketball Finals",
    clubName: "Track & Field Alliance",
    createdByEmail: "track.admin@nile.edu",
    category: "Sports",
    description:
      "Cheer for your college as the Titans face off against the Warriors for the season trophy.",
    eventDate: "2026-11-01",
    startTime: "16:00",
    endTime: "19:00",
    venue: "Nile Sports Center",
    rsvpCount: 512,
  },
  {
    title: "Ethics in Biotechnology Seminar",
    clubName: "BioScience Faculty",
    createdByEmail: "bioscience.admin@nile.edu",
    category: "Academic",
    description:
      "Join Dr. Elena Vance for a critical discussion on CRISPR, responsible innovation, and modern bioethics.",
    eventDate: "2026-11-05",
    startTime: "14:00",
    endTime: "16:00",
    venue: "BioScience Auditorium",
    rsvpCount: 67,
  },
  {
    title: "Visionary: Student Art Showcase",
    clubName: "Arts Council",
    createdByEmail: "artscouncil.admin@nile.edu",
    category: "Social",
    description:
      "An immersive exhibition featuring digital media, sculpture, and canvas works from the Fine Arts department.",
    eventDate: "2026-11-10",
    startTime: "11:00",
    endTime: "14:00",
    venue: "Fine Arts Gallery",
    rsvpCount: 128,
  },
  {
    title: "24-Hour Code Sprint: HackNile",
    clubName: "Tech Innovators Hub",
    createdByEmail: "hub.admin@nile.edu",
    category: "Tech",
    description:
      "Build innovative solutions for sustainable campus life. Prizes, food, and plenty of coffee provided.",
    eventDate: "2026-11-12",
    startTime: "08:00",
    endTime: "23:00",
    venue: "Innovation Hub B1",
    rsvpCount: 256,
  },
  {
    title: "Nile Tech Summit 2026",
    clubName: "Nile Tech Society",
    createdByEmail: "admin@example.com",
    category: "Tech",
    description:
      "The Nile Tech Summit 2026 brings together software engineering, artificial intelligence, and digital entrepreneurship for a full day of immersive learning and networking.",
    eventDate: "2026-11-24",
    startTime: "09:00",
    endTime: "17:00",
    venue: "Innovation Hub, Hall A",
    rsvpCount: 342,
  },
  {
    title: "Mastering Venture Capital",
    clubName: "Nile Business & Career Club",
    createdByEmail: "business.admin@nile.edu",
    category: "Career",
    description:
      "Learn the ins and outs of startup funding with visiting partners and founders from across the region.",
    eventDate: "2026-10-24",
    startTime: "13:00",
    endTime: "15:00",
    venue: "Management Science Wing, Block B",
    rsvpCount: 64,
  },
  {
    title: "The Annual Career Mixer",
    clubName: "Nile Business & Career Club",
    createdByEmail: "business.admin@nile.edu",
    category: "Career",
    description:
      "Connect with alumni and recruiters from top companies in a relaxed setting built for strong introductions.",
    eventDate: "2026-11-12",
    startTime: "17:00",
    endTime: "20:00",
    venue: "Executive Lounge, Block B",
    rsvpCount: 93,
  },
  {
    title: "Web3 Hackathon Final",
    clubName: "Nile Tech Society",
    createdByEmail: "admin@example.com",
    category: "Tech",
    description:
      "The final showcase for Nile Tech Society's flagship build sprint, featuring judges, demos, and awards.",
    eventDate: "2026-10-24",
    startTime: "09:00",
    endTime: "17:00",
    venue: "Main Campus Auditorium",
    rsvpCount: 124,
  },
  {
    title: "AI Ethics Workshop",
    clubName: "Nile Tech Society",
    createdByEmail: "admin@example.com",
    category: "Tech",
    description:
      "A focused conversation on trustworthy AI, bias mitigation, and responsible deployment in campus products.",
    eventDate: "2026-11-02",
    startTime: "14:00",
    endTime: "16:00",
    venue: "Innovation Lab B",
    rsvpCount: 15,
  },
  {
    title: "Intro to Python",
    clubName: "Nile Tech Society",
    createdByEmail: "admin@example.com",
    category: "Technology",
    description:
      "A beginner-friendly technical session covering Python syntax, data types, and project setup fundamentals.",
    eventDate: "2026-09-12",
    startTime: "13:00",
    endTime: "15:00",
    venue: "Digital Skills Lab",
    rsvpCount: 89,
  },
  ...buildSeries(
    "Nile Drama Society",
    "drama.admin@nile.edu",
    "Arts",
    "Performing Arts Studio",
    "2026-12-02",
    [
      "Stagecraft Masterclass",
      "Monologue Lab",
      "Shakespeare in Rehearsal",
      "Modern Playwriting Circle",
      "Semester Showcase Auditions",
    ],
  ),
  ...buildSeries(
    "Tech Innovators Hub",
    "hub.admin@nile.edu",
    "Tech",
    "Innovation Hub Studio",
    "2026-12-01",
    [
      "Build with APIs Lab",
      "Product Design Sprint",
      "Campus App Jam",
      "Frontend Review Night",
      "Open Source Onboarding",
      "Cloud Deployment Clinic",
    ],
  ),
  ...buildSeries(
    "Public Speaking Club",
    "publicspeaking.admin@nile.edu",
    "Academic",
    "Debate Chamber",
    "2026-12-03",
    [
      "Debate Bootcamp",
      "Leadership Pitch Night",
      "Mock Parliament Session",
      "Persuasion Masterclass",
    ],
  ),
  ...buildSeries(
    "Visual Arts Collective",
    "visualarts.admin@nile.edu",
    "Arts",
    "Creative Studio West",
    "2026-12-04",
    [
      "Analog Photography Walk",
      "Studio Critique Session",
      "Mixed Media Jam",
      "Portfolio Review Clinic",
      "Documentary Frame Lab",
      "Open Sketch Salon",
    ],
  ),
  ...buildSeries(
    "Nile Student Council",
    "council.admin@nile.edu",
    "Social",
    "Student Affairs Forum",
    "2026-12-05",
    [
      "Student Budget Town Hall",
      "Campus Policy Forum",
      "Leadership Roundtable",
    ],
  ),
  ...buildSeries(
    "Track & Field Alliance",
    "track.admin@nile.edu",
    "Sports",
    "Nile Sports Complex",
    "2026-12-06",
    [
      "Sprint Mechanics Clinic",
      "Endurance Run Camp",
      "Relay Team Trials",
      "Strength and Recovery Clinic",
      "Athletics Nutrition Talk",
      "Weekend Track Meet",
      "Captain's Strategy Huddle",
    ],
  ),
  ...buildSeries(
    "Nile Ambassadors",
    "ambassadors.admin@nile.edu",
    "Volunteering",
    "Community Outreach Center",
    "2026-12-07",
    ["Community Mentorship Orientation", "Literacy Outreach Drive"],
  ),
];

function buildDemoStudentEmail(index: number): string {
  return `demo.student${String(index).padStart(3, "0")}@nile.edu`;
}

async function upsertClub(
  clubRepository: Repository<Club>,
  seed: ClubSeed,
  ownerUserId: string,
) {
  const existingClub = await clubRepository.findOne({
    where: { name: seed.name },
  });

  if (existingClub) {
    return clubRepository.save({
      ...existingClub,
      name: seed.name,
      description: seed.description,
      category: seed.category,
      contactEmail: seed.contactEmail,
      ownerUserId,
    });
  }

  return clubRepository.save(
    clubRepository.create({
      name: seed.name,
      description: seed.description,
      category: seed.category,
      contactEmail: seed.contactEmail,
      ownerUserId,
    }),
  );
}

async function ensureClubOwnerUser(
  userRepository: Repository<User>,
  payload: {
    email: string;
    name: string;
    passwordHash: string;
  },
) {
  const existingUser = await userRepository.findOne({
    where: { email: payload.email },
  });

  if (existingUser) {
    return userRepository.save({
      ...existingUser,
      name: payload.name,
      passwordHash: payload.passwordHash,
    });
  }

  return userRepository.save(
    userRepository.create({
      name: payload.name,
      email: payload.email,
      passwordHash: payload.passwordHash,
      role: UserRole.STUDENT,
      clubId: null,
    }),
  );
}

async function upsertUser(
  userRepository: Repository<User>,
  payload: {
    clubId: string | null;
    email: string;
    name: string;
    passwordHash: string;
    role: UserRole;
  },
) {
  const existingUser = await userRepository.findOne({
    where: { email: payload.email },
  });

  if (existingUser) {
    return userRepository.save({
      ...existingUser,
      name: payload.name,
      passwordHash: payload.passwordHash,
      role: payload.role,
      clubId: payload.clubId,
    });
  }

  return userRepository.save(userRepository.create(payload));
}

async function syncSeedRsvps(
  rsvpRepository: Repository<RSVP>,
  eventId: string,
  targetUsers: User[],
) {
  const targetUserIds = new Set(targetUsers.map((user) => user.id));
  const existingSeedRsvps = await rsvpRepository.find({
    where: { eventId },
    relations: { user: true },
  });

  const seedRsvpsByUserId = new Map<string, RSVP>();
  existingSeedRsvps.forEach((rsvp) => {
    if (rsvp.user.email.startsWith("demo.student")) {
      seedRsvpsByUserId.set(rsvp.userId, rsvp);
    }
  });

  const rsvpsToCreate = targetUsers
    .filter((user) => !seedRsvpsByUserId.has(user.id))
    .map((user) =>
      rsvpRepository.create({
        eventId,
        userId: user.id,
      }),
    );

  if (rsvpsToCreate.length > 0) {
    await rsvpRepository.save(rsvpsToCreate);
  }

  const rsvpsToDelete = Array.from(seedRsvpsByUserId.values()).filter(
    (rsvp) => !targetUserIds.has(rsvp.userId),
  );

  if (rsvpsToDelete.length > 0) {
    await rsvpRepository.remove(rsvpsToDelete);
  }
}

async function runSeed(): Promise<void> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const clubRepository = AppDataSource.getRepository(Club);
    const eventRepository = AppDataSource.getRepository(Event);
    const rsvpRepository = AppDataSource.getRepository(RSVP);
    const userRepository = AppDataSource.getRepository(User);

    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    const clubsByName = new Map<string, Club>();

    for (const clubSeed of CLUB_SEEDS) {
      const ownerUser = await ensureClubOwnerUser(userRepository, {
        name: clubSeed.adminName,
        email: clubSeed.adminEmail,
        passwordHash,
      });
      const club = await upsertClub(clubRepository, clubSeed, ownerUser.id);
      clubsByName.set(clubSeed.name, club);
    }

    await upsertUser(userRepository, {
      name: STUDENT_LOGIN_NAME,
      email: STUDENT_LOGIN_EMAIL,
      passwordHash,
      role: UserRole.STUDENT,
      clubId: null,
    });

    const usersByEmail = new Map<string, User>();

    for (const clubSeed of CLUB_SEEDS) {
      const club = clubsByName.get(clubSeed.name);

      if (!club) {
        throw new Error(`Club ${clubSeed.name} was not found after seeding.`);
      }

      const adminUser = await upsertUser(userRepository, {
        name: clubSeed.adminName,
        email: clubSeed.adminEmail,
        passwordHash,
        role: UserRole.CLUB_ADMIN,
        clubId: club.id,
      });

      usersByEmail.set(clubSeed.adminEmail, adminUser);
    }

    for (let index = 1; index <= DEMO_STUDENT_COUNT; index += 1) {
      const email = buildDemoStudentEmail(index);
      const user = await upsertUser(userRepository, {
        name: `Demo Student ${String(index).padStart(3, "0")}`,
        email,
        passwordHash,
        role: UserRole.STUDENT,
        clubId: null,
      });

      usersByEmail.set(email, user);
    }

    const demoStudents = Array.from({ length: DEMO_STUDENT_COUNT }, (_, index) => {
      const email = buildDemoStudentEmail(index + 1);
      const user = usersByEmail.get(email);

      if (!user) {
        throw new Error(`Demo student ${email} was not found after creation.`);
      }

      return user;
    });

    for (const eventSeed of EVENT_SEEDS) {
      const club = clubsByName.get(eventSeed.clubName);

      if (!club) {
        throw new Error(`Event club ${eventSeed.clubName} was not found.`);
      }

      const adminUser = usersByEmail.get(eventSeed.createdByEmail);

      if (!adminUser) {
        throw new Error(`Event creator ${eventSeed.createdByEmail} was not found.`);
      }

      const existingEvent = await eventRepository.findOne({
        where: { title: eventSeed.title },
      });

      const savedEvent = await eventRepository.save({
        ...(existingEvent ?? eventRepository.create()),
        clubId: club.id,
        createdBy: adminUser.id,
        title: eventSeed.title,
        description: eventSeed.description,
        eventDate: eventSeed.eventDate,
        startTime: eventSeed.startTime,
        endTime: eventSeed.endTime,
        venue: eventSeed.venue,
        category: eventSeed.category,
        highlights: [],
        targetAudience: [],
        additionalInfo: null,
      });

      await syncSeedRsvps(rsvpRepository, savedEvent.id, demoStudents.slice(0, eventSeed.rsvpCount));
    }

    console.log("NileConnect 2026 seed completed.");
    console.log(`Student login: ${STUDENT_LOGIN_EMAIL} / ${DEFAULT_PASSWORD}`);
    console.log(`Tech admin login: admin@example.com / ${DEFAULT_PASSWORD}`);
    console.log(`Business admin login: business.admin@nile.edu / ${DEFAULT_PASSWORD}`);
    console.log(`Total clubs seeded: ${CLUB_SEEDS.length}`);
    console.log(`Total events seeded: ${EVENT_SEEDS.length}`);
    console.log(`Demo RSVP students available: ${DEMO_STUDENT_COUNT}`);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

runSeed().catch((error: unknown) => {
  console.error("Seed script failed:", error);
  process.exit(1);
});
