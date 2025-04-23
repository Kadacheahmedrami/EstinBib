
import LoginLayout from '@/components/pages/auth/LoginLayout';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      

      <LoginLayout>
        {children}
      </LoginLayout>
      
    </>
  );
}