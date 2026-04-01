import { z } from "zod";

const eventIdParamsSchema = z.object({
  id: z.string().uuid("Event id must be a valid UUID."),
});

export const eventRsvpSchema = z.object({
  body: z.object({}).default({}),
  params: eventIdParamsSchema,
  query: z.object({}).default({}),
});
