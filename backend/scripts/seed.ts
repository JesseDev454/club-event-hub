import bcrypt from "bcryptjs";

import { AppDataSource } from "../src/config/data-source";
import { Club } from "../src/entities/Club";
import { User, UserRole } from "../src/entities/User";

const DEFAULT_PASSWORD = "Password123!";

async function runSeed(): Promise<void> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const clubRepository = AppDataSource.getRepository(Club);
    const userRepository = AppDataSource.getRepository(User);

    const seedClub =
      (await clubRepository.findOne({
        where: {},
        order: { createdAt: "ASC" },
      })) ?? (await clubRepository.save(clubRepository.create({})));

    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    const studentEmail = "student@example.com";
    const adminEmail = "admin@example.com";

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

    console.log("Sprint 1 seed completed.");
    console.log(`Student login: ${studentEmail} / ${DEFAULT_PASSWORD}`);
    console.log(`Admin login: ${adminEmail} / ${DEFAULT_PASSWORD}`);
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
