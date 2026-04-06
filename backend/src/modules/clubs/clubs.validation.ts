import { z } from "zod";

function normalizeOptionalNullableString(value: unknown): unknown {
  return typeof value === "string" ? value.trim() : value;
}

const optionalContactEmailSchema = z.preprocess(
  normalizeOptionalNullableString,
  z
    .union([
      z
        .string()
        .email("A valid contact email address is required.")
        .max(255, "Contact email cannot exceed 255 characters."),
      z.literal(""),
      z.undefined(),
    ]),
).transform((value) => (value === "" ? null : value));

const optionalTaglineSchema = z.preprocess(
  normalizeOptionalNullableString,
  z
    .union([
      z.string().max(180, "Tagline cannot exceed 180 characters."),
      z.literal(""),
      z.undefined(),
    ]),
).transform((value) => (value === "" ? null : value));

const createClubBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Club name must be at least 2 characters long.")
    .max(120, "Club name cannot exceed 120 characters."),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters long.")
    .max(5000, "Description cannot exceed 5000 characters."),
  category: z
    .string()
    .trim()
    .min(2, "Category must be at least 2 characters long.")
    .max(100, "Category cannot exceed 100 characters."),
  contactEmail: optionalContactEmailSchema,
  tagline: optionalTaglineSchema,
}).strict();

const updateClubBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Club name must be at least 2 characters long.")
      .max(120, "Club name cannot exceed 120 characters.")
      .optional(),
    description: z
      .string()
      .trim()
      .min(20, "Description must be at least 20 characters long.")
      .max(5000, "Description cannot exceed 5000 characters.")
      .optional(),
    category: z
      .string()
      .trim()
      .min(2, "Category must be at least 2 characters long.")
      .max(100, "Category cannot exceed 100 characters.")
      .optional(),
    contactEmail: optionalContactEmailSchema.optional(),
    tagline: optionalTaglineSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update a club.",
  });

const clubIdParamsSchema = z.object({
  id: z.string().uuid("Club id must be a valid UUID."),
});

export const createClubSchema = z.object({
  body: createClubBodySchema,
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const clubIdSchema = z.object({
  body: z.object({}).default({}),
  params: clubIdParamsSchema,
  query: z.object({}).default({}),
});

export const updateClubSchema = z.object({
  body: updateClubBodySchema,
  params: clubIdParamsSchema,
  query: z.object({}).default({}),
});

export type CreateClubInput = z.infer<typeof createClubBodySchema>;
export type UpdateClubInput = z.infer<typeof updateClubBodySchema>;
