'use client';

import { settings } from '@/actions/settings';
import FormError from '@/components/form-error';
import FormSuccess from '@/components/form-success';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCurrentUser } from '@/hooks/use-current-user';
import { SettingsSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserRole } from '@prisma/client';

import { useSession } from 'next-auth/react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const SettingsPage = () => {
  const [successMsg, setSuccessMsg] = useState<string | undefined>('');
  const [errorMsg, setErrorMsg] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();
  const user = useCurrentUser();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      role: user?.role || undefined,
      password: undefined,
      newPassword: undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    setSuccessMsg('');
    setErrorMsg('');

    startTransition(() => {
      settings(values)
        .then((result) => {
          if (result.error) {
            setErrorMsg(result.error);
          }

          if (result.success) {
            update(); // update session
            setSuccessMsg(result.success);
          }
        })
        .catch(() => setErrorMsg('Something went wrong'));
    });
  };

  return (
    <Card className='w-[600px]'>
      <CardHeader>
        <p className='text-center text-2xl font-semibold'>⚙️Settings</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='John Dow'
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {user?.isOAuth === false && (
                <>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='johndow@example.com'
                            disabled={isPending}
                            type='email'
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
                            {...field}
                            placeholder='******'
                            disabled={isPending}
                            type='password'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='newPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='******'
                            disabled={isPending}
                            type='password'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='isTwoFactorEnabled'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                        <div className='space-y-0.5'>
                          <FormLabel className='capitalize'>
                            two factor authentication
                          </FormLabel>
                          <FormDescription>
                            Enable two factor authentication for your account
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            disabled={isPending}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                        <SelectItem value={UserRole.USER}>User</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <FormError message={errorMsg} />
            <FormSuccess message={successMsg} />
            <Button type='submit' disabled={isPending}>
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsPage;
