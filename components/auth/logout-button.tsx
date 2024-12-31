'use client';
import { signOut } from 'next-auth/react';

interface LogoutButtonProps {
  children?: React.ReactNode;
}

const LogoutButton = ({ children }: LogoutButtonProps) => {
  const handleOnClick = () => {
    signOut();
  };

  return <span onClick={handleOnClick}>{children}</span>;
};

export default LogoutButton;
