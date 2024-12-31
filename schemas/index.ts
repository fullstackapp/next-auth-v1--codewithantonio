import { UserRole } from '@prisma/client';
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
  code: z.string().optional(),
});

export const RegisterSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(6, { message: 'Minimum 6 characters is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
});

export const ResetSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Minimum 6 characters is required' }),
});

export const SettingsSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }).optional(),
    isTwoFactorEnabled: z.boolean().optional(),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.string().email({ message: 'Email is required' }).optional(),
    password: z
      .string()
      .min(6, { message: 'Minimum 6 characters is required' })
      .optional(),
    newPassword: z
      .string()
      .min(6, { message: 'Minimum 6 characters is required' })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    { message: 'New password is required', path: ['newPassword'] },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    { message: 'Password is required', path: ['password'] },
  );
