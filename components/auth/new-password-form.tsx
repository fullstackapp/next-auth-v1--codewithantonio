'use client';

import { useForm } from 'react-hook-form';
import CardWrapper from './card-wrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewPasswordSchema } from '@/schemas';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import FormSuccess from '../form-success';
import FormError from '../form-error';
import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { newPassword } from '@/actions/new-password';

const NewPasswordForm = () => {
  const [successMsg, setSuccessMsg] = useState<string | undefined>('');
  const [errorMsg, setErrorMsg] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setSuccessMsg('');
    setErrorMsg('');

    if (token) {
      startTransition(() => {
        newPassword(values, token).then((result) => {
          setErrorMsg(result?.error);
          setSuccessMsg(result?.success);
        });
      });
    } else {
      setErrorMsg('Missing token');
    }
  };

  return (
    <CardWrapper
      headerLabel='Enter a new password'
      backButtonLabel='Back to login'
      backButtonHref='/auth/login'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='******'
                      type='password'
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={errorMsg} />
          <FormSuccess message={successMsg} />
          <Button type='submit' className='w-full' disabled={isPending}>
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default NewPasswordForm;
