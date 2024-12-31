import { SessionProvider } from 'next-auth/react';
import Navbar from './_components/navbar';
import { auth } from '@/auth';

export interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <Navbar />
      <div className='flex h-full w-full flex-col items-center justify-center gap-y-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
        {children}
      </div>
    </SessionProvider>
  );
}
