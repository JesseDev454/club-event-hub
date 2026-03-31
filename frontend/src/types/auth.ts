export type UserRole = "student" | "club_admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clubId: string | null;
};

export type AuthSuccessPayload = {
  token: string;
  user: AuthUser;
};

export type RegisterStudentInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};
