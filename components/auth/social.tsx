'use client';

import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '../ui/button';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { signIn } from 'next-auth/react';

const Social = () => {
  const onClick = (provider: 'google' | 'github') => {
    signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
  };
  return (
    <div className='flex w-full items-center gap-x-2'>
      <Button
        size={'lg'}
        variant={'outline'}
        className='w-full'
        onClick={() => onClick('google')}>
        <FcGoogle className='h-5 w-5' />
      </Button>
      <Button
        size={'lg'}
        variant={'outline'}
        className='w-full'
        onClick={() => onClick('github')}>
        <FaGithub className='h-5 w-5' />
      </Button>
    </div>
  );
};

export default Social;
