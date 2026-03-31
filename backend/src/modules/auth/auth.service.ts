import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "../../config/env";
import { AppDataSource } from "../../config/data-source";
import { ApiError } from "../../utils/ApiError";
import { User, UserRole } from "../../entities/User";
import type { LoginInput, RegisterInput } from "./auth.validation";

type AuthTokenPayload = {
  id: string;
  role: UserRole;
  clubId: string | null;
};

type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clubId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type AuthResponse = {
  token: string;
  user: SafeUser;
};

const SALT_ROUNDS = 10;

function getUserRepository() {
  return AppDataSource.getRepository(User);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function serializeUser(user: User): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    clubId: user.clubId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function signAuthToken(user: User): string {
  const payload: AuthTokenPayload = {
    id: user.id,
    role: user.role,
    clubId: user.clubId,
  };

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
}

async function registerStudent(input: RegisterInput): Promise<AuthResponse> {
  const userRepository = getUserRepository();
  const email = normalizeEmail(input.email);

  const existingUser = await userRepository.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = userRepository.create({
    name: input.name.trim(),
    email,
    passwordHash,
    role: UserRole.STUDENT,
    clubId: null,
  });

  const savedUser = await userRepository.save(user);

  return {
    token: signAuthToken(savedUser),
    user: serializeUser(savedUser),
  };
}

async function loginUser(input: LoginInput): Promise<AuthResponse> {
  const userRepository = getUserRepository();
  const email = normalizeEmail(input.email);

  const user = await userRepository.findOne({
    where: { email },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  return {
    token: signAuthToken(user),
    user: serializeUser(user),
  };
}

async function getCurrentUser(userId: string): Promise<SafeUser> {
  const userRepository = getUserRepository();

  const user = await userRepository.findOne({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "Authenticated user was not found.");
  }

  return serializeUser(user);
}

function verifyAuthToken(token: string): AuthTokenPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (
      typeof decoded === "string" ||
      !("id" in decoded) ||
      typeof decoded.id !== "string" ||
      !("role" in decoded) ||
      !Object.values(UserRole).includes(decoded.role as UserRole)
    ) {
      throw new ApiError(401, "Invalid authentication token.");
    }

    return decoded as AuthTokenPayload;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, "Invalid or expired authentication token.");
  }
}

export const authService = {
  registerStudent,
  loginUser,
  getCurrentUser,
  verifyAuthToken,
};
