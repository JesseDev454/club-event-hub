import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

function isValidDateString(value: string): boolean {
  const parsedDate = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsedDate.getTime());
}

function isValidTimeRange(startTime: string, endTime?: string): boolean {
  if (!endTime) {
    return true;
  }

  return endTime > startTime;
}

const eventBodyBaseSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters long.")
      .max(160, "Title cannot exceed 160 characters."),
    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters long.")
      .max(5000, "Description cannot exceed 5000 characters."),
    eventDate: z
      .string()
      .regex(dateRegex, "Event date must be in YYYY-MM-DD format.")
      .refine(isValidDateString, "Event date must be a valid date."),
    startTime: z
      .string()
      .regex(timeRegex, "Start time must be in HH:MM or HH:MM:SS format."),
    endTime: z
      .string()
      .regex(timeRegex, "End time must be in HH:MM or HH:MM:SS format.")
      .optional()
      .nullable(),
    venue: z
      .string()
      .trim()
      .min(2, "Venue must be at least 2 characters long.")
      .max(160, "Venue cannot exceed 160 characters."),
    category: z
      .string()
      .trim()
      .min(2, "Category must be at least 2 characters long.")
      .max(100, "Category cannot exceed 100 characters."),
  })
  .strict();

const createEventBodySchema = eventBodyBaseSchema.refine(
    (data) => isValidTimeRange(data.startTime, data.endTime ?? undefined),
    {
      message: "End time must be later than start time.",
      path: ["endTime"],
    },
  );

const updateEventBodySchema = eventBodyBaseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update an event.",
  })
  .refine(
    (data) => {
      if (data.startTime === undefined || data.endTime === undefined || data.endTime === null) {
        return true;
      }

      return isValidTimeRange(data.startTime, data.endTime);
    },
    {
      message: "End time must be later than start time.",
      path: ["endTime"],
    },
  );

const eventIdParamsSchema = z.object({
  id: z.string().uuid("Event id must be a valid UUID."),
});

export const createEventSchema = z.object({
  body: createEventBodySchema,
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const updateEventSchema = z.object({
  body: updateEventBodySchema,
  params: eventIdParamsSchema,
  query: z.object({}).default({}),
});

export const eventIdSchema = z.object({
  body: z.object({}).default({}),
  params: eventIdParamsSchema,
  query: z.object({}).default({}),
});

export type CreateEventInput = z.infer<typeof createEventBodySchema>;
export type UpdateEventInput = z.infer<typeof updateEventBodySchema>;
