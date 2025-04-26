import "./globals.css";
import Header from '@/components/header';

import { getServerAuthSession } from "@/lib/auth";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Estin Bib",
  description: "Estin Bib is the premier library platform for ESTIN students and faculty. Access a vast collection of books, research papers, and educational resources tailored to meet academic needs.",
  keywords: "Estin Bib, ESTIN library, academic resources, books for ESTIN students, research papers, ESTIN Algeria, educational platform, find books, library ESTIN",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();
 
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
  
          <Header session={session} />
          <div className=''></div>
          {children}
          <Toaster />

      </body>
    </html>
  );
}
