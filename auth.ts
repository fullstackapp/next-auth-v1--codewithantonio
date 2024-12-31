import NextAuth from 'next-auth';
import authConfig from './auth.config';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from './lib/db';
import { getUserById } from './data/user';
import { getTwoFactorConfirmationByUserId } from './data/two-factor-confirmation';
import { getAccountByUserId } from './data/account';

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      //Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true;
      if (user && user.id) {
        const existingUser = await getUserById(user.id);
        // Prevent sign-in without email verification
        if (!existingUser?.emailVerified) {
          return false;
        }
        if (existingUser?.isTwoFactorEnabled) {
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
            existingUser.id,
          );
          if (!twoFactorConfirmation) {
            return false;
          } else {
            // Delete two factor confirmation for next sign-in
            await db.twoFactorConfirmation.delete({
              where: {
                id: twoFactorConfirmation.id,
              },
            });
          }
        }
      }
      return true;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.isOAuth = token.isOAuth;

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }
      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        return token;
      }

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.id = token.sub;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.isOAuth = !!existingAccount;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
