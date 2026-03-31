import { AppDataSource } from "../../config/data-source";
import { User } from "../../entities/User";

type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: User["role"];
  clubId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function getUserRepository() {
  return AppDataSource.getRepository(User);
}

async function findUserById(id: string): Promise<User | null> {
  return getUserRepository().findOne({
    where: { id },
  });
}

async function findUserByEmail(email: string): Promise<User | null> {
  return getUserRepository().findOne({
    where: { email },
  });
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

export const usersService = {
  findUserById,
  findUserByEmail,
  serializeUser,
};
