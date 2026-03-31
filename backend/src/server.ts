import { app } from "./app";
import { AppDataSource } from "./config/data-source";
import { env } from "./config/env";

async function startServer(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established.");

    app.listen(env.PORT, () => {
      console.log(`Server listening on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

void startServer();
