/* app/dashboard/ClientDashboardLayout.tsx */
'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Session } from 'next-auth';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { ThemeProvider } from '@/components/theme-provider';

type Props = {
  session: Session;
  children: ReactNode;
};

export default function ClientDashboardLayout({ session, children }: Props) {
  const pathname = usePathname();
  // If path starts with /dashboard, skip rendering header & sidebar
  const hideLayout = pathname.startsWith('/dashboard');

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light">
          {hideLayout ? (
           <div > {children}</div>
          ) : (
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
              <Sidebar userRole={(session.user as any).role} />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header user={session.user} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
              </div>
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
