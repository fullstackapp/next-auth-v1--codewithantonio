'use client';

import { useForm } from 'react-hook-form';
import CardWrapper from './card-wrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/schemas';
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
import { login } from '@/actions/login';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const LoginForm = () => {
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | undefined>('');
  const [errorMsg, setErrorMsg] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider'
      : '';

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      code: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setSuccessMsg('');
    setErrorMsg('');

    startTransition(async () => {
      try {
        const result = await login(values);

        if (result?.twoFactor) {
          setShowTwoFactor(true);
          setSuccessMsg(result.success);
        }

        if (result?.error) {
          setErrorMsg(result.error);
        }

        if (result?.success) {
          setSuccessMsg(result.success);
        }
      } catch {
        setErrorMsg('Something went wrong');
      }
    });
  };

  return (
    <CardWrapper
      headerLabel='Welcome back'
      backButtonLabel="Don't have an account?"
      backButtonHref='/auth/register'
      showSocial={!showTwoFactor}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='john.doe@example.com'
                          type='email'
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      <Button
                        className='px-0 font-normal'
                        size={'sm'}
                        variant={'link'}
                        asChild>
                        <Link href={'/auth/reset'}>Forgot password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {showTwoFactor && (
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='123456'
                        type='text'
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <FormError message={errorMsg || urlError} />
          <FormSuccess message={successMsg} />
          <Button type='submit' className='w-full' disabled={isPending}>
            {showTwoFactor ? 'Confirm' : 'Login'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
