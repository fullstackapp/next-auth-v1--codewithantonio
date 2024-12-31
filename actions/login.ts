'use server';

import { signIn } from '@/auth';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import { sendTwoFactorEmail, sendVerificationEmail } from '@/lib/mail';
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from '@/lib/tokens';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas';
import { AuthError } from 'next-auth';
import { z } from 'zod';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields',
    };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (existingUser?.email && !existingUser?.password) {
    return {
      error: 'Email already in use with different provider',
    };
  }

  if (existingUser?.email && !existingUser?.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );

    if (verificationToken) {
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      );
    }

    return { success: 'Confirmation email is sent' };
  }

  if (existingUser?.email && existingUser?.isTwoFactorEnabled) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: 'Invalid two factor code' };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: 'Token has expired' };
      }

      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      if (twoFactorToken) {
        await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);
      }

      return {
        twoFactor: true,
        success: 'Please check your email for the code',
      };
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return { success: 'Login Successful' };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            error: 'Invalid credentials',
          };
        default:
          return {
            error: 'Something went wrong',
          };
      }
    }
    throw error;
  }
};
