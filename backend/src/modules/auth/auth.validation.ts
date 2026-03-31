import { z } from "zod";

const registerBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long.")
    .max(120, "Name cannot exceed 120 characters."),
  email: z
    .string()
    .trim()
    .email("A valid email address is required.")
    .max(255, "Email cannot exceed 255 characters."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(72, "Password cannot exceed 72 characters."),
});

const loginBodySchema = z.object({
  email: z
    .string()
    .trim()
    .email("A valid email address is required.")
    .max(255, "Email cannot exceed 255 characters."),
  password: z
    .string()
    .min(1, "Password is required.")
    .max(72, "Password cannot exceed 72 characters."),
});

export const registerSchema = z.object({
  body: registerBodySchema,
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const loginSchema = z.object({
  body: loginBodySchema,
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export type RegisterInput = z.infer<typeof registerBodySchema>;
export type LoginInput = z.infer<typeof loginBodySchema>;
