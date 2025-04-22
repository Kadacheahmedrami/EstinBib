
import LoginLayout from '@/components/ui/auth/LoginLayout';

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