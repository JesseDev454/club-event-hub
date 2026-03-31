import "reflect-metadata";
import path from "path";

import { DataSource } from "typeorm";

import { Club } from "../entities/Club";
import { Event } from "../entities/Event";
import { RSVP } from "../entities/RSVP";
import { User } from "../entities/User";
import { env } from "./env";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,
  entities: [User, Club, Event, RSVP],
  migrations: [path.resolve(__dirname, "../../migrations/*{.ts,.js}")],
  synchronize: false,
  logging: env.NODE_ENV === "development",
});
