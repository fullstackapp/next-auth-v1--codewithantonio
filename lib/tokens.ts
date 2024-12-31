import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import crypto from 'crypto';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  // Tokes expires after 1 hour
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    const updatedToken = await db.verificationToken.update({
      where: {
        id: existingToken.id,
      },
      data: {
        token,
        expires,
      },
    });
    return updatedToken;
  } else {
    const verificationToken = await db.verificationToken.create({
      data: {
        email,
        token,
        expires,
      },
    });
    return verificationToken;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  // Tokes expires after 1 hour
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    const updatedToken = await db.passwordResetToken.update({
      where: {
        id: existingToken.id,
      },
      data: {
        token,
        expires,
      },
    });
    return updatedToken;
  } else {
    const passwordResetToken = await db.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });
    return passwordResetToken;
  }
};

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  // Tokes expires after 15 min
  const expires = new Date(new Date().getTime() + 15 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    const updatedToken = await db.twoFactorToken.update({
      where: {
        id: existingToken.id,
      },
      data: {
        token,
        expires,
      },
    });
    return updatedToken;
  } else {
    const twoFactorToken = await db.twoFactorToken.create({
      data: {
        email,
        token,
        expires,
      },
    });
    return twoFactorToken;
  }
};
