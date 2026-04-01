import bcrypt from "bcryptjs";

import { AppDataSource } from "../src/config/data-source";
import { Club } from "../src/entities/Club";
import { Event } from "../src/entities/Event";
import { User, UserRole } from "../src/entities/User";

const DEFAULT_PASSWORD = "Password123!";
const SAMPLE_CLUB = {
  name: "Tech Innovators Club",
  description: "A campus club for students interested in building, learning, and sharing technology projects.",
  category: "Technology",
  contactEmail: "techclub@example.com",
};
const SECONDARY_CLUB = {
  name: "Creative Arts Society",
  description: "A campus club for students exploring visual arts, performance, and creative collaboration.",
  category: "Arts",
  contactEmail: "artsclub@example.com",
};
const SAMPLE_EVENT_TITLE = "Campus Builders Meetup";
const SAMPLE_SECOND_EVENT_TITLE = "Innovation Demo Night";
const SECONDARY_EVENT_TITLE = "Open Mic and Art Showcase";

function getFutureDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function runSeed(): Promise<void> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const clubRepository = AppDataSource.getRepository(Club);
    const eventRepository = AppDataSource.getRepository(Event);
    const userRepository = AppDataSource.getRepository(User);

    let seedClub =
      (await clubRepository.findOne({
        where: { name: SAMPLE_CLUB.name },
      })) ??
      (await clubRepository.save(
        clubRepository.create(SAMPLE_CLUB),
      ));

    seedClub = await clubRepository.save({
      ...seedClub,
      ...SAMPLE_CLUB,
    });

    let secondaryClub =
      (await clubRepository.findOne({
        where: { name: SECONDARY_CLUB.name },
      })) ??
      (await clubRepository.save(
        clubRepository.create(SECONDARY_CLUB),
      ));

    secondaryClub = await clubRepository.save({
      ...secondaryClub,
      ...SECONDARY_CLUB,
    });

    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    const studentEmail = "student@example.com";
    const adminEmail = "admin@example.com";
    const secondaryAdminEmail = "arts.admin@example.com";

    const existingStudent = await userRepository.findOne({
      where: { email: studentEmail },
    });

    if (!existingStudent) {
      await userRepository.save(
        userRepository.create({
          name: "Sample Student",
          email: studentEmail,
          passwordHash,
          role: UserRole.STUDENT,
          clubId: null,
        }),
      );
    }

    const existingAdmin = await userRepository.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      await userRepository.save(
        userRepository.create({
          name: "Sample Club Admin",
          email: adminEmail,
          passwordHash,
          role: UserRole.CLUB_ADMIN,
          clubId: seedClub.id,
        }),
      );
    }
    
    const existingSecondaryAdmin = await userRepository.findOne({
      where: { email: secondaryAdminEmail },
    });

    if (!existingSecondaryAdmin) {
      await userRepository.save(
        userRepository.create({
          name: "Creative Arts Admin",
          email: secondaryAdminEmail,
          passwordHash,
          role: UserRole.CLUB_ADMIN,
          clubId: secondaryClub.id,
        }),
      );
    }

    const adminUser =
      (await userRepository.findOne({
        where: { email: adminEmail },
      })) ?? null;

    if (!adminUser) {
      throw new Error("Seed admin user could not be found after creation.");
    }

    await userRepository.save({
      ...adminUser,
      clubId: seedClub.id,
    });

    const secondaryAdminUser =
      (await userRepository.findOne({
        where: { email: secondaryAdminEmail },
      })) ?? null;

    if (!secondaryAdminUser) {
      throw new Error("Secondary seed admin user could not be found after creation.");
    }

    await userRepository.save({
      ...secondaryAdminUser,
      clubId: secondaryClub.id,
    });

    const firstEventDate = getFutureDate(7);
    const secondEventDate = getFutureDate(14);
    const thirdEventDate = getFutureDate(10);

    const existingFirstEvent = await eventRepository.findOne({
      where: { title: SAMPLE_EVENT_TITLE },
    });

    if (!existingFirstEvent) {
      await eventRepository.save(
        eventRepository.create({
          clubId: seedClub.id,
          createdBy: adminUser.id,
          title: SAMPLE_EVENT_TITLE,
          description: "A collaborative evening for student makers and developers to share project ideas.",
          eventDate: firstEventDate,
          startTime: "17:00",
          endTime: "19:00",
          venue: "Engineering Hall",
          category: "Networking",
        }),
      );
    }

    const existingSecondEvent = await eventRepository.findOne({
      where: { title: SAMPLE_SECOND_EVENT_TITLE },
    });

    if (!existingSecondEvent) {
      await eventRepository.save(
        eventRepository.create({
          clubId: seedClub.id,
          createdBy: adminUser.id,
          title: SAMPLE_SECOND_EVENT_TITLE,
          description: "Students present prototypes, demos, and creative campus tech experiments.",
          eventDate: secondEventDate,
          startTime: "18:30",
          endTime: "20:00",
          venue: "Innovation Lab",
          category: "Showcase",
        }),
      );
    }

    const existingThirdEvent = await eventRepository.findOne({
      where: { title: SECONDARY_EVENT_TITLE },
    });

    if (!existingThirdEvent) {
      await eventRepository.save(
        eventRepository.create({
          clubId: secondaryClub.id,
          createdBy: secondaryAdminUser.id,
          title: SECONDARY_EVENT_TITLE,
          description: "A relaxed evening of student performances, spoken word, and gallery-style displays.",
          eventDate: thirdEventDate,
          startTime: "16:30",
          endTime: "18:30",
          venue: "Student Center Auditorium",
          category: "Arts",
        }),
      );
    }

    console.log("Sprint 2 seed completed.");
    console.log(`Student login: ${studentEmail} / ${DEFAULT_PASSWORD}`);
    console.log(`Admin login: ${adminEmail} / ${DEFAULT_PASSWORD}`);
    console.log(`Secondary admin login: ${secondaryAdminEmail} / ${DEFAULT_PASSWORD}`);
    console.log(`Seeded club id: ${seedClub.id}`);
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
