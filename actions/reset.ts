'use server';

import { getUserByEmail } from '@/data/user';
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/mail';
import { generatePasswordResetToken } from '@/lib/tokens';
import { ResetSchema } from '@/schemas';
import { z } from 'zod';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: 'Email does not found' };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  if (passwordResetToken) {
    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token,
    );
  }

  return { success: 'Reset email is sent' };
};
