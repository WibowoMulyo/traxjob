export interface PublicUser {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  createdAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: PublicUser;
    }
  }
}
