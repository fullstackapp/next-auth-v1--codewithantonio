import { UserRole } from '@prisma/client';
import NextAuth, { type DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export type ExtentedUser = DefaultSession['user'] & {
  id: string;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  name: string | null;
  email: string;
  isOAuth: boolean;
};

declare module 'next-auth' {
  interface Session {
    user: ExtentedUser;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    id: string;
    role: UserRole;
    isTwoFactorEnabled: boolean;
    name: string | null;
    email: string;
    isOAuth: boolean;
  }
}
