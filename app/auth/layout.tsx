
import LoginLayout from '@/components/LoginLayout';

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