import { AppDataSource } from "../src/config/data-source";

async function runSeed(): Promise<void> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    console.log("Seed placeholder: no records inserted in Sprint 0.");
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
