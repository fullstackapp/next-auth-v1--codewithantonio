'use client';

import { useForm } from 'react-hook-form';
import CardWrapper from './card-wrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetSchema } from '@/schemas';
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
import { reset } from '@/actions/reset';

const ResetForm = () => {
  const [successMsg, setSuccessMsg] = useState<string | undefined>('');
  const [errorMsg, setErrorMsg] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setSuccessMsg('');
    setErrorMsg('');
    startTransition(() => {
      reset(values).then((result) => {
        setErrorMsg(result?.error);
        setSuccessMsg(result?.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel='Forgot your password?'
      backButtonLabel='Back to login'
      backButtonHref='/auth/login'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
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
          </div>
          <FormError message={errorMsg} />
          <FormSuccess message={successMsg} />
          <Button type='submit' className='w-full' disabled={isPending}>
            Send reset link
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetForm;
