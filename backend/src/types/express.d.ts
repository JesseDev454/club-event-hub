declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "student" | "club_admin";
        clubId?: string | null;
      };
    }
  }
}

export {};
