interface HeaderProps {
  label: string;
}

const Header = ({ label }: HeaderProps) => {
  return (
    <div className='flex flex-col items-center justify-center gap-y-4'>
      <h1 className='font-poppins text-3xl font-semibold'>🔐 Auth</h1>
      <p className='text-sm text-muted-foreground'>{label}</p>
    </div>
  );
};

export default Header;
